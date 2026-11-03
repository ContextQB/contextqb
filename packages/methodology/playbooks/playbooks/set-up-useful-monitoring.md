---
id: set-up-useful-monitoring
title: Set Up Useful Monitoring
summary: Connect one important failure to a trustworthy signal, a person who sees it and a useful response, then exercise that path safely.
version: 0.2.0
audience: [novice-builder, founder, operator, agent]
journey_stage: 7
journey_rank: 30
problem: A dashboard can look reassuring while the task users need is failing, or while the measurement itself has stopped.
when_to_use: Before inviting people to rely on a task, and when its implementation, dependencies or failure signals change.
expected_outputs:
  - One critical-task signal with scope, owner, response and privacy limits.
  - An agreed test target and failure/recovery exercise.
  - Observed evidence through the reporting path, with untested links marked explicitly.
related:
  - connecting-services-reliably
  - launch-day-checklist
  - launching-for-your-first-users
  - monitoring-vs-product-analytics
  - operating-a-small-app
  - operations-baseline
  - plan-data-retention-and-deletion
  - preparing-for-real-users
  - release-readiness
  - respond-to-an-outage
  - where-your-app-runs
related_principles:
  - failure-modes
tags: [monitoring, operations, reliability]

---

# Set Up Useful Monitoring

Choose a failure you need to know about, then show how that information reaches someone who can act. The agent can implement a signal and its delivery. You decide what matters, who responds and which evidence will establish that the path works.

Read [Monitoring vs. Product Analytics](contextqb://briefings/monitoring-vs-product-analytics) first and identify the target using [Where Your App Runs](contextqb://guides/where-your-app-runs). Use the failure decisions from [Failure Modes](contextqb://principles/failure-modes).

## Step 1 — Start with the failed task

This page uses one invented example. Maya, a fictional first-time founder, keeps a personal research notebook on her own computer: each entry holds one source, such as a conversation with a bakery owner, with her note about what it showed. Its critical job is saving an entry so that the evidence is there when she decides what business to build. She cannot repeat a conversation, so a save that fails without her noticing loses evidence. Nothing is built, and you do not need to build it.

For the notebook, then, “a person cannot save a note” is a useful starting condition. A server being reachable does not show that writing succeeds. Specify the result you need to notice, how quickly you need to notice it and what a responsible person can do.

Match the signal to the product. A local tool may show a clear error while preserving the draft and keep a reviewable operation log. A command-line tool can return a failure exit status, the signal other programs inspect to tell whether it succeeded. An unattended job needs evidence that it ran at all, as well as a record of failures when it runs.

## Step 2 — Select the smallest useful evidence

Ask the agent where the result becomes known and how to observe it. A failed-save event might include time, release identifier, operation, failure category and a request identifier for following the event through the system. Keep credentials, note text and unnecessary personal information out.

Decide what the signal covers and misses. A check of one test record does not inspect every user's permissions or data. A successful periodic probe does not prove that no failures happened between its runs. Google SRE's [monitoring guidance](https://sre.google/workbook/monitoring/) emphasizes useful, timely observations; the right frequency and detail depend on your task.

Record the expected update interval and a way to recognize missing or stale observations. If the process that reports failures stops, its absence should not quietly look like success. Apply [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion) to the resulting logs and events.

## Step 3 — Name the recipient and response

For each actionable condition, name where it appears, who reads it and the first action. Include enough context to distinguish the affected environment and task. “Error occurred” is less useful than “Test notebook save failed on notebook-candidate-1; inspect the write-permission result.” Here `notebook-candidate-1` is an illustrative label for the version under test, so the reader knows which build failed and in which setup.

Choose when repeated events should be grouped and when escalation is necessary. **Escalation** means involving someone with the access or expertise needed to act. Avoid sending a notification for every harmless event, but do not suppress a repeated failure merely to quiet the channel. Record how a recovered condition will be recognized.

An attended local tool may need no separate notification service: its user sees the failed action and knows what to do. For unattended work, demonstrate delivery to the responsible person's chosen channel. Configuration alone is not receipt.

## Step 4 — Exercise failure, receipt and recovery

Have the agent propose a controlled failure in a disposable test target, its expected signal and how to restore the test setup. Agree the exact scope before running it. Use test recipients or an explicitly agreed test notification; do not alert real users or damage their information for an exercise.

For a notebook test, the proposed sequence is:

1. Save a made-up note normally and verify it can be read back.
2. Make the test storage write return a controlled failure. State whether it is a substitute or a real isolated storage restriction.
3. Try another save. Observe the retained draft, honest error and recorded failure. For an unattended target, confirm the intended recipient actually receives the notification.
4. Restore the test setup, retry and verify the stored value and recovery signal.
5. Separately test missing observations: stop only the disposable reporting component and show how an overdue check becomes visible, if the product relies on unattended reporting.

Keep command output or manual observations tied to the revision and target. A simulated storage error checks reaction to that simulation; a real storage connection needs its own check. A test event sent directly to the notifier checks delivery but bypasses detection. Record those differences.

## Step 5 — Keep a usable operating entry

Leave the signal, limits, recipient, first action, recovery condition and latest exercise evidence together in the existing operating record. If the project has no operating record yet, create one short note where it keeps its documentation, for example `docs/operations.md`; no new documentation structure is needed. Mark anything not executed as not run. Recheck after a material change to detection, delivery, ownership or the underlying task.

Use [Operations Baseline Audit](contextqb://audits/operations-baseline) to review the arrangement and [Respond to an Outage](contextqb://playbooks/respond-to-an-outage) when the signal indicates an ordinary service failure. You are ready to rely on the signal when you can follow an observed failure through to a person and an appropriate action, or explain precisely which link still needs work.
