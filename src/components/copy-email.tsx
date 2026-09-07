"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { content, site, type Locale } from "@/lib/content";

export function CopyEmail({ locale }: { locale: Locale }) {
  const t = content[locale];
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try { await navigator.clipboard.writeText(site.email); setStatus("copied"); }
    catch { setStatus("failed"); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 3500);
  }

  return <div className="copy-email-wrap"><button className="copy-email" onClick={copy} aria-label={t.copy} title={t.copy}>{status === "copied" ? <Check size={22} /> : <Copy size={22} />}</button><span className="copy-status" role="status">{status === "copied" ? t.copied : status === "failed" ? t.copyFailed : ""}</span></div>;
}
