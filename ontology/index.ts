/**
 * Nexus Mk II — Domain Ontology
 *
 * Formal definitions for every named concept in the domain.
 * This is the system's shared vocabulary — it defines what words mean,
 * not how code should be structured.
 *
 * Human-owned. Autonomous agents must not modify these files.
 * Agent contributions must conform to the types exported by this module.
 */

export type {
  Repository,
  RepositoryType,
  NexusDomainRepository,
  NexusImplementationRepository,
  NexusArtifactsRepository,
} from "./repository.js";
export { NEXUS_DOMAIN_REPO, NEXUS_IMPL_REPO, NEXUS_ARTIFACTS_REPO } from "./repository.js";

export type {
  Effect,
  ConsumesEffect,
  ProducesEffect,
  ImplementsEffect,
  Operation,
  Operator,
} from "./operator.js";

export type {
  AuditOperation,
  Auditor,
  AuditReport,
  Verdict,
  VerdictResult,
  Assessment,
} from "./audit.js";

export type {
  BuildOperation,
  Builder,
  BuildResult,
} from "./builder.js";

export type {
  Transcript,
  TranscriptStatus,
  ScribeOperation,
  Scribe,
  SessionDoc,
  SessionTag,
  Significance,
  HeraldOperation,
  Herald,
  Publication,
  PublicationType,
} from "./documentation.js";

export type {
  ArtifactTypeName,
  Artifact,
  ArtifactStore,
  ArtifactStoreRegistry,
} from "./artifact.js";

export type {
  SubagentType,
  Agent,
  CocoSubagentType,
} from "./agent.js";
export { COCO } from "./agent.js";

export type {
  Feature,
  Requirement,
  RequirementStatus,
  RequirementNote,
  RequirementNoteType,
} from "./requirement.js";

export type {
  Dispatcher,
  NexusSystem,
} from "./system.js";
