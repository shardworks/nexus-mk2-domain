# nexus-mk2-domain

Domain ontology and requirements for [Nexus Mk II](https://github.com/shardworks/nexus-mk2).

This repo is **human-owned**. It defines:

- **Requirements** — Functional, non-functional, and invariants. The objectives the system is built to meet.
- **Ontology** — A typed, statically-verifiable definition of every named concept in the domain. The system's formal interface.

Agents consume these artifacts read-only. They are mounted into agent containers at `/workspace/domain` with no write access.
