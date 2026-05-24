---
id: repo-cleanup
title: Clean Up an Existing Repo
summary: A staged process for taking a sprawling AI-generated repo and turning it into something a human and an agent can both work with sanely.
version: 0.1.0
problem: |
  AI-assisted projects drift toward sprawl: huge files, unclear boundaries, dumping grounds, and inconsistent naming. At some point the cost of any new feature exceeds the cost of cleaning up first.
when_to_use: |
  When you can no longer add a small feature without breaking something unrelated.
expected_outputs:
  - A diagnosis document.
  - A prioritised cleanup list.
  - Renamed files and modules with clear responsibilities.
  - Removed dead code.
audience:
  - novice-builder
  - founder
  - developer
  - agent
related_principles:
  - anti-spaghetti
  - modularity
  - naming-conventions
tags:
  - debt
  - cleanup
---

# Clean Up an Existing Repo

This is a survival playbook. Do not "rewrite from scratch" — that path almost always fails. Instead, work in passes.

## Pass 1 — Diagnosis (read-only)

Ask an agent to produce a diagnosis without any code changes:

> Audit this repository against the ContextQB anti-spaghetti checklist. For each of the eight signals, evaluate whether it is present, partly present, or absent. Quote specific files and line numbers. Then produce a prioritised list of the five highest-impact, lowest-risk cleanups.

Save the result as `docs/cleanup/diagnosis-<date>.md`.

## Pass 2 — Naming

The cheapest cleanup is renaming. Walk through the diagnosis and rename:

- Files whose names do not describe their responsibility.
- Functions whose names do not describe their action.
- Folders named after technical categories rather than domain concerns.

Use [`naming-conventions`](contextqb://principles/naming-conventions) as the rubric.

This pass is mechanically safe — renames are easy to verify — but pays large dividends in clarity.

## Pass 3 — Dumping grounds

Find every `utils.ts`, `helpers.ts`, `common.ts`, `manager.ts`. For each:

- Group the contents by concern.
- Move each group to a properly-named module.
- Delete the dumping ground.

If something has no clear home, that itself is a finding: name what is missing.

## Pass 4 — State

Use the [`state-management`](contextqb://audits/state-management) audit to map every piece of state. Identify duplicates and missing owners. Move state to its rightful owner one piece at a time.

## Pass 5 — Modules over 300 lines

For each oversized module, apply [`modularity`](contextqb://principles/modularity). Identify the distinct responsibilities and split them into smaller modules with clear names.

## Pass 6 — Dead code

Use static analysis or a careful agent prompt to identify unreferenced exports, unused files, and old feature flags. Delete what is dead.

## How to use an agent

For each pass, work in small batches:

> Apply pass \[N] of the cleanup plan to this directory only: **\[path]**. Make the smallest set of changes that completes the pass. After your changes, summarise what moved, what was renamed, and what you intentionally left for a later pass.

Do not skip the summary. The summary is how you keep the agent honest.
