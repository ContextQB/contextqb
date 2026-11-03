---
id: check-a-user-journey-with-a-person
title: Check a User Journey With a Person
summary: Watch someone attempt a meaningful task, separate what happened from your explanation and choose one improvement supported by the observation.
version: 0.2.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 4
journey_rank: 30
problem: The builder and agent know how the interface is supposed to work, which can hide obstacles that a new user encounters immediately.
when_to_use: Once a bounded task can be tried in a safe test version, and again after changing an important interaction.
expected_outputs:
  - A clear task, suitable participant and agreed observation arrangements.
  - A record separating observed behavior, interpretation and unknowns.
  - One prioritized improvement and a plan to check it again.
related:
  - feature-planning
  - making-your-app-usable
  - monitoring-vs-product-analytics
  - plan-data-retention-and-deletion
  - review-feedback-and-plan-the-next-change
  - testing-agent-built-software
  - ui-architecture
tags:
  - ui
  - testing

---

# Check a User Journey With a Person

Watch someone try a task your app is meant to support. You are looking for the point where the interface stops helping them, not asking them to approve your idea. The agent can help prepare the task and organize your notes; it cannot supply a real person's attempt by imagining one.

Use [Making Your App Usable](contextqb://guides/making-your-app-usable) to prepare the interaction. The [GOV.UK guide to moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing) describes observing actual or likely users on relevant tasks without giving away the steps.

## Step 1 — Choose one meaningful task

State the person's goal in their terms. The examples on this page use one invented tool: a personal research notebook for Maya, a fictional founder who is talking to bakery owners to decide which problem her business should solve. Each entry keeps one source, such as a conversation, with her note about what it showed, so she can find that evidence when deciding. Imagine a test version of its first feature exists: save an entry and find it again after reopening. Nothing is built, and you do not need to build it.

For that notebook, the task could be: “You want to keep this source and your thought about it so you can find them later.” Supply a made-up source and note. A suitable participant would be someone who also gathers evidence from conversations, such as another founder doing customer interviews. Avoid “click Save, then reopen the page”: that teaches the route you need to observe.

Decide what would count as completion and which uncertainty matters. Can the person find where to start? Recognize a successful save? Recover from a blank note? Choose a task the test version can actually support and record its revision.

## Step 2 — Arrange an appropriate attempt

Ask someone who plausibly has this need, including relevant experience, devices and access needs. Make participation voluntary, explain what you will observe and agree whether you will take notes or record. Recording is a separate choice; brief written observations are often enough. Keep identifiers and recordings only under a deliberate [retention plan](contextqb://playbooks/plan-data-retention-and-deletion).

Use a test copy and made-up records. Check that the task cannot trigger real messages, charges or changes to someone else's information. If assistive technology is relevant, arrange a suitable setup with the participant instead of assuming a keyboard-only attempt represents every access need.

For a tool used only by you, a real self-use attempt is a useful first record. Disclose that you know the design and intended route. Another person's attempt gives different evidence about understandability; one person's success still does not represent everyone.

## Step 3 — Observe before explaining

Explain that the interface is being tested. Give the task, then let the person choose their actions. You can invite them to say what they expect or ask “What are you looking for?” Avoid naming the control they should use.

Record actions, pauses, errors, comments and the final outcome. If they become stuck or uncomfortable, stop or help as appropriate, and mark where assistance occurred. Assisted completion is useful information; record it as assisted.

Record accessibility checks as separate observations. Automated checks and a single user attempt answer different questions, as [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) explains.

## Step 4 — Separate evidence from interpretation

Use a short record like this. The filled entries below are **invented for teaching**, not findings from a participant:

```text
Target/task: test notebook; retain a source and a thought for later
Participant context: fictional first-time user of this interface
Observation: entered a title; left Note empty; pressed Save;
             read “Add a title and note”; asked what a note should contain
Assistance: explained that Note is their own thought about the source
Outcome: saved after assistance
Interpretation: “Note” may not explain the expected content
Other possibilities: task wording was unclear; participant expected optional notes
Proposed change: add “What do you want to remember about this source?”
Next check: repeat an equivalent task without that explanation
```

“They did not understand the app” is too broad. Keep the specific event separate from your explanation, so another reviewer can question the explanation. Preserve a participant's words accurately if you quote them; label summaries as summaries.

## Step 5 — Change one thing and check again

Prioritize obstacles that block the task, risk lost work or exclude intended users. Route the selected change through [feature planning](contextqb://playbooks/feature-planning). Retain the original observation and expected improvement.

Repeat an equivalent task after the change, noting that a returning participant has learned the earlier interface. Record whether the obstacle recurs and whether a new one appears. A small round can identify a useful problem; do not turn it into a numerical claim about all customers.

You should leave with an observed event, a reasoned improvement and a next check. Keep a generated scenario labelled as preparation until a person actually attempts the task.
