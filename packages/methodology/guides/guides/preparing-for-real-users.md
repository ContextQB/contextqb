---
id: preparing-for-real-users
title: Preparing for Real Users
summary: Gather evidence for the task, audience and operating conditions you intend to support, then make an honest release decision.
version: 0.2.0
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

The reasoning below is illustrated with one invented case. Maya is a fictional first-time founder deciding which problem her business should solve for small independent bakeries. She learns mostly from conversations with bakery owners, and wants a small research notebook program on her own computer: each entry keeps one source with her note about what it showed, stored in one local file, used only by her. Her research notes name real people and businesses, and she cannot repeat the conversations. Suppose an agent has built a candidate version of that notebook and she must decide whether to start relying on it for her real notes.

Nothing here is built, and you do not need to build it. Where the notebook appears, it shows how one product's promise selects its evidence. The checks named for it are examples, not a universal test list. Ask the same questions about your own product's main task.

## Define the intended use

Write one sentence naming the audience, task and scope. Maya's could be “The owner can keep and reopen personal research notes on one computer.” That creates different obligations from “A team can share private notes across devices.” Keep the scope consistent with the version you have actually checked.

Use [Where Your App Runs](contextqb://guides/where-your-app-runs) to identify the release target. Include the source and artifact identifiers, settings, data format and who can reach it. A private pilot limits the audience; it does not make loss of their work unimportant. [Deploying vs. Launching](contextqb://briefings/deploying-vs-launching) separates rehearsal from the decision to invite that reliance.

## Gather evidence for the important task

Select the few paths the promise depends on. For the notebook, saving, reopening and responding honestly to a failed save matter more than a long list of passing checks unrelated to those behaviors. Use [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) to connect each result to its expectation, target and limits.

Include the intended person's experience. Can they find the action, understand its result and recover from a mistake? Bring the relevant keyboard, zoom, device and other access observations from [Making Your App Usable](contextqb://guides/making-your-app-usable). A structural review and an attractive screen leave those questions open until they are checked.

## Check responsiveness under realistic conditions

**Performance** concerns how quickly and efficiently the application does its work. **Load** describes the work it is handling: records, requests or people acting at once. A small empty notebook on your own fast computer may conceal slow loading with a year's worth of notes.

Decide what delay would interrupt the task and state a target before testing. Ask the agent to propose a bounded test with representative made-up data, intended devices and plausible concurrent use where relevant. Agree the environment and resource limits before execution; a load test can affect other users or incur charges. For a local single-user tool, record size and device performance may matter more than concurrent traffic.

Record what was measured and how many attempts were made. Investigate slow cases as well as the average. MDN's [performance curriculum](https://developer.mozilla.org/en-US/curriculum/extensions/performance/) distinguishes actual speed, perceived responsiveness and measurement. A progress message can help explain a wait; it does not make the underlying operation faster. No universal response-time threshold establishes readiness for every product.

## Close the protection and recovery gaps

Use [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data) and the applicable [Pre-Launch Security Audit](contextqb://audits/pre-launch-security). Carry actual findings forward, including unknown settings and reasons for non-applicable checks. A local no-account tool needs its data and device boundaries checked without inventing a sign-in system.

Bring evidence from [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery). Name the information that may be lost, the expected interruption and the code/data combinations that recovery supports. If your promise is “all notes are retained,” a rehearsal that loses a newer note is a decision to resolve, not a box to tick.

## Prepare for the day after release

Choose one place users can report trouble and a person responsible for reading it. For a personal tool, that can be your own operating notes and a clear way to recognize a failed task. Use [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) to demonstrate how important failures reach that person.

List the services and jobs the app depends on, any quotas or usage charges, and the action available if a limit is approached. A quota is a service limit, such as storage size or requests per minute. Decide whether reaching it should stop work, queue it or show an honest unavailable state; the provider's actual behavior must be checked.

## Make the decision reviewable

Put the scope, evidence links, known limitations, recovery, support and watch arrangements in one release record. Ask a fresh agent session that did not implement the candidate, or another suitably qualified reviewer, to run [Release Readiness Audit](contextqb://audits/release-readiness) against that record and the actual candidate.

Choose go, no-go or a deliberately smaller scope supported by the evidence. For example, a tested single-owner notebook can be released for Maya alone while sharing remains a later idea. Making a scope smaller is honest only when the remaining promise still works and users understand it.

Before deciding, explain the strongest evidence for the core task and the most consequential unresolved gap. Those two answers are more useful than “the agent says everything passed.”
