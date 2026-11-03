---
id: change-stored-data-safely
title: Change Stored Data Safely
summary: Rehearse a change to saved information, check old and new application versions and choose a recovery path before touching valuable records.
version: 0.1.2
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 4
journey_rank: 60
problem: New code can expect a data format that existing records do not have, and reverting code may leave those records unusable.
when_to_use: Before changing the structure or meaning of stored information, including field renames, required values and record relationships.
expected_outputs:
  - A versioned migration plan with compatibility and execution-order decisions.
  - Rehearsal evidence on representative controlled records.
  - A verified recovery option, stop conditions and an explicit decision about the real target.
related:
  - backend-architecture
  - changing-software-without-losing-control
  - designing-your-apps-data
  - refactor-planning
  - rehearse-backup-and-recovery
  - rollback-vs-restore
  - turn-a-feature-brief-into-checks
  - update-a-dependency-safely
related_principles:
  - failure-modes
  - refactor-with-duplicates
tags:
  - data
  - reliability

---

# Change Stored Data Safely

Changing the program and changing what it remembers are different jobs. A **migration** is a controlled change to the structure or contents of saved data. A **schema** describes the expected structure: fields, types and rules. Your agent can write the migration; you decide what information must survive and what interruption is acceptable.

Start with [Designing Your App's Data](contextqb://guides/designing-your-apps-data), [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) and a completed [recovery rehearsal](contextqb://playbooks/rehearse-backup-and-recovery). [Refactor With Duplicates](contextqb://principles/refactor-with-duplicates) handles replacing code safely; it does not recover changed records.

## Step 1 — Name the change and the promise to preserve

Write down the old format, proposed format and reason. Identify existing records that need a decision: missing values, unusually long text, duplicate identifiers and related files. Use representative made-up examples first. Any use of real records needs an appropriate handling plan and authorization.

For the notebook, imagine renaming `note` to `body`. The names change; the researcher's words must remain exactly the same. Adding a required date is a different problem: an older note may have no known creation date. Ask the owner what “unknown” means instead of inventing a date that looks factual.

Turn those promises into expected results with [Turn a Feature Brief Into Checks](contextqb://playbooks/turn-a-feature-brief-into-checks).

## Step 2 — Check which versions work together

Ask the agent to test or explain four combinations: old code with old data, new code with old data, new code with new data, and old code with new data. Mark untested combinations as unknown. Identify the order of the application and data changes, including what happens if one succeeds and the other fails.

For a local notebook, stopping the app during a change may be acceptable. A hosted product with several running copies needs a plan for readers and writers that may still use the old format. Adding a field first, updating readers and writers, and removing the old field later can reduce risk, but only if the agent demonstrates compatibility at each step.

Record how writes will be paused or handled, what happens on interruption or a repeated run, and which version identifies an already migrated dataset. A transaction can make a supported group of database changes succeed or fail together; the actual storage system and operation determine that guarantee. It does not make outside effects reversible.

## Step 3 — Prepare the recovery and stop conditions

Keep the migration instructions with the project's versioned files. Record the exact starting format and migration version. Use the storage system's supported backup procedure and verify recovery into a separate destination before relying on it.

Name the stop conditions: unexpected format, missing source values, record mismatch, failed checks or an untested recovery option. Decide who may authorize the real change. A successful rehearsal gives that person evidence; it is not permission to change another target automatically.

## Worked change: preserve the note before removing its old field

Use the two-record version-1 file in [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery), in a new disposable copy. These are the illustrative rules for two application versions:

- **Old reader:** reads text only from `note`.
- **Transition reader:** reads `body` when present, otherwise reads `note`.
- **Version-2 format:** keeps `note` and adds `body` with the same value.
- **Version-3 format:** removes `note`, leaving `body` as the text field.

Ask the agent to implement only a local fixture exercise, with these checks:

1. Create version 2 from version 1 without changing the input file, and set `schemaVersion` to 2. For both records, preserve the identifier and title, copy the exact note text to `body`, and retain `note`.
2. Demonstrate that the old and transition readers both return the expected text from version 2, and that the transition reader also reads version 1.
3. Reject an unsupported format or a missing source text with an explanation. A repeated version-1-to-2 migration should either be a verified no-op on valid version 2 or refuse it clearly; it must not silently discard information.
4. In another disposable copy, make version 3. Show that the old reader now fails its expected-text check while the transition reader succeeds.

The decision after check 4 is **no-go for rolling back to the old reader against version 3**. A compatible reader or a separately rehearsed data recovery is needed. The real application's write behavior also needs testing; these tiny reader checks cover only the supplied fixture.

Retaining both fields temporarily creates another obligation. If users can edit during the transition, define which value is authoritative and how both remain compatible. For this exercise, writes stay stopped. Removing the old field belongs in a later change after old readers and writers have been retired and recovery reconsidered.

## Step 4 — Inspect the rehearsal and decide

Have a fresh agent session that did not write the migration, or another qualified reviewer, inspect the plan and results. Compare important values and relationships before and after, then exercise the intended app against the migrated test copy. A matching record count alone can conceal damaged content.

Record the tested code and migration versions, target, checks, interruptions tested, recovery evidence and unresolved cases. Explain any difference between the rehearsal and the intended real target, including data size and concurrent activity.

Authorize the real change only when its scope and evidence support the decision. Otherwise record the missing result and next action. [Failure Modes](contextqb://principles/failure-modes) supplies the broader principle: plan for the interrupted path while you can still choose how to handle it.
