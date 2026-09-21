import { ArrowUpRight } from "lucide-react";
import { content, type Locale } from "@/lib/content";
import { currentProjects } from "@/lib/current-projects";
import { withWaveText } from "./wave-text";
import { ProjectGallery } from "./project-gallery";
import { SocialIcon } from "./social-icon";

export function CurrentProjects({ locale }: { locale: Locale }) {
  const t = content[locale];
  const projects = currentProjects(locale);
  return withWaveText(<div className="current-project-grid">
    {projects.map((project, index) => <article key={project.id} id={project.id} className="current-project" aria-labelledby={`${project.id}-heading`}>
      <div className="current-project-content">
        <div className="current-project-meta"><span className="eyebrow">{String(index + 1).padStart(2, "0")} / {project.category}</span><span className="current-project-status"><span className="status-dot" aria-hidden="true" />{project.status ?? t.currentStatus}</span></div>
        <div className="current-project-copy"><h3 id={`${project.id}-heading`}>{project.name}</h3><p>{project.description}</p></div>
        {project.links && <div className="current-project-actions">{project.links.map((link) => <a className={`button project-social-button project-social-button-${link.platform}`} key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"><SocialIcon platform={link.platform} />{link.label}<ArrowUpRight className="social-arrow" size={17} aria-hidden="true" /></a>)}</div>}
      </div>
      <ProjectGallery name={project.name} images={project.images} locale={locale} />
    </article>)}
  </div>);
}
