import test, { after, afterEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createElement, act } from "react";
import { createRoot } from "react-dom/client";
import sharp from "sharp";

const dom = new JSDOM("<!doctype html><html><body><div id='test-root'></div></body></html>", { url: "http://localhost/en", pretendToBeVisual: true });
Object.assign(globalThis, {
  window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
  getComputedStyle: dom.window.getComputedStyle.bind(dom.window), IS_REACT_ACT_ENVIRONMENT: true,
});
let reduced = true;
window.matchMedia = (media) => ({ media, matches: reduced, addEventListener() {}, removeEventListener() {} });
// jsdom has no top layer; emulate only the native dialog lifecycle used by React.
dom.window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
dom.window.HTMLDialogElement.prototype.close = function () {
  if (!this.open) return;
  this.open = false;
  this.dispatchEvent(new dom.window.Event("close"));
};
const { ProjectGallery } = await import("../src/components/project-gallery.tsx");
const { currentProjects } = await import("../src/lib/current-projects.ts");
let root;

async function render(locale = "en", projectIndex = 0) {
  const project = currentProjects(locale)[projectIndex];
  root = createRoot(document.getElementById("test-root"));
  await act(() => root.render(createElement(ProjectGallery, { locale, name: project.name, images: project.images })));
}
const thumbnails = () => [...document.querySelectorAll(".current-project-image")];
const dialog = () => document.querySelector("dialog");
async function click(element) { await act(async () => element.click()); }
async function cancel() {
  await act(async () => dialog().dispatchEvent(new dom.window.Event("cancel", { cancelable: true })));
}
afterEach(async () => {
  if (root) await act(() => root.unmount());
  root = undefined;
  reduced = true;
  delete HTMLElement.prototype.animate;
  document.documentElement.removeAttribute("style");
});
after(() => dom.window.close());

test("each of the four Adeltuner cards enlarges on the same page with the correct image and accessible controls", async () => {
  await render();
  assert.equal(thumbnails().length, 4);
  assert.equal(document.querySelectorAll("a").length, 0);
  assert.equal(document.querySelectorAll("button button").length, 0);
  for (const [index, button] of thumbnails().entries()) {
    await click(button);
    assert.equal(dialog().open, true);
    assert.equal(button.getAttribute("aria-expanded"), "true");
    assert.equal(button.getAttribute("aria-controls"), dialog().id);
    assert.equal(document.querySelector(".project-card-enlarged img").alt, currentProjects("en")[0].images[index].alt);
    assert.ok(document.querySelector(".project-card-enlarged img").src.includes(encodeURIComponent(`/assets/projects/adeltuner-${index + 1}.png`)));
    assert.equal(document.activeElement, document.querySelector(".project-card-close"));
    assert.equal(document.documentElement.style.overflow, "hidden");
    assert.equal(window.location.href, "http://localhost/en");
    await click(document.querySelector(".project-card-close"));
    assert.equal(dialog().open, false);
    assert.equal(button.getAttribute("aria-expanded"), "false");
    assert.equal(document.activeElement, button);
  }
});

test("Escape and backdrop clicks close the card; clicking the card itself leaves it open and scroll styles are restored", async () => {
  document.documentElement.style.overflow = "clip";
  document.documentElement.style.scrollbarGutter = "stable both-edges";
  await render();
  await click(thumbnails()[0]);
  await click(document.querySelector(".project-card-enlarged img"));
  assert.equal(dialog().open, true);
  await cancel();
  assert.equal(dialog().open, false);
  assert.equal(document.activeElement, thumbnails()[0]);
  assert.equal(document.documentElement.style.overflow, "clip");
  assert.equal(document.documentElement.style.scrollbarGutter, "stable both-edges");
  await click(thumbnails()[2]);
  await click(dialog());
  assert.equal(dialog().open, false);
  assert.equal(document.activeElement, thumbnails()[2]);
  assert.equal(document.documentElement.style.overflow, "clip");
});

test("opening and closing animate the paper, and repeated close requests cannot start competing animations", async () => {
  reduced = false;
  const calls = [];
  let finishClosing;
  HTMLElement.prototype.animate = function (frames, options) {
    calls.push({ frames, options });
    const finished = calls.length === 2 ? new Promise(resolve => { finishClosing = resolve; }) : Promise.resolve();
    return { finished, cancel() {}, finish() { finishClosing?.(); } };
  };
  await render();
  await click(thumbnails()[0]);
  assert.equal(calls.length, 1);
  assert.match(calls[0].frames[0].transform, /translate\(.+\) rotate\(.+\) scale\(.+\)/);
  assert.equal(calls[0].frames[1].transform, "none");
  await click(document.querySelector(".project-card-close"));
  await cancel();
  await click(dialog());
  assert.equal(calls.length, 2);
  assert.equal(dialog().open, true);
  await act(async () => finishClosing());
  assert.equal(dialog().open, false);
  assert.equal(document.activeElement, thumbnails()[0]);
});

test("reduced motion skips animations and unmounting an open card restores scrolling", async () => {
  HTMLElement.prototype.animate = () => { throw new Error("Reduced motion must not animate"); };
  await render();
  await click(thumbnails()[1]);
  await act(() => root.unmount());
  root = undefined;
  assert.equal(document.documentElement.style.overflow, "");
  assert.equal(document.documentElement.style.scrollbarGutter, "");
});

test("Gravity Puzzle is complete pending release and its card has localized German controls", async () => {
  const project = currentProjects("de").find(project => project.id === "gravity-puzzle");
  assert.equal(project.status, "Spiel fertig · Veröffentlichung offen");
  assert.match(project.description, /Playtests und Freigaben/);
  await render("de", 3);
  assert.equal(thumbnails().length, 1);
  assert.equal(thumbnails()[0].getAttribute("aria-label"), "Gravity Puzzle — Bild vergrößern 1");
  await click(thumbnails()[0]);
  assert.equal(document.querySelector(".project-card-close").getAttribute("aria-label"), "Kärtchen zurücklegen");
  assert.equal(document.querySelector(".project-card-enlarged img").alt, project.images[0].alt);
});

test("all seven project screenshots exist with their declared dimensions", async () => {
  const images = currentProjects("en").flatMap(project => project.images);
  assert.equal(images.length, 7);
  for (const image of images) {
    const actual = await sharp(`public${image.src}`).metadata();
    assert.equal(actual.width, image.width, image.src);
    assert.equal(actual.height, image.height, image.src);
  }
});
