---
id: choose-a-language-stack
title: Choose a Language Stack for Agent-Assisted Development
summary: A structured process for selecting programming languages that maximise mechanical verification — before any feature code is written.
version: 0.2.0
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
tags:
  - foundation
  - language
  - setup
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-07 renewal B3 (0.2.0; author self-checked; independent review pending; not operator-accepted): states who does what (you decide and approve; the agent drafts, wires and runs the verifiers); gives you one rule to apply when reviewing (prefer the option where mistakes make the build fail); verifier roles stay in the body and tool names only in the labelled example, with a link to the dated verifiers reference; the verifier inventory becomes a hard check — the agent wires and runs each verifier, reports exit status, and shows one deliberate failure; explains why the substrate matters more now that agents iterate against build failures. Earlier notes (2026-09-09 epistemology review): R3–R7 pass. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
related:
  - agent-substrate
  - new-project-foundation
---

# Choose a Language Stack for Agent-Assisted Development

Language choice is usually made once, early, and implicitly. For AI-assisted teams, it deserves explicit attention — the language is the substrate on which the agent builds, and a substrate that rejects errors mechanically produces better results than one that relies on human review.

This playbook walks through the decision before any feature code is written.

**Who does what.** You decide and approve; the agent drafts, explains, wires and runs. The agent proposes the stack and the verifiers, sets them up and runs them. You read the proposal, apply the one rule below, approve it in writing, and check that the verifiers actually run.

**The one rule to apply.** You don't need to know every language to review this. Prefer the option where the agent's mistakes make the build fail before anything runs. For example, TypeScript is JavaScript plus types that a checker verifies before the code runs; plain JavaScript finds the same mistakes only when someone runs the broken code. Reject "we'll add type checking later" — later rarely arrives, and every file written before it has to be fixed.

## The planning prompt

Paste this into your agent at project start:

> I am starting a new project. Before writing any code, I need to decide which programming languages to use for each surface.
>
> Do not write code yet. Produce a stack decision document with these sections:
>
> 1. **Surfaces** — list every distinct surface this project will have (e.g., web frontend, API server, background jobs, CLI, scripts, mobile app). For each, describe its purpose in one sentence.
> 2. **Language selection** — for each surface, propose a language. Answer the five substrate questions explicitly:
>    - Does the compiler reject before you ship?
>    - Can the agent trace types end-to-end?
>    - Is the language server first-class?
>    - Is there a single canonical formatter?
>    - Do you, the agent, write and fix this language reliably? Say how confident you are and why.
> 3. **Verifier inventory** — for each surface, list the verifiers that will gate the agent's output:
>    - Compile-time (compiler, type checker)
>    - Runtime schema (validation library for I/O boundaries)
>    - Lint (linter and configuration)
>    - Format (formatter)
> 4. **Alternatives considered** — for each surface, name at least one alternative language you did not choose, and explain why.
> 5. **Exceptions** — if any surface will use a permissive language (no compile-time types, no strict mode), explain the justification and document how you will mitigate the risk.
>
> Be concrete: name the specific current tool for each verifier role (type checker, runtime schema library, linter, formatter), or its current canonical equivalent, and say why. Do not write code.

## What to do with the output

### 1. Read before approving

This document is the foundation for every generation that follows. Apply the rule above to each surface: if the agent proposes a permissive option (JavaScript where TypeScript would work, untyped Python where typed Python would), push back now — not after a thousand files exist. Ask the agent to explain any term you don't recognise; a good proposal survives a plain-language explanation.

### 2. Verify the verifier inventory

For each surface, confirm:

- The type checker is real and will be enforced in CI.
- The runtime schema library is specified for every I/O boundary.
- The linter configuration is strict, not default.
- The formatter is canonical and will be enforced.

If any of these are vague ("we'll add linting later"), make them concrete now. The current tools for each role, by language, are listed in the dated [verifiers reference](contextqb://references/tools#verifiers-by-language).

### 3. Check the alternatives

If the agent did not consider obvious alternatives (TypeScript vs JavaScript, typed Python vs untyped), ask why. The goal is not to use every language — it is to make the choice deliberately.

### 4. Save the document

Save the output as `docs/architecture/stack.md`. This becomes the contract. Future changes to the stack require updating the document and justifying the deviation.

### 5. Approve in writing

Reply with "Stack approved — implement as written" before any feature work begins.

### 6. Check that the verifiers really run

A verifier that exists only in a document checks nothing. In the same pass that sets up the project, ask the agent to:

> Install and configure the verifiers in `docs/architecture/stack.md`. Add one named command for each (for example `typecheck`, `lint`, `format:check`), run each one, and report the exact command and its exit status. Then prove the type checker is live: add a deliberate type error in a scratch file, run the type check and show me that it fails, then delete the scratch file and show that it passes again.

This is your hard check. Do not move on to features until every verifier has a command, every command ran, and you have seen one fail on purpose.

## Why this matters for AI-assisted teams

An agent generating code in a permissive language (plain JavaScript, untyped Python) can produce output that:

- Has typos in property names.
- Passes wrong argument types.
- Misses required fields.
- Calls undefined functions.

None of these are caught until runtime — or until a user reports a bug. You become the verifier, reviewing every line.

An agent generating code in a strict language (TypeScript, typed Python, Go, Rust) has a mechanical gate. The build fails. The agent reads the error and iterates — current agents do this well and quickly, so every mistake a checker catches costs you nothing. You review logic and design, not typos.

The 15 minutes spent on this playbook saves hours of review on every feature that follows.

## Example output

Here is a condensed, illustrative example for a fictional SaaS project. The tool names are one current set of choices for a TypeScript project, shown so the example is concrete — not recommendations. Your agent should pick from the current options for your languages.

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
