---
id: orchestration
title: Orchestration
summary: Every system needs explicit control flow. Decide what coordinates what, and put the coordinator somewhere obvious.
version: 0.1.0
category: orchestration
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 2
tags:
  - control-flow
  - workflows
anti_patterns:
  - Ad hoc event chains where component A triggers component B by mutating shared state.
  - Workflow logic scattered across useEffects, callbacks, and side effects.
  - Decisions about "what happens next" made in three different places.
agent_instructions:
  - For every workflow, name the orchestrator.
  - Centralise sequential or conditional logic in one place rather than chaining effects.
  - If two effects trigger each other, treat that as a bug to be fixed by introducing an explicit coordinator.
related:
  - separation-of-concerns
  - state-ownership
  - anti-spaghetti
---

# Orchestration

Every non-trivial system has a control flow. Something decides:

- When the data is fetched.
- What happens after a user clicks.
- Which view to show next.
- What runs after a job completes.

When that "something" is implicit — scattered across effects, callbacks, and event handlers — the system becomes impossible to reason about. Bugs hide in the gaps.

## The rule

**Name the orchestrator. Put it somewhere obvious.**

For a feature, that might be a single page component, a custom hook, or a state machine. For a backend workflow, it might be a single service. For a multi-step user flow, it might be an explicit state machine.

## Centralised vs. distributed orchestration

Centralised orchestration is the default. It is easier to read, easier to test, and easier to change.

Distributed orchestration (event buses, pub/sub, queues) is appropriate when:

- The producers and consumers are owned by different teams or services.
- The workflow has many independent listeners.
- The timing is genuinely asynchronous (jobs, retries, fan-out).

If you cannot defend distribution, choose centralisation.

## Symptoms of missing orchestration

- `useEffect` calls that depend on `useEffect` calls.
- "Sometimes it loads, sometimes it doesn't."
- Two requests fire when one should.
- The order of operations changes based on render timing.
- A bug requires you to draw a sequence diagram to explain.

## How to ask an agent to enforce this

> For every interactive workflow in this feature, identify the orchestrator. If there is no single orchestrator, propose where one should live and what state and transitions it owns.
