import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import { themes, nextTheme, waveGeometry, glyphDelay, waveDuration, themeBootScript } from "../src/lib/theme.mjs";

test("cat clicks cycle white → black → red → white repeatedly", () => {
  let theme = "paper";
  const sequence = Array.from({ length: 9 }, () => (theme = nextTheme(theme)));
  assert.deepEqual(sequence, ["ink", "red", "paper", "ink", "red", "paper", "ink", "red", "paper"]);
  assert.equal(nextTheme("invalid-saved-value"), "ink");
});

test("the radial reveal covers all four corners at desktop and mobile sizes", () => {
  for (const [width, height] of [[1440, 900], [390, 844], [320, 568]]) {
    for (const origin of [{ x: width * .75, y: height / 2 }, { x: 0, y: height }, { x: width, y: 0 }, { x: width + 20, y: -10 }]) {
      const wave = waveGeometry(origin, width, height);
      assert.ok(wave.x >= 0 && wave.x <= width && wave.y >= 0 && wave.y <= height);
      for (const [x, y] of [[0, 0], [width, 0], [0, height], [width, height]]) {
        assert.ok(Math.hypot(x - wave.x, y - wave.y) < wave.radius);
      }
    }
  }
});

test("letters shake when the expanding circle reaches them, regardless of direction", () => {
  const wave = { x: 700, y: 400, radius: 1000 };
  assert.equal(glyphDelay({ x: 700, y: 400 }, wave), 0);
  for (const point of [{ x: 1200, y: 400 }, { x: 200, y: 400 }, { x: 700, y: 900 }]) {
    assert.equal(glyphDelay(point, wave), waveDuration / 2);
  }
  assert.equal(glyphDelay({ x: 1700, y: 400 }, wave), waveDuration);
  assert.ok(glyphDelay({ x: 800, y: 400 }, wave) < glyphDelay({ x: 1000, y: 400 }, wave));
});

test("the pre-paint script restores only valid themes and tolerates unavailable storage", () => {
  for (const saved of [...themes, "corrupted", null]) {
    const document = { documentElement: { dataset: { theme: "paper" } } };
    vm.runInNewContext(themeBootScript, { document, localStorage: { getItem: () => saved } });
    assert.equal(document.documentElement.dataset.theme, themes.includes(saved) ? saved : "paper");
  }
  const document = { documentElement: { dataset: { theme: "paper" } } };
  assert.doesNotThrow(() => vm.runInNewContext(themeBootScript, { document, localStorage: { getItem() { throw new Error("Storage denied"); } } }));
  assert.equal(document.documentElement.dataset.theme, "paper");
});

test("all palette variables are defined in each theme, including cat facets and controls", async () => {
  const css = await readFile(new URL("../src/app/themes.css", import.meta.url), "utf8");
  const palette = (selector) => {
    const body = css.split(selector)[1].split("}")[0];
    return Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [key, value]));
  };
  const palettes = [palette(":root {"), palette(':root[data-theme="ink"] {'), palette(':root[data-theme="red"] {')];
  const expectedKeys = Object.keys(palettes[0]).sort();
  for (const colors of palettes) assert.deepEqual(Object.keys(colors).sort(), expectedKeys);
  assert.equal(new Set(palettes.map((colors) => colors["--cat-base"])).size, 3);
  assert.equal(new Set(palettes.map((colors) => colors["--paper"])).size, 3);
});
