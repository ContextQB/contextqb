---
id: maintainability
title: Maintainability
summary: Code is read more than it is written. Optimise for the version of you that comes back in six months.
version: 0.1.0
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
  - naming-conventions
  - modularity
  - separation-of-concerns
---

# Maintainability

Most software is maintained for longer than it took to write. Most code is read more than it is written. The decisions that matter most are the ones that affect how easy it is to come back to the code in six months — or for a different person, or a different agent — and understand it without archaeology.

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

> Review this module for maintainability. For each function, score it 1–5 on: clarity in one pass, ease of testing, justification of abstractions, and quality of comments (or absence where unnecessary). Identify the three highest-priority improvements.
