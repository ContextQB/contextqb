---
id: the-plan-is-the-contract
title: The Plan Is the Contract
summary: A plan that nobody verifies against is fiction. When an agent executes a plan, the plan is the contract — every tranche of work is checked against it, divergences are deliberate amendments, and "done" means the plan's own sections say so.
version: 0.1.0
category: orchestration
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 3
journey_rank: 0
tags:
  - planning
  - features
  - governance
anti_patterns:
  - A plan is written, approved, and never re-opened while the agent codes.
  - '"Done" is declared from the agent''s memory of the plan, not from a walk of the plan''s sections against the code.'
  - Reality contradicts the plan mid-build and the divergence is silently rolled forward.
  - The "Out of scope" list quietly ships.
  - The plan is edited to match whatever got built, with no record of the change.
agent_instructions:
  - Before executing any plan section, re-read the plan. After completing one, verify the code against the plan's own words before moving on.
  - "Never self-certify: the session that executed the work is not the session that verifies it."
  - If reality contradicts the plan, stop and surface the contradiction. Do not improvise around it.
  - Treat the plan's "Out of scope" list as a guardrail, not a suggestion. Reproduce it verbatim in every tranche's constraints.
related:
  - documentation-as-architecture
  - state-ownership
  - orchestration
  - failure-modes
  - append-dont-overwrite
  - feature-planning
  - feature-build-loop
  - bug-as-investigation
  - launch-day-checklist
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review Q2 (authored 2026-09-09)"
  reviewer_notes: "Maintainer-approved for publish 2026-09-09. Authored from gap G-12 — the build loops (feature-planning, feature-build-loop) were the corpus's signature practice with no KNOW atom behind them. Long-form principle shape per the P4 template verdict."
---

# The Plan Is the Contract

**Plain language:** A plan you don't check against is just a wish. When an agent builds from a plan, the plan is the contract — the work is only done when someone has walked the plan, section by section, against what actually got built.

## What it is

In agentic development, a feature plan is not a prelude to the work. It _is_ the work's governance. The plan names the goal, the surfaces that may change, the state ownership, the orchestration point, the edge cases, and — just as important — what is out of scope. Once approved, those sections are the definition of done.

The contract has three properties:

1. **It is checkable.** Every section of the plan is a question you can ask of the codebase: does the state live where the plan said? Did the out-of-scope list stay untouched?
2. **It is amendable — deliberately.** When reality contradicts the plan, the correct move is to revise the plan on the record and re-approve it, not to let the code quietly win.
3. **It outlives the session.** The plan, with its execution log, is the durable record of how the feature actually shipped — readable by any future session that has to extend it.

A plan without those properties is a prompt with delusions.

## Why it matters in agentic dev specifically

Agents are brilliant executors and unreliable accountants. Left alone with an approved plan, three failure modes show up in almost every long build:

1. **Plan amnesia.** By the third file, the agent has stopped re-reading the plan. The plan becomes background noise; the agent is now improvising with confidence.
2. **Edge-case theater.** The plan's risks get acknowledged in chat ("yes, I'll handle the empty state") and never land in code. Acknowledgement is not implementation.
3. **Scope creep into the forbidden list.** While building section 3, the agent notices something adjacent that "would be quick." The "Out of scope" list — the part of the plan you thought about hardest — is the first casualty.

None of these are malice. They are what a fast, confident generator does in the absence of an enforcement surface. The contract is that surface.

## The rule in practice

**Verification walks the plan, not the vibes.** After every tranche of work, in a fresh session, walk the plan's sections against the actual code:

- The goal: can a user actually do the thing, end to end?
- The surfaces: did anything change outside the named files?
- The state: is it owned where the plan said, or did a parallel copy appear?
- The orchestration: does the named coordinator actually coordinate?
- The edge cases: for each named risk, point at the code that handles it. If you can't find the code, the case was acknowledged, not handled.
- The out-of-scope list: diff against it. Anything that crept in gets reverted or escalates to a plan revision.

The gap between what was claimed and what was found is the contract working. Close the gap before the next tranche begins.

## The amendment is honest, the drift is not

Plans are wrong sometimes. The executor discovers the client lifecycle can't survive the redirect; the hook has to become a server action. This is normal and good — it is the plan doing its job of forcing the real constraint into the open.

The move is: stop, revise the affected sections on the record (strike through the old line; log the reason), re-approve, resume. The move that kills projects is silently rolling forward — then the plan describes a system that was never built, and every future session reads fiction as truth.

## Signals you're getting this wrong

- **"It's basically done" with no walk of the plan's sections.** Claims are not verification.
- **The plan's edge-case section has no corresponding code.** Theater, not handling.
- **The out-of-scope list shipped.** Nobody enforced the guardrail.
- **The plan and the code disagree and nobody can say when they diverged.** The amendment discipline is missing.
- **The same agent session planned, executed, and verified.** Self-certification is no certification.

## Minimum acceptable posture

You can claim this principle if all of the following hold:

1. **Every non-trivial feature has a written plan before code** — goal, surfaces, state, orchestration, edge cases, out of scope.
2. **Completion is verified against the plan's sections**, in a session that did not write the code.
3. **Divergences are amendments** — the plan is revised on the record, never silently abandoned or retro-fitted.
4. **The out-of-scope list is enforced** — it appears verbatim in the constraints of every unit of work.

## How it relates to other ContextQB principles

**Documentation as Architecture** — The plan is load-bearing documentation: it is what the executor reads and what the verifier checks. This principle is that one applied to the moment of building.

**State Ownership** — The plan's state section names owners before code exists. Verification is where you find out whether the ownership held.

**Orchestration** — The plan names the orchestrator. The contract is what keeps the orchestrator from leaking into a hook, a component, and three handlers.

**Append, Don't Overwrite** — Plan revisions preserve the trail: strikethrough for the old line, a log entry for the reason. The contract's history is part of the contract.

## See also

- [Playbook: Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning) — produces the contract
- [Playbook: Run a Feature Build Loop From an Approved Plan](contextqb://playbooks/feature-build-loop) — enforces the contract, tranche by tranche
- [Playbook: Convert a Bug Into an Architectural Investigation](contextqb://playbooks/bug-as-investigation) — when a bug reveals the contract was never written
- [Principle: Documentation as Architecture](contextqb://principles/documentation-as-architecture) — why the written plan is load-bearing at all
- [Principle: Failure Modes](contextqb://principles/failure-modes) — the taxonomy the edge-case walk draws from
