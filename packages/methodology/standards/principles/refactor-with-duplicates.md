---
id: refactor-with-duplicates
title: Refactor With Duplicates, Not Overwrites
summary: When changing how existing code works, build the new version next to the old one and switch the places in your code that use it over one at a time — never let an agent overwrite working behaviour in place. The duplicate is the safety net; deletion is the last step, not the first.
version: 0.3.0
category: maintainability
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 6
journey_rank: 30
tags:
  - refactor
  - debt
  - agent-friendly
anti_patterns:
  - An agent rewrites a working file in place and the old behaviour is gone before anyone verified the new one.
  - '"Clean-up" that deletes the old path before any part of the code actually runs on the new one.'
  - A refactor and a behaviour change land in the same commit, so neither can be reviewed or reverted independently.
  - The duplicate ships to production permanently because nobody scheduled the deletion.
agent_instructions:
  - When asked to refactor working code, create the new implementation alongside the old one. Do not overwrite the old one in place.
  - Migrate call sites one at a time, verifying behaviour after each migration.
  - Delete the old implementation only after the new one is verified in real use, and say so explicitly when you do.
  - If you catch yourself overwriting working code, stop and propose the duplicate-first path instead.
related:
  - anti-spaghetti
  - architectural-hardening-loop
  - change-stored-data-safely
  - changing-software-without-losing-control
  - failure-modes
  - feature-build-loop
  - machine-verifiable-substrate
  - maintainability
  - refactor-planning
  - run-an-agent-workstream
  - setting-up-git-and-github

---

# Refactor With Duplicates, Not Overwrites

**Plain language:** When you change how working code works, don't let anyone — especially an agent — erase the old version before the new one is proven. Build the new thing next to the old thing. Switch the places in your code that use it over to the new version one at a time. Delete the old thing last.

The things being moved are parts of the code, not people. A **call site** is one place in the code that uses the module — for example, the checkout page calling the billing calculation. Moving people gradually onto a new behaviour is a different technique (a feature flag or staged rollout), covered below under "What this is not."

## What it is

A refactor changes the shape of code while keeping its behaviour. The dangerous way to do it is in place: open the file, rewrite the guts, hope. The safe way is with duplicates: the old implementation keeps running while the new one is built beside it, call sites migrate one at a time, and the old one is deleted only when nothing depends on it.

The sequence is always the same four steps:

1. **Duplicate.** Create the new module next to the old one. Nothing breaks, because nothing moved.
2. **Migrate.** Switch call sites — the places that use the old module — to the new one, one at a time. The system works after every single step.
3. **Verify.** The new path proves itself against real use — tests, verifiers, actual traffic.
4. **Delete.** The old implementation goes away last, and its deletion is a separate, reviewable change.

If any step fails, you still have a working system. That is the entire point.

## Why it matters in agentic dev specifically

Agents default to overwriting. The easiest place to put a rewritten function is where the old one was, and agents optimise for the immediate request — "clean this up" becomes "watch me delete your working code." Three forces make this worse:

1. **Agents are confident.** The rewritten version looks cleaner and the agent will say so. "Looks cleaner" is not "behaves the same."
2. **Overwrites are invisible in chat.** The agent reports "refactored the module." What actually happened — including any behaviour that silently changed — lives in a diff you now have to read line by line.
3. **Git is not a migration strategy.** `git reset --hard` rescues you when the overwrite is caught immediately. It does nothing for the overwrite that shipped Tuesday and broke a workflow on Friday.

Duplicates turn an agent's rewrite impulse into a safe sequence. The old code stays live as the reference implementation — the executable specification the new one must match. Review becomes a comparison instead of an act of faith.

## The rule in practice

**The old implementation is the specification of the new one.** Keep it readable and running until the replacement has proven itself against it.

Concretely:

