"use client";

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import { glyphDelay, glyphDuration, nextTheme, themeBackgrounds, themeStorageKey, waveDuration, waveGeometry } from "@/lib/theme.mjs";

type Theme = keyof typeof themeBackgrounds;
type Origin = { x: number; y: number };
type ChangeTheme = (origin: Origin) => Promise<Theme | null>;
const ThemeContext = createContext<ChangeTheme | null>(null);
type CatTrigger = "theme" | "tail";
const CatSequenceContext = createContext<{ stage: number; advance: (trigger: CatTrigger) => void } | null>(null);

function advanceCatSequence(stage: number, trigger: CatTrigger) {
  // 0: invitation, 1: fallen, 2: revived, 3: tail hint, 4: finished until reload.
  if (trigger === "tail") return stage === 3 ? 4 : stage;
  return stage < 3 ? stage + 1 : stage;
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeBackgrounds[theme]);
  try { localStorage.setItem(themeStorageKey, theme); } catch { /* The theme still works with storage blocked. */ }
}

function visibleGlyphs(wave: ReturnType<typeof waveGeometry>) {
  const glyphs: { element: HTMLElement; delay: number; direction: number }[] = [];
  // Read all geometry before starting any animations to avoid layout thrashing.
  for (const text of document.querySelectorAll<HTMLElement>("[data-wave-text]")) {
    const bounds = text.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight || bounds.right < 0 || bounds.left > innerWidth || !text.getClientRects().length) continue;
    for (const element of text.querySelectorAll<HTMLElement>(".wave-glyph")) {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) continue;
      glyphs.push({ element, delay: glyphDelay({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, wave), direction: glyphs.length % 2 ? -1 : 1 });
    }
  }
  return glyphs;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The root layout preserves this state when navigating away from the homepage.
  const [catStage, advanceCat] = useReducer(advanceCatSequence, 0);
  const busy = useRef(false);
  const animations = useRef<Animation[]>([]);
  const activeTransition = useRef<ViewTransition | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme as Theme;
    if (current in themeBackgrounds) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeBackgrounds[current]);
    return () => {
      activeTransition.current?.skipTransition();
      animations.current.forEach((animation) => animation.cancel());
      delete document.documentElement.dataset.themeTransition;
      delete document.documentElement.dataset.themeWave;
    };
  }, []);

  const cycleTheme = useCallback<ChangeTheme>(async (origin) => {
    if (busy.current) return null;
    busy.current = true;
    const root = document.documentElement;
    const theme = nextTheme(root.dataset.theme ?? "paper") as Theme;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stopMotion: (() => void) | undefined;

    try {
      if (reducedMotion.matches || !document.startViewTransition || typeof root.animate !== "function" || document.hidden) {
        applyTheme(theme);
        return theme;
      }

      const wave = waveGeometry(origin, innerWidth, innerHeight);
      const glyphs = visibleGlyphs(wave);
      root.style.setProperty("--wave-x", `${wave.x}px`);
      root.style.setProperty("--wave-y", `${wave.y}px`);
      root.style.setProperty("--wave-radius", `${wave.radius}px`);
      root.style.setProperty("--wave-duration", `${waveDuration}ms`);
      root.dataset.themeTransition = "active";

      const transition = document.startViewTransition(() => applyTheme(theme));
      activeTransition.current = transition;
      // Attach rejection handlers immediately: a background tab or resize can skip capture.
      const finished = transition.finished.catch(() => undefined);
      transition.updateCallbackDone.catch(() => applyTheme(theme));

      stopMotion = () => {
        if (!reducedMotion.matches) return;
        transition.skipTransition();
        animations.current.forEach((animation) => animation.cancel());
      };
      reducedMotion.addEventListener("change", stopMotion);

      try {
        await transition.ready;
        if (reducedMotion.matches) { transition.skipTransition(); return theme; }

        const reveal = root.animate(
          { clipPath: [`circle(0px at ${wave.x}px ${wave.y}px)`, `circle(${wave.radius}px at ${wave.x}px ${wave.y}px)`] },
          { duration: waveDuration, easing: "linear", fill: "forwards", pseudoElement: "::view-transition-new(root)" },
        );
        animations.current.push(reveal);
        root.dataset.themeWave = "running";

        for (const { element, delay, direction } of glyphs) {
          animations.current.push(element.animate([
            { left: "0px", top: "0px", offset: 0 },
            { left: `${1.5 * direction}px`, top: "-1px", offset: .2 },
            { left: `${-1.5 * direction}px`, top: "1px", offset: .4 },
            { left: `${direction}px`, top: "-.6px", offset: .6 },
            { left: `${-.6 * direction}px`, top: ".3px", offset: .8 },
            { left: "0px", top: "0px", offset: 1 },
          ], { duration: glyphDuration, delay, easing: "linear" }));
        }

        await Promise.allSettled(animations.current.map((animation) => animation.finished));
      } catch {
        // Capture and animation support vary; never leave the user between themes.
        applyTheme(theme);
        transition.skipTransition();
      }
      await finished;
      return theme;
    } catch {
      applyTheme(theme);
      activeTransition.current?.skipTransition();
      return theme;
    } finally {
      if (stopMotion) reducedMotion.removeEventListener("change", stopMotion);
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
      activeTransition.current = null;
      delete root.dataset.themeTransition;
      delete root.dataset.themeWave;
      for (const property of ["--wave-x", "--wave-y", "--wave-radius", "--wave-duration"]) root.style.removeProperty(property);
      busy.current = false;
    }
  }, []);

  return <ThemeContext.Provider value={cycleTheme}><CatSequenceContext.Provider value={{ stage: catStage, advance: advanceCat }}>{children}</CatSequenceContext.Provider><div className="theme-wave-ring" aria-hidden="true" /></ThemeContext.Provider>;
}

export function useThemeWave() {
  const changeTheme = useContext(ThemeContext);
  if (!changeTheme) throw new Error("useThemeWave must be used inside ThemeProvider");
  return changeTheme;
}

export function useCatSequence() {
  const sequence = useContext(CatSequenceContext);
  if (!sequence) throw new Error("useCatSequence must be used inside ThemeProvider");
  return sequence;
}
