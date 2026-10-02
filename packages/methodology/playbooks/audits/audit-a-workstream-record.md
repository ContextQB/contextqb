---
id: audit-a-workstream-record
title: Workstream Record Audit
summary: A structured check that a workstream record can govern work across agents and sessions without hiding authority, evidence, or decisions.
version: 0.2.2
audience:
  - founder
  - operator
  - developer
  - agent
journey_stage: 1
journey_rank: 80
objective: |
  Determine whether a workstream record gives an operator and a fresh agent a reliable shared picture of the objective, authority, evidence, decisions, and next action.
scope: |
  The named workstream record, its boot-map routing, active scope, latest delivery and review records, handoff, related project documentation, and the actual files, outputs, or processes needed to reconcile the current state.
required_sections:
  - Executive summary and readiness verdict
  - Discovery and proportionality check
  - Objective and ownership check
  - Deliverables, relationships, and dependency conditions
  - Authority and approval provenance check
  - Pass history and evidence check
  - Outstanding-items disposition check
  - Checkpoint and handoff reconciliation
  - Closure or transfer check
  - Findings, recommendations, and unverified limits
evaluation_criteria:
  - A fresh session can find the record from the project's boot map or records index without being told its filename.
  - The record's weight fits the objective, and each scope, review, and current-state summary has one maintained authoritative copy, whether embedded in the record or linked; no competing copy or stale copied claim remains.
  - The objective is stated in plain language and has one accountable operator and one record keeper.
  - Every deliverable has an owner, acceptance evidence, and a current status.
  - Actionable dependencies name the required condition, owner, and verifier.
  - The active scope identifies revision, executor, reviewer, review destination, boundaries, and exclusions.
  - Every approval traces to the operator's own reply or direction, with date and source.
  - Pass history separates authorization, delivery, the kind of review, disposition, and current state.
  - Outstanding items distinguish unfinished work, corrections, additions, blockers, and settled decisions.
  - The handoff has been reconciled with actual files, outputs, revisions, running processes, and where the record is saved.
  - Closure or transfer decisions are supported by current evidence and do not claim adjacent work is complete.
  - A fresh session could identify the next authorized action without reconstructing the prior chat.
deliverables:
  - A single Markdown audit report with a readiness verdict, evidence-backed findings, prioritized recommendations, and stated limits.
related:
  - agent-instructions
  - documentation-as-architecture
  - review-an-agent-workstream
  - run-an-agent-workstream
  - the-plan-is-the-contract
  - work-with-agents-through-documentation
tags:
  - audit
  - agents
  - documentation
  - governance
review:
  status: final
  last_reviewed: "2026-10-02"
  reviewer: "Opus 5.5, independent review of 0.1.1 (2026-10-02); Codex (CoS), independent checks of 0.2.0 and the 0.2.1 changes, and final independent QA of 0.2.1 (2026-10-02)"
  reviewer_notes: "2026-10-02: Opus 5.5 revised this atom as developer in 0.2.0 (FIX-01) and 0.2.1 (C1). Codex's final independent QA of the vertical returned verified with follow-up (2026-10-02). Travis (operator) accepted the vertical for publication on 2026-10-02. 0.2.2 removes the body draft note for publication; lesson, contract, and example content unchanged."
---

# Workstream Record Audit

## Use this as an agent instruction

> You are auditing the workstream record at **[WORKSTREAM_RECORD]**.
>
> Start as a fresh session would: read the project instructions and boot map first, and note whether they lead you to this record. Then read the record, its active scope, latest delivery and review records, handoff, related project documentation, and the actual files, outputs, or processes needed to reconcile the current state.
>
> Produce a Markdown report with these sections, in order:
>
> 1. **Executive summary and readiness verdict.** Choose one: **Ready** (another session can govern the next pass from these records), **Ready after listed repairs**, or **Not ready**. Give the three most important reasons.
> 2. **Discovery and proportionality check.** Can a fresh session find this record from the boot map or records index without being told its filename? Does the record's weight fit the objective? A one-pass task does not need a full record. A scope or review may live inside the record as its one maintained copy, and a concise summary that points to its source is fine. Flag competing maintained copies (the same scope, review, or current state kept in two places that can drift) and copied claims that are now stale against their source.
> 3. **Objective and ownership check.** Confirm the objective, accountable operator, record keeper, status, and current state.
> 4. **Deliverables, relationships, and dependency conditions.** For each deliverable, name its owner, acceptance evidence, and current status. For each dependency, name the condition, owner, verifier, and evidence.
> 5. **Authority and approval provenance check.** Confirm the active approved scope, revision, executor, reviewer, review destination, boundaries, exclusions, and next assignment. For each approval, confirm it quotes or faithfully paraphrases the operator's own reply, with date and source. An agent's recommendation, silence, or passing tests are not approval. Flag work that appears to have escaped authority.
> 6. **Pass history and evidence check.** Trace at least the latest meaningful pass through Authorized → Delivered → Reviewed → Disposition → Current state. Distinguish claims from independent evidence, name the kind of check (self-check, independent review, operator inspection), and preserve unverified criteria.
> 7. **Outstanding-items disposition check.** Classify incomplete work, corrections, proposed additions, blockers, and settled decisions. Flag anything that could be mistaken for approved work.
> 8. **Checkpoint and handoff reconciliation.** Compare the handoff with actual files, outputs, revisions, processes, and where the record is saved. Identify stale instructions and the exact next read-first set.
> 9. **Closure or transfer check.** Determine whether the bounded objective is accepted, paused, transferred, cancelled, or still active, and whether the boot-map entry matches. Do not treat adjacent work or a whole project as complete without evidence.
> 10. **Findings, recommendations, and unverified limits.** Use blocker, major, minor, and nit severity. Every finding needs evidence and a concrete repair or decision. List what you could not check and why. An unchecked item is unverified, not passed.
>
> Report **Ready** only when the record can be found from the boot map, every deliverable has an owner, evidence, and status, the active scope's approval traces to the operator, and a fresh session could name the next authorized action from the records alone.
>
> Do not repair the record while auditing it. State the evidence and recommendations. Do not certify a result that you could not check.
