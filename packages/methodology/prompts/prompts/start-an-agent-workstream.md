---
id: start-an-agent-workstream
title: Start an Agent Workstream
summary: A reusable instruction for turning an operator’s objective into a documented workstream and a proposed bounded assignment.
version: 0.2.1
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
tags:
  - agents
  - documentation
  - planning
review:
  status: final
  last_reviewed: "2026-10-02"
  reviewer: "Opus 5.5, independent review of 0.1.0 (2026-10-02); Codex (CoS), independent check and final independent QA of 0.2.0 (2026-10-02)"
  reviewer_notes: "2026-10-02: Opus 5.5 revised this atom as developer in 0.2.0 (FIX-01). Codex's final independent QA of the vertical returned verified with follow-up (2026-10-02). Travis (operator) accepted the vertical for publication on 2026-10-02. 0.2.1 removes the body draft note for publication; lesson, contract, and example content unchanged."
---

# Start an Agent Workstream

**Use when:** an objective needs several passes, a decision, a review, or a later session, and has no reliable record yet. For a one-pass task, skip this and use a checklist.

**You get:** one workstream record and a proposed first scope for you to approve or revise. Nothing is built yet.

**Fill in:**

- `{{OBJECTIVE}}`: what you want, in your own words.
- `{{PROJECT_INSTRUCTIONS}}`: the files every session reads first, such as `AGENTS.md` and `context.qb.yaml`, or your project's equivalent.
- `{{EXISTING_RECORDS}}`: any related scope, plan, or workstream record, or "none".

```text
Objective: {{OBJECTIVE}}
Project instructions and boot map: {{PROJECT_INSTRUCTIONS}}
Existing related records: {{EXISTING_RECORDS}}

Read the project instructions, boot map, and existing records before acting.

Restate the objective in my words. If it is unclear, ask me up to three questions first.

Reuse an existing record or owning scope that already covers this objective. Otherwise create one record in the project's usual place for work records; docs/workstreams/<objective-slug>.md is one convention. Add one line to the boot map or the records index so a fresh session can find it.

The record must state:
1. the objective and why it matters now;
2. the accountable operator (me) and the record keeper;
3. each deliverable, its owner, acceptance evidence, and current status;
4. boundaries and exclusions;
5. related work and dependencies, with the required condition, owner, and verifier for each actionable dependency;
6. a proposed next scope: output, what may change, risks, executor, reviewer, where the review will be written, and acceptance checks, including at least one I can perform myself. Prefer a reversible first step (copies, a draft, a test account).

Do not implement the proposed scope. Present it for my approval. Record approval only from my own reply, quoted or faithfully paraphrased with its date and where it was given. Your recommendation, my silence, or passing checks are not approval. If my reply is ambiguous, ask.
```
