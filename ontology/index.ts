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
 */
export type Effect = ProducesEffect;

/**
 * A "produces" Effect indicates that an Operation deposits a new
 * Artifact of the specified type into its ArtifactStore.
 */
export interface ProducesEffect {
  readonly kind: "produces";
  readonly artifactType: ArtifactTypeName;
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
  readonly effects: readonly [{ readonly kind: "produces"; readonly artifactType: "audit-report" }];
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

// ─── Scribe ────────────────────────────────────────────────

/**
 * The "scribe" Operation synthesizes a raw session transcript into
 * a structured SessionDoc and deposits an Artifact<SessionDoc> in the
 * SessionDoc ArtifactStore.
 */
export interface ScribeOperation extends Operation {
  readonly name: "scribe";
  readonly effects: readonly [{ readonly kind: "produces"; readonly artifactType: "session-doc" }];
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
 * The "herald" Operation synthesizes session documentation into an
 * outward-facing narrative and deposits an Artifact<Publication> in
 * the Publication ArtifactStore.
 */
export interface HeraldOperation extends Operation {
  readonly name: "herald";
  readonly effects: readonly [{ readonly kind: "produces"; readonly artifactType: "publication" }];
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

// ─── Artifact ──────────────────────────────────────────────

/**
 * The fixed set of Artifact types in the system. Each name corresponds
 * to a domain data type and has a dedicated ArtifactStore.
 */
export type ArtifactTypeName = "audit-report" | "session-doc" | "publication";

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
