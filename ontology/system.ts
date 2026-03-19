/**
 * System — the top-level composition of a Nexus system.
 */

import type { NexusDomainRepository, NexusImplementationRepository } from "./repository.js";
import type { Auditor } from "./audit.js";
import type { Builder } from "./builder.js";
import type { Scribe, Herald } from "./documentation.js";
import type { ArtifactStoreRegistry } from "./artifact.js";

/**
 * A Dispatcher triggers Operations on Operators. Given an Operator
 * name and an Operation name, it causes the Operation to execute
 * and its declared Effects to occur.
 *
 * The Dispatcher does not return results directly. Produced Artifacts
 * are deposited in the appropriate ArtifactStore as declared by the
 * Operation's Effects.
 *
 * The Dispatcher is the system's single entry point for invoking
 * Operations. All Operators registered with the Dispatcher are
 * dispatchable from the command line.
 */
export interface Dispatcher {
  readonly auditor: Auditor;
  readonly builder: Builder;
  readonly scribe: Scribe;
  readonly herald: Herald;
}

/**
 * The top-level description of a correctly constituted Nexus system.
 * If a value of this type can be constructed, the system has all
 * required structural components.
 *
 * This is the type-level specification: an implementation proves
 * structural completeness by exporting a value that satisfies
 * NexusSystem.
 */
export interface NexusSystem {
  readonly repositories: {
    readonly domain: NexusDomainRepository;
    readonly implementation: NexusImplementationRepository;
  };
  readonly stores: ArtifactStoreRegistry;
  readonly dispatcher: Dispatcher;
}
