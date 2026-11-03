---
id: test-an-integration-failure
title: Test an Integration Failure
summary: Exercise missing, malformed, repeated and late integration results on an isolated target, then inspect saved state, outside effects and what the user sees.
version: 0.1.1
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

## Step 1 — Choose an isolated target

Name the operation, application revision, test data and exact boundary to replace. A **fixture** is a controlled input; a **test double** is a substitute for a real dependency. [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) explains what these can and cannot establish.

Begin with a local stand-in that cannot contact the real provider. Use fictional data, no production credentials and no actual email, message, payment or customer account. Ask the agent to identify how network calls are prevented, not merely say “test mode.” An environment variable with that name does not prove isolation.

Use the real application's connector and decision logic against the double when testing an existing integration. A separate miniature model can explain the idea, but it does not prove that the application is wired that way. Record which one you are exercising.

## Step 2 — Define the observations before the failure

For each case, record the starting state, injected result, expected local state, expected outside-effect count and expected user message. Count actual effects recorded by the stand-in, not merely requests: a timeout can happen after the effect. Specify the allowed attempts and which cases must stop immediately.

The archive exercise from the guide has these explicit assumptions:

```json
{
  "operationId": "archive-op-1",
  "noteId": "note-1",
  "title": "A source",
  "note": "Keep  two spaces"
}
```

The stand-in keeps a record across simulated client restarts. It creates one archive for a new operation ID, returns that same archive for identical retries, and rejects the same ID with different input. It can create the archive and then lose the response. Its event fixtures have an event ID, archive ID, integer revision and status; the fictional contract guarantees increasing revisions for that archive. State these assumptions in the report, because real services need their own verification.

## Step 3 — Exercise the cases that could break the promise

Ask the agent to use a fresh isolated starting state for each case, except where the sequence itself is under test. For this exercise, use a simulated clock and at most three total attempts, with increasing waits and a total time budget; those are exercise settings, not recommended provider defaults. Check these cases:

- **Malformed response.** Return a success status with a missing archive ID. The app must not claim “Archived.” Keep the original note and an actionable unresolved result; inspect whether an outside effect occurred before deciding to retry.
- **Timeout before completion.** No copy is created. Retry only under the stated safe contract, with the same operation ID and input. Stop at the attempt/time limit if no result can be confirmed.
- **Timeout after completion.** Create one copy, then lose the response. Retrying the same operation must return its identity with exactly one effect. Generating a new ID should make the deliberately faulty version fail this check.
- **Expired access.** Simulate rejected credentials. Show that reconnection or the owner's attention is needed, without disclosing the secret. Stop rather than retry unchanged rejected credentials; a supported renewal or reconnection needs its own bounded handling.
- **Rate limit.** Simulate a documented wait instruction. Wait only within the remaining budget; otherwise leave the work visibly pending or needing attention. Verify the scheduled attempts, including any retries built into the client library.
- **Duplicate event.** Deliver the same event twice, then a different event ID describing the same completed archive revision. The original note and the single local archive association must remain unchanged; do not create another outside copy.
- **Late event.** Deliver revision 2 with status `archived`, then revision 1 with status `processing`. Keep revision 2 and the archived display. If an event lacks the promised revision or conflicts at the same revision, mark it for reconciliation instead of guessing.
- **Restart after partial success.** Create the outside copy, then simulate a failure before the app saves its returned ID. Resume from the previously saved operation ID and unchanged input. Reconcile to the same copy; verify that neither restarting nor repeating an event creates a second association.

Also check the contract's boundaries: send the same operation simultaneously, as if the person pressed twice, and verify one effect under the promised concurrency rules. Simulate the provider forgetting an old key after its retention period. The app must seek a supported outcome lookup or the owner's decision before sending again; a blind resend may create a second copy. If the provider replays a saved failure, stop the bounded loop and follow its resolution path rather than substituting a fresh ID automatically.

For a webhook, also exercise an invalid signature or wrong-account event at the application's real verification boundary. Calling a handler with a made-up `isVerified: true` flag bypasses that boundary and cannot establish authenticity. Use test-only signing material; if the scheme uses a signing secret, create one just for this exercise. Never use production credentials or live webhook endpoints.

## Step 4 — Show that the check catches a plausible mistake

For the timeout-after-completion case, ask the agent to demonstrate a deliberately wrong retry policy that creates a new operation ID after the timeout. The stand-in should record **two** copies. The assertion requiring one should fail. Restore the correct policy, reuse the original ID and input, and show the same assertion passing with one copy.

Also reject a changed note body under the original operation ID without altering its first archive. For late delivery, compare the final local status with the expected revision, not simply the last message received. These checks make the meaning of “no duplicate effect” and “no stale overwrite” inspectable.

An **illustrative report**, before real results are substituted, might read:

```text
Case: response lost after archive creation.
Expected: one outside copy; original note unchanged; archive identity recovered.
Fault injected: stand-in records success, then withholds the response.
Faulty policy: new key on retry -> two copies -> expected-count check fails.
Correct policy: same key and input -> one copy -> identity recovered.
Evidence limit: synthetic stand-in; no real provider or application UI tested.
Next check: application connector against the double, then permitted sandbox work.
```

Keep the failed demonstration as evidence that the assertion can detect this defect. Do not delete it from the report merely to present a green result. Restore the correct exercise version before finishing.

## Step 5 — Decide what the evidence supports

For each case, save the target revision, injected condition, expected and observed states, attempt count, effect count, visible outcome and any untested boundary. Use a fresh reviewer through [Review an Agent Workstream Result](contextqb://prompts/review-an-agent-workstream) to examine the contract and real execution path.

Distinguish three levels: the stand-in behaved as designed; the actual app handled that stand-in correctly; and the provider integration was checked in an authorized sandbox. Provider sandbox behavior can still differ from production limits, delivery and timing. Test only cases the provider permits, with a specific target and cleanup plan. No classroom exercise authorizes a live charge, message or destructive probe.

Continue through [Run a Feature Build Loop](contextqb://playbooks/feature-build-loop) with the missing evidence named. The outcome can be “ready for the next controlled check” rather than “production-ready.” [Failure Modes](contextqb://principles/failure-modes) remains the broader design principle: choose how to handle unfinished work before a real user depends on it.
