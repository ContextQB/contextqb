---
id: choose-a-language-stack
title: Choose a Language Stack for Agent-Assisted Development
summary: A structured process for selecting programming languages that maximise mechanical verification — before any feature code is written.
version: 0.1.0
problem: |
  Teams choose languages by familiarity or fashion, then discover months later that the substrate cannot mechanically check what the agent generates. The result is manual review of every line, which does not scale.
when_to_use: |
  At project start, before any feature code. Also when adding a new surface (a worker, a script runner, a new service) to an existing repository.
expected_outputs:
  - A one-page stack decision listing each surface and its language with reasoning.
  - A verifier inventory per surface (compile-time, runtime schema, lint, format).
  - A list of explicitly considered alternatives and why they were rejected.
audience:
  - novice-builder
  - founder
  - agent
journey_stage: 1
journey_rank: 0
related_principles:
  - machine-verifiable-substrate
  - programming-language-selection
  - new-project-foundation
tags:
  - foundation
  - language
  - setup
---

# Choose a Language Stack for Agent-Assisted Development

Language choice is usually made once, early, and implicitly. For AI-assisted teams, it deserves explicit attention — the language is the substrate on which the agent builds, and a substrate that rejects errors mechanically produces better results than one that relies on human review.

This playbook walks through the decision before any feature code is written.

## The planning prompt

Paste this into your agent at project start:

> I am starting a new project. Before writing any code, I need to decide which programming languages to use for each surface.
>
> Do not write code yet. Produce a stack decision document with these sections:
>
> 1. **Surfaces** — list every distinct surface this project will have (e.g., web frontend, API server, background jobs, CLI, scripts, mobile app). For each, describe its purpose in one sentence.
> 2. **Language selection** — for each surface, propose a language. Answer the four substrate questions explicitly:
>    - Does the compiler reject before you ship?
>    - Can the agent trace types end-to-end?
>    - Is the language server first-class?
>    - Is there a single canonical formatter?
> 3. **Verifier inventory** — for each surface, list the verifiers that will gate the agent's output:
>    - Compile-time (compiler, type checker)
>    - Runtime schema (validation library for I/O boundaries)
>    - Lint (linter and configuration)
>    - Format (formatter)
> 4. **Alternatives considered** — for each surface, name at least one alternative language you did not choose, and explain why.
> 5. **Exceptions** — if any surface will use a permissive language (no compile-time types, no strict mode), explain the justification and document how you will mitigate the risk.
>
> Be concrete. Reference real tools (TypeScript, Pyright, ESLint, Prettier, Zod, etc.). Do not write code.

## What to do with the output

### 1. Read before approving

This document is the foundation for every generation that follows. If the agent proposes JavaScript where TypeScript would work, push back now — not after a thousand files exist.

### 2. Verify the verifier inventory

For each surface, confirm:

- The type checker is real and will be enforced in CI.
- The runtime schema library is specified for every I/O boundary.
- The linter configuration is strict, not default.
- The formatter is canonical and will be enforced.

If any of these are vague ("we'll add linting later"), make them concrete now.

### 3. Check the alternatives

If the agent did not consider obvious alternatives (TypeScript vs JavaScript, typed Python vs untyped), ask why. The goal is not to use every language — it is to make the choice deliberately.

### 4. Save the document

Save the output as `docs/architecture/stack.md`. This becomes the contract. Future changes to the stack require updating the document and justifying the deviation.

### 5. Approve in writing

Reply with "Stack approved — implement as written" before any feature work begins.

## Why this matters for AI-assisted teams

An agent generating code in a permissive language (plain JavaScript, untyped Python) can produce output that:

- Has typos in property names.
- Passes wrong argument types.
- Misses required fields.
- Calls undefined functions.

None of these are caught until runtime — or until a user reports a bug. You become the verifier, reviewing every line.

An agent generating code in a strict language (TypeScript, typed Python, Go, Rust) has a mechanical gate. The build fails. The agent iterates. You review logic and design, not typos.

The 15 minutes spent on this playbook saves hours of review on every feature that follows.

## Example output

Here is a condensed example for a typical SaaS project:

```markdown
# Stack Decision — Acme SaaS

## Surfaces

1. **Web frontend** — React app for end users.
2. **API server** — REST API serving the frontend.
3. **Background jobs** — async task processing (email, billing).
4. **CLI** — internal tooling for ops.

## Language selection

| Surface         | Language   | Compiler? | E2E types? | LSP?           | Formatter?     |
| --------------- | ---------- | --------- | ---------- | -------------- | -------------- |
| Web frontend    | TypeScript | Yes       | Yes        | Yes (tsserver) | Yes (Prettier) |
| API server      | TypeScript | Yes       | Yes        | Yes (tsserver) | Yes (Prettier) |
| Background jobs | TypeScript | Yes       | Yes        | Yes (tsserver) | Yes (Prettier) |
| CLI             | TypeScript | Yes       | Yes        | Yes (tsserver) | Yes (Prettier) |

## Verifier inventory

| Surface         | Type checker | Schema | Linter | Formatter |
| --------------- | ------------ | ------ | ------ | --------- |
| Web frontend    | tsc strict   | Zod    | ESLint | Prettier  |
| API server      | tsc strict   | Zod    | ESLint | Prettier  |
| Background jobs | tsc strict   | Zod    | ESLint | Prettier  |
| CLI             | tsc strict   | Zod    | ESLint | Prettier  |

## Alternatives considered

- **JavaScript** — rejected for all surfaces. No compile-time verification.
- **Go** — considered for API server. Chose TypeScript for stack consistency.
- **Python** — considered for background jobs. Chose TypeScript for stack consistency.

## Exceptions

None. All surfaces use strict TypeScript.
```

## Related resources

- [`machine-verifiable-substrate`](contextqb://principles/machine-verifiable-substrate) — the parent principle on verification.
- [`programming-language-selection`](contextqb://principles/programming-language-selection) — detailed guidance on language choice.
- [`new-project-foundation`](contextqb://playbooks/new-project-foundation) — the broader playbook for preparing a new repo.
