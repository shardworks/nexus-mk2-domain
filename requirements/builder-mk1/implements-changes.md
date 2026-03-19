---
title: Implements Changes
status: draft
acceptance:
  - The builder creates, modifies, or deletes files as needed to satisfy the selected requirement
  - All changes are committed in a single atomic commit
  - The commit subject line follows the format "implements <requirement-id>"
  - The commit body describes what was changed and why
  - The builder pushes the commit to main
---

# Implements Changes

The builder modifies the codebase to satisfy the selected failing requirement. It may create new files, modify existing files, or delete files — whatever the requirement demands.

## Commit Convention

All changes for a single build invocation are committed in one atomic commit. This overrides the general "commit early and often" guidance — the builder's unit of work is a single requirement, which is already atomic at the domain level.

The commit message format:

```
implements <requirement-id>

<description of what was changed and why>
```

Example:

```
implements requirements-auditor/json-file-based-store

Added a JSON file store under artifacts/audit-reports/ with
read/write functions conforming to ArtifactStore<AuditReport>.
```

This format makes builder commits identifiable via `git log --grep="^implements "` and traceable to specific requirements.

## Failure

If the builder cannot satisfy the requirement, it exits without committing. It does not push partial or speculative changes.