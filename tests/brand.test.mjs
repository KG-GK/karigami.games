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
