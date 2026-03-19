---
title: Publication Structure
status: active
acceptance:
  - Publications are valid markdown files with YAML frontmatter
  - Frontmatter includes all required fields: date, type, scope, sessions
  - The type field uses only values from the PublicationType controlled vocabulary (recap, deep-dive, status-update, blog-post)
  - The date field is an ISO 8601 date
  - The sessions field is a list of paths to the session docs that were synthesized
  - The body contains a prose narrative written for an outside audience
---

# Publication Structure

Publications produced by Herald must conform to the `Publication` schema defined in the domain ontology. Each publication is an `Artifact<Publication>` stored as a markdown file with structured YAML frontmatter.

The frontmatter provides traceability back to the source material — the `sessions` field lists which session docs were synthesized into the publication, and the `scope` field describes the coverage in human-readable terms.
