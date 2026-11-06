---
id: test-an-integration-failure
title: Test an Integration Failure
summary: Exercise missing, malformed, repeated and late integration results on an isolated target, then inspect saved state, outside effects and what the user sees.
version: 0.3.0
audience: [novice-builder, founder, operator, agent]
journey_stage: 4
journey_rank: 80
problem: An integration can appear successful in an ordinary demo while retries duplicate actions or partial failures leave the user with a false success message.
when_to_use: Before relying on a service connection, and after changing its request, event, retry or recovery behavior.
expected_outputs:
  - A bounded failure matrix tied to the integration contract and a safe target.
  - Evidence for stored state, effect count and visible outcome for each exercised case.
  - A decision separating simulated behavior from provider and application evidence still needed.
related:
  - backend-architecture
  - connecting-services-reliably
  - feature-build-loop
  - how-to-use-contextqb
  - review-an-agent-workstream
  - testing-agent-built-software
  - turn-a-feature-brief-into-checks
related_principles:
  - failure-modes
tags: [reliability, testing]

---

# Test an Integration Failure

You want evidence for the moment when one system finishes and another loses the answer. Choose a small action, define the expected result first and make the failure repeatable. A test that only receives a successful response cannot tell you whether a retry will duplicate the action.

Start with the contract from [Connecting Services Reliably](contextqb://guides/connecting-services-reliably) and the method in [Turn a Feature Brief Into Checks](contextqb://playbooks/turn-a-feature-brief-into-checks). If your project has no integration, continue along its relevant path; do not add a service just to do this exercise.

## The worked example

The steps use one invented situation. A community group manages its workshops in its own app and publishes the dates through an outside calendar service that members subscribe to. When an organiser presses “Add to calendar” for a workshop, the app asks the calendar service to create one event. You want to know whether a lost reply will lead the app to put the same workshop on the calendar twice. A successful response tells you nothing about that, because the danger only appears when the result is uncertain.

Success means the app ends up with exactly one calendar event for that workshop and saves the event's `eventId` beside the workshop. The workshop stays saved in the group's app whatever the calendar does. The calendar service is fictional, and nothing needs to be built to read this page; in the exercise, a local stand-in plays the calendar.

The stand-in follows this exercise contract. It is the same contract used in [Connecting Services Reliably](contextqb://guides/connecting-services-reliably), which explains the reasoning behind each rule and holds the canonical copy. It is repeated here in full because the cases below rely on every rule in it. These are the stand-in's rules, not promises about any actual calendar provider.

```text
Exercise contract: publish one workshop to the calendar stand-in.
Assumed for this exercise only; not any real calendar provider's guarantee.

Task: create one calendar event for one saved workshop.
Input: operationId, workshopId, title, start (with time zone offset),
  durationMinutes.
Local owner: the workshop app keeps the workshop and the operation record.
  The workshop stays saved whatever the calendar does.
Outside effect: one calendar event per operationId with unchanged input.
Same operationId, identical input: returns the same eventId; no second
  event. Simultaneous repeats are treated as repeats.
Same operationId, different input: rejected; the first event is unchanged.
Outcome lookup by operationId: returns the eventId, or "not found".
Retention: an operationId is remembered for 24 hours. After that, a repeat
  is treated as new and lookup cannot answer.
Errors: rejected credentials must not be retried unchanged. A rate limit
  gives a wait time, which counts against the attempt limit below.
Notifications: notificationId, eventId, revision (an integer; higher means
  later) and status (tentative or confirmed). Signatures are checked
  separately; a revision proves nothing about the sender.
Success evidence: an eventId saved beside the workshop, not just a reply.
Timeout: outcome unknown. Look it up, or retry with the same operationId
  and identical input.
Limit: at most 3 attempts within 2 minutes; then Needs attention.
Local display: Publishing, On calendar, Calendar update not confirmed,
  Needs attention.
New action: a new operationId only after the earlier outcome is resolved
  and a separate event is deliberately wanted.
```

## Step 1 — Choose an isolated target

Name the operation, application revision, test data and exact boundary to replace. A **fixture** is a controlled input; a **test double** is a substitute for a real dependency. [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) explains what these can and cannot establish.

Begin with a local stand-in that cannot contact the real provider. Use fictional data, no production credentials and no actual email, message, payment or customer account. Ask the agent to identify how network calls are prevented, not merely say “test mode.” An environment variable with that name does not prove isolation.

Use the real application's connector and decision logic against the double when testing an existing integration. A separate miniature model can explain the idea, but it does not prove that the application is wired that way. Record which one you are exercising.

## Step 2 — Define the observations before the failure

For each case, record the starting state, injected result, expected local state, expected outside-effect count and expected user message. Count actual effects recorded by the stand-in, not merely requests: a timeout can happen after the effect. Specify the allowed attempts and which cases must stop immediately.

For the calendar example, each case starts from this single request. It describes one intended calendar addition:

```json
{
  "operationId": "cal-op-1",
  "workshopId": "workshop-12",
  "title": "Pottery  for beginners",
  "start": "2026-11-21T10:00:00+00:00",
  "durationMinutes": 120
}
```

- **`operationId`** names one intended action: the organiser choosing, once, to add this workshop to the calendar. Every retry of that same action reuses this ID with exactly the same input, so the stand-in can recognize a repeat instead of creating another event. A new, separate decision to add an event would get a new ID.
- **`workshopId`** identifies which saved workshop is being published.
- **`start`** is the start date and time. The `+00:00` at the end is the time zone offset: 10:00 at UTC+0, which is London time in November. Without an offset, the same text could mean a different moment on a computer set to another time zone.
- **`durationMinutes`** is the session length, here two hours.
- **The title deliberately contains two spaces** between “Pottery” and “for”. If any step trims or collapses spacing, the stand-in sees different input under the same `operationId` and rejects it, so the comparison catches unwanted text changes as well as missing or duplicate events.

The stand-in keeps its record across simulated restarts of the app, and it runs on a simulated clock so the 24-hour retention can be tested without waiting. It can create the event and then withhold the response. Its notification fixtures carry the fields listed in the contract. State the contract's assumptions in the report, because a real calendar service needs its own verification.

## Step 3 — Exercise the cases that could break the promise

Ask the agent to use a fresh isolated starting state for each case, except where the sequence itself is under test. The contract's limit applies throughout: at most three attempts within two minutes, with increasing waits between them. Those are exercise settings, not recommended provider defaults. Check these cases:

- **Malformed response.** Return a success reply with no `eventId`. The app must not show “On calendar.” Keep the workshop saved and show an actionable unresolved state; use the lookup to see whether an event was created before deciding to retry.
- **Timeout before creation.** The stand-in creates no event and withholds the reply. Retry only under the contract, with the same `operationId` and input, or look up the outcome first. Stop at the attempt and time limit with “Needs attention” if no result can be confirmed.
- **Timeout after creation.** The stand-in creates one event, then withholds the reply. Retrying the same operation must return the same `eventId`, and the stand-in must still hold exactly one event. Generating a new ID should make the deliberately faulty version fail this check.
- **Expired access.** Simulate rejected credentials. Show that reconnection or the organiser's attention is needed, without disclosing the secret. Stop rather than retry unchanged rejected credentials; a supported renewal or reconnection needs its own bounded handling.
- **Rate limit.** Simulate a wait instruction. Wait only within the remaining attempt and time budget; otherwise leave the workshop visibly “Calendar update not confirmed” or “Needs attention.” Verify the attempts actually scheduled, including any retries built into the client library.
- **Duplicate notification.** Deliver the same notification twice, then a different `notificationId` describing the same event revision. The workshop and its single saved `eventId` must remain unchanged, and no new calendar event may be created.
- **Late notification.** Deliver revision 2 with status `confirmed`, then revision 1 with status `tentative`. Keep revision 2 and the “On calendar” display. If a notification lacks a revision, or two notifications conflict at the same revision, mark it for reconciliation instead of guessing.
- **Restart after partial success.** The stand-in creates the event, then the app is stopped before it saves the returned `eventId`. On restart, resume from the saved operation record: same `operationId`, unchanged input. Use the lookup or a same-ID retry to recover the existing `eventId`; verify that neither restarting nor a repeated notification creates a second event or a second local link.

Also check the contract's boundaries:

- **Concurrency.** Send the same operation twice at once, as if the organiser pressed twice. The stand-in must end with one event.
- **Retention expiry.** Move the simulated clock past 24 hours after an unresolved attempt. The stand-in no longer recognizes the `operationId`, and the lookup cannot answer. The app must not resend blindly, because that would create a second event if the first exists. It should leave the workshop as “Needs attention” for the organiser to check the calendar and decide.
- **Replayed failure.** If a provider replays a saved failure for the same identifier, stop the bounded loop and follow its resolution path rather than substituting a fresh ID automatically.

For calendar notifications, which arrive as webhooks, also exercise an invalid signature, and a correctly signed notification about an event that belongs to a different account or operation, at the application's real verification boundary. Calling a handler with a made-up `isVerified: true` flag bypasses that boundary and cannot establish authenticity. Use test-only signing material; if the scheme uses a signing secret, create one just for this exercise. Never use production credentials or live webhook endpoints.

## Step 4 — Show that the check catches a plausible mistake

For the timeout-after-creation case, ask the agent to demonstrate a deliberately wrong retry policy that invents a new operation ID after the timeout. The stand-in should record **two** events for the pottery workshop. The assertion requiring one should fail. Restore the correct policy, reuse the original ID and input, and show the same assertion passing with exactly one event and the expected details. Count created events, not just requests.

Also send a changed start time under the original operation ID, and check that the stand-in rejects it without altering the first event. For late delivery, compare the final local status with the expected revision, not simply the last notification received. These checks make the meaning of “no duplicate effect” and “no stale overwrite” inspectable.

An **illustrative report**, before real results are substituted, might read:

```text
Case: reply lost after calendar event creation.
Expected: one calendar event; workshop unchanged; eventId recovered and saved.
Fault injected: stand-in creates the event, then withholds the reply.
Faulty policy: new operationId on retry -> two events -> one-event check fails.
Correct policy: same operationId and input -> one event -> eventId recovered.
Evidence limit: synthetic stand-in; no real provider or application UI tested.
Next check: application connector against the stand-in, then permitted sandbox.
```

The result you need is that visible chain from supplied fault to expected behavior to observed state.

Keep the failed demonstration as evidence that the assertion can detect this defect. Do not delete it from the report merely to present a green result. Restore the correct exercise version before finishing.

## Step 5 — Decide what the evidence supports

For each case, save the target revision, injected condition, expected and observed states, attempt count, effect count, visible outcome and any untested boundary. Use a fresh reviewer through [Review an Agent Workstream Result](contextqb://prompts/review-an-agent-workstream) to examine the contract and real execution path.

Distinguish three levels: the stand-in behaved as designed; the actual app handled that stand-in correctly; and the provider integration was checked in an authorized sandbox. Provider sandbox behavior can still differ from production limits, delivery and timing. Test only cases the provider permits, with a specific target and cleanup plan. No classroom exercise authorizes a live charge, message or destructive probe.

Continue through [Run a Feature Build Loop](contextqb://playbooks/feature-build-loop) with the missing evidence named. The outcome can be “ready for the next controlled check” rather than “production-ready.” [Failure Modes](contextqb://principles/failure-modes) remains the broader design principle: choose how to handle unfinished work before a real user depends on it.
