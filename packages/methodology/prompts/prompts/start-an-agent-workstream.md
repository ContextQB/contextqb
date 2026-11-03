---
id: start-an-agent-workstream
title: Start an Agent Workstream
summary: A reusable instruction for turning an operator’s objective into a documented workstream and a proposed bounded assignment.
version: 0.4.0
audience:
  - founder
  - operator
  - agent
journey_stage: 1
journey_rank: 70
use_case: |
  Use when an objective needs more than one pass, a decision, review, or session and does not yet have a reliable workstream record.
variables:
  - OBJECTIVE
  - PROJECT_INSTRUCTIONS
  - EXISTING_RECORDS
expected_output: |
  A workstream record, registered in the project's boot map, with the objective, accountable operator, record keeper, deliverables, acceptance evidence, boundaries, relationships, dependencies, and proposed next scope. No implementation begins.
quality_standard: |
  The record uses plain language, names owners and verification conditions, includes at least one check the operator can perform, distinguishes proposed work from approved work, and gives the operator enough information to approve or revise the next assignment.
related:
  - work-with-agents-through-documentation
  - run-an-agent-workstream
  - set-up-a-documentation-system
  - the-plan-is-the-contract
  - update-an-agent-workstream
tags:
  - agents
  - documentation
  - planning

---

# Start an Agent Workstream

**Use when:** an objective needs several passes, a decision, a review, or a later session, and has no reliable record yet. For a one-pass task, skip this and use a checklist.

**You get:** one workstream record and a proposed first scope for you to approve or revise. Nothing is built yet.

**New to workstreams?** This prompt is the first step of [Run an Agent Workstream](contextqb://playbooks/run-an-agent-workstream), which defines the record and the roles named below. A complete fictional example, a file-organizer trial, is at the end of that page. The words you need here:

- A **workstream record** is one file that tracks the objective, what is approved, what happened and what comes next. The agent creates it; you read it.
- A **scope** is the agreement for one bounded piece of work: what it will produce, what may change and how you will check it. The agent proposes one; only your reply approves it.
- You are the **accountable operator**: the person who approves scopes and accepts results. The **record keeper** is the one writer of the record's current summary. Usually that is your main agent session, so you can leave it out of a first record.
- The **boot map** is the set of files every new session reads first: usually `AGENTS.md` and your project map, `context.qb.yaml`.

**Fill in:**

- `{{OBJECTIVE}}`: what you want, in your own words. For example: "Add search to my research notebook so I can find a source by a word in its note."
- `{{PROJECT_INSTRUCTIONS}}`: the boot-map files, such as `AGENTS.md` and `context.qb.yaml`, or your project's equivalent. If your tool already loads them at the start of a session ([which tools load which files](contextqb://references/setup#agents-md-support)), write "already loaded"; the agent should still read anything they point to.
- `{{EXISTING_RECORDS}}`: any related scope, plan, or workstream record, such as `docs/scopes/notebook-search.md`, or "none". If you are not sure whether one exists, write "none that I know of"; the prompt tells the agent to look for one before creating a new record.

```text
Objective: {{OBJECTIVE}}
Project instructions and boot map: {{PROJECT_INSTRUCTIONS}}
Existing related records: {{EXISTING_RECORDS}}

Read the project instructions, boot map, and existing records before acting. If the instructions are marked "already loaded", confirm which files you have and read anything they point to that you have not read.

Restate the objective in my words. If it is unclear, ask me up to three questions first. If I don't answer them, write your assumptions into the proposal below, clearly labelled as assumptions for me to confirm or correct. Assumptions let you finish the proposal; they never permit implementation.

Reuse an existing record or owning scope that already covers this objective. Otherwise create one record in the project's usual place for work records; docs/workstreams/<objective-slug>.md is one convention. Add one line to the boot map or the records index so a fresh session can find it.

The record must state (items marked "if applicable" can be omitted for a small first record):
1. the objective and why it matters now;
2. the accountable operator (me) and, if applicable, the record keeper, when it is not simply this session;
3. each deliverable, its owner, acceptance evidence, and current status;
4. boundaries and exclusions;
5. if applicable, related work and dependencies, with the required condition, owner, and verifier for each actionable dependency;
6. a proposed next scope: output, what may change, risks, executor, reviewer, where the review will be written, and acceptance checks, including at least one I can perform myself. Prefer a reversible first step (copies, a draft, a test account).

Do not implement the proposed scope. Present it for my approval. Record approval only from my own reply, quoted or faithfully paraphrased with its date and where it was given. Your recommendation, my silence, or passing checks are not approval. If my reply is ambiguous, ask.
```
