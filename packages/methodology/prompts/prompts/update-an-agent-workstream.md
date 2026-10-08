---
id: update-an-agent-workstream
title: Update an Agent Workstream After a Pass
summary: A reusable instruction for recording what an agent delivered, what was checked, what was discovered, and what should happen next.
version: 0.3.0
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
  - work-with-agents-through-documentation
tags:
  - agents
  - documentation
  - governance
review:
  status: final
  last_reviewed: "2026-10-02"
  reviewer: "Independent agent review of 0.1.1 (2026-10-02); independent checks of 0.2.0 and the 0.2.1 changes, and final independent QA of 0.2.1 (2026-10-02)"
  reviewer_notes: "2026-10-07 renewal B4 (0.3.0; author self-checked; independent review pending; not operator-accepted; targeted additions to the operator-accepted 2026-10-02 vertical): the evidence variable asks for verifier commands and exit status, the drift-check result if used, and outputs the operator can open, with anything not run labelled UNVERIFIED; the executing agent may fill delivered output, evidence and its own self-checks from its session, while operator decisions and acceptance come only from the operator. Review provenance neutralised (agent and model detail kept in private records); the 2026-10-02 acceptance and its history are unchanged. 2026-10-02: An agent developer revised this atom in 0.2.0 (FIX-01) and 0.2.1 (C1). The final independent QA of the vertical returned verified with follow-up (2026-10-02). Travis (operator) accepted the vertical for publication on 2026-10-02. 0.2.2 removes the body draft note for publication; lesson, contract, and example content unchanged."
---

# Update an Agent Workstream After a Pass

**Use when:** a meaningful pass finished, a discovery appeared, a review came back, or you made a decision.

**You get:** a dated pass entry, a refreshed current state, and classified outstanding items. Claims and evidence are kept apart.

**Fill in:**

- `{{WORKSTREAM_RECORD}}`: the record's path.
- `{{APPROVED_SCOPE}}`: the scope and revision this pass worked under.
- `{{DELIVERED_OUTPUT}}`: what was produced and where.
- `{{EVIDENCE}}`: the checks run and their results — the exact commands (type check, lint, tests, build) with their exit status, the drift-check result if your project uses one, and outputs you can open yourself (a file, a page, a report). Anything not run is labelled UNVERIFIED.
- `{{REVIEW_RECORD}}`: the review entry or file, or "awaiting review".
- `{{OPERATOR_DECISIONS}}`: your own replies or directions since the last update, with dates, or "none". Approvals already in the record carry forward.

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
