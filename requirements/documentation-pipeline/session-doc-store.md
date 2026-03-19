---
title: Session Doc Artifact Store
status: active
acceptance:
  - Session doc artifacts are stored as markdown files at nexus-mk2-notes/sessions/<yyyy-mm>/<dd>/<slug>.md
  - Each file has YAML frontmatter that conforms to the SessionDoc schema
  - The directory structure organizes session docs by year-month and day
  - Session docs are stored in the nexus-mk2-notes repository, not the main project repository
---

# Session Doc Artifact Store

The session doc artifact store is implemented as markdown files in a date-based directory tree within the `nexus-mk2-notes` repository. This keeps session documentation separate from the main project codebase while maintaining a browsable, chronological structure.

The path convention `sessions/<yyyy-mm>/<dd>/<slug>.md` makes it easy to find sessions by date and provides a natural grouping for batch operations.
