import test, { after, afterEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createElement, act } from "react";
import { createRoot } from "react-dom/client";

const dom = new JSDOM("<!doctype html><html><body><div id='test-root'></div></body></html>", { url: "http://localhost/en", pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, self: dom.window, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
let reduced = false;
let scrolls = [];
window.matchMedia = (media) => ({ media, matches: reduced, addEventListener() {}, removeEventListener() {} });
window.scrollTo = (options) => { scrolls.push(options); };
const { BrandProvider } = await import("../src/components/brand-state.tsx");
const { BrandLink } = await import("../src/components/brand-link.tsx");
const { Header } = await import("../src/components/header.tsx");
let root;
const layout = () => document.querySelector(".brand-art")?.dataset.brandLayout;
const logo = () => document.querySelector(".site-header .brand-link");
function page(locale = "en") {
  return createElement(BrandProvider, null, createElement(Header, { locale }), createElement(BrandLink, { locale }));
}
async function render(locale = "en", pathname = "/en") {
  window.history.replaceState({ test: true }, "", pathname);
  root = createRoot(document.getElementById("test-root"));
  await act(() => root.render(page(locale)));
}
async function click(target = logo(), modifiers = {}) {
  // Suppress jsdom's unrelated native navigation after React handles the link.
  document.addEventListener("click", event => event.preventDefault(), { once: true });
  await act(() => target.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...modifiers })));
}
afterEach(async () => { if (root) await act(() => root.unmount()); root = undefined; reduced = false; scrolls = []; });
after(() => dom.window.close());

test("logo clicks cycle all four references, keep both logos in sync, and always return to the top", async () => {
  await render();
  assert.equal(layout(), "horizontal");
  for (const expected of ["between", "above", "split", "horizontal", "between"]) {
    await click();
    assert.equal(layout(), expected);
    assert.ok([...document.querySelectorAll(".brand-art")].every(mark => mark.dataset.brandLayout === expected));
    assert.equal(window.location.pathname, "/en");
    assert.equal(window.location.hash, "#top");
    assert.deepEqual(scrolls.at(-1), { top: 0, left: 0, behavior: "smooth" });
    assert.deepEqual(window.history.state, { test: true });
  }
  assert.equal(scrolls.length, 5);
  assert.equal(document.querySelectorAll(".brand-visual img").length, 2);
});

test("modified clicks preserve normal link behavior and do not alter the current page or logo", async () => {
  await render();
  for (const modifiers of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) await click(logo(), modifiers);
  assert.equal(layout(), "horizontal");
  assert.equal(scrolls.length, 0);
  assert.equal(logo().getAttribute("href"), "/en#top");
});

test("legal pages point to the localized homepage top and the layout survives navigation", async () => {
  await render("de", "/datenschutz");
  assert.equal(logo().getAttribute("href"), "/#top");
  await click();
  assert.equal(layout(), "between");
  assert.equal(scrolls.length, 0);
  await act(() => root.render(createElement(BrandProvider, null, null)));
  window.history.replaceState(null, "", "/#top");
  await act(() => root.render(page("de")));
  assert.equal(layout(), "between");
  await click();
  assert.equal(layout(), "above");
  assert.equal(scrolls.length, 1);
});

test("activating the logo closes the mobile menu and reduced motion jumps directly to the top", async () => {
  reduced = true;
  await render();
  await click(document.querySelector(".menu-toggle"));
  assert.equal(document.querySelector("#mobile-navigation").hidden, false);
  await click();
  assert.equal(document.querySelector("#mobile-navigation").hidden, true);
  assert.equal(scrolls[0].behavior, "instant");
  assert.match(logo().getAttribute("aria-label"), /homepage/);
  assert.equal(logo().querySelector(":scope > .brand-art > .sr-only").textContent, "karigami");
});

test("header links disclose all profiles and dismiss with Escape, outside clicks, and focus leaving", async () => {
  await render("de", "/");
  const toggle = document.querySelector(".header-links-toggle");
  const dropdown = document.getElementById("social-links");
  assert.equal(dropdown.hidden, true);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  await click(toggle);
  assert.equal(dropdown.hidden, false);
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  const links = [...dropdown.querySelectorAll("a")];
  assert.deepEqual(links.map(link => link.href), [
    "https://www.youtube.com/@Karigami-i9l",
    "https://www.instagram.com/karigami_games/?utm_source=ig_web_button_share_sheet",
    "https://karigami.itch.io/",
  ]);
  for (const link of links) {
    assert.equal(link.target, "_blank");
    assert.equal(link.rel, "noopener noreferrer");
  }
  await act(() => links[0].focus());
  assert.equal(dropdown.hidden, false);
  await act(() => document.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
  assert.equal(dropdown.hidden, true);
  assert.equal(document.activeElement, toggle);
  await click(toggle);
  await act(() => document.body.dispatchEvent(new dom.window.Event("pointerdown", { bubbles: true })));
  assert.equal(dropdown.hidden, true);
  await click(toggle);
  await act(() => links[0].focus());
  await act(() => document.querySelector(".language-link").focus());
  assert.equal(dropdown.hidden, true);
});

test("both locales expose the same profiles in the mobile menu and close it after selection", async () => {
  for (const locale of ["de", "en"]) {
    await render(locale);
    await click(document.querySelector(".menu-toggle"));
    const mobile = document.getElementById("mobile-navigation");
    const profiles = [...mobile.querySelectorAll('a[target="_blank"]')];
    assert.equal(mobile.hidden, false);
    assert.equal(profiles.length, 3);
    assert.deepEqual(profiles.map(link => link.href), [...document.querySelectorAll("#social-links a")].map(link => link.href));
    await click(profiles[0]);
    assert.equal(mobile.hidden, true);
    await act(() => root.unmount());
    root = undefined;
  }
});
