---
title: Single Task Scope
status: draft
acceptance:
  - The builder addresses exactly one failing requirement per invocation
  - The builder exits after completing (or failing to complete) the selected requirement
  - The builder does not select additional requirements after completing one
---

# Single Task Scope

The builder works on exactly one failing requirement per invocation, then exits. It does not loop through multiple failures or select additional work after completing a task.

## Rationale

The outer audit-build loop is the system's iteration mechanism: audit → build → audit → build. Keeping each build invocation focused on a single requirement makes the loop predictable, the git history traceable, and failures attributable to specific requirements. Multi-requirement builds would conflate changes and make it harder to determine what worked and what didn't.