- New module next to old: `billing/calculate.ts` alongside `billing/calculate-legacy.ts` — never an in-place rewrite of the working one.
- Suppose twelve places in the code call the billing calculation: the checkout page, the invoice email, the monthly report and so on. One call site — say, the monthly report — switches to `billing/calculate.ts`, gets verified, then the next. Every customer still gets billed by whichever version that part of the code calls. "Migrate all twelve call sites at once" is an overwrite wearing a costume.
- The deletion commit says "delete" and nothing else. If the deletion also changes behaviour, it was two changes pretending to be one.
- If the duplicate is still there in a month, that is a finding, not a norm — duplicates are scaffolding, and scaffolding has a removal date.

## What this is not

- **Not "never delete code."** Deletion is the goal. It just happens last, on evidence, not first, on hope.
- **Not feature flags or a staged rollout to people.** A flag or staged rollout decides which _people_ see a new behaviour — 10% of customers this week, everyone next week. Duplicates decide which _parts of the code_ use a new implementation, and the behaviour is meant to stay the same for everyone. You can combine them, but they answer different questions. A flag that never comes out is the same smell as a duplicate that never gets deleted.
- **Not an excuse for permanent branching.** Two live implementations is a transitional state. The rule names the transition; it does not license the accumulation.

## Signals you're getting this wrong

- **You can't answer "what changed" without reading the whole diff.** The refactor and the behaviour change were the same commit.
- **The agent "simplified" something and a downstream flow broke a day later.** Overwrite landed before verification.
- **Three files named `*-v2` are sitting in the repo from last quarter.** Duplicates without a deletion plan are just clutter.
- **Nobody can say which of the two implementations is canonical.** The migration stalled and was never scheduled to finish.

## Minimum acceptable posture

You can claim this principle if all of the following hold:

1. **No in-place rewrites of working code.** Refactors of live behaviour go through duplicate → migrate → verify → delete.
2. **Deletions are their own change.** Removing the old implementation is a separate commit (or PR) from building the new one.
3. **Call sites migrate incrementally.** Each migration is small enough to revert on its own.
4. **Duplicates carry an expiry.** Each has a named owner and a deletion condition ("delete when checkout-flow runs on the new path for a week"), recorded where it will be seen — if you keep a workstream record, as an item in its outstanding-items register ([Run an Agent Workstream](contextqb://playbooks/run-an-agent-workstream), Step 5), not in someone's memory.

The verify step is cheaper than it used to be: ask the agent for characterization tests of the old implementation — tests that record what the old code currently does for a set of inputs, right or wrong, so you can tell whether the new code does the same — then run both implementations against the same inputs and compare. Matching results are evidence you can read. (This principle is about code. Documents are not duplicated and deleted; they follow the archive policy in the _Append, Don't Overwrite_ principle.)

Use [Changing Software Without Losing Control](contextqb://guides/changing-software-without-losing-control) to compare current behavior with the promise you intend to preserve. Run side-effecting paths against isolated test targets; comparing two versions must not create two live writes, messages or charges. A discovered old defect belongs in a separate, explicit behavior decision.

## How it relates to other ContextQB principles

**Anti-Spaghetti** — Spaghetti is what accretes when every change is a bolt-on or an in-place tangle. This principle is the remediation motion that anti-spaghetti's checklist detects the need for.

**Failure Modes** — An in-place overwrite is the failure mode. Duplicates are the designed response: the failure of the new path leaves the old path standing.

**Machine-Verifiable Substrate** — Verifiers are what make "verify" real. Types, tests, and schemas are how you prove the duplicate matches the original before the original goes away.

## See also

- [Playbook: Plan a Refactor Without Rewriting the Whole Repo](contextqb://playbooks/refactor-planning) — the step-by-step procedure this principle anchors
- [Playbook: Run an Architectural Hardening Loop](contextqb://playbooks/architectural-hardening-loop) — the governed loop for a codebase that needs many of these
- [Playbook: Run a Feature Build Loop](contextqb://playbooks/feature-build-loop) — the same verification discipline applied to new features
- [Principle: Anti-Spaghetti Development](contextqb://principles/anti-spaghetti) — the detection checklist
- [Principle: Failure Modes](contextqb://principles/failure-modes) — what the duplicate protects you from
