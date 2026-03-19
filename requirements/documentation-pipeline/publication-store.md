---
title: Publication Artifact Store
status: active
acceptance:
  - Publication artifacts are stored as markdown files at nexus-mk2-notes/herald/<yyyy-mm-dd>-<slug>.md
  - Each file has YAML frontmatter that conforms to the Publication schema
  - Publications are stored in the nexus-mk2-notes repository, not the main project repository
---

# Publication Artifact Store

The publication artifact store is implemented as markdown files in the `nexus-mk2-notes` repository. Publications use a flat directory with date-prefixed filenames (`herald/<yyyy-mm-dd>-<slug>.md`) for simple chronological ordering.
