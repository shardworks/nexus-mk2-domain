---
title: JSON File-Based Artifact Store
status: draft
priority: high
acceptance:
  - Audit report artifacts are stored as JSON files at .artifacts/audit-report/<id>.json
  - Each file is valid JSON that parses to an Artifact<AuditReport>
  - The artifact id is an ISO 8601 compact timestamp used as both the id field and filename
  - The .artifacts directory is gitignored
---

# JSON File-Based Artifact Store

The audit report artifact store must be implemented as flat JSON files on the local filesystem. This keeps the implementation simple, human-inspectable, and free of external dependencies. The `.artifacts` directory is generated output and should not be committed to version control.
