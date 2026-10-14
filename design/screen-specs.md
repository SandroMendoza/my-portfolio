# My Portfolio — Screen Specs & Handoff

Designer: KC · Stage: Design · Status: **Approved by Sandro** (2026-10-14) — all 8 sections + the 4 flagged decisions in §0 confirmed as designed, no changes requested.
Source of truth: Notion — [Product Overview](https://app.notion.com/p/3f92582d747381c18931d32efc33a522) + 8 user stories under the [My Portfolio hub](https://app.notion.com/p/3f92582d74738177bc75fe33f4986982).
Architecture reference: `docs/architecture/overview.md` + `rules.md` (Dragon) — React + Vite + TypeScript + Tailwind CSS, one component per section, no animation library.

**Revision note (2026-10-14, post-MP-1):** Dragon flagged that §1's Chip/Pill padding (6px/12px) wasn't on the general spacing scale list. Resolved by documenting 6px as a named micro-spacing exception for compact inline components, rather than changing the already-built, already-approved Chip component — no code change needed. See §1.

**Revision note (2026-10-14, post-MP-2):** Dragon flagged that §2's Nav collapse point (768px) didn't match MP-1's `md`(640px)/`lg`(1024px) breakpoint tokens. Same resolution pattern as the Chip case — documented 768px as a named per-component breakpoint exception (Nav collapse only) in §1, rather than changing the already-built, already-approved Nav. No code change needed. See §1.

This is a single scrolling page. "Screens" below = sections in fixed order: **Hero → About → Skills → Experience → Projects → Other Experience → Education & Certifications → Contact**, each specified at mobile / tablet / desktop. Figma frames should be named `Portfolio / 01 Hero`, `Portfolio / 02 About`, etc., one page per breakpoint group or one frame per breakpoint per section (`01 Hero — Desktop`, `01 Hero — Mobile`, …) — until the Figma upgrade lands, this document is the spec of record.

---

## 0. Decisions made by KC (flagged for your confirmation)

I made a call on three things the product docs don't specify, since they're visual/UX decisions within design scope. Defaults are baked into the specs below — tell me if you want something different and I'll adjust before this goes to Gellie for tickets.

| # | Decision | Default I used | Why |
|---|---|---|---|
| 1 | Hero photo | **Text-only**, no photo | Nothing in the docs mentions a photo; text-only keeps it clean/minimal, has zero asset dependency, and is standard for backend-dev portfolios. Easy to add a circular photo later next to the name if Sandro wants one. |
| 2 | Navigation | **Sticky header** with jump links to all 8 sections + a persistent compact "Download Resume" button, collapsing to a hamburger menu under 1024px | Supports the Discovery goal "clear impression in under 2 minutes" — a recruiter can jump straight to Skills or Projects instead of scrolling past everything. |
| 3 | Resume-fails-to-load fallback | Inline message under the button: *"Couldn't open the resume — email sandro.p.mendoza@gmail.com for a copy"* (mailto link), button stays usable | Gellie asked me to propose this; avoids a dead/broken-looking button and gives an immediate recovery path using the already-approved contact email. |

A fourth, smaller call: the **Contact** section uses a dark, full-bleed closing band (instead of the light/alt-gray rhythm of every other section) to give the page one deliberate visual "moment" and signal end-of-content — ties to the brief's "simple but interesting." Easy to flatten to match the rest if you'd rather keep it fully uniform.

---

## 1. Design system (tokens)

Named so they map directly to Tailwind config (`tailwind.config.ts`) for Rose.

**Breakpoints (primary):** use these for all section/layout responsiveness.
- `mobile`: 360–639px (default/no prefix in Tailwind)
- `md` (tablet): 640–1023px
- `lg` (desktop): 1024px+ · content max-width 1120px, centered, side padding 24px (mobile) / 32px (tablet) / 64px (desktop)

**Breakpoints (per-component exception):** 768px — reserved for the sticky Nav's collapse point only (§2). The inline bar (wordmark + 7 jump links + Download Resume button) needs more horizontal room than the primary `md` breakpoint allows before it collapses to the hamburger menu. Implement as an arbitrary Tailwind value (`min-[768px]:`), not a new named breakpoint — don't reuse 768px for other components without adding it here first.

**Color**
| Token | Hex | Use |
|---|---|---|
| `surface-base` | `#FFFFFF` | Default section background |
| `surface-alt` | `#F7F8FA` | Alternating section background (About, Skills, Other Experience, Education) |
| `surface-dark` | `#0F172A` | Contact closing band |
| `text-primary` | `#15181E` | Headings, body copy |
| `text-secondary` | `#5B6472` | Meta text (dates, company names, captions) |
| `text-on-dark` | `#F7F8FA` | Text on `surface-dark` |
| `accent` | `#2563EB` | Links, primary button, focus ring, chip text |
| `accent-hover` | `#1D4ED8` | Hover/active state of accent elements |
| `accent-tint` | `#EEF2FF` | Chip/pill backgrounds |
| `border` | `#E5E8EC` | Dividers, card borders |
| `error-bg` | `#FEF3F2` | Resume fallback message background |
| `error-border` | `#FDA29B` | Resume fallback message border |
| `error-text` | `#B42318` | Resume fallback message text |

All text/background pairs above meet WCAG AA (4.5:1 body text, 3:1 large text/UI). Verify the final `accent` hex against `surface-base` and `surface-dark` with a contrast checker once implemented in Tailwind config, since exact rendering can shift slightly with anti-aliasing.

**Typography**
- Font: `Inter`, fallback `-apple-system, "Segoe UI", Roboto, sans-serif` (system stack, zero extra load cost, matches "no heavy dependency" guideline).
- Scale (desktop / mobile), weight:
  - H1 (Hero name): 48px / 34px, 700
  - H2 (section heading): 32px / 24px, 700
  - H3 (card/role/category title): 20px / 18px, 600
  - Body: 16px / 16px, 400, line-height 1.6
  - Meta/small (dates, captions, chips): 14px / 13px, 500
- Body paragraphs max-width ~70ch.

**Spacing scale (primary):** 4, 8, 12, 16, 24, 32, 48, 64, 96 (px) — use for all layout padding/margin/gap.
**Spacing scale (micro-spacing exception):** 6px — reserved only for compact inline components where 4px reads too tight and 8px reads too loose at 14px text (currently: Chip/Pill vertical padding, below). Don't use 6px for layout spacing — the primary scale above covers that.

**Radius:** 8px (cards, buttons), 999px (pills/chips)

**Shadow:** resting `0 1px 2px rgba(0,0,0,.04)`; hover `0 4px 12px rgba(0,0,0,.08)`

**Focus state (all interactive elements):** 2px solid `accent` outline, 2px offset, visible only via `:focus-visible`. On `surface-dark` (Contact), swap outline to `#93C5FD` (light blue) so it stays visible.

**Motion (Could-have — keep CSS-only, no library per architecture guideline):**
- Section headings/cards fade + translateY(8px→0) on scroll into view, 250ms ease-out.
- Cards: hover lifts 2px + shadow increase, 150ms ease (only on elements that are actually clickable — see Projects states).
- Nav anchor clicks: smooth scroll, with scroll-offset = sticky header height (64px) so headings aren't hidden underneath.
- Respect `prefers-reduced-motion: reduce` — disable all of the above, snap to end state instantly.

**Shared components**
- **Button/Primary** — accent bg, white text, 8px radius, 48px min height, 24px horizontal padding, icon + label.
- **Button/Secondary (ghost)** — transparent bg, accent text + 1px accent border.
- **Chip/Pill** — `accent-tint` bg, accent (darkened for contrast, `#1E40AF`) text, 6px/12px padding (6px = the micro-spacing exception noted above, intentional, not a typo), pill radius, 14px.
- **Section heading** — H2 + optional 4px accent underline/rule, 64px top margin from previous section.
- **Condensed list row** (used by Other Experience + Education) — title (body, 600) + company (text-secondary) left, dates (text-secondary, 14px) right on desktop, stacked on mobile, 1px `border` divider between rows.

---

## 2. Global: Sticky Navigation

**Goal:** Let a time-pressed recruiter orient immediately and jump to any section without scrolling past everything; keep Download Resume reachable at all times.

**Related requirements:** Supports Discovery goal ("clear impression in under 2 minutes") and Hero story's Download Resume must-have (#2/#3). Not an explicit requirement itself — see decision #2 above.

**Layout**
- Desktop/tablet (≥768px — a named per-component breakpoint exception, see §1): fixed top bar, 64px height, `surface-base` bg, 1px bottom `border`. Left: "Sandro Mendoza" wordmark (16px, 600) — click scrolls to top. Center/right: text jump links — About, Skills, Experience, Projects, Other Experience, Education, Contact (small, 14px, text-secondary, accent on hover/active-section). Far right: compact "Download Resume" primary button (icon-only + tooltip on tablet if space is tight, full label on desktop).
- Mobile (<768px): same bar, wordmark left, jump links collapse into a hamburger icon (right), Download Resume button hidden from the bar itself (it's already visible in Hero one scroll away) — hamburger opens a full-height overlay menu listing all 7 jump links + a Download Resume button at the bottom.
- Bar gains the resting shadow token once the page scrolls past the Hero section (subtle elevation cue).

**Components:** Wordmark (text link), 7 nav links, Button/Primary (compact), hamburger icon button (mobile), mobile overlay menu.

**Copy:** Nav labels = section names exactly as used for headings: About, Skills, Experience, Projects, Other Experience, Education & Certifications (shorten to "Education" only if space-constrained on tablet — keep full on mobile overlay), Contact.

**States:** default; active-section (link underlined/accent-colored while its section is in viewport, via scroll-spy); hover/focus (accent color + focus ring); mobile menu closed/open (hamburger swaps to "X").

**Interactions:** Click/tap a link → smooth scroll to that section, menu closes if open. Click Download Resume → same behavior as Hero's button (see §3 States). Keyboard: full tab order through wordmark → links → button; Escape closes mobile overlay and returns focus to the hamburger button.

**Accessibility:** `<nav aria-label="Section">`; current section indicated with `aria-current="true"` on its link (not color alone); hamburger button has `aria-expanded`/`aria-controls`; overlay menu traps focus while open; all tap targets ≥44×44px.

**Open questions:** None — decision #2 (sticky nav) confirmed by Sandro on 2026-10-14.

---

## 3. Hero

**Goal:** Visitor instantly knows who Sandro is and can download his resume, no scrolling required on desktop.

**Related requirements:** Must #1 (first section), #2 (name/headline/button visible), #3 (button opens/downloads PDF). AC: Hero visible without scrolling on standard desktop viewport.

**Layout**
- Desktop (≥1024px): min-height 85vh (not a forced 100vh — leaves a visual hint there's more below), content vertically centered, single column, max-width 720px, left-aligned, `surface-base` background. Subtle scroll-cue chevron centered at the bottom of the section, gentle bounce animation (disabled under reduced-motion).
- Tablet: min-height 70vh, max-width 600px, 32px side padding.
- Mobile: min-height auto (content-driven, not forced vh — avoids cramped/awkward spacing on short phones), 24px side padding, button full-width.

**Components**
- H1: name — "Sandro Mendoza"
- Subheading (body-large, 20px/18px, text-secondary): role/stack line — "Backend Developer · Kotlin & Spring Boot"
  - *Note:* the approved headline string is "Sandro Mendoza — Backend Developer · Kotlin & Spring Boot." I split it at the em dash into H1 (name) + subheading (role) for visual hierarchy — same approved words, no new copy added.
- Button/Primary: "Download Resume" with a download icon, links to `/resume/Sandro-Mendoza-Resume.pdf` (per Dragon's architecture — static asset, `download` attribute set, opens/downloads directly, no backend call).
- Inline fallback message (hidden by default, see States).

**Copy (exact)**
- Name: `Sandro Mendoza`
- Subheading: `Backend Developer · Kotlin & Spring Boot`
- Button label: `Download Resume`

**States**
- Default: button in accent color, no fallback message shown.
- Hover/focus: button bg → `accent-hover`; visible focus ring.
- Click (happy path): browser opens/downloads the PDF in a new tab — no custom loading state needed since it's a direct static-file link (per architecture: no backend, no fetch call to await).
- Error/fallback (file missing or fails to open): show the inline message directly below the button — *"Couldn't open the resume — email sandro.p.mendoza@gmail.com for a copy"* with the email as a `mailto:` link, styled with `error-bg`/`error-border`/`error-text` tokens. The button itself remains visible and re-clickable (not disabled, not visually "broken"). Detection mechanism (e.g. an `onError` handler, or catching a failed fetch if Rose chooses to pre-check the asset) is an implementation detail for Rose — flagging here so it isn't skipped.

**Interactions:** Click/tap Download Resume → direct link behavior described above. Keyboard: button is a standard focusable `<a>`/`<button>`, Enter/Space activates it.

**Accessibility:** One H1 on the whole page, used here only. Button min 48px height, accessible name "Download Resume" (add `aria-label="Download Sandro Mendoza's resume (PDF)"` for extra clarity if helpful). Fallback message uses `role="alert"` or `aria-live="polite"` so screen reader users are notified without needing to re-discover it visually.

**Open questions:** None — decisions #1 (text-only, no photo) and #3 (fallback copy as written) confirmed by Sandro on 2026-10-14.

---

## 4. About

**Goal:** Bridge backend-dev and support/QA background in one short read so either recruiter audience understands Sandro's full profile fast.

**Related requirements:** Story AC — 2–3 sentence introduction covering both backend dev and support/QA experience, shown right after Hero.

**Layout:** `surface-alt` background (first alternation from Hero's white). H2 "About" centered or left-aligned above a single centered column, max-width 680px, body text. Same layout at all breakpoints (just narrower margins on mobile) — no need for a two-column editorial layout at this content length.

**Components:** Section heading (H2), one body paragraph.

**Copy (exact, verbatim from Product Overview):**
> "I'm a backend developer with hands-on experience building scalable systems using Kotlin, Spring Boot, and Domain-Driven Design. Before moving into software development, I spent several years in IT support, QA, and customer service — so reliability, attention to detail, and clear communication are second nature to me."

**States:** Static content only — no empty/loading/error states apply (content is bundled at build time per architecture, not fetched).

**Interactions:** None (no links/buttons). Optional scroll-reveal fade-in per the global motion tokens.

**Accessibility:** H2 heading landmark; paragraph line-height 1.6; text-primary color (not secondary) since this is primary content, for contrast.

**Open questions:** None.

---

## 5. Skills

**Goal:** Let a technical recruiter scan for specific technologies in seconds.

**Related requirements:** Story AC — skills grouped under Backend, Architecture, Testing, Data, Tools; each category lists skills exactly as in the approved copy.

**Layout:** `surface-base` background. H2 "Skills". Grid of 5 category cards: desktop `grid-cols-3` (wraps 3 + 2), tablet `grid-cols-2`, mobile single column stacked. Each card: light `border`, 8px radius, 24px padding, no heavy shadow (skills are reference info, not actionable — keep visually quiet).

**Components:** 5 × (H3 category name + chip list). Chips reuse the global Chip/Pill component, wrapping within the card.

**Copy (exact, verbatim):**
- **Backend:** Kotlin, Spring Boot, Java, REST APIs
- **Architecture:** Hexagonal Architecture, Domain-Driven Design (DDD), Clean Architecture
- **Testing:** JUnit5, MockK, Parameterized Testing
- **Data:** MySQL, MongoDB, SQL
- **Tools:** Git, Gradle, Apache PDFBox, Docker

**States:** Static. Chips are not interactive (no click action) — optional subtle hover tint purely decorative, not required.

**Interactions:** None required.

**Accessibility:** Category name is H3; each chip list is a real `<ul><li>` (announced as "list of N items" by screen readers), not bare `<div>`s. Chip text/bg contrast: accent-tint bg with darkened accent text (`#1E40AF`) for AA compliance.

**Open questions:** None.

---

## 6. Experience

**Goal:** Prove hands-on backend capability via the current role, in detail.

**Related requirements:** Story AC — shows FFUF Manila role (title, dates, bullets) exactly as in approved copy. Experience story is High priority.

**Layout:** `surface-alt` background. H2 "Experience". Single role block, max-width 720px: H3 role title, meta line (company · dates) in text-secondary below it, then the 8 bullets as a standard `<ul>` with disc markers, body size, 1.6 line-height. One role only — no timeline/rail layout needed at this scale; keep it a simple stacked block.

**Components:** Section heading, role header (H3 + meta line), bullet list.

**Copy (exact, verbatim):**
- Title: `Junior Software Web Developer I`
- Meta: `FFUF Manila · Oct 2022–Present`
- Bullets:
  1. Designed and implemented backend services using Kotlin and Spring Boot following Hexagonal Architecture.
  2. Developed RESTful APIs supporting web and mobile applications.
  3. Implemented domain-driven modules using aggregates, commands, and domain events.
  4. Developed a document signing service that embeds digital signatures into PDF files using Apache PDFBox.
  5. Implemented batch data synchronization jobs for importing legacy system data into domain entities.
  6. Integrated external APIs for validation and document verification workflows.
  7. Developed comprehensive unit and integration tests using JUnit5 and MockK.
  8. Refactored legacy implementations into modular backend components for better maintainability.

**States:** Static.

**Interactions:** None.

**Accessibility:** Heading order H2 (section) → H3 (role); bullets as real `<ul><li>`.

**Open questions:** None.

---

## 7. Projects

**Goal:** Show real, judgeable work — one publicly verifiable (linked) project plus two private work projects described in enough depth to matter.

**Related requirements:** Must #4/#5; Story AC — 3 cards (KC Art Gallery, Document Signing Service, Legacy Data Synchronization); KC Art Gallery click opens the GitHub repo in a new tab; the other two have no link, description + tech stack only. High priority story.

**Layout:** `surface-base` background. H2 "Projects". 3-card grid: desktop `grid-cols-3` equal-height cards; tablet `grid-cols-2` (third card wraps to its own row); mobile single column. **KC Art Gallery is always first** (it's the one visitors can actually click through and verify, and it's listed first in the approved copy).

**Card anatomy (all 3 cards share this structure):**
- H3 project title
- Meta line (text-secondary, 14px) — company, for the two FFUF projects only (KC Art Gallery has none)
- Body description paragraph
- For the two FFUF cards only: the approved parenthetical — *"(No public link — private work project.)"* — rendered as a text-secondary caption line. This uses Gellie's approved copy verbatim to explain the missing link, rather than inventing a new "Private" badge.
- Tech-stack chips (reuses the Skills chip component), derived directly from words already present in each project's approved description — no new technologies introduced:
  - KC Art Gallery: `Next.js` `React` `Tailwind CSS` `Prisma ORM`
  - Document Signing Service: `Kotlin` `Spring Boot` `Hexagonal Architecture` `Apache PDFBox`
  - Legacy Data Synchronization: `Kotlin` `Spring Boot` `Hexagonal Architecture`
- KC Art Gallery only: Button/Secondary "View on GitHub ↗" at the card's bottom, AND the whole card is clickable (cursor pointer, hover lift) — but implemented as a single enclosing link (no nested links) to avoid duplicate/confusing tab stops.

**Copy (exact, verbatim):**
1. **KC Art Gallery** — "A Next.js art gallery web app built with React, Tailwind CSS, and Prisma ORM." → links to `https://github.com/SandroMendoza/kc-art-gallery`
2. **Document Signing Service** (FFUF Manila) — "Backend service embedding digital signatures into PDF files using Apache PDFBox, built with Kotlin/Spring Boot on Hexagonal Architecture. (No public link — private work project.)"
3. **Legacy Data Synchronization** (FFUF Manila) — "Batch jobs importing legacy system data into domain entities, plus external API integrations for validation and document verification. (No public link — private work project.)"

**States**
- KC Art Gallery card: default (resting shadow) → hover/focus (lift + shadow + underline on "View on GitHub ↗") → active.
- Document Signing Service / Legacy Data Sync cards: default only, **no hover-lift and no pointer cursor** — they are not interactive, and shouldn't look like they are.

**Interactions:** Click/tap anywhere on the KC Art Gallery card → opens `https://github.com/SandroMendoza/kc-art-gallery` in a new tab (`target="_blank" rel="noopener noreferrer"`). The other two cards have no click behavior.

**Accessibility:** KC Art Gallery card is a single `<a>` wrapping the whole card (not a `<div>` with a nested link) with accessible name "KC Art Gallery — View on GitHub, opens in a new tab" (visually-hidden text or `aria-label` covering the "opens in new tab" part). The two static cards must not use `<a>`, `<button>`, or `role="button"` — they are plain content.

**Open questions:** None — card copy and link behavior are fully specified.

---

## 8. Other Experience

**Goal:** Give an Amazon-VA-style recruiter a fast, scannable view of Sandro's support/ops background without burying it in bullet detail.

**Related requirements:** Should #8 (condensed/scannable, not full bullets); Story AC — 4 roles (DATAMODE, Transcom PH, SYKES INC., Puregold Pricelub Inc.) with title, company, dates only.

**Layout:** `surface-alt` background. H2 "Other Experience". 4-row condensed list using the shared "Condensed list row" component: title + company left, dates right-aligned, on desktop/tablet; stacked (title/company then dates below, smaller) on mobile. 1px `border` divider between rows, no divider after the last row.

**Components:** Section heading, 4× Condensed list row.

**Copy (exact, verbatim — title / company / dates):**
1. IT Staff / Customer Support Representative / QA & Audit — DATAMODE — Dec 2017–Oct 2022
2. Technical Support Representative (Chat Support) — Transcom PH — May–Jul 2017
3. Technical Support Representative — SYKES INC. — Jul–Dec 2016
4. Technical Support Staff — Puregold Pricelub Inc. — Feb 2015–Jun 2016

**States:** Static.

**Interactions:** None.

**Accessibility:** Rows marked up as a list (`<ul><li>` or a `<dl>` of term/value triples); DOM order stays title → company → dates even though dates are right-aligned visually (flex `justify-between` doesn't reorder DOM, so reading order stays correct for screen readers).

**Open questions:** None.

---

## 9. Education & Certifications

**Goal:** Confirm formal background quickly; lowest-priority section, kept minimal.

**Related requirements:** Story AC — shows BS Computer Science (New Era University, 2008–2013) and Full Stack Coding Bootcamp (Zuitt Philippines, 2019–2020). Low priority.

**Layout:** `surface-base` background. H2 "Education & Certifications". Reuses the same 2-row Condensed list row component as Other Experience for visual consistency and to avoid introducing a new pattern for just 2 items.

**Components:** Section heading, 2× Condensed list row.

**Copy (exact, verbatim):**
1. BS Computer Science — New Era University — 2008–2013
2. Full Stack Coding Bootcamp — Zuitt Philippines — 2019–2020

**States:** Static.

**Interactions:** None.

**Accessibility:** Same as Other Experience.

**Open questions:** None.

---

## 10. Contact

**Goal:** Give the visitor one simple, frictionless way to email Sandro, as the deliberate closing moment of the page.

**Related requirements:** Must #6 (email only — no phone/form/GitHub); Story AC — only email shown; clicking/tapping it opens the default mail client or copies the address. High priority story.

**Layout:** Full-bleed `surface-dark` band (see decision #4) — the one section that breaks the white/`surface-alt` rhythm, signaling "this is the end." H2 "Contact" (in `text-on-dark`), centered, generous vertical padding (96px desktop / 64px mobile). Below it, the email address displayed large (28px/22px, 600) as the section's single focal element, with a small mail icon, plus a small "Copy" icon-button beside it.

**Components:** Section heading, large email `mailto:` link, Copy icon-button, transient "Copied!" confirmation.

**Copy (exact):**
- Heading: `Contact`
- Email: `sandro.p.mendoza@gmail.com`
- Copy confirmation (functional microcopy, not resume content): `Copied!`

**States**
- Default: email link + copy button visible, no confirmation shown.
- Hover/focus: email link underlines/brightens; copy button gets a subtle bg tint + focus ring (light-blue variant for the dark background).
- Copied (transient, ~2s): small "Copied!" tooltip/label appears near the copy button, then fades.

**Interactions:** Click/tap the email text → opens default mail client via `mailto:sandro.p.mendoza@gmail.com` (satisfies the AC's "opens mail client" path). Click/tap the Copy icon → copies the address to clipboard and shows the "Copied!" confirmation (satisfies the AC's "or copies to clipboard" alternative) — covering both behaviors the acceptance criteria names, rather than picking just one.

**Accessibility:** Email link accessible name "Email Sandro Mendoza at sandro.p.mendoza@gmail.com"; copy button `aria-label="Copy email address"`; "Copied!" confirmation announced via `aria-live="polite"` for screen reader users; verify focus-ring contrast against `surface-dark` (use the `#93C5FD` override noted in tokens).

**Open questions:** None — decision #4 (dark closing band) confirmed by Sandro on 2026-10-14.

**Optional addition (not required, flag only):** a one-line footer below Contact — "© 2026 Sandro Mendoza" — purely for polish. Trivial to drop if you'd rather end exactly at the email.

---

## 11. Handoff notes for Rose (frontend)

**Build order (by requirement priority + what's visible first):**
1. Design tokens → Tailwind config (colors, type scale, spacing, radius) first — everything else depends on it.
2. Hero + sticky Nav (above-the-fold, Must-have, highest-priority story).
3. Contact (High priority, simplest section — good second build to validate the token system end-to-end).
4. Projects (High priority, most component complexity — card variants, link vs. no-link).
5. Experience (High priority, straightforward).
6. About, Skills, Other Experience, Education & Certifications (Medium/Low priority, all straightforward static content).

**Watch-outs:**
- Resume path per Dragon's architecture: `/resume/Sandro-Mendoza-Resume.pdf` under `public/resume/`. Confirm the actual file (currently at `C:\Users\Ghel\Documents\Sandro Mendoza Resume.pdf` on Sandro's machine) gets placed there at Repository stage.
- Sticky nav height (64px) must be accounted for as scroll-margin-top on every section when using anchor links, or the heading will land underneath the fixed bar.
- KC Art Gallery card: implement as a single `<a>` wrapping the whole card — do not nest an inner "View on GitHub" link inside a clickable card `<div>`, that creates two overlapping interactive regions and breaks keyboard/screen-reader navigation.
- The two non-linked project cards and all Skills/Other Experience/Education content must NOT be wrapped in interactive elements (no `<a>`, `<button>`, `role="button"`, no pointer cursor) — they're not actionable.
- Per architecture rules: no animation library — all motion in §1 is plain CSS transitions/`@keyframes`, gated behind `prefers-reduced-motion`.
- All copy in this spec is verbatim from the approved Notion content — pull it from `src/content/*.ts` per ADR 0004, don't retype it inline in JSX.
- Only one H1 on the page (Hero name) — every other section title is H2, card/role titles are H3.

**What's still open (do not build until resolved):** the 4 decisions in §0 — I've shipped defaults for all of them, but they're pending Sandro's confirmation. If any changes, I'll update this doc and flag exactly what moved.
