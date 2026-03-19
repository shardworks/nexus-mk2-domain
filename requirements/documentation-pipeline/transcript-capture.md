---
title: Transcript Capture
status: active
acceptance:
  - An on_stop hook copies the session transcript to the pending transcripts directory on each response
  - An on_pre_compact hook saves a pre-compaction snapshot before context compaction occurs
  - Both hooks only fire for human-facing agent types (main, coco)
  - Transcripts are archived to nexus-mk2-notes/transcripts/pending/<session-id>.jsonl
  - Pre-compaction snapshots are archived to nexus-mk2-notes/transcripts/pending/<session-id>.precompact.<timestamp>.jsonl
  - Hooks exit gracefully when transcript path is missing or empty
---

# Transcript Capture

Session transcripts must be automatically captured during human-facing agent sessions via Claude Code hooks. Two hooks work together to preserve transcript fidelity:

- **on_stop** fires when Claude finishes responding, copying the current transcript to the pending directory. This runs on every response, so the archive is a rolling snapshot until the session ends.
- **on_pre_compact** fires before context compaction, saving a timestamped snapshot. Auto-compaction summarizes earlier turns and loses detail — this hook preserves the full transcript before that happens.

Both hooks filter by agent type so that autonomous worker agents (scribe, herald, auditor, etc.) don't generate transcript archives.
