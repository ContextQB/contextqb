---
id: repo-cleanup
title: Clean Up an Existing Repo
summary: A staged process for taking a sprawling AI-generated repo and turning it into something a human and an agent can both work with sanely.
version: 0.3.1
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
journey_stage: 6
journey_rank: 10
related:
  - anti-spaghetti-review
  - new-project-foundation
  - repo-readiness
  - retrofit-drift-detection
  - state-management
related_principles:
  - anti-spaghetti
  - modularity
  - naming-conventions
tags:
  - debt
  - cleanup

---

# Clean Up an Existing Repo

> **Tier 2 — for an existing repo that has sprawled.** If your repo is young, use the [repo readiness audit](contextqb://audits/repo-readiness) and the [new-repo playbook](contextqb://playbooks/new-project-foundation) instead; they set the structure this playbook tries to recover.

This is a survival playbook. Do not "rewrite from scratch" — that path almost always fails. Instead, work in passes.

**Who does what.** The agent diagnoses, proposes batches and makes the changes. You approve the diagnosis, choose which batches run and in what order, and read each batch's summary. A diagnosis is a proposal: it does not authorize any change until you pick the batch.

**If the repo already has a `context.qb.yaml`,** start by reconciling it with [`retrofit-drift-detection`](contextqb://playbooks/retrofit-drift-detection), so the map is accurate before files start moving. Otherwise, add drift detection after the cleanup (see the end of this playbook).

## Pass 1 — Diagnosis (read-only)

Ask an agent to produce a diagnosis without any code changes. The agent needs the eight anti-spaghetti signals in front of it; do not assume it knows them. Supply them in one of two ways:

- **Easiest:** use the [Anti-Spaghetti Review Prompt](contextqb://prompts/anti-spaghetti-review) as the diagnosis request. It already lists all eight signals. Set its scope to `.` (the whole repository) and its output path to the diagnosis file named below, then add the last sentence of the request below so the result ends with the five cleanups.
- **Or:** copy the eight numbered signals from "The detection checklist" in the [anti-spaghetti principle](contextqb://principles/anti-spaghetti) and paste them under this request:

> Audit this whole repository against the eight anti-spaghetti signals I have pasted below. Use only those signals; do not substitute a checklist of your own. For each signal, evaluate whether it is present, partly present, or absent. Quote specific files and line numbers. Do not change any code. Then produce a prioritised list of the five highest-impact, lowest-risk cleanups.

Save the result as `docs/cleanup/YYYY-MM-DD-diagnosis.md` — dated, like the other process documents in a ContextQB documentation system. If the cleanup will take several sessions, track it as a workstream with the diagnosis as its first record.

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

Use a dead-code detector for your language (a tool that lists unreferenced exports and files) or a careful agent prompt to identify unreferenced exports, unused files, and old feature flags. Delete what is dead, after the tests pass without it.

## How to use an agent

Passes 2, 3, 5 and 6 are agent work, done in small batches. For each batch:

Naming a pass does not tell the agent what the pass does: the agent cannot see this playbook or your plan unless you give them to it. Before you paste:

- Replace `[N]` with the pass number and name, for example "pass 3 (dumping grounds)", and `[path]` with one folder from the batch you chose, for example `src/billing/`.
- Under the request, attach or paste the cleanup plan you approved (the diagnosis file and the batches you chose) **and** the instructions for the selected pass, copied from its section in this playbook — for pass 3, the three steps under "Pass 3 — Dumping grounds". If your agent is connected to the ContextQB MCP server, you can instead tell it to retrieve the `repo-cleanup` playbook and use that pass's section; the approved plan is yours and must still be attached.

> Apply pass \[N] of the cleanup plan to this directory only: **\[path]**, on a branch. Use only the cleanup plan I have attached below and the pass instructions I attached (or told you to retrieve from the ContextQB MCP `repo-cleanup` playbook); if either is missing, stop and ask me for it instead of guessing what the pass involves. Make the smallest set of changes that completes the pass. Run the project's tests and verifiers before and after, and report each command with its exit status; if they were not green before you started, stop and tell me. After your changes, summarise what moved, what was renamed, and what you intentionally left for a later pass.

Do not skip the summary. The summary is how you keep the agent honest. Merge the branch only when the tests are green and the summary matches the diff; for anything larger than a rename, ask a fresh session to review the batch first.

## After cleanup

Once the cleanup passes are done, retrofit drift detection on the repo so it cannot quietly slide back into an unmapped shape. Use [`retrofit-drift-detection`](contextqb://playbooks/retrofit-drift-detection) to reconcile `context.qb.yaml`, then wire the check into commits and CI.
