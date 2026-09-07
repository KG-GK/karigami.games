import test, { after, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { createElement, act } from "react";
import { createRoot } from "react-dom/client";

const dom = new JSDOM("<!doctype html><html><body><div id='test-root'></div></body></html>", { url: "http://localhost", pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { ProjectNotebook } = await import("../src/components/project-notebook.tsx");
const { projectStories } = await import("../src/lib/project-stories.ts");
const { content } = await import("../src/lib/content.ts");
let root;

async function render(locale = "en") {
  root = createRoot(document.getElementById("test-root"));
  await act(() => root.render(createElement(ProjectNotebook, { locale, stories: projectStories(locale) })));
}
async function click(selector) {
  const target = document.querySelector(selector);
  assert.ok(target, `Missing control: ${selector}`);
  await act(() => typeof target.click === "function" ? target.click() : target.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true })));
}
async function key(value) {
  await act(() => document.querySelector(".project-notebook").dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: value, bubbles: true })));
}
async function swipe(dx, dy) {
  const target = document.querySelector(".notebook-page");
  await act(() => {
    for (const [name, points] of [["touchstart", { touches: [{ clientX: 150, clientY: 150 }] }], ["touchend", { changedTouches: [{ clientX: 150 + dx, clientY: 150 + dy }] }]]) {
      const event = new dom.window.Event(name, { bubbles: true });
      Object.assign(event, points);
      target.dispatchEvent(event);
    }
  });
}
function title() { return document.querySelector("#notebook-story-title .sr-only")?.textContent; }

afterEach(async () => { window.getSelection().removeAllRanges(); if (root) await act(() => root.unmount()); root = undefined; });
after(() => dom.window.close());

test("the cover opens the first anecdote and moves focus to its heading", async () => {
  await render();
  assert.equal(document.querySelector(".notebook-controls > button:first-child").disabled, true);
  await click(".notebook-cover");
  assert.equal(title(), "Mice Rise");
  assert.equal(document.activeElement.id, "notebook-story-title");
  assert.equal(document.querySelectorAll(".notebook-page img").length, 2);
  assert.equal(document.querySelector(".notebook-play").href, "https://karigami.itch.io/micerise-prototype");
  assert.match(document.querySelector("[role='status']").textContent, /Page 1 of 8: Mice Rise/);
});

test("all eight anecdotes can be reached in order with the correct media and actions", async () => {
  await render();
  const expected = [
    ["Mice Rise", 2, 1, 0], ["CreatorStudio", 1, 0, 0], ["Dungeon Forge", 1, 0, 0],
    ["Bullet Rhapsody", 1, 1, 0], ["PocketWars", 1, 0, 2], ["BoostHammer", 1, 0, 2],
    ["AuraFarmer", 3, 0, 0], ["Your Crew is a useless bunch", 1, 1, 0],
  ];
  for (const [name, pictures, play, stores] of expected) {
    await click(".notebook-controls > button:last-child");
    assert.equal(title(), name);
    assert.equal(document.querySelectorAll(".notebook-page img").length, pictures, name);
    assert.equal(document.querySelectorAll(".notebook-play").length, play, name);
    assert.equal(document.querySelectorAll(".notebook-page .notebook-stores a").length, stores, name);
  }
  assert.equal(document.querySelector(".notebook-controls > button:last-child").disabled, true);
  const links = [...document.querySelectorAll(".notebook-page .notebook-copy a")].map((link) => link.href);
  assert.deepEqual(links, ["https://zerotwopac.itch.io/", "https://itch.io/jam/brackeys-16/rate/4951915"]);
  await click(".notebook-controls > button:first-child");
  assert.equal(title(), "AuraFarmer");
});

test("clicking images, text, or paper advances one story and the final sheet returns to the cover", async () => {
  await render();
  await click(".notebook-cover");
  await click(".notebook-page .notebook-photo");
  assert.equal(title(), "CreatorStudio");
  await click(".notebook-page .notebook-icon");
  assert.equal(title(), "Dungeon Forge");
  await click(".notebook-page .notebook-copy .wave-glyph");
  assert.equal(title(), "Bullet Rhapsody");
  await click(".notebook-page");
  assert.equal(title(), "PocketWars");
  await key("End");
  await click(".notebook-page");
  assert.equal(document.activeElement, document.querySelector(".notebook-cover"));
});

