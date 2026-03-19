/**
 * Requirement — features, invariants, and the requirements registry.
 */

/**
 * A Feature is a named grouping of related Requirements.
 * The feature id is a stable slug used as a namespace for
 * its requirements (e.g., "build-loop").
 */
export interface Feature {
  /** Stable slug identifier (e.g., "build-loop", "auditor"). */
  readonly id: string;
  /** Human-readable name for this feature area. */
  readonly title: string;
  readonly requirements: readonly Requirement[];
}

/**
 * A Requirement is a named, trackable statement about what must be
 * true of the system. Requirements are expressed as invariants —
 * properties that must hold continuously — rather than acceptance
 * checklists.
 *
 * A Requirement's id is scoped to its parent Feature. The fully
 * qualified id is "<feature-id>/<requirement-id>".
 */
export interface Requirement {
  /** Stable slug identifier, scoped to the parent Feature. */
  readonly id: string;
  /** Human-readable name for this requirement. */
  readonly title: string;
  readonly status: RequirementStatus;
  /** Properties that must hold continuously. */
  readonly invariants: readonly string[];
  /**
   * Optional annotations providing context that doesn't fit the
   * invariant structure. Prose is generally discouraged — if a note
   * is needed, it should add important context that invariants alone
   * cannot convey.
   */
  readonly notes?: readonly RequirementNote[];
}

export type RequirementStatus = "draft" | "active" | "deprecated";

/**
 * An annotation on a Requirement providing supplementary context.
 */
export interface RequirementNote {
  readonly type: RequirementNoteType;
  /** The annotation content. */
  readonly body: string;
}

/**
 * The kind of supplementary context a RequirementNote provides.
 *
 * - "rationale" — why the requirement exists
 * - "context" — background needed to understand the invariants
 * - "caveat" — known edge cases or intentional gaps
 * - "example" — concrete scenario illustrating the invariant
 */
export type RequirementNoteType = "rationale" | "context" | "caveat" | "example";
