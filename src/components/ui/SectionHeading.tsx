import type { ReactNode } from "react";

// Shared "Section heading" from the design spec (§1): H2 + optional 4px
// accent underline/rule, 64px top margin from the previous section. Every
// section component (About, Skills, Experience, ...) opens with this instead
// of a raw <h2> so the heading style stays consistent (spec: "Only one H1 on
// the page ... every other section title is H2").
export interface SectionHeadingProps {
  children: ReactNode;
  withRule?: boolean;
  className?: string;
}

export function SectionHeading({
  children,
  withRule = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mt-16 ${className}`}>
      <h2 className="text-h2 font-bold text-text-primary lg:text-h2-lg">
        {children}
      </h2>
      {withRule && (
        <span
          aria-hidden="true"
          className="mt-2 block h-1 w-12 rounded-pill bg-accent"
        />
      )}
    </div>
  );
}
