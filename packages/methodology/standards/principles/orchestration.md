---
id: orchestration
title: Orchestration
summary: Every system needs explicit control flow. Decide what coordinates what, and put the coordinator somewhere obvious.
version: 0.3.0
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

You can notice missing orchestration without reading code. Here is an invented example. An organiser runs workshops with a limited number of places and uses a registration app. Someone fills in their details and presses **Register**. The app sends “Your place is confirmed” straight away. A moment later, saving the reservation fails. The person has been sent a confirmation, but the organiser has no reservation for them, and on the day there may be no seat. The individual features, the form, the storage and the email, may each work. Their order is wrong.

- **Visible symptom:** a person holds a confirmation the organiser's records do not support.
- **What went wrong:** nothing was in charge of the order. The button's code sent the confirmation as soon as it was pressed, while a separate piece of code tried to save the reservation. When saving failed, nobody was responsible for withdrawing the promise or telling the person.
- **The fix:** one named coordinator directs registration and decides what happens on each outcome:
  1. Check the request, for example that the details are complete.
  2. Reserve an available place through the authoritative storage operation.
  3. Only after that reservation succeeds, send the confirmation.
  4. If reserving fails, keep the entered details on screen and explain that no place was confirmed, so the person can try again.

  Sending an email first cannot make a reservation real.

There is a second outcome to plan: the reservation succeeds but sending the confirmation does not. The place now exists. What the coordinator knows depends on the answer it gets from the email service:

- **The service explicitly rejects the message before accepting it,** in a response its documentation describes as a rejection. The coordinator knows the email was not accepted for sending. It records that and handles that one step separately, such as trying the email again or showing the confirmation on screen.
- **No answer arrives, or the response is ambiguous,** for example the request times out or returns an error the service does not document as a rejection. The coordinator does not know whether the message was accepted. It records the outcome as unknown. Before sending again, it checks with the service if the service offers a way to do so, or accepts deliberately that the person might receive two emails.

Even when the service accepts the message, that only means the service took it. It does not show that the email reached the person's inbox, which the app cannot see. Showing the confirmation on screen after the reservation succeeds gives the person a result that doesn't depend on email at all.

Blindly repeating the whole registration could create a duplicate reservation for the same person. To make that decision, the coordinator needs to know which steps completed and what should happen next.

Two people may also press Register for the last place at the same moment. A screen that showed “1 place left” to both of them cannot settle that. The reservation operation itself must accept one and refuse the other, and the coordinator must report each result honestly.

That is what orchestration means here: responsibility for the sequence and its outcomes.

**A question you can ask your agent:** "When someone presses Register, what happens, step by step, and which one file or function decides that order? Walk me through success, a failure before the reservation is saved, and a failure after it is saved."

A responsive answer gives a numbered sequence, names **one** coordinator, and describes each outcome as the person would experience it: what they see, what the organiser's records contain and what happens next. Be wary of answers like "the form handles it," "it just saves," steps spread across several files with no single one in charge, or "it depends on timing." Ask the agent to propose where one coordinator should live. Replace “registration” with any action in your app that has more than one step, such as saving and notifying, or charging and recording.

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
