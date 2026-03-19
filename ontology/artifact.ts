/**
 * Artifact — typed persistent records and the stores that hold them.
 */

import type { AuditReport, Assessment } from "./audit.js";
import type { BuildResult } from "./builder.js";
import type { Transcript, SessionDoc, Publication } from "./documentation.js";

/**
 * The fixed set of Artifact types in the system. Each name corresponds
 * to a domain data type and has a dedicated ArtifactStore.
 */
export type ArtifactTypeName =
  | "audit-report"
  | "assessment"
  | "build-result"
  | "transcript"
  | "session-doc"
  | "publication";

/**
 * An Artifact is a typed, persistent record produced by an Operation.
 * It wraps a domain data type (like AuditReport) with identity and
 * metadata. An Artifact outlives the Operation that created it and
 * is retrievable from its ArtifactStore.
 */
export interface Artifact<T> {
  /** Discriminator identifying which domain type this artifact wraps. */
  readonly type: ArtifactTypeName;
  /**
   * Unique identifier for this artifact. Format is determined by the
   * producing Operation (e.g., ISO 8601 compact timestamps for audit reports).
   */
  readonly id: string;
  /** ISO 8601 datetime with full precision (e.g., "2026-03-19T06:29:37Z"). */
  readonly createdAt: string;
  /** The domain data this artifact wraps. */
  readonly content: T;
}

/**
 * An ArtifactStore is the canonical home for Artifacts of a single type.
 * It supports deposit (Operations create Artifacts here) and retrieval
 * (other parts of the system read Artifacts from here).
 *
 * The storage mechanism (filesystem, database, cloud storage, etc.)
 * is an implementation detail constrained by Requirements, not by
 * this definition.
 */
export interface ArtifactStore<T> {
  /** Which artifact type this store holds. */
  readonly artifactType: ArtifactTypeName;
}

/**
 * The system's catalog of ArtifactStores. Each Artifact type has
 * exactly one store. This is the entry point for locating where
 * Artifacts of a given type live.
 */
export interface ArtifactStoreRegistry {
  readonly auditReport: ArtifactStore<AuditReport>;
  readonly assessment: ArtifactStore<Assessment>;
  readonly buildResult: ArtifactStore<BuildResult>;
  readonly transcript: ArtifactStore<Transcript>;
  readonly sessionDoc: ArtifactStore<SessionDoc>;
  readonly publication: ArtifactStore<Publication>;
}
