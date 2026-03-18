# Ontology — Open Questions

Unresolved vocabulary and design questions. Items stay here until resolved and reflected in `index.ts`.

## Agent-adjacent terminology

**Status:** unresolved

"Agent" is defined: a running Claude Code instance with `-p`. But there are several related concepts that don't have settled names yet:

- **The configuration/blueprint** — the `.claude/agents/*.md` file that defines an agent's model, system prompt, tools, and permissions. Is this an "AgentType"? "AgentConfig"? Something else?
- **The role/purpose** — the abstract function an agent serves (e.g., "auditing"). Is this captured by the Operator concept? Is it a "Role"? "AgentRole"? Does it need its own term at all, or is it just the Operator's identity?
- **The relationship between these** — an Agent (running instance) is launched from a config, which serves a role/purpose. How many layers of naming do we actually need here?

Tension: too few terms and we're ambiguous in conversation. Too many and we're maintaining distinctions nobody uses.

## ~~Replace Auditor.audit() with operation/effect declarations~~

**Status:** resolved (2026-03-18)

Replaced `audit(): Promise<AuditReport>` with the Operation/Effect model. Auditor now declares `readonly operations: readonly [AuditOperation]` where AuditOperation has a "produces" effect targeting "audit-report". The method signature is gone; the ontology now describes what the operation *causes* rather than how to *invoke* it.

## Structured acceptance criteria on Requirements

**Status:** sketched in design-notes.md (2026-03-18)

Currently `Requirement.acceptance` is `readonly string[]` — freeform prose. This is only LLM-evaluable, not mechanically checkable.

Observation: when acceptance criteria reference ontology terms (AuditReport, Verdict, etc.), they become candidates for formal, verifiable assertions. The ontology vocabulary is what makes the jump from "prose an LLM interprets" to "assertion an agent can check" possible.

Not yet proposing a structured acceptance type. Needs more concrete requirements to see what patterns emerge. For now: use ontology terms consistently in acceptance criteria strings to keep the door open.

## ArtifactTypeName ↔ content type mapping

**Status:** deferred

The link between `"audit-report"` (the ArtifactTypeName string) and `AuditReport` (the TypeScript content type) is currently implicit — you have to look at the ArtifactStoreRegistry to see the connection. A type-level map (e.g., `{ "audit-report": AuditReport }`) could make this compile-time checkable, so that an Operation declaring `artifactType: "audit-report"` is statically linked to `Artifact<AuditReport>`. This would require mapped types, which were previously deferred. Revisit when we have a second artifact type.

## Retrieval from ArtifactStores

**Status:** deferred (clarified by Dispatcher)

Producing Artifacts is modeled (ProducesEffect). Consuming/retrieving them is not. The Dispatcher clarified that invocation doesn't return results — Artifacts are deposited in stores, and retrieval is a store concern. But the store interface (how you get an Artifact out) is still unspecified. Options: baseline capability of all stores, distinct vocabulary concept, or left entirely to implementation. Needs a concrete consumer use case to resolve.

## "modifies" effect kind

**Status:** deferred

Listed in design notes but not formalized. Unlike "produces" (targets a typed ArtifactStore), "modifies" has a vague target ("source files", "project state"). Needs a concrete operator type (builder?) to validate what the target should look like.
