---
title: Task Selection
status: draft
acceptance:
  - The builder selects exactly one failing requirement from the audit report to work on
  - The selection rationale is stated in the commit body or agent output
  - If no requirements are failing, the builder exits cleanly without making changes
---

# Task Selection

When multiple requirements are failing, the builder must select one to work on. The builder uses its own judgment to choose — weighing factors like estimated complexity, likely impact, and dependency relationships between requirements.

The builder must state why it chose the requirement it did, so that the decision can be reviewed by humans or other agents.