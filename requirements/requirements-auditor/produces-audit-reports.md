---
title: Produces Audit Reports
status: draft
priority: high
acceptance:
  - The auditor produces an Artifact of type "audit-report"
  - The artifact conforms to the Artifact<AuditReport> schema defined in the domain ontology
  - The report contains a summary field with a prose overview of findings
  - The report contains a verdict for every registered requirement
  - Each verdict includes a requirementId, a result (pass/fail/unknown), and an evidence array
---

# Produces Audit Reports

The auditor must produce structured audit reports that conform to the domain ontology's `Artifact<AuditReport>` schema. Reports must be machine-readable and contain enough information for other agents or humans to understand the current compliance state without re-running the audit.
