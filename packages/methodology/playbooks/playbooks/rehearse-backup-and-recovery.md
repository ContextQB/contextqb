---
id: rehearse-backup-and-recovery
title: Rehearse Backup and Recovery
summary: Restore a controlled copy, inspect the recovered records and prove the intended application can use them before you depend on a backup.
version: 0.2.0
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

## The work this rehearsal protects

The steps below apply to any product that stores information someone would be harmed to lose. To make them concrete, this playbook follows one invented person.

Maya is a fictional first-time founder deciding which problem to solve for small independent bakeries. After each conversation with a bakery owner, she saves an entry in a small personal research notebook: which conversation it was, and her own note about what she learned. After a month, those entries are the evidence she will use to choose what to build. She cannot repeat the conversations word for word. If the entries were lost, much of that evidence would be lost too. That is what a backup must let her recover. The notebook and its first feature are described in [Directing Your First Feature](contextqb://guides/directing-your-first-feature); you do not need to read that page or build the notebook to follow this one.

For your product, the equivalent might be bookings, orders, customer messages or uploaded files. If your app does not exist yet, or does not yet store anything that matters, you can still run the file rehearsal below as practice. The steps that need a real app remain "not run" until you have one.

Read [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) first. Use [Where Your Data Lives](contextqb://guides/where-your-data-lives) and your [data map](contextqb://guides/designing-your-apps-data) to locate the information. This procedure applies to a local file as well as a hosted database; the exact commands depend on the storage system.

## Step 1 — Define what recovery must achieve

Name the records and files needed for the critical user task, the application version that reads them, and the settings needed to connect it. Keep actual passwords and keys out of the recovery notes. Verify that the responsible person can obtain the necessary access through its protected channel.

Decide how much recent work you could accept losing and how long the task could be unavailable. These are business decisions. Maya might accept losing yesterday's entry if she can rewrite it from memory, but not a month of conversations. A team relying on today's work may accept far less.

List dependencies such as uploaded files or encryption keys. A database backup without the files it references can leave an incomplete product. Include applicable deletion rules from [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion).

## Step 2 — Agree the method and isolated destination

Ask the agent to read the current documentation for the actual storage system and propose exact steps, access, expected time, verification and cleanup. For example, PostgreSQL documents several [backup approaches](https://www.postgresql.org/docs/18/backup.html) with different requirements. A casual copy of a running database's files is not interchangeable with a supported database backup.

An **isolated destination** is separate storage that this rehearsal can change without replacing the working application or contacting real users. Confirm its path or service identity before execution. Disable outgoing emails, payments and other consequential integrations in the recovered test copy; verify that its settings point to test resources.

Where you get a recovery source depends on where the app keeps its data. The same small notebook could be built in any of the following ways. They are alternatives, not stages of one build: use the one that matches your app.

- **Data kept only in the browser.** Some web apps store records in the browser's own storage on one device. Clearing that browser's data or losing the device loses the records, so the recovery source must exist outside the browser, usually an export file the app produces. If the app has no export, that is a missing capability: ask the agent to plan export and import before relying on real records. Rehearse importing the export into an isolated browser profile or test target and compare the actual recovered values; a downloaded file alone does not show the app can recover from it.
- **Data kept in a single file.** Stop the app, or otherwise stop anything writing to the file, before making the copy, so the copy is not caught halfway through a save. The worked rehearsal below uses this case because a file is easy to inspect without running any app.
- **Data in a database.** Use its supported method for obtaining a consistent backup.

In every case, keep the recovery source separate from the damaged copy and protect it according to the information it contains.

Approve this bounded plan before running it. If the destination or recovery access is unclear, resolve that uncertainty first.

## Step 3 — Restore and verify the useful result

Record when the backup represents the data, when recovery starts and when verification finishes. Restore into the agreed destination. Inspect the important values and relationships, then use the compatible app against the restored copy to complete the intended task.

Count records, but also check their content. Two records with empty notes are not equivalent to two intact notes. Verify that the application reads the recovery destination rather than silently reading the untouched original. Record failures and missing dependencies as well as successful steps.

## Worked rehearsal: a stopped local file

This optional exercise uses the single-file version of Maya's notebook. The records are made up: it is not a backup of your application, and it does not need a working app. It shows what a successful file recovery proves, and what it does not.

Each item in `notes` is one record: one source plus Maya's note about it. `title` identifies the source (which conversation or article) and `note` holds what she learned from it. `id` labels each record so the check can tell them apart. `schemaVersion` labels the format of the whole file, so a later version of the app knows how to read it. The starting file holds two earlier entries:

```json
{
  "schemaVersion": 1,
  "notes": [
    {
      "id": "note-1",
      "title": "Bakery owner call, March 4",
      "note": "Re-types weekend orders into her stock spreadsheet every Sunday night."
    },
    {
      "id": "note-2",
      "title": "Bakery owners' forum thread on leftovers",
      "note": "Several owners guess tomorrow's quantities and throw away the surplus."
    }
  ]
}
```

Have the agent propose a script that performs these steps in a new disposable directory. Review the exact paths before authorizing it:

1. Write this fixture to `working/notebook.json`, then copy it to `backup/notebook-v1.json` while nothing writes to it.
2. Add a third made-up record only to the working copy. It stands for a conversation Maya saved after the backup was taken.
3. Simulate damage only in the working copy by removing `note-1`'s text.
4. Copy the backup into a separate `recovered/notebook.json`. Keep both the backup and damaged working copy available for comparison.
5. Parse the recovered file and assert that its version, two identifiers, titles and note values exactly match the original fixture. Show that the third record is absent and that the working file is still damaged.

The expected result is **two intact earlier records, with the later record missing**. That loss is the point of the exercise, not a fault in the script: a backup can only return what existed when it was taken. For Maya, the missing third record is a real conversation whose evidence she would now have to rebuild from memory. Compare that gap with the loss you accepted in Step 1. If losing everything since the last backup is not acceptable, back up more often or protect newer changes another way.

A passing file check establishes only file recovery. With an actual app, also open the recovered data through its real interface and confirm the entries appear and can be used. Mark that step "not run" until it happens. In this exercise there is no app, so it stays "not run".

To adapt the rehearsal to your own product, replace the two entries with two made-up records of your own kind, such as two bookings. Keep the three separate copies, add one record after the backup, damage only the working copy, and check that the recovered copy contains the earlier records and lacks the later one. Then point your app at the recovered copy in an isolated destination and complete its main task.

An illustrative no-go decision is: “We need every saved entry, but this backup omits the third one. Do not overwrite the working data with it. Preserve both copies and investigate a supported way to recover the missing or newer information.”

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
