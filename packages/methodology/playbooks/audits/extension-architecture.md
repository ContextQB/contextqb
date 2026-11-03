---
id: extension-architecture
title: Browser Extension UI Architecture Audit
summary: A structural audit specifically for browser extension UIs — menus, any sidebar, multi-tab state, settings systems, and the orchestration that ties them together. Sections for a sidebar or planned metrics apply only when the extension has them.
version: 0.3.0
audience:
  - founder
  - developer
  - agent
journey_stage: 4
journey_rank: 30
objective: |
  Evaluate a browser extension's UI architecture for coherence across menus, any sidebar or side panel, multi-tab behaviour, settings, and the interaction state that ties them together.
scope: |
  All UI surfaces the extension actually has — for example popup, sidebar, in-page injections, options page — and the shared state and messaging that connect them.
required_sections:
  - Executive summary
  - Surface map (popup / sidebar / content scripts / options / background)
  - Menu and navigation structure
  - Sidebar orchestration (or not applicable, with evidence, when there is no sidebar)
  - State management across surfaces
  - Multi-tab and lifecycle robustness
  - Platform constraints (manifest version, permissions, background lifecycle)
  - Settings system review
  - Feature interactions (one subsection per in-page feature the project lists)
  - Future views and metrics extensibility (or not applicable, with evidence, when none are planned)
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

---

# Browser Extension UI Architecture Audit

Browser extensions are uniquely good at producing spaghetti: multiple surfaces (popup, sidebar, content script, background), multiple tabs, multiple settings layers, and a messaging layer that ties them together. This audit gives an agent a structured way to evaluate the whole thing.

## Use this as an agent instruction

> You are a senior front-end architect performing a structural review of this browser extension's UI. Read the code across every surface it has — for example popup, sidebar, content scripts, options page, background script. Some sections below apply only when the extension has the thing they examine; when one does not apply, write "Not applicable", say what you checked in the code to establish that, and do not invent findings.
>
> Produce a Markdown document with these sections, in order:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **Surface map.** Name every surface and its responsibility. Use real file paths.
> 3. **Menu and navigation structure.** How does the user move between views? Is the navigation model consistent across surfaces?
> 4. **Sidebar orchestration (if the extension has a sidebar or side panel).** Which file coordinates the sidebar's state and view selection? Is it a single owner or distributed? If there is no sidebar, write "Not applicable — no sidebar" and name what you checked (for example the manifest and any code that injects a panel); view coordination on the other surfaces belongs in section 3.
> 5. **State management across surfaces.** A table of shared state values, where each lives, and how it stays in sync (messaging, storage, signals). Flag drift risks.
> 6. **Multi-tab and lifecycle robustness.** What happens when two tabs are open? When a tab navigates? When the extension reloads? Quote code that handles each. If you are permitted to run the extension, load it in a test browser profile with no personal data, reproduce each case, and record what you did and saw; otherwise mark the case "read in code".
> 7. **Platform constraints.** Which manifest version the extension uses, which permissions it requests and why, and how its background code starts, stops and keeps state. Flag anything that relies on background state surviving, or on a permission the features don't need.
> 8. **Settings system review.** Is settings a coherent system or a stack of patches? List every setting, where it is read, and where it is written.
> 9. **Feature interactions.** Take the list of in-page features from the project's `AGENTS.md` or summary (ask for it if there is none). Give each feature its own short subsection: its state owner, its orchestration layer, and how it handles failure. Do not add subsections for features the extension does not have.
> 10. **Future views and metrics (if any are planned).** Take any planned views, analytics or per-feature metrics from the project's `AGENTS.md`, summary or roadmap. For each, say where it would plug in and whether extension points are ready. If none are planned, write "Not applicable — none planned", say where you looked, and do not propose analytics or metrics the project has not asked for. In either case, say in one or two sentences whether adding another view would mean editing the files that own the existing views.
> 11. **Anti-spaghetti scan.** For each of the eight signals — unclear data flow, repeated logic, mixed concerns, unpredictable side effects, state updated from too many places, hidden dependencies, fragile lifecycle assumptions, features bolted on rather than integrated — say present, partly or absent, with evidence.
> 12. **Recommendations.** Ordered by impact and risk.
> 13. **Now / next / later plan.** 3–5 concrete actions in each.
>
> Do not focus on isolated bugs. Focus on the structure that allows those bugs to recur. Be specific. Quote code. Reference files. Do not write code. End with the plan.

Platform rules (storage limits, background lifecycle, permission behaviour) change between browser and manifest versions; the dated [browser extension platform reference](contextqb://references/setup#browser-extension-platform) records the current facts ContextQB has checked. The eight signals in section 11 come from the [anti-spaghetti principle](contextqb://principles/anti-spaghetti). Sections 4 and 10 are conditional: an extension without a sidebar, or with no planned views or metrics, gets a short "Not applicable" entry with the evidence checked, not invented findings. For a paste-ready version of this audit with a modularity section added, use the [extension UI audit prompt](contextqb://prompts/extension-ui-audit).

**Before you run it.** Use a session that did not build the extension — a fresh session, a second agent, or a person — and give it the project instructions, the project map, and the code. A different model can add variety; it does not by itself make the audit independent.
