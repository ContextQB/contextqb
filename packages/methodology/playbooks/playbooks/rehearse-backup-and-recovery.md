---
id: rehearse-backup-and-recovery
title: Rehearse Backup and Recovery
summary: Restore a controlled copy, inspect the recovered records and prove the intended application can use them before you depend on a backup.
version: 0.3.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 4
journey_rank: 50
problem: A backup file or provider setting does not show that you can recover the information your product needs.
when_to_use: Before a risky stored-data change, before relying on real user information, and when storage or recovery arrangements change.
expected_outputs:
  - Recovery requirements covering acceptable information loss and interruption.
  - An approved isolated target and storage-specific recovery procedure.
  - Observed recovery results, compatible app revision, elapsed time and remaining gaps.
related:
  - backend-architecture
  - change-stored-data-safely
  - designing-your-apps-data
  - directing-your-first-feature
  - launch-day-checklist
  - operating-a-small-app
  - operations-baseline
  - plan-data-retention-and-deletion
  - preparing-for-real-users
  - release-readiness
  - respond-to-an-outage
  - rollback-vs-restore
  - where-your-app-runs
  - where-your-data-lives
related_principles:
  - failure-modes
tags:
  - data
  - reliability
  - operations

---

# Rehearse Backup and Recovery

A useful backup lets you recover something you need. Practice the recovery while mistakes are cheap: use made-up records and a separate destination, then inspect what came back through the application that must use it.

## What a backup does and does not give back

Consider an invented example before any mechanics. An event organiser keeps a list of registrations for a day of workshops. Three things happen one morning:

- **09:00** — the list is backed up. It holds two registrations.
- **09:20** — a third person registers.
- **09:30** — an accidental change empties the session choice on the first registration.

The organiser wants the first person's session choice back without losing the 09:20 signup. Here is what each copy holds:

| Registration    | 09:00 backup           | Working list at 09:30 | Backup restored to a test copy |
| --------------- | ---------------------- | --------------------- | ------------------------------ |
| Test attendee A | Morning workshop       | _(session empty)_     | Morning workshop               |
| Test attendee B | Afternoon workshop     | Afternoon workshop    | Afternoon workshop             |
| Test attendee C | _(not yet registered)_ | Afternoon workshop    | _(absent)_                     |

Restoring the 09:00 backup into a separate test destination recovers the first two registrations with their original choices. It does not contain the third registration, because that signup happened after the backup. Counting two recovered rows is not enough: check the labels and the session choices too. A row with an empty session choice is not a complete recovery.

The backup has helped, but overwriting the working list with it would discard the newer signup. Preserve both copies and investigate how to recover the damaged information while retaining newer work; the right method depends on the actual storage system. And the business decision comes first: how much recent work could the organiser accept losing, and how long could registration be unavailable?

For your product, the equivalent might be bookings, orders, customer messages or uploaded files. Keep the recovery source separate, restore into an isolated destination and try the important task through the compatible application. Opening a data file successfully does not show the app can use it. If your app does not exist yet, or does not yet store anything that matters, the optional file rehearsal below demonstrates the older-backup/newer-record distinction; it cannot qualify a real recovery arrangement, and the steps that need a real app remain "not run" until you have one.

