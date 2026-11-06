---
id: connecting-services-reliably
title: Connecting Services Reliably
summary: Define what an outside service promises, what your app must remember and how it handles missing, repeated or late results without hiding unfinished work.
version: 0.2.0
audience: [novice-builder, founder, operator]
journey_stage: 4
journey_rank: 70
intro: An outside service can help your product do more. It also creates a boundary where one side may finish while the other still does not know what happened.
related:
  - backend-architecture
  - designing-your-apps-data
  - failure-modes
  - how-the-parts-of-your-app-work-together
  - how-to-use-contextqb
  - map-your-attack-surface
  - protecting-users-and-their-data
  - public-endpoint-exposure
  - set-up-useful-monitoring
  - test-an-integration-failure
tags: [reliability, architecture]

---

# Connecting Services Reliably

**Plain language:** When your product depends on another service, a successful request is only part of the story. Decide what happens if the answer is missing, the same action arrives twice or an older result arrives late. Keep the user's work safe and show what remains unfinished.

## Start when the product needs a connection

An **integration** connects your application to another system, such as a document service, calendar or email provider. Many first versions need none. Read this guide when a useful product behavior depends on an outside system, after [How the Parts of Your App Work Together](contextqb://guides/how-the-parts-of-your-app-work-together) and [Designing Your App's Data](contextqb://guides/designing-your-apps-data).

Explain the need before choosing a service. What must cross the boundary, which system owns the result, and what can the person still do if the service is unavailable? [Failure Modes](contextqb://principles/failure-modes) helps you turn those questions into decisions.

## Understand the two directions

An **API**, or application programming interface, is a defined way for software to ask another system for information or action. A **request** asks for something; a **response** answers it. The **contract** describes the accepted inputs, returned values, errors and guarantees. A response saying “accepted for processing” may mean the work has only been queued, not finished.

A **webhook** reverses the direction: the outside system sends a message to an address your app provides when an event happens. An **event** describes something that occurred, such as a calendar event being created or changed. The receiving address is an **endpoint**. A webhook needs a reachable receiver; an app with no public address may instead use a manual status check, or **polling**, repeated requests for the current result.

Your agent can build the **connector**, the part of your app that communicates with the service. You decide which information may leave the app, what users are promised and how much delay or interruption is acceptable. Read the provider's current documentation with the agent and keep a short record of the specific contract you rely on.

## Make retries safe before making them automatic

A **timeout** means the caller stopped waiting. It does not prove that the other system stopped working. If a calendar service created an event and the response was lost, repeating “create an event” might create a second one. AWS's [guidance on timeouts and retries](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) explains this uncertainty and why retries can amplify load.

**Idempotency** means repeating the same logical operation has the same intended effect as performing it once. Some APIs accept an **idempotency key**, an identifier your app reuses for retries of that operation. Keep that identifier with the operation before sending, along with the unchanged request. A new key usually represents a new operation, so generating one after every timeout defeats the protection.

Check the provider's key scope, retention period, rules for simultaneous requests and response behavior. A key may stop protecting an old retry after the provider forgets it. Stripe's [idempotent-request documentation](https://docs.stripe.com/api/idempotent_requests) is a concrete example of a bounded contract; it is not a promise that every provider behaves identically. Without adequate support, **reconcile** the outcome: compare your record with what the provider reports, resolve any difference and leave uncertainty visible. Use a supported lookup or your decision as the owner before retrying a consequential action.

Set a timeout, a maximum number of attempts and a total waiting budget. **Backoff** spaces retries farther apart; **jitter** adds variation so clients do not all retry together. Respect documented rate-limit instructions, and stop with an actionable state when the budget is exhausted. Repeating an expired credential or invalid input normally needs a correction, not the same request in a tight loop.

## Receive events without repeating or undoing work

Assume only the delivery guarantees the provider documents. Stripe's [webhook guidance](https://docs.stripe.com/webhooks) explicitly covers duplicate delivery and events arriving out of order. A provider event ID can help recognize a repeated message, but two different events can describe the same business action. Name the actual effect you must avoid repeating, such as creating a second calendar event or a second local link to the same one.

Save the duplicate-detection decision and local state change together when your storage supports it. Otherwise a crash between them can either repeat the effect or lose it. This is not solved by an in-memory list of event IDs that disappears on restart. A database transaction covers its supported local writes; it cannot by itself make an outside email or API call occur exactly once.

For late events, use the provider's supported revision or current-state lookup. Do not assume that arrival order or a timestamp always establishes the order of changes. If you acknowledge receipt before finishing work, first save the accepted work so it survives a restart and has a visible failure/retry path. A receipt alone is not evidence that the user's task finished.

## Worked contract: publishing a workshop to a calendar

Here is one invented situation to make these ideas concrete. A community group manages its workshops in its own app, but publishes the dates through an outside calendar service that members subscribe to. An organiser presses “Add to calendar” for Saturday's pottery session. The calendar service creates the event, but its reply never reaches the app. The app reports that it timed out. Should it send the same request again?

A timeout means the app stopped waiting; it does not tell you whether the event was created. Sending “create an event” a second time might put the pottery session on members' calendars twice. So the first design question is how this service lets you identify one intended calendar addition, and how you find out what happened to it.

If the service supports a request identifier that makes retries refer to the same action, the app must save that identifier before sending and reuse it with unchanged event details. If it does not, the agent needs another supported way to look up the outcome, or must leave the uncertainty for the organiser to resolve. It must not assume every calendar service provides the same guarantees.

Meanwhile the workshop itself stays saved in the group's app. While the calendar result is uncertain, show “Calendar update not confirmed” rather than deleting the workshop or claiming it was published. Only the workshop's public details should cross the boundary; the app has no reason to send the names of people who booked.

The calendar service here is fictional, and nothing needs to be built. To make the reasoning checkable, this guide and [Test an Integration Failure](contextqb://playbooks/test-an-integration-failure) share one exercise contract for a local stand-in calendar. Its rules are **assumed for the exercise**. A real provider's behavior must come from its current documentation.

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

Read the contract against the timeout. The app saved `operationId` before sending, so after the timeout it can ask the stand-in what happened to that operation, or repeat the request with the same identifier and details and receive the same `eventId`. Inventing a new `operationId` for the retry would look like a new request and create a second event.

If the organiser changes the start time after the first attempt, do not silently send the new time under the old `operationId`; the stand-in would reject it, and a real service might behave differently. Resolve the first operation, then decide whether the change needs a separate action, such as updating the existing event. Some APIs replay a saved failure for the same identifier; stop that retry loop and follow their documented resolution path. A new identifier is appropriate when you have established that no event exists and choose to try again, or deliberately want an additional event. A returned error alone is not evidence that nothing was created.

Once the calendar has created the event, failing to save its `eventId` beside the workshop is a **partial success**: the outside event exists, but the app's record is unfinished. Recover the relationship from the saved operation, for example through the lookup, rather than creating another event by default.

The calendar's notifications are this guide's webhook example: the service tells the app when an event changes. The stand-in numbers each event's revisions so that a late, older notification can be recognized and ignored. That numbering is part of the exercise contract. A real provider without such a guarantee needs a different ordering strategy, usually a documented current-state lookup. And a revision number alone does not verify who sent the message.

For your own integration, name three things before your agent adds automatic retries: the intended outside effect, what identifies one attempt at it, and how you will resolve a missing answer.

## Protect the boundary and inspect the evidence

Use [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data) and [Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) to identify credentials, permissions and information crossing this boundary. Keep secret credentials out of public client code and logs. Verify webhook authenticity using the provider's supported method, validate the message shape and check that its object belongs to the expected account and operation before changing records.

Before exposing a receiving endpoint, use the [Public Endpoint Exposure Audit](contextqb://audits/public-endpoint-exposure). A valid signature does not establish every business permission. Treat returned text and links as untrusted input, and retain only the operation identifiers and redacted diagnostics needed to investigate a failure.

Finish with an integration contract, a failure decision for each important case and an owner who can act on unfinished work. [Test an Integration Failure](contextqb://playbooks/test-an-integration-failure) supplies the next exercise. The [Backend Architecture Audit](contextqb://audits/backend-architecture) can inspect the structure; it does not replace observed duplicate, timeout and recovery behavior.

Name how an operation left as “Calendar update not confirmed” or “Needs attention” will be noticed later, and who will investigate it. Before real use, [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) helps you check that reporting path; for a local tool, it may be a visible list of unfinished work that you review.
