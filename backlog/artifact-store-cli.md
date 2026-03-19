---
title: Artifact Store CLI
status: backlog
notes: Discussed in session 2026-03-19. Decisions captured below. Not ready for implementation.
---

# Artifact Store CLI

A CLI that implements the ArtifactStoreRegistry, giving agents and humans a uniform interface to artifact stores without hardcoding paths.

## Motivation

Every agent prompt and requirement that touches an artifact store currently embeds the storage path. The ontology defines `ArtifactStore` and `ArtifactStoreRegistry` as abstractions, but nothing implements them — the path *is* the interface. A CLI would centralize path knowledge, make the registry a real component, and enable store evolution without touching every agent.

## Envisioned interface

```bash
nexus store latest audit-report
nexus store get audit-report <id>
nexus store list audit-report
nexus store list transcript --status pending
```

## Design decisions (from session discussion)

- **Initial scope:** Audit-report store only. Other stores (transcript, session-doc, publication) added incrementally.
- **Language:** TypeScript — first real code in the system, sets the precedent, enables type-checking against the ontology.
- **Command structure:** A proper `nexus` CLI executable, not a `bin/` script. Must be executable cleanly both in-repo during development and (eventually) externally.
- **This is a requirement, not just infrastructure.** When promoted from backlog, it should live under `requirements/` and be auditable.

## Open questions

- Package structure — standalone package, or part of the main repo?
- How to make it executable in dev without a build step (ts-node, tsx, etc.)
- Which operations on day one — just `latest`, or `latest` + `list` + `get`?
- How the builder agent should invoke it — Bash tool, or something else?
