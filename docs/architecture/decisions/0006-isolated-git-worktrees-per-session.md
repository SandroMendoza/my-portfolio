# 0006 — Isolate concurrent agent sessions with one git worktree per session

**Date**: 2026-10-14
**Status**: Accepted (2026-10-14)

## Context

Agent Office runs each teammate (and sometimes more than one session at a time) against the same project repository, https://github.com/SandroMendoza/my-portfolio. Every session so far has worked directly inside one shared clone at `C:\Users\Ghel\Documents\projects\my-portfolio`. A plain git working directory can only have one branch checked out at a time — when two sessions run `git checkout <branch>` in that same directory concurrently, each checkout silently rewrites the working tree and the checked-out branch out from under whatever the other session is doing.

This has now caused three documented incidents in one Build-stage day:
- **Rose** (MP-1 build): the working directory was switched to another session's branch mid-build; no work was lost because Rose had already pushed, but the local state was briefly wrong.
- **Dragon** (architecture review follow-up): a docs commit appeared to vanish from the local working copy moments after being made, because another session's checkout had switched the directory to a different branch; again, already pushed, so nothing was actually lost.
- **Potchie** (MP-1 QA): two confirmed *wrong intermediate results* in one QA session — `tailwind.config.ts`/`global.css` briefly read back as pre-MP-1 stub content, and `npm run test` reported "no test files found" because the directory had been switched to an unrelated branch mid-command. Potchie only caught both because of manual re-verification after every single command; left unchecked, this would have produced a false bug report or a false passing QA result.

Sandro is an indie developer on free-tier infrastructure; any fix should be proportionate — this is a one-person project with a handful of concurrent agent sessions, not a large engineering org, so the fix shouldn't add material cost or ongoing operational burden.

## Options considered

**A. One git worktree per concurrent agent session** (`git worktree add`), all backed by a single shared `.git` object store from one canonical clone.
Each worktree has its own independent working directory and its own checked-out branch; a `git checkout` in one worktree cannot touch another worktree's files or branch. Worktrees share the repo's object database, so adding one is fast and cheap on disk compared to a full clone. The one shared-state caveat: truly repo-global operations (pruning worktrees, `git gc`, editing `.git/config`) still act on the one shared `.git`, so those stay single-owner operations, not something run from inside a feature worktree.

**B. One full `git clone` per concurrent agent session**, each in its own directory with no shared `.git`.
Fully independent — zero risk of any git-level cross-session interference, not even the minor shared-state caveat Option A has. But every clone duplicates the full history on disk and needs its own `git fetch`/`pull` to stay current. For this repo's size the extra disk/time cost is trivial, but it's strictly more moving parts to keep in sync than worktrees, for no additional safety benefit at this scale.

**C. Keep one shared working directory, add process discipline** (e.g. "re-check your branch before every command").
Zero infrastructure change — but this is what Potchie was already doing during MP-1 QA, re-verifying after every command, and it still let two wrong intermediate results through in a single session. The race between two agent sessions' git commands is faster than manual re-checking can reliably catch, and it gets worse, not better, as more sessions run concurrently. Rejected: already proven insufficient, not a hypothetical risk.

## Decision

**Option A** — one git worktree per concurrent agent session, added from a single canonical clone. Every session that runs git commands against this repo works only inside its own worktree directory, never the shared root clone, and never shares a worktree with another concurrent session.

## Reasons

- It removes the exact failure mode that has already hit three different teammates in one day: each worktree's checked-out branch is independent, so one session's `git checkout` can no longer rewrite another session's working tree.
- It costs negligible extra disk/setup versus full clones (Option B), which fits "prefer the simplest design that meets the requirements" for a free-tier, one-person project — there's no proportionate reason to pay the extra sync overhead of N independent clones when worktrees solve the actual problem.
- It keeps exactly one place (the canonical clone) that fetches from GitHub and owns repo-global git state, rather than N clones independently tracking remote state and potentially drifting.

## Consequences

- **Easier**: concurrent sessions can safely run `git checkout`/`test`/`lint`/`build` without racing each other; QA and architecture-review results become trustworthy without Potchie's manual re-verification ritual; starting a new concurrent session is a one-line `git worktree add`.
- **Harder**: Yuki needs to provision and remove a worktree as each session starts/stops — a small amount of operational bookkeeping that didn't exist before. Whoever runs a truly repo-global git operation (pruning worktrees, `git gc`, editing `.git/config`) must do it from the canonical clone, coordinated with Yuki, not from inside a feature worktree.
- **Risk accepted**: this does not protect against two sessions deliberately checking out the *same* branch in two different worktrees and racing commits on it — that's an ordinary multi-developer-on-one-branch conflict, unrelated to the bug fixed here, and is handled the normal way (pull before push, PR review, one feature branch per ticket).

## Rules for developers

- Every agent session that runs git commands against this repo works from its own git worktree — never the shared root clone directly, and never a worktree another concurrent session is already using.
- Don't run repo-global git operations (`git worktree prune`, `git gc`, editing `.git/config`) from inside a feature worktree — those happen once, from the canonical clone, coordinated with Yuki.
- If you catch yourself re-running `git branch --show-current` to "double check" because you suspect the working directory moved under you, that's a sign you're not in an isolated worktree — stop and get one instead of working around it.
