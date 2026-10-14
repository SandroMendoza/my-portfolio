import type { Config } from "tailwindcss";

// Design tokens from KC's approved screen spec (design/screen-specs.md, §1).
// MP-1: every other section ticket (MP-2..MP-10) builds against these tokens —
// don't hardcode a color/size/space here already covers. See docs/architecture/rules.md.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Spec defines exactly three breakpoints (no sm/xl/2xl): mobile is the
    // unprefixed default (360-639px), `md` is tablet (640-1023px), `lg` is
    // desktop (1024px+). Replacing (not extending) Tailwind's defaults so no
    // other breakpoint sneaks into use.
    screens: {
      md: "640px",
      lg: "1024px",
    },
    extend: {
      colors: {
        "surface-base": "#FFFFFF",
        "surface-alt": "#F7F8FA",
        "surface-dark": "#0F172A",
        "text-primary": "#15181E",
        "text-secondary": "#5B6472",
        "text-on-dark": "#F7F8FA",
        accent: "#2563EB",
        "accent-hover": "#1D4ED8",
        "accent-tint": "#EEF2FF",
        // Darkened accent used only for chip/pill text on `accent-tint`
        // backgrounds, for AA contrast (spec §1 Shared components > Chip/Pill).
        "accent-chip-text": "#1E40AF",
        border: "#E5E8EC",
        "error-bg": "#FEF3F2",
        "error-border": "#FDA29B",
        "error-text": "#B42318",
        // Focus ring override for focusable elements on `surface-dark` (Contact
        // section) — the default `accent` ring doesn't have enough contrast there.
        "focus-ring-dark": "#93C5FD",
      },
      fontFamily: {
        // Pure system-stack fallback chain with "Inter" declared first — no
        // @font-face/web-font request is added (spec: "zero extra load cost"),
        // so this renders Inter only where already installed, else the OS
        // default sans-serif, per the "no heavy dependency" guideline.
        sans: [
          "Inter",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      // Mobile size is the bare key (used by default); the `-lg` key is the
      // desktop size, applied with the `lg:` variant in components, e.g.
      // `text-h1 lg:text-h1-lg`. Weights are applied separately with
      // Tailwind's standard font-weight utilities (font-bold/font-semibold/
      // font-normal/font-medium) to match the spec's weight column.
      fontSize: {
        h1: ["2.125rem", { lineHeight: "1.15" }], // 34px mobile
        "h1-lg": ["3rem", { lineHeight: "1.1" }], // 48px desktop
        h2: ["1.5rem", { lineHeight: "1.2" }], // 24px mobile
        "h2-lg": ["2rem", { lineHeight: "1.2" }], // 32px desktop
        h3: ["1.125rem", { lineHeight: "1.3" }], // 18px mobile
        "h3-lg": ["1.25rem", { lineHeight: "1.3" }], // 20px desktop
        body: ["1rem", { lineHeight: "1.6" }], // 16px, same both breakpoints
        meta: ["0.8125rem", { lineHeight: "1.4" }], // 13px mobile
        "meta-lg": ["0.875rem", { lineHeight: "1.4" }], // 14px desktop
      },
      // Spacing scale per spec is 4/8/12/16/24/32/48/64/96px, which are
      // exactly Tailwind's default 1/2/3/4/6/8/12/16/24 units — no override
      // needed. Components should only reach for those existing utilities
      // (p-4, gap-6, py-16, etc.); this is enforced by review, not config,
      // since the full numeric scale is still needed for things the spec
      // doesn't name (e.g. arbitrary max-width, fractional widths).
      maxWidth: {
        content: "1120px", // shared page max-width, centered
      },
      boxShadow: {
        resting: "0 1px 2px rgba(0,0,0,.04)",
        hover: "0 4px 12px rgba(0,0,0,.08)",
      },
      borderRadius: {
        card: "8px",
        pill: "999px",
      },
    },
  },
  plugins: [],
} satisfies Config;
