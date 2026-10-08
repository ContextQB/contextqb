---
id: review-an-agent-workstream
title: Review an Agent Workstream Result
summary: A reusable instruction for independently checking a delivered output against its approved scope and recording evidence and limits.
version: 0.3.1
audience:
  - founder
  - operator
  - developer
  - agent
journey_stage: 1
journey_rank: 90
use_case: |
  Use in a fresh reviewer session that did not produce the output, after a meaningful pass and before another assignment relies on the result.
variables:
  - WORKSTREAM_RECORD
  - APPROVED_SCOPE
  - DELIVERED_OUTPUT
  - RELATED_WORK
  - REVIEW_DESTINATION
expected_output: |
  A review written to the assigned destination, listing each acceptance check, evidence, passed, failed, and unverified criteria, disagreements, dependency effects, and a proposed disposition for the workstream record keeper.
quality_standard: |
  The review checks the actual output against the approved scope, does not rely on the executor’s confidence, does not change the output, records limits honestly, and puts failed authorized work ahead of unapproved additions.
related:
  - agent-instructions
  - architectural-hardening-loop
  - audit-a-workstream-record
  - feature-build-loop
  - machine-verifiable-substrate
  - run-an-agent-workstream
  - update-an-agent-workstream
  - work-with-agents-through-documentation
  - refactor-planning
tags:
  - agents
  - review
  - governance
review:
  status: final
  last_reviewed: "2026-10-02"
  reviewer: "Independent agent review of 0.1.1 (2026-10-02); independent check and final independent QA of 0.2.0 (2026-10-02)"
  reviewer_notes: "2026-10-07 renewal B6 reciprocal links (0.3.1; author self-checked; independent review pending; not operator-accepted): related adds refactor-planning, which now points here for independent review of each refactor step; body unchanged. 2026-10-07 renewal B4 (0.3.0; author self-checked; independent review pending; not operator-accepted; targeted additions to the operator-accepted 2026-10-02 vertical): the template line 'Review:' becomes 'Output to review:'; the reviewer runs executable acceptance checks where the scope or operator permits, instead of reasoning about them, and ends with what it could not check and why; adds the subagent and separate-tool independence rule (the builder's account is a claim to test; a different model is not by itself independence), including review agents built into a tool; the reviewer stays read-only on the output; reciprocal link with machine-verifiable-substrate. Review provenance neutralised (agent and model detail kept in private records); the 2026-10-02 acceptance and its history are unchanged. 2026-10-02: An agent developer revised this atom in 0.2.0 (FIX-01). The final independent QA of the vertical returned verified with follow-up (2026-10-02). Travis (operator) accepted the vertical for publication on 2026-10-02. 0.2.1 removes the body draft note for publication; lesson, contract, and example content unchanged."
---

# Review an Agent Workstream Result

**Use when:** a meaningful pass is delivered and the next step would rely on it. Paste this into a fresh session that did not do the work. Opening another tab on the same conversation is not independent.

A subagent, a second agent, or a review agent built into your tool can be the reviewer only if it did not produce the output and is given this prompt with the record, the approved scope, and the outputs. Anything the builder said about its own work is a claim to test, not a finding. A different model can widen what a review notices; it does not by itself make the review independent.

**You get:** a written review with PASS, FAIL, or UNVERIFIED for each acceptance check, evidence, limits, and a proposed disposition for the record keeper.

**Fill in:**

- `{{WORKSTREAM_RECORD}}`: the record's path.
- `{{APPROVED_SCOPE}}`: the scope and revision.
- `{{DELIVERED_OUTPUT}}`: what to check and where it is.
- `{{RELATED_WORK}}`: anything this result affects, or "none".
- `{{REVIEW_DESTINATION}}`: the review entry or file to write.

```text
You are the independent reviewer for this workstream. You did not produce the output.

Workstream record: {{WORKSTREAM_RECORD}}
Output to review: {{DELIVERED_OUTPUT}}
Against: {{APPROVED_SCOPE}}
Related work to inspect: {{RELATED_WORK}}
Write the review to: {{REVIEW_DESTINATION}}

Read the project instructions, the workstream record, the approved scope, and the actual delivered output before judging the result. Do not change the output under review.

Where a criterion can be checked by running something, and the scope or the operator permits you to run it, run it rather than reasoning about it: the project's verifier commands, its tests, or the output itself. Record the command and its exit status or result. Do not edit files or run anything that changes the output, its data, or anything outside the review. If you were not permitted to run a check, mark it UNVERIFIED and say why. The executor's report is a claim to test, not evidence.

For every acceptance criterion, record:
- the criterion;
- the check performed;
- evidence and the output/revision checked;
- PASS, FAIL, or UNVERIFIED;
- limits, disagreements, or dependency effects.

End the review with a section "What I could not check, and why".

Do not certify work because the executor says it is complete. Write findings only to the review destination; the record keeper named in the workstream record updates the shared summary. A failed authorized criterion becomes a correction or roll-forward before any attractive unapproved addition. If the scope itself must change, say so and propose that decision separately.
```
