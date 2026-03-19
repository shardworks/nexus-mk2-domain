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
| **Operation** | in ontology | A named action an Operator can perform, defined by its Effects | "run an audit", "have the builder fix that" |
| **Effect** | in ontology | A declaration of what an Operation causes (consumes, produces, implements) | "the builder consumes audit reports", "the auditor produces an AuditReport" |
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
        - produces: Artifact<AuditReport>

Builder
  name: "builder"
  operations:
    - name: "build"
      effects:
        - consumes: Artifact<AuditReport>
        - implements
```

This says what each operator does in domain terms — not how you invoke it, what format artifacts are stored in, or where stores live. Those are constrained by Requirements.

### Artifacts and ArtifactStores

An **Artifact** is a typed, persistent record produced by an Operation. It wraps a domain data type (like AuditReport) with identity and metadata. An Artifact outlives the Operation that created it.

An **ArtifactStore** is the canonical home for Artifacts of one type. Each Artifact type has exactly one store. The store is the decoupling point between producers and consumers:

- **Producer side:** An Operation's "produces" effect means "deposits an Artifact into the appropriate ArtifactStore."
- **Consumer side:** An Operation's "consumes" effect declares which ArtifactStore it reads from, creating a dependency edge in the data flow graph.

The ArtifactStoreRegistry is the system's catalog of all stores. It maps Artifact types to their stores, providing a single entry point for locating where any type of Artifact lives.

Storage mechanism (filesystem, database, cloud) is an implementation detail constrained by Requirements, not by the ontology. The ontology says "AuditReport Artifacts live in a store." A Requirement says "that store must be implemented as JSON files at `.artifacts/audit-report/{id}.json`."

### Effect Design Principles (2026-03-19)

**Effects should be as specific as the domain warrants, and no more.**

The effect vocabulary is not a minimal universal set (like CRUD). It is a domain-meaningful vocabulary where each effect kind captures a relationship that matters to the system's core model. Guidelines:

- **Use a specific effect when the operation has a named relationship to a core domain concept.** The builder doesn't just "change something" — it changes code *in response to requirements*. That relationship to requirements is the most important thing about the builder's effect. The effect kind `implements` captures this.
- **Use a generic effect when the domain doesn't ascribe special meaning to the action.** A future operator that updates issue labels or rotates credentials is "mutating state," but that mutation has no special relationship to requirements, artifacts, or other core concepts. A generic `mutates` effect would be appropriate there.
- **Effects exist for legibility, not for a type checker.** The ontology's audience is humans and agents reasoning about the system. An effect kind should make the system's behavior more understandable when you read the ontology.

This means the Effect type union will grow organically as new operator types introduce domain-meaningful relationships, rather than being a small, fixed set designed for completeness.

### Consumes and Produces: The Artifact Flow Pair

`consumes` and `produces` are natural counterparts that together define the artifact flow graph:

- **`produces`** — deposits a new Artifact into a managed ArtifactStore
- **`consumes`** — reads from a managed ArtifactStore

Both carry an `artifactType: ArtifactTypeName`, scoping them to managed artifact stores. This is deliberate: only artifact dependencies create edges in the data flow graph. Ambient inputs (the codebase, the requirements registry) are available to any operator by default and are not declared as effects.

### Static Declarations vs Runtime Parameters

Effect declarations are static — they describe what *kinds* of things an operation does, not the specifics of each invocation:

| Declared in ontology (static) | Determined at invocation (runtime) |
|---|---|
| "consumes audit-report artifacts" | *which* specific audit report |
| "produces session-doc artifacts" | the specific artifact ID and content |
| "implements" | *which* codebase, *which* requirement to address |

The ontology says what an operator is *designed to do*. The Dispatcher (or invocation script) determines the parameters for each run.

### Effect Kinds

| Kind | Meaning | Metadata | Example |
|------|---------|----------|---------|
| **consumes** | Reads from a managed ArtifactStore | `artifactType: ArtifactTypeName` | builder consumes assessment |
| **produces** | Deposits a new Artifact into an ArtifactStore | `artifactType: ArtifactTypeName` | auditor produces assessment |
| **deletes** | Removes an Artifact from an ArtifactStore | `artifactType: ArtifactTypeName` | scribe deletes staged-transcript |
| **implements** | Changes a codebase in response to requirements | *(none — target is runtime)* | builder implements |

### Future Effect Candidates

Identified but not yet formalized. Each should be added when a concrete operator drives the need:

- **notifies** — Signals a human or external system that something happened. Distinct from `produces` because the audience is a human or webhook, not an ArtifactStore. The output is ephemeral and action-oriented, not persistent and retrievable. *Candidate trigger: a monitor operator that alerts on failures.*
- **invalidates** — Declares that an Operation's output makes some other artifact stale. Example: a new audit report invalidates prior reports for the same scope. This is how the system could reason about freshness without timestamp heuristics. *Candidate trigger: when implicit staleness reasoning proves insufficient.*

Implementation-specific details (file format, storage path, process mechanics) belong in **Requirements**, not in effects. The effect says WHAT happens in domain terms. The Requirement says WHERE and HOW it must happen in concrete terms.

### The Data Flow Graph

With effects declared on every operation, the system's artifact flow is fully traceable:

```
[hooks] ──produces──→ StagedTranscript
                          │
                       consumes
                          ↓
                       Scribe ──produces──→ SessionDoc
                          │        │
                       deletes  produces
                          ↓        ↓
               (StagedTranscript   Transcript
                 removed)             │
                                   consumes
                                      ↓
                                   Herald ──produces──→ Publication

                       Auditor ──produces──→ Assessment
                                                │
                                             consumes
                                                ↓
                                             Builder ──implements──→ [codebase]
