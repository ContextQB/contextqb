---
id: anti-spaghetti
title: Anti-Spaghetti Development
summary: Concrete checklist for identifying spaghetti code — the hidden coupling, ad hoc orchestration, and brittle lifecycle assumptions that AI assistants generate by default.
version: 0.1.0
category: diagnosis
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 6
journey_rank: 0
tags:
  - diagnosis
  - debt
  - quality
anti_patterns:
  - State updated from too many places.
  - Hidden dependencies between unrelated modules.
  - Effects that trigger other effects.
  - Features added by branching existing code instead of integrating cleanly.
  - Repeated logic in three different files.
agent_instructions:
  - Before extending a module, scan it for spaghetti signals and report them.
  - If asked to add a feature to a module that already has spaghetti signals, propose a small refactor first.
related:
  - separation-of-concerns
  - state-ownership
  - orchestration
  - modularity
---

# Anti-Spaghetti Development

Spaghetti is not a single bug. It is a pattern of small decisions that each looked reasonable in isolation and now collectively make the system impossible to change without breakage.

AI-assisted codebases reach this state faster than human-authored ones because each generation is locally optimised: it solves the immediate problem in the easiest available place, without considering whether the easiest available place is the right place.

## The detection checklist

Run through this list when reviewing a module, a feature, or a whole repo.

### 1. Unclear data flow

- Can you trace a single user action through the system in one minute?
- Or do you have to read three files and run a debugger?

### 2. Repeated logic

- Does the same logic appear in two or more places, slightly different?
- Has a bug ever been fixed in one copy but not the others?

### 3. Mixed concerns

- Does one file own transport, domain, state, and presentation?
- Does one function authenticate, validate, mutate, and render?

### 4. Unpredictable side effects

- Does the function name promise less than it does?
- Are there effects that fire in unexpected orders depending on render?

### 5. State updated from too many places

- Can you list every place a single state value is updated?
- Or are there more than three or four updaters?

### 6. Hidden dependencies

- Does module A break when module B is changed, even though they don't import each other?
- Do they share state, a global, a database row, or an event topic implicitly?

### 7. Fragile lifecycle assumptions

- Does the system depend on a specific render or mount order?
- Does it break if a request finishes "too fast" or "too slow"?

### 8. Features bolted on, not integrated

- Are recent features visible as `if` branches and feature flags scattered across unrelated files?
- Or are they isolated behind clear extension points?

## How to ask an agent to use this checklist

> For each item in the ContextQB anti-spaghetti checklist, evaluate the target module. Quote the relevant code. State whether the signal is present, partly present, or absent. End with a prioritised list of refactors, smallest first.
