"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";
import { content, type Locale } from "@/lib/content";
import type { ProjectStory } from "@/lib/project-stories";
import { PaperMark } from "./brand";
import { withWaveText } from "./wave-text";

function StoryContent({ story, locale, wave = true }: { story: ProjectStory; locale: Locale; wave?: boolean }) {
  const body = <>
    {(story.images.length > 0 || story.icon) && <div className={`notebook-media ${story.images.length === 0 ? "notebook-media-icon" : ""} ${story.images.length > 1 ? "notebook-gallery" : ""}`}>
      {story.images.map((picture) => <Image key={picture.src} {...picture} alt={picture.alt} sizes="(max-width: 600px) 85vw, 420px" className="notebook-photo" />)}
      {story.icon && <Image {...story.icon} alt={story.icon.alt} className="notebook-icon" sizes={story.images.length ? "64px" : "150px"} />}
    </div>}
    <div className="notebook-copy">{story.paragraphs.map((paragraph, index) => <p key={index}>{paragraph.map((part, partIndex) => part.href
      ? <a key={partIndex} href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>
      : <span key={partIndex}>{part.text}</span>)}</p>)}</div>
    <div className="notebook-page-footer">
      <Asterisk className="notebook-stamp" size={24} strokeWidth={1.2} aria-hidden="true" />
      {story.playUrl && <a className="notebook-play" href={story.playUrl} target="_blank" rel="noopener noreferrer" aria-label={`${content[locale].notePlay}: ${story.title} (itch.io)`}><Play size={13} fill="currentColor" />{content[locale].notePlay}<ArrowUpRight size={16} /></a>}
      {story.stores && <div className="notebook-stores">{story.stores.map((store) => <a key={store.href} href={store.href} target="_blank" rel="noopener noreferrer" aria-label={`${story.title} — ${store.label}`}>{store.label}<ArrowUpRight size={14} /></a>)}</div>}
    </div>
  </>;
  return wave ? withWaveText(body) : body;
}

export function ProjectNotebook({ locale, stories }: { locale: Locale; stories: ProjectStory[] }) {
  const t = content[locale];
  const [{ page, direction }, setPosition] = useState({ page: 0, direction: 1 });
  const cover = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusPage = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const ignoreClickUntil = useRef(0);
  const story = stories[page - 1];

  useEffect(() => {
    if (!focusPage.current) return;
    (page === 0 ? cover.current : heading.current)?.focus({ preventScroll: true });
    focusPage.current = false;
  }, [page]);

  function turn(next: number, focus = false) {
    const destination = Math.max(0, Math.min(stories.length, next));
    if (destination === page) return;
    focusPage.current = focus;
    setPosition({ page: destination, direction: destination > page ? 1 : -1 });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable='true']")) return;
    const destination = { ArrowLeft: page - 1, ArrowRight: page + 1, Home: 0, End: stories.length, Escape: 0 }[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    turn(destination, true);
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    ignoreClickUntil.current = 0;
    if (event.touches.length !== 1 || (event.target as HTMLElement).closest("a, button")) { touch.current = null; return; }
    touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touch.current;
    touch.current = null;
    if (!start || !event.changedTouches[0]) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    // A swipe can produce a synthetic click. Let one gesture turn only one page.
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) ignoreClickUntil.current = Date.now() + 500;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(page + (dx < 0 ? 1 : -1), true);
  }

  function onPaperClick(event: MouseEvent<HTMLDivElement>) {
    if (page === 0 || event.defaultPrevented || event.button !== 0 || event.detail > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target as Element;
    if (!target.closest(".notebook-page") || target.closest("a, button, input, textarea, select, label, [role='button'], [role='link'], [contenteditable='true']")) return;
    if (Date.now() < ignoreClickUntil.current || window.getSelection()?.isCollapsed === false) return;
    turn(page === stories.length ? 0 : page + 1, true);
  }

  return <div className="project-notebook" role="region" aria-label={t.noteCollection} onKeyDown={onKeyDown}>
    <div className="notebook-stack" id="project-notebook-pages" role="presentation" onClick={onPaperClick} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={() => { touch.current = null; }}>
      {page === 0 ? withWaveText(<button key="cover" ref={cover} type="button" className="idea-note notebook-cover" onClick={() => turn(1, true)} aria-label={t.noteOpen}>
        <span className="note-pin" aria-hidden="true" />
        <span className="note-index">NOTES TO SELF — KARIGAMI</span>
        <PaperMark className="note-paper-mark" />
        <span className="notebook-cover-title">{t.note}</span>
        <span className="note-bottom"><span>{t.noteFooter}</span><Asterisk size={22} strokeWidth={1.25} aria-hidden="true" /></span>
      </button>) : <article key={story.id} className="idea-note notebook-page" data-direction={direction} aria-labelledby="notebook-story-title">
        <span className="note-pin" aria-hidden="true" />
        {withWaveText(<>
          <p className="notebook-kicker">{String(page).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}<span>{story.category}</span></p>
          <h3 ref={heading} id="notebook-story-title" tabIndex={-1}>{story.title}</h3>
        </>)}
        <StoryContent story={story} locale={locale} />
      </article>}
      {page === 0 && withWaveText(<span className="about-scribble" aria-hidden="true"><svg width="66" height="52" viewBox="0 0 66 52" fill="none"><path d="M61 44C38 49 22 36 28 24C33 14 45 18 40 27C35 36 12 27 7 6M4 19L7 6L19 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{t.noteHint}</span></span>)}
    </div>
    <div className="notebook-controls">
      <button type="button" onClick={() => turn(page - 1, page === 1)} disabled={page === 0} aria-label={t.notePrevious} aria-controls="project-notebook-pages"><ArrowLeft size={18} /></button>
      <div className="notebook-position">
        {withWaveText(<span className="notebook-counter">{page === 0 ? t.noteStories : `${String(page).padStart(2, "0")} / ${String(stories.length).padStart(2, "0")}`}</span>)}
        <button className="notebook-back" type="button" onClick={() => turn(0, true)} disabled={page === 0}><RotateCcw size={11} />{withWaveText(t.noteBack)}</button>
      </div>
      <button type="button" onClick={() => turn(page + 1, page === 0)} disabled={page === stories.length} aria-label={t.noteNext} aria-controls="project-notebook-pages"><ArrowRight size={18} /></button>
    </div>
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{page === 0 ? t.noteCover : `${t.notePage} ${page} ${t.noteOf} ${stories.length}: ${story.title}`}</span>
    <noscript>
      <div className="notebook-fallback">{stories.map((entry) => <details key={entry.id}><summary>{entry.title}</summary><StoryContent story={entry} locale={locale} wave={false} /></details>)}</div>
    </noscript>
  </div>;
}
