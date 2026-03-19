---
title: Scribe Agent
status: active
acceptance:
  - A scribe agent exists that reads raw session transcripts in JSONL format
  - Scribe produces a single Artifact<SessionDoc> per transcript
  - The artifact conforms to the SessionDoc schema defined in the domain ontology
  - Scribe reads the full transcript before writing anything
  - Scribe does not invent content beyond what is in the transcript
  - Scribe does not modify any files other than the session doc it is producing
---

# Scribe Agent

The system must include a scribe agent that transforms raw Claude Code session transcripts into structured session documentation. Scribe is a batch processing agent — it reads, synthesizes, and writes. It has no interactive role.

Scribe is modeled as a `Scribe` Operator in the domain ontology, with a single `ScribeOperation` that produces `Artifact<SessionDoc>` artifacts deposited in the SessionDoc ArtifactStore.
