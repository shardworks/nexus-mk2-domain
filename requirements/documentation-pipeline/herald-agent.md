---
title: Herald Agent
status: active
acceptance:
  - A herald agent exists that consumes structured session documentation
  - Herald produces a single Artifact<Publication> per invocation
  - The artifact conforms to the Publication schema
  - Herald surveys the full session corpus via frontmatter before selecting relevant sessions
  - Herald reads selected sessions in chronological order before writing
  - Herald output is grounded in session documentation — no invented content
  - Herald does not modify session docs or transcripts
  - Herald writes for an outside audience interested in AI-enabled development practices
---

# Herald Agent

The system must include a herald agent that synthesizes accumulated session documentation into outward-facing published content. Herald is a publishing agent — it consumes session docs and produces a written artifact. It has no interactive role.

Herald consumes `Artifact<SessionDoc>` from the SessionDoc ArtifactStore and produces `Artifact<Publication>` deposited in the Publication ArtifactStore.
