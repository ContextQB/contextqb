---
id: feature-planning
title: Plan a Feature Before Letting the Agent Code
summary: A structured planning prompt that produces a feature brief, surface map, state plan, and risk list — before any code is written.
version: 0.1.0
problem: |
  Letting an agent jump straight to code on a non-trivial feature almost guarantees that pieces are added in the wrong places, state ownership is unclear, and edge cases are missed.
when_to_use: |
  Before asking an agent to implement any feature that touches more than one file or more than one concern.
expected_outputs:
  - A one-page feature brief.
  - A list of files to be created or changed, with their responsibilities.
  - A state plan (what state exists, who owns it, where it lives).
  - A risk and edge-case list.
audience:
  - novice-builder
  - founder
  - agent
journey_stage: 3
journey_rank: 0
related:
  - feature-build-loop
related_principles:
  - separation-of-concerns
  - state-ownership
  - orchestration
tags:
  - planning
  - features
---

# Plan a Feature Before Letting the Agent Code

The single highest-leverage habit for AI-assisted development is to plan before generating.

A plan does not mean a design document. It means a one-page brief that an agent — or a human — can execute without inventing the architecture as they go.

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
> Be concrete. Refer to existing file paths where possible. Do not write code.

## What to do with the output

- **Read it before approving.** This is the only step that costs you minutes and saves you hours.
- **Push back on vague answers.** If "state plan" says "use React state," ask which component, which value, and what happens when the user navigates away.
- **Cross-reference with the codebase.** Are the named modules real? Are the proposed new modules consistent with [`modularity`](contextqb://principles/modularity)?
- **Approve in writing.** Reply with "Implement plan as written" before code generation begins. This becomes the contract.

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
