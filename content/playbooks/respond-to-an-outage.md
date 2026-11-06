---
id: respond-to-an-outage
title: Respond to an Outage
summary: Establish what is failing, limit the impact under the right authority and verify the useful task has recovered before closing the incident.
version: 0.3.0
audience: [novice-builder, founder, operator, agent]
journey_stage: 9
journey_rank: 20
problem: During a failure, uncoordinated changes and an untested rollback can compound the loss and obscure what actually happened.
when_to_use: When an ordinary availability or correctness failure prevents the intended task, or when rehearsing that response on paper or in a controlled test target.
expected_outputs:
  - A short incident record with impact, timeline, owner and evidence.
  - A bounded mitigation decision and authority for any action.
  - Verified recovery of the affected task and a follow-up learning note.
related:
  - bug-as-investigation
  - launch-day-checklist
  - launching-for-your-first-users
  - operating-a-small-app
  - operations-baseline
  - rehearse-backup-and-recovery
  - respond-to-a-suspected-compromise
  - rollback-vs-restore
  - set-up-useful-monitoring
related_principles:
  - failure-modes
tags: [operations, reliability]

---

# Respond to an Outage

An outage means people cannot complete an important task, even if part of the application still loads. Your first job is to establish the impact and choose a controlled response. The agent can gather evidence and propose actions; a named owner coordinates changes and decides what is authorized.

Prepare with [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring), [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) and the recovery record from [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery). If evidence suggests unauthorized access or malicious changes, use [Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise), which owns that response.

## Step 1 — Record what is affected

Open a short incident note. Record the time and time zone, affected task and target, known affected users, current release and observed symptoms. Distinguish facts from hypotheses. “Events are not displayed” is an observation; “the database was deleted” needs evidence.

Name one coordinator, even if that is you. Pause unrelated work and automatic changes within your authority. Give investigating agents bounded read-only tasks first, and make sure their findings land in the same record. Keep credentials and private record contents out.

## Step 2 — Find the relevant recent change

Check the last known successful task, recent deployments, configuration/data changes and applicable provider status. Read errors and current configuration using the existing operating instructions. A provider's healthy status page does not prove your account or connection works; an incident there does not prove it caused your particular failure.

Choose the smallest safe observation that distinguishes likely causes. Preserve logs and relevant state before changing things. Use a test copy when reproduction could damage data or cause external effects. A complex diagnosis can continue later through [Convert a Bug Into an Architectural Investigation](contextqb://playbooks/bug-as-investigation).

## Step 3 — Choose a mitigation with known consequences

A **mitigation** reduces the impact while the underlying cause is investigated. It might pause a failing feature, temporarily restrict writes, use a supported alternate path or return to a compatible version. Google SRE's [incident-response chapter](https://sre.google/workbook/incident-response/) distinguishes reducing immediate impact from establishing the root cause and preventing recurrence.

Compare the proposed action with the recovery plan. What changes, what remains, what could be lost and which combinations were rehearsed? Returning code cannot recover deleted data. Restoring an old backup can remove newer work. If compatibility or consequences are unknown, preserve the current state and seek the needed expertise rather than describe recovery as guaranteed.

Identify who may authorize the actual action. Follow the project's standing incident authority where it exists; otherwise obtain the owner's decision on the concrete target and effect. An investigation instruction is not permission to make unrelated production changes. Record the action and result, including failure or partial completion.

## Step 4 — Communicate and verify recovery

Use the agreed support or status route to tell affected people what is known: the task affected, any useful workaround and when they can expect another update. Avoid claiming a cause or recovery time you have not established. Sending a message remains an action for the responsible person or an explicitly authorized tool.

After mitigation, repeat the affected task against the actual target using appropriate controlled data. Check both the interface and the saved result. Confirm that the failure signal clears for the right reason and that new observations are arriving; an empty dashboard may indicate broken reporting.

Record restored behavior, remaining restrictions and the watch needed before closing the incident. A restart or successful command is an action result, not proof that the user's task recovered.

## Worked tabletop: “No events,” intact records

This is a **fictional exercise**. A **tabletop** means talking through supplied facts and decisions on paper; no system is touched. Reading it does not instruct or authorize a rollback of any real system.

A community hall's website has an events page that visitors use to find out what is on. After a release, the page suddenly shows “No events.” The hall has several events planned, including one a staff member added this morning. Visitors who check the page will think nothing is happening. Read each supplied fact before choosing an action:

1. At 09:10 local time (record the zone), the hall's coordinator, who owns the website, sees “No events” on the newly released version. They pause further releases and record the release identifier.
2. Read-only inspection finds all the event records intact, including this morning's addition. Their stored format has not changed.
3. In an isolated copy, the previous application version displays those records correctly, including this morning's event. Returning to that version has already been rehearsed. Compatible code here means a version that reads the current records correctly, and this fact establishes it.
4. The latest data backup was taken yesterday. It does not contain this morning's new event.

These facts point to the released code as the failure, not the data. Restoring yesterday's backup over today's records would lose this morning's event and would not address the demonstrated display problem, so the coordinator rejects that action and preserves the records and evidence. Under the exercise's assumed authority, the coordinator chooses the rehearsed return to the previous version. In a real incident, that action still needs its own authorization and execution record.

The recovery check must inspect the actual returned version: can a visitor see the expected events, including this morning's addition? Do the relevant monitoring signals show fresh results? A check that new events can still be saved is separate from that read check. It must not leave misleading fake events on the public calendar: use an event the hall genuinely intends to publish, or verify writing against a copy first and carry the real write check as pending. Until those observations exist, the incident is not verified recovered.

If fact 2 had instead shown that the release converted the records into a format the previous version cannot read, the rollback decision would change. Explain why before asking the agent for a response plan.

For your own incident, first establish whether the information is missing or the app is failing to show it. Stop unrelated changes, separate facts from guesses and choose a recovery action supported by the evidence. The word “outage” does not tell you which layer to replace.

## Step 5 — Leave one useful improvement

Write a short learning note: impact, detection, timeline, mitigation, cause if established, and what remains uncertain. Choose a specific prevention or detection improvement with an owner and success check. Avoid turning an incident into a general rewrite without evidence.

Carry the decision into [Operating a Small App](contextqb://guides/operating-a-small-app). You have finished the response when the task's recovery is observed, remaining limits are explicit and the next action has an owner.
