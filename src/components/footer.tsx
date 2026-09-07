import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { withWaveText } from "./wave-text";
import { content, site, type Locale } from "@/lib/content";

export function Footer({ locale }: { locale: Locale }) {
  const t = content[locale];
  return withWaveText(<footer className="site-footer container">
    <div className="footer-top"><Link className="brand" href={t.home}><Brand /></Link><p>{t.footerLine}</p><a href={site.itch} target="_blank" rel="noopener noreferrer">itch.io <ArrowUpRight size={16} /></a></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Karigami · Kaan Gevrek</span><nav aria-label={locale === "de" ? "Rechtliche Informationen" : "Legal information"}><Link href={t.imprintPath}>{t.imprint}</Link><Link href={t.privacyPath}>{t.privacy}</Link><a href={`mailto:${site.email}`}>{t.contactNav}</a></nav><span className="footer-location"><span className="status-dot" />Hannover, DE</span></div>
  </footer>);
}
