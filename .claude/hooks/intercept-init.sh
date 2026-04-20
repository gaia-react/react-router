#!/bin/bash
# Redirect the built-in /init command to /gaia-init on this template.
# Fires on UserPromptSubmit. Exit 2 + stderr = blocking message to Claude.

prompt=$(jq -r '.prompt // ""' < /dev/stdin)

if [[ "$prompt" =~ ^/init([[:space:]]|$) ]]; then
  cat >&2 <<'MSG'
The user's /init has been intercepted by a project hook. This is a GAIA React template — the built-in /init would overwrite the curated CLAUDE.md.

REQUIRED NEXT ACTION: Immediately call the Skill tool with skill="gaia-init" to run the template's initialization. Do not ask for confirmation. Do not tell the user to run it themselves. Do not explain what you are about to do beyond one short sentence. Just call the Skill tool now.
MSG
  exit 2
fi

exit 0
