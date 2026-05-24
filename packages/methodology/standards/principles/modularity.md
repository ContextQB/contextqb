---
id: modularity
title: Modularity
summary: Modules should have clear boundaries and limited responsibilities — small, well-named, and replaceable.
version: 0.1.0
category: modularity
audience:
  - novice-builder
  - agent
  - developer
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
  - separation-of-concerns
  - naming-conventions
  - extensibility
---

# Modularity

A module is a unit of code with a clear boundary and a clear purpose. A repository is modular when you can describe each module's job in one sentence.

AI assistants tend to expand existing files rather than create new ones, because creating a new file requires more context. Without explicit pushback, this drifts every repository toward a small number of huge files.

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

## When to break the rule

When premature splitting would create files that are too small to be meaningful. A 20-line module almost never deserves to exist on its own. Wait until the responsibility is real.
