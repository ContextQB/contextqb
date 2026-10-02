---
id: run-an-agent-workstream
title: Run an Agent Workstream
summary: Define, operate, review, and close a documented flow of work between an operator and agents.
version: 0.4.3
problem: |
  An agent can complete an assignment while the objective remains unclear, unverified, or unfinished. Without a durable workstream record, authority, evidence, discoveries, and next actions disappear into chat history or competing notes.
when_to_use: |
  Use when an objective will take more than one meaningful pass, involve a decision or review, or continue across sessions. The method applies to product work, infrastructure, research, content, repairs, and operations. A small one-pass task needs only a checklist.
expected_outputs:
  - A workstream record with an objective, owner, deliverables, relationships, current state, and next action, reachable from the project's boot map.
  - An approved scope for the next bounded assignment, with boundaries, acceptance evidence, and traceable operator approval.
  - A dated pass history separating authorization, delivery, review, disposition, and current state.
  - An outstanding-items register for corrections, roll-forwards, additions, blockers, and decisions.
  - A reconciled checkpoint and handoff that identify the next authorized action and where the record is saved.
  - An explicit acceptance, transfer, pause, cancellation, or closure decision.
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 1
journey_rank: 70
tags:
  - documentation
  - agents
  - governance
  - orchestration
related_principles:
  - append-dont-overwrite
  - context-quarterback-the-onboarding-map
  - documentation-as-architecture
  - the-plan-is-the-contract
related:
  - architectural-hardening-loop
  - audit-a-workstream-record
  - feature-build-loop
  - feature-planning
  - resume-an-agent-workstream
  - review-an-agent-workstream
  - run-a-multi-agent-workflow
  - scope-vs-punchlist
  - set-up-a-documentation-system
  - start-an-agent-workstream
  - understanding-the-context-window
  - update-an-agent-workstream
  - work-with-agents-through-documentation
  - write-a-context-qb
review:
  status: final
  last_reviewed: "2026-10-02"
  reviewer: "Opus 5.5, independent review of 0.3.1 (2026-10-02); Codex (CoS), independent checks of 0.4.0 and the 0.4.1 changes, and final independent QA of 0.4.2 (2026-10-02)"
  reviewer_notes: "2026-10-02: Opus 5.5 revised this atom as developer in 0.4.0 (FIX-01), 0.4.1 (C1), and 0.4.2 (C2). Codex's final independent QA of the vertical returned verified with follow-up (2026-10-02). Travis (operator) accepted the vertical for publication on 2026-10-02. 0.4.3 removes the body draft note for publication; lesson, contract, and example content unchanged."
---

# Run an Agent Workstream

