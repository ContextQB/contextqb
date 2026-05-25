---
id: architectural-hardening-loop
title: Run an Architectural Hardening Loop on a Drifted Codebase
summary: A repeating planner-executor loop that converges an AI-built codebase back toward governed architectural invariants — without a rewrite, and without trusting an agent's own claim that work is done.
version: 0.1.0
problem: |
  Codebases built across hundreds of agent sessions drift away from their own foundations. A one-shot audit cannot hold — the next 100 turns will undo it. You need a continuous loop that hardens the system faster than entropy returns to it.
when_to_use: |
  When a working, shipping (or near-shipping) AI-built codebase has accumulated enough drift that point fixes no longer help and a rewrite is too risky. Not for greenfield projects, prototypes, or early discovery work.
expected_outputs:
  - A living audit document with per-item statuses and a tranche history log.
  - A sequence of small, verified batches of work that incrementally converge the codebase.
  - A growing invariants document that captures rules the system must not violate.
  - A planner agent and an executor agent operating in separate sessions, with the planner verifying the executor's work against actual code.
audience:
  - founder
  - novice-builder
  - operator
  - developer
  - agent
journey_stage: 4
related_principles:
  - anti-spaghetti
  - documentation-as-architecture
  - maintainability
  - failure-modes
  - orchestration
  - state-ownership
tags:
  - audit
  - refactor
  - governance
  - drift
---

# Run an Architectural Hardening Loop on a Drifted Codebase

This playbook is for a specific situation: you started a project with a clear structure, built features with AI agents over many sessions, and the codebase has slowly drifted. Components have grown. State ownership is unclear. Two different ways to do the same thing have appeared. A bug in one place is connected to a bug somewhere else for reasons no one remembers.

A one-shot audit will not fix this. By the time you have implemented the findings, new drift has appeared. What you need is a **loop** — a repeatable cycle that converges the codebase faster than your future agent sessions can pull it apart.

This is that loop.

## Why not just do another audit

Three failure modes kill the standard audit-then-fix approach in agentic codebases:

- **Audit completion theater.** An agent reports "done." It is not actually done. The audit was checked off based on a confident self-report.
- **Agent self-certification.** The same agent that wrote the fix is the one verifying the fix. It cannot reliably see what it missed.
- **Opportunistic architecture drift.** While fixing one finding, the agent introduces a new pattern that contradicts an existing one. The audit closes; the entropy increases.

The hardening loop is designed specifically to prevent all three.

## The shape of the loop

```
   audit ──▶ tranche planning ──▶ execution ──▶ verification ──┐
                ▲                                               │
                │                                               │
                └──────── roll-forward of failures ─────────────┘
                                  │
                                  ▼
                       invariant extraction
                                  │
                                  ▼
                       (occasional) horizontal sweep
```

The audit is the map. The tranche is the unit of work. Verification is non-optional. Invariant extraction is what prevents the entropy from returning.

## Roles — non-negotiable separation

The loop requires **two distinct agent sessions**, each with a different prompt and a different job:

- **Planner.** Reasons about architecture. Defines tranches. Verifies completed work against the actual codebase. Extracts invariants. Never executes code changes.
- **Executor.** Implements one tranche at a time. Preserves existing behavior. Reports completion in a structured format. Never self-certifies.

If you run both jobs in the same session, the loop collapses into a normal audit-then-fix workflow with the same failure modes. The separation is what makes the workflow recursive in practice — the planner sees what the executor cannot.

