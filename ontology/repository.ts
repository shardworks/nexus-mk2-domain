/**
 * Repository — version-controlled codebases the system operates on.
 */

/**
 * A Repository is a version-controlled codebase that the system
 * operates on. Repositories are classified by their role in the
 * system (domain vs implementation) and the product they belong to.
 */
export interface Repository {
  /** The repository's fully qualified name (e.g., "shardworks/nexus-mk2"). */
  readonly name: string;
  readonly type: RepositoryType;
  /**
   * The product this repository belongs to. "nexus" for the system's own
   * repositories; other values for external projects the system operates on.
   */
  readonly product: string;
}

/**
 * The role a Repository plays in the system.
 *
 * - "domain" — holds requirements, ontology, and other human-owned
 *   definitions. Read-only to agents.
 * - "implementation" — holds code, configuration, and agent definitions.
 *   Modified by builders and other agents.
 */
export type RepositoryType = "domain" | "implementation";

/**
 * The Nexus domain repository. Contains requirements and the ontology.
 * Human-owned; agents must not modify it.
 */
export interface NexusDomainRepository extends Repository {
  readonly name: "shardworks/nexus-mk2-domain";
  readonly type: "domain";
  readonly product: "nexus";
}

export const NEXUS_DOMAIN_REPO = {
  name: "shardworks/nexus-mk2-domain",
  type: "domain",
  product: "nexus",
} as const satisfies Repository;

/**
 * The Nexus implementation repository. Contains the codebase that
 * agents build and maintain.
 */
export interface NexusImplementationRepository extends Repository {
  readonly name: "shardworks/nexus-mk2";
  readonly type: "implementation";
  readonly product: "nexus";
}

export const NEXUS_IMPL_REPO = {
  name: "shardworks/nexus-mk2",
  type: "implementation",
  product: "nexus",
} as const satisfies Repository;
