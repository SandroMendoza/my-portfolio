# 0003 — Hosting: Cloudflare Workers static assets, with GitHub Actions CI/CD

**Date**: 2026-10-14
**Status**: Accepted (2026-10-14)

## Context

Sandro is an indie developer and wants this project on a free hosting plan (project brief; standing Agent Office hosting default). The site is fully static with no backend needs (ADR 0001). The team's standing default is: Cloudflare Workers static assets for projects with no backend, no other-language/long-running/CPU-heavy work, and no database — which is exactly this project's shape. The team also needs a development environment the user/QA can check before it goes live, matching the `feature/<KEY>-<name>` → `development` → `main` branching model used across Agent Office projects.

## Options considered

**A. Cloudflare Workers static assets (not Pages).**
Free, global edge CDN, native Wrangler environments give clean dev/prod separation, and it's the team's standard default for backend-less projects — consistent tooling with other Agent Office projects.

**B. Render free web service (static site).**
Also free, but the team's standing default reserves Render (+ Neon) for projects that need a real server — another language, long-running/CPU-heavy work, or more than Workers' limits. None of that applies here, so choosing Render would add a second platform to learn for no benefit.

**C. GitHub Pages.**
Free and simple, but has no first-class way to separate a development/staging environment from production without extra workarounds, and doesn't align with the Wrangler-based tooling used elsewhere on this team.

## Decision

**Option A** — Cloudflare Workers static assets, with two Wrangler environments (`development`, `production`), deployed via GitHub Actions.

## Reasons

- It's free, matching the brief's requirement for a free plan.
- It matches the team's standing default for projects with no backend need.
- Wrangler environments map directly onto the branching model: `development` branch → `development` environment (what Sandro/Potchie check before release), `main` → `production` environment.
- Keeps tooling consistent with how other Agent Office projects are set up (same Wrangler-based workflow).

## Consequences

- **Easier**: zero hosting cost, fast global delivery from Cloudflare's edge, one platform and one config file (`wrangler.jsonc`) to maintain.
- **Harder**: the site ships on a free `*.workers.dev` subdomain by default — a custom domain requires Sandro to separately buy and attach one. CI needs to hold a Cloudflare API token as a secret.
- **Risk/limits accepted**: the Workers Free plan includes about 100,000 requests/day of Worker invocations and short CPU time per request. For a static personal-portfolio site with no Worker logic (pure static asset serving) and realistically low traffic, this limit is not expected to matter. If this project ever adds an API Worker, this limit becomes directly relevant and should be revisited then.

## Rules for developers

- Exactly two Wrangler environments — `development` and `production` — defined in `wrangler.jsonc`.
- GitHub Actions deploys the `development` environment on push/merge to the `development` branch, and the `production` environment on push/merge to `main`. No manual or local deploys to production.
- The Cloudflare API token lives only as the GitHub Actions repository secret `CLOUDFLARE_API_TOKEN`; never commit it or any token to the repo.
- Branching model: `feature/<MP-KEY>-<short-name>` → `development` → `main`.

## Follow-up decision

Sandro confirmed (2026-10-14) he'll use the free `*.workers.dev` subdomain for now rather than a custom domain. A custom domain can be attached later without any architecture change — just a Cloudflare DNS/Workers routing config update.
