import Image from "next/image";
import { Expand } from "lucide-react";
import { content, type Locale } from "@/lib/content";
import { currentProjects } from "@/lib/current-projects";
import { withWaveText } from "./wave-text";

export function CurrentProjects({ locale }: { locale: Locale }) {
  const t = content[locale];
  const projects = currentProjects(locale);
  return withWaveText(<div className="current-project-grid">
    {projects.map((project, index) => <article key={project.id} id={project.id} className="current-project" aria-labelledby={`${project.id}-heading`}>
      <div className="current-project-content">
        <div className="current-project-meta"><span className="eyebrow">{String(index + 1).padStart(2, "0")} / {project.category}</span><span className="current-project-status"><span className="status-dot" aria-hidden="true" />{t.currentStatus}</span></div>
        <div className="current-project-copy"><h3 id={`${project.id}-heading`}>{project.name}</h3><p>{project.description}</p></div>
      </div>
      <div className={`current-project-gallery${project.images.length > 1 ? " current-project-gallery-stack" : ""}`}>
        {project.images.map((picture, imageIndex) => <a key={picture.src} className="current-project-image" href={picture.src} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${t.currentViewImage} ${imageIndex + 1}`}>
          <Image {...picture} alt={picture.alt} sizes="(max-width: 700px) 144px, 176px" />
          <span className="current-project-expand" aria-hidden="true"><Expand size={12} strokeWidth={1.5} /></span>
        </a>)}
      </div>
    </article>)}
  </div>);
}
