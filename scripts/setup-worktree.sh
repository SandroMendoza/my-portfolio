#!/usr/bin/env bash
# Create or reuse a per-teammate git worktree for this repo, so each
# Agent Office session works from its own isolated checkout instead of
# sharing one working directory (which causes concurrent `git checkout`/
# push collisions — see docs/operations/working-in-parallel.md).
#
# Usage:
#   scripts/setup-worktree.sh <agent-id> [start-branch]
#
#   <agent-id>      Required. A short, stable slug for the session, e.g.
#                   rose-frontend-developer, yuki-devops-engineer. Matches
#                   the teammate names in .claude/agents.
#   [start-branch]  Optional. Branch to create the worktree from, only
#                   used the FIRST time this agent-id's worktree is
#                   created. Defaults to origin/development. Ignored if
#                   the worktree already exists — an existing worktree
#                   keeps whatever branch it's currently on.
#
# Safe to run every time you start or resume a session: if the worktree
# already exists, it just fetches and prints the path.
#
# Run this from any existing checkout of the repo (the original shared
# clone, or another worktree) — git worktree add uses the shared .git
# regardless of where you invoke it from.

set -euo pipefail

AGENT_ID="${1:-}"
START_BRANCH="${2:-development}"

if [ -z "$AGENT_ID" ]; then
  echo "Usage: scripts/setup-worktree.sh <agent-id> [start-branch]" >&2
  echo "Example: scripts/setup-worktree.sh rose-frontend-developer" >&2
  exit 1
fi

# Only allow a safe slug — this becomes a directory name and a branch name.
case "$AGENT_ID" in
  *[!a-zA-Z0-9_-]*|"")
    echo "error: agent-id must only contain letters, numbers, - and _ (got: $AGENT_ID)" >&2
    exit 1
    ;;
esac

# Use the shared .git dir (--git-common-dir), not --show-toplevel — the
# latter returns whichever worktree you happen to be running this from,
# which would nest worktrees-of-worktrees if invoked from inside one.
COMMON_GIT_DIR="$(git rev-parse --path-format=absolute --git-common-dir)"
REPO_ROOT="$(dirname "$COMMON_GIT_DIR")"
REPO_NAME="$(basename "$REPO_ROOT")"
WORKTREES_ROOT="$(dirname "$REPO_ROOT")/${REPO_NAME}-worktrees"
TARGET="${WORKTREES_ROOT}/${AGENT_ID}"

mkdir -p "$WORKTREES_ROOT"

# Drop stale entries (e.g. a worktree folder that was deleted by hand).
git -C "$REPO_ROOT" worktree prune

if git -C "$REPO_ROOT" worktree list --porcelain | grep -qx "worktree ${TARGET//\\//}"; then
  echo "Reusing existing worktree for '${AGENT_ID}'."
  git -C "$TARGET" fetch origin --quiet
else
  echo "Creating a new worktree for '${AGENT_ID}'..."
  git -C "$REPO_ROOT" fetch origin --quiet

  PERSONAL_BRANCH="workspace/${AGENT_ID}"
  if git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/${PERSONAL_BRANCH}"; then
    # Reusing a personal branch from a previous session on this machine.
    git -C "$REPO_ROOT" worktree add "$TARGET" "$PERSONAL_BRANCH"
  elif git -C "$REPO_ROOT" show-ref --verify --quiet "refs/remotes/origin/${PERSONAL_BRANCH}"; then
    git -C "$REPO_ROOT" worktree add "$TARGET" -b "$PERSONAL_BRANCH" "origin/${PERSONAL_BRANCH}"
  else
    git -C "$REPO_ROOT" worktree add "$TARGET" -b "$PERSONAL_BRANCH" "origin/${START_BRANCH}"
  fi
fi

echo
echo "Worktree ready: $TARGET"
echo "cd into it, then create/switch to your actual feature branch as usual:"
echo "  cd \"$TARGET\""
echo "  git checkout -b feature/<MP-KEY>-<short-name>   # or: git checkout <existing-branch>"
echo
echo "Don't check out 'development' or 'main' in your worktree — fetch and read"
echo "origin/development instead (git log origin/development), and merge/release"
echo "through 'gh pr merge' / the release PR, which don't need a local checkout."
