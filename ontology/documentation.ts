/**
 * Documentation — transcript capture, scribe, herald, and their outputs.
 */

import type { Operation, Operator } from "./operator.js";

// ─── Transcript ─────────────────────────────────────────────

/**
 * A Transcript is a raw capture of a Claude Code session.
 *
 * Transcripts follow a staged lifecycle: hooks capture raw session
 * data (JSONL) to a workspace-local staging directory during
 * interactive sessions. After the Scribe produces an
 * Artifact<SessionDoc>, the raw transcript is ingested as an
 * Artifact<Transcript> for durable storage. Whether a transcript
 * has been processed is not tracked explicitly — it is determined
 * by whether an Artifact<Transcript> exists for it.
 */
export interface Transcript {
  /** Identifier of the session that produced this transcript. */
  readonly sessionId: string;
}

// ─── Scribe ────────────────────────────────────────────────

/**
 * The "scribe" Operation consumes a Transcript artifact and synthesizes
 * it into a structured SessionDoc, deposited in the SessionDoc
 * ArtifactStore.
 */
export interface ScribeOperation extends Operation {
  readonly name: "scribe";
  readonly effects: readonly [
    { readonly kind: "consumes"; readonly artifactType: "transcript" },
    { readonly kind: "produces"; readonly artifactType: "session-doc" },
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
