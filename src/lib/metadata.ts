import type { Metadata, Viewport } from "next";
import { content, site, type Locale } from "./content";

export function siteMetadata(locale: Locale): Metadata {
  const t = content[locale];
  const title = locale === "de" ? "Karigami — Kleine Games. Große Spielfreude." : "Karigami — Little games. Big on play.";
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: "%s — Karigami" },
    description: t.intro,
    applicationName: site.name,
    authors: [{ name: site.author }],
    alternates: { canonical: t.home, languages: { de: "/", en: "/en", "x-default": "/" } },
    openGraph: { type: "website", siteName: site.name, title, description: t.intro, url: t.home, locale: locale === "de" ? "de_DE" : "en_GB", alternateLocale: locale === "de" ? "en_GB" : "de_DE", images: [{ url: `${site.url}/og.png`, width: 1731, height: 908, alt: "Karigami — Kleine Games. Große Spielfreude." }] },
    twitter: { card: "summary_large_image", title, description: t.intro, images: [`${site.url}/og.png`] },
    icons: { icon: "/assets/logo.svg", apple: "/assets/logo.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#f7f5ef", colorScheme: "light" };

export function legalMetadata(locale: Locale, kind: "privacy" | "imprint"): Metadata {
  const t = content[locale];
  const path = kind === "privacy" ? t.privacyPath : t.imprintPath;
  const languages = kind === "privacy" ? { de: "/datenschutz", en: "/en/privacy" } : { de: "/impressum", en: "/en/imprint" };
  return {
    title: t[kind],
    robots: { index: false, follow: true },
    alternates: { canonical: path, languages },
    openGraph: { title: `${t[kind]} — Karigami`, url: path },
  };
}
