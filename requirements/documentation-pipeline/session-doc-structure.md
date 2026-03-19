---
title: Session Doc Structure
status: active
acceptance:
  - Session docs are valid markdown files with YAML frontmatter
  - Frontmatter includes all required fields: date, topic, tags, significance, transcript
  - The tags field uses only values from the SessionTag controlled vocabulary (philosophy, agent-design, architecture, tooling, workflow, domain, meta)
  - The significance field uses only values from the Significance controlled vocabulary (low, medium, high)
  - The date field is an ISO 8601 date
  - The transcript field is a path to the primary transcript file
  - The body contains a prose narrative organized by topic
---

# Session Doc Structure

Session documents produced by Scribe must conform to the `SessionDoc` schema defined in the domain ontology. Each session doc is an `Artifact<SessionDoc>` stored as a markdown file with structured YAML frontmatter.

The frontmatter fields use controlled vocabularies defined in the ontology:

- **tags** — one or more `SessionTag` values categorizing the session's topics
- **significance** — a `Significance` value indicating how important the session was to the project's development

These controlled vocabularies ensure session docs are consistently categorized and machine-filterable across the corpus.
