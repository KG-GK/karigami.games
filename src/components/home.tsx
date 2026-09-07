import Image from "next/image";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Asterisk, Mail, Smartphone } from "lucide-react";
import { content, gameData, site, type Locale } from "@/lib/content";
import { Header } from "./header";
import { Footer } from "./footer";
import { PaperMark } from "./brand";
import { PaperPlayground } from "./paper-playground";
import { CopyEmail } from "./copy-email";

export function Home({ locale }: { locale: Locale }) {
  const t = content[locale];
  return <>
    <Header locale={locale} />
    <main id="main">
      <section className="hero container" aria-labelledby="hero-heading">
        <div className="hero-main">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" />{t.eyebrow}</p>
            <h1 id="hero-heading"><span>{t.headline[0]}</span><span className="hero-accent">{t.headline[1]}<br />{t.headline[2]}</span></h1>
            <p className="hero-description">{t.intro}</p>
            <div className="hero-links"><a className="button button-primary" href="#games">{t.explore}<ArrowDownRight size={20} /></a><a className="text-link" href="#about">{t.meet}<ArrowUpRight size={17} /></a></div>
          </div>
          <PaperPlayground locale={locale} />
        </div>
        <div className="hero-bottom"><span className="eyebrow">{t.location}</span><a className="eyebrow" href="#games">{t.scroll}<ArrowDown size={16} /></a></div>
      </section>

      <div className="manifesto-strip" aria-hidden="true"><div className="container">{t.strip.map((item) => <span key={item}><Asterisk size={25} strokeWidth={1.4} />{item}</span>)}</div></div>

      <section id="games" className="games-section container section-space" aria-labelledby="games-heading">
        <div className="section-heading"><div><p className="eyebrow section-label">{t.gamesLabel}</p><h2 id="games-heading">{t.gamesTitle}</h2></div><p className="section-intro">{t.gamesIntro}</p></div>
        <div className="games-grid">{gameData(locale).map((game) => <article className={`game-card ${game.id}`} key={game.id}>
          <a className="game-art" href={game.url} target="_blank" rel="noopener noreferrer" aria-label={`${game.name} — ${t.appStore}`}>
            <div className="game-art-meta"><span>GAME / {game.number}</span><span>iOS <ArrowUpRight size={14} /></span></div>
            <div className="game-image-wrap"><Image src={game.image} alt={game.name === "PocketWars" ? (locale === "de" ? "Rote und schwarze Spielfiguren von PocketWars" : "Red and black PocketWars playing pieces") : (locale === "de" ? "Der raketengetriebene Hammer aus ThrustHammer" : "The rocket-powered hammer from ThrustHammer")} width={500} height={500} sizes="(max-width: 600px) 65vw, 290px" /></div>
            <div className="game-art-bottom"><span>{game.subtitle}</span><span className="game-art-arrow"><ArrowUpRight size={22} /></span></div>
          </a>
          <div className="game-details"><div className="game-title-row"><h3>{game.name}</h3><span className="platform-label"><Smartphone size={14} /> MOBILE</span></div><p>{game.description}</p><div className="game-actions"><a className="store-link" href={game.url} target="_blank" rel="noopener noreferrer"><Image src="/assets/Apple_logo_black.png" width={17} height={20} alt="" />{t.appStore}<ArrowUpRight size={16} /></a><span className="android-note"><span />{t.androidSoon}</span></div></div>
        </article>)}</div>
        <div className="itch-callout"><div className="itch-callout-copy"><span className="itch-asterisk" aria-hidden="true"><Asterisk size={37} strokeWidth={1.3} /></span><p><strong>{t.itchHeading}</strong> {t.itchDescription}</p></div><a className="text-link" href={site.itch} target="_blank" rel="noopener noreferrer">{t.itchCta}<ArrowUpRight size={19} /></a></div>
      </section>

      <section id="about" className="about-section" aria-labelledby="about-heading"><div className="container about-grid">
        <div className="about-art"><p className="eyebrow">{t.aboutLabel}</p><div className="idea-note"><span className="note-pin" /><span className="note-index">NOTE TO SELF — 001</span><PaperMark className="note-paper-mark" /><p>{t.note}</p><div className="note-bottom"><span>{t.noteFooter}</span><Asterisk size={22} strokeWidth={1.25} /></div></div><span className="about-scribble" aria-hidden="true">stay curious.</span></div>
        <div className="about-copy"><h2 id="about-heading">{t.aboutTitle}<span className="hello-asterisk" aria-hidden="true">✳</span></h2><p className="about-lead">{t.aboutLead}</p><p>{t.aboutBody}</p><p>{t.aboutEnd}</p><div className="signature"><span>Kaan.</span><span className="eyebrow">{t.maker}</span></div></div>
      </div></section>

      <section id="support" className="contact-section container section-space" aria-labelledby="contact-heading"><p className="eyebrow section-label">{t.contactLabel}</p><div className="contact-heading"><h2 id="contact-heading">{t.contactTitle}</h2><ArrowDownRight size={75} strokeWidth={1} aria-hidden="true" /></div><p className="contact-intro">{t.contactBody}</p><div className="contact-email-row"><a className="contact-email" href={`mailto:${site.email}`}>{site.email}<ArrowUpRight aria-hidden="true" /></a><CopyEmail locale={locale} /></div><p className="support-note"><Mail size={16} />{t.supportNote}</p></section>
    </main>
    <Footer locale={locale} />
  </>;
}
