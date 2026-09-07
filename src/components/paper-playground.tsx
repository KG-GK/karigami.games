"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { MoveUpRight } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { content, type Locale } from "@/lib/content";

export function PaperPlayground({ locale }: { locale: Locale }) {
  const t = content[locale];
  const reduceMotion = useReducedMotion();
  const [flying, setFlying] = useState(false);
  const [flown, setFlown] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 85, damping: 18 });
  const rotateY = useSpring(x, { stiffness: 85, damping: 18 });

  function followPointer(event: PointerEvent<HTMLButtonElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 24);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * -24);
  }

  function launch() {
    if (flying) return;
    setFlown(true);
    if (!reduceMotion) setFlying(true);
  }

  return <div className="paper-playground">
    <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
    <span className="registration registration-one" aria-hidden="true">+</span><span className="registration registration-two" aria-hidden="true">+</span>
    <span className="playground-coordinate" aria-hidden="true">52°22′ N · 9°44′ E</span>
    <button className="plane-button" aria-label={t.flightLabel} onClick={launch} onPointerMove={followPointer} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <motion.span className="plane-tilt" style={reduceMotion ? undefined : { rotateX, rotateY }}>
        <motion.span className="paper-plane" initial={false} animate={flying ? { x: [0, -18, 360, -240, 0], y: [0, 12, -280, 120, 0], rotate: [-12, -17, -25, -12, -12], opacity: [1, 1, 0, 0, 1], scale: [1, 0.97, 0.7, 0.8, 1] } : { x: 0, y: 0, rotate: -12, opacity: 1, scale: 1 }} transition={{ duration: 1.35, times: [0, 0.16, 0.47, 0.49, 1], ease: "easeInOut" }} onAnimationComplete={() => setFlying(false)}>
          <span className="plane-wing-left" /><span className="plane-fold" /><span className="plane-wing-right" /><span className="plane-keel" />
        </motion.span>
      </motion.span>
    </button>
    <span className="plane-shadow" aria-hidden="true" />
    <div className="flight-hint"><MoveUpRight size={27} strokeWidth={1.25} /><span aria-live="polite">{flown ? t.flightDone : t.flight}</span></div>
    <div className="playground-caption"><span>FIG. 01</span><span>{t.flightNote}</span><span aria-hidden="true">↗</span></div>
  </div>;
}
