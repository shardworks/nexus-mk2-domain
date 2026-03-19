/**
 * Builder — the builder operator and its structured output.
 */

import type { Operation, Operator } from "./operator.js";

/**
 * The "build" Operation consumes the most recent audit report to
 * identify failing requirements, then changes the codebase to
 * address them. It produces a BuildResult artifact recording what
 * was done. The builder's "implements" effect signals that the
 * system's compliance posture may change as a result.
 */
export interface BuildOperation extends Operation {
  readonly name: "build";
  readonly effects: readonly [
    { readonly kind: "consumes"; readonly artifactType: "audit-report" },
    { readonly kind: "produces"; readonly artifactType: "build-result" },
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

// ─── BuildResult ───────────────────────────────────────────

/**
 * The structured output of a Builder's work. Records what was done,
 * why, and the traceability links back to the audit report and
 * requirement that triggered the work.
 *
 * A BuildResult serves multiple purposes:
 * - **Deduplication:** The presence of a BuildResult for a given
 *   auditReportId prevents the builder from acting on the same
 *   report twice.
 * - **Traceability:** Links a commit back to the requirement and
 *   audit report that motivated it.
 * - **Documentation:** Provides a structured record of builder
 *   activity for analysis and the documentation pipeline.
 */
export interface BuildResult {
  /** The id of the Artifact<AuditReport> that triggered this build. */
  readonly auditReportId: string;
  /** The fully qualified requirement id that was addressed. */
  readonly requirementId: string;
  /** The git commit hash produced by the builder. */
  readonly commitHash: string;
  /** What was changed and why. */
  readonly description: string;
}
