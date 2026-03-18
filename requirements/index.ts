/**
 * Nexus Mk II — Requirements Registry
 *
 * Structured index of all project requirements.
 * Each entry references a markdown file containing full prose.
 *
 * Human-owned. Agents must not modify this file.
 */

import type { Requirement } from "../ontology/index.ts";

export const requirements: Requirement[] = [
  {
    id: "auditor-agent",
    title: "Auditor Agent",
    status: "draft",
    priority: "high",
    body: "./auditor-agent.md",
    acceptance: [
      "An auditor agent exists that can read the requirements registry",
      "The auditor produces a structured report covering every registered requirement",
      "Each requirement in the report is assessed as met, not met, or unclear",
      "Assessments include evidence or reasoning",
      "The auditor makes no changes to the project",
    ],
  },
];
