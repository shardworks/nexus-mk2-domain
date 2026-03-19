/**
 * Nexus Mk II — Domain Ontology
 *
 * Formal definitions for every named concept in the domain.
 * This is the system's shared vocabulary — it defines what words mean,
 * not how code should be structured.
 *
 * Human-owned. Agents must not modify this file.
 * Agent contributions must conform to the types exported by this module.
 */

// ─── Effect ────────────────────────────────────────────────

/**
 * An Effect declares what an Operation causes to happen in the system.
 * Effects describe outcomes in domain terms, not implementation mechanics.
 *
 * Design principle: effects should be as specific as the domain warrants,
 * and no more. A domain-meaningful effect (like "implements") is preferred
 * over a generic one (like "mutates") when the operation has a specific
 * relationship to core domain concepts. Generic effects are appropriate
 * when the domain doesn't ascribe special meaning to the action.
 */
export type Effect = ConsumesEffect | ProducesEffect | ImplementsEffect;

/**
 * A "consumes" Effect declares that an Operation reads from a managed
 * ArtifactStore. This makes the data flow graph explicit — you can
 * trace lineage between operators and know which Operations are
 * affected when upstream artifacts change.
 *
 * Only artifact dependencies are declared. Ambient inputs like the
 * codebase or the requirements registry are not declared as effects —
 * they are available to any operator by default, not dependency edges
 * in the artifact flow graph.
 */
export interface ConsumesEffect {
  readonly kind: "consumes";
  readonly artifactType: ArtifactTypeName;
}

/**
 * A "produces" Effect indicates that an Operation deposits a new
 * Artifact of the specified type into its ArtifactStore.
 */
export interface ProducesEffect {
  readonly kind: "produces";
  readonly artifactType: ArtifactTypeName;
}

/**
 * An "implements" Effect indicates that an Operation changes a codebase
 * in response to requirements. This is distinct from a generic mutation —
 * it declares that the operation's changes exist in relationship to the
 * requirements model. When an "implements" effect occurs, the system's
 * compliance posture potentially changes: every audit verdict could
 * be different afterward.
 *
 * Which codebase is affected (self or an external repository) is a
 * runtime parameter determined at invocation, not a static declaration.
 */
export interface ImplementsEffect {
  readonly kind: "implements";
}

// ─── Operation ─────────────────────────────────────────────

/**
 * An Operation is a named action that an Operator can perform.
 * It is defined by its Effects — what it causes to exist or change
 * in the system — not by a method signature or invocation contract.
 */
export interface Operation {
  readonly name: string;
  readonly effects: readonly Effect[];
}

// ─── Operator ───────────────────────────────────────────────

/**
 * An Operator is an addressable, invocable entity in the system.
 * It can receive requests and produce results. An Operator does not
 * imply a running process — it may be invoked on demand or run
 * continuously.
 *
 * Each Operator declares the Operations it can perform.
 */
export interface Operator {
  readonly name: string;
  readonly operations: readonly Operation[];
}

// ─── Auditor ────────────────────────────────────────────────

/**
 * The "audit" Operation evaluates the project against the Requirements
 * registry and deposits an Artifact<AuditReport> in the AuditReport
 * ArtifactStore.
 */
export interface AuditOperation extends Operation {
  readonly name: "audit";
  readonly effects: readonly [
    { readonly kind: "produces"; readonly artifactType: "audit-report" },
  ];
}

/**
 * An Auditor is an Operator that evaluates the current state of the
 * project against the Requirements registry. It is read-only — it
 * observes and reports but does not make changes.
 */
export interface Auditor extends Operator {
  readonly name: "auditor";
  readonly operations: readonly [AuditOperation];
}

// ─── AuditReport ────────────────────────────────────────────

/**
 * The structured output of an Auditor's evaluation.
 * Contains a prose summary and per-Requirement verdicts with
 * supporting evidence.
 */
export interface AuditReport {
  /** A brief prose overview of the audit findings. */
  readonly summary: string;
  readonly verdicts: readonly Verdict[];
}

/**
 * A single Requirement's evaluation outcome.
 */
