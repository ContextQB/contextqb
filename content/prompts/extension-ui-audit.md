---
id: extension-ui-audit
title: Extension UI Architecture Audit Prompt
summary: A long-form structural review prompt for a browser extension UI — focused on the system, not on isolated bugs.
version: 0.2.0
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
  A Markdown document evaluating the extension's UI across all surfaces — popup, sidebar, content scripts, options, background — covering menu structure, sidebar orchestration, state ownership, multi-tab robustness, platform constraints, settings system, the interactions of each in-page feature the project lists, and extensibility for future views and metrics.
quality_standard: |
  The audit must avoid focusing on isolated bugs. It must surface structural patterns that allow bugs to recur. Every finding must reference specific files.
related:
  - anti-spaghetti
  - extensibility
  - extension-architecture
  - modularity
  - orchestration
  - state-ownership
tags:
  - extension
  - ui
  - audit
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.5 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): the four fixed domain sections (list manager, quotes and highlights, engagement interactions, in-extension replies — one social-media extension's features) are replaced by one 'Feature interactions' section driven by the extension's own feature list; the original four survive below the prompt as a labelled fictional example of that section, not as required capabilities; adds a platform-constraints section (specifics in the dated browser-extension reference); the extension is run only in a test browser profile where permitted; the eight anti-spaghetti signals are listed; the 30/60/90-day plan becomes now / next / later; sections match the extension-architecture audit plus modularity. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; correctly positioned as the paste-able instance of the extension-architecture audit; R8 pending P4. The F-06 item listed as open was resolved on 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal) and is not open."
---

# Extension UI Architecture Audit Prompt

This prompt is the long-form companion to the [`extension-architecture`](contextqb://audits/extension-architecture) audit template, with the same sections plus a modularity section. It is intended to be pasted into an agent verbatim. Fill in `{{REPO_PATH}}`; the agent takes the extension's feature list from your `AGENTS.md` or project summary, so the report covers the features your extension actually has. Platform specifics such as storage limits and background lifecycle change between browser versions; the dated [browser extension platform reference](contextqb://references/setup#browser-extension-platform) records the current facts ContextQB has checked.

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

8. Platform constraints. Which manifest version the extension uses, which permissions it requests and why, and how its background code starts, stops and keeps state. Flag anything that relies on background state surviving, or on a permission the features don't need.

9. Settings system. Is settings a coherent system or a stack of patches? List every setting with where it is read, where it is written, and its default. Flag any setting that exists to compensate for a structural issue elsewhere.

10. Feature interactions. Take the list of in-page features from the project's AGENTS.md or summary; if there is none, list the features you find and ask me to confirm the list before writing this section. Give each feature its own short subsection: where its state lives (optimistic and confirmed, if it changes data on a server), which file orchestrates it, and how it handles errors, retries and conflicts. Do not add subsections for features the extension does not have.

11. Future views and metrics. Where would future analytics, scoped views, or per-feature metrics plug in? Are extension points ready, or would they require a refactor first?

12. Anti-spaghetti scan. For each of the eight signals — unclear data flow, repeated logic, mixed concerns, unpredictable side effects, state updated from too many places, hidden dependencies, fragile lifecycle assumptions, features bolted on rather than integrated — mark present / partly present / absent, with evidence.

13. Recommendations. Ordered by impact and risk.

14. Now / next / later plan. 3–5 concrete actions in each.

If you are permitted to run the extension, load it in a test browser profile with no personal data and reproduce the multi-tab and lifecycle cases; record what you did and saw. Otherwise label those findings "read in code".

Tone: direct, plain language, no enterprise jargon. Quote code. Reference file paths. Do not write code. Do not end with a summary — end with the plan.
```

## Example: section 10 for one fictional extension

This shows how the feature list shapes section 10. It is illustrative only — a fictional social-media reading extension, not a list of features your extension should have. Its `AGENTS.md` lists four in-page features, so the report gets four subsections:

- **List manager.** The data model for the user's lists, who owns list state (the background script or a shared store), and which operations exist (create, rename, reorder, delete).
- **Quotes and highlights.** How a highlight is captured from the page, where it is stored, who owns it, and how it is displayed again on revisit.
- **Likes and follows.** Where the optimistic state lives while a request is in flight, where the confirmed state lives, and how a conflict with the server's answer is resolved.
- **In-extension replies.** Composition state, who orchestrates sending, and how errors and retries are handled.

An extension with different features gets different subsections; one with a single feature gets one.

**Before you run it.** Use a session that did not build the extension — a fresh session, a second agent, or a person — with the project instructions, the project map, and the code. A different model can add variety; it does not by itself make the audit independent.
