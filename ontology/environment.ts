/**
 * Environment — the runtime guarantees a Nexus workspace provides.
 *
 * This module defines what implementations can assume about the
 * environment they run in. It is a specification, not a requirement —
 * it has no invariants or verdicts. Requirements may reference these
 * guarantees, and implementations must not assume more than what is
 * declared here.
 *
 * Anything not declared here is NOT guaranteed. Implementations must
 * not depend on:
 *
 * - Filesystem paths outside the workspace root and paths listed
 *   in this environment (e.g., a pre-cloned artifacts repository).
 * - URLs (git remotes, API endpoints, etc.) not specified in the
 *   ontology, requirements, or this environment.
 *
 * Violations are incorrect even if they happen to work in a
 * particular workspace.
 */

// ─── Environment Variables ──────────────────────────────────

/**
 * Environment variables guaranteed to exist in every Nexus workspace.
 * Implementations may read these without fallback logic.
 */
export interface NexusEnvironment {
  /**
   * Absolute path to the NexusDomainRepository checkout.
   * Read-only — agents must not modify files under this path.
   */
  readonly NEXUS_DOMAIN_PATH: string;

  /**
   * Absolute path to a temporary directory for transient data.
   * Writeable, but ephemeral — contents do not survive workspace
   * teardown. Suitable for transient clones, scratch files, and
   * other short-lived data.
   */
  readonly NEXUS_TEMP_DIR: string;

  /**
   * Git remote URL for the NexusArtifactsRepository.
   * Used for transient clones when persisting or retrieving
   * durable artifacts.
   */
  readonly NEXUS_ARTIFACTS_REMOTE: string;
}
