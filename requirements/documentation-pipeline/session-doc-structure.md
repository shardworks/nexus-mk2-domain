---
title: Session Doc Structure
status: active
acceptance:
  - Session docs are valid markdown files with YAML frontmatter
  - Frontmatter conforms to the SessionDoc schema
  - The tags field uses only values from the SessionTag controlled vocabulary
  - The significance field uses only values from the Significance controlled vocabulary
  - The body contains a prose narrative organized by topic
---

# Session Doc Structure

Session documents produced by Scribe must conform to the `SessionDoc` schema. Each session doc is an `Artifact<SessionDoc>` stored as a markdown file with structured YAML frontmatter.

Frontmatter fields use controlled vocabularies:

- **tags** — one or more `SessionTag` values categorizing the session's topics
- **significance** — a `Significance` value indicating how important the session was to the project's development

These controlled vocabularies ensure session docs are consistently categorized and machine-filterable across the corpus.
