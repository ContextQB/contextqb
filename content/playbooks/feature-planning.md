---
id: feature-planning
title: Plan a Feature Before Letting the Agent Code
summary: A structured planning prompt that produces a feature brief, surface map, state plan, and risk list — before any code is written.
version: 0.2.0
problem: |
  Letting an agent jump straight to code on a non-trivial feature almost guarantees that pieces are added in the wrong places, state ownership is unclear, and edge cases are missed.
when_to_use: |
  Before asking an agent to implement any feature that touches more than one file or more than one concern.
expected_outputs:
  - A one-page feature brief.
  - A list of files to be created or changed, with their responsibilities.
  - A state plan (what state exists, who owns it, where it lives).
  - A risk and edge-case list.
  - The plan saved to a file, ready to become the approved scope.
audience:
  - novice-builder
  - founder
  - agent
journey_stage: 3
journey_rank: 0
related:
  - building-for-yourself-vs-others
  - choosing-your-application-channel
  - feature-build-loop
  - the-mental-model-of-your-app
  - scope-vs-punchlist
  - work-with-agents-through-documentation
  - run-an-agent-workstream
related_principles:
  - modularity
  - orchestration
  - separation-of-concerns
  - state-ownership
  - the-plan-is-the-contract
tags:
  - planning
  - features
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-07 renewal B6 (0.2.0; author self-checked; independent review pending; not operator-accepted): use your tool's planning or read-only mode and still require the seven sections (a planning mode does not by itself stop every action; dated planning-modes reference); every path named must exist or be marked NEW, checked by the agent; three checks you can make yourself; 'use React state' generalised; the plan is saved to a file so it can become the workstream scope; the tier and channel decisions feed the Goal and Out of scope (links to both guides); review provenance neutralised. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; bidirectional handoff to feature-build-loop is the corpus's best playbook pairing. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal). 2026-10-02: body cross-references to the agent workstream method were added (those diffs were inspected in an independent final QA of the workstream vertical) and then finalized for publication (a wording edit that postdates that QA). The whole atom was not re-reviewed; last_reviewed reflects the earlier review."
---

# Plan a Feature Before Letting the Agent Code

This playbook is a feature-specific planning procedure. When the feature is part of a longer effort tracked with the [agent workstream](contextqb://playbooks/run-an-agent-workstream) method, the approved feature brief serves as the scope inside that workstream. For infrastructure, research, content, or other objectives, adapt that general method instead of forcing the work into a feature brief.

The single highest-leverage habit for AI-assisted development is to plan before generating.

A plan does not mean a design document. It means a one-page brief that an agent — or a human — can execute without inventing the architecture as they go.

## Before you start

Two earlier decisions feed this plan: who the feature is for ([Building for Yourself vs. Building for Others](contextqb://guides/building-for-yourself-vs-others)) and where the user meets it ([Choosing Your Application Channel](contextqb://guides/choosing-your-application-channel)). Mention both in the feature description; they shape the Goal and the Out of scope list.

If your tool has a planning or read-only mode ([which tools call it what](contextqb://references/setup#planning-modes)), switch to it — and still ask for the seven sections below. The mode keeps the agent planning before it edits; the sections give the plan its content. A planning mode does not by itself stop every action in every tool, and your permission settings still apply, so the prompt says "do not write code" as well.

## The planning prompt

Paste this into your agent **before** asking for any code:

> I want to add the following feature: **\[describe the feature in one or two sentences].**
>
> Do not write code yet. Produce a feature plan with these sections:
>
> 1. **Goal** — one sentence describing what the user will be able to do.
> 2. **Surfaces touched** — which packages, files, or modules will change. Briefly say what each is responsible for in this feature.
> 3. **New modules** — if you need to create any, name them and state their single responsibility.
> 4. **State plan** — what state is involved, where it lives, who owns it, and whether it is server / durable-client / shared-transient / local.
> 5. **Orchestration** — name the file or function that will coordinate the workflow.
> 6. **Edge cases and risks** — at least five, with the most likely failure first.
> 7. **Out of scope** — what you are explicitly choosing not to do.
>
> Be concrete. Every file path you name must already exist in this repository, or be marked NEW. Do not write code.
>
> Save the plan to `docs/scopes/<feature-slug>.md` (or the path I give you) and tell me the path. Do not change any other file.

## What to do with the output

- **Read it before approving.** This is the only step that costs you minutes and saves you hours.
- **Make three checks you can do without reading code:**
  1. The **Goal** matches what you asked for, in your words.
  2. **Out of scope** contains everything you said not to build.
  3. At least one **edge case** is one you recognise from real use.
- **Push back on vague answers.** If "state plan" says "use component state," ask which component, which value, and what happens when the user navigates away.
- **Let the agent check the paths.** Ask it to confirm that every path it named exists or is marked NEW, and that new modules are consistent with [`modularity`](contextqb://principles/modularity).
- **Approve in writing.** Reply with "Implement plan as written" before code generation begins. The saved plan file becomes the contract — and, if the feature is part of a workstream, its approved scope.

## Next step — run the build loop, do not single-shot the plan

The plan is the contract. Shipping against the contract is a separate discipline.

If the feature is genuinely tiny (one file, one concern), use the brief as a checklist and ship in one session. For anything larger — anything that would benefit from the plan in the first place — hand the approved brief to [`feature-build-loop`](contextqb://playbooks/feature-build-loop). That playbook turns each of the seven sections into a status-tracked, verifiable item and runs a planner-executor loop that prevents the failure modes the brief was supposed to defend against (plan amnesia, edge-case theater, silent scope creep).

If you skip the loop and let an agent execute the whole brief in one session, expect to discover during verification that:

- Edge cases were acknowledged in chat but never landed in code.
- State ended up owned somewhere other than the plan said.
- Items from the "Out of scope" list quietly shipped anyway.

The plan does not enforce itself. The loop is what enforces it.

## Why this matters

When an agent invents the architecture as it codes, two things happen:

1. It picks the easiest place to put each line, not the right place.
2. It does not consider edge cases until it stumbles into them, at which point it patches.

A 5-minute plan turns the agent from a generator into an executor — and the build loop keeps it that way through the actual implementation.
