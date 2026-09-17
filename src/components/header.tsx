"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLink } from "./brand-link";
import { withWaveText } from "./wave-text";
import { content, socialLinks, type Locale } from "@/lib/content";

export function Header({ locale, alternate }: { locale: Locale; alternate?: string }) {
  const t = content[locale];
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const [linksOpen, setLinksOpen] = useState(false);
  const linksContainer = useRef<HTMLDivElement>(null);
  const linksToggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!linksOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!linksContainer.current?.contains(event.target as Node)) setLinksOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setLinksOpen(false); linksToggle.current?.focus(); }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [linksOpen]);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);

  return withWaveText(<>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header">
      <div className="header-inner container">
        <BrandLink locale={locale} onActivate={() => { setOpen(false); setLinksOpen(false); }} />
        <nav className="desktop-nav" aria-label={locale === "de" ? "Hauptnavigation" : "Main navigation"}>
          <Link href={`${t.home}#games`}>Games</Link>
          <Link href={`${t.home}#current-projects`}>{t.currentNav}</Link>
          <Link href={`${t.home}#about`}>{t.aboutNav}</Link>
          <Link href={`${t.home}#support`}>{t.contactNav}</Link>
        </nav>
        <div className="header-actions">
          <a className="language-link" href={alternate ?? t.otherLocale} hrefLang={locale === "de" ? "en" : "de"} aria-label={t.otherLanguage}><span className={locale === "de" ? "active" : ""}>DE</span><span className="language-divider">/</span><span className={locale === "en" ? "active" : ""}>EN</span></a>
          <div className="header-links" ref={linksContainer} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setLinksOpen(false);
          }}>
            <button type="button" className="header-links-toggle" ref={linksToggle} onClick={() => setLinksOpen(!linksOpen)} aria-expanded={linksOpen} aria-controls="social-links" aria-label={t.socialLinks}>Links <ChevronDown size={16} aria-hidden="true" /></button>
            <nav id="social-links" className="header-links-dropdown" aria-label={t.socialLinks} hidden={!linksOpen}>
              {socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => setLinksOpen(false)}>{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}
            </nav>
          </div>
          <button className="menu-toggle" ref={toggle} onClick={() => { setOpen(!open); setLinksOpen(false); }} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? t.closeMenu : t.menu}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label={locale === "de" ? "Mobile Navigation" : "Mobile navigation"} hidden={!open}>
        <Link onClick={() => setOpen(false)} href={`${t.home}#games`}>Games <span>01</span></Link>
        <Link onClick={() => setOpen(false)} href={`${t.home}#current-projects`}>{t.currentNav} <span>02</span></Link>
        <Link onClick={() => setOpen(false)} href={`${t.home}#about`}>{t.aboutNav} <span>03</span></Link>
        <Link onClick={() => setOpen(false)} href={`${t.home}#support`}>{t.contactNav} <span>04</span></Link>
        {socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={20} aria-hidden="true" /></a>)}
      </nav>
    </header>
  </>);
}
