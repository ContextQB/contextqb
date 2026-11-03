---
id: update-an-agent-workstream
title: Update an Agent Workstream After a Pass
summary: A reusable instruction for recording what an agent delivered, what was checked, what was discovered, and what should happen next.
version: 0.4.1
audience:
  - founder
  - operator
  - agent
journey_stage: 1
journey_rank: 80
use_case: |
  Use after an agent has completed a meaningful assignment, encountered a discovery, received review findings, or reached a decision.
variables:
  - WORKSTREAM_RECORD
  - APPROVED_SCOPE
  - DELIVERED_OUTPUT
  - EVIDENCE
  - REVIEW_RECORD
  - OPERATOR_DECISIONS
expected_output: |
  An updated current state and dated pass entry separating authorization, delivery, review, disposition, and next authorized action, plus classified outstanding items.
quality_standard: |
  The update names the exact scope and output, separates completion claims from evidence, preserves unverified criteria, traces every approval to the operator, classifies discoveries, and assigns a next action without silently expanding authority.
related:
  - append-dont-overwrite
  - resume-an-agent-workstream
  - review-an-agent-workstream
  - run-an-agent-workstream
  - start-an-agent-workstream
  - work-with-agents-through-documentation
tags:
  - agents
  - documentation
  - governance

---

# Update an Agent Workstream After a Pass

**Use when:** a meaningful pass finished, a discovery appeared, a review came back, or you made a decision.

**You get:** a dated pass entry, a refreshed current state, and classified outstanding items. Claims and evidence are kept apart.

**New to workstreams?** This prompt is one step of [Run an Agent Workstream](contextqb://playbooks/run-an-agent-workstream), which defines the record, the roles and the terms used below. Its worked example, a fictional file-organizer trial at the end of that page, shows finished pass entries. A **pass** is one round of work under an approved scope (the agreement for one bounded piece of work). The **record keeper** is the one writer of the record's current summary, usually your main agent session.

**Fill in:**

- `{{WORKSTREAM_RECORD}}`: the record's path, for example `docs/workstreams/notebook-search.md`. No record yet? Run [Start an Agent Workstream](contextqb://prompts/start-an-agent-workstream) first.
- `{{APPROVED_SCOPE}}`: the scope this pass worked under and its revision, which says which version of the agreement applies. For example "S1 revision 2", or "the Current authority section of the record" if the scope lives there.
- `{{DELIVERED_OUTPUT}}`: what was produced and where.
- `{{EVIDENCE}}`: the checks run and their results — the exact commands (type check, lint, tests, build) with their exit status, the result of the optional project-map check (`contextqb check`) if your project uses it, and outputs you can open yourself (a file, a page, a report). Anything not run is labelled UNVERIFIED.
- `{{REVIEW_RECORD}}`: the review entry or file written by a reviewer that did not do the work ([Review an Agent Workstream Result](contextqb://prompts/review-an-agent-workstream) produces one), or "awaiting review".
- `{{OPERATOR_DECISIONS}}`: your own replies or directions since the last update, with dates, or "none". Approvals already in the record carry forward.

**Reading the result.** Each pass entry ends with a **disposition**, the decision about the delivered work: accepted; corrected (fixed inside the existing agreement, so no new approval is needed); rolled forward (unfinished work carried into the next pass); proposed (an idea outside the agreement, waiting for you); deferred; rejected; or blocked (waiting on a missing input, access, condition or decision). Acceptance and proposed items need your decision. A blocked item should name what is missing, who supplies it and the condition for resuming. It needs you only when that missing piece is yours to give, such as your access, input or decision. Corrections, roll-forwards and blocked work that stays inside the approved scope proceed under the approval you already gave once the named condition is met.

The agent that did the work may fill `{{DELIVERED_OUTPUT}}`, `{{EVIDENCE}}` and its own self-checks from its session. `{{OPERATOR_DECISIONS}}` must come from you: the agent cannot supply your approvals, decisions, or acceptance.

```text
Workstream record: {{WORKSTREAM_RECORD}}
Approved scope: {{APPROVED_SCOPE}}
Delivered output and location: {{DELIVERED_OUTPUT}}
Evidence from checks: {{EVIDENCE}}
Review record: {{REVIEW_RECORD}}
Operator decisions since last update: {{OPERATOR_DECISIONS}}

Read the current record and approved scope before updating. If you did the work, you may fill the delivered output, evidence, and your own self-checks from this session; record them as yours. Only the operator supplies operator decisions, approvals, and acceptance. Only the record keeper edits the shared summary. If you are not the keeper, return this update as a report for the keeper.

Add a dated pass entry, in order:
1. Authorized: scope and revision, the operator's approval (words, date, where given), executor, reviewer, and assignment.
2. Delivered: actual outputs or revision and where they are, completion claim, checks run (command and exit status), outputs the operator can open, gaps, and discoveries. Label any check that was not run UNVERIFIED.
3. Reviewed: the kind of check (self-check, independent review, or operator inspection), reviewer, output checked, criteria, evidence, findings, limits, and the review's location. Write "awaiting review" if none has happened.
4. Disposition: accepted, corrected, rolled forward, proposed, deferred, rejected, or blocked; name the decision owner.
5. Current state: verified progress, uncertainty, dependency effects, and next authorized action.

Give each outstanding item an ID, origin or evidence, type, owner, status or decision, and destination. A correction inside the approved scope proceeds under the existing approval. A proposed addition waits for the operator.

Carry forward existing approval exactly as the record or approved scope already records it, with its original source; corrections inside that scope need no new approval. Any new approval or decision must trace to the operator decisions listed above. If none are listed, record no new approval. Never write an approval that neither the record nor the operator supplied. Your recommendation, silence, or passing checks are not approval. Do not turn a completion claim into independent verification. If a discovery requires changing the approved scope, stop the affected work and report the contradiction for revision and re-approval.
```
