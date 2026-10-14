# Architecture Rules — My Portfolio

Every developer on this project reads this file. Firm rules must be followed; guidelines are strong defaults that can be discussed with Dragon if a real need arises.

## Firm rules

1. **No backend API and no database.** All content lives in `src/content/` as typed TypeScript data, bundled at build time. (ADR 0001)
2. **Contact section is email-only** — no contact form, no phone number, no GitHub link there. (Discovery, Product Overview)
3. **Frontend stack is React + Vite + TypeScript + Tailwind CSS.** Don't introduce another framework (e.g. Next.js, Vue) or a heavy component library without a new/updated ADR. (ADR 0002)
4. **Hosting is Cloudflare Workers static assets**, not Cloudflare Pages. Exactly two Wrangler environments: `development` (deploys from the `development` branch) and `production` (deploys from `main`). (ADR 0003)
5. **Branching model**: `feature/<MP-KEY>-<short-name>` → `development` → `main`. Merge to `development` for review/staging; merge to `main` via PR to release to production.
6. **The resume PDF is a static asset** committed under `public/resume/`; it is linked directly and never proxied through application logic.
7. **No secrets at runtime.** The only secret is the Cloudflare API token used by CI to deploy, stored as the GitHub Actions repository secret `CLOUDFLARE_API_TOKEN` — never commit it or any token to the repo.
8. **No analytics or tracking scripts** (Discovery: explicitly out of scope).
9. **All section content** (skills, experience, projects, education, contact) lives in `src/content/*.ts`, typed via `src/content/types.ts`. Components read from there — never hardcode resume content inline in JSX. (ADR 0004)
10. **CI must pass before merge.** GitHub Actions runs `npm run test` and `npm run build` on every pull request.
11. **One git worktree per concurrent agent session.** Never work directly in the shared root clone, and never share a worktree with another concurrent session — a plain shared working directory lets one session's `git checkout` silently rewrite another session's files and checked-out branch mid-task, which has already produced wrong QA results once. Repo-global git operations (`git worktree prune`, `git gc`, editing `.git/config`) happen once from the canonical clone, coordinated with Yuki. (ADR 0006)

## Guidelines

- Keep the page to one scroll, sections in the agreed order: Hero, About, Skills, Experience, Projects, Other Experience, Education & Certifications, Contact.
- Keep bundle size small; don't add a UI kit or animation library unless it clearly earns its weight (subtle motion is a "Could," not a "Must").
- Use functional React components with TypeScript (`.tsx`); no class components.
- Style with Tailwind utility classes; avoid mixing in another CSS methodology (styled-components, CSS modules) without discussing it with Dragon first.
- One component per section, composed in `src/App.tsx` in the agreed order.
- Co-locate component tests next to the component (e.g. `Hero.test.tsx` next to `Hero.tsx`); prefer Vitest + React Testing Library. (ADR 0005)
- Optimize images (WebP/responsive sizes) and lazy-load below-the-fold images.
