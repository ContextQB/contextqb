---
id: rollback-vs-restore
title: Rollback vs. Restore
summary: Returning to older code and recovering saved information solve different problems, and neither reverses every consequence of a change.
version: 0.1.2
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 4
journey_rank: 40
framing: What exactly comes back when an agent says it can undo a change?
related:
  - change-stored-data-safely
  - changing-software-without-losing-control
  - designing-your-apps-data
  - failure-modes
  - launch-day-checklist
  - refactor-planning
  - rehearse-backup-and-recovery
  - release-readiness
  - respond-to-an-outage
  - setting-up-git-and-github
  - update-a-dependency-safely
  - where-your-app-runs
tags:
  - data
  - reliability

---

# Rollback vs. Restore

You release a change and something breaks. “Go back” sounds like one action. First identify what changed: the application files, its settings, saved information, or an action outside the application.

## Three different responses

**Rollback** — return code or configuration to an earlier version. Configuration means the settings that tell the app how to run. A saved code revision can help recover application files; it does not usually include the database. [Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github) introduces those file snapshots. Ask what the proposed rollback actually replaces and whether that version can still read today's data.

**Restore** — recover stored information from a backup or another supported recovery source. A backup from yesterday may omit records saved today. Restoring it over the live data can remove those newer records from the application. Identify what would be lost before choosing this response.

**Forward repair** — correct the problem while keeping the current data and moving to a new working version. This can be safer than returning to an incompatible old version, but it still needs a plan and checks.

The data map in [Designing Your App's Data](contextqb://guides/designing-your-apps-data) helps separate those responsibilities. [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) owns the recovery procedure; this briefing helps you choose the question to ask first.

## Try the decision on three cases

These are illustrative notebook scenarios:

1. **A new layout hides saved notes.** The notes still exist and their format is unchanged. A code rollback may restore the old display. Verify the old version against a test copy of the current data before relying on that option.
2. **A change deletes the note text.** Returning to the old code cannot recreate the missing text. Investigate a recovery source, its age and the newer records at risk. Restore to an isolated copy first so you can inspect what is recoverable.
3. **The app replaces `note` with `body`.** Old code still expects a field called `note`. Rolling back only the code now leaves it unable to read the new format. Use a rehearsed compatibility plan or forward repair; [Change Stored Data Safely](contextqb://playbooks/change-stored-data-safely) develops this case.

An email already delivered or a payment already made is another kind of consequence. Reverting code or restoring a database does not recall it. Any corrective action must follow that service's actual behavior and your authority to act.

Before accepting “we can roll back,” explain what will return, what will remain changed and what evidence shows the restored combination will work. If the agent cannot answer, recovery is still an untested assumption.
