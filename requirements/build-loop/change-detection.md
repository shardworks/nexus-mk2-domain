---
title: Change Detection
status: draft
acceptance:
  - The loop does not re-run the audit if nothing has changed since the last audit
  - A change is defined as any new commit in the project repository or the domain repository
  - When a change is detected, the loop runs a full audit on the next iteration
  - When no change is detected, the loop skips the audit and sleeps
---

# Change Detection

The build loop must detect whether the project or its requirements have changed before re-running an audit. If neither the project repository nor the domain repository has changed since the last audit, the loop skips the audit and sleeps. This avoids redundant audits and wasted compute.

## What counts as a change

A change is any new commit in either of the two repositories the system depends on:

- **Project repository** — the codebase the builder modifies.
- **Domain repository** — the requirements and ontology the auditor evaluates against.

The detection mechanism is an implementation detail. The requirement is that the loop does not re-audit an unchanged system.
