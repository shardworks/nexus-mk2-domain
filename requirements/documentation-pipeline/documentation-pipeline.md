---
title: Documentation Pipeline
status: draft
priority: high
acceptance:
  - Session transcripts are automatically captured during human-facing agent sessions
  - Captured transcripts can be processed into structured session documentation
  - Session documentation can be synthesized into outward-facing published content
  - Each stage of the pipeline (capture → processing → publishing) is independently invokable
---

# Documentation Pipeline

The system must include a documentation pipeline that captures session activity and transforms it into structured, publishable knowledge. The pipeline flows through three stages:

1. **Capture** — Hooks automatically archive raw session transcripts during human-facing agent sessions.
2. **Processing** — Scribe synthesizes raw transcripts into structured session documentation for internal use.
3. **Publishing** — Herald synthesizes session documentation into outward-facing narratives (blog posts, recaps, deep-dives) for an external audience.

## Rationale

Nexus Mk II is a documented experiment. The documentation pipeline ensures that session-level knowledge is preserved, organized, and eventually published — without requiring manual note-taking during sessions. Each stage adds structure and audience-awareness on top of the raw material.
