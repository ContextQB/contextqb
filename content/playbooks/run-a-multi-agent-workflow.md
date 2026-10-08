---
id: run-a-multi-agent-workflow
title: Run a Multi-Agent Workflow (Fleets, Subagents, and Background Sessions)
summary: Agentic tools now make it easy to run a fleet — background agents, subagents, cloud sessions, scheduled routines. This playbook is the discipline for running several agents at once without lanes colliding, context drifting, or "the fleet shipped something nobody reviewed."
version: 0.2.0
problem: |
  One-agent-one-session was the 2024 mental model; the current tools (background agents, subagents, cloud sessions, scheduled routines) make it trivially easy to run five agents at once — and just as easy to produce five unverified, mutually contradictory changes. Fleet capability without fleet discipline produces parallel spaghetti.
when_to_use: |
  When you have working software and want throughput: independent features in parallel, a refactor plus a docs pass plus a test backfill, or long-running background work (audits, migrations, dependency updates) while you keep building. Not for your first feature, and not for tightly coupled work.
expected_outputs:
  - "A lane decomposition: one agent per concern, each with a written brief."
  - A named integration owner and merge order for the lanes.
  - Per-lane verification in a session that did not do the work.
  - A merged result in which every lane's output was reviewed before integration.
audience:
  - operator
  - developer
  - founder
  - agent
journey_stage: 4
journey_rank: 50
related:
  - agent-instructions
  - architectural-hardening-loop
  - feature-build-loop
  - run-an-agent-workstream
  - work-with-agents-through-documentation
  - set-up-agents-md
  - the-plan-is-the-contract
  - write-a-context-qb
  - refactor-planning
related_principles:
  - failure-modes
  - least-privilege-for-agents
  - orchestration
  - state-ownership
tags:
  - agents
  - planning
  - governance
review:
  status: draft
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review G-13 (authored 2026-09-09)"
  reviewer_notes: "2026-10-07 renewal B6 (0.2.0; author self-checked; independent review pending; not operator-accepted; review.status stays draft — promotion to final is Travis's decision after Codex's review, per DEC-08): names the Tier-1 starter pattern (one build lane plus one review lane); parallel writers each get their own working directory, such as a separate worktree or clone, because branches in one checkout share the same files on disk; one integrator owns review and merge; the vendor 'where it lives' column moved to the dated agentic-tools reference, keeping primitives and watch-fors; the $4/hour line is now labelled invented budget arithmetic, not a price (B1 dropped the budget-heuristics entry, so nothing is linked; this closes the SYNTH-11 follow-up for this atom); undated 'the 2026 agentic default' and 'as of late 2026'; review provenance neutralised. Earlier notes: Authored from gap G-13 — the corpus's mental model predated the fleet default (background agents, subagents, cloud sessions, routines). Awaiting a fresh-eyes pass. 2026-10-02: body cross-references to the agent workstream method were added (those diffs were inspected in an independent final QA of the workstream vertical) and then finalized for publication (a wording edit that postdates that QA). The whole atom was not re-reviewed; last_reviewed reflects the earlier review."
---

# Run a Multi-Agent Workflow (Fleets, Subagents, and Background Sessions)

**Plain language:** You can now run five agents at once — one in your editor, two in the cloud, one on a schedule, one reviewing. That is a fleet. Fleets multiply whatever discipline you have. If your discipline is good, they multiply output. If it isn't, they multiply mess.

## When to use this

The fleet earns its cost when the work **decomposes into independent lanes**:

- Two features that touch different packages.
- A refactor in one lane while docs or tests move in another.
- A long, boring, verifiable job (dependency bump, codemod, audit sweep) running in the background while you do the interesting work.
- A review lane checking what the build lane produced.

Do **not** reach for a fleet when:

- The task is one file or one concern (a fleet of one is overhead).
- The lanes share mutable state or the same files (they will collide — silently).
- You cannot verify each lane's output. An unreviewed lane is a liability, not a speedup.

## Start with two lanes

If you have never run more than one agent at once, start with the smallest fleet that is still a fleet: **one build lane and one review lane.** The build lane implements a brief; the review lane, in a context that did not build it, checks the result against the brief before you merge. Add a second build lane only when you have work that truly splits into independent concerns.

## The fleet primitives

