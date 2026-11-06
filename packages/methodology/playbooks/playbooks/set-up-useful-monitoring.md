---
id: set-up-useful-monitoring
title: Set Up Useful Monitoring
summary: Connect one important failure to a trustworthy signal, a person who sees it and a useful response, then exercise that path safely.
version: 0.3.0
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

This page uses one invented example. A small shop's website imports stock quantities from its supplier every night. In this example the import is scheduled for 02:00, and staff check the displayed quantities at 08:00 to decide what they can offer that day. If the import fails or never runs, staff may promise items that are not in stock, or turn customers away for items that are. Nothing is built, and you do not need to build it.

The website stays online whether or not the import runs, so “the site responds” does not answer the question that matters. The useful starting condition is: “a complete stock update has not arrived before the 08:00 check.” Specify the result you need to notice, by when you need to notice it and what a responsible person can do. The 02:00 and 08:00 times belong to this shop; your own schedule and deadline come from your task, not from a universal interval.

Match the signal to the product. A local tool may show a clear error while preserving the draft and keep a reviewable operation log. A command-line tool can return a failure exit status, the signal other programs inspect to tell whether it succeeded. An unattended job needs evidence that it ran at all, as well as a record of failures when it runs.

## Step 2 — Select the smallest useful evidence

Ask the agent where the result becomes known and how to observe it. For the shop, record the time of the last **successful** import and the supplier file's own timestamp or version. An import that starts but fails, or stops halfway through the file, must not advance that success record; otherwise a half-finished update would look complete. A failed run can record its own event with time, release identifier, failure category and an identifier for following it through the system. Keep supplier credentials, customer information and unnecessary detail out.

Decide what the signal covers and misses. A check of one test record does not inspect every user's permissions or data. A successful periodic probe does not prove that no failures happened between its runs. Google SRE's [monitoring guidance](https://sre.google/workbook/monitoring/) emphasizes useful, timely observations; the right frequency and detail depend on your task.

Record the expected update interval and a way to recognize missing or stale observations. A job that never starts cannot report its own failure, so the shop needs a **separate** check that runs independently of the import: if the last successful update is older than expected by, say, 07:00, the import is overdue. If the process that reports failures stops, its absence should not quietly look like success. Apply [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion) to the resulting logs and events.

## Step 3 — Name the recipient and response

For each actionable condition, name where it appears, who reads it and the first action. Include enough context to distinguish the affected environment and task. “Error occurred” is less useful than “Test stock import overdue; last successful update was yesterday at 02:04. Check the import before relying on displayed quantities.” That message names the setup (test), the affected task, the evidence and the consequence for the reader. It does not need supplier credentials or customer information.

Choose when repeated events should be grouped and when escalation is necessary. **Escalation** means involving someone with the access or expertise needed to act. Avoid sending a notification for every harmless event, but do not suppress a repeated failure merely to quiet the channel. Record how a recovered condition will be recognized.

An attended local tool may need no separate notification service: its user sees the failed action and knows what to do. For unattended work, demonstrate delivery to the responsible person's chosen channel. Configuration alone is not receipt.

## Step 4 — Exercise failure, receipt and recovery

Have the agent propose a controlled failure in a disposable test target, its expected signal and how to restore the test setup. Agree the exact scope before running it. Use test recipients or an explicitly agreed test notification; do not alert real users or damage their information for an exercise.

For the shop's test setup, the proposed sequence is:

1. Run one import normally from a made-up supplier file and verify that the displayed quantities and the success record both update.
2. Make the next import fail in a controlled way, for example with a deliberately malformed supplier file. State whether that is a substitute or a real isolated failure.
3. Confirm that the success record did **not** advance, that the failure was detected, and that the agreed test recipient actually received the warning.
4. Restore the setup, run a fresh successful import and verify that the success record advances and the condition clears.
5. Separately, prevent one scheduled run from starting at all. Confirm that the independent overdue check notices it by its deadline and that the test recipient receives that warning too. Then restore the schedule and verify that the next successful run clears the overdue condition.

Steps 2–3 and step 5 test different failures: a job that runs and fails, and a job that never runs. Passing one does not show the other works.

Keep command output or manual observations tied to the revision and target. A simulated storage error checks reaction to that simulation; a real storage connection needs its own check. Sending a sample message straight to the recipient checks delivery but skips detection; for the shop, it would say nothing about whether a failed or missing import is noticed. Record those differences.

For your own app, choose a task that can fail while everything looks superficially healthy. Name the evidence, who sees it and what they can do next.

## Step 5 — Keep a usable operating entry

Leave the signal, limits, recipient, first action, recovery condition and latest exercise evidence together in the existing operating record. If the project has no operating record yet, create one short note where it keeps its documentation, for example `docs/operations.md`; no new documentation structure is needed. Mark anything not executed as not run. Recheck after a material change to detection, delivery, ownership or the underlying task.

Use [Operations Baseline Audit](contextqb://audits/operations-baseline) to review the arrangement and [Respond to an Outage](contextqb://playbooks/respond-to-an-outage) when the signal indicates an ordinary service failure. You are ready to rely on the signal when you can follow an observed failure through to a person and an appropriate action, or explain precisely which link still needs work.
