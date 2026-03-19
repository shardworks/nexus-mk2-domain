---
title: Requirements Review
date: 2026-03-19
status: backlog
notes: Findings from a deep analysis of the requirements registry. Actionable cleanup items.
---

# Requirements Review

Analysis of the current requirements registry for duplications, contradictions,
unmeasurable invariants, and structural issues.

## Contradiction (fix first)

**Scribe cardinality mismatch.** `documentation-pipeline/scribe` says each
invocation consumes *one* Artifact<StagedTranscript>. `scribe-loop/reconciliation`
says the loop dispatches the Scribe with *all* of a session's staged transcripts
(primary and precompact). A session can have multiple staged transcripts, so
these can't both be right.

## Exact Duplications

1. **Hot reload (audit-loop and build-loop).** `audit-loop/hot-reload` and
   `build-loop/hot-reload` have identical invariants and identical notes,
   word for word. Should be a single shared requirement or one should
   reference the other.

2. **Priority ordering (assessments and audit-loop).** `assessments/freshness`
   invariants 4–6 restate the same ordering rules as `audit-loop/priority`
   in slightly different words. An implementation satisfying one necessarily
   satisfies the other.

## Cross-Feature Overlaps

1. **Feature locking.** `build-loop/reconciliation` invariant 3 restates
   `builder/feature-locking` from the caller's perspective.

2. **Commit gating.** `build-loop/reconciliation` invariant 5 overlaps with
   `builder/boundaries` invariant 2 — both constrain the builder to act
   only on current assessments.

3. **Commit hash validity.** `assessments/conformance` invariant 2 overlaps
   with `auditor/assessment-production` invariant 1 — one says the auditor
   writes commit hashes, the other says they must be valid.

## Unmeasurable Invariants

These invariants cannot be objectively verified by an auditor:

- `documentation-pipeline/scribe`: "grounded in transcript content — no invented content"
- `documentation-pipeline/herald`: "grounded in session documentation — no invented content"
- `documentation-pipeline/herald`: "Publications are written for an outside audience"
- `builder/traceability`: "Every Builder commit body describes what was changed and why"
- `artifact-cli/latest-artifact`: "exits with… a clear message"
- `artifact-cli/delete-artifact`: "exits with… a clear message"
- `dispatcher/discoverability`: "documented in a way that is accessible to both humans and agents"

The groundedness invariants are the most problematic — they ask an AI auditor
to judge whether another AI hallucinated. The "clear message" and "accessible"
invariants have no threshold.

## Definitions Masquerading as Invariants

`assessments/freshness` invariants 2–3 define what "invalidated" and "stale"
mean. These are vocabulary definitions, not behavioral requirements. They
belong in the ontology as documentation on Assessment.

## Deprecated Noise

Four deprecated requirements remain with no active function:

- `auditor/coverage`
- `auditor/report-conformance`
- `build-loop/continuous-operation`
- `build-loop/change-detection`

Related: `audit-report` is still in the ArtifactTypeName union and
ArtifactStoreRegistry despite no active requirement producing audit reports.

## Global Requirement Without Clear Audit Strategy

`environment/compliance` applies to all scripts, agent instructions, and
operator implementations. It's a negative universal ("must not contain
hardcoded values") that requires scanning every file for every environment
variable. Needs a practical audit strategy or narrower scope.
