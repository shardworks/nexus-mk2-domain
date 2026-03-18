---
title: Auditor Agent
status: draft
priority: high
acceptance:
  - An auditor agent exists that can read the requirements registry
  - The auditor produces a structured report covering every registered requirement
  - Each requirement in the report is assessed as met, not met, or unclear
  - Assessments include evidence or reasoning
  - The auditor makes no changes to the project
---

# Auditor Agent

The system must include an auditor agent that evaluates the current state of the project against the requirements registry and produces a structured compliance report.

## Rationale

The auditor is the bootstrap mechanism for the entire system loop: audit → identify gaps → make changes → re-audit. Without a reliable way to compare project state to stated requirements, all other automation is ungrounded.

## Scope

The auditor agent:

- Reads the requirements index and each requirement's prose and acceptance criteria.
- Inspects the project's current state (code, configuration, documentation) to assess whether each requirement is met.
- Produces a report that, for each requirement, states one of: **met**, **not met**, or **unclear** — with evidence or reasoning for the assessment.
- Does not make changes to the project. Its role is observation and reporting only.
