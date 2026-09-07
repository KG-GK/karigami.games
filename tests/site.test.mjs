import test from "node:test";
import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("both homepages render the games, accessible navigation, and correct language without client JS", async () => {
  for (const [route, language, headline] of [["/", "de", "Kleine Games."], ["/en", "en", "Little games."]]) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${language}"`));
    assert.ok(html.includes(headline));
    assert.match(html, /id="main"/);
    assert.match(html, /id="games"/);
    assert.match(html, /id="about"/);
    assert.match(html, /id="support"/);
    assert.match(html, /aria-controls="mobile-navigation"/);
    assert.match(html, /https:\/\/karigami\.itch\.io\//);
    assert.match(html, /id6760602813/);
    assert.match(html, /id6769060279/);
    assert.match(html, /mailto:contact@karigami\.games/);
    assert.match(html, /property="og:image"/);
    assert.ok(html.includes(`rel="canonical" href="https://www.karigami.games${route === "/" ? "" : route}"`) || html.includes(`rel="canonical" href="https://www.karigami.games${route}"`));
  }
});

test("all existing App Store legal links and language entry points keep working", async () => {
  const redirects = [
    ["/index.html", "/"],
    ["/impressum.html", "/impressum"],
    ["/datenschutz.html", "/datenschutz"],
    ["/englisch/", "/en"],
    ["/englisch/index.html", "/en"],
    ["/englisch/imprint.html", "/en/imprint"],
    ["/englisch/privacy.html", "/en/privacy"],
  ];
  for (const [oldPath, newPath] of redirects) {
    const redirect = await fetch(`${base}${oldPath}`, { redirect: "manual" });
    assert.equal(redirect.status, 308, oldPath);
    const resolved = await fetch(`${base}${oldPath}`);
    assert.equal(resolved.status, 200, oldPath);
    assert.equal(new URL(resolved.url).pathname, newPath);
  }
});

test("legal pages preserve identity and app disclosures and use the correct locale and hosting", async () => {
  for (const [route, lang] of [["/impressum", "de"], ["/datenschutz", "de"], ["/en/imprint", "en"], ["/en/privacy", "en"]]) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.match(html, /Kaan Gevrek/);
    assert.match(html, /Daimlerstraße 6B/);
    assert.match(html, /30165 Hannover/);
    assert.match(html, /name="robots" content="noindex, follow"/);
    assert.match(html, /id="section-1"/);
    if (route.includes("datenschutz") || route.includes("privacy")) {
      assert.match(html, /Google AdMob/);
      assert.match(html, /Vercel/);
      assert.doesNotMatch(html, /GitHub Pages/);
      assert.doesNotMatch(html, /ergänze hier|add the provider/);
    }
  }
});

test("AdMob verification file remains exact and public assets resolve", async () => {
  const ads = await fetch(`${base}/app-ads.txt`);
  assert.equal(ads.status, 200);
  assert.equal((await ads.text()).trim(), "google.com, pub-4056612842763503, DIRECT, f08c47fec0942fa0");
  for (const asset of ["/assets/Pocketwars_widget.png", "/assets/ThrustHammer_widget.png", "/assets/Apple_logo_black.png", "/assets/logo.svg", "/og.png"]) {
    const response = await fetch(`${base}${asset}`);
    assert.equal(response.status, 200, asset);
    assert.match(response.headers.get("content-type"), /^image\//);
  }
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  assert.match(sitemap, /https:\/\/www.karigami.games\/en/);
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  assert.match(robots, /Sitemap: https:\/\/www.karigami.games\/sitemap.xml/);
});

test("unknown routes return a real 404", async () => {
  for (const route of ["/this-page-does-not-exist", "/en/this-page-does-not-exist"]) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 404);
  }
});