test("play links, their SVG icons, story credits, and both store links do not turn the page", async () => {
  await render();
  await click(".notebook-cover");
  async function follow(selector, expectedTitle) {
    // Prevent external navigation after the paper's bubbling handler has run.
    const preventNavigation = (event) => event.preventDefault();
    document.addEventListener("click", preventNavigation, { once: true });
    try { await click(selector); } finally { document.removeEventListener("click", preventNavigation); }
    assert.equal(title(), expectedTitle);
  }
  await follow(".notebook-play", "Mice Rise");
  await follow(".notebook-play svg", "Mice Rise");
  await key("End");
  await follow(".notebook-page .notebook-copy a:first-of-type", "Your Crew is a useless bunch");
  await follow(".notebook-page .notebook-copy a:last-of-type", "Your Crew is a useless bunch");
  await key("ArrowLeft");
  await key("ArrowLeft");
  await key("ArrowLeft");
  await follow(".notebook-page .notebook-stores a:first-child", "PocketWars");
  await follow(".notebook-page .notebook-stores a:last-child", "PocketWars");
});

test("selecting text, modified clicks, and clicking outside the sheet leave it open", async () => {
  await render();
  await click(".notebook-cover");
  const range = document.createRange();
  range.selectNodeContents(document.querySelector(".notebook-page .notebook-copy p"));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  assert.equal(window.getSelection().isCollapsed, false);
  await click(".notebook-page .notebook-copy .wave-glyph");
  assert.equal(title(), "Mice Rise");
  window.getSelection().removeAllRanges();
  await act(() => document.querySelector(".notebook-page").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, ctrlKey: true })));
  assert.equal(title(), "Mice Rise");
  await click(".notebook-stack");
  assert.equal(title(), "Mice Rise");
});

test("keyboard navigation respects both ends and Escape returns focus to the cover", async () => {
  await render();
  await key("ArrowLeft");
  assert.ok(document.querySelector(".notebook-cover"));
  await key("End");
  assert.equal(title(), "Your Crew is a useless bunch");
  await key("ArrowRight");
  assert.equal(title(), "Your Crew is a useless bunch");
  await key("ArrowLeft");
  assert.equal(title(), "AuraFarmer");
  await key("Home");
  assert.equal(document.activeElement, document.querySelector(".notebook-cover"));
  await key("ArrowRight");
  await key("Escape");
  assert.equal(document.activeElement, document.querySelector(".notebook-cover"));
});

test("horizontal swipes turn a page while vertical scrolling leaves the page alone", async () => {
  await render();
  await click(".notebook-cover");
  await swipe(-90, 8);
  assert.equal(title(), "CreatorStudio");
  await click(".notebook-page");
  assert.equal(title(), "CreatorStudio", "A synthetic click after a swipe must not skip a second page");
  await swipe(-60, 110);
  assert.equal(title(), "CreatorStudio");
  await click(".notebook-page");
  assert.equal(title(), "CreatorStudio", "Scrolling must not turn a page through a synthetic click");
  await swipe(90, 5);
  assert.equal(title(), "Mice Rise");
});

test("the German notebook uses localized controls, status, and story text", async () => {
  await render("de");
  assert.equal(document.querySelector(".notebook-cover").getAttribute("aria-label"), "Projektgeschichten aufblättern");
  await click(".notebook-cover");
  assert.match(document.querySelector(".notebook-copy").textContent, /Mein allererstes Spiel/);
  assert.match(document.querySelector("[role='status']").textContent, /Seite 1 von 8/);
  assert.equal(document.querySelector(".notebook-controls > button:last-child").getAttribute("aria-label"), "Nächste Seite");
});

test("the notebook has no nested buttons or links and all outbound URLs are intact", async () => {
  await render();
  assert.equal(document.querySelectorAll("button button, button a, a button, a a").length, 0);
  for (const locale of ["de", "en"]) {
    assert.equal(projectStories(locale).length, 8);
    for (const story of projectStories(locale)) {
      for (const url of [story.playUrl, ...(story.stores ?? []).map((store) => store.href)].filter(Boolean)) {
        assert.equal(new URL(url).protocol, "https:");
        assert.ok(!url.endsWith(","));
      }
    }
  }
  assert.equal(content.en.explore, "Explore games");
  assert.equal(content.en.meet, "Learn about me");
});

test("all nine original story images exist with the declared aspect ratios", () => {
  const images = projectStories("en").flatMap((story) => [...story.images, ...(story.icon ? [story.icon] : [])]).filter((picture) => picture.src.startsWith("/assets/stories/"));
  assert.equal(images.length, 9);
  for (const picture of images) {
    const data = readFileSync(new URL(`../public${picture.src}`, import.meta.url));
    assert.equal(data.subarray(1, 4).toString(), "PNG", picture.src);
    assert.equal(data.readUInt32BE(16), picture.width, picture.src);
    assert.equal(data.readUInt32BE(20), picture.height, picture.src);
  }
});
