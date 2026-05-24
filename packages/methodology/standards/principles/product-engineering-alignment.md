---
id: product-engineering-alignment
title: Product-to-Engineering Alignment
summary: Code abstractions should mirror product abstractions. The product is the source of truth for vocabulary.
version: 0.1.0
category: alignment
audience:
  - novice-builder
  - agent
  - developer
  - founder
tags:
  - domain-modeling
  - naming
  - product
anti_patterns:
  - Technical names diverge from product names (code says "item" but product says "task").
  - Implementation details leak into user-facing concepts.
  - Engineers invent abstractions that don't exist in the product model.
  - Refactors rename things without updating the product vocabulary.
  - Multiple words for the same concept scattered across the codebase.
agent_instructions:
  - Use the product's vocabulary in code. If the product says "workspace," the code says "workspace."
  - If you must use a technical term internally, map it explicitly to the product term in comments or a glossary.
  - When you don't know the product term, ask. Don't invent.
  - Match module boundaries to product feature boundaries where possible.
  - Changes to product vocabulary should trigger code renames.
related:
  - naming-conventions
  - separation-of-concerns
  - documentation-as-architecture
---

# Product-to-Engineering Alignment

The product is the source of truth for vocabulary. If the product calls it a "workspace," the code calls it a "workspace." If the product calls it a "task," the code does not call it an "item."

This sounds obvious. In practice, it breaks constantly — especially when agents generate code without awareness of the product context.

## Why it matters

1. **Communication cost.** Every time product says "task" and an engineer says "item," someone translates. Translation slows down conversations and introduces errors.
2. **Onboarding cost.** New developers read the code and learn a vocabulary that doesn't match the product. They ask questions; senior engineers explain the mapping; time disappears.
3. **Refactoring cost.** When product renames something, the codebase has to change in two places: once for the product concept, again for the engineering synonym.
4. **Agent confusion.** When you prompt an agent with product context and the codebase uses different terms, the agent may hallucinate or rename things incorrectly.

## The rule

**Code abstractions should mirror product abstractions.**

- Use the same nouns. If product says "project," code says `project`, not `container` or `workspace`.
- Use the same verbs. If the product action is "archive," the function is `archiveProject`, not `softDeleteProject` or `deactivateProject`.
- Use the same boundaries. If "billing" is a product feature, `billing` is a module. If "settings" is a product section, settings code lives together.

## When technical terms are necessary

Sometimes you need a technical term the product doesn't use — a cache, a queue, a transaction. That's fine, but keep it internal:

- Expose the product vocabulary at the API and UI layer.
- Use technical vocabulary only in implementation internals.
- Document the mapping if it's not obvious.

## A worked example

| Product term | Wrong code term                    | Correct code term |
| ------------ | ---------------------------------- | ----------------- |
| Workspace    | `Team`, `Organization`, `Tenant`   | `Workspace`       |
| Task         | `Item`, `Todo`, `Record`           | `Task`            |
| Archive      | `SoftDelete`, `Deactivate`, `Hide` | `Archive`         |
| Member       | `User`, `Participant`, `Assignee`  | `Member`          |

## How to ask an agent to follow this

> Use the product vocabulary for all names in this feature. The product calls this a "workspace" — use that word in the code. If you are unsure of the product term for a concept, ask before inventing a name.
