# My Portfolio

Sandro Mendoza's single-page personal portfolio site, built from his resume, for use in job applications (primarily Backend Developer roles, secondarily roles such as Amazon VA).

This is a **static front end only** — there is no backend API and no database. See `docs/architecture/overview.md` for the full reasoning.

## Stack

- React + TypeScript, built with Vite
- Tailwind CSS
- Vitest + React Testing Library for component tests
- Hosted on Cloudflare Workers static assets (separate `development` and `production` environments)
- CI/CD via GitHub Actions

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run test      # run component tests
npm run build     # production build to dist/
npm run deploy:dev   # deploy to the development Wrangler environment
npm run deploy:prod  # deploy to the production Wrangler environment
```

## Project structure

```
public/
  resume/        # the resume PDF, served as a static file
src/
  content/       # typed resume content (skills, experience, projects, education, contact)
  components/    # one folder per page section
  styles/        # Tailwind entry point
docs/
  architecture/  # architecture overview, rules, and decision records (owned by Dragon)
```

There is no `backend/` folder in this repo — see `docs/architecture/decisions/0001-static-site-no-backend.md`.

## Architecture

Read `docs/architecture/rules.md` before contributing. It lists the firm rules and guidelines every change must follow. Full reasoning for each decision is in `docs/architecture/decisions/`.

## Branching

`feature/<MP-KEY>-<short-name>` → `development` → `main`. Pull requests target `development` (the default branch). Merging to `development` deploys the development environment; merging `development` into `main` deploys production.

## Project management

- Jira project: MP — https://sandromendoza.atlassian.net/jira/software/projects/MP/boards
- Notion hub: https://app.notion.com/p/3f92582d74738177bc75fe33f4986982
