---
id: anti-spaghetti
title: Anti-Spaghetti Development
summary: Concrete checklist for identifying spaghetti code — the hidden coupling, ad hoc orchestration, and brittle lifecycle assumptions that AI assistants generate by default.
version: 0.2.0
category: diagnosis
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 6
journey_rank: 10
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
  - anti-spaghetti-review
  - architectural-hardening-loop
  - architecture-review
  - backend-architecture
  - bug-as-investigation
  - extension-architecture
  - extension-ui-audit
  - feature-build-loop
  - general-technical-audit
  - modularity
  - orchestration
  - public-endpoints-are-battlegrounds
  - repo-cleanup
  - retrofit-drift-detection
  - separation-of-concerns
  - state-management
  - state-ownership
  - ui-architecture
  - refactor-with-duplicates

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
- On a backend: does a job assume the record it needs was already written by another job, or that a process never restarts mid-task?

### 8. Features bolted on, not integrated

- Are recent features visible as `if` branches and feature flags scattered across unrelated files?
- Or are they isolated behind clear extension points?

## Tools first, judgment second

Four signals can be partly found mechanically. Repeated logic (2) by a duplicate-code detector; state updated from too many places (5) by searching for every write to a value; hidden dependencies (6) by a dependency-graph or import-cycle tool; bolted-on features (8) by searching for feature flags and scattered branches. Ask the agent to read the project instructions and the relevant configuration first, then run whatever tools of those kinds the project has and it is permitted to run — or plain searches — and report what it ran. Use the results to decide which code to read closely. A tool match is a lead, not a finding: the agent still reads the matches and judges whether each is really the signal (two similar functions may be intentionally separate; a flag may be properly isolated). The four that need reading from the start are unclear data flow (1), mixed concerns (3), unpredictable side effects (4) and fragile lifecycle assumptions (7).

Your own check needs no code: for signal 1, ask the agent to "walk me through, step by step, what happens when I click X." If it can't do that without hedging or reading five files, the signal is present.

## How to ask an agent to use this checklist

The agent needs two things: the checklist itself and a clearly named target. Do not assume it already knows "the ContextQB checklist" — an agent without the library may invent one.

- **Supply the checklist.** Use one of these routes:
  - copy the eight numbered signals from "The detection checklist" above, with their questions, and paste them under the request below; or
  - use the [Anti-Spaghetti Review Prompt](contextqb://prompts/anti-spaghetti-review), a ready-to-copy request that already contains all eight signals and asks for a saved report; or
  - if your agent is connected to the ContextQB MCP server, tell it to fetch the checklist with the `get_anti_spaghetti_checklist` tool before it starts.
- **Name the target.** Replace `[target]` with the folder or files to review, for example `src/checkout/` or `src/checkout/cart.ts and src/checkout/payment.ts`. The agent may read other files to follow how the target is used, but it evaluates only the target.

If you chose the Anti-Spaghetti Review Prompt, use it instead of the request below. Otherwise, copy this request and add the checklist by pasting it underneath or by telling the agent to fetch it:

> Evaluate [target] against the eight anti-spaghetti signals in the checklist I have supplied below (or fetched, if I told you to use the ContextQB MCP). Do not substitute a checklist of your own. For each signal, quote the relevant code with its file and line, and state whether the signal is present, partly present, or absent. Read other files only to understand how the target is used. End with a prioritised list of refactors, smallest first. Do not change any code.