```

This graph is derivable from the ontology alone — no implementation knowledge required. It tells you what each operator depends on, what it produces, and where its output goes. The Dispatcher can use this to determine what needs to re-run when inputs change.

Note: the auditor reads the codebase and requirements, but these are ambient inputs, not artifact dependencies. They don't appear in the artifact flow graph. The builder's `implements` effect feeds back into the codebase, which the auditor reads — completing the audit→build→audit loop, but that loop is orchestrated by the Dispatcher, not declared in effects.

### Dispatcher

The **Dispatcher** is the invocation mechanism — it triggers Operations on Operators. Given an Operator name and Operation name, it causes the Operation to execute and its declared Effects to occur. It does not return results; produced Artifacts are deposited in ArtifactStores.

The Dispatcher completes the produce-side vocabulary: Operator (who) → Operation (what) → Dispatcher (trigger) → Effect (outcome) → Artifact (output) → ArtifactStore (location).

The Dispatcher knows about the available Operators (via its `operators` list). How it actually invokes an Operation — starting an Agent, running a script, etc. — is implementation. A REPL is a Dispatcher interface; a batch orchestrator is another.

Note: orchestration logic (e.g., "run an audit after every build") belongs to the Dispatcher or a scheduling layer, not to the Effect model. Operators should remain ignorant of each other. The `consumes` effect declares data dependencies, not execution ordering — the Dispatcher uses the dependency graph to determine what to trigger.

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

### Current Status

The following are **formalized in `index.ts`**: Effect (ConsumesEffect, ProducesEffect, DeletesEffect, ImplementsEffect), Operation, Operator, Auditor (AuditOperation), Scribe (ScribeOperation), Herald (HeraldOperation), Builder (BuildOperation), StagedTranscript, Transcript, Dispatcher, Artifact, ArtifactTypeName, ArtifactStore, ArtifactStoreRegistry, Agent, Requirement.

### Open Questions

- **Structured acceptance criteria** — how do we evolve Requirement.acceptance from freeform strings toward structured assertions? Keep strings for now, but use ontology terms consistently so the path to formalization is clear.
- **ArtifactTypeName ↔ content type mapping** — currently the link between `"audit-report"` and `AuditReport` is implicit (through the ArtifactStoreRegistry). A type-level map could make this connection compile-time checkable. Deferred as a potential future refinement.
