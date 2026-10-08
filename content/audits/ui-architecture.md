---
id: ui-architecture
title: UI Architecture Audit
summary: A structured prompt for asking an agent to evaluate a user interface — its component structure, state ownership, orchestration, and extensibility — without biasing the review toward isolated bugs.
version: 0.2.0
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 4
journey_rank: 20
objective: |
  Produce a system-level assessment of a UI codebase, focused on whether the structure can absorb future change without spaghetti.
scope: |
  All UI surfaces in the target codebase: components, hooks, stores, routing, settings systems, and any in-UI orchestration layer.
required_sections:
  - Executive summary
  - Current UI structure
  - Component inventory by responsibility
  - State map (owner, source, durability)
  - Orchestration layer (where workflows live)
  - Modularity findings
  - Extensibility findings
  - Anti-spaghetti scan
  - Recommendations
  - Now / next / later plan
evaluation_criteria:
  - Findings reference specific files and quote code.
  - State map covers every shared piece of state.
  - Recommendations are prioritised by impact and risk.
  - The document avoids isolated bug reports — it surfaces structural patterns.
deliverables:
  - A single Markdown document with the required sections.
  - A short summary suitable for a non-developer founder.
related:
  - anti-spaghetti
  - extensibility
  - modularity
  - refactor-planning
  - separation-of-concerns
  - state-ownership
tags:
  - ui
  - audit
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.4 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): the anti-spaghetti scan lists the eight signals and the page links the principle; the agent runs the app and exercises the main flows where permitted, against a local or test copy, and records what it observed; asks for a session that did not build the UI; novice-builder added to the audience for the founder-readable output; the 30/60/90-day plan becomes now / next / later (required_sections, body and the S-012 example agree). Earlier notes (2026-09-09 epistemology review): R3–R7 pass. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
---

# UI Architecture Audit

This audit is for when you want a real assessment of the front-end's structure — not a list of small fixes.

## Use this as an agent instruction

> You are a senior front-end architect performing a structural review of this codebase's UI for a non-developer founder. Read the UI code carefully — components, hooks, stores, routing, and any in-UI orchestration logic.
>
> If you are permitted to run the app, start it against a local or test copy — never production data — and walk through the main user flows; record what you did and what you observed, and label findings as "seen running" or "read in code". If you are not permitted, say so.
>
> Produce a Markdown document with these sections, in order:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **Current UI structure.** Describe what exists: pages, routes, top-level components, shared stores, hooks. Use real file paths.
> 3. **Component inventory by responsibility.** Group components into roles (page, container, presentational, layout, etc.). Flag any component that is more than one role.
> 4. **State map.** A table: name | owner | source (server / durable / shared transient / local) | duplicates | derived-or-stored.
> 5. **Orchestration layer.** For each major user flow, name the file that coordinates it. Flag flows with no single coordinator.
> 6. **Modularity findings.** Quote any component over 300 lines, or with more than five responsibilities. Quote any cross-feature coupling.
> 7. **Extensibility findings.** Identify extension points (component slots, theme tokens, settings keys). For each, evaluate name, contract, boundary.
> 8. **Anti-spaghetti scan.** Walk through the eight signals — unclear data flow, repeated logic, mixed concerns, unpredictable side effects, state updated from too many places, hidden dependencies, fragile lifecycle assumptions, features bolted on rather than integrated — and report each as present / partly present / absent, with evidence.
> 9. **Recommendations.** Ordered by impact and risk.
> 10. **Now / next / later plan.** 3–5 concrete actions in each.
>
> Be specific. Quote code. Reference file paths. Do not write code. Do not summarise at the end — end with the plan.

**Before you run it.** Use a session that did not build the UI — a fresh session, a second agent, or a person — and give it the project instructions, the project map, and the code. A different model can add variety; it does not by itself make the audit independent.

The eight signals come from the [anti-spaghetti principle](contextqb://principles/anti-spaghetti), which explains each one.

## When the agent comes back

- Verify each finding by opening the file it quotes.
- Push back on anything that reads like a generic best practice without project-specific evidence.
- Feed the recommendations into [`refactor-planning`](contextqb://playbooks/refactor-planning) before approving any code change.
