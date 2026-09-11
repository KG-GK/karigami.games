import test, { after, afterEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createElement, act } from "react";
import { createRoot } from "react-dom/client";

const dom = new JSDOM("<!doctype html><html><head><meta name='theme-color' content='#f7f5ef'></head><body><div id='test-root'></div></body></html>", { url: "http://localhost", pretendToBeVisual: true });
Object.assign(globalThis, {
  window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
  Element: dom.window.Element, SVGElement: dom.window.SVGElement, localStorage: dom.window.localStorage,
  innerWidth: 1280, innerHeight: 800, IS_REACT_ACT_ENVIRONMENT: true,
  requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
});
let reduced = false;
window.matchMedia = (media) => ({ media, matches: reduced, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
const { PaperPlayground } = await import("../src/components/paper-playground.tsx");
const { ThemeProvider } = await import("../src/components/theme-provider.tsx");
const { glyphDelay, waveGeometry } = await import("../src/lib/theme.mjs");
let root;

async function render(locale = "en") {
  document.documentElement.dataset.theme = "paper";
  delete document.documentElement.dataset.font;
  localStorage.clear();
  root = createRoot(document.getElementById("test-root"));
  await act(() => root.render(createElement(ThemeProvider, null, createElement(PaperPlayground, { locale }))));
}
async function click(selector) { await act(async () => { document.querySelector(selector).click(); }); }
function stage() { return document.querySelector(".paper-playground").dataset.catStage; }
function pose() { return document.querySelector(".paper-playground").dataset.catPose; }
function hint() { return document.querySelector(".cat-hint .sr-only")?.textContent; }

afterEach(async () => {
  if (root) await act(() => root.unmount());
  root = undefined;
  reduced = false;
  delete document.startViewTransition;
  delete document.documentElement.animate;
  delete HTMLElement.prototype.animate;
  delete document.fonts;
});
after(() => dom.window.close());

test("three body clicks reveal the fallen cat, revival, and tail hint alongside the three themes", async () => {
  await render();
  assert.equal(hint(), "Curious? Try clicking!");
  assert.equal(pose(), "standing");
  await click(".cat-button");
  assert.equal(document.documentElement.dataset.theme, "ink");
  assert.equal(pose(), "lying");
  assert.equal(hint(), "Curiosity killed the cat.");
  await click(".cat-button");
  assert.equal(document.documentElement.dataset.theme, "red");
  assert.equal(pose(), "standing");
  assert.equal(hint(), "Just kidding.");
  await click(".cat-button");
  assert.equal(document.documentElement.dataset.theme, "paper");
  assert.equal(stage(), "3");
  assert.equal(pose(), "standing");
  assert.equal(document.getElementById("cat-theme-hint"), null);
  assert.equal(hint(), "Maybe try clicking the tail");
  assert.equal(document.querySelector(".cat-tail-button").getAttribute("aria-describedby"), "cat-tail-hint");
  for (const theme of ["ink", "red", "paper", "ink"]) {
    await click(".cat-button");
    assert.equal(document.documentElement.dataset.theme, theme);
    assert.equal(stage(), "3");
    assert.equal(pose(), "standing");
    assert.equal(hint(), "Maybe try clicking the tail");
  }
});

test("discovering the tail after its hint permanently removes both text and arrow while themes and fonts keep cycling", async () => {
  await render();
  for (let i = 0; i < 3; i++) await click(".cat-button");
  assert.ok(document.querySelector("#cat-tail-hint svg"));
  await click(".cat-tail-button");
  assert.equal(stage(), "4");
  assert.equal(document.querySelector(".cat-hint"), null);
  assert.equal(document.querySelector(".cat-button").getAttribute("aria-describedby"), null);
  assert.equal(document.querySelector(".cat-tail-button").getAttribute("aria-describedby"), null);

  for (const [theme, font] of [["ink", "serif"], ["red", "default"], ["paper", "pixel"], ["ink", "serif"]]) {
    await click(".cat-button");
    assert.equal(pose(), "standing");
    assert.equal(document.querySelector(".cat-hint"), null);
    await click(".cat-tail-button");
    assert.equal(document.documentElement.dataset.theme, theme);
    assert.equal(document.documentElement.dataset.font, font);
    assert.equal(stage(), "4");
    assert.equal(document.querySelector(".cat-hint"), null);
  }
});

test("navigation preserves the cat sequence, while a new document starts it again", async () => {
  await render();
  await click(".cat-button");
  await click(".cat-button");
  // Remove the homepage while retaining the root layout, as a client navigation does.
  await act(() => root.render(createElement(ThemeProvider, null, null)));
  await act(() => root.render(createElement(ThemeProvider, null, createElement(PaperPlayground, { locale: "en" }))));
  assert.equal(stage(), "2");
  assert.equal(hint(), "Just kidding.");
  await click(".cat-button");
  await click(".cat-tail-button");
  await act(() => root.render(createElement(ThemeProvider, null, null)));
  await act(() => root.render(createElement(ThemeProvider, null, createElement(PaperPlayground, { locale: "en" }))));
  await click(".cat-button");
  assert.equal(stage(), "4");
  assert.equal(pose(), "standing");
  assert.equal(document.querySelector(".cat-hint"), null);
  await act(() => root.unmount());
  await render();
  assert.equal(stage(), "0");
  assert.equal(hint(), "Curious? Try clicking!");
  await click(".cat-button");
  assert.equal(pose(), "lying");
});

test("the tail is a separate native button from the start and cycles every font without changing theme or pose", async () => {
  await render();
  const tail = document.querySelector(".cat-tail-button");
  assert.equal(tail.disabled, false);
  assert.equal(tail.closest("[aria-hidden='true']"), null);
  assert.equal(document.querySelectorAll("button button").length, 0);
  for (const font of ["pixel", "serif", "default", "pixel"]) {
    await click(".cat-tail-button");
    assert.equal(document.documentElement.dataset.font, font);
    assert.equal(document.documentElement.dataset.theme, "paper");
    assert.equal(stage(), "0");
    assert.equal(pose(), "standing");
  }
  assert.equal(hint(), "Curious? Try clicking!");
});

test("font selection is independent of the body sequence, including the lying pose", async () => {
  await render();
  await click(".cat-tail-button");
  await click(".cat-button");
  assert.equal(pose(), "lying");
  assert.equal(document.documentElement.dataset.font, "pixel");
  await click(".cat-tail-button");
  assert.equal(document.documentElement.dataset.font, "serif");
  assert.equal(document.documentElement.dataset.theme, "ink");
  assert.equal(stage(), "1");
  await click(".cat-button");
  assert.equal(hint(), "Just kidding.");
  assert.equal(document.documentElement.dataset.font, "serif");
});

test("rapid clicks cannot skip a story beat or change fonts while a theme wave is running", async () => {
  await render();
  let reveal;
  const ready = new Promise((resolve) => { reveal = resolve; });
  document.documentElement.animate = () => ({ finished: Promise.resolve(), cancel() {} });
  document.startViewTransition = (update) => {
    update();
    return { ready, finished: Promise.resolve(), updateCallbackDone: Promise.resolve(), skipTransition() { reveal(); } };
  };
  await click(".cat-button");
  assert.equal(document.querySelector(".cat-button").disabled, true);
  assert.equal(document.querySelector(".cat-tail-button").disabled, true);
  await click(".cat-button");
  await click(".cat-tail-button");
  assert.equal(stage(), "0");
  assert.equal(document.documentElement.dataset.font, undefined);
  await act(async () => { reveal(); });
  assert.equal(stage(), "1");
  assert.equal(document.documentElement.dataset.theme, "ink");
  assert.equal(document.querySelector(".cat-tail-button").disabled, false);
  assert.equal(document.documentElement.dataset.themeTransition, undefined);
});

test("German hints and font announcements are localized, including with reduced motion", async () => {
  reduced = true;
  await render("de");
  await click(".cat-button");
  assert.equal(pose(), "lying");
  assert.equal(hint(), "Neugier ist der Katze Tod.");
  await click(".cat-button");
  assert.equal(hint(), "Nur ein Scherz.");
  await click(".cat-button");
  assert.equal(hint(), "Versuch’s mal mit dem Schwanz");
  await click(".cat-tail-button");
  assert.equal(document.querySelector("[role='status']").textContent, "Pixel-Schrift aktiviert.");
  assert.equal(document.querySelector(".cat-hint"), null);
});

test("the font wave starts at the tail, measures glyphs after reflow, and locks out theme changes", async () => {
  await render();
  const origin = { x: 760, y: 430 };
  document.querySelector(".cat-tail-origin").getBoundingClientRect = () => ({ left: origin.x, top: origin.y, width: 0, height: 0 });
  const glyph = document.querySelector(".cat-hint .wave-glyph");
  const text = glyph.closest("[data-wave-text]");
  const rect = { left: 100, top: 100, right: 300, bottom: 120, width: 200, height: 20 };
  text.getBoundingClientRect = () => rect;
  text.getClientRects = () => [rect];
  glyph.getBoundingClientRect = () => {
    const x = document.documentElement.dataset.font === "pixel" ? 500 : 20;
    return { x, y: 100, width: 10, height: 10, left: x, right: x + 10, top: 100, bottom: 110 };
  };
  let finishReveal;
  const animations = [];
  HTMLElement.prototype.animate = function (frames, options) {
    animations.push({ element: this, frames, options });
    return { finished: this === document.documentElement ? new Promise(resolve => { finishReveal = resolve; }) : Promise.resolve(), cancel() {} };
  };
  document.startViewTransition = (update) => {
    update();
    return { ready: Promise.resolve(), finished: Promise.resolve(), updateCallbackDone: Promise.resolve(), skipTransition() { finishReveal?.(); } };
  };
  await click(".cat-tail-button");
  assert.equal(document.documentElement.dataset.font, "pixel");
  assert.equal(document.documentElement.dataset.theme, "paper");
  assert.equal(document.documentElement.dataset.styleWaveKind, "font");
  assert.equal(document.documentElement.style.getPropertyValue("--wave-x"), "760px");
  const reveal = animations.find(item => item.element === document.documentElement);
  assert.equal(reveal.frames.clipPath[0], "circle(0px at 760px 430px)");
  assert.equal(animations.find(item => item.element === glyph).options.delay, glyphDelay({ x: 505, y: 105 }, waveGeometry(origin, 1280, 800)));
  await click(".cat-button");
  await click(".cat-tail-button");
  assert.equal(document.documentElement.dataset.theme, "paper");
  assert.equal(document.documentElement.dataset.font, "pixel");
  assert.equal(stage(), "0");
  await act(async () => finishReveal());
  assert.equal(document.querySelector(".cat-tail-button").disabled, false);
  assert.equal(document.documentElement.dataset.styleWaveKind, undefined);
  assert.equal(document.documentElement.style.getPropertyValue("--wave-x"), "");
});

test("font files load before capture and blocked extra clicks cannot skip a font", async () => {
  await render();
  let fontsReady;
  const pendingFonts = new Promise(resolve => { fontsReady = resolve; });
  const loads = [];
  Object.defineProperty(document, "fonts", { configurable: true, value: { load: (font) => { loads.push(font); return pendingFonts; } } });
  await click(".cat-tail-button");
  assert.equal(document.documentElement.dataset.font, undefined);
  assert.equal(loads.length, 2);
  assert.ok(loads.every(font => font.includes("Pixelify Sans Variable")));
  assert.equal(document.querySelector(".cat-button").disabled, true);
  await click(".cat-tail-button");
  await act(async () => fontsReady([]));
  assert.equal(document.documentElement.dataset.font, "pixel");
  assert.equal(document.querySelector(".cat-button").disabled, false);
});

test("a rejected font-wave capture still applies the chosen font and releases the controls", async () => {
  await render();
  document.documentElement.animate = () => { throw new Error("Capture should fail first"); };
  document.startViewTransition = (update) => {
    update();
    return { ready: Promise.reject(new Error("Capture skipped")), finished: Promise.resolve(), updateCallbackDone: Promise.resolve(), skipTransition() {} };
  };
  await click(".cat-tail-button");
  assert.equal(document.documentElement.dataset.font, "pixel");
  assert.equal(document.documentElement.dataset.theme, "paper");
  assert.equal(document.querySelector(".cat-tail-button").disabled, false);
  assert.equal(document.documentElement.dataset.themeTransition, undefined);
});
