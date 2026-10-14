import type { Config } from "tailwindcss";

// Design tokens (colors, type scale, spacing) come from KC's approved screen specs
// (see design/screen-specs.md) and should be added under `theme.extend` here —
// ticket MP-1 (design tokens) owns filling this in. Keep Tailwind as the only
// styling approach — see docs/architecture/rules.md.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
