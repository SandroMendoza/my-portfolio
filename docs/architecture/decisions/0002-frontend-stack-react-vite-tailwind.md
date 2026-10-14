# 0002 — Frontend stack: React + Vite + TypeScript + Tailwind CSS

**Date**: 2026-10-14
**Status**: Accepted (2026-10-14)

## Context

Discovery requires a clean, minimal, professional single page (Should #9) following "current (2026) web design conventions," fully responsive with no horizontal scrolling at any breakpoint (Must #7), made of eight fixed sections (Hero, About, Skills, Experience, Projects, Other Experience, Education & Certifications, Contact). KC is designing concurrently and needs a stack that supports standard component-based UI and predictable responsive styling. Sandro's own portfolio project, KC Art Gallery (listed in the Projects section itself), already uses React + Tailwind, so there's team familiarity. The team for this project is a single frontend developer (Rose), with Dragon providing the initial scaffold. ADR 0001 established there is no backend.

## Options considered

**A. React + Vite + TypeScript + Tailwind CSS.**
Component-based (maps naturally onto the eight fixed sections), fast dev server, builds to pure static assets — a direct fit for Cloudflare Workers static assets (ADR 0003). TypeScript gives type safety for the content data (ADR 0004). Tailwind's utility classes make the clean/minimal/responsive direction fast to implement and keep consistent.

**B. Plain HTML/CSS/JS, no framework.**
Zero build step and the smallest possible bundle, but eight sections of repeated structure get harder to keep consistent without components, there's no type safety for content, and all responsive behavior has to be hand-written in CSS.

**C. Next.js.**
Adds server-side rendering, file-based routing, and built-in image optimization — all built for multi-page, dynamic applications. This project is one static page with no server-side needs (ADR 0001), so SSR and routing are unused complexity, and Next.js's output doesn't map as cleanly onto Workers static assets as a plain Vite static build does.

## Decision

**Option A** — React + Vite + TypeScript + Tailwind CSS, built to static files via `vite build`.

## Reasons

- Tailwind's utility classes deliver the "clean, minimal, professional... current conventions" direction efficiently and consistently across sections.
- TypeScript lets the content data (ADR 0004) be typed, so a missing/malformed field is caught before deploy rather than showing up as a broken section in production.
- Vite's static output maps directly onto Cloudflare Workers static assets with no server process needed, matching ADR 0003.
- React's component model matches the fixed, known section list naturally (one component per section).
- Avoids paying for Next.js's SSR/routing machinery when there is nothing in this project that needs it.

## Consequences

- **Easier**: consistent styling via Tailwind, typed content, fast local dev via Vite's hot module reload, small dependency footprint.
- **Harder**: Rose needs the Tailwind + Vite config already in place (handled once by Dragon's scaffold at the Repository stage, not something each developer re-does).
- **Risk accepted**: if this project ever grows into an actual multi-page site, a routing decision (e.g. adding React Router, or moving to Next.js) will be needed then — accepted as a non-issue today since multi-page is explicitly out of scope (Discovery).

## Rules for developers

- Use functional React components with TypeScript (`.tsx`); no class components.
- Style with Tailwind CSS utility classes; don't introduce another CSS methodology (styled-components, CSS modules, plain global CSS beyond Tailwind's base layer) without discussing it with Dragon first.
- One component per section (Hero, About, Skills, Experience, Projects, OtherExperience, EducationCertifications, Contact), composed in `src/App.tsx` in the agreed order.
- Keep dependencies minimal — this is a static marketing page, not an application; justify any new dependency against the bundle-size guideline in rules.md.