Read [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) first. Use [Where Your Data Lives](contextqb://guides/where-your-data-lives) and your [data map](contextqb://guides/designing-your-apps-data) to locate the information. This procedure applies to a local file as well as a hosted database; the exact commands depend on the storage system.

## Step 1 — Define what recovery must achieve

Name the records and files needed for the critical user task, the application version that reads them, and the settings needed to connect it. Keep actual passwords and keys out of the recovery notes. Verify that the responsible person can obtain the necessary access through its protected channel.

Decide how much recent work you could accept losing and how long the task could be unavailable. These are business decisions. The organiser might accept losing a few minutes of signups if people can be asked to register again, but not a morning's worth. A team relying on today's work may accept far less.

List dependencies such as uploaded files or encryption keys. A database backup without the files it references can leave an incomplete product. Include applicable deletion rules from [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion).

## Step 2 — Agree the method and isolated destination

Ask the agent to read the current documentation for the actual storage system and propose exact steps, access, expected time, verification and cleanup. For example, PostgreSQL documents several [backup approaches](https://www.postgresql.org/docs/18/backup.html) with different requirements. A casual copy of a running database's files is not interchangeable with a supported database backup.

An **isolated destination** is separate storage that this rehearsal can change without replacing the working application or contacting real users. Confirm its path or service identity before execution. Disable outgoing emails, payments and other consequential integrations in the recovered test copy; verify that its settings point to test resources.

Where you get a recovery source depends on where the app keeps its data. A registration list like the organiser's could be kept in any of the following ways. They are alternatives, not stages of one build: use the one that matches your app.

- **Data kept only in the browser.** Some web apps store records in the browser's own storage on one device. Clearing that browser's data or losing the device loses the records, so the recovery source must exist outside the browser, usually an export file the app produces. If the app has no export, that is a missing capability: ask the agent to plan export and import before relying on real records. Rehearse importing the export into an isolated browser profile or test target and compare the actual recovered values; a downloaded file alone does not show the app can recover from it.
- **Data kept in a single file.** Stop the app, or otherwise stop anything writing to the file, before making the copy, so the copy is not caught halfway through a save. The worked rehearsal below uses this case because a file is easy to inspect without running any app.
- **Data in a database.** Use its supported method for obtaining a consistent backup.

In every case, keep the recovery source separate from the damaged copy and protect it according to the information it contains.

Approve this bounded plan before running it. If the destination or recovery access is unclear, resolve that uncertainty first.

## Step 3 — Restore and verify the useful result

Record when the backup represents the data, when recovery starts and when verification finishes. Restore into the agreed destination. Inspect the important values and relationships, then use the compatible app against the restored copy to complete the intended task.

Count records, but also check their content. Two records with empty session choices are not equivalent to two intact registrations. Verify that the application reads the recovery destination rather than silently reading the untouched original. Record failures and missing dependencies as well as successful steps.

## Worked rehearsal: a stopped local file

This optional exercise reproduces the organiser's morning with a small file of made-up registrations. It is not a backup of your application, and it does not need a working app. It shows what a successful file recovery proves, and what it does not.

`schemaVersion` labels the format of the whole file, so a later version of an app knows how to read it. Each item in `registrations` is one person's registration. `id` labels the record so the check can tell records apart; `attendeeLabel` is a made-up name standing in for the person; `session` is the workshop they chose. The starting file holds the two registrations that existed at 09:00:

```json
{
  "schemaVersion": 1,
  "registrations": [
    {
      "id": "reg-1",
      "attendeeLabel": "Test attendee A",
      "session": "Morning workshop"
    },
    {
      "id": "reg-2",
      "attendeeLabel": "Test attendee B",
      "session": "Afternoon workshop"
    }
  ]
}
```

Have the agent propose a script that performs these steps in a new disposable directory. Review the exact paths before authorizing it:

1. Write this fixture to `working/registrations.json`, then copy it to `backup/registrations-0900.json` while nothing writes to it.
2. Add a third registration only to the working copy: `reg-3`, `Test attendee C`, `Afternoon workshop`. It stands for the 09:20 signup.
3. Simulate the 09:30 damage only in the working copy by setting `reg-1`'s `session` to an empty string.
4. Copy the backup into a separate `recovered/registrations.json`. Keep the backup and the damaged working copy available for comparison.
5. Parse the recovered file and assert that `schemaVersion` is 1 and that it holds exactly `reg-1` (Test attendee A, Morning workshop) and `reg-2` (Test attendee B, Afternoon workshop), with those exact values. Show that `reg-3` is absent from it. Then show that the backup still matches the original fixture exactly, and that the working file still holds the empty session on `reg-1` and the `reg-3` signup.

The expected result is **two intact earlier registrations, with the later one missing**. That loss is the point of the exercise, not a fault in the script: a backup can only return what existed when it was taken. For the organiser, the missing `reg-3` is a real person who believes they are registered. Compare that gap with the loss you accepted in Step 1. If losing everything since the last backup is not acceptable, back up more often or protect newer changes another way.

A passing file check establishes only file recovery. With an actual app, also open the recovered data through its real interface and confirm the registrations appear and can be used. Mark that step "not run" until it happens. In this exercise there is no app, so it stays "not run".

To adapt the rehearsal to your own product, replace the two registrations with two made-up records of your own kind, such as two bookings. Keep the three separate copies, add one record after the backup, damage only the working copy, and check that the recovered copy contains the earlier records exactly and lacks the later one. Then point your app at the recovered copy in an isolated destination and complete its main task.

An illustrative no-go decision is: “We need every registration, but this backup omits the 09:20 signup. Do not overwrite the working list with it. Preserve both copies and investigate a supported way to restore Test attendee A's session while keeping the newer registration.”

## Step 4 — Keep the evidence and improve the plan

Write a short record in the project's notes. If the project has no place for this yet, create one short note where it keeps its documentation, for example `docs/recovery-rehearsal.md`. No new documentation structure is needed.

```text
Recovery source and time represented:
Isolated destination and app revision/settings:
Procedure actually run and observed results:
Important records checked; missing or newer information:
Elapsed recovery and verification time:
App interaction: passed / failed / not run
External effects disabled and deletion rules checked:
Decision, remaining gaps, owner and next rehearsal trigger:
```

Compare the observed result with the loss and interruption you agreed in Step 1. Rehearsing a tiny fixture does not establish the time needed for your full dataset. Repeat with a representative controlled dataset when the application is ready, under an appropriate data-handling plan.

Keep the record available to [Change Stored Data Safely](contextqb://playbooks/change-stored-data-safely) and the [Operations Baseline Audit](contextqb://audits/operations-baseline). [Failure Modes](contextqb://principles/failure-modes) explains why recovery deserves the same deliberate attention as the successful path.
