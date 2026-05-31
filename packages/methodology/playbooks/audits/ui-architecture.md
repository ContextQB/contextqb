---
id: ui-architecture
title: UI Architecture Audit
summary: A structured prompt for asking an agent to evaluate a user interface — its component structure, state ownership, orchestration, and extensibility — without biasing the review toward isolated bugs.
version: 0.1.0
audience:
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
  - 30 / 60 / 90 day plan
evaluation_criteria:
  - Findings reference specific files and quote code.
  - State map covers every shared piece of state.
  - Recommendations are prioritised by impact and risk.
  - The document avoids isolated bug reports — it surfaces structural patterns.
deliverables:
  - A single Markdown document with the required sections.
  - A short summary suitable for a non-developer founder.
related:
  - separation-of-concerns
  - state-ownership
  - modularity
  - extensibility
  - anti-spaghetti
tags:
  - ui
  - audit
---

# UI Architecture Audit

This audit is for when you want a real assessment of the front-end's structure — not a list of small fixes.

## Use this as an agent instruction

> You are a senior front-end architect performing a structural review of this codebase's UI for a non-developer founder. Read the UI code carefully — components, hooks, stores, routing, and any in-UI orchestration logic.
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
> 8. **Anti-spaghetti scan.** Walk through the eight signals in the ContextQB anti-spaghetti checklist and report each as present / partly present / absent, with evidence.
> 9. **Recommendations.** Ordered by impact and risk.
> 10. **30 / 60 / 90 day plan.** 3–5 concrete actions per window.
>
> Be specific. Quote code. Reference file paths. Do not write code. Do not summarise at the end — end with the 90-day plan.

## When the agent comes back

- Verify each finding by opening the file it quotes.
- Push back on anything that reads like a generic best practice without project-specific evidence.
- Feed the recommendations into [`refactor-planning`](contextqb://playbooks/refactor-planning) before approving any code change.
