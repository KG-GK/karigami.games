import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Locale } from "./content";

// These files are trusted, version-controlled content, never user-submitted HTML.
export async function legalContent(locale: Locale, kind: "privacy" | "imprint") {
  const source = await readFile(path.join(process.cwd(), "src", "content", `${kind}-${locale}.html`), "utf8");
  const headings: { id: string; title: string }[] = [];
  const html = source.replace(/<h2>(.*?)<\/h2>/g, (_, title: string) => {
    const id = `section-${headings.length + 1}`;
    headings.push({ id, title });
    return `<h2 id="${id}">${title}</h2>`;
  });
  return { html, headings };
}
