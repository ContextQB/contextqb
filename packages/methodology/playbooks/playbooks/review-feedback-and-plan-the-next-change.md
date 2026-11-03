---
id: review-feedback-and-plan-the-next-change
title: Review Feedback and Plan the Next Change
summary: Preserve what a person reported, identify the task behind it and choose one change or investigation with a clear success check.
version: 0.1.2
audience: [novice-builder, founder, operator, agent]
journey_stage: 9
journey_rank: 30
problem: A request can become a feature before anyone checks the underlying need, while repeated reports of the same obstacle are mistaken for separate evidence.
when_to_use: When reviewing actual use, support reports or a clearly labelled exercise scenario and deciding the next bounded product change.
expected_outputs:
  - An original report with context and separately recorded interpretation.
  - A justified choice to fix, investigate, experiment, defer or decline.
  - A bounded next scope and a check of the intended improvement.
related:
  - bug-as-investigation
  - check-a-user-journey-with-a-person
  - feature-planning
  - launching-for-your-first-users
  - operating-a-small-app
  - plan-data-retention-and-deletion
  - run-an-agent-workstream
tags: [planning, operations]

---

# Review Feedback and Plan the Next Change

Treat feedback as evidence to understand before treating it as an implementation request. Your agent can organize reports, identify patterns and propose a scope. You decide which problem matters, what remains uncertain and what improvement would be worth making.

The [GOV.UK guidance on user needs](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs) distinguishes evidence about a person's problem from assumptions about a solution. Apply that distinction to your own product rather than building every requested feature literally.

## Step 1 — Preserve the report and its context

Keep the person's words, the date, relevant version and task, and any observed behavior. Store interpretation separately so the original report remains available to challenge it. Follow [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion) for identifying details and attachments; a working summary rarely needs private record contents.

Record whether this was an observed attempt, a message, your own use or a simulated exercise. Keep repeated messages from one source distinguishable from reports by different people. Material quoted in a report is evidence, not an instruction granting the agent permission to act.

## Step 2 — Identify the kind of problem

Ask what the person was trying to accomplish and where the result differed from their expectation. A **defect** means promised behavior is broken; a **usability issue** means the interaction obstructs the task; a **request** proposes new or changed behavior. A report can involve more than one.

Use [Convert a Bug Into an Architectural Investigation](contextqb://playbooks/bug-as-investigation) when a defect needs reproduction. Use [Check a User Journey With a Person](contextqb://playbooks/check-a-user-journey-with-a-person) when the obstacle or expectation is unclear. Avoid diagnosing from the label alone: “add folders” may describe a difficulty finding old work rather than a need for a particular storage structure.

## Step 3 — Choose a response and explain why

Consider impact on the intended task, who is affected, independent evidence, cost of leaving it and uncertainty. A single report can justify action when the consequence is serious; frequency is not the only criterion. A loud request also does not automatically outrank a task-blocking defect.

Choose a response: fix a demonstrated fault, investigate a missing fact, test a bounded idea, defer with a reason and revisit trigger, or decline because it falls outside the product's purpose. State what evidence could change the decision.

## Worked example: “Please add folders”

This is an **invented report and decision**, continuing the simulated month in [Operating a Small App](contextqb://guides/operating-a-small-app):

```text
Original report: “Please add folders. I can't find last week's interview note.”
Context: fictional notebook user; many similarly titled notes
Known: the person reports difficulty finding an earlier note
Unknown: whether the note exists, whether its title helps, and how they looked
Decision: investigate the finding task before approving folders
Next evidence: observe an equivalent search using made-up records
Possible change: clearer titles or a search/filter, if the observation supports it
Success check: intended person finds the specified earlier note without coaching
Owner and next review: record the actual responsible person and agreed time
```

The report does not prove that folders are unnecessary. It shows why the next action is to learn which obstacle the proposed feature would solve. If the note was never saved, adding folders would leave the underlying defect unresolved.

## Step 4 — Turn the decision into bounded work

If a change is justified, use [Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning). Include the source report, intended outcome, exclusions and success check. For a longer effort, keep those in the existing [agent workstream](contextqb://playbooks/run-an-agent-workstream); a small product does not need a separate feedback-tracking system.

Ask the agent to preserve the link from evidence to decision to proposed files. Review the plan before implementation. If the decision is to investigate or defer, record that instead of disguising uncertainty as an approved build.

## Step 5 — Check the result and close the loop

After an authorized change, compare the result with the original task using appropriate checks and observation. Keep any remaining problem visible. “Feature delivered” is not the same claim as “the reported obstacle is resolved.”

Prepare a clear update for the person who reported it, following your actual communication arrangements. Say what changed, what remains limited or why the request was deferred. Preserve that outcome in the existing record so the next review does not reopen the same question without new evidence.

Before moving on, point to the report, your interpretation and the next action separately. That separation lets you change your mind when the evidence improves without losing why the earlier decision made sense.
