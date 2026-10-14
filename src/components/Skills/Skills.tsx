import { Chip } from "../ui/Chip";
import { SectionHeading } from "../ui/SectionHeading";
import { resumeContent } from "../../content/resume";

// Skills section (design/screen-specs.md §5). 5 category cards in a grid —
// desktop grid-cols-3 (wraps 3 + 2), tablet grid-cols-2, mobile single
// column. Cards are visually quiet (light border, no shadow) since skills
// are reference info, not actionable.
//
// `flow-root` is precautionary here (not fixing a visible bug like in
// About): this section's own background (`surface-base`) already matches
// <body>'s default, so a margin-collapse wouldn't currently show a color
// seam — but containing SectionHeading's `mt-16` the same way everywhere
// avoids depending on that coincidence if the page background ever changes.
export function Skills() {
  return (
    <section className="flow-root bg-surface-base px-6 pb-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-content">
        <SectionHeading>Skills</SectionHeading>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumeContent.skills.map((group) => (
            <div
              key={group.category}
              className="rounded-card border border-border p-6"
            >
              <h3 className="text-h3 font-semibold text-text-primary lg:text-h3-lg">
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
