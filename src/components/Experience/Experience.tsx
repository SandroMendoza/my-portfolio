import { SectionHeading } from "../ui/SectionHeading";
import { resumeContent } from "../../content/resume";

// Experience section (design/screen-specs.md §6). surface-alt background,
// single role block (max-width 720px): H3 role title, meta line (company ·
// dates) in text-secondary, then 8 bullets as a real <ul> with disc
// markers. One role only — no timeline/rail layout at this scale.
//
// `flow-root` prevents SectionHeading's own `mt-16` from margin-collapsing
// through this section's top edge (same fix as About, MP-4 — needed here
// too since this section alternates to surface-alt).
export function Experience() {
  return (
    <section className="flow-root bg-surface-alt px-6 pb-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-[720px]">
        <SectionHeading>Experience</SectionHeading>
        {resumeContent.experience.map((role) => (
          <div key={role.title} className="mt-8">
            <h3 className="text-h3 font-semibold text-text-primary lg:text-h3-lg">
              {role.title}
            </h3>
            <p className="mt-1 text-meta text-text-secondary lg:text-meta-lg">
              {role.organization} · {role.dateRange}
            </p>
            <ul className="mt-6 list-disc space-y-2 pl-6 text-body text-text-primary">
              {role.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
