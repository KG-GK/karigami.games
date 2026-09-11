"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { content, type Locale } from "@/lib/content";
import { Brand } from "./brand";
import { useBrandLayout } from "./brand-state";

export function BrandLink({ locale, onActivate }: { locale: Locale; onActivate?: () => void }) {
  const t = content[locale];
  const { layout, cycle } = useBrandLayout();
  const href = `${t.home}#top`;

  function activate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    cycle();
    onActivate?.();
    const pathname = window.location.pathname.replace(/\/$/, "");
    if (pathname === t.home.replace(/\/$/, "")) {
      // A repeated click on the current route must still scroll to the very top.
      event.preventDefault();
      window.history.replaceState(window.history.state, "", href);
      window.scrollTo({ top: 0, left: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }

  return <Link className="brand brand-link" href={href} aria-label={t.brandHome} onClick={activate}><Brand layout={layout} /></Link>;
}
