---
title: Requirements Auditor
status: draft
acceptance:
  - An auditor agent exists that can read the requirements registry
  - The auditor evaluates every registered requirement regardless of status
  - Each requirement in the report is assessed as pass, fail, or unknown
  - Assessments include concrete evidence or reasoning
  - The auditor makes no changes to the project
---

# Requirements Auditor

The system must include an auditor that evaluates the current state of the project against the requirements registry and produces a structured compliance report.

## Rationale

The auditor is the bootstrap mechanism for the entire system loop: audit → identify gaps → make changes → re-audit. Without a reliable way to compare project state to stated requirements, all other automation is ungrounded.

## Scope

The auditor:

- Reads all requirement files, including their prose descriptions and acceptance criteria.
- Inspects the project's current state (code, configuration, documentation) to assess whether each requirement is met.
- Produces a report with a summary and per-requirement verdicts.
- Does not make changes to the project. Its role is observation and reporting only.
