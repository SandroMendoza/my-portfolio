# Working in parallel: one git worktree per session

## When to use it

Every time an Agent Office session (any teammate, any number of concurrent sessions) is about to run git commands against this repo. Read this before your first `git` command in a new session, not after something looks wrong.

## Why this exists

Agent Office runs each teammate's session against the same project repo. Until 2026-10-14, every session worked directly inside one shared clone at `C:\Users\Ghel\Documents\projects\my-portfolio`. A plain working directory can only have one branch checked out at a time — when two sessions run `git checkout <branch>` in that same directory concurrently, each checkout silently rewrites the working tree and the checked-out branch out from under whatever the other session is doing.

This caused three real incidents in one Build-stage day (Rose, Dragon, and Potchie all hit it — Potchie's case produced wrong intermediate QA results, not just an inconvenience). See ADR 0006 (`docs/architecture/decisions/0006-isolated-git-worktrees-per-session.md`) for the full writeup and the options considered. The fix: **one git worktree per concurrent session**, never the shared root clone.

## Before you start

- Git Bash (this repo's commands assume POSIX `sh`, matching how every teammate's Bash tool runs on this Windows machine).
- No new accounts/tools/approvals needed — `git worktree` is part of core git, nothing to install.

## Steps

1. From any existing checkout of this repo (the canonical clone at `C:\Users\Ghel\Documents\projects\my-portfolio`, or another worktree — the script finds the shared `.git` automatically), run:
   ```
   bash scripts/setup-worktree.sh <your-agent-id>
   ```
   Use the same `<your-agent-id>` every time you resume this teammate's session — e.g. `rose-frontend-developer`, `potchie-qa-engineer`, `yuki-devops-engineer` (matching the names in `.claude/agents`). This is what makes the script idempotent: the same agent-id always maps to the same worktree, so resuming a session reuses your existing in-progress branch instead of creating a new one.
2. The script prints the worktree path — something like `C:\Users\Ghel\Documents\projects\my-portfolio-worktrees\<your-agent-id>`. `cd` into it. **Every git command for the rest of this session happens from inside that directory, never the shared root clone.**
3. Inside your worktree, check out your real working branch as usual — e.g. `git checkout -b feature/MP-7-contact-section` for ticket work, or `git checkout <existing-branch>` to resume one. The worktree starts on a personal scratch branch (`workspace/<your-agent-id>`) that's just a safe starting point; move off it onto the branch your actual task needs.
4. Work, commit, push, open PRs exactly as before — none of that changes. Only the *directory* you run it from changes.
5. Don't check out `development` or `main` inside your worktree. You don't need to: read the latest state with `git log origin/development` / `git fetch origin` instead, and merges/releases go through `gh pr merge` or the release PR, neither of which needs a local checkout of the target branch. (If you genuinely need a local build of `development` — e.g. to run `npm run dev` against it — fetch and check it out temporarily in your own worktree, then switch back; don't do this in someone else's worktree or the shared root clone.)

## How to check it worked

- `git worktree list` (from any worktree) shows one line per active worktree, each on a different branch, each at its own path under `my-portfolio-worktrees\`.
- `git branch --show-current` inside your worktree always matches what you last checked out there — nothing else can change it out from under you, because no other session can touch your directory.
- If you ever catch yourself re-running `git branch --show-current` "just to double check" because you suspect something changed — that's the old symptom. It means you're working in the shared root clone, not your own worktree. Stop and run the setup script.

## Cleaning up

- Worktrees are cheap to leave around (they share the repo's object store — no meaningful disk cost beyond `node_modules` per worktree). There's no need to remove one just because a session paused.
- To remove a worktree that's genuinely done (e.g. a one-off session that won't resume): `git worktree remove <path>` from the canonical clone, then `git branch -d <branch>` if its branch merged, or `-D` if you're intentionally discarding it.
- `git worktree prune` clears stale entries if a worktree folder was deleted by hand instead of via `git worktree remove`. The setup script runs this automatically before creating a new worktree.

## Repo-global operations — canonical clone only, coordinated with Yuki

Worktrees share one `.git` behind the scenes. A few operations act on that shared state, not just your own worktree, and should only ever run from the canonical clone at `C:\Users\Ghel\Documents\projects\my-portfolio` — never from inside a feature worktree:

- `git worktree prune` / `git worktree remove` for another session's worktree
- `git gc`
- editing `.git/config` directly

If you need one of these, ask Yuki rather than running it yourself from your own worktree.

## Rollback

If the worktree convention itself ever needs to be undone (it shouldn't, but just in case): `git worktree remove` each worktree, then everyone goes back to working in the shared clone. There's no data-loss risk either way — a worktree is just an additional working directory on the same shared history; removing one never touches commits that have been pushed to `origin`.

## Who to tell

- No approvals needed to use this day-to-day — just follow the steps above for every new or resumed session.
- Tell Yuki if `scripts/setup-worktree.sh` doesn't work for your situation (e.g. you need a worktree under a different parent path) rather than working around it by hand in the shared clone.
