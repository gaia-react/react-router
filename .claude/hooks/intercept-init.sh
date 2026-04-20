#!/bin/bash
# Redirect the built-in /init command to /gaia-init on this template.
# Fires on UserPromptSubmit. Exit 2 + stderr = blocking message to Claude.

prompt=$(jq -r '.prompt // ""' < /dev/stdin)

if [[ "$prompt" =~ ^/init([[:space:]]|$) ]]; then
  cat >&2 <<'MSG'
This project is already configured for Claude Code (CLAUDE.md, .claude/commands, .claude/rules, .claude/hooks all present).

Do NOT run the built-in /init — it would overwrite the curated CLAUDE.md.

Instead, invoke the /gaia-init skill to strip the example scaffolding and give the user a clean slate.
MSG
  exit 2
fi

exit 0
