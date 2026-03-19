---
title: Herald Agent
status: active
acceptance:
  - A herald agent exists that reads structured session documentation
  - Herald produces a single Artifact<Publication> per invocation
  - The artifact conforms to the Publication schema defined in the domain ontology
  - Herald surveys the full session corpus via frontmatter before selecting relevant sessions
  - Herald reads selected sessions in chronological order before writing
  - Herald output is grounded in session documentation — no invented content
  - Herald does not modify session docs or transcripts
  - Herald writes for an outside audience interested in AI-enabled development practices
---

# Herald Agent

The system must include a herald agent that synthesizes accumulated session documentation into outward-facing published content. Herald is a publishing agent — it reads source material and produces a written artifact. It has no interactive role.

Herald is modeled as a `Herald` Operator in the domain ontology, with a single `HeraldOperation` that produces `Artifact<Publication>` artifacts deposited in the Publication ArtifactStore.
