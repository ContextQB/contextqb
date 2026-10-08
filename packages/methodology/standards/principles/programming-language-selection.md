---
id: programming-language-selection
title: Programming Language Selection
summary: The language is the agent's substrate. A typed, compiled language gives the agent a build-time gate; a permissive language puts every error in production.
version: 0.2.0
category: structure
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
journey_rank: 60
tags:
  - language
  - typescript
  - typing
  - agent-friendly
  - build-time
anti_patterns:
  - Choosing a language because "I know it" without considering whether the agent can be verified in it.
  - Using JavaScript when TypeScript is available and the project is non-trivial.
  - Using Python without type hints and a type checker for anything that will run in production.
  - Mixing typed and untyped code in the same codebase without clear boundaries.
  - Selecting a language based on ecosystem size alone, ignoring verifier maturity.
agent_instructions:
  - When proposing a language for a new surface, answer the five substrate questions (see below) explicitly.
  - Default to TypeScript over JavaScript for any web or Node.js project.
  - Default to typed Python (with a type checker in strict mode) over untyped Python.
  - If the project already uses a permissive language, propose adding type annotations incrementally rather than rewriting.
  - Document language choices in `docs/architecture/stack.md` with explicit reasoning.
related:
  - agent-substrate
  - choose-a-language-stack
  - failure-modes
  - machine-verifiable-substrate
  - maintainability
  - new-project-foundation
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.2 (agent)"
  reviewer_notes: "2026-10-07 renewal B3 (0.2.0; author self-checked; independent review pending; not operator-accepted): adds a fifth, changeable question (does the agent handle this language reliably?) answered by a short trial rather than a ranking, since no neutral source compares languages per model; replaces the per-platform shopping list with one default for a new project and category guidance for native apps; language servers and formatters described by role with a link to the dated verifiers reference; the Python example no longer uses process(), a verb the naming principle tells agents to avoid; 'now typed' softened to 'largely typed'. Earlier notes (2026-09-09 epistemology review): R3–R7 pass. Correctly defers to machine-verifiable-substrate as the general principle. R8 pending P4. The F-12 placement question it referred to was resolved on 2026-09-09 (machine-verifiable-substrate moved to stage 1)."
---

# Programming Language Selection

Language choice is often treated as a matter of preference or ecosystem. For AI-assisted development, it is a matter of verification. The language is the substrate on which the agent builds. A substrate that rejects invalid output at compile time produces better results than one that waits until runtime — or never.

This principle is a narrow application of [`machine-verifiable-substrate`](contextqb://principles/machine-verifiable-substrate). Where that principle covers all verifiers, this one focuses on the single highest-leverage choice: the programming language.

## The five substrate questions

When choosing a language for any surface (UI, API, job runner, script), answer these questions:

### 1. Does the compiler reject before you ship?

A language with a compile step and a type system catches errors before execution. TypeScript rejects `user.nmae` at build time. JavaScript discovers it when a customer reports undefined behavior.

The earlier the rejection, the tighter the feedback loop for the agent.

### 2. Can the agent trace types end-to-end?

Type information is context. When the agent sees that `getUser` returns `Promise<User>`, it knows what fields are available downstream. When the agent sees `any` or no type at all, it guesses.

Strong, explicit types are documentation the agent can read.

### 3. Is the language server first-class?

A mature LSP (Language Server Protocol) implementation gives the agent (and you) real-time feedback: completions, hover types, go-to-definition, rename refactoring. Languages with weak or inconsistent LSP support slow everything down.

Mainstream typed languages have first-class language servers; many niche languages do not. The current language server for each language is in the dated [verifiers reference](contextqb://references/tools#verifiers-by-language).

### 4. Is there a single canonical formatter?

Formatting debates are noise. A language whose community treats one formatter as standard eliminates that noise (the reference above lists the current ones). The agent formats; CI enforces; no one argues.

### 5. Does the agent handle this language reliably?

This question changes with every model release, and no neutral source ranks languages per model, so answer it by trial rather than reputation. Before you commit, ask the agent to write and fix a small, real piece of the project in the candidate language. Watch whether its first attempts pass the type checker and linter, and whether it fixes failures without flailing. A language the agent writes fluently, with strong checks, is the substrate you want.

## The TypeScript vs JavaScript example

This is the most common decision point in web development, and it illustrates the principle clearly.

| Criterion              | JavaScript                        | TypeScript                            |
| ---------------------- | --------------------------------- | ------------------------------------- |
| Compile-time rejection | None                              | Yes — type errors fail the build      |
| End-to-end types       | None — everything is `any`        | Yes — types flow through the codebase |
| LSP maturity           | Partial (inferred types, limited) | Excellent                             |
| Canonical formatter    | Yes (shared with TypeScript)      | Yes                                   |
| Agent verification     | Runtime only                      | Build time                            |

The cost of TypeScript is configuration (`tsconfig.json`) and occasional type gymnastics. The benefit is that the agent's output is verified before you see it.

**For any non-trivial web or Node.js project, choose TypeScript.**

## The default for a new project

**Use the typed language your agent is strongest in for the job: usually TypeScript (in strict mode) for web apps and services, and Python with type hints and a strict type checker for data work. Let the agent justify anything else in writing.**

That one default covers most first projects. Some notes on applying it:

- **Web frontend.** The frontend has the most surfaces (components, hooks, state, API calls) and the highest churn. Types catch prop mismatches, hook dependency errors, and API contract drift.
- **Backend services.** Using the same typed language as the frontend keeps one set of verifiers. Other compiled, typed languages are good choices when the agent can say why — for example, explicit error handling or a single deployable binary. Avoid plain JavaScript or untyped Python for services that run in production.
- **Data pipelines and scripts.** Python dominates data work because of its ecosystem, and that ecosystem is now largely typed — use the types.
- **Native mobile and desktop apps.** Use the typed language the platform itself currently recommends, and ask the agent to cite the platform's own documentation for that choice. Platform guidance changes; the five questions above don't.

```python
# Untyped — agent guesses, errors at runtime
def double_value(data):
    return data["value"] * 2

# Typed — agent knows the shape, the type checker catches errors
from typing import TypedDict

class Record(TypedDict):
    value: int

def double_value(data: Record) -> int:
    return data["value"] * 2
```

### Notebooks and exploration

**Acceptable: Untyped Python or Julia.**

The goal is iteration speed. Type annotations are optional but still helpful for complex cells.

## When to choose a permissive language

Sometimes the tradeoffs favor permissiveness:

- **Rapid prototyping** — when you will throw the code away in a week, verification overhead may not pay off.
- **Glue scripts** — a 20-line bash script does not need types.
- **ML training code** — the model is the artifact; the training script is scaffolding.

Even here, consider partial strictness. Type hints in a Python training script cost little and help when you return to the code months later.

## How to document the choice

Create `docs/architecture/stack.md` in your repo. For each surface, record:

1. The language and version.
2. The verifier stack (compiler, type checker, linter, formatter).
3. The reasoning — why this language, what alternatives were rejected.

This becomes the contract. Future changes to the stack require updating the document and justifying the change.

## How to ask an agent to enforce this

> For each surface in this project (list them), confirm the language choice satisfies the five substrate questions: compile-time rejection, end-to-end types, first-class LSP, canonical formatter, and whether you write and fix this language reliably (show a small example that passes the checks). If any surface fails a question, propose a migration path or document the explicit exception and its justification.
