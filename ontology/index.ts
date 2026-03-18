/**
 * Nexus Mk II — Domain Ontology
 *
 * This module is the single export surface for all domain concepts.
 * Every named entity in the domain must be defined and exported here.
 *
 * Human-owned. Agents must not modify this file.
 * Agent contributions must conform to the types exported by this module.
 */

/**
 * An Agent is a named autonomous actor in the Nexus system.
 * Each agent has a defined role and operates within a designated worktree.
 */
export interface Agent {
  /** Unique identifier for the agent. */
  id: string;

  /** Human-readable name (e.g. "Coco", "Herald"). */
  name: string;

  /** The agent's role within the system. */
  role: string;
}

// TODO: Define and export additional domain types
