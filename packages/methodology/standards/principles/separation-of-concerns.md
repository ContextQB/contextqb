---
id: separation-of-concerns
title: Separation of Concerns
summary: Divide systems by responsibility so each piece does one thing clearly and changes for one reason.
version: 0.1.0
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
  - modularity
  - state-ownership
  - naming-conventions
---

# Separation of Concerns

The most common reason AI-assisted codebases collapse is that everything ends up living next to everything else. A single React component fetches data, parses it, transforms it, stores it, renders it, and handles errors. A single backend function authenticates the user, validates input, runs business logic, writes to the database, and sends an email.

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

Mixing two of these in one file is acceptable when the feature is tiny. Mixing four is almost never acceptable.

## How to ask an agent to enforce this

> Review this module. Identify each distinct concern (transport, domain, state, presentation, orchestration). For each concern, name which file currently owns it. Flag any file that owns more than one concern, and propose how to split it.

## When to break the rule

For prototypes that will be thrown away in a week. Almost never otherwise.
