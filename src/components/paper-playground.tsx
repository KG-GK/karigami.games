"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { MoveUpRight } from "lucide-react";
import { useRef, useState, type PointerEvent, type MouseEvent } from "react";
import { content, type Locale } from "@/lib/content";
import { useCatSequence, useThemeWave } from "./theme-provider";
import { withWaveText } from "./wave-text";

export function PaperPlayground({ locale }: { locale: Locale }) {
  const t = content[locale];
  const reduceMotion = useReducedMotion();
  const { stage, advance } = useCatSequence();
  const [transitioning, setTransitioning] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const changingTheme = useRef(false);
  const cycleTheme = useThemeWave();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 85, damping: 18 });
  const rotateY = useSpring(x, { stiffness: 85, damping: 18 });

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || stage === 1 || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 16);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * -12);
  }

  async function changeTheme(event: MouseEvent<HTMLButtonElement>) {
    if (changingTheme.current) return;
    changingTheme.current = true;
    setTransitioning(true);
    x.set(0);
    y.set(0);
    const bounds = event.currentTarget.getBoundingClientRect();
    try {
      const theme = await cycleTheme({ x: bounds.left + bounds.width * .55, y: bounds.top + bounds.height * .5 });
      if (theme) {
        advance("theme");
        setAnnouncement(t.themeNames[theme]);
      }
    } finally {
      changingTheme.current = false;
      setTransitioning(false);
    }
  }

  function changeFont() {
    if (changingTheme.current) return;
    const fonts = ["default", "pixel", "serif"] as const;
    const current = fonts.findIndex((font) => font === document.documentElement.dataset.font);
    const next = fonts[(Math.max(0, current) + 1) % fonts.length];
    document.documentElement.dataset.font = next;
    advance("tail");
    setAnnouncement(t.fontNames[next]);
  }

  const hint = stage === 1 ? t.catFallen : stage === 2 ? t.catRevived : t.catHint;

  return withWaveText(<div className="paper-playground" data-cat-stage={stage} data-cat-pose={stage === 1 ? "lying" : "standing"}>
    <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
    <span className="registration registration-one" aria-hidden="true">+</span><span className="registration registration-two" aria-hidden="true">+</span>
    <span className="playground-coordinate" aria-hidden="true">52°22′ N · 9°44′ E</span>
    <div className="cat-stage" onPointerMove={followPointer} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <motion.span className="cat-tilt" style={reduceMotion ? undefined : { rotateX, rotateY }}>
        <span className="origami-cat">
          <button type="button" className="cat-button" aria-label={t.catLabel} aria-describedby={stage < 3 ? "cat-theme-hint" : undefined} aria-busy={transitioning} disabled={transitioning} onClick={changeTheme} />
          <span className="cat-tail"><button type="button" className="cat-tail-button" aria-label={t.catTailLabel} aria-describedby={stage === 3 ? "cat-tail-hint" : undefined} disabled={transitioning} onClick={changeFont}><span className="cat-tail-front" aria-hidden="true" /><span className="cat-tail-fold" aria-hidden="true" /></button></span>
          <span className="cat-body-art" aria-hidden="true">
            <span className="cat-body" />
            <span className="cat-back-fold" />
            <span className="cat-chest" />
            <span className="cat-haunch" />
            <span className="cat-front-leg" />
            <span className="cat-paw" />
            <span className="cat-head"><span className="cat-face" /><span className="cat-face-fold" /><span className="cat-cheek" /><span className="cat-ear-left" /><span className="cat-ear-right" /><span className="cat-muzzle" /></span>
          </span>
        </span>
      </motion.span>
    </div>
    <span className="cat-shadow" aria-hidden="true" />
    {stage < 4 && (stage === 3 ? <div className="cat-hint cat-hint-tail" id="cat-tail-hint"><span>{t.catTailHint}</span><svg width="54" height="94" viewBox="0 0 54 94" fill="none" aria-hidden="true"><path d="M4 88C40 84 55 53 39 10M31 23L39 10L49 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div> : <div className="cat-hint" id="cat-theme-hint" aria-live="polite" aria-atomic="true"><MoveUpRight size={27} strokeWidth={1.25} aria-hidden="true" /><span>{hint}</span></div>)}
    <span className="sr-only" role="status">{announcement}</span>
    <div className="playground-caption"><span>FIG. 01</span><span>{t.catNote}</span><span aria-hidden="true">↗</span></div>
  </div>);
}
