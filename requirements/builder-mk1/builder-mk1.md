---
title: Builder Mk1
status: draft
acceptance:
  - A builder agent exists that reads audit reports and implements changes to satisfy failing requirements
  - The builder consumes the most recent Artifact<AuditReport> from the AuditReport ArtifactStore
  - The builder selects one failing requirement, implements changes, and exits
  - The builder does not modify domain-owned files (requirements, ontology)
---

# Builder Mk1

The system must include a builder operator that closes the audit-fix loop. The builder reads the most recent audit report, selects a failing requirement, implements code changes to satisfy it, and exits. It is the system's mechanism for autonomous self-improvement.

## Rationale

The audit loop (audit → identify gaps → fix → re-audit) requires an agent that can act on audit findings. Without a builder, every failing requirement requires manual human intervention. The builder makes the loop self-sustaining for requirements that can be satisfied through code changes.

## Scope

The builder:

- Reads the most recent audit report to identify failing requirements.
- Selects one failing requirement to work on per invocation.
- Implements code changes (create, modify, or delete files) to satisfy the selected requirement.
- Commits and pushes changes to main.
- Exits after completing work on the single selected requirement.

The builder does not:

- Run audits. It works from existing audit reports.
- Loop through multiple failing requirements in a single invocation.
- Modify domain-owned files (requirements or the ontology).
