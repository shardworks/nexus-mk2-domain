# Ontology Design Notes

Working notes on domain vocabulary and concept design. Not normative — the TypeScript definitions in `index.ts` are the source of truth.

## Key Vocabulary Decisions

### Operator vs Agent

The system distinguishes two layers:

- **Operator** — an abstract, addressable, invocable entity. What you interact with. Does not imply a running process — may be backed by a long-lived session, an on-demand CLI invocation, a script, or anything else. Operators declare capabilities (e.g., "auditor"). Casual references like "the auditor" refer to an Operator.
- **Agent** — a Claude Code agent. Concrete implementation artifact. Corresponds to a `.claude/agents/*.md` file with frontmatter and a system prompt. An Agent backs an Operator.

This separation exists because "agent" already has a specific meaning in the project (Claude Code agent configs), and the abstract concept of "an entity the system can invoke" is broader than any single implementation.

### Operations over Capabilities

Early drafts considered a `capabilities` array on Operators. This was superseded by the Operation/Effect model (2026-03-18): Operators declare **Operations** (named actions with declared Effects) rather than abstract capability tags. This is more precise — it says what an Operator *does*, not just what category it belongs to. See "Operations as Effect Declarations" below.

## Domain Concepts Identified from Simulated Usage

Simulated natural-language commands and questions were used to discover what concepts the system vocabulary needs to cover.

### Example Commands & Questions

**Status & Observation**
- "Is the auditor running?"
- "Are any operators stuck?"
- "What operators are available?"
- "What did the auditor find in its last run?"
- "Show me the auditor's current configuration"
- "How many times has the auditor run today?"

**Lifecycle & Control**
- "Stop the builder"
- "Restart the auditor with the latest requirements"
- "Spin up a second auditor scoped to just the new requirements"
- "Kill all running operators"
- "Increase the reviewer concurrency limit to 5"

**Definition & Configuration**
- "What model is the auditor using?"
- "Switch the builder to use Sonnet instead of Opus"
- "Show me the auditor's system prompt"
- "Add file-write permissions to the reviewer"

**Creation & Ad-Hoc Work**
- "Let's create a new operator to review the list of bugs and fix the highest priority one"
- "Create an operator that writes tests for untested modules"
- "Run a one-off operator to summarize the git log from this week"
- "Clone the auditor config but scope it to only the security requirements"

**Multi-Operator & Orchestration**
- "Run an audit, then hand the gaps to a builder"
- "Which operators are working on the same files right now?"
- "What's the queue depth for the builder?"

**Results & History**
- "Show me all audit reports from this week"
- "What requirements moved from 'not met' to 'met' since yesterday?"
- "What changes did the builder make in its last session?"

### Concept Summary

| Concept | Status | What it is | Example phrases |
|---------|--------|------------|-----------------|
| **Operator** | in ontology | An addressable, invocable entity that declares Operations | "is the auditor running", "stop the builder" |
| **Operation** | in ontology | A named action an Operator can perform, defined by its Effects | "run an audit", "have the builder plan a fix" |
| **Effect** | in ontology | A declaration of what an Operation causes (currently: "produces") | "the audit produces an AuditReport" |
| **Artifact** | in ontology | A typed, persistent record produced by an Operation | "audit reports", "show me the last report" |
| **ArtifactStore** | in ontology | The canonical home for Artifacts of one type | "where do audit reports live" |
| **Dispatcher** | in ontology | Triggers Operations on Operators; the invocation mechanism | "run an audit", "have the auditor do its thing" |
| **Agent** | in ontology | A Claude Code agent instance that backs an Operator | "what model is it using", "show me the system prompt" |
| **Configuration** | not yet | Tunable parameters on an agent or operator | "concurrency limit", "switch to Sonnet", "add permissions" |
| **Run** | not yet | A single invocation with a start, end, and output | "last run", "how many times today", "run a one-off" |

## Operations as Effect Declarations (2026-03-18)

### The Problem with Method Signatures

The original Auditor interface defined `audit(): Promise<AuditReport>`. This had several issues:

- It implies synchronous call-and-response ("I call audit, I get a report back"), but agents don't work that way. They run, do work, and deposit artifacts somewhere.
- It prescribes code structure (method name, return type, async contract) in what's supposed to be vocabulary.
- It doesn't capture what actually matters about an operation: **what it causes to happen**.

### Operations as Declarations

Instead of method signatures, operators declare **operations** — named actions with described **effects**. An effect is a statement about what the operation causes to exist or change in the system.

```
Auditor
  name: "auditor"
  operations:
    - name: "audit"
      effects:
        - produces: Artifact<AuditReport> (deposited in the AuditReport ArtifactStore)
```

This says: "the auditor has an operation called 'audit' that produces an AuditReport Artifact and deposits it in the corresponding ArtifactStore." It doesn't say how you invoke it, what format the Artifact is stored in, or where the store lives. Those are constrained by Requirements.

### Artifacts and ArtifactStores

An **Artifact** is a typed, persistent record produced by an Operation. It wraps a domain data type (like AuditReport) with identity and metadata. An Artifact outlives the Operation that created it.

