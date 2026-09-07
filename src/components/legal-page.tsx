import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { content, type Locale } from "@/lib/content";
import { legalContent } from "@/lib/legal";
import { Header } from "./header";
import { Footer } from "./footer";

export async function LegalPage({ locale, kind }: { locale: Locale; kind: "privacy" | "imprint" }) {
  const t = content[locale];
  const alternateContent = content[locale === "de" ? "en" : "de"];
  const alternate = kind === "privacy" ? alternateContent.privacyPath : alternateContent.imprintPath;
  const { html, headings } = await legalContent(locale, kind);

  return <><Header locale={locale} alternate={alternate} /><main id="main" className="legal-page container"><Link className="text-link back-link" href={t.home}><ArrowRight size={17} />{t.back}</Link><div className="legal-grid"><aside className="legal-aside"><p className="eyebrow">{t.legalLabel}</p><nav aria-label={t.contents}>{headings.map(({ id, title }) => <a key={id} href={`#${id}`}>{title}</a>)}</nav></aside><article className="legal-content" dangerouslySetInnerHTML={{ __html: html }} /></div></main><Footer locale={locale} /></>;
}
