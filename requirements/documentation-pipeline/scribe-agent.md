---
title: Scribe Agent
status: draft
priority: high
acceptance:
  - A scribe agent exists that reads raw session transcripts in JSONL format
  - Scribe produces a single structured markdown session doc per transcript
  - Session docs include YAML frontmatter with date, topic, tags, significance, and transcript path
  - Session docs include a prose body organized by topic with decisions, outcomes, and open questions
  - Scribe reads the full transcript before writing anything
  - Scribe does not invent content beyond what is in the transcript
  - Scribe does not modify any files other than the session doc it is producing
---

# Scribe Agent

The system must include a scribe agent that transforms raw Claude Code session transcripts into structured session documentation. Scribe is a batch processing agent — it reads, synthesizes, and writes. It has no interactive role.

## Output Structure

Session docs are written to `nexus-mk2-notes/sessions/<yyyy-mm>/<dd>/<slug>.md` with:

- **Frontmatter** — date, topic, tags (from a controlled vocabulary), significance level, and transcript path
- **Body** — a readable narrative account of the session, organized by topic, capturing decisions, rationale, and deferred questions
- **Open Items / Next Steps** (optional) — unresolved design questions or concrete TODOs
- **Herald Notes** (optional) — material flagged for the publishing stage, written for an outside audience
