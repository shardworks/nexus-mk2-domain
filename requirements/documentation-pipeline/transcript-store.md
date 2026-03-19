---
title: Transcript Artifact Store
status: active
acceptance:
  - Transcript artifacts are stored as JSONL files at nexus-mk2-notes/transcripts/pending/<session-id>.jsonl
  - Pre-compaction snapshots are stored alongside primaries at nexus-mk2-notes/transcripts/pending/<session-id>.precompact.<timestamp>.jsonl
  - Processed transcripts are moved to nexus-mk2-notes/transcripts/archived/ after successful scribe processing
  - Transcripts are stored in the nexus-mk2-notes repository, not the main project repository
---

# Transcript Artifact Store

The Transcript ArtifactStore is implemented as JSONL files in the `nexus-mk2-notes` repository. Raw transcripts are deposited into a `pending` directory by capture hooks, and moved to `archived` after successful processing by Scribe.

The pending/archived split serves as a simple processing queue — Scribe discovers unprocessed transcripts by reading from `pending`, and the move to `archived` on success prevents reprocessing.
