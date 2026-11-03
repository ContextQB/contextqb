---
id: orchestration
title: Orchestration
summary: Every system needs explicit control flow. Decide what coordinates what, and put the coordinator somewhere obvious.
version: 0.2.0
category: orchestration
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 2
journey_rank: 30
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
  - agent-instructions
  - anti-spaghetti
  - anti-spaghetti-review
  - architectural-hardening-loop
  - bug-as-investigation
  - extension-architecture
  - extension-ui-audit
  - failure-modes
  - feature-build-loop
  - feature-planning
  - how-the-parts-of-your-app-work-together
  - least-privilege-for-agents
  - run-a-multi-agent-workflow
  - separation-of-concerns
  - state-management
  - state-ownership
  - the-plan-is-the-contract

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

The **orchestrator** is the one place in the code that decides what happens next, in what order, and what to do when a step fails.

## What it looks like from the outside

You can notice missing orchestration without reading code. Here is an invented example. Maya, a fictional founder, uses a small research notebook app to save each source she reads with her note about it. Pressing **Save** involves several steps that must happen in order:

1. Check that the title and note aren't blank.
2. Write the entry to storage.
3. Only after the write succeeds, show "Saved" and clear the form.
4. If the write fails, keep her draft on screen and say it was not saved, so she can try again.

- **Visible symptom:** one day the app says "Saved" and clears the form, but after she reopens the app the entry isn't there, and her draft is gone.
- **What went wrong:** nothing was in charge of the order. The button's code showed "Saved" and cleared the form as soon as it was pressed, while a separate piece of code did the write. When the write failed, nobody was responsible for telling her or keeping the draft.
- **The fix:** one named coordinator for saving runs the steps in order and decides what happens on each outcome. The form asks it to save and shows whatever it reports.

**A question you can ask your agent:** "When I press Save, what happens, step by step, and which one file or function decides that order? What happens if writing the entry fails?"

A responsive answer gives a numbered sequence, names **one** coordinator, and says that on failure the draft stays and the message says it wasn't saved. Be wary of answers like "the form handles it," "it just saves," steps spread across several files with no single one in charge, or "it depends on timing." Ask the agent to propose where one coordinator should live.

The technical choices below are reference depth for you and your agent. For a feature, the orchestrator might be a single page component, a custom hook, or a state machine. For a backend workflow, it might be a single service. For a multi-step user flow, it might be an explicit state machine.

## Centralised vs. distributed orchestration

Centralised orchestration is the default. It is easier to read, easier to test, and easier to change.

Distributed orchestration (event buses, pub/sub, queues) is appropriate when:

- The producers and consumers are owned by different teams or services.
- The workflow has many independent listeners.
- The timing is genuinely asynchronous (jobs, retries, fan-out).

If you cannot defend distribution, choose centralisation.

The same rule applies when the workers are agents. When several agents work on one objective, one keeper decides what runs next and keeps the shared record; see [Run a Multi-Agent Workflow](contextqb://playbooks/run-a-multi-agent-workflow).

## Symptoms of missing orchestration

- You cannot say, in order, what happens after the user clicks.
- In React, for example: `useEffect` calls that depend on `useEffect` calls.
- "Sometimes it loads, sometimes it doesn't."
- Two requests fire when one should.
- The order of operations changes based on render timing.
- A bug requires you to draw a sequence diagram to explain.

## How to ask an agent to enforce this

> For every interactive workflow in this feature, identify the orchestrator. If there is no single orchestrator, propose where one should live and what state and transitions it owns.
