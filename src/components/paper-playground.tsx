"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { MoveUpRight } from "lucide-react";
import { useRef, useState, type PointerEvent, type MouseEvent } from "react";
import { content, type Locale } from "@/lib/content";
import { useThemeWave } from "./theme-provider";
import { withWaveText } from "./wave-text";

export function PaperPlayground({ locale }: { locale: Locale }) {
  const t = content[locale];
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const changingTheme = useRef(false);
  const cycleTheme = useThemeWave();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 85, damping: 18 });
  const rotateY = useSpring(x, { stiffness: 85, damping: 18 });

  function followPointer(event: PointerEvent<HTMLButtonElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 16);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * -12);
  }

  async function changeTheme(event: MouseEvent<HTMLButtonElement>) {
    if (changingTheme.current) return;
    changingTheme.current = true;
    const bounds = event.currentTarget.querySelector(".origami-cat")!.getBoundingClientRect();
    try {
      if (!reduceMotion) setPlaying(true);
      const theme = await cycleTheme({ x: bounds.left + bounds.width * .55, y: bounds.top + bounds.height * .5 });
      if (theme) setAnnouncement(t.themeNames[theme]);
    } finally {
      changingTheme.current = false;
    }
  }

  const animatePlay = playing && !reduceMotion;

  return withWaveText(<div className="paper-playground">
    <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
    <span className="registration registration-one" aria-hidden="true">+</span><span className="registration registration-two" aria-hidden="true">+</span>
    <span className="playground-coordinate" aria-hidden="true">52°22′ N · 9°44′ E</span>
    <button className="cat-button" aria-label={t.catLabel} aria-describedby="cat-theme-hint" onClick={changeTheme} onPointerMove={followPointer} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <motion.span className="cat-tilt" style={reduceMotion ? undefined : { rotateX, rotateY }}>
        <motion.span className="origami-cat" aria-hidden="true" initial={false} animate={animatePlay ? { y: [0, 3, -13, 0, -4, 0], scaleY: [1, 0.97, 1.025, 1, 1.01, 1] } : { y: 0, scaleY: 1 }} transition={{ duration: 1.05, ease: "easeInOut" }} onAnimationComplete={() => setPlaying(false)}>
          <motion.span className="cat-tail" initial={false} animate={{ rotate: animatePlay ? [0, -9, 7, -5, 0] : 0 }} transition={{ duration: 1.05, ease: "easeInOut" }}><span className="cat-tail-front" /><span className="cat-tail-fold" /></motion.span>
          <span className="cat-body" />
          <span className="cat-back-fold" />
          <span className="cat-chest" />
          <span className="cat-haunch" />
          <span className="cat-front-leg" />
          <span className="cat-paw" />
          <motion.span className="cat-head" initial={false} animate={{ rotate: animatePlay ? [0, -8, -8, 3, 0] : 0 }} transition={{ duration: 1.05, ease: "easeInOut" }}><span className="cat-face" /><span className="cat-face-fold" /><span className="cat-cheek" /><span className="cat-ear-left" /><span className="cat-ear-right" /><span className="cat-muzzle" /></motion.span>
        </motion.span>
      </motion.span>
    </button>
    <span className="cat-shadow" aria-hidden="true" />
    <div className="cat-hint" id="cat-theme-hint"><MoveUpRight size={27} strokeWidth={1.25} /><span>{t.catHint}</span></div>
    <span className="sr-only" role="status">{announcement}</span>
    <div className="playground-caption"><span>FIG. 01</span><span>{t.catNote}</span><span aria-hidden="true">↗</span></div>
  </div>);
}
