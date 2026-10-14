// Shared "Condensed list row" from the design spec (§1), used by Other
// Experience and Education & Certifications: title + subtitle (company or
// institution) left, dates right on desktop/tablet, stacked on mobile, 1px
// border divider between rows (no divider after the last row). Renders as a
// real <li> — callers wrap a list of these in a real <ul> (spec §8/§9
// Accessibility).
//
// DOM order stays title -> subtitle -> dates regardless of the visual
// right-alignment of dates, so screen reader reading order matches the
// visual left-to-right order (spec §8 Accessibility).
export interface CondensedListRowProps {
  title: string;
  subtitle: string;
  dateRange: string;
  isLast?: boolean;
}

export function CondensedListRow({
  title,
  subtitle,
  dateRange,
  isLast = false,
}: CondensedListRowProps) {
  return (
    <li
      className={`flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:justify-between md:gap-4 ${
        isLast ? "" : "border-b border-border"
      }`}
    >
      <div className="flex flex-col gap-1">
        <span className="text-body font-semibold text-text-primary">
          {title}
        </span>
        <span className="text-meta font-medium text-text-secondary lg:text-meta-lg">
          {subtitle}
        </span>
      </div>
      <span className="text-meta font-medium text-text-secondary md:shrink-0 md:pl-4 md:text-right lg:text-meta-lg">
        {dateRange}
      </span>
    </li>
  );
}
