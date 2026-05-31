---
id: extension-architecture
title: Browser Extension UI Architecture Audit
summary: A structural audit specifically for browser extension UIs — menus, sidebars, multi-tab state, settings systems, and the orchestration that ties them together.
version: 0.1.0
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
  - Settings system review
  - In-place interactions (replies, list management, quotes, highlights)
  - Future scoped views and metrics extensibility
  - Anti-spaghetti scan
  - Recommendations
  - 30 / 60 / 90 day plan
evaluation_criteria:
  - Findings reference specific files and quote code.
  - State management is evaluated across surfaces, not within them.
  - Multi-tab lifecycle issues are surfaced with concrete reproduction notes.
  - Recommendations are prioritised by impact and risk.
deliverables:
  - A single Markdown document with the required sections.
related:
  - separation-of-concerns
  - state-ownership
  - orchestration
  - modularity
  - extensibility
  - anti-spaghetti
tags:
  - extension
  - browser
  - audit
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
> 6. **Multi-tab and lifecycle robustness.** What happens when two tabs are open? When a tab navigates? When the extension reloads? Quote code that handles each.
> 7. **Settings system review.** Is settings a coherent system or a stack of patches? List every setting, where it is read, and where it is written.
> 8. **In-place interactions.** Replies, list management, quotes, highlights. For each, identify the state owner and the orchestration layer.
> 9. **Future scoped views and metrics.** Where would future analytics, scoped views, or per-list metrics plug in? Are extension points ready?
> 10. **Anti-spaghetti scan.** Eight ContextQB signals, present / partly / absent, with evidence.
> 11. **Recommendations.** Ordered by impact and risk.
> 12. **30 / 60 / 90 day plan.** 3–5 concrete actions per window.
>
> Do not focus on isolated bugs. Focus on the structure that allows those bugs to recur. Be specific. Quote code. Reference files. Do not write code. End with the 90-day plan.
