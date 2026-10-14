# Deploying My Portfolio

## When to use it

Reference this whenever you need to deploy, roll back, or understand what the CI/CD pipeline does. Normal day-to-day deploys happen automatically through GitHub Actions — you shouldn't need to run anything by hand.

## Before you start

- Access: a GitHub account with write access to `SandroMendoza/my-portfolio`.
- No local Cloudflare login is needed for normal deploys — CI holds the credentials. `wrangler` is only used locally for one-off checks (e.g. `npx wrangler deployments list --env production`), which requires `wrangler login` or a local `CLOUDFLARE_API_TOKEN` env var.

## How deployment works

1. Every pull request into `development` or `main` runs `.github/workflows/ci-cd.yml`:
   - **Build, lint & test** — `npm ci`, `npm run lint` (TypeScript typecheck), `npm run test` (Vitest), `npm run build` (production build). All must pass before merge.
   - **Security scan** — `npm audit --omit=dev --audit-level=high` (production dependency check — currently just `react`/`react-dom`) and a TruffleHog secret scan of the diff.
2. On push/merge to `development` (after the PR checks above pass): the pipeline builds again and runs `wrangler deploy --env development`, publishing to the `my-portfolio-development` Cloudflare Worker (static assets).
3. On push/merge to `main`: same, but deploys `--env production` to `my-portfolio-production`.
4. Cloudflare Workers static assets serve directly from the edge — there's no separate "release" step beyond the deploy itself.

Both environments are defined in `wrangler.jsonc` (see ADR 0003). Both are on Cloudflare's free plan — no cost.

## Environment variables / secrets

| Name | Where it lives | Purpose |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | GitHub Actions repository secret | Lets CI deploy via Wrangler. Never committed to the repo. |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions repository secret | Identifies which Cloudflare account to deploy to. |

There are no application-level secrets — this is a static site with no backend (ADR 0001).

To rotate the Cloudflare API token: generate a new token in the Cloudflare dashboard, then
```
gh secret set CLOUDFLARE_API_TOKEN --repo SandroMendoza/my-portfolio
```
(paste the new value when prompted — never pass it as a visible `--body` argument in a shared terminal). Revoke the old token in Cloudflare afterward.

## How to check it worked

- GitHub Actions tab on the repo shows the workflow run; all jobs green means it deployed.
- The `deploy-development` / `deploy-production` job log prints the `*.workers.dev` URL Wrangler published to.
- Open the deployed URL and confirm the page loads and the hero/resume link work.

## Rollback

Cloudflare Workers keeps previous deployments. To roll back without touching git history:

```
npx wrangler deployments list --env production
npx wrangler rollback --env production --message "Rollback: <reason>" <deployment-id>
```
(swap `production` for `development` as needed). This requires a local Cloudflare API token (ask Yuki, or run `wrangler login` if you have dashboard access).

Alternative (preferred for anything but an emergency): revert the merge commit in git and let CI redeploy the previous version. Both `main` and `development` are branch-protected (PR-only, no direct pushes), so this goes through a PR like any other change —
```
git checkout -b revert/<short-reason>
git revert -m 1 <merge-commit-sha>
git push -u origin revert/<short-reason>
gh pr create --base main --head revert/<short-reason> --title "Revert: <short-reason>"
# wait for the two required checks (Build, lint & test / Security scan) to pass, then
gh pr merge --squash --delete-branch
```
(target `development` instead of `main` for a dev-only rollback). This keeps the deployed artifact and the git history in sync, which the rollback-via-Wrangler path doesn't.

## Who to tell

- Tell Sandro before rolling back production (it's user-facing).
- No one else needs to be paged — this is a single-maintainer static site with no on-call rotation.

## Branch protection

Both `main` and `development` are protected (set up 2026-10-14, after Sandro chose to make the repo public to unlock this — GitHub's Free plan doesn't allow branch protection on a private repo):

- Pull request required before merging (no direct pushes, including for admins — `enforce_admins` is on).
- Two required status checks: `Build, lint & test` and `Security scan (deps & secrets)`.
- No force pushes, no branch deletion.
- No mandatory human-approval count (`required_approving_review_count: 0`) since this is a single-maintainer project — the required checks are the gate, not a second reviewer.

## Known gaps (tracked, not blocking)

- **Dev-dependency vulnerabilities**: `npm audit` currently reports advisories in the `vite`/`vitest`/`tailwindcss`/`wrangler` toolchains (dev-only, not shipped in the built bundle). Fixing them requires major-version upgrades (Vite 5→8, Vitest 2→5, Tailwind 3→4, Wrangler 3→4) that touch Dragon's accepted stack decisions (ADR 0002, ADR 0005) and Rose's existing Tailwind usage — flagged to Dragon as a backlog item rather than force-upgraded unilaterally.
