import { content, type Locale } from "@/lib/content";
import { currentProjects } from "@/lib/current-projects";
import { withWaveText } from "./wave-text";
import { ProjectGallery } from "./project-gallery";

export function CurrentProjects({ locale }: { locale: Locale }) {
  const t = content[locale];
  const projects = currentProjects(locale);
  return withWaveText(<div className="current-project-grid">
    {projects.map((project, index) => <article key={project.id} id={project.id} className="current-project" aria-labelledby={`${project.id}-heading`}>
      <div className="current-project-content">
        <div className="current-project-meta"><span className="eyebrow">{String(index + 1).padStart(2, "0")} / {project.category}</span><span className="current-project-status"><span className="status-dot" aria-hidden="true" />{project.status ?? t.currentStatus}</span></div>
        <div className="current-project-copy"><h3 id={`${project.id}-heading`}>{project.name}</h3><p>{project.description}</p></div>
      </div>
      <ProjectGallery name={project.name} images={project.images} locale={locale} />
    </article>)}
  </div>);
}
