---
id: extension-ui-audit
title: Extension UI Architecture Audit Prompt
summary: A long-form structural review prompt for a browser extension UI — focused on the system, not on isolated bugs.
version: 0.1.0
audience:
  - founder
  - developer
  - agent
journey_stage: 4
journey_rank: 10
use_case: |
  When a browser extension has grown organically across menus, sidebars, content scripts, and settings — and you need a structural assessment, not a bug list.
variables:
  - REPO_PATH
expected_output: |
  A Markdown document evaluating the extension's UI across all surfaces — popup, sidebar, content scripts, options, background — covering menu structure, sidebar orchestration, state ownership, multi-tab robustness, settings system, in-place interactions, and extensibility for future scoped views and metrics.
quality_standard: |
  The audit must avoid focusing on isolated bugs. It must surface structural patterns that allow bugs to recur. Every finding must reference specific files.
related:
  - state-ownership
  - orchestration
  - modularity
  - extensibility
  - anti-spaghetti
tags:
  - extension
  - ui
  - audit
---

# Extension UI Architecture Audit Prompt

This prompt is the long-form companion to the [`extension-architecture`](contextqb://audits/extension-architecture) audit template. It is intended to be pasted into an agent verbatim.

## The prompt

```text
You are a senior front-end architect performing a structural review of this browser extension's UI for a non-developer product owner. Read carefully across all surfaces — popup, sidebar, content scripts, options page, background script.

Repository path: {{REPO_PATH}}

Your goal is not to list bugs. Your goal is to describe the structure that allows certain bugs to recur, and to recommend the structural changes that would make those classes of bugs no longer possible.

Produce a Markdown document with these sections, in order:

1. Executive summary. 3–5 bullets.

2. Surface map. List every UI surface and the files that own it. Describe each surface's responsibility in one sentence.

3. Menu and navigation structure. How does the user navigate? Is the navigation model consistent across surfaces? Where does the active view live?

4. Sidebar orchestration. Which file coordinates the sidebar's view selection, data loading, and interaction state? Is it a single owner, or is it distributed?

5. State management across surfaces. Produce a table of shared state values with columns: name, kind (server / durable / shared-transient / local), owner, source, consumers, sync mechanism (messaging / storage / signals), drift risk.

6. Modularity. List every file over 300 lines. For each, identify the distinct responsibilities it has accumulated and propose a target module structure.

7. Multi-tab and lifecycle robustness. What happens when two tabs are open? When a tab navigates? When the extension reloads? When permissions are revoked? Quote the code that handles each case (or flag its absence).

8. Settings system. Is settings a coherent system or a stack of patches? List every setting with where it is read, where it is written, and its default. Flag any setting that exists to compensate for a structural issue elsewhere.

9. List manager. If the extension manages user lists, evaluate its data model, state ownership, and the operations available on it.

10. Quotes and highlights. If applicable, evaluate ingestion, storage, ownership, and display.

11. Engagement interaction state. For interactions like replies, likes, follows: where is the optimistic state? Where is the confirmed state? How are conflicts resolved?

12. In-extension replies. Evaluate the reply UX flow — composition state, send orchestration, error handling, retry behaviour.

13. Future scoped views and metrics. Where would future analytics, per-list metrics, or scoped views plug in? Are extension points ready, or would they require a refactor first?

14. Anti-spaghetti scan. Walk the eight ContextQB signals. Mark each present / partly present / absent with evidence.

15. Recommendations. Ordered by impact and risk.

16. 30 / 60 / 90 day plan. 3–5 concrete actions per window.

Tone: direct, plain language, no enterprise jargon. Quote code. Reference file paths. Do not write code. Do not end with a summary — end with the 90-day plan.
```
