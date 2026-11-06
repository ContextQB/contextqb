---
id: change-stored-data-safely
title: Change Stored Data Safely
summary: Rehearse a change to saved information, check old and new application versions and choose a recovery path before touching valuable records.
version: 0.3.0
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

This playbook's example uses one invented situation. A team's task list records only whether each task is done: `true` or `false`. The team now needs to tell work that has not started apart from work in progress, so it proposes a `status` field with three values: `not_started`, `in_progress` and `done`. That is a useful new capability, but the old saved records cannot tell you everything the new design wants to know. Nothing is built, and you do not need to build it.

An old `true` can safely become `done`. An old `false` tells you only “not finished”; it does not reveal whether anyone has started. Someone has to decide how to handle that gap, and it is the owner's decision, not the migration's. In this example the owner agrees to mark those imported tasks `not_started`, to tell the team that this is a default, and to have them correct any task that is already in progress. The migration must not present that default as knowledge of anyone's actual progress. If it matters later which statuses were defaulted, record that as well.

Adding a required date is a different problem: an older task may have no known creation date. Ask the owner what “unknown” means instead of inventing a date that looks factual.

Turn those promises into expected results with [Turn a Feature Brief Into Checks](contextqb://playbooks/turn-a-feature-brief-into-checks).

## Step 2 — Check which versions work together

Ask the agent to test or explain four combinations: old code with old data, new code with old data, new code with new data, and old code with new data. Mark untested combinations as unknown. Identify the order of the application and data changes, including what happens if one succeeds and the other fails.

For a small app used by one team, stopping writes during the change may be acceptable. A hosted product with several running copies needs a plan for readers and writers that may still use the old format. Adding a field first, updating readers and writers, and removing the old field later can reduce risk, but only if the agent demonstrates compatibility at each step.

Record how writes will be paused or handled, what happens on interruption or a repeated run, and which version identifies an already migrated dataset. A transaction can make a supported group of database changes succeed or fail together; the actual storage system and operation determine that guarantee. It does not make outside effects reversible.

## Step 3 — Prepare the recovery and stop conditions

Keep the migration instructions with the project's versioned files. Record the exact starting format and migration version. Use the storage system's supported backup procedure and verify recovery into a separate destination before relying on it.

Name the stop conditions: unexpected format, missing source values, record mismatch, failed checks or an untested recovery option. Decide who may authorize the real change. A successful rehearsal gives that person evidence; it is not permission to change another target automatically.

## Worked change: add a status before removing the old field

This optional exercise uses its own tiny version-1 file of made-up tasks. Copy it, unchanged, into a new disposable directory; the checks compare the migrated values with this original, so a retyped or shortened copy could hide a lost or altered task. A change to real records still needs the recovery evidence from Step 3. Never point the exercise at real data.

`schemaVersion` labels the format of the whole file. Each task has an `id` that never changes, a `description` of the work and the original `done` flag:

```json
{
  "schemaVersion": 1,
  "tasks": [
    {
      "id": "task-1",
      "description": "Order replacement chairs",
      "done": true
    },
    {
      "id": "task-2",
      "description": "Book the hall for March",
      "done": false
    }
  ]
}
```

The change happens in three stages, each with its own format:

- **Version 1 (original):** each task has only `done`.
- **Version 2 (transition):** each task keeps `done` and gains `status`. An old `true` becomes `done`; an old `false` becomes `not_started`, the owner's agreed default. For this small exercise, all writes are stopped during the transition.
- **Version 3 (new):** `done` is removed, leaving `status` as the only progress field. This stage comes only after every old reader and writer has been retired.

And these are the illustrative rules for two application versions:

- **Old reader:** reads only `done`, showing `true` as finished and `false` as not finished.
- **Transition reader:** reads `status` when present; otherwise it applies the same rule as the migration (`true` → `done`, `false` → `not_started`, the owner's default).

Ask the agent to implement only a local fixture exercise, with these checks:

1. Create version 2 from version 1 without changing the input file, and set `schemaVersion` to 2. For both tasks, preserve the identifier and description exactly, keep `done`, and add `status`: `task-1` becomes `done` and `task-2` becomes `not_started`.
2. Demonstrate that the old and transition readers both give the expected answer from version 2, and that the transition reader also reads version 1.
3. Reject an unsupported format, or a task whose `done` is missing or not `true`/`false`, with an explanation. A repeated version-1-to-2 run on a valid version-2 file should be a verified no-op or refuse clearly. In particular, it must not reset a status someone has since corrected to `in_progress` back to the default.
4. In another disposable copy, make version 3. Show that the old reader now fails its expected-answer check because `done` no longer exists, while the transition reader succeeds.

The decision after check 4 is **no-go for rolling back to the old reader against version 3**. A compatible reader or a separately rehearsed data recovery is needed. The real application's write behavior also needs testing; these tiny reader checks cover only the supplied fixture.

Do not let people rely on `in_progress` while old writers still exist. An old screen that knows only `done` could mark a task finished by setting `done` to `true` while `status` still says `in_progress`, or untick it and leave `status` at `done`. Before the team uses the new distinction, retire old writers, or define which field is authoritative and test how the two stay consistent. Removing `done` belongs in a later change, after old readers and writers have been retired and recovery reconsidered.

## Step 4 — Inspect the rehearsal and decide

Have a fresh agent session that did not write the migration, or another qualified reviewer, inspect the plan and results. Compare important values and relationships before and after, then exercise the intended app against the migrated test copy. A matching record count alone can conceal damaged content.

Record the tested code and migration versions, target, checks, interruptions tested, recovery evidence and unresolved cases. Explain any difference between the rehearsal and the intended real target, including data size and concurrent activity.

Authorize the real change only when its scope and evidence support the decision. Otherwise record the missing result and next action. [Failure Modes](contextqb://principles/failure-modes) supplies the broader principle: plan for the interrupted path while you can still choose how to handle it.
