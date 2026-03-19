/**
 * Operator — the abstract framework for addressable, invocable entities.
 */

import type { ArtifactTypeName } from "./artifact.js";

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
  /** The type of artifact this operation reads from. */
  readonly artifactType: ArtifactTypeName;
}

/**
 * A "produces" Effect indicates that an Operation deposits a new
 * Artifact of the specified type into its ArtifactStore.
 */
export interface ProducesEffect {
  readonly kind: "produces";
  /** The type of artifact this operation creates. */
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

/**
 * An Operation is a named action that an Operator can perform.
 * It is defined by its Effects — what it causes to exist or change
 * in the system — not by a method signature or invocation contract.
 */
export interface Operation {
  readonly name: string;
  /** The declared effects of this operation on the system. */
  readonly effects: readonly Effect[];
}

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
  /** The set of operations this operator can perform. */
  readonly operations: readonly Operation[];
}
