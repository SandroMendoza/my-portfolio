# My Portfolio — Architecture Overview

## Summary

A single-page static portfolio site for Sandro Mendoza, built from his resume, for use in job applications (primarily Backend Developer, secondarily roles like Amazon VA). The whole product is one static front end — there is **no backend API, no database, and no authentication** for v1. This follows directly from Discovery: contact is an email link (no form), Projects content is fixed text/links (no dynamic data), the resume is a static PDF, and analytics/multi-page/dark-mode are explicitly out of scope.

See ADR 0001 for the full reasoning behind "no backend."

## Components

There is one deployable component:

- **Frontend static site** — React + TypeScript, built by Vite into static HTML/CSS/JS, styled with Tailwind CSS (ADR 0002). Deployed as Cloudflare Workers static assets (ADR 0003).

There is no backend service and no database in this architecture.

## How it communicates

- Browser → Cloudflare edge: plain HTTPS GET requests for static HTML/CSS/JS/images/the resume PDF. No XHR/fetch calls to any API — there is nothing to call.
- **Download Resume**: a direct link to a static PDF asset shipped in the build (`/resume/Sandro-Mendoza-Resume.pdf`). No backend endpoint serves or generates it.
- **Contact**: a `mailto:sandro.p.mendoza@gmail.com` link. Opens the visitor's own mail client; nothing passes through our infrastructure.
- **KC Art Gallery** project card: a hard-coded external link to `https://github.com/SandroMendoza/kc-art-gallery`, opened in a new tab. Not a live API lookup.

## Where data lives

- **Portfolio content** (headline, About text, skills, experience, project descriptions, education, contact email) lives as typed TypeScript objects in `src/content/`, committed to the repo and bundled at build time. See ADR 0004.
- **Resume file** lives as a static binary asset in the repo under `public/resume/`, version-controlled in git.
- No user data is collected or stored anywhere (no forms, no analytics, no cookies beyond what Cloudflare itself may set at the edge).
- The only secret in this project is the Cloudflare API token used by CI to deploy — stored as a GitHub Actions repository secret, never in the repo.

## API conventions / OpenAPI

Not applicable for v1 — there is no API. If a future requirement needs server-side logic (e.g. a contact form with spam protection, or a CMS-backed content), that will require a new ADR superseding ADR 0001, and an OpenAPI spec would then live at `backend/openapi.yaml`.

## Authentication

Not applicable — there are no user accounts, no admin panel, no protected routes.

## Data storage

Not applicable in the traditional sense — "data" is static, typed content shipped in the build (ADR 0004). No database (SQL or otherwise) is used or needed.

## Testing tools

Vitest + React Testing Library for component tests, run via `npm run test`. See ADR 0005. No end-to-end test runner is required for v1; Potchie covers responsive/manual QA across breakpoints.

## Hosting

- **Development**: Cloudflare Workers static assets, `development` Wrangler environment, deployed automatically from the `development` branch. This is the environment Sandro/Potchie check before release.
- **Production**: Cloudflare Workers static assets, `production` Wrangler environment, deployed automatically from `main`.
- Both are on Cloudflare's free plan. See ADR 0003 for reasoning and free-plan limits.

## CI/CD

GitHub Actions:
- On every pull request: install deps, run `npm run test`, run `npm run build`. Must pass before merge.
- On push/merge to `development`: build and deploy to the `development` Wrangler environment.
- On push/merge to `main`: build and deploy to the `production` Wrangler environment.

## Infrastructure as code

The Wrangler config file (`wrangler.jsonc`) is the infrastructure definition for this project — it declares the Worker, its static assets directory, and the two environments. No separate IaC tool (e.g. Terraform) is needed at this scale.

## Secrets manager

No application secrets exist (no DB credentials, no third-party API keys) because there is no backend. The one operational secret — the Cloudflare API token used to deploy — is stored as an encrypted GitHub Actions repository secret (`CLOUDFLARE_API_TOKEN`). No dedicated secrets manager is needed for a project this size.

## Branching model

`feature/<MP-KEY>-<short-name>` → `development` → `main`, per the team standard. Development branch deploys the test/review environment; main deploys production.

## Folder structure (planned, created at the Repository stage)

```
my-portfolio/
  public/
    resume/
      Sandro-Mendoza-Resume.pdf
    favicon.svg
  src/
    main.tsx
    App.tsx
    content/
      types.ts
      resume.ts          # skills, experience, projects, education, contact data
    components/
      ui/                 # shared cross-section primitives (added MP-1):
                          # Button, Chip, SectionHeading, CondensedListRow
      Nav/
      Hero/
      About/
      Skills/
      Experience/
      Projects/
      OtherExperience/
      EducationCertifications/
      Contact/
    styles/
      global.css          # Tailwind directives
  design/
    screen-specs.md        # KC's approved screen spec (copied in post-MP-1)
  docs/
    architecture/         # copied in at Repository stage (this folder)
    operations/
      deployment.md        # Yuki's deploy runbook
  .github/
    workflows/
      ci-cd.yml
  wrangler.jsonc
  vite.config.ts
  tailwind.config.ts
  tsconfig.json
  package.json
  README.md
```

`src/components/ui/` holds components shared across multiple sections (e.g. the Button/Chip/SectionHeading/CondensedListRow primitives KC's design spec calls out in §1). The "one component per section" guideline in rules.md is about the 8 page-section components, not these shared primitives — reviewed and approved during the MP-1 PR review (see ADR context in that PR).

No `backend/` folder exists in this repo — see ADR 0001.

## Non-functional notes

- **Performance**: fully static bundle, no heavy UI kit, optimized/responsive images, lazy-load below-the-fold images. Target a fast first paint since recruiters skim quickly (Discovery goal: "clear first impression in under 2 minutes").
- **Responsiveness**: must have no horizontal scroll at any breakpoint (Discovery requirement #7) — Tailwind's responsive utilities plus Potchie's manual device/breakpoint testing.
- **Reliability**: static assets served from Cloudflare's global edge; no server-side logic to fail. The "resume fails to load" edge case (an open question in Discovery, owned by Gellie/KC) is a client-side fallback UI concern for Rose to implement once KC specs the exact behavior.
- **Cost**: targets $0/month on Cloudflare's free plan (see ADR 0003 for limits).
- **Security**: no user input is collected, so there's no server-side attack surface. Standard security headers are still set at the Worker/static-assets config as a guideline.

## Open questions for the user

- Resolved (2026-10-14): ship on the free `*.workers.dev` subdomain for now; a custom domain can be attached later without an architecture change.

## Links

- Notion project hub: https://app.notion.com/p/3f92582d74738177bc75fe33f4986982
- Notion Product Overview: https://app.notion.com/p/3f92582d747381c18931d32efc33a522
- Jira project: MP — https://sandromendoza.atlassian.net/jira/software/projects/MP/boards

## Decisions

See `docs/architecture/decisions/` for full reasoning. All five are **Accepted** (2026-10-14).

- 0001 — Static site, no backend or database
- 0002 — Frontend stack: React + Vite + TypeScript + Tailwind CSS
- 0003 — Hosting: Cloudflare Workers static assets (dev/prod environments) + GitHub Actions CI/CD
- 0004 — Content stored as typed data modules, no CMS
- 0005 — Testing: Vitest + React Testing Library
