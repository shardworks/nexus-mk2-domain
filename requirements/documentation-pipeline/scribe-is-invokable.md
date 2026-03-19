---
title: Scribe Is Invokable
status: active
acceptance:
  - A shell script exists at bin/scribe.sh that invokes scribe for a single transcript
  - bin/scribe.sh accepts a primary transcript path and optional pre-compaction snapshot paths
  - bin/scribe.sh validates that all provided files exist before invoking the agent
  - A shell script exists at bin/scribe-all.sh that batch-processes all pending transcripts
  - bin/scribe-all.sh groups each primary transcript with its associated pre-compaction snapshots
  - bin/scribe-all.sh moves processed transcripts to the archived directory on success
---

# Scribe Is Invokable

Scribe must be invokable via shell scripts so that transcript processing can be triggered by humans or automation without knowledge of the underlying agent mechanics.

- **Single transcript:** `bin/scribe.sh <transcript.jsonl> [<precompact.jsonl> ...]`
- **Batch (all pending):** `bin/scribe-all.sh` — discovers and processes all pending transcripts, then archives them.
