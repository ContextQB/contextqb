---
id: rollback-vs-restore
title: Rollback vs. Restore
summary: Returning to older code and recovering saved information solve different problems, and neither reverses every consequence of a change.
version: 0.2.0
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

Imagine an app that keeps a cook's recipes. After an update, something is wrong. Before saying “put it back,” distinguish the situation, because each needs different evidence and may need a different response. The three below are **alternative incidents**, each starting from the same working app; they are not stages of one update.

1. **The new screen shows no recipes, but the saved recipes are intact and unchanged.** The problem is in the display, not the data. Returning to the previous code may bring the recipes back on screen. First check that older code against a copy of today's data. This is a possible code rollback, not a reason to replace the recipes with an older backup, which could lose recipes saved since.
2. **The update erased the ingredient text from saved recipes.** The data itself is damaged, and old code cannot recreate text that is no longer stored. Investigate a recovery source, how old it is and which newer recipes it omits. Restore into a separate location first so you can inspect what would come back and what might be lost.
3. **The update converted each recipe's ingredient text into a list of separate ingredient records.** The data is intact but in a new format. The old code expects the former format, so returning only the code may leave it unable to read the recipes at all. A compatible version, a rehearsed data conversion or a forward repair needs investigation; “the previous version worked yesterday” is not enough. [Change Stored Data Safely](contextqb://playbooks/change-stored-data-safely) explains how to plan and check that kind of compatibility.

In each case the visible symptom started the same way: something looks wrong after an update. The symptom alone does not select the recovery action; what changed does.

An email already sent or a payment already made is another kind of consequence. Reverting code or restoring a database does not recall it. Any corrective action must follow that service's actual behavior and your authority to act.

Before accepting “we can roll back,” ask the agent what its proposed recovery replaces, what will remain changed and what evidence shows the resulting code and data work together. If the agent cannot answer, recovery is still an untested assumption.
