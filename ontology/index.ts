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

// ─── Operator ───────────────────────────────────────────────

/**
 * An Operator is an addressable, invocable entity in the system.
 * It can receive requests and produce results. An Operator does not
 * imply a running process — it may be invoked on demand or run
 * continuously.
 */
export interface Operator {
  readonly name: string;
}

// ─── Auditor ────────────────────────────────────────────────

/**
 * An Auditor evaluates the current state of the project against
 * the requirements registry and produces an AuditReport.
 * It is read-only — it observes and reports but does not make changes.
 */
export interface Auditor extends Operator {
  readonly name: "auditor";
  audit(): Promise<AuditReport>;
}

// ─── AuditReport ────────────────────────────────────────────

/**
 * The structured output of an Auditor's evaluation.
 * Contains per-requirement assessments of the project's compliance.
 * Internal structure TBD.
 */
export interface AuditReport {
  readonly results: unknown;
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
 * must do or how it must behave. Each requirement has a corresponding
 * markdown file containing its full prose description. The id matches
 * the markdown filename (without extension).
 */
export interface Requirement {
  readonly id: string;
  readonly title: string;
  readonly status: RequirementStatus;
  readonly priority: RequirementPriority;

  /** Relative path to the prose markdown file (e.g. "./auditor-agent.md"). */
  readonly body: string;

  readonly acceptance: readonly string[];
}

export type RequirementStatus = "draft" | "active" | "deprecated";
export type RequirementPriority = "high" | "medium" | "low";
