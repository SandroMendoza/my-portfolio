import { CondensedListRow } from "../ui/CondensedListRow";
import { SectionHeading } from "../ui/SectionHeading";
import { resumeContent } from "../../content/resume";

// Other Experience section (design/screen-specs.md §8). surface-alt
// background, 4 condensed rows (title + company left, dates right on
// desktop/tablet, stacked on mobile) via the shared CondensedListRow
// component (built in MP-1). No bullets — condensed/scannable only, per
// the Should-have requirement.
//
// `flow-root` prevents SectionHeading's own mt-16 from margin-collapsing
// through this section's top edge (same fix as About/Experience, needed
// here since this section alternates to surface-alt).
export function OtherExperience() {
  const roles = resumeContent.otherExperience;

  return (
    <section className="flow-root bg-surface-alt px-6 pb-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-content">
        <SectionHeading>Other Experience</SectionHeading>
        <ul className="mt-8">
          {roles.map((role, index) => (
            <CondensedListRow
              key={role.title}
              title={role.title}
              subtitle={role.organization}
              dateRange={role.dateRange}
              isLast={index === roles.length - 1}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