An **ArtifactStore** is the canonical home for Artifacts of one type. Each Artifact type has exactly one store. The store is the decoupling point between producers and consumers:

- **Producer side:** An Operation's "produces" effect means "deposits an Artifact into the appropriate ArtifactStore."
- **Consumer side:** Anything that needs the Artifact reads it from the store. This is an implicit input — the consumer knows where to look, just as the Auditor implicitly knows where Requirements live.

The ArtifactStoreRegistry is the system's catalog of all stores. It maps Artifact types to their stores, providing a single entry point for locating where any type of Artifact lives.

Storage mechanism (filesystem, database, cloud) is an implementation detail constrained by Requirements, not by the ontology. The ontology says "AuditReport Artifacts live in a store." A Requirement says "that store must be implemented as JSON files at `/reports/audit/{id}.json`."

### Effects and the Vocabulary–Requirements Bridge

The Artifact/ArtifactStore vocabulary creates a precise bridge between Operations and Requirements:

1. **Ontology** defines the data type: "An AuditReport contains Verdicts with per-Requirement results and evidence."
2. **Ontology** defines the container: "An Artifact\<AuditReport\> wraps an AuditReport with identity and metadata."
3. **Ontology** defines the store: "The ArtifactStoreRegistry has an AuditReport store."
4. **Operation** references these: "The audit operation produces an Artifact\<AuditReport\> in the AuditReport store."
5. **Requirement** constrains the store: "The AuditReport ArtifactStore must persist Artifacts as JSON at `/reports/audit/{id}.json`."

Each layer references formal vocabulary terms. An auditor can mechanically verify step 5: does the file exist at the expected path? does it parse as JSON? does its `content` field conform to the AuditReport type? does it have the expected Artifact metadata (id, createdAt)?

### Spectrum of Requirement Formality

Today, acceptance criteria are freeform strings:

```ts
acceptance: [
  "The auditor produces a structured report covering every registered requirement",
]
```

This is human-readable but only LLM-evaluable. A more formal version might be:

```ts
// Hypothetical — not yet proposed for the ontology
acceptance: [
  { asserts: "produces", artifact: "AuditReport", format: "json", path: "/reports/audit/{id}.json" },
  { asserts: "covers", each: "Requirement", in: "AuditReport.verdicts[].requirementId" },
]
```

The first is a prose statement an agent interprets. The second is a structured assertion an agent could verify mechanically — check the path, validate the JSON, confirm every requirement ID appears in the verdicts.

We don't need to commit to the structured form yet. But the observation is: **the more vocabulary terms a requirement references, the more checkable it becomes.** The ontology is what makes that progression possible.

### Effect Kinds

| Kind | Meaning | Example |
|------|---------|---------|
| **produces** | Deposits a new Artifact in the corresponding ArtifactStore | audit → Artifact\<AuditReport\> |
| **modifies** | Changes existing project state | build → source files |

Implementation-specific details (file format, storage path, process mechanics) belong in **Requirements**, not in effects. The effect says WHAT happens in domain terms. The Requirement says WHERE and HOW it must happen in concrete terms.

### Retrieval

An open question. Consuming Artifacts from a store is important but doesn't fit the "effects" model — reading doesn't change anything. Retrieval may be a distinct concept from Operations/Effects, or it may be a baseline capability of ArtifactStores that doesn't need its own vocabulary. Deferred until we have a concrete consumer to reason about.

### Dispatcher

The **Dispatcher** is the invocation mechanism — it triggers Operations on Operators. Given an Operator name and Operation name, it causes the Operation to execute and its declared Effects to occur. It does not return results; produced Artifacts are deposited in ArtifactStores.

The Dispatcher completes the produce-side vocabulary: Operator (who) → Operation (what) → Dispatcher (trigger) → Effect (outcome) → Artifact (output) → ArtifactStore (location).

The Dispatcher knows about the available Operators (via its `operators` list). How it actually invokes an Operation — starting an Agent, running a script, etc. — is implementation. A REPL is a Dispatcher interface; a batch orchestrator is another.

### Current Status

The following are now **formalized in `index.ts`**: Effect, ProducesEffect, Operation, AuditOperation, Operator, Auditor, Dispatcher, Artifact, ArtifactTypeName, ArtifactStore, ArtifactStoreRegistry, Agent, Requirement.

### Open Questions

- **"modifies" effect** — listed in the effect kinds table but not yet formalized as a type. Needs a concrete operator (builder?) to validate the pattern. Unlike "produces" (which targets a typed ArtifactStore), "modifies" has a vague target ("source files", "project state"). May need a different shape.
- **Structured acceptance criteria** — how do we evolve Requirement.acceptance from freeform strings toward structured assertions? Keep strings for now, but use ontology terms consistently so the path to formalization is clear.
- **Retrieval** — consuming Artifacts from a store is important but doesn't fit the effects model (reading doesn't change anything). May be a baseline capability of ArtifactStores, or a distinct concept. Deferred until we have a concrete consumer to reason about.
- **ArtifactTypeName ↔ content type mapping** — currently the link between `"audit-report"` and `AuditReport` is implicit (through the ArtifactStoreRegistry). A type-level map could make this connection compile-time checkable. Deferred as a potential future refinement.
