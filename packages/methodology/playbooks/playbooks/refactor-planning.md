---
id: refactor-planning
title: Plan a Refactor Without Rewriting the Whole Repo
summary: A structured approach for scoping, sequencing, and de-risking a refactor — instead of letting an agent rewrite everything at once.
version: 0.1.0
problem: |
  When a codebase becomes painful, the instinct is to ask an agent to "clean it up." That request almost always produces a sweeping rewrite that breaks more than it fixes.
when_to_use: |
  When a specific area of the codebase has become hard to change, but a full rewrite is too risky or too expensive.
expected_outputs:
  - A scoped refactor brief.
  - A sequence of small, independently mergeable steps.
  - Acceptance criteria for each step.
  - A rollback plan.
audience:
  - novice-builder
  - founder
  - developer
  - agent
related_principles:
  - modularity
  - separation-of-concerns
  - maintainability
tags:
  - refactor
  - debt
---

# Plan a Refactor Without Rewriting the Whole Repo

A refactor is not "clean up this code." A refactor is a sequence of safe, small, reversible changes that move the codebase from one shape to a better shape, with the system working at every step.

## Step 1 — Define the symptom

Write one paragraph answering:

- What is hard right now?
- When did it become hard?
- What feature or change exposed the problem?

If you cannot describe the symptom concretely, you do not need a refactor — you need to identify what is actually painful.

## Step 2 — Identify the underlying principle

Use the principles in [`@contextqb/standards`](contextqb://principles/separation-of-concerns) to name the structural cause:

- "State is owned by three places and they have drifted." → [`state-ownership`](contextqb://principles/state-ownership).
- "I cannot add a variant without touching ten files." → [`extensibility`](contextqb://principles/extensibility).
- "The component is 1,200 lines." → [`modularity`](contextqb://principles/modularity).

A refactor without a named principle is a vibes-based rewrite.

## Step 3 — Define the target

Sketch the desired end state in 5–10 lines:

- What modules will exist?
- Who will own which state?
- What will the orchestration layer look like?

This is not a complete design. It is a destination.

## Step 4 — Decompose into safe steps

Each step must be:

- **Independently mergeable.** The system works after each step.
- **Small.** A single PR, a single concern.
- **Reversible.** You can revert one step without breaking the others.

Typical decomposition:

1. Introduce the new abstraction without removing the old one.
2. Migrate call sites one at a time.
3. Verify behaviour at each migration.
4. Delete the old abstraction last.

## Step 5 — Write acceptance criteria

For each step, write:

- What changes after this step.
- What tests confirm the change.
- What stays the same (the user-visible behaviour).

If a step has no test confirming it, you cannot prove it worked. Add the test before the step.

## Step 6 — Write the agent instruction

> I want to refactor **\[scope]** to address **\[principle]**. The target structure is **\[brief description]**. Do not make sweeping changes. Implement step **\[N]** of the plan only:
>
> 1. \[Step 1]
> 2. \[Step 2]
> 3. \[Step 3]
> 4. \[Step 4]
>
> After step \[N], stop and produce a summary of what changed, what was preserved, and what to verify before moving to step \[N+1].

## Step 7 — Have a rollback plan

For each step, the rollback should be "revert this commit." If a step cannot be safely reverted, it is too big.
