---
id: modularity
title: Modularity
summary: Modules should have clear boundaries and limited responsibilities — small, well-named, and replaceable.
version: 0.1.2
category: modularity
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 2
journey_rank: 10
tags:
  - boundaries
  - structure
anti_patterns:
  - "God components — a single component that owns 1,000+ lines and dozens of responsibilities."
  - Dumping-ground files named `helpers.ts`, `utils.ts`, `misc.ts`.
  - Feature logic spread across unrelated parts of the repo.
  - Two modules that secretly depend on each other's internals.
agent_instructions:
  - Prefer many small, well-named modules to one large one.
  - If a module's name does not describe what it does, the module is wrong, not the name.
  - Detect circular imports and flag them; they almost always indicate a missing module.
related:
  - anti-spaghetti
  - anti-spaghetti-review
  - architecture-review
  - backend-architecture
  - build-mcp-for-project-context
  - extensibility
  - extension-architecture
  - extension-ui-audit
  - feature-planning
  - general-technical-audit
  - maintainability
  - mcp-project
  - naming-conventions
  - new-project-foundation
  - refactor-planning
  - repo-cleanup
  - repo-readiness
  - separation-of-concerns
  - trust-boundaries-are-architecture
  - ui-architecture
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.2 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 (0.1.2; author self-checked; independent review pending; not operator-accepted): preserved; the behavioural premise now says agents extend whichever file they were pointed at unless told where new code belongs; 300 lines is labelled a prompt to look, not a rule; adds that circular imports and file size can be checked by lint rules the agent can add, so you ask for the rule rather than a judgment. Earlier notes (2026-09-09 epistemology review): R3–R7 pass. R8 pending P4."
---

# Modularity

A module is a unit of code with a clear boundary and a clear purpose. A repository is modular when you can describe each module's job in one sentence.

Agents tend to extend whichever file they were pointed at, unless they are told where new code belongs. Without explicit direction — in the request, or in `AGENTS.md` — this drifts every repository toward a small number of huge files.

## The rule

**A module should do one thing. Its name should say what.**

If you cannot name a module without using "and," it is two modules.

## Symptoms of poor modularity

- One file is much larger than the others.
- You have to scroll to understand a single function.
- Adding a feature requires touching files in three unrelated parts of the repo.
- Removing a feature requires hunting through the codebase.
- Two files import each other.

## What good modularity looks like

- Each feature has a directory. Inside that directory, files are named for their role.
- Cross-feature shared code lives in clearly-named shared packages, not in `utils`.
- Modules expose narrow, intentional public APIs.
- Internal helpers are not exported.

## How to ask an agent to enforce this

> List every module that is larger than 300 lines. For each, identify the distinct responsibilities it has accumulated. Propose a target module structure with file names and responsibilities.

The 300-line figure is a prompt to look, not a rule: a long file with one clear job is fine, and a short one with three jobs is not. Two of the symptoms above can be checked mechanically. Ask the agent to add linter rules that flag circular imports and files over a size you choose, and to run them with the other verifiers, so the check happens every time instead of when someone remembers.

## When to break the rule

When premature splitting would create files that are too small to be meaningful. A 20-line module almost never deserves to exist on its own. Wait until the responsibility is real.
