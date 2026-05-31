---
id: extensibility
title: Extensibility
summary: Features should be added into clear extension points — not bolted on with one-off flags and special cases.
version: 0.1.0
category: extensibility
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 4
journey_rank: 30
tags:
  - features
  - growth
anti_patterns:
  - "`if` statements that check for a single special customer or scenario."
  - Components that grow new optional props every time a designer asks for a variant.
  - Settings systems that are really just a stack of unrelated patches.
  - Duplicated view logic where one component handles "the default case" and another handles "the new case."
agent_instructions:
  - Before adding a feature, identify whether the existing extension point fits.
  - If no extension point fits, propose creating one — do not add a one-off branch.
  - Prefer composition (small parts that combine) to configuration (one big part with many flags).
related:
  - modularity
  - separation-of-concerns
  - maintainability
---

# Extensibility

A codebase is extensible when adding a new feature feels like adding to a system, not patching a leak. Every codebase starts extensible. Most lose it gradually, one one-off branch at a time.

## The rule

**A new feature should slot into an existing extension point. If it doesn't, create one — do not branch.**

## Symptoms of lost extensibility

- The third instance of "I just added a flag for that" in a single component.
- New features are gated by a flag check at the top of an old function.
- A "settings" page that is really a list of unrelated knobs accumulated over time.
- Adding a variant to a UI element duplicates 80% of an existing component.

## Composition over configuration

When a component has more than a handful of boolean props, it is usually doing too many things. Two small components that compose are almost always better than one large component with many flags.

```tsx
<Button variant="primary" />
<Button variant="primary-with-icon" />
<Button variant="primary-with-icon-and-loading-spinner" />

<Button>Save</Button>
<Button><Icon /> Save</Button>
<Button><Spinner /> Saving...</Button>
```

The bottom version stays simple as new requirements arrive. The top version explodes.

## Extension points

A useful extension point has three properties:

- **A clear name.** A new contributor can find it.
- **A clear contract.** What does the extension have to provide?
- **A clear boundary.** What can the extension assume, and what is off-limits?

Without all three, an "extension point" is just code that someone hopes will be reused.

## How to ask an agent to enforce this

> Identify every extension point in this feature (component slots, plugin hooks, config options, etc.). For each, evaluate whether it has a clear name, contract, and boundary. Then list any place where a feature was added as a special case instead of through an extension point.
