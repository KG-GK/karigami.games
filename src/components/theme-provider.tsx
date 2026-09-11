"use client";

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import { glyphDelay, glyphDuration, nextFont, nextTheme, themeBackgrounds, themeStorageKey, waveDuration, waveGeometry } from "@/lib/theme.mjs";

type Theme = keyof typeof themeBackgrounds;
type Origin = { x: number; y: number };
type ChangeTheme = (origin: Origin) => Promise<Theme | null>;
type Font = "default" | "pixel" | "serif";
type ChangeFont = (origin: Origin) => Promise<Font | null>;
type StyleChange = { kind: "theme" | "font"; apply: () => void; prepare?: () => Promise<unknown> };
const ThemeContext = createContext<ChangeTheme | null>(null);
const FontContext = createContext<ChangeFont | null>(null);
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
  const disposed = useRef(false);

  useEffect(() => {
    disposed.current = false;
    const current = document.documentElement.dataset.theme as Theme;
    if (current in themeBackgrounds) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeBackgrounds[current]);
    return () => {
      disposed.current = true;
      activeTransition.current?.skipTransition();
      animations.current.forEach((animation) => animation.cancel());
      delete document.documentElement.dataset.themeTransition;
      delete document.documentElement.dataset.themeWave;
      delete document.documentElement.dataset.styleWaveKind;
    };
  }, []);

  const runWave = useCallback(async (origin: Origin, change: StyleChange) => {
    if (busy.current) return false;
    busy.current = true;
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stopMotion: (() => void) | undefined;

    try {
      if (change.prepare) await change.prepare();
      if (disposed.current) return false;
      if (reducedMotion.matches || !document.startViewTransition || typeof root.animate !== "function" || document.hidden) {
        change.apply();
        return true;
      }

      const wave = waveGeometry(origin, innerWidth, innerHeight);
      root.style.setProperty("--wave-x", `${wave.x}px`);
      root.style.setProperty("--wave-y", `${wave.y}px`);
      root.style.setProperty("--wave-radius", `${wave.radius}px`);
      root.style.setProperty("--wave-duration", `${waveDuration}ms`);
      root.dataset.themeTransition = "active";
      root.dataset.styleWaveKind = change.kind;

      const apply = () => { if (!disposed.current) change.apply(); };
      const transition = document.startViewTransition(apply);
      activeTransition.current = transition;
      // Attach rejection handlers immediately: a background tab or resize can skip capture.
      const finished = transition.finished.catch(() => undefined);
      transition.updateCallbackDone.catch(apply);

      stopMotion = () => {
        if (!reducedMotion.matches) return;
        transition.skipTransition();
        animations.current.forEach((animation) => animation.cancel());
      };
      reducedMotion.addEventListener("change", stopMotion);

      try {
        await transition.ready;
        if (reducedMotion.matches || disposed.current) { transition.skipTransition(); return !disposed.current; }

        // A font change can move and rewrap text, so measure the new layout.
        const glyphs = visibleGlyphs(wave);

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
        apply();
        transition.skipTransition();
      }
      await finished;
      return !disposed.current;
    } catch {
      if (!disposed.current) change.apply();
      activeTransition.current?.skipTransition();
      return !disposed.current;
    } finally {
      if (stopMotion) reducedMotion.removeEventListener("change", stopMotion);
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
      activeTransition.current = null;
      delete root.dataset.themeTransition;
      delete root.dataset.themeWave;
      delete root.dataset.styleWaveKind;
      for (const property of ["--wave-x", "--wave-y", "--wave-radius", "--wave-duration"]) root.style.removeProperty(property);
      busy.current = false;
    }
  }, []);

  const cycleTheme = useCallback<ChangeTheme>(async (origin) => {
    const theme = nextTheme(document.documentElement.dataset.theme ?? "paper") as Theme;
    return await runWave(origin, { kind: "theme", apply: () => applyTheme(theme) }) ? theme : null;
  }, [runWave]);

  const cycleFont = useCallback<ChangeFont>(async (origin) => {
    const font = nextFont(document.documentElement.dataset.font ?? "default") as Font;
    const families = { default: ["Manrope Variable", "DM Sans Variable"], pixel: ["Pixelify Sans Variable"], serif: ["Times New Roman"] }[font];
    const applied = await runWave(origin, {
      kind: "font",
      prepare: async () => {
        if (document.fonts?.load) await Promise.allSettled(families.flatMap((family) => [400, 700].map((weight) => document.fonts.load(`${weight} 16px "${family}"`))));
      },
      apply: () => { document.documentElement.dataset.font = font; },
    });
    return applied ? font : null;
  }, [runWave]);

  return <ThemeContext.Provider value={cycleTheme}><FontContext.Provider value={cycleFont}><CatSequenceContext.Provider value={{ stage: catStage, advance: advanceCat }}>{children}</CatSequenceContext.Provider></FontContext.Provider><div className="theme-wave-ring" aria-hidden="true" /></ThemeContext.Provider>;
}

export function useThemeWave() {
  const changeTheme = useContext(ThemeContext);
  if (!changeTheme) throw new Error("useThemeWave must be used inside ThemeProvider");
  return changeTheme;
}

export function useFontWave() {
  const changeFont = useContext(FontContext);
  if (!changeFont) throw new Error("useFontWave must be used inside ThemeProvider");
  return changeFont;
}

export function useCatSequence() {
  const sequence = useContext(CatSequenceContext);
  if (!sequence) throw new Error("useCatSequence must be used inside ThemeProvider");
  return sequence;
}
