import type { ReactNode } from "react";

// Shared Chip/Pill from the design spec (§1): accent-tint bg, darkened accent
// text for AA contrast, pill radius, 6px/12px padding, 14px text.
// Renders as a real <li> — callers wrap a list of these in a real <ul> so
// screen readers announce "list of N items" (spec §5 Skills, §7 Projects).
export interface ChipProps {
  children: ReactNode;
  className?: string;
}

export function Chip({ children, className = "" }: ChipProps) {
  return (
    <li
      className={`inline-block rounded-pill bg-accent-tint px-3 py-1.5 text-meta-lg font-medium text-accent-chip-text ${className}`}
    >
      {children}
    </li>
  );
}
