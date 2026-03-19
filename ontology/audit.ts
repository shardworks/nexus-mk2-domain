/**
 * Audit — the auditor operator, audit reports, verdicts, and assessments.
 */

import type { Operation, Operator } from "./operator.js";

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
  /** One verdict per evaluated requirement. */
  readonly verdicts: readonly Verdict[];
}

/**
 * A single Requirement's evaluation outcome within an AuditReport.
 */
export interface Verdict {
  /**
   * The fully qualified requirement id this verdict applies to
   * (e.g., "build-loop/continuous-operation").
   */
  readonly requirementId: string;
  readonly result: VerdictResult;
  /** Concrete observations supporting the verdict. */
  readonly evidence: readonly string[];
}

export type VerdictResult = "pass" | "fail" | "unknown";

// ─── Assessment ─────────────────────────────────────────────

/**
 * An Assessment is the evaluation of a single Requirement at a specific
 * point in time. It captures the verdict, the evidence supporting it,
 * and the Repository commit state the evaluation was performed against.
 *
 * Assessments are append-only — each evaluation produces a new
 * Artifact<Assessment>. Historical Assessments are retained for analysis.
 *
 * **Current Assessment:** For a given requirementId, the "current"
 * Assessment is the one with the latest createdAt timestamp (as
 * determined by the enclosing Artifact). The current Assessment
 * represents the system's best understanding of that Requirement's
 * compliance state. All other Assessments for the same requirementId
 * are historical.
 *
 * Assessments and AuditReports serve complementary roles: Assessments
 * are the fine-grained, per-requirement source of truth that supports
 * incremental updates. AuditReports are periodic snapshots that
 * summarize overall system health at a point in time.
 */
export interface Assessment {
  /**
   * The fully qualified requirement id this assessment applies to
   * (e.g., "build-loop/continuous-operation").
   */
  readonly requirementId: string;
  readonly result: VerdictResult;
  /** Concrete observations supporting the verdict. */
  readonly evidence: readonly string[];
  /** Implementation Repository commit hash at time of assessment. */
  readonly projectCommit: string;
  /** Domain Repository commit hash at time of assessment. */
  readonly domainCommit: string;
}
