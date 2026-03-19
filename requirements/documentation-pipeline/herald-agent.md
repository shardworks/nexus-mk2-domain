---
title: Herald Agent
status: active
acceptance:
  - A herald agent exists that reads structured session documentation
  - Herald produces outward-facing markdown narratives (blog posts, recaps, deep-dives, status updates)
  - Herald surveys the full session corpus via frontmatter before selecting relevant sessions
  - Herald reads selected sessions in chronological order before writing
  - Herald output is grounded in session documentation — no invented content
  - Herald does not modify session docs or transcripts
  - Herald writes for an outside audience interested in AI-enabled development practices
---

# Herald Agent

The system must include a herald agent that synthesizes accumulated session documentation into outward-facing published content. Herald is a publishing agent — it reads source material and produces a written artifact. It has no interactive role.

## Output

Herald produces markdown files at `nexus-mk2-notes/herald/<yyyy-mm-dd>-<slug>.md` with frontmatter indicating the content type, scope, and source sessions. Output formats include recaps, deep-dives, status updates, and blog posts — determined by the invocation prompt.

## Process

Herald follows a strict read-then-write sequence: survey the corpus via frontmatter, select relevant sessions, read them in chronological order, then write thematically. The Herald Notes sections in session docs are written specifically for Herald and should be prioritized as source material.
