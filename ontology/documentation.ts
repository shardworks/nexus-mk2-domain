/**
 * Documentation — transcript capture, scribe, herald, and their outputs.
 */

import type { Operation, Operator } from "./operator.js";

// ─── Transcript ─────────────────────────────────────────────

/**
 * A StagedTranscript is a raw capture of a Claude Code session that
 * has not yet been processed by the Scribe. Hooks deposit these
 * during interactive sessions. The StagedTranscript ArtifactStore
 * is non-persistent (workspace-local only), so writes are fast
 * and do not involve git operations.
 *
 * A single session may produce multiple StagedTranscripts: one
 * primary capture (from the stop hook) and zero or more pre-compaction
 * snapshots (from the pre-compact hook). All StagedTranscripts for the
 * same session share a sessionId. The scribe workflow groups them by
 * sessionId before dispatching the Scribe.
 *
 * Once the Scribe processes a session's staged transcripts and produces
 * an Artifact<SessionDoc>, the raw content is promoted to a durable
 * Artifact<Transcript> and all staged artifacts for that session are
 * deleted.
 */
export interface StagedTranscript {
  /** Identifier of the session that produced this transcript. */
  readonly sessionId: string;
  /**
   * Whether this is the primary end-of-session capture or a
   * pre-compaction snapshot taken before context was summarized.
   */
  readonly captureType: StagedTranscriptCaptureType;
}

/**
 * Distinguishes primary session captures from pre-compaction snapshots.
 *
 * - "primary" — captured at session end (stop hook). Contains the
 *   final session transcript, which may include compacted segments.
 * - "precompact" — captured before context compaction (pre-compact
 *   hook). Preserves full context that would otherwise be summarized.
 */
export type StagedTranscriptCaptureType = "primary" | "precompact";

/**
 * A Transcript is a raw capture of a Claude Code session that has
 * been processed by the Scribe. It is the durable record of the
 * session's raw data, stored persistently in the
 * NexusArtifactsRepository.
 */
export interface Transcript {
  /** Identifier of the session that produced this transcript. */
  readonly sessionId: string;
}

// ─── Scribe ────────────────────────────────────────────────

/**
 * The "scribe" Operation consumes a StagedTranscript, synthesizes it
 * into a structured SessionDoc, and promotes the raw transcript to
 * durable storage. The staged artifact is deleted after processing.
 */
export interface ScribeOperation extends Operation {
  readonly name: "scribe";
  readonly effects: readonly [
    { readonly kind: "consumes"; readonly artifactType: "staged-transcript" },
    { readonly kind: "produces"; readonly artifactType: "session-doc" },
    { readonly kind: "produces"; readonly artifactType: "transcript" },
    { readonly kind: "deletes"; readonly artifactType: "staged-transcript" },
  ];
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
  /** ISO 8601 date string (e.g., "2026-03-19"). */
  readonly date: string;
  /** Brief description of the session's primary subject. */
  readonly topic: string;
  /** One or more tags categorizing the session's topics. */
  readonly tags: readonly SessionTag[];
  readonly significance: Significance;
  /** Path to the primary transcript file that was synthesized. */
  readonly transcript: string;
  /** Prose narrative of the session, formatted as markdown. */
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
 * The "herald" Operation consumes SessionDoc artifacts and synthesizes
 * them into an outward-facing narrative, deposited as an
 * Artifact<Publication> in the Publication ArtifactStore.
 */
export interface HeraldOperation extends Operation {
  readonly name: "herald";
  readonly effects: readonly [
    { readonly kind: "consumes"; readonly artifactType: "session-doc" },
    { readonly kind: "produces"; readonly artifactType: "publication" },
  ];
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
  /** ISO 8601 date string (e.g., "2026-03-19"). */
  readonly date: string;
  readonly type: PublicationType;
  /** Brief description of what sessions or period this covers. */
  readonly scope: string;
  /** Paths to the session docs that were synthesized. */
  readonly sessions: readonly string[];
  /** The published narrative, formatted as markdown. */
  readonly body: string;
}

/**
 * The kind of published content a Herald produces.
 */
export type PublicationType = "recap" | "deep-dive" | "status-update" | "blog-post";
