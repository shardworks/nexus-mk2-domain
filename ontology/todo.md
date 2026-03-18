# Ontology — Open Questions

Unresolved vocabulary and design questions. Items stay here until resolved and reflected in `index.ts`.

## Agent-adjacent terminology

**Status:** unresolved

"Agent" is defined: a running Claude Code instance with `-p`. But there are several related concepts that don't have settled names yet:

- **The configuration/blueprint** — the `.claude/agents/*.md` file that defines an agent's model, system prompt, tools, and permissions. Is this an "AgentType"? "AgentConfig"? Something else?
- **The role/purpose** — the abstract function an agent serves (e.g., "auditing"). Is this captured by the Operator concept? Is it a "Role"? "AgentRole"? Does it need its own term at all, or is it just the Operator's identity?
- **The relationship between these** — an Agent (running instance) is launched from a config, which serves a role/purpose. How many layers of naming do we actually need here?

Tension: too few terms and we're ambiguous in conversation. Too many and we're maintaining distinctions nobody uses.
