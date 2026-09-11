"use client";

import Image from "next/image";
import { Expand, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { content, type Locale } from "@/lib/content";
import { withWaveText } from "./wave-text";

type Picture = { src: string; width: number; height: number; alt: string };

function thumbnailTransform(button: HTMLButtonElement, card: HTMLElement) {
  const from = button.getBoundingClientRect();
  const to = card.getBoundingClientRect();
  const angle = getComputedStyle(button).getPropertyValue("--card-angle") || "0deg";
  const x = from.left + from.width / 2 - to.left - to.width / 2;
  const y = from.top + from.height / 2 - to.top - to.height / 2;
  return `translate(${x}px, ${y}px) rotate(${angle}) scale(${button.offsetWidth / (to.width || 1)}, ${button.offsetHeight / (to.height || 1)})`;
}

export function ProjectGallery({ name, images, locale }: { name: string; images: Picture[]; locale: Locale }) {
  const t = content[locale];
  const id = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const card = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
  const picture = selected === null ? null : images[selected];

  useEffect(() => {
    if (selected === null || !dialog.current || !card.current || !trigger.current) return;
    const modal = dialog.current;
    const paper = card.current;
    const source = trigger.current;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    modal.showModal();
    closeButton.current?.focus({ preventScroll: true });
    closing.current = false;

    if (!reducedMotion.matches && typeof paper.animate === "function") {
      animation.current = paper.animate(
        [{ transform: thumbnailTransform(source, paper) }, { transform: "none" }],
        { duration: 420, easing: "cubic-bezier(.22,.75,.25,1)", fill: "both" },
      );
      animation.current.finished.catch(() => undefined);
    }
    const finishMotion = () => { if (reducedMotion.matches) animation.current?.finish(); };
    reducedMotion.addEventListener("change", finishMotion);

    return () => {
      animation.current?.cancel();
      animation.current = null;
      reducedMotion.removeEventListener("change", finishMotion);
      if (modal.open) modal.close();
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
      if (source.isConnected) source.focus({ preventScroll: true });
    };
  }, [selected]);

  async function close() {
    if (closing.current || !dialog.current?.open) return;
    closing.current = true;
    const paper = card.current;
    const source = trigger.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paper && source && !reducedMotion && typeof paper.animate === "function") {
      // Preserve the current position even if the opening animation is still running.
      const currentTransform = getComputedStyle(paper).transform;
      animation.current?.cancel();
      animation.current = paper.animate(
        [{ transform: currentTransform }, { transform: thumbnailTransform(source, paper) }],
        { duration: 280, easing: "cubic-bezier(.4,0,.6,1)", fill: "both" },
      );
      await animation.current.finished.catch(() => undefined);
    }
    if (dialog.current?.open) dialog.current.close();
  }

  return withWaveText(<>
    <div className={`current-project-gallery${images.length > 1 ? " current-project-gallery-stack" : ""}${images.length > 2 ? " current-project-gallery-many" : ""}`}>
      {images.map((image, index) => <button key={image.src} type="button" className="current-project-image" aria-label={`${name} — ${t.currentViewImage} ${index + 1}`} aria-haspopup="dialog" aria-controls={id} aria-expanded={selected === index} onClick={(event) => { trigger.current = event.currentTarget; setSelected(index); }}>
        <Image {...image} alt={image.alt} sizes={images.length > 2 ? "140px" : "(max-width: 700px) 144px, 176px"} />
        <span className="current-project-expand" aria-hidden="true"><Expand size={12} strokeWidth={1.5} /></span>
      </button>)}
    </div>
    <dialog ref={dialog} id={id} className="project-card-dialog" aria-labelledby={`${id}-title`} onCancel={(event) => { event.preventDefault(); void close(); }} onClick={(event) => { if (event.target === event.currentTarget) void close(); }} onClose={() => setSelected(null)}>
      {picture && <figure ref={card} className="project-card-enlarged">
        <Image {...picture} alt={picture.alt} sizes="(max-width: 948px) calc(100vw - 72px), 876px" loading="eager" />
        <figcaption><span id={`${id}-title`}>{name} · {(selected ?? 0) + 1} / {images.length}</span><button ref={closeButton} type="button" className="project-card-close" aria-label={t.currentCloseImage} onClick={() => { void close(); }}><X size={20} strokeWidth={1.5} aria-hidden="true" /></button></figcaption>
      </figure>}
    </dialog>
  </>);
}
