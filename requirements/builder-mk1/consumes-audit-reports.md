---
title: Consumes Audit Reports
status: draft
acceptance:
  - The builder reads the most recent Artifact<AuditReport> from the AuditReport ArtifactStore
  - The builder extracts all verdicts with a result of "fail"
  - The builder does not run audits itself; it operates on existing audit data
---

# Consumes Audit Reports

The builder must read the most recent audit report from the AuditReport ArtifactStore to determine which requirements are failing. The audit report is the builder's sole source of truth for what needs to be done — it does not independently evaluate requirements.