Related: see [`agent-instructions`](contextqb://playbooks/agent-instructions) for how to write document-producing prompts that hold an agent to a structured output.

## The audit as a living governance document

The audit is not a one-time deliverable. It evolves with the loop. Every item in the audit carries:

- **Status** — one of `UNTOUCHED`, `IN PROGRESS`, `PARTIALLY SHIPPED`, `SHIPPED`, `VERIFIED`, `DEFERRED`, `BLOCKED`, `SUPERSEDED`.
- **Implementation notes** — what was actually changed when this item was worked.
- **Verification notes** — what the planner found when checking the implementation against the codebase.
- **Architectural observations** — what this item revealed about the system that the audit missed.

Only the planner moves items into `VERIFIED`. `SHIPPED` means the executor claims it is done. `VERIFIED` means the planner has checked the code and agrees.

At the bottom of the audit, a **tranche history log** records, per tranche:

- What was attempted.
- What was actually completed.
- What was incomplete or inaccurate.
- Remediation rolled forward.
- Architectural decisions or corrections made.
- Cross-cutting concerns discovered.

By the third or fourth tranche, the log is more valuable than the audit itself. It is the operational memory of how the codebase actually changed.

This is [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture) applied to refactor governance.

## What a tranche looks like

A tranche is one batch of work selected from the audit. Each tranche must be:

- **Architecturally coherent.** One theme — e.g. "sidebar rendering architecture cleanup," not "sidebar plus auth refresh plus typography."
- **Small enough to verify.** A reviewer can walk every change in a single pass. If it cannot be verified in one pass, it is too big.
- **Bounded in blast radius.** The system remains deployable after the tranche lands.
- **Foundational before cosmetic.** Early tranches target state ownership, orchestration, service boundaries, async control, and lifecycle cleanup. Naming and styling come later.

A tranche definition contains, at minimum:

- Tranche name / number
- Objectives
- Audit items included
- Remediation items carried forward from the last verification pass
- Architectural rationale
- Expected files / components / services impacted
- Implementation constraints
- Verification requirements
- Risks
- Architectural invariants the tranche should reinforce or establish

Cross-reference: [`refactor-planning`](contextqb://playbooks/refactor-planning) describes the same decomposition discipline applied to a single refactor; a tranche is a refactor with a feedback edge.

## Verification — the load-bearing step

Verification is the step most workflows skip. It is also the step that makes this one work.

After every executed tranche, the **planner** (in a fresh session) does the following before any new work is planned:

1. **Validate every claimed completion against the actual code.** Open the files. Read what changed. Confirm the behavior described in the executor's report matches what was actually shipped.
2. **Look for things the executor cannot see.** New duplication. Drift in naming. New patterns introduced "temporarily." Hidden coupling. Race conditions added during a refactor. See [`failure-modes`](contextqb://principles/failure-modes) for the full failure-mode taxonomy.
3. **Update the audit document.** Move items to `VERIFIED`, `PARTIALLY SHIPPED`, or `DEFERRED` based on what was actually found.
4. **Roll failed work forward.** Any item that is incomplete, inaccurate, or regressed becomes the **first** item in the next tranche. Not a deferred item — the **first** item. This creates back-pressure against completion theater.
5. **Add an entry to the tranche history log** describing what was verified, what was wrong, and what was learned.

The first time you do this honestly, the rate of `VERIFIED` items will be lower than the rate of `SHIPPED` items. This is the loop working, not failing.

## Invariants — what prevents the entropy from coming back

Removing entropy is not enough. Without rules, future agent sessions will reintroduce the same drift in different files. After every tranche, the planner extracts **architectural invariants** — rules the system must obey going forward.

Examples of real invariants:

- All API normalization occurs in one layer.
- UI components may not own persistence logic.
- All async operations must declare cancellation behavior.
- Authentication state is owned by exactly one provider.
- Modals must use the shared orchestration hook.
- Data-loading hooks must expose `loading | error | ready` consistently.

Invariants live in a single file the agents read on every session — `docs/architecture/invariants.md` is a reasonable default. This becomes the constitutional layer of the codebase. Update your `AGENTS.md` to reference it. Future agent sessions will inherit the rules without you re-stating them every time.

This is also where [`state-ownership`](contextqb://principles/state-ownership) and [`orchestration`](contextqb://principles/orchestration) become enforceable rather than aspirational.

## Horizontal sweeps

Tranches handle local consistency well. Some problems are not local. They are spread across the system and only show up when you look at all of them at once. Examples:

- Inconsistent auth handling.
- Duplicate retry logic.
- Fragmented loading states.
- Inconsistent cache invalidation.
- Modal orchestration divergence.

When the planner notices the same kind of drift appearing in three or more tranches, that is the signal for a **horizontal sweep**: a tranche-sized batch whose scope is "every occurrence of pattern X in the codebase." Horizontal sweeps are how you collapse parallel implementations of the same concept down to one.

Cross-reference: [`anti-spaghetti`](contextqb://principles/anti-spaghetti) describes the patterns horizontal sweeps remove.

## Prompt 1 — Kickoff (one-time)

Use this once, after the initial audit document exists (see [`architecture-review`](contextqb://playbooks/architecture-review) for how to commission one). The kickoff prompt converts the audit into a governance document and plans Tranche 1. **It does not execute any code changes.**

Run this in your **planner** session.

> Please use plan mode if you are not already using it.
>
> We are establishing a recursive architectural hardening loop for this codebase.
>
> Primary audit document: **\[path]**
> Supporting architecture / governance documents: **\[paths, if any]**
>
> Treat the audit document as a working architectural map and prioritization layer, **not** as unquestioned truth. The codebase itself is the source of truth. Verify every claim, assumption, and finding against the actual implementation.
>
> ### Task 1 — Prepare the audit as a governance document
>
> Update the audit format so that every item contains:
>
> - a `status` field, drawn from: `UNTOUCHED`, `IN PROGRESS`, `PARTIALLY SHIPPED`, `SHIPPED`, `VERIFIED`, `DEFERRED`, `BLOCKED`, `SUPERSEDED`
> - implementation notes
> - verification notes
> - architectural observations where relevant
>
> Add a dedicated **tranche history / execution log** section at the bottom of the audit. This will function as the durable operational record for the hardening process. It should support: tranche summaries, architectural decisions, discovered regressions, invariant changes, deferred work, cross-cutting concerns, verification findings, newly discovered systemic weaknesses, rationale for major refactors, and candidates for future horizontal sweeps.
>
> ### Task 2 — Plan Tranche 1
>
> After preparing the structure, identify the first architecturally coherent tranche of work. The tranche must:
>
> - prioritise foundational architectural convergence over cosmetic cleanup
> - maintain low blast radius
> - preserve deployability
> - avoid mixing unrelated concerns
> - reduce systemic entropy, not merely close checklist items
> - improve future agent reasoning over the codebase
>
> Produce, for Tranche 1:
>
> - Tranche objectives
> - Included audit items
> - Architectural rationale
> - Expected files / components / services impacted
> - Implementation constraints
> - Verification requirements
> - Likely risks
> - Architectural invariants this tranche should reinforce or establish
>
> Also surface:
>
> - any audit items that appear inaccurate or outdated after codebase review
> - hidden dependencies between audit items
> - sequencing concerns that could affect later tranches
> - any areas where the codebase materially differs from the audit's assumptions
>
> **Do not execute any implementation in this turn.** This pass is strictly for audit preparation, tranche planning, architectural analysis, governance structure establishment, and identification of hidden dependencies.

After this turn returns, hand the Tranche 1 spec to a **separate executor session** for implementation.

## Prompt 2 — Loop continuation (recurring)

Use this for every cycle after Tranche 1 has been executed. Run it in a **fresh planner session** — not the session that planned the previous tranche, and never the session that executed it.

> Please use plan mode if you are not already using it.
>
> We are continuing the architectural hardening loop for this codebase.
>
> Primary audit document: **\[path]**
> Last completed tranche: **\[tranche name / number]**
>
> Your first responsibility is a full verification pass on the last tranche, against the actual codebase — not against the executor's completion notes.
>
> Treat the audit document as a working architectural map, **not** as unquestioned truth. The codebase is the source of truth.
>
> ### Phase A — Verification
>
> 1. Validate every claimed completion item against implementation reality.
> 2. Identify:
>    - incomplete work
>    - regressions
>    - architectural inconsistencies
>    - hidden edge cases
>    - partial implementations
>    - misleading completion claims
>    - newly introduced duplication or drift
>    - audit assumptions that are now outdated or inaccurate
> 3. For every issue discovered, explain the gap, assess severity and architectural impact, propose remediation, and include the remediation as **the first task** in the next tranche.
>
> ### Phase B — Update the governance record
>
> 4. Update the audit document statuses and notes: status changes, implementation notes, verification notes, architectural observations, deferred items, blocked items, superseded items.
> 5. Add an entry to the tranche history / execution log describing: what was verified, what was actually complete, what was incomplete or inaccurate, remediation required, architectural decisions or corrections made, cross-cutting concerns discovered.
> 6. If the tranche revealed any architectural invariants that should now be enforced, add them to the invariants document and note the addition in the log.
>
> ### Phase C — Plan the next tranche
>
> 7. Re-review the audit and supporting architecture / governance documentation.
> 8. Identify the next architecturally coherent tranche. It must:
>    - put remediation items from verification first
>    - continue sequentially from where the last tranche concluded
>    - prioritise foundational architectural convergence over cosmetic cleanup
>    - avoid mixing unrelated concerns
>    - maintain bounded blast radius
>    - preserve deployability and operational continuity
>    - reduce systemic entropy
>
> Produce, for the next tranche:
>
> - Tranche name / number
> - Objectives
> - Audit items included
> - Remediation items carried forward from verification
> - Architectural rationale
> - Expected files / components / services impacted
> - Implementation constraints
> - Implementation risks
> - Verification requirements
> - Architectural invariants to reinforce or establish
>
> Additionally, surface:
>
> - any cross-cutting concerns beginning to emerge across multiple tranches
> - any areas that may need a future horizontal sweep
> - recurring entropy patterns or systemic weaknesses
> - audit items whose assumptions should now be revised given implementation reality
>
> **Do not execute the next tranche in this turn unless explicitly instructed.** This turn is for verification, governance updates, remediation planning, next-tranche planning, and convergence analysis.

After this turn returns, hand the next tranche to a fresh executor session.

## The executor session — completion-reporting contract

The executor never plans the next tranche and never verifies its own work. Its job is to implement the given tranche and report completion in a format the planner can verify against. Require this structure in every executor reply:

> ```
> ## Completed
> ## Partially completed
> ## Deferred
> ## Blocked
> ## Architectural decisions made
> ## Risks introduced
> ## Tests performed
> ## Remaining concerns
> ```

The executor must also be told, explicitly: preserve existing behavior unless changing behavior is the point of the tranche; do not introduce new abstractions without justification; do not perform opportunistic rewrites; document any assumption it had to make.

## Anti-patterns the loop prevents

- **Rewrite syndrome.** "We need a V2." Rewrites destroy accumulated edge-case knowledge, deployment stability, and behavioral maturity. Incremental convergence beats a rewrite for any codebase that already ships.
- **Audit completion theater.** Items marked complete without architectural improvement. Verification is the only defense.
- **Agent self-certification.** The author of the fix is the worst auditor of the fix. Always verify in a separate session with a different prompt.
- **Opportunistic architecture drift.** New patterns introduced casually during unrelated work. Invariants are the long-term defense; tranche scoping is the short-term one.

## When to stop the loop

The loop has done its job when:

- The rate of `VERIFIED` items in each tranche matches the rate of `SHIPPED` items.
- Two consecutive verification passes find nothing material to roll forward.
- New agent sessions complete their work without violating the invariants document.
- The audit document stops growing — items are closing faster than new findings are being added.

At that point, the loop becomes a maintenance cadence: one tranche when a new symptom appears, not a continuous program. The invariants document is what keeps the codebase converged between cycles.

## What this is, in one sentence

A governed engineering loop that converts your audit from a one-shot document into the operational memory of how your codebase actually got hardened — and prevents an agent from telling you the work is done when the code says otherwise.
