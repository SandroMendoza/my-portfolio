# 0005 — Testing: Vitest + React Testing Library

**Date**: 2026-10-14
**Status**: Accepted (2026-10-14)

## Context

The project needs enough automated confidence that the eight sections render, the Download Resume link points at the right file, the KC Art Gallery link opens correctly, and the Contact section is a `mailto:` link — without over-investing in test infrastructure for a small static site with one frontend developer and no backend (ADR 0001).

## Options considered

**A. Vitest + React Testing Library.**
Vitest shares Vite's config and transform pipeline directly (no second build pipeline to maintain), and pairs naturally with React Testing Library for component-level rendering/interaction tests.

**B. Jest + React Testing Library.**
Mature and extremely common, but needs extra configuration to work smoothly against a Vite project (a separate transform/module pipeline), when Vitest gives the same React Testing Library experience without that duplication.

**C. Playwright end-to-end only.**
Would give real-browser, real-responsive-layout checks — valuable, but heavier to run on every pull request for a simple static page than component tests are. Better suited as an optional future addition (e.g. a couple of smoke checks) than the primary tool for v1.

## Decision

**Option A** — Vitest + React Testing Library for component tests, run in CI on every pull request. Playwright is not required for v1; it may be added later by Potchie/Yuki for smoke checks if a real need appears.

## Reasons

- Vitest reuses Vite's existing config and transform pipeline, keeping the toolchain small, per "prefer the simplest design that meets the requirements."
- React Testing Library tests component output the way a user/recruiter experiences it (rendered text, links, roles) rather than implementation detail.
- Matches the project's scale: one frontend developer, no backend, content that rarely changes.

## Consequences

- **Easier**: fast test runs, minimal configuration, tests co-located with components.
- **Harder / risk accepted**: no automated real-browser responsive or visual testing in CI. Responsive QA — "no horizontal scrolling at any breakpoint" (Discovery Must #7) — relies on Potchie's manual testing across breakpoints for v1, not an automated check.

## Rules for developers

- Place component tests next to the component (e.g. `Hero.test.tsx` next to `Hero.tsx`).
- At minimum, cover: each section renders its expected content; the Download Resume link has the correct `href`; the KC Art Gallery link has the correct `href` and `target="_blank"`; the Contact email link is a `mailto:` link.
- CI (GitHub Actions) runs `npm run test` and `npm run build` on every pull request; both must pass before merge.
