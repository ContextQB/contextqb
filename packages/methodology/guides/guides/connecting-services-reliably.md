---
id: connecting-services-reliably
title: Connecting Services Reliably
summary: Define what an outside service promises, what your app must remember and how it handles missing, repeated or late results without hiding unfinished work.
version: 0.1.1
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

An **integration** connects your application to another system, such as a document service, calendar or email provider. The first local notebook does not need one. Read this guide when a useful product behavior depends on an outside system, after [How the Parts of Your App Work Together](contextqb://guides/how-the-parts-of-your-app-work-together) and [Designing Your App's Data](contextqb://guides/designing-your-apps-data).

Explain the need before choosing a service. What must cross the boundary, which system owns the result, and what can the person still do if the service is unavailable? [Failure Modes](contextqb://principles/failure-modes) helps you turn those questions into decisions.

## Understand the two directions

An **API**, or application programming interface, is a defined way for software to ask another system for information or action. A **request** asks for something; a **response** answers it. The **contract** describes the accepted inputs, returned values, errors and guarantees. A response saying “accepted for processing” may mean the work has only been queued, not finished.

A **webhook** reverses the direction: the outside system sends a message to an address your app provides when an event happens. An **event** describes something that occurred, such as an export becoming available. The receiving address is an **endpoint**. A webhook needs a reachable receiver; a local-only notebook may instead use a manual status check, or **polling**, repeated requests for the current result.

Your agent can build the **connector**, the part of your app that communicates with the service. You decide which information may leave the app, what users are promised and how much delay or interruption is acceptable. Read the provider's current documentation with the agent and keep a short record of the specific contract you rely on.

## Make retries safe before making them automatic

A **timeout** means the caller stopped waiting. It does not prove that the other system stopped working. If the service created an archive copy and the response was lost, repeating “create a copy” might create a second one. AWS's [guidance on timeouts and retries](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) explains this uncertainty and why retries can amplify load.

**Idempotency** means repeating the same logical operation has the same intended effect as performing it once. Some APIs accept an **idempotency key**, an identifier your app reuses for retries of that operation. Keep that identifier with the operation before sending, along with the unchanged request. A new key usually represents a new operation, so generating one after every timeout defeats the protection.

Check the provider's key scope, retention period, rules for simultaneous requests and response behavior. A key may stop protecting an old retry after the provider forgets it. Stripe's [idempotent-request documentation](https://docs.stripe.com/api/idempotent_requests) is a concrete example of a bounded contract; it is not a promise that every provider behaves identically. Without adequate support, **reconcile** the outcome: compare your record with what the provider reports, resolve any difference and leave uncertainty visible. Use a supported lookup or your decision as the owner before retrying a consequential action.

Set a timeout, a maximum number of attempts and a total waiting budget. **Backoff** spaces retries farther apart; **jitter** adds variation so clients do not all retry together. Respect documented rate-limit instructions, and stop with an actionable state when the budget is exhausted. Repeating an expired credential or invalid input normally needs a correction, not the same request in a tight loop.

## Receive events without repeating or undoing work

Assume only the delivery guarantees the provider documents. Stripe's [webhook guidance](https://docs.stripe.com/webhooks) explicitly covers duplicate delivery and events arriving out of order. A provider event ID can help recognize a repeated message, but two different events can describe the same business action. Name the actual effect you must avoid repeating, such as creating a second archive record.

Save the duplicate-detection decision and local state change together when your storage supports it. Otherwise a crash between them can either repeat the effect or lose it. This is not solved by an in-memory list of event IDs that disappears on restart. A database transaction covers its supported local writes; it cannot by itself make an outside email or API call occur exactly once.

For late events, use the provider's supported revision or current-state lookup. Do not assume that arrival order or a timestamp always establishes the order of changes. If you acknowledge receipt before finishing work, first save the accepted work so it survives a restart and has a visible failure/retry path. A receipt alone is not evidence that the user's task finished.

## Worked contract: an optional notebook archive

Imagine a later notebook feature that sends a selected note to an outside archive. This is a **fictional design exercise**, not an implemented service. The local saved note remains authoritative; failure to archive must not delete it. Sending text outside the device is a new data-sharing decision, so explain it to the user and obtain the permission appropriate to the product before implementing it.

Write a contract such as this before asking for code:

```text
Task: archive one saved note chosen by the user.
Input: operation ID, note ID, title and note text from that chosen revision.
Local owner: the notebook keeps the original and the operation record.
Outside effect: one archive copy for this operation ID and unchanged input.
Assumed provider behavior: repeat ID/input returns the same archive ID;
  repeat ID with different input is rejected. Retention must be confirmed.
Success evidence: a valid archive ID and confirmed completion, not just receipt.
Timeout: keep outcome unknown; reconcile or retry the same operation safely.
Local display: Pending, Archived, Needs attention or Outcome unknown.
Limit: at most three attempts in this exercise; never invent a fresh ID to retry.
New action: use a new ID only after resolving the earlier outcome and choosing
  a separate action; a reported error alone does not prove no copy was created.
Recovery: preserve the note; inspect the operation before trying a new action.
```

If the user edits the note after the first attempt, do not silently send new text under the old operation ID. Resolve the first operation, then decide whether the new revision deserves a separate archive action. Some APIs replay a saved failure for the same key; stop that retry loop and follow their documented resolution path. A new ID is appropriate when you have established that no outside copy exists and choose to try again, or deliberately authorize an additional copy after reconciling the existing one. A returned error alone is insufficient evidence of absence.

Once the archive has succeeded, failure to record its ID locally is a **partial success**: the outside copy exists, but the app's record is unfinished. Recover the relationship rather than creating another copy by default.

For an optional webhook, this fictional provider also supplies a monotonically increasing revision number for each archive: a larger number means a later version. That assumption makes a late-event exercise possible. A real provider without such a guarantee needs a different ordering strategy, usually a documented current-state lookup. A revision number alone does not verify who sent the message.

## Protect the boundary and inspect the evidence

Use [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data) and [Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) to identify credentials, permissions and information crossing this boundary. Keep secret credentials out of public client code and logs. Verify webhook authenticity using the provider's supported method, validate the message shape and check that its object belongs to the expected account and operation before changing records.

Before exposing a receiving endpoint, use the [Public Endpoint Exposure Audit](contextqb://audits/public-endpoint-exposure). A valid signature does not establish every business permission. Treat returned text and links as untrusted input, and retain only the operation identifiers and redacted diagnostics needed to investigate a failure.

Finish with an integration contract, a failure decision for each important case and an owner who can act on unfinished work. [Test an Integration Failure](contextqb://playbooks/test-an-integration-failure) supplies the next exercise. The [Backend Architecture Audit](contextqb://audits/backend-architecture) can inspect the structure; it does not replace observed duplicate, timeout and recovery behavior.

Name how an operation left in “Outcome unknown” will be noticed later and who will investigate it. Before real use, [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) helps you check that reporting path; for a local tool, it may be a visible list of unfinished work that you review.
