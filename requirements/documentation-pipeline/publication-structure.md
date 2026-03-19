---
title: Publication Structure
status: active
acceptance:
  - Publications are valid markdown files with YAML frontmatter
  - Frontmatter conforms to the Publication schema
  - The type field uses only values from the PublicationType controlled vocabulary
  - The body contains a prose narrative written for an outside audience
---

# Publication Structure

Publications produced by Herald must conform to the `Publication` schema. Each publication is an `Artifact<Publication>` stored as a markdown file with structured YAML frontmatter.

The frontmatter provides traceability back to the source material — the `sessions` field lists which session docs were synthesized into the publication, and the `scope` field describes the coverage in human-readable terms.
