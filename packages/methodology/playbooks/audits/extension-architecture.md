---
id: extension-architecture
title: Browser Extension UI Architecture Audit
summary: A structural audit specifically for browser extension UIs — menus, sidebars, multi-tab state, settings systems, and the orchestration that ties them together.
version: 0.2.0
audience:
  - founder
  - developer
  - agent
journey_stage: 4
journey_rank: 30
objective: |
  Evaluate a browser extension's UI architecture for coherence across menus, sidebars, multi-tab behaviour, settings, and the interaction state that ties them together.
scope: |
  All UI surfaces of the extension — popup, sidebar, in-page injections, options page — and the shared state and messaging that connect them.
required_sections:
  - Executive summary
  - Surface map (popup / sidebar / content scripts / options / background)
  - Menu and navigation structure
  - Sidebar orchestration
  - State management across surfaces
  - Multi-tab and lifecycle robustness
  - Platform constraints (manifest version, permissions, background lifecycle)
  - Settings system review
  - Feature interactions (one subsection per in-page feature the project lists)
  - Future views and metrics extensibility
  - Anti-spaghetti scan
  - Recommendations
  - Now / next / later plan
evaluation_criteria:
  - Findings reference specific files and quote code.
  - State management is evaluated across surfaces, not within them.
  - Multi-tab lifecycle issues are surfaced with concrete reproduction notes.
  - Recommendations are prioritised by impact and risk.
deliverables:
  - A single Markdown document with the required sections.
related:
  - anti-spaghetti
  - extensibility
  - extension-ui-audit
  - modularity
  - orchestration
  - separation-of-concerns
  - state-ownership
tags:
  - extension
  - browser
  - audit
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.4 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): the fixed in-place-interactions section (replies, list management, quotes, highlights — one social-media extension's features) becomes 'Feature interactions', one subsection per in-page feature listed in the project's own AGENTS.md or summary; 'per-list metrics' generalised; adds a platform-constraints section with a link to the dated browser-extension reference; the agent runs the extension where permitted, in a test browser profile; the anti-spaghetti signals are listed; the 30/60/90-day plan becomes now / next / later. required_sections and the body agree, and the extension-ui-audit prompt is the paste-ready instance with the same sections plus modularity. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; domain-specific (browser extensions) but the multi-surface state framing generalises the pattern honestly. R8 pending P4."
---

# Browser Extension UI Architecture Audit

Browser extensions are uniquely good at producing spaghetti: multiple surfaces (popup, sidebar, content script, background), multiple tabs, multiple settings layers, and a messaging layer that ties them together. This audit gives an agent a structured way to evaluate the whole thing.

## Use this as an agent instruction

> You are a senior front-end architect performing a structural review of this browser extension's UI. Read the code across all surfaces — popup, sidebar, content scripts, options page, background script.
>
> Produce a Markdown document with these sections, in order:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **Surface map.** Name every surface and its responsibility. Use real file paths.
> 3. **Menu and navigation structure.** How does the user move between views? Is the navigation model consistent across surfaces?
> 4. **Sidebar orchestration.** Which file coordinates the sidebar's state and view selection? Is it a single owner or distributed?
> 5. **State management across surfaces.** A table of shared state values, where each lives, and how it stays in sync (messaging, storage, signals). Flag drift risks.
> 6. **Multi-tab and lifecycle robustness.** What happens when two tabs are open? When a tab navigates? When the extension reloads? Quote code that handles each. If you are permitted to run the extension, load it in a test browser profile with no personal data, reproduce each case, and record what you did and saw; otherwise mark the case "read in code".
> 7. **Platform constraints.** Which manifest version the extension uses, which permissions it requests and why, and how its background code starts, stops and keeps state. Flag anything that relies on background state surviving, or on a permission the features don't need.
> 8. **Settings system review.** Is settings a coherent system or a stack of patches? List every setting, where it is read, and where it is written.
> 9. **Feature interactions.** Take the list of in-page features from the project's `AGENTS.md` or summary (ask for it if there is none). Give each feature its own short subsection: its state owner, its orchestration layer, and how it handles failure. Do not add subsections for features the extension does not have.
> 10. **Future views and metrics.** Where would future analytics, scoped views or per-feature metrics plug in? Are extension points ready?
> 11. **Anti-spaghetti scan.** For each of the eight signals — unclear data flow, repeated logic, mixed concerns, unpredictable side effects, state updated from too many places, hidden dependencies, fragile lifecycle assumptions, features bolted on rather than integrated — say present, partly or absent, with evidence.
> 12. **Recommendations.** Ordered by impact and risk.
> 13. **Now / next / later plan.** 3–5 concrete actions in each.
>
> Do not focus on isolated bugs. Focus on the structure that allows those bugs to recur. Be specific. Quote code. Reference files. Do not write code. End with the plan.

Platform rules (storage limits, background lifecycle, permission behaviour) change between browser and manifest versions; the dated [browser extension platform reference](contextqb://references/setup#browser-extension-platform) records the current facts ContextQB has checked. The eight signals in section 11 come from the [anti-spaghetti principle](contextqb://principles/anti-spaghetti). For a paste-ready version of this audit with a modularity section added, use the [extension UI audit prompt](contextqb://prompts/extension-ui-audit).

**Before you run it.** Use a session that did not build the extension — a fresh session, a second agent, or a person — and give it the project instructions, the project map, and the code. A different model can add variety; it does not by itself make the audit independent.
