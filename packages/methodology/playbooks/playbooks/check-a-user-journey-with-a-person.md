---
id: check-a-user-journey-with-a-person
title: Check a User Journey With a Person
summary: Watch someone attempt a meaningful task, separate what happened from your explanation and choose one improvement supported by the observation.
version: 0.3.0
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

State the person's goal in their terms. The examples on this page use one invented situation. A community hall has an online form for requesting a room. Submitting the form does not reserve the room: a coordinator reviews each request and replies before a group can rely on having it. If someone believes a request is a booking, they may tell their group the room is theirs when it is not. Imagine a test version of the form exists. You want to find out whether someone arranging a rehearsal understands that a request still needs approval. Nothing is built, and you do not need to build it.

For that form, the task could be: “You want the small room next Tuesday evening for your group's rehearsal. Use this test site to ask for it, then tell me what you think happens next.” Supply a made-up date and contact details. A suitable participant would be someone who actually arranges rooms for a group, such as a choir or club organiser. Avoid “fill in the form, press Request, then read the message”: that teaches the route you need to observe, and explaining the confirmation message in advance would hide the very misunderstanding you are looking for.

Decide what would count as completion and which uncertainty matters. Here, submitting the form is not enough. The question is whether the person ends with a correct understanding of what happens next. In your own app, other questions may matter: can the person find where to start, or recover from a mistake? Choose a task where the person's interpretation of success matters, make sure the test version can actually support it, and record its revision.

## Step 2 — Arrange an appropriate attempt

Ask someone who plausibly has this need, including relevant experience, devices and access needs. Make participation voluntary, explain what you will observe and agree whether you will take notes or record. Recording is a separate choice; brief written observations are often enough. Keep identifiers and recordings only under a deliberate [retention plan](contextqb://playbooks/plan-data-retention-and-deletion).

Use a test copy and made-up records. Check that the task cannot trigger real messages, charges or changes to someone else's information. In the room example, the test form must not send a request to the hall's real coordinator or hold a real room. If assistive technology is relevant, arrange a suitable setup with the participant instead of assuming a keyboard-only attempt represents every access need.

For a tool used only by you, a real self-use attempt is a useful first record. Disclose that you know the design and intended route. Another person's attempt gives different evidence about understandability; one person's success still does not represent everyone.

## Step 3 — Observe before explaining

Explain that the interface is being tested. Give the task, then let the person choose their actions. You can invite them to say what they expect or ask “What are you looking for?” Avoid naming the control they should use.

Record actions, pauses, errors, comments and the final outcome. If they become stuck or uncomfortable, stop or help as appropriate, and mark where assistance occurred. Assisted completion is useful information; record it as assisted.

Record accessibility checks as separate observations. Automated checks and a single user attempt answer different questions, as [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) explains.

## Step 4 — Separate evidence from interpretation

Use a short record like this. The filled entries below are **invented for teaching**, not findings from a participant:

```text
Target/task: test room-request form, revision recorded; request the small
             room next Tuesday evening, then say what happens next
Participant context: fictional rehearsal organiser, first time using this form
Observation: chose the small room and Tuesday evening; entered the made-up
             contact details; pressed Request; saw “Pending”; said,
             “Great, I'll tell the group we've got the room.”
Assistance: none
Outcome: request submitted; participant believed the room was reserved
Interpretation: the page did not make the coordinator's approval step clear
Other possibilities: task wording suggested booking; previous booking sites
                     confirmed instantly
Proposed change: “Request received. The room is not reserved yet;
                 the coordinator will reply.”
Next check: repeat an equivalent task with the new wording; record whether
            the participant describes the next step correctly and whether
            assistance was needed
```

The observable event is what the participant did and said. “They do not understand computers,” or “They did not understand the app,” is too broad and unsupported. The narrower interpretation points at one part of the page, and the other possibilities stay recorded because the task wording or the person's experience elsewhere could also have contributed. Keep the specific event separate from your explanation, so another reviewer can question the explanation. The value of the record is the connection from an observed misunderstanding to a specific change and another check. Preserve a participant's words accurately if you quote them; label summaries as summaries.

## Step 5 — Change one thing and check again

Prioritize obstacles that block the task, risk lost work or exclude intended users. Route the selected change through [feature planning](contextqb://playbooks/feature-planning). Retain the original observation and expected improvement.

Repeat an equivalent task after the change, noting that a returning participant has learned the earlier interface. Record whether the obstacle recurs and whether a new one appears. A small round can identify a useful problem; do not turn it into a numerical claim about all customers.

You should leave with an observed event, a reasoned improvement and a next check. Keep a generated scenario labelled as preparation until a person actually attempts the task.
