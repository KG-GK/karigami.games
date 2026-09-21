import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { withWaveText } from "../src/components/wave-text.tsx";

test("selecting animated text preserves the original text once, including links and whitespace", () => {
  const text = "Schöne Welten — Games, stories & Spaß!";
  const markup = renderToStaticMarkup(withWaveText(createElement("p", null,
    text, " ", createElement("a", { href: "https://karigami.itch.io/" }, "Mehr auf itch.io"), "\nWeiter geht’s.",
  )));
  const dom = new JSDOM(markup);
  try {
    const { document } = dom.window;
    const paragraph = document.querySelector("p");
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    dom.window.getSelection().addRange(range);
    assert.equal(dom.window.getSelection().toString(), `${text} Mehr auf itch.io\nWeiter geht’s.`);
    // Rich-text clipboard fragments must not hide the pasted content or include a duplicate.
    const fragment = range.cloneContents();
    assert.equal(fragment.querySelector('[aria-hidden="true"], .sr-only'), null);
    assert.equal(fragment.querySelector("a").textContent, "Mehr auf itch.io");
    assert.equal(fragment.querySelector("a").href, "https://karigami.itch.io/");
    assert.ok(paragraph.querySelectorAll(".wave-glyph").length > 0);
  } finally {
    dom.window.close();
  }
});

test("partial selections span animated characters without copying the whole paragraph", () => {
  const dom = new JSDOM(renderToStaticMarkup(withWaveText(createElement("p", null, "Games. Worlds. Stories"))));
  try {
    const { document } = dom.window;
    const glyphs = document.querySelectorAll(".wave-glyph");
    const range = document.createRange();
    range.setStart(glyphs[7].firstChild, 0);
    range.setEnd(glyphs[11].firstChild, 1);
    dom.window.getSelection().addRange(range);
    assert.equal(dom.window.getSelection().toString(), "orlds");
  } finally {
    dom.window.close();
  }
});
