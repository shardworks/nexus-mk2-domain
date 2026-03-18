# Ontology Design Notes

Working notes on domain vocabulary and concept design. Not normative — the TypeScript definitions in `index.ts` are the source of truth.

## Key Vocabulary Decisions

### Operator vs Agent

The system distinguishes two layers:

- **Operator** — an abstract, addressable, invocable entity. What you interact with. Does not imply a running process — may be backed by a long-lived session, an on-demand CLI invocation, a script, or anything else. Operators declare capabilities (e.g., "auditor"). Casual references like "the auditor" refer to an Operator.
- **Agent** — a Claude Code agent. Concrete implementation artifact. Corresponds to a `.claude/agents/*.md` file with frontmatter and a system prompt. An Agent backs an Operator.

This separation exists because "agent" already has a specific meaning in the project (Claude Code agent configs), and the abstract concept of "an entity the system can invoke" is broader than any single implementation.

### Capabilities over Kind

Operators do not have a single `kind` discriminant. Instead, they declare a `capabilities` array. This supports operators with multiple capabilities and avoids a rigid single-inheritance hierarchy. Type guards (e.g., `isAuditor()`) narrow Operators to specific capability interfaces at compile time.

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

| Concept | What it is | Example phrases |
|---------|------------|-----------------|
| **Operator** | An addressable, invocable entity — the default meaning of "the auditor" | "is it running", "stop it", "spin up a second one" |
| **Agent** | A Claude Code agent config that backs an Operator | "what model is it using", "show me the system prompt" |
| **Configuration** | Tunable parameters on an agent or operator | "concurrency limit", "switch to Sonnet", "add permissions" |
| **Run** | A single invocation with a start, end, and output | "last run", "how many times today", "run a one-off" |
| **Output / Artifact** | The thing a run produces | "what did it find", "audit reports", "what changes did it make" |

Not all of these need ontology types immediately. Current focus is Operator (with Auditor capability) and Agent.