export interface Verdict {
  /** The Requirement id this verdict applies to. */
  readonly requirementId: string;
  readonly result: VerdictResult;
  /** Observations supporting the verdict. */
  readonly evidence: readonly string[];
}

export type VerdictResult = "pass" | "fail" | "unknown";

// ─── Transcript ─────────────────────────────────────────────

/**
 * A Transcript is a raw capture of a Claude Code session. It is
 * produced by hooks during human-facing sessions and consumed by
 * Scribe for synthesis into structured SessionDocs.
 *
 * The transcript content is the raw session data (JSONL format).
 * The Transcript type captures metadata about the capture, not
 * the content itself — the content is the artifact's storage payload.
 */
export interface Transcript {
  /** Identifier of the session that produced this transcript. */
  readonly sessionId: string;
  /** Whether the transcript is awaiting processing or has been processed. */
  readonly status: TranscriptStatus;
}

export type TranscriptStatus = "pending" | "archived";

// ─── Scribe ────────────────────────────────────────────────

/**
 * The "scribe" Operation consumes a Transcript artifact and synthesizes
 * it into a structured SessionDoc, deposited in the SessionDoc
 * ArtifactStore.
 */
export interface ScribeOperation extends Operation {
  readonly name: "scribe";
  readonly effects: readonly [
    { readonly kind: "consumes"; readonly artifactType: "transcript" },
    { readonly kind: "produces"; readonly artifactType: "session-doc" },
  ];
}

/**
 * A Scribe is an Operator that transforms raw session transcripts into
 * structured session documentation. It is a batch processor — it reads,
 * synthesizes, and writes. It has no interactive role.
 */
export interface Scribe extends Operator {
  readonly name: "scribe";
  readonly operations: readonly [ScribeOperation];
}

// ─── SessionDoc ────────────────────────────────────────────

/**
 * The structured output of a Scribe's synthesis of a session transcript.
 * Contains metadata about the session and a prose narrative of what
 * happened.
 */
export interface SessionDoc {
  readonly date: string;
  readonly topic: string;
  readonly tags: readonly SessionTag[];
  readonly significance: Significance;
  /** Path to the primary transcript file that was synthesized. */
  readonly transcript: string;
  readonly body: string;
}

/**
 * Controlled vocabulary for categorizing session topics.
 */
export type SessionTag =
  | "philosophy"
  | "agent-design"
  | "architecture"
  | "tooling"
  | "workflow"
  | "domain"
  | "meta";

/**
 * How important a session was to the project's development.
 */
export type Significance = "low" | "medium" | "high";

// ─── Herald ────────────────────────────────────────────────

/**
 * The "herald" Operation consumes SessionDoc artifacts and synthesizes
 * them into an outward-facing narrative, deposited as an
 * Artifact<Publication> in the Publication ArtifactStore.
 */
export interface HeraldOperation extends Operation {
  readonly name: "herald";
  readonly effects: readonly [
    { readonly kind: "consumes"; readonly artifactType: "session-doc" },
    { readonly kind: "produces"; readonly artifactType: "publication" },
  ];
}

/**
 * A Herald is an Operator that synthesizes accumulated session
 * documentation into outward-facing published content. It reads
 * source material and produces a written artifact. It has no
 * interactive role.
 */
export interface Herald extends Operator {
  readonly name: "herald";
  readonly operations: readonly [HeraldOperation];
}

// ─── Publication ───────────────────────────────────────────

/**
 * The structured output of a Herald's synthesis of session documentation.
 * A publishable narrative aimed at an outside audience.
 */
export interface Publication {
  readonly date: string;
  readonly type: PublicationType;
  /** Brief description of what sessions or period this covers. */
  readonly scope: string;
  /** Paths to the session docs that were synthesized. */
  readonly sessions: readonly string[];
  readonly body: string;
}

/**
 * The kind of published content a Herald produces.
 */
export type PublicationType = "recap" | "deep-dive" | "status-update" | "blog-post";

// ─── Builder ──────────────────────────────────────────────

