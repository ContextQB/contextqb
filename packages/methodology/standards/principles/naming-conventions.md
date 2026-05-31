---
id: naming-conventions
title: Naming Conventions
summary: Naming is architecture. Good names describe domain responsibility — not implementation detail or generic role.
version: 0.1.0
category: naming
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 1
journey_rank: 30
tags:
  - naming
  - clarity
anti_patterns:
  - "`utils`, `helpers`, `misc`, `manager`, `handler`, `core`, `common`, `base` — when used as a primary name."
  - Files named after their type (`hooks.ts`, `components.ts`) instead of their responsibility.
  - Function names that describe what they technically do, not what they mean in the domain (`processData` instead of `validatePurchaseOrder`).
  - Boolean flags named for their negative (`disableX` instead of `enableX`).
agent_instructions:
  - When proposing a new file or function, propose a name that describes what it is responsible for in the user's domain.
  - Reject names like `helpers.ts` or `manager.ts` unless their scope is clearly defined and narrow.
  - Maintain consistent verbs and nouns across the codebase.
related:
  - modularity
  - separation-of-concerns
  - documentation-file-naming
  - documentation-as-architecture
---

# Naming Conventions

Naming is not aesthetic. It is structural. A well-named module is half-documented. A badly-named module is permanently confusing — and AI assistants will pile more code into it because the vague name accepts anything.

## The rule

**Names should describe domain responsibility.**

`PurchaseOrderValidator` is a name. `Validator` is a category. `Helpers` is a confession.

## Specific guidance

### Files

- Name files for what they own, not what type they are.
- `state-ownership.md` is a name. `markdown-files.md` is not.
- `content-source.ts` is a name. `helpers.ts` is not.

### Functions

- Verb + noun. `validatePurchaseOrder`, `fetchUserProfile`, `renderResourceCard`.
- Avoid `process`, `handle`, `manage`, `do` as the verb unless you cannot avoid them.

### Booleans

- Name them for the positive case. `isEnabled`, not `notDisabled`.
- Read aloud. If "`if (isLoading)`" sounds like English, the name is good.

### Variables

- `currentUser` and `previousUser` are clearer than `user` and `oldUser`.
- Avoid abbreviations unless they are universally understood in your domain.

## The "manager" smell

If a module is named `XManager`, ask: what does it manage that an `X` couldn't manage itself? Usually the answer is "nothing" — the `Manager` is a place to put logic that should live on `X` itself, or be split into smaller modules with real names.

## How to ask an agent to enforce this

> Review every file and exported function name in this feature. For each, ask: does the name describe a clear domain responsibility? If not, propose a better name and the reasoning behind it.

## See also

The same rule applies to documentation filenames, with one small list of conventional exceptions. See [`documentation-file-naming`](contextqb://principles/documentation-file-naming) for the documentation-specific corollary.
