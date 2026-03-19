# Ontology — Open Questions

Unresolved vocabulary and design questions. Items stay here until resolved and reflected in `index.ts`.

## Agent-adjacent terminology

**Status:** unresolved

"Agent" is defined: a running Claude Code instance with `-p`. But there are several related concepts that don't have settled names yet:

- **The configuration/blueprint** — the `.claude/agents/*.md` file that defines an agent's model, system prompt, tools, and permissions. Is this an "AgentType"? "AgentConfig"? Something else?
- **The role/purpose** — the abstract function an agent serves (e.g., "auditing"). Is this captured by the Operator concept? Is it a "Role"? "AgentRole"? Does it need its own term at all, or is it just the Operator's identity?
- **The relationship between these** — an Agent (running instance) is launched from a config, which serves a role/purpose. How many layers of naming do we actually need here?

Tension: too few terms and we're ambiguous in conversation. Too many and we're maintaining distinctions nobody uses.

## Structured acceptance criteria on Requirements

**Status:** sketched in design-notes.md (2026-03-18)

Currently `Requirement.acceptance` is `readonly string[]` — freeform prose. This is only LLM-evaluable, not mechanically checkable.

Observation: when acceptance criteria reference ontology terms (AuditReport, Verdict, etc.), they become candidates for formal, verifiable assertions. The ontology vocabulary is what makes the jump from "prose an LLM interprets" to "assertion an agent can check" possible.

Not yet proposing a structured acceptance type. Needs more concrete requirements to see what patterns emerge. For now: use ontology terms consistently in acceptance criteria strings to keep the door open.

## ArtifactTypeName ↔ content type mapping

**Status:** deferred

The link between `"audit-report"` (the ArtifactTypeName string) and `AuditReport` (the TypeScript content type) is currently implicit — you have to look at the ArtifactStoreRegistry to see the connection. A type-level map (e.g., `{ "audit-report": AuditReport }`) could make this compile-time checkable, so that an Operation declaring `artifactType: "audit-report"` is statically linked to `Artifact<AuditReport>`. This would require mapped types, which were previously deferred. Revisit when we have a second artifact type.

## Future effect kinds

**Status:** candidates identified (2026-03-19)

Two future effect kinds have been identified but deferred until a concrete operator drives the need:

- **notifies** — signals a human or external system. Distinct from `produces` (ephemeral vs persistent, action-oriented vs record-keeping). Add when a monitor or alerting operator is built.
- **invalidates** — declares that an operation's output makes some other artifact stale. Add when implicit staleness reasoning proves insufficient.

See design-notes.md "Future Effect Candidates" for full rationale.

## Resolved

### ~~Replace Auditor.audit() with operation/effect declarations~~

**Resolved:** 2026-03-18. Replaced with Operation/Effect model.

### ~~"modifies" effect kind~~

**Resolved:** 2026-03-19. After analysis of a dozen potential operators and their effects, the generic "modifies/mutates" concept was replaced with the domain-specific `implements` effect for the builder. The builder's relationship to requirements is the defining characteristic of its effect — it doesn't just change code, it changes code *in response to requirements*. Generic mutation effects (for operators without a requirements relationship) can be added when needed. See design-notes.md "Effect Design Principles" for the guiding policy.

### ~~Retrieval from ArtifactStores~~

**Resolved:** 2026-03-19. The `consumes` effect kind addresses the input side of data flow. Operations declare which ArtifactStores they read from via `ConsumesEffect`, making the dependency graph explicit. Ambient inputs (codebase, requirements) are not declared — they are available to any operator by default.

### ~~"reads" effect — source vocabulary~~

**Resolved:** 2026-03-19. Renamed to `consumes` as the natural counterpart to `produces`. Scoped exclusively to managed artifact types (`artifactType: ArtifactTypeName`), eliminating the mixed-string problem. Non-artifact inputs (codebase, requirements) are ambient context, not declared effects.
