/**
 * Agent — running processes and their static type definitions.
 */

/**
 * A SubagentType is the static definition of a Claude Code subagent.
 * It describes the agent's identity and interaction modality, but not
 * a running process. SubagentTypes correspond to .claude/agents/*.md
 * configuration files.
 *
 * Most SubagentTypes are implementation details of their corresponding
 * Operators and do not need ontological definitions. The exception is
 * interactive SubagentTypes, which have system-level significance
 * (e.g., their sessions produce Transcripts).
 */
export interface SubagentType {
  /**
   * The subagent name — matches the filename in .claude/agents/
   * (without extension).
   */
  readonly subagentName: string;
  /**
   * Whether this agent engages in conversation with a human.
   * Interactive agents have their sessions captured as Transcripts.
   * Non-interactive (autonomous) agents are invoked programmatically
   * and exit when their task is complete.
   */
  readonly interactive: boolean;
}

/**
 * An Agent is a running instance of Claude Code (invoked with the -p
 * flag). It pairs a SubagentType with a runtime process identity.
 */
export interface Agent {
  /** The subagent name — links this process to its SubagentType. */
  readonly subagentName: string;
  /** OS process ID of the running Claude Code instance. */
  readonly processId: number;
}

// ─── Known SubagentTypes ────────────────────────────────────

/**
 * Coco — the primary interactive agent. Collaborates with the
 * project lead on planning, prioritization, and design decisions.
 *
 * Defined here because interactive SubagentTypes have system-level
 * significance: their sessions are captured as Transcripts.
 */
export interface CocoSubagentType extends SubagentType {
  readonly subagentName: "coco";
  readonly interactive: true;
}

export const COCO = {
  subagentName: "coco",
  interactive: true,
} as const satisfies SubagentType;
