---
id: programming-language-selection
title: Programming Language Selection
summary: The language is the agent's substrate. A typed, compiled language gives the agent a build-time gate; a permissive language puts every error in production.
version: 0.1.0
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
  - Using Python without type hints and a type checker (Pyright/mypy) for anything that will run in production.
  - Mixing typed and untyped code in the same codebase without clear boundaries.
  - Selecting a language based on ecosystem size alone, ignoring verifier maturity.
agent_instructions:
  - When proposing a language for a new surface, answer the four substrate questions (see below) explicitly.
  - Default to TypeScript over JavaScript for any web or Node.js project.
  - Default to typed Python (with Pyright or mypy strict mode) over untyped Python.
  - If the project already uses a permissive language, propose adding type annotations incrementally rather than rewriting.
  - Document language choices in `docs/architecture/stack.md` with explicit reasoning.
related:
  - machine-verifiable-substrate
  - maintainability
  - failure-modes
---

# Programming Language Selection

Language choice is often treated as a matter of preference or ecosystem. For AI-assisted development, it is a matter of verification. The language is the substrate on which the agent builds. A substrate that rejects invalid output at compile time produces better results than one that waits until runtime — or never.

This principle is a narrow application of [`machine-verifiable-substrate`](contextqb://principles/machine-verifiable-substrate). Where that principle covers all verifiers, this one focuses on the single highest-leverage choice: the programming language.

## The four substrate questions

When choosing a language for any surface (UI, API, job runner, script), answer these questions:

### 1. Does the compiler reject before you ship?

A language with a compile step and a type system catches errors before execution. TypeScript rejects `user.nmae` at build time. JavaScript discovers it when a customer reports undefined behavior.

The earlier the rejection, the tighter the feedback loop for the agent.

### 2. Can the agent trace types end-to-end?

Type information is context. When the agent sees that `getUser` returns `Promise<User>`, it knows what fields are available downstream. When the agent sees `any` or no type at all, it guesses.

Strong, explicit types are documentation the agent can read.

### 3. Is the language server first-class?

A mature LSP (Language Server Protocol) implementation gives the agent (and you) real-time feedback: completions, hover types, go-to-definition, rename refactoring. Languages with weak or inconsistent LSP support slow everything down.

TypeScript's `tsserver`, Rust's `rust-analyzer`, Go's `gopls`, and Python's Pylance/Pyright are first-class. Many niche languages are not.

### 4. Is there a single canonical formatter?

Formatting debates are noise. A language with a blessed formatter (`prettier` for TypeScript, `black` for Python, `gofmt` for Go, `rustfmt` for Rust) eliminates that noise. The agent formats; CI enforces; no one argues.

## The TypeScript vs JavaScript example

This is the most common decision point in web development, and it illustrates the principle clearly.

| Criterion              | JavaScript                        | TypeScript                            |
| ---------------------- | --------------------------------- | ------------------------------------- |
| Compile-time rejection | None                              | Yes — type errors fail the build      |
| End-to-end types       | None — everything is `any`        | Yes — types flow through the codebase |
| LSP maturity           | Partial (inferred types, limited) | Excellent (`tsserver`)                |
| Canonical formatter    | Yes (`prettier`)                  | Yes (`prettier`)                      |
| Agent verification     | Runtime only                      | Build time                            |

The cost of TypeScript is configuration (`tsconfig.json`) and occasional type gymnastics. The benefit is that the agent's output is verified before you see it.

**For any non-trivial web or Node.js project, choose TypeScript.**

## Guidance by stack

### Web frontend

**Default: TypeScript with strict mode.**

The frontend has the most surfaces (components, hooks, state, API calls) and the highest churn. Types catch prop mismatches, hook dependency errors, and API contract drift.

### Backend services

**Default: TypeScript (Node.js), Go, or Rust.**

All three have strong compile-time checking and mature tooling. Go and Rust have the additional benefit of explicit error handling (no hidden exceptions).

Avoid plain JavaScript or untyped Python for services that run in production.

### Data pipelines and scripts

**Default: Python with type hints and Pyright/mypy strict.**

Python dominates data work because of its ecosystem (pandas, numpy, scikit-learn). That ecosystem is now typed — use it.

```python
# Untyped — agent guesses, errors at runtime
def process(data):
    return data["value"] * 2

# Typed — agent knows the shape, Pyright catches errors
from typing import TypedDict

class Record(TypedDict):
    value: int

def process(data: Record) -> int:
    return data["value"] * 2
```

### Native applications

**Default: Swift (iOS/macOS), Kotlin (Android), Rust (cross-platform).**

All three are typed and compiled. Avoid Objective-C and Java where the modern alternatives exist.

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

> For each surface in this project (list them), confirm the language choice satisfies the four substrate questions: compile-time rejection, end-to-end types, first-class LSP, canonical formatter. If any surface fails a question, propose a migration path or document the explicit exception and its justification.
