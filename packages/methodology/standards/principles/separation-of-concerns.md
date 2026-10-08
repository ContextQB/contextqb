---
id: separation-of-concerns
title: Separation of Concerns
summary: Divide systems by responsibility so each piece does one thing clearly and changes for one reason.
version: 0.1.2
category: structure
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 2
journey_rank: 0
tags:
  - architecture
  - boundaries
anti_patterns:
  - UI components that own data fetching, parsing, and persistence.
  - "`utils.ts` files that accumulate unrelated logic."
  - Backend handlers that mix authentication, business rules, and database calls in one function.
agent_instructions:
  - Before writing any new function, identify which concern it belongs to.
  - If a single file changes for more than one reason, propose splitting it.
  - Never mix transport, domain, and presentation logic in one module.
related:
  - anti-spaghetti
  - architecture-review
  - backend-architecture
  - build-mcp-for-project-context
  - context-quarterback-the-onboarding-map
  - document-producing-agent
  - documentation-as-architecture
  - extensibility
  - extension-architecture
  - feature-build-loop
  - feature-planning
  - general-technical-audit
  - maintainability
  - mcp-project
  - modularity
  - naming-conventions
  - new-project-foundation
  - orchestration
  - product-engineering-alignment
  - refactor-planning
  - repo-readiness
  - set-up-agents-md
  - state-ownership
  - trust-boundaries-are-architecture
  - ui-architecture
  - write-a-context-qb
  - write-an-adr
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.2 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 (0.1.2; author self-checked; independent review pending; not operator-accepted): preserved; 'the most common reason' softened to 'one of the most common'; React labelled as the example framework; adds that a CLI or data pipeline has the same five concerns in different homes, that prototypes rarely get thrown away (run the enforcement prompt before the next feature when one survives), and your one-sentence-per-file check. Earlier notes (2026-09-09 epistemology review): R3–R7 pass. Rule crisp; agent_instructions actionable. R8 pending P4."
---

# Separation of Concerns

One of the most common reasons AI-assisted codebases collapse is that everything ends up living next to everything else. A single UI component (a React component, say) fetches data, parses it, transforms it, stores it, renders it, and handles errors. A single backend function authenticates the user, validates input, runs business logic, writes to the database, and sends an email.

Each of those is a different concern. When they share a file, they share a fate: you cannot change one without risking the others.

## The rule

**Each module should have one reason to change.**

If the API response shape changes, only the parsing layer should care. If the UI design changes, only the rendering layer should care. If the database schema changes, only the data layer should care.

## What this looks like in practice

A feature usually has at least these concerns:

| Concern       | Lives in                          | Changes when…                 |
| ------------- | --------------------------------- | ----------------------------- |
| Transport     | API client / fetcher              | The API URL or shape changes. |
| Domain logic  | Pure functions, services          | Business rules change.        |
| State         | Store / context / hook            | The UI needs different data.  |
| Presentation  | Components                        | The design changes.           |
| Orchestration | A coordinator (page, route, hook) | The workflow changes.         |

The table is shaped like a web front end, but the same five concerns exist in a command-line tool or a data pipeline, with different homes: transport might be a file reader or an HTTP client, presentation might be the printed output or a report, and orchestration the main command or the pipeline's runner.

Mixing two of these in one file is acceptable when the feature is tiny. Mixing four is almost never acceptable.

**Your check.** You don't need to read the code to apply this. Ask the agent to say, in one sentence per file, what each file is for. A file that needs "and" in its sentence is doing more than one job.

## How to ask an agent to enforce this

> Review this module. Identify each distinct concern (transport, domain, state, presentation, orchestration). For each concern, name which file currently owns it. Flag any file that owns more than one concern, and propose how to split it.

## When to break the rule

For prototypes that will be thrown away in a week. Almost never otherwise.

Prototypes rarely get thrown away. When one survives and starts gaining users, run the enforcement prompt above before the next feature, not after the third.
