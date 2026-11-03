---
id: rehearse-backup-and-recovery
title: Rehearse Backup and Recovery
summary: Restore a controlled copy, inspect the recovered records and prove the intended application can use them before you depend on a backup.
version: 0.1.2
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

Read [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) first. Use [Where Your Data Lives](contextqb://guides/where-your-data-lives) and your [data map](contextqb://guides/designing-your-apps-data) to locate the information. This procedure applies to a local file as well as a hosted database; the exact commands depend on the storage system.

## Step 1 — Define what recovery must achieve

Name the records and files needed for the critical user task, the application version that reads them, and the settings needed to connect it. Keep actual passwords and keys out of the recovery notes. Verify that the responsible person can obtain the necessary access through its protected channel.

Decide how much recent work you could accept losing and how long the task could be unavailable. These are business decisions. A personal experiment may tolerate losing yesterday's practice notes; a team relying on today's work may not.

List dependencies such as uploaded files or encryption keys. A database backup without the files it references can leave an incomplete product. Include applicable deletion rules from [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion).

## Step 2 — Agree the method and isolated destination

Ask the agent to read the current documentation for the actual storage system and propose exact steps, access, expected time, verification and cleanup. For example, PostgreSQL documents several [backup approaches](https://www.postgresql.org/docs/18/backup.html) with different requirements. A casual copy of a running database's files is not interchangeable with a supported database backup.

An **isolated destination** is separate storage that this rehearsal can change without replacing the working application or contacting real users. Confirm its path or service identity before execution. Disable outgoing emails, payments and other consequential integrations in the recovered test copy; verify that its settings point to test resources.

For a browser-only notebook, first identify a supported export or other recovery source outside that browser storage. The UI example has no export yet: ask the agent to plan one before relying on real records. Rehearse importing the export into an isolated browser profile or test target and compare the actual recovered values; a downloaded file alone does not show the app can recover from it.

For a simple notebook file, stop writes before making the practice copy. For a database, use its supported method for obtaining a consistent backup. Keep the recovery source separate from the damaged copy and protect it according to the information it contains.

Approve this bounded plan before running it. If the destination or recovery access is unclear, resolve that uncertainty first.

## Step 3 — Restore and verify the useful result

Record when the backup represents the data, when recovery starts and when verification finishes. Restore into the agreed destination. Inspect the important values and relationships, then use the compatible app against the restored copy to complete the intended task.

Count records, but also check their content. Two records with empty notes are not equivalent to two intact notes. Verify that the application reads the recovery destination rather than silently reading the untouched original. Record failures and missing dependencies as well as successful steps.

## Worked rehearsal: a stopped local file

This is a synthetic practice fixture for the notebook. It is not a backup of a learner application. The two identifiers label records; `schemaVersion` labels the format of the file. The starting file contains:

```json
{
  "schemaVersion": 1,
  "notes": [
    { "id": "note-1", "title": "Interview notes", "note": "Ask how the team finds old decisions." },
    { "id": "note-2", "title": "Research questions", "note": "Which source helped most?" }
  ]
}
```

Have the agent propose a script that performs these steps in a new disposable directory. Review the paths before authorizing it:

1. Write this fixture to `working/notebook.json`, then copy it to `backup/notebook-v1.json` while nothing writes to it.
2. Add a third made-up record only to the working copy. That record represents work after the backup.
3. Simulate damage only in the working copy by removing `note-1`'s text.
4. Copy the backup into a separate `recovered/notebook.json`. Keep both the backup and damaged working copy available for comparison.
5. Parse the recovered file and assert that its version, two identifiers, titles and note values exactly match the original fixture. Show that the third record is absent and that the working file is still damaged.

The expected result is **two intact earlier records, with the later record missing**. That loss is part of the exercise. A successful file check establishes only file recovery; when you adapt it to your app, also reopen the recovered notebook through the real interface. Mark that step “not run” until it happens.

An illustrative no-go decision is: “We need every saved note, but this backup omits the third one. Do not overwrite the working data with it. Preserve both copies and investigate a supported way to recover the missing or newer information.”

## Step 4 — Keep the evidence and improve the plan

Use a short record in the existing project notes:

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
