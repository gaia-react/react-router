---
type: decision
status: active
priority: 3
date: 2026-09-07
created: 2026-09-07
updated: 2026-09-07
tags: [decision, ci, github-actions]
---

# Decision: Composite Action Step Timeouts

Most workflows that provision Node route through the shared composite action `.github/actions/gaia-setup-node`; the action's own docblock names the callers deliberately left out and why. A step-level `timeout-minutes` on the caller bounds the whole composite; without one, a stalled pnpm registry fetch or Node tarball download runs until the owning job's own cap fires. The job then reds with a generic job-timeout message attributed to no step, which on a declared-required context blocks a pull request with a failure pointing at nothing, and the obvious next move (re-run) doesn't diagnose it.

## Rule

Every call site that `uses: ./.github/actions/gaia-setup-node` carries its own `timeout-minutes`, set strictly under its job's own cap so the step fires first and names the install rather than the job. The value is sized against that step's measured warm-cache runtime, not against the job's headroom: five minutes where the step installs the whole workspace, three where it only provisions Node and warms the pnpm store.

Both halves are enforced upstream, in GAIA's own CI, across every workflow under `.github/workflows/` rather than only the workflow the rule was originally written against: every `gaia-setup-node` call site carries a cap, and that cap sits under its job's. That check's subject set is derived from the workflow directory rather than a hand-named list, so a call site added without a cap fails it rather than going unnoticed. An adopter clone does not run it, so a call site added there is held to this rule by the rule alone.

<!-- gaia:maintainer-only:start -->
The enforcing check is test W12 in `.gaia/tests/lib/audit-ci-shards.bats`.
<!-- gaia:maintainer-only:end -->

`tests.yml` and `chromatic.yml` are shipped, adopter-facing workflows, so this bound reaches an adopter's own CI on their next `/update-gaia`; an adopter whose install is larger than the measured baseline may need to raise the cap.

<!-- gaia:maintainer-only:start -->
## Pairs with

- [[Sharded CI Test Matrix]]: a different, job-level `timeout-minutes` ceiling on the dispatched-audit path; that page's zero-headroom arithmetic is unrelated to this per-step composite-action bound.
<!-- gaia:maintainer-only:end -->
