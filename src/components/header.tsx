"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand } from "./brand";
import { content, site, type Locale } from "@/lib/content";

export function Header({ locale, alternate }: { locale: Locale; alternate?: string }) {
  const t = content[locale];
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);

  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header">
      <div className="header-inner container">
        <Link className="brand" href={t.home} aria-label={`Karigami — ${locale === "de" ? "Startseite" : "Home"}`}><Brand /></Link>
        <nav className="desktop-nav" aria-label={locale === "de" ? "Hauptnavigation" : "Main navigation"}>
          <Link href={`${t.home}#games`}>Games</Link>
          <Link href={`${t.home}#about`}>{t.aboutNav}</Link>
          <Link href={`${t.home}#support`}>{t.contactNav}</Link>
        </nav>
        <div className="header-actions">
          <a className="language-link" href={alternate ?? t.otherLocale} hrefLang={locale === "de" ? "en" : "de"} aria-label={t.otherLanguage}><span className={locale === "de" ? "active" : ""}>DE</span><span className="language-divider">/</span><span className={locale === "en" ? "active" : ""}>EN</span></a>
          <a className="header-itch" href={site.itch} target="_blank" rel="noopener noreferrer">itch.io <ArrowUpRight size={16} /></a>
          <button className="menu-toggle" ref={toggle} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? t.closeMenu : t.menu}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label={locale === "de" ? "Mobile Navigation" : "Mobile navigation"} hidden={!open}>
        <Link onClick={() => setOpen(false)} href={`${t.home}#games`}>Games <span>01</span></Link>
        <Link onClick={() => setOpen(false)} href={`${t.home}#about`}>{t.aboutNav} <span>02</span></Link>
        <Link onClick={() => setOpen(false)} href={`${t.home}#support`}>{t.contactNav} <span>03</span></Link>
        <a href={site.itch} target="_blank" rel="noopener noreferrer">itch.io <ArrowUpRight size={20} /></a>
      </nav>
    </header>
  </>;
}
