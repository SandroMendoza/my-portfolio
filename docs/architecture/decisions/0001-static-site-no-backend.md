# 0001 — Static site, no backend or database

**Date**: 2026-10-14
**Status**: Accepted (2026-10-14)

## Context

Discovery is approved for this project (Notion: [Product Overview](https://app.notion.com/p/3f92582d747381c18931d32efc33a522)). The requirements it sets are:

- Contact section shows only an email address — explicitly no contact form (Must #6, confirmed in the Out of scope list).
- Projects section is fixed descriptive content: one linked project (KC Art Gallery → a GitHub repo) and two description-only cards for private work projects (Musts #4–5).
- The resume is a PDF file to open/download (Must #2–3).
- Out of scope: contact form, multi-page/routing/blog, analytics/tracking, two different "modes" for the two audiences.

No requirement anywhere calls for persisted or dynamic data, user accounts, or server-side logic. Sandro is an indie developer who wants this to run for free and stay simple to maintain (project brief).

## Options considered

**A. Static frontend only — no API, no database.**
Every "Must" requirement is satisfiable with static content and static asset links. Zero ongoing cost, zero server to maintain or secure.

**B. Add a lightweight backend (e.g. a Worker API) now**, anticipating a future contact form or CMS-driven content.
More flexible for features that might come later, but builds infrastructure for a requirement that is explicitly out of scope today (the contact form), adding build time and surface area for no current benefit.

**C. Full framework with SSR + a headless CMS.**
Would let Sandro edit content through a UI, but is a large amount of infrastructure (CMS account, fetch/render pipeline) for an 8-section page that changes a few times a year at most.

## Decision

**Option A** — the project is a static frontend only. No backend API, no database, no authentication, for v1.

## Reasons

- Every Must-have requirement in Discovery is met by static content, static asset links (resume PDF), and a `mailto:` link — none require server-side logic.
- Matches "prefer the simplest design that meets the requirements" — there is no need today that a backend would serve.
- Keeps the project free to run and keeps the Build stage to front-end tickets only (no backend developer needed on this project, per the Agent Office default for a portfolio/static site).

## Consequences

- **Easier**: no server to maintain, secure, or pay for; no database to back up; no API surface to version; Tickets/Build stage only needs front-end work.
- **Harder**: updating content requires a code change and redeploy rather than a CMS UI — accepted, since Sandro's resume content changes infrequently.
- **Risk accepted**: if a future requirement needs dynamic behavior (e.g. a contact form with spam protection, or CMS-editable content), this decision will need to be revisited with a new ADR before any backend code is added.

## Rules for developers

- No API routes, no database client, and no server-side code in this repository for v1.
- All content changes are made by editing `src/content/*.ts` and redeploying.
- If a future requirement appears to need dynamic/server-side behavior, raise it with Dragon for a new ADR before adding backend code — don't work around this rule quietly.
