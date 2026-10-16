import type { ReactNode } from "react";
import { Chip } from "../ui/Chip";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";
import { resumeContent } from "../../content/resume";
import type { ProjectEntry } from "../../content/types";

// Projects section (design/screen-specs.md §7). surface-base background.
// 3-card grid: desktop grid-cols-3 (wraps to 3+... here exactly 3, fits one
// row), tablet grid-cols-2 (third card wraps), mobile single column.
// KC Art Gallery is always first — it's simply first in resumeContent.projects.
//
// `flow-root` applied precautionarily (same note as Skills/MP-5): this
// section's surface-base background already matches <body>'s default, so a
// margin-collapse wouldn't currently show a seam, but containing
// SectionHeading's mt-16 the same way everywhere avoids depending on that
// coincidence.

// Fixed UI boilerplate (not resume content — identical for every
// description-only card, so it isn't duplicated in src/content; same
// classification as Contact's future "Copied!" microcopy).
const NO_LINK_CAPTION = "(No public link — private work project.)";

function CardContent({ project }: { project: ProjectEntry }) {
  return (
    <>
      <h3 className="text-h3 font-semibold text-text-primary lg:text-h3-lg">
        {project.name}
      </h3>
      {project.organization && (
        <p className="mt-1 text-meta text-text-secondary lg:text-meta-lg">
          {project.organization}
        </p>
      )}
      <p className="mt-3 text-body text-text-primary">{project.description}</p>
      {project.link.kind === "description-only" && (
        <p className="mt-1 text-meta text-text-secondary lg:text-meta-lg">
          {NO_LINK_CAPTION}
        </p>
      )}
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </ul>
    </>
  );
}

function ProjectCard({ project }: { project: ProjectEntry }): ReactNode {
  if (project.link.kind === "linked") {
    return (
      <a
        href={project.link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name} — View on GitHub, opens in a new tab`}
        className="group block rounded-card border border-border p-6 shadow-resting transition duration-150 hover:-translate-y-0.5 hover:shadow-hover focus-visible:-translate-y-0.5 focus-visible:shadow-hover"
      >
        <CardContent project={project} />
        <Button
          as="span"
          variant="secondary"
          aria-hidden="true"
          className="mt-6 group-hover:underline group-focus-visible:underline"
        >
          View on GitHub ↗
        </Button>
      </a>
    );
  }

  // Static cards: plain content only — no <a>, <button>, or role="button",
  // no hover-lift, no pointer cursor (spec §7 States/Accessibility).
  return (
    <div className="rounded-card border border-border p-6">
      <CardContent project={project} />
    </div>
  );
}

export function Projects() {
  return (
    <section className="flow-root bg-surface-base px-6 pb-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-content">
        <SectionHeading>Projects</SectionHeading>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumeContent.projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
