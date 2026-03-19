---
title: One Build Per Audit Cycle
status: draft
acceptance:
  - The builder does not implement changes against an audit report that has already been acted on
  - If the most recent audit report has already been addressed by a previous build, the builder exits cleanly without making changes
---

# One Build Per Audit Cycle

The builder must not operate on a stale audit report. If the most recent audit report has already been acted on by a previous build invocation, the builder exits cleanly — a new audit must be run before the next build.

## Rationale

The audit report is a point-in-time snapshot. After a build changes the codebase, the audit report no longer reflects reality — some previously-failing requirements may now pass, and previously-passing requirements may have been broken by the changes. Building against a stale report risks duplicate work, conflicting changes, or wasted effort on requirements that are already satisfied.

The expected workflow is strictly sequential: audit → build → audit → build. Each build gets a fresh audit. This constraint is enforced by the builder, not by external tooling.