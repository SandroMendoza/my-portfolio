import { SectionHeading } from "../ui/SectionHeading";
import { resumeContent } from "../../content/resume";

// About section (design/screen-specs.md §4). Single centered column
// (max-width 680px) on a surface-alt background, same layout at every
// breakpoint (margins only change, no separate two-column layout).
//
// `flow-root` establishes a new block formatting context so SectionHeading's
// own `mt-16` (the "64px top margin from previous section" spacing, spec §1)
// can't margin-collapse through this section's top edge. Without it, the
// surface-alt background would start ~64px lower than the heading, showing
// the previous section's background through the gap instead. Every later
// section that opens with SectionHeading on a colored background should use
// the same `flow-root` + no-top-padding pattern (see also: don't add a
// redundant pt-16/py-16 alongside it, or the gap doubles to 128px).
export function About() {
  return (
    <section className="flow-root bg-surface-alt px-6 pb-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-[680px]">
        <SectionHeading>About</SectionHeading>
        <p className="mt-6 text-body text-text-primary">
          {resumeContent.about.body}
        </p>
      </div>
    </section>
  );
}
