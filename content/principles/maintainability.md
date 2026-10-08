---
id: maintainability
title: Maintainability
summary: Code is read more than it is written. Optimise for the version of you that comes back in six months.
version: 0.1.2
category: maintainability
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 4
journey_rank: 20
tags:
  - longevity
  - clarity
anti_patterns:
  - Clever one-liners that compress three steps into one.
  - Premature abstractions that hide what the code actually does.
  - Magic config values that are not documented.
  - Features that appear to work but no one can explain.
agent_instructions:
  - Prefer obvious code to clever code.
  - When generating new code, ask whether a future reader can understand it in one pass.
  - Document non-obvious decisions inline; do not document what the code already says.
related:
  - agent-instructions
  - architectural-hardening-loop
  - build-mcp-for-project-context
  - document-producing-agent
  - documentation-as-architecture
  - extensibility
  - failure-modes
  - machine-verifiable-substrate
  - mcp-project
  - modularity
  - naming-conventions
  - programming-language-selection
  - refactor-planning
  - separation-of-concerns
  - write-an-adr
  - refactor-with-duplicates
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.2 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 (0.1.2; author self-checked; independent review pending; not operator-accepted): preserved; names the next agent session as a reader who may 'simplify' clever code wrongly; the prompt's 1–5 scoring is replaced by the three functions a new reader would most need explained, and why; adds your check (can the agent explain the file in plain language in one pass?). Earlier notes (2026-09-09 epistemology review): R3–R7 pass. R8 pending P4."
---

# Maintainability

Most software is maintained for longer than it took to write. Most code is read more than it is written. The decisions that matter most are the ones that affect how easy it is to come back to the code in six months — or for a different person, or a different agent — and understand it without archaeology.

The most frequent new reader is the next agent session. It arrives without your context, and it may "simplify" clever code it misunderstands, quietly removing the reason it was written that way. So even if you never read the code yourself, maintainability decides how safely the agent can change it. Your check: ask the agent to explain a file in plain language in one pass. If it can't without hedging, the next session will struggle too.

## The four questions

For every change, ask:

1. **Will this be understandable in six months?** If the answer requires "you have to remember the context," fix it.
2. **Can a new feature be added without breaking three unrelated things?** If not, the change is too coupled.
3. **Is this easy to test?** Hard-to-test usually means hard-to-reason-about.
4. **Is this an intentional abstraction or accidental complexity?** Abstractions that don't earn their cost are negative value.

## Prefer obvious to clever

A boring solution that everyone understands is worth more than a clever solution that one person understands.

```ts
const xs = arr.reduce((a, x) => ({ ...a, [x.id]: x }), {});

const byId: Record<string, Item> = {};
for (const item of arr) byId[item.id] = item;
```

These do the same thing. The second is better.

## Comments

Comments should explain _why_, not _what_. The code already shows what.

Good comment:

```ts
// We special-case empty strings here because the legacy API returns "" for null. Remove after the v3 migration ships.
```

Bad comment:

```ts
// Loop through the items
for (const item of items) { ... }
```

## The six-month test

When you write a file, imagine reading it six months from now with no context. If you would have to read three other files first, the file is wrong.

## How to ask an agent to enforce this

> Review this module for maintainability. Name the three functions a new reader — a person or a fresh agent session — would most need explained, and say why each is hard to follow (unclear in one pass, hard to test, an abstraction that doesn't earn its cost, or a missing or misleading comment). Then propose the three highest-priority improvements.