Know which kind of primitive you are using — they have different failure modes. Which tools offer which primitive, and under what names, changes often; the dated [agentic coding tools reference](contextqb://references/tools#agentic-ides) describes the parallel-work features each tool documents.

| Primitive              | What it is                                                                | Watch for                                                               |
| ---------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Foreground session** | The agent you are talking to right now                                    | The one you supervise most closely — spend the attention here           |
| **Subagents**          | Spawned inside a session with a scoped brief and their own context window | Scope bleed — a subagent that inherits too much context wanders         |
| **Background agents**  | Run without you watching, produce a PR or a report                        | Unreviewed merges; cost accruing out of sight                           |
| **Scheduled routines** | Recurring or event-triggered agent runs                                   | A routine nobody reads the output of is a cron job with opinions        |
| **Command centers**    | One surface that manages many agents (a board of agent tasks)             | Treating the board as proof of progress — lanes still need verification |

## Step 1 — Decompose into lanes

If you track the objective with the [agent workstream](contextqb://playbooks/run-an-agent-workstream) method, its **workstream record** is the shared record for the whole flow of work. A lane brief is a bounded assignment inside that workstream, not a replacement for it. The record keeps the shared objective, deliverables, decisions, evidence, and next action; this playbook defines how several agents can execute independent lanes against that shared record.

Before starting anything, write the lane map. One lane per concern, each with:

- **A written brief** — the same seven-section discipline as a feature plan, scaled down. The brief is the lane's contract (see [`the-plan-is-the-contract`](contextqb://principles/the-plan-is-the-contract)).
- **Named file/package ownership** — the surfaces this lane may touch, and by implication the ones it may not.
- **Its own working directory**, if the lane writes files. Branches alone do not isolate parallel writers: two agents on different branches in the _same_ checkout still share the files on disk, and each will see — or overwrite — the other's uncommitted changes. Give each writing lane a separate working directory, such as a separate git worktree or clone (or a cloud agent's own environment), and let the integrator merge the branches. Read-only lanes, such as a review lane, can share.
- **A done condition** that is checkable by someone who did not write the code.

If two lanes need to edit the same file, they are one lane. Split by concern, not by convenience.

## Step 2 — Boot every lane on the same map

Every agent in the fleet must start from the same ground truth: the same `AGENTS.md`, the same `context.qb.yaml`, the same ADRs. This is what the boot manifest is _for_ — a fleet without a shared map is five agents with five different mental models of the same repo (see [`write-a-context-qb`](contextqb://playbooks/write-a-context-qb) and [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md)).

If a lane needs extra context, put it in the lane's brief — not in a shared instruction that other lanes will misread.

## Step 3 — Name the integrator and the merge order

Before the fleet runs, answer:

- Who integrates the lanes' output — you, or a designated integrator lane? There is exactly one integrator, and it owns review and merge for every lane.
- In what order do lanes merge? (Foundations before dependents; isolated before shared.)
- What is the conflict rule when two lanes disagree? (Stop and ask beats pick-a-winner.)

The integrator is the fleet's orchestrator — [`orchestration`](contextqb://principles/orchestration) at the workflow level. Name it, or every lane quietly becomes its own integrator.

## Step 4 — Verify each lane in a fresh session

The loop from [`feature-build-loop`](contextqb://playbooks/feature-build-loop) generalises directly: **the session that did the work never verifies the work.** Each lane's output gets a verification pass — walk the lane's brief against the actual diff — before integration.

For background agents this is non-negotiable: a background lane you never review is not delegation, it's abdication. The [`least-privilege-for-agents`](contextqb://principles/least-privilege-for-agents) posture applies at fleet scale: background lanes get read-mostly scopes and produce PRs, not direct merges.

## Step 5 — Integrate sequentially, then verify the whole

Merge lanes one at a time, running the build and tests after each. Then do one final pass across the integrated result — the lanes were verified individually, but the seams between them were not. Most fleet bugs live in the seams: duplicated helpers, two lanes that each "owned" the same utility, a shared type that drifted.

## The agent-brief prompt (per lane)

> You are lane **\[name]** of a multi-lane workflow. Your brief: **\[seven-section brief or link]**. You may touch only: **\[named surfaces]**. Do not edit **\[shared/other-lane surfaces]**. When done, produce a completion report in the standard format (sections advanced, surfaces touched, edge cases handled, concerns remaining). If the brief contradicts what you find in the code, stop and report the contradiction — do not improvise.

## Anti-patterns

- **The fleet of one.** Spinning up background agents for a task you'd finish faster yourself. Fleets have coordination cost; spend it only when parallelism is real.
- **Shared-mutable-file lanes.** Two agents editing `schema.ts` in parallel is not parallelism; it's a merge conflict generator with a confidence problem.
- **The unread background agent.** A cloud agent whose PRs you rubber-stamp. If you won't review the lane, don't run the lane.
- **The board-as-proof fallacy.** A kanban full of "done" agent tasks is not verified work. Verification walks the brief against the code, per lane, every time.
- **Cost blindness.** Parallel lanes multiply spend. As invented arithmetic, not a price: if one lane cost $4 an hour, five lanes would cost $20 an hour. Check your own usage and current prices, set the budget before the fleet runs, and put the numbers in the review.

## What "good enough" looks like

- [ ] Every lane has a written brief, named surfaces, and a checkable done condition.
- [ ] No two lanes share a mutable file, and every writing lane has its own working directory.
- [ ] Every lane booted from the same `AGENTS.md` + `context.qb.yaml`.
- [ ] The integrator and merge order were named before the fleet ran.
- [ ] Every lane was verified by a session that didn't write it — including background lanes.
- [ ] The integrated result got its own final verification pass.
- [ ] The fleet's cost (time + tokens) is written down somewhere you'd notice it growing.

## See also

- [Principle: The Plan Is the Contract](contextqb://principles/the-plan-is-the-contract) — the per-lane brief, enforced
- [Principle: Orchestration](contextqb://principles/orchestration) — the integrator is the fleet's orchestrator
- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents) — scoping background and scheduled lanes
- [Playbook: Run a Feature Build Loop](contextqb://playbooks/feature-build-loop) — the single-lane version of this discipline
- [Playbook: Run an Architectural Hardening Loop](contextqb://playbooks/architectural-hardening-loop) — the multi-lane version for a drifted codebase
- [Playbook: Create Agent Instructions That Produce Documents](contextqb://playbooks/agent-instructions) — writing lane briefs that hold up
