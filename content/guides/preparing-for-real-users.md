---
id: preparing-for-real-users
title: Preparing for Real Users
summary: Gather evidence for the task, audience and operating conditions you intend to support, then make an honest release decision.
version: 0.3.0
audience: [novice-builder, founder, operator]
journey_stage: 7
journey_rank: 0
intro: Readiness is a decision about a particular version serving particular people. Start with what they will rely on and what happens if it fails.
related:
  - deploying-vs-launching
  - how-to-use-contextqb
  - launching-for-your-first-users
  - making-your-app-usable
  - monitoring-vs-product-analytics
  - pre-launch-security
  - protecting-users-and-their-data
  - rehearse-backup-and-recovery
  - release-readiness
  - set-up-useful-monitoring
  - testing-agent-built-software
  - where-your-app-runs
tags: [launch, testing]

---

# Preparing for Real Users

**Plain language:** Before people depend on your app, make the promise specific and collect evidence that it can keep that promise. A useful first release can be narrow. You should know what works, what remains limited and who will respond if something goes wrong.

## The example on this page

The reasoning below is illustrated with one invented case. A bicycle repair shop wants customers to request a service day online. Submitting a request does not book an appointment: the shop replies after checking its workload, and only that reply confirms a date. Suppose an agent has built a candidate request form with a staff view of incoming requests. Before inviting customers, the owner needs evidence that requests reach the staff who will answer them, because a request that silently disappears leaves a customer waiting for a reply that never comes.

Nothing here is built, and you do not need to build it. The checks named for the shop show how one product's promise selects its evidence; they are examples, not a universal test list. Ask the same questions about your own product's main task.

## Define the intended use

Write one sentence naming the audience, task and scope. The shop's could be “Customers can send a service-day request that staff receive and answer; the shop confirms any date by reply.” That creates different obligations from “Customers can book a confirmed appointment online.” Keep the scope consistent with the version you have actually checked.

Use [Where Your App Runs](contextqb://guides/where-your-app-runs) to identify the release target. Include the source and artifact identifiers, settings, data format and who can reach it. A private pilot limits the audience; it does not make loss of their work unimportant. [Deploying vs. Launching](contextqb://briefings/deploying-vs-launching) separates rehearsal from the decision to invite that reliance.

## Gather evidence for the important task

Select the few paths the promise depends on. For the repair shop, the form looks good and its build checks pass, but that is not yet the main evidence. Submit a made-up request in the agreed test setup, then open it from the staff view and verify the details. Check a failed submission: the customer should keep what they typed and learn that the request was not sent. Check that the final message says the shop still needs to confirm a date, so nobody mistakes a request for a booking. Those behaviors matter more than a long list of passing checks unrelated to them. Use [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) to connect each result to its expectation, target and limits.

Include the intended person's experience. Can they find the action, understand its result and recover from a mistake? Bring the relevant keyboard, zoom, device and other access observations from [Making Your App Usable](contextqb://guides/making-your-app-usable). A structural review and an attractive screen leave those questions open until they are checked.

## Check responsiveness under realistic conditions

**Performance** concerns how quickly and efficiently the application does its work. **Load** describes the work it is handling: records, requests or people acting at once. A staff view tested with an empty list on a fast computer may conceal slow loading when a realistic backlog of requests builds up on a busy week.

Decide what delay would interrupt the task and state a target before testing. Ask the agent to propose a bounded test with representative made-up data, intended devices and plausible concurrent use where relevant. Agree the environment and resource limits before execution; a load test can affect other users or incur charges. For a local single-user tool, record size and device performance may matter more than concurrent traffic.

Record what was measured and how many attempts were made. Investigate slow cases as well as the average. MDN's [performance curriculum](https://developer.mozilla.org/en-US/curriculum/extensions/performance/) distinguishes actual speed, perceived responsiveness and measurement. A progress message can help explain a wait; it does not make the underlying operation faster. No universal response-time threshold establishes readiness for every product.

## Close the protection and recovery gaps

Use [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data) and the applicable [Pre-Launch Security Audit](contextqb://audits/pre-launch-security). Carry actual findings forward, including unknown settings and reasons for non-applicable checks. For the shop, the staff view holds customers' names and contact details, so who can open it needs evidence. A local tool used by one person with no accounts needs its data and device boundaries checked instead, without inventing a sign-in system.

Bring evidence from [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery). Name the information that may be lost, the expected interruption and the code/data combinations that recovery supports. Could staff recover the requests if storage were damaged? If your promise is “every request is answered,” a rehearsal that loses newer requests is a decision to resolve, not a box to tick.

## Prepare for the day after release

Choose one place users can report trouble and a person responsible for reading it. For the shop, ask who notices a request that has gone unanswered for two days. For a personal tool, the reporting place can be your own operating notes and a clear way to recognize a failed task. Use [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) to demonstrate how important failures reach that person.

List the services and jobs the app depends on, any quotas or usage charges, and the action available if a limit is approached. A quota is a service limit, such as storage size or requests per minute. Decide whether reaching it should stop work, queue it or show an honest unavailable state; the provider's actual behavior must be checked.

## Make the decision reviewable

Put the scope, evidence links, known limitations, recovery, support and watch arrangements in one release record. Ask a fresh agent session that did not implement the candidate, or another suitably qualified reviewer, to run [Release Readiness Audit](contextqb://audits/release-readiness) against that record and the actual candidate.

Choose go, no-go or a deliberately smaller scope supported by the evidence. For example, the shop might release the request form while keeping a phone number for urgent repairs, if requests have been shown to arrive reliably. But if the form cannot reliably deliver a request, inviting only five customers does not fix the broken promise; keep it in testing until that gap is resolved. Making a scope smaller is honest only when the remaining promise still works and users understand it.

Before deciding, write the task people will rely on, the strongest evidence that it works and the most consequential unresolved gap. Those three answers are more useful than “the agent says everything passed.”