/**
 * The "build" Operation consumes the most recent audit report to
 * identify failing requirements, then changes the codebase to
 * address them. The builder's effect is "implements" — it exists
 * in direct relationship to the requirements model.
 */
export interface BuildOperation extends Operation {
  readonly name: "build";
  readonly effects: readonly [
    { readonly kind: "consumes"; readonly artifactType: "audit-report" },
    { readonly kind: "implements" },
  ];
}

/**
 * A Builder is an Operator that changes a codebase to satisfy
 * requirements. It consumes audit reports to identify what needs to
 * be done and implements changes to make failing requirements pass.
 *
 * Unlike read-only operators (Auditor) or synthesis operators
 * (Scribe, Herald), the Builder modifies the system itself. Its
 * "implements" effect signals that the system's compliance posture
 * may change as a result of its operation.
 */
export interface Builder extends Operator {
  readonly name: "builder";
  readonly operations: readonly [BuildOperation];
}

// ─── Artifact ──────────────────────────────────────────────

/**
 * The fixed set of Artifact types in the system. Each name corresponds
 * to a domain data type and has a dedicated ArtifactStore.
 */
export type ArtifactTypeName =
  | "audit-report"
  | "transcript"
  | "session-doc"
  | "publication";

/**
 * An Artifact is a typed, persistent record produced by an Operation.
 * It wraps a domain data type (like AuditReport) with identity and
 * metadata. An Artifact outlives the Operation that created it and
 * is retrievable from its ArtifactStore.
 */
export interface Artifact<T> {
  readonly type: ArtifactTypeName;
  readonly id: string;
  readonly createdAt: string;
  readonly content: T;
}

// ─── ArtifactStore ─────────────────────────────────────────

/**
 * An ArtifactStore is the canonical home for Artifacts of a single type.
 * It supports deposit (Operations create Artifacts here) and retrieval
 * (other parts of the system read Artifacts from here).
 *
 * The storage mechanism (filesystem, database, cloud storage, etc.)
 * is an implementation detail constrained by Requirements, not by
 * this definition.
 */
export interface ArtifactStore<T> {
  readonly artifactType: ArtifactTypeName;
}

/**
 * The system's catalog of ArtifactStores. Each Artifact type has
 * exactly one store. This is the entry point for locating where
 * Artifacts of a given type live.
 */
export interface ArtifactStoreRegistry {
  readonly auditReport: ArtifactStore<AuditReport>;
  readonly transcript: ArtifactStore<Transcript>;
  readonly sessionDoc: ArtifactStore<SessionDoc>;
  readonly publication: ArtifactStore<Publication>;
}

// ─── Dispatcher ────────────────────────────────────────────

/**
 * A Dispatcher triggers Operations on Operators. Given an Operator
 * name and an Operation name, it causes the Operation to execute
 * and its declared Effects to occur.
 *
 * The Dispatcher does not return results directly. Produced Artifacts
 * are deposited in the appropriate ArtifactStore as declared by the
 * Operation's Effects.
 *
 * How the Dispatcher invokes an Operation (starting an Agent, running
 * a script, etc.) is an implementation detail.
 */
export interface Dispatcher {
  readonly operators: readonly Operator[];
}

// ─── Agent ──────────────────────────────────────────────────

/**
 * An Agent is a running instance of Claude Code operating autonomously
 * (invoked with the -p flag). It corresponds to a .claude/agents/*.md
 * configuration file.
 */
export interface Agent {
  /** The subagent name — matches the filename in .claude/agents/ (without extension). */
  readonly subagentName: string;

  /** OS process ID of the running Claude Code instance. */
  readonly processId: number;
}

// ─── Requirement ────────────────────────────────────────────

/**
 * A Requirement is a named, trackable statement about what the system
 * must do or how it must behave. The id is derived from the requirement's
 * path: "<feature-slug>/<requirement-slug>".
 */
export interface Requirement {
  readonly id: string;
  readonly title: string;
  readonly status: RequirementStatus;

  /** The full prose description of the requirement. */
  readonly body: string;

  readonly acceptance: readonly string[];
}

export type RequirementStatus = "draft" | "active" | "deprecated";
