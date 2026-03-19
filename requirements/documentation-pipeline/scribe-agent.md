---
title: Scribe Agent
status: active
acceptance:
  - A scribe agent exists that consumes Transcript artifacts from the Transcript ArtifactStore
  - Scribe produces a single Artifact<SessionDoc> per transcript
  - The artifact conforms to the SessionDoc schema
  - Scribe reads the full transcript before writing anything
  - Scribe does not invent content beyond what is in the transcript
  - Scribe does not modify any files other than the session doc it is producing
---

# Scribe Agent

The system must include a scribe agent that consumes raw session transcripts from the Transcript ArtifactStore and transforms them into structured session documentation. Scribe is a batch processing agent — it reads, synthesizes, and writes. It has no interactive role.

Scribe consumes `Artifact<Transcript>` and produces `Artifact<SessionDoc>` deposited in the SessionDoc ArtifactStore.
