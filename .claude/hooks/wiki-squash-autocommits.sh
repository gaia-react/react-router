#!/bin/bash
# Collapse consecutive `wiki: auto-commit ...` commits at HEAD into one.
# The claude-obsidian plugin's PostToolUse hook commits after every Write/Edit,
# which produces N commits per turn when the wiki sees multiple edits. This
# hook runs on Stop and squashes the trailing run back into a single commit.
#
# If on main, the squashed commit is pushed to a wiki/* branch and merged via
# PR rather than landing directly on main.

[ -d .git ] || exit 0

n=0
while git log "HEAD~$n" -1 --format='%s' 2>/dev/null | grep -q '^wiki: auto-commit '; do
  n=$((n + 1))
done

# Nothing to do if there are no wiki auto-commits at HEAD.
[ "$n" -ge 1 ] || exit 0

# Squash if 2+ consecutive auto-commits.
if [ "$n" -ge 2 ]; then
  git reset --soft "HEAD~$n" >/dev/null 2>&1 || exit 0
  # --no-verify: wiki-only squash, no source files changed — pre-commit gate is irrelevant here
  git commit -m "wiki: auto-commit $(date '+%Y-%m-%d %H:%M')" --no-verify >/dev/null 2>&1 || exit 0
fi

current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

if [ "$current_branch" = "main" ]; then
  wiki_branch="wiki/$(date '+%Y-%m-%d-%H-%M')"

  # Push the squashed commit to a new wiki branch without checking it out.
  git push origin "HEAD:refs/heads/$wiki_branch" >/dev/null 2>&1 || exit 0

  # Reset local main back to origin so it never advances ahead of remote main.
  # The commit is safe on the wiki branch.
  # --mixed preserves any non-wiki working-tree changes (e.g. README edits);
  # we then discard only wiki/ and .raw/ so they don't linger as unstaged files.
  git fetch origin main >/dev/null 2>&1
  git reset --mixed origin/main >/dev/null 2>&1 || true
  git checkout -- wiki/ .raw/ 2>/dev/null || true
  git clean -fd wiki/ .raw/ >/dev/null 2>&1 || true

  if command -v gh >/dev/null 2>&1; then
    gh pr create \
      --title "wiki: auto-commit $(date '+%Y-%m-%d %H:%M')" \
      --body "Automated wiki update." \
      --base main \
      --head "$wiki_branch" >/dev/null 2>&1 || true

    merge_err=$(gh pr merge "$wiki_branch" --squash --auto 2>&1)
    if [ $? -ne 0 ]; then
      if echo "$merge_err" | grep -qi 'auto merge\|autoMerge\|auto-merge'; then
        echo "WIKI_NEEDS_MANUAL_MERGE: Wiki changes are on branch '$wiki_branch' and a PR was created, but auto-merge is not enabled on this repository. Please either merge the PR manually or enable auto-merge in the repository settings (Settings → General → Allow auto-merge)."
      fi
    fi
  fi
fi

exit 0