This playbook is the operational companion to [Work With Agents Through Documentation](contextqb://guides/work-with-agents-through-documentation). The guide explains the operator's working habit. This playbook defines the record and the lifecycle an agent should maintain.

A **workstream** is a continuing flow of work between an operator and agents toward a defined objective. The work may concern a feature, an infrastructure problem, a research question, a content process, or an ongoing operation. The workstream is the flow; its record is the durable coordination surface.

The record should answer, at any moment:

> What are we trying to achieve, what work is authorized, what happened, what evidence exists, what decisions are open, and what happens next?

## When to use this, and when not

Use a workstream record when the objective needs several meaningful passes, a review, an operator decision, or a later session. For a small one-pass task, a checklist in the conversation or a short note is enough. Do not create a record just because this playbook exists.

If the project already has a document that carries the objective, its approved contract, a current-state summary, and dated history, such as a scope with a status board, treat that document as the workstream record. Do not create a parallel file.

## Roles, including working alone

| Role                     | Responsibility                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Accountable operator** | States the objective, approves scopes, decides on additions, accepts the result.       |
| **Record keeper**        | The only writer of the record's current summary. Records decisions and dispositions.   |
| **Executor**             | Carries out an approved scope and reports outputs, evidence, gaps, and discoveries.    |
| **Reviewer**             | Checks the output against the approved scope and writes findings to an assigned place. |

**Working alone with one agent tool** is normal. You are the accountable operator. The agent in your main session can be both record keeper and executor. For review, start a new session that did not build the output. Give it the project instructions, the record, the approved scope, and the outputs. It writes its findings in the review entry or file you assign. The keeper then records the disposition. Reviewers add their own dated entries; they do not rewrite the summary.

When several agents work in parallel, use [Run a Multi-Agent Workflow](contextqb://playbooks/run-a-multi-agent-workflow) to divide the lanes. This record remains the shared summary, with one keeper.

**Three kinds of checking.** Name the one you have:

- **Self-check:** the agent that did the work checks it. This is useful, but it is not review.
- **Independent review:** a reviewer that did not produce the output checks it against the approved scope. A fresh session that did not implement the work qualifies. Opening a new tab or relabeling the same session does not.
- **Operator inspection:** you look at something you can judge yourself, such as the output folder, the published page, or the report's conclusions.

## The record shape

**Minimum record.** Start with five things and add the rest when the work needs them:

1. Objective and accountable operator.
2. The approved scope, with its acceptance checks and your recorded approval.
3. Current state: what is verified, unfinished, or awaiting a decision.
4. Outstanding items.
5. The next authorized action.

The full shape, for when the flow grows:

```markdown
# Workstream — [objective]

## Objective and ownership

Objective:
Why now:
Accountable operator:
Record keeper:
Status: Active | Paused | Transferred | Cancelled | Closed
Updated:
Current output/revision:

## Deliverables and relationships

Deliverable | owner | acceptance evidence | status
Related work or affected system:
Dependency | required condition | owner | verifier | status

## Current authority

Active scope and revision:
Approval (operator's words, date, where given):
Executor:
Reviewer and review destination:
Exclusions:
Next authorized assignment:

## Current state

Verified:
Incomplete or unverified:
Decisions needed:
Next action:

## Outstanding items

ID | type | origin/evidence | owner | disposition | destination

## Pass history

### [date] — [pass]

Authorized:
Delivered:
Reviewed: (self-check / independent review / operator inspection; record location)
Disposition:
Current state:

## Checkpoint and handoff

Read-first records:
Reconciled files, outputs, revisions, and processes:
Record saved where:
Superseded instructions:
Next session action:

## Closure or transfer

Acceptance/transfer decision:
Evidence:
Remaining obligations:
Maintained documentation:
Boot-map routing updated:
Archive disposition:
```

**Where the truth lives.** The record coordinates; it does not replace its sources.

| Question                                  | Authoritative source                                                                                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What are we trying to achieve, what next? | The record's objective and current state.                                                                                                                                                   |
| What was agreed?                          | The approved scope (embedded or linked).                                                                                                                                                    |
| What did the review find?                 | The review entry or file.                                                                                                                                                                   |
| What is actually in the files or outputs? | The files and outputs themselves. Records orient; artifacts prove.                                                                                                                          |
| What may the agent do?                    | The operator's recorded approval and any scoped authority still in force.                                                                                                                   |
| What should the next session read?        | The handoff: a dated snapshot to reconcile with the current record and actual artifacts. Newer operator decisions and record entries supersede it; its timestamp alone grants no authority. |
| How does the system behave, and why?      | Maintained project documentation and ADRs.                                                                                                                                                  |

When records conflict, a newer recorded operator decision outranks an older scope, and both outrank a handoff. When a record conflicts with the actual files, report the discrepancy. Do not choose one side silently.

## Step 1 — Establish the objective and register the record

The **boot map** is the set of files every new session reads first, such as `AGENTS.md` and `context.qb.yaml`, or your project's equivalent instructions and map. Read it and the relevant existing records. Reuse a workstream or owning scope if one already covers the objective. Otherwise create one record in the project's existing place for work records. `docs/workstreams/<objective-slug>.md` is one convention, not a required migration.

Make the record findable. Add one line to the boot map, for example a `status:` entry in `context.qb.yaml`, a line in `AGENTS.md`, or an entry in the records folder's index, so a fresh session finds the active record without being told its filename.

Write the objective in terms the operator can recognize. Name the accountable human, record keeper, deliverables, acceptance evidence, boundaries, and relationships. For every actionable dependency, name the required condition, owner, and verifier. A link to another record is not a dependency condition and does not authorize parallel work.

Ask the agent:

> Establish or reuse the workstream for **[objective]**. Read the boot map and relevant records. Define deliverables, acceptance evidence the operator can observe, boundaries, related work, dependency conditions, owners, verifiers, and the next proposed assignment. Register the record in the boot map. Do not implement it yet.

Operator check: can you describe the result and how you will recognize it? If not, ask for a concrete example before approving work.

## Step 2 — Propose and approve a scope

A **scope** is the agreement for a bounded assignment. It states the goal, the materials affected, responsibilities, risks, exclusions, and acceptance checks. Include at least one check the operator can perform or observe directly. Prefer a first scope that is reversible: copies, a draft, a test account.

For software, use [Feature Planning](contextqb://playbooks/feature-planning) for the detailed plan. For research, writing, infrastructure, or operations, adapt the same discipline to the output and risks of that work. Do not force software sections onto unrelated work.

**Approval comes from the operator, not the agent.** Record it only from the operator's own reply or direction. Quote it or paraphrase it faithfully, with the date and where it was given. The agent's recommendation, the operator's silence, and passing checks are not approval. If a reply is ambiguous, ask. Existing approval carries forward within its boundaries: a correction inside the same contract needs no new approval. A material change to the objective, boundaries, architecture, outputs, risks, or acceptance criteria requires a visible revision and re-approval.

Ask the agent:

> Prepare the next bounded scope for **[objective]**. State the output, what may change, exclusions, risks, executor, reviewer, review destination, and acceptance evidence, including one check I can perform myself. Present it for approval and record my reply when I give it. Do not implement it yet.

Operator check: what does this approval permit, and what remains a later decision?

## Step 3 — Execute and update governance

**Governance** is the ongoing practice of keeping authority, delivery, evidence, decisions, discoveries, and current state legible. The record keeper maintains the shared summary. Executors and reviewers supply reports; they do not race to edit the same summary.

For each meaningful pass, record this sequence:

1. **Authorized:** scope and revision, operator approval (words, date, where), executor, reviewer, and assignment.
2. **Delivered:** actual output or revision and its location, completion claim, checks run, gaps, and discoveries.
3. **Reviewed:** the kind of check, reviewer, output checked, criteria, evidence, findings, limits, and where the review is recorded.
4. **Disposition:** accepted, corrected, rolled forward, proposed, deferred, rejected, or blocked; include the decision owner.
5. **Current state:** verified progress, uncertainty, dependency effects, and next authorized action.

If the agent discovers a contradiction that requires changing the approved agreement, it stops the affected work, reports the contradiction, and waits for revision and re-approval. It does not silently widen the scope.

Ask the agent:

> Execute **[approved scope and pass]** within its boundaries. Report actual outputs and where they are, evidence, incomplete work, discoveries, and contradictions to **[record keeper]**. Stop affected work if the agreement must change. Keep the current state and dated history accurate.

Operator check: does the report distinguish what was produced from what was demonstrated?

## Step 4 — Review before relying on the result

Review checks the delivered output against the approved scope. For a meaningful pass, use an independent reviewer: a fresh session or another agent or person that did not produce the output. It reads the approved agreement and the actual outputs, tests the criteria, records limits, and writes findings in the assigned review entry or file for the record keeper.

For software, [Feature Build Loop](contextqb://playbooks/feature-build-loop) provides the detailed verification walks. [Architectural Hardening Loop](contextqb://playbooks/architectural-hardening-loop) specializes the same discipline for already-drifted software. In those loops, `SHIPPED` is the executor's delivery claim and `VERIFIED` corresponds to a passing review. Other objectives need evidence appropriate to their outputs.

Preserve the distinction between a delivery claim and independent evidence. A criterion that could not be checked stays unverified. If a later change affects a passed criterion, check it again.

Ask a fresh reviewer:

> Review **[output/revision]** against **[approved scope]** using the actual materials. Report passed, failed, and unverified criteria, evidence, disagreements, and effects on related work. Write the review to **[review destination]** for **[record keeper]**. Do not change the output. Put failed authorized work first in the next pass.

Operator check: would you rely on this result for the next decision? Do one inspection of your own. If evidence is missing, name it rather than treating confidence as proof.

## Step 5 — Disposition discoveries and outstanding work

Maintain an outstanding-items register. Give every item an ID, origin or evidence, type, owner, status or decision, and destination when assigned.

- **Roll-forward:** authorized work that remains incomplete.
- **Correction:** a failure against the approved agreement, with closure evidence. It proceeds under the existing approval.
- **Proposed addition:** useful work outside the agreement, awaiting approval, deferral, or rejection.
- **Blocker:** a missing input, condition, access, or decision, with a resumption condition.
- **Deferred or rejected:** retain the dated decision and reason so it is not resurrected as active work.

A **punchlist** is the final set of corrections separating a substantially complete deliverable from done. It does not replace the broader outstanding-items register. See [Scope vs Punchlist](contextqb://briefings/scope-vs-punchlist).

Ask the agent:

> Triage the items from the last pass. Separate incomplete commitments, corrections, proposed additions, blockers, and decisions already made. Record evidence, owners, destinations, and resumption conditions. Show me anything that changes the agreement before implementing it.

Operator check: can you tell what may proceed now and what still requires your decision?

## Step 6 — Checkpoint, hand off, and resume

A **checkpoint** is the reconciled state at a stopping point. A **handoff** tells the next session what to read, verify, and do. It can be a section of the record or a separate dated file. Before stopping, reconcile the record with the actual files, outputs, saved revisions, and running jobs or processes. Record "none" when none exist. Say where the record is saved. Saving it in the project folder makes it available to a later session in that same checkout, even before it is committed. Saving alone does not show that it is backed up or available in another checkout or on another computer; that depends on your project's rules for committing, pushing, or copying. Anything that exists only in the chat or an unsaved editor must be saved, or explicitly carried forward, before another session can use it. Follow your project's own rules for when to commit or push. Refresh the boot-map line if the status changed.

Ask the agent:

> Checkpoint **[workstream]** and prepare its handoff. Reconcile the records with actual work. Record the approved scope, verified and unfinished results, decisions, output locations and versions, unsaved or uncommitted changes, running agents/jobs/processes, where the record is saved, superseded instructions, and the next authorized action. Refresh the boot-map entry.

Resume with:

> Resume **[workstream record]**. Read the boot map, current record, approved scope, latest review, and handoff (or the record's checkpoint section if there is no separate handoff). Reconcile them with actual work before restarting anything. Identify newer decisions that supersede the handoff and state the next authorized action. Continue only within that authority. If you are not the record keeper, report discrepancies instead of editing the summary.

For code, reconcile the local checkout and branch. For other work, reconcile the current files, outputs, and jobs. A handoff is a snapshot. It is not continuing authorization or proof that a process is still running. See [Understanding the Context Window](contextqb://guides/understanding-the-context-window).

Operator check: can a fresh session choose the next action without you retelling the conversation?

## Step 7 — Accept, transfer, pause, cancel, or close

Accept the bounded objective when all four of these hold:

- Current evidence supports its deliverables.
- Obligations are resolved or explicitly transferred.
- Relevant maintained documentation is current.
- The accountable operator accepts the result in their own words.

Acceptance does not certify adjacent work or the whole project.

Record a transfer with the receiving owner and record. Record a pause with its reason and resumption condition. Record a cancellation with what was abandoned and who handles remaining effects. Do not remove a promised deliverable without an approved scope change.

At closure, update or remove the boot-map line and archive the record with its history preserved, following [Append, Don't Overwrite](contextqb://principles/append-dont-overwrite). A delivery claim alone does not justify closure or archival.

Ask the agent:

> Assess whether **[objective]** meets its approved acceptance criteria. Show current evidence, unresolved obligations, transfers, scope changes, and effects on related work. Update relevant project documentation and present the result for my acceptance. Record my decision in my words, update the boot-map entry, and note any next assignment.

Operator check: are you accepting the result that was actually reviewed, with no promised output silently removed?

## Minimum operating routine

At the start of every meaningful pass:

1. Read the boot map and follow its pointer to the active workstream record.
2. Read the current record, approved scope, latest review, and handoff or checkpoint.
3. Confirm authority and prerequisites.
4. Act within the approved boundary.
5. Record delivery and evidence.
6. Review before relying on the result.
7. Dispose of discoveries, choose the next authorized action, and save the record.

The companion prompts provide reusable versions of these instructions: [start](contextqb://prompts/start-an-agent-workstream), [update](contextqb://prompts/update-an-agent-workstream), [review](contextqb://prompts/review-an-agent-workstream), and [resume](contextqb://prompts/resume-an-agent-workstream). The [Workstream Record Audit](contextqb://audits/audit-a-workstream-record) checks whether a record is ready for another session to use.

## Worked example: a first file-organizer trial

This is the complete example record for this method. **Everything in it is fictional:** the dates, the tool, the files, and every reported result and check. No experiment was run. It shows one operator ("You") working with one agent tool.

**How to read the identifiers:**

| ID     | Meaning                         |
| ------ | ------------------------------- |
| D1, D2 | Deliverables                    |
| S1     | Approved scope, revision 1      |
| R1, R2 | Delivered revisions of the work |
| V1, V2 | Reviews                         |
| C-01   | Correction                      |
| A-01   | Proposed addition               |
| H1     | Handoff                         |

### Boot-map entry

```yaml
# context.qb.yaml (or one line in AGENTS.md)
status:
  file-organizer-trial: active — see docs/workstreams/file-organizer-trial.md
```

### docs/workstreams/file-organizer-trial.md

#### Objective and ownership

- **Objective:** Demonstrate a usable organizer on 20 copied sample files before considering regular use.
- **Why now:** You want to test the category rules without risking the real Downloads folder.
- **Accountable operator:** You.
- **Record keeper:** Main agent session (also the executor for this trial).
- **Status:** Closed (accepted 2026-03-05).
- **Updated:** 2026-03-05.
- **Current output/revision:** R2.

#### Deliverables and relationships

| Deliverable                                                                                             | Owner        | Acceptance evidence | Status        |
| ------------------------------------------------------------------------------------------------------- | ------------ | ------------------- | ------------- |
| D1 — Organizer program `organizer-trial/organizer.py` and organized copies in `organizer-trial/output/` | Main session | S1 checks 1–4       | Verified (V2) |
| D2 — Usage instructions and category rules in `organizer-trial/README.md`                               | Main session | S1 check 5          | Verified (V2) |

| Dependency    | Required condition                                                                | Owner | Verifier                                       | Status         |
| ------------- | --------------------------------------------------------------------------------- | ----- | ---------------------------------------------- | -------------- |
| Sample copies | 20 copies in `organizer-trial/samples/`, including at least one unusual file type | You   | Main session confirms the count before running | Met 2026-03-02 |

Related future work: any regular use of the real folder or scheduling depends on an accepted trial. It needs its own scope, owner, and review. Nothing here authorizes it.

#### Current authority

- **Active scope:** S1 revision 1 (this section).
- **Approval:** You, 2026-03-02, in the planning chat: "Yes, go ahead with S1 on the copies."
- **Executor:** Main session.
- **Reviewer and destination:** A fresh session that did not build the organizer. It writes to `docs/reviews/file-organizer-V1.md`, then `…-V2.md`.
- **Boundaries:** May create or change only `organizer-trial/organizer.py`, `organizer-trial/README.md`, and the copies in `organizer-trial/output/`. `organizer-trial/samples/` is read-only input; output files are copies of it.
- **Exclusions:** The real Downloads folder, automatic scheduling, deletion, and category redesign.
- **S1 acceptance checks:**
  1. All 20 sample copies appear exactly once in `organizer-trial/output/`.
  2. Each output file's contents match its original.
  3. `organizer-trial/samples/` still holds the same 20 files after the run.
  4. Files sit in the agreed categories (Documents, Images, Audio, Archives, Other). Unknown types go to Other.
  5. `organizer-trial/README.md` explains how to run the organizer and describes the same category rules.
  6. Operator inspection: you open the output folder and see 20 files, including the unusual one in Other.

#### Pass history

**2026-03-02 — Pass 1**

- **Authorized:** S1 revision 1, approved by you as quoted above.
- **Delivered:** The main session reports the organizer complete as R1: the program in `organizer-trial/organizer.py`, output copies in `organizer-trial/output/`, and instructions in `organizer-trial/README.md`.
- **Reviewed (independent review, fictional result, 2026-03-03):** V1 in `docs/reviews/file-organizer-V1.md`. Nineteen files appear. The `.heic` file was skipped instead of going to Other. Checks 2 and 3 pass. Check 1 fails (19 of 20). Check 4 fails for the skipped file. Check 5 fails: the README says unknown types are skipped, which contradicts S1's "unknown types go to Other" rule. (UNVERIFIED is reserved for a check that could not be performed.)
- **Disposition:** C-01 correction under S1: send unknown types to Other in `organizer.py` and correct the README. No new approval is needed because the work stays inside the contract.
- **Current state:** Trial incomplete. Next: correct C-01, then a fresh review.

**2026-03-03 — Discovery during the delivery discussion**

- The main session suggested running the organizer daily. Recorded as A-01, a proposed addition awaiting your decision. Not authorized.

**2026-03-03 — Handoff H1 (session ended)**

- **Read first:** this record, S1 above, and V1.
- **Reconciled state:** R1 output in `organizer-trial/output/`; samples unchanged; no jobs or agents running.
- **Record saved where:** in the project folder, saved.
- **Next session action:** correct C-01 under S1, then request V2.

**2026-03-04 — Pass 2**

- **Authorized:** C-01 under S1 (existing approval).
- **Delivered:** R2. The main session reports that `organizer.py` now sends unknown types to Other, that it re-ran the organizer on the samples into `organizer-trial/output/`, and that the README now states the Other rule.
- **Reviewed:** pending.
- **Disposition:** delivery awaiting V2. C-01 stays open until its criteria are independently verified.
- **Current state:** awaiting V2.

The session ended without rewriting H1, so H1 still says "correct C-01."

**2026-03-05 — Resumption (fresh session)**

- **Read:** the boot map, then this record, S1, V1, and H1.
- **Reconciled:**
  - H1 is stale. The Pass 2 entry shows R2 already delivered.
  - Inspected the actual changes (fictional): `organizer.py` now has an Other rule for unrecognized types, and the README states the same rule. This confirms the change exists. It does not prove the organizer behaves correctly.
  - Left for V2: run all S1 checks on the R2 output, including whether every sample appears exactly once and the `.heic` file lands in Other.
  - Samples untouched; no processes are running.
- **Next authorized action:** request V2. Do not redo the correction. Do not touch the real folder or scheduling.
- **H1** is marked superseded by this entry.

**2026-03-05 — Review V2 (independent review, fictional result)**

- V2 in `docs/reviews/file-organizer-V2.md`, by a fresh session.
- Checks 1–5 pass, including the README's agreement with the Other rule.
- **Operator inspection (check 6):** you opened the output folder, counted 20 files, and found the `.heic` file in Other.

**2026-03-05 — Acceptance and closure**

- **Decision:** You: "Accepted — the trial works. Don't touch my real folder yet."
- **Evidence:** V2 and your inspection.
- **Remaining obligations:** none for S1. A-01 stays a proposal, deferred until you decide on regular use.
- **Real-folder use:** not authorized.
- **Boot-map entry:** changed to `file-organizer-trial: closed 2026-03-05`.
- **Archive:** record archived to the project's archive per its archive rules.

#### Outstanding items

| ID   | Type                                | Origin            | Owner          | Disposition                               |
| ---- | ----------------------------------- | ----------------- | -------------- | ----------------------------------------- |
| C-01 | Correction                          | V1                | Main session   | Closed by R2 and V2, 2026-03-05           |
| A-01 | Proposed addition: daily scheduling | Pass 1 discussion | You (decision) | Deferred; needs its own scope if approved |
