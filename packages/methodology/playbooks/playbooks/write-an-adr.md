---
id: write-an-adr
title: Write an Architectural Decision Record
summary: A lightweight, opinionated process for capturing the structural decisions in a project — so future readers (human or agent) know what was chosen, why, and what it cost.
version: 0.1.0
problem: |
  Architectural decisions made in chat, in meetings, or implicitly in code become invisible within weeks. Future contributors — especially agents — re-litigate or accidentally undo them.
when_to_use: |
  Any time you make a decision that a future reader might reasonably question, where the answer is not obvious from the code alone.
expected_outputs:
  - A short Markdown ADR file with status, context, decision, and consequences.
  - A number assigned in sequence (`0001`, `0002`, …).
  - An updated index in `docs/architecture/decisions/README.md`.
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 2
related_principles:
  - documentation-as-architecture
  - maintainability
  - separation-of-concerns
tags:
  - adrs
  - documentation
  - decisions
---

# Write an Architectural Decision Record

An ADR (Architectural Decision Record) is a small, dated file that captures one structural decision. It is the cheapest piece of documentation you can write and one of the highest-leverage.

## When to write one

Write an ADR when **all three** of these are true:

1. The decision is structural — it affects how modules, data, or workflows are shaped, not just how a single function is written.
2. A future reader might reasonably question the decision later.
3. The reason is not obvious from the code alone.

If only one or two are true, you do not need an ADR. Resist writing them for everything; that dilutes the signal.

## When **not** to write one

- For coding-style choices already covered in lint or formatter config.
- For decisions reversed within the same change.
- To document what the code already obviously does. (That is an architecture overview, not an ADR.)
- As a substitute for actually deciding. ADRs record decisions, they do not make them.

## The format

Keep it short. A good ADR is readable in under two minutes. Use this template:

```markdown
# ADR-NNNN: <Title in one line>

- **Status:** Proposed | Accepted | Superseded by ADR-MMMM | Deprecated
- **Date:** YYYY-MM-DD
- **Deciders:** <names or roles>

## Context

Two to four short paragraphs describing the forces at play. What problem is being solved? What constraints exist? What alternatives were considered?

## Decision

The choice, stated in the active voice. "We will …" not "It was decided that …".

## Consequences

What this decision makes easy. What it makes harder. What follow-on work it requires. What signals would cause us to revisit.
```

That is the entire format. Five sections, no ceremony, no project management overhead.

## Numbering and naming

- Files are numbered `NNNN-kebab-case-title.md` starting at `0001`.
- The number is permanent. If an ADR is superseded, write a new one and update the old one's status.
- The title in the filename matches the title at the top of the file.

## The status lifecycle

- **Proposed** — written but not yet adopted. Use for ADRs you want to discuss before committing to.
- **Accepted** — the current decision. This is the default and most common state.
- **Superseded by ADR-MMMM** — replaced by a later decision. The old ADR stays in the repo as historical context.
- **Deprecated** — no longer relevant, but kept because the decision shaped systems that still exist.

ADRs are never deleted. The history is the value.

## Index your ADRs

Maintain a `docs/architecture/decisions/README.md` that lists every ADR with its title and status. Without an index, ADRs become invisible — the opposite of the goal.

## A worked example

> See `docs/architecture/decisions/` in this repository. Every ADR there was written following this playbook.

## How to ask an agent to write one

> I made the following structural decision: **\[describe it].** Write an ADR following the ContextQB ADR format. Number it as the next available number under `docs/architecture/decisions/`. Update the index. Be specific about the consequences — name at least one thing this makes easier and one thing it makes harder.

Resist the urge to let the agent invent the decision. An ADR records a decision _you_ made; the agent's job is to write it down well.

## Anti-patterns

- **ADRs for everything.** Dilutes signal. Aim for "every contributor can list them from memory" rather than a hundred-entry archive.
- **Retroactive ADRs with no value.** Writing ADRs for decisions made years ago, by people no longer around, with no context. Usually not worth it.
- **ADRs as substitute documentation.** ADRs record _why_ a decision was made. They do not describe how the system works today; that is an architecture overview.
- **Long ADRs.** If it does not fit in two minutes of reading, it is two ADRs or it is an architecture overview disguised as an ADR.
- **Edited history.** Once an ADR is accepted, do not rewrite it. Supersede it with a new ADR that references the old.
