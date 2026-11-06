---
id: resume-an-agent-workstream
title: Resume an Agent Workstream From a Handoff
summary: A reusable instruction for beginning a fresh session from the current workstream record, approved scope, review, and reconciled handoff.
version: 0.4.1
audience:
  - founder
  - operator
  - agent
journey_stage: 1
journey_rank: 100
use_case: |
  Use when a workstream is being continued in a new session or by a different agent.
variables:
  - WORKSTREAM_RECORD
  - APPROVED_SCOPE
  - LATEST_REVIEW
  - HANDOFF
expected_output: |
  A short reconciliation stating the current objective, authority, verified and unfinished work, newer decisions, actual state, and next authorized action, reported before any new work begins.
quality_standard: |
  The session reads durable authority before acting, checks the actual files or outputs, recognizes when a handoff is stale, preserves existing work, respects the record keeper, and does not replay completed or unapproved work.
related:
  - audit-a-workstream-record
  - work-with-agents-through-documentation
  - run-an-agent-workstream
  - update-an-agent-workstream
  - understanding-the-context-window
tags:
  - agents
  - handoff
  - continuity

---

# Resume an Agent Workstream From a Handoff

**Use when:** continuing a workstream in a new session or with a different agent.

**You get:** a short reconciliation report before any new work begins. It covers what is authorized, what is verified, what is stale, and the next authorized action.

Tools differ in what they remember between sessions and what survives compaction ([what agents keep](contextqb://references/setup#agent-memory)). **Compaction** is what many tools do when a long conversation fills the agent's working memory: they replace older messages with a summary, which can drop or blur details. This prompt treats that memory as a hint: the record and the actual files are the authority.

**New to workstreams?** This prompt is one step of [Run an Agent Workstream](contextqb://playbooks/run-an-agent-workstream), which defines the record and roles. Its worked example, a fictional file-organizer trial at the end of that page, includes a resumption that catches a stale handoff. The words you need here:

- A **checkpoint** is the reconciled "where things stand" section a session writes before stopping.
- A **handoff** tells the next session what to read, check and do. It can be that checkpoint section or a separate dated file. It is a snapshot, so newer record entries outrank it.
- The **record keeper** is the one writer of the record's current summary. A session that is not the keeper reports discrepancies instead of editing the summary.
- The **boot map** is the set of files every new session reads first: usually `AGENTS.md` and your project map, `context.qb.yaml`.

For a long workstream, you can run the [Workstream Record Audit](contextqb://audits/audit-a-workstream-record) first and read only its verdict and blockers before resuming.

**Fill in:**

- `{{WORKSTREAM_RECORD}}`: the record's path, for example the illustrative `docs/workstreams/photo-organisation.md`, or "find it from the boot map". The record holds the current objective and decisions.
- `{{APPROVED_SCOPE}}`: the active scope (the agreement for the current piece of work) and its revision, or the record section where it lives.
- `{{LATEST_REVIEW}}`: the latest review entry or file, or "none".
- `{{HANDOFF}}`: the handoff file, for example the illustrative `docs/handoffs/2026-03-03-photo-organisation.md`, or "none — use the record's checkpoint section". The handoff describes where the previous session stopped; supply files that actually exist for your task.

```text
Read the project instructions and boot map first, then:
- current workstream record: {{WORKSTREAM_RECORD}}
- approved scope: {{APPROVED_SCOPE}}
- latest review: {{LATEST_REVIEW}}
- handoff: {{HANDOFF}}

If there is no separate handoff, use the record's checkpoint section. If the record path is not given, find it through the boot map's status entry or the records index.

Reconcile those records with the actual state. Check, and report what you find:
- in a code project: the current branch, the latest commit (HEAD), and any uncommitted or untracked changes;
- the files, outputs, and saved revisions the records mention;
- running jobs or processes, and any background, scheduled, or cloud agent runs: still running, finished, or failed;
- the project-map check (for example `contextqb check`), if the project uses one.

A handoff is a snapshot: entries in the record that are newer than the handoff, and newer operator decisions, supersede it. Your tool's memory and any earlier summary of this work, including a compaction summary, are not authority: where they disagree with the record or the actual files, the record and the files win. Where the record and the actual files disagree with each other, do not silently trust either, least of all a stale record; report the disagreement.

Report, before doing anything else:
1. the objective;
2. the work currently authorized, with the operator approval it rests on;
3. what is verified, incomplete, or unverified;
4. decisions still waiting for the operator;
5. any stale instructions or disagreement between the records and actual state;
6. the next authorized action.

Continue only if that next action is already authorized; otherwise wait for the operator. Preserve existing work. Do not replay a completed assignment, treat a proposal as approval, restart a process without checking its state, or overwrite an unrelated change. If you are the record keeper, update the record where it disagrees with actual state. If you are not, report the discrepancies to the keeper instead of editing the summary.
```
