# 0004 — Content stored as typed data modules (no CMS, no database)

**Date**: 2026-10-14
**Status**: Accepted (2026-10-14)

## Context

Discovery's content is fixed and already approved — headline, About text, skills, experience bullets, project descriptions, education, and the contact email are all "locked in" (Product Overview, Decision log, 2026-10-14). It changes rarely: only when Sandro updates his resume. ADR 0001 established there is no backend, so any content-editing mechanism must work without a server.

## Options considered

**A. Typed TypeScript data modules in `src/content/`** (e.g. `resume.ts` exporting typed arrays/objects for skills, experience, projects, education), imported directly by components.

**B. Markdown/MDX files, parsed at build time.**
Nicer for long-form prose editing, but this content is mostly structured lists (skills grouped by category, experience bullets, project cards) rather than long-form text, so Markdown parsing adds a build-time dependency without a clear benefit.

**C. A headless CMS** (e.g. a free tier of Contentful/Sanity).
Would let Sandro edit content through a UI without a code change, but adds an external account, a fetch-at-build (or worse, at-runtime) step, and real operational complexity for content that changes at most a few times a year.

## Decision

**Option A** — typed TypeScript data modules in `src/content/`, with shapes defined in `src/content/types.ts`.

## Reasons

- The content is structured (grouped skills, a list of experience bullets, a list of project cards) more than prose, so plain typed objects are a natural, low-friction fit.
- TypeScript gives compile-time safety — a missing or misshapen field fails the build instead of shipping a broken section.
- Zero added dependencies, accounts, or runtime fetches — matches "prefer the simplest design that meets the requirements."
- Trivial to review: a content change is a plain diff in a pull request.

## Consequences

- **Easier**: type-checked content, no extra services to manage, straightforward code review for content changes.
- **Harder**: Sandro needs a pull request (via Rose, or done himself later) to update content, rather than a CMS editing UI — accepted, since updates are infrequent.
- **Risk accepted**: if Sandro later wants to self-serve content edits without any code change, that would need a new ADR (most likely Option C) — not needed today.

## Rules for developers

- All section content (skills, experience, projects, education, contact) lives in `src/content/*.ts`, typed via interfaces in `src/content/types.ts`.
- Components read from `src/content/`; never hardcode resume content inline in JSX.
- No CMS and no runtime content fetch for v1.
