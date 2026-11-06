---
id: operating-a-small-app
title: Operating a Small App
summary: Establish a manageable routine for health, recovery, costs and feedback so people can keep relying on the product after launch.
version: 0.4.0
audience: [novice-builder, founder, operator]
journey_stage: 9
journey_rank: 0
intro: Keeping an app useful means noticing changes, making decisions and leaving the next person enough context to act. For a small product, that person may still be you.
related:
  - changing-software-without-losing-control
  - choosing-your-ide-and-llm
  - how-to-use-contextqb
  - launch-day-checklist
  - launching-for-your-first-users
  - monitoring-vs-product-analytics
  - operations-baseline
  - rehearse-backup-and-recovery
  - respond-to-an-outage
  - review-feedback-and-plan-the-next-change
  - set-up-useful-monitoring
  - update-a-dependency-safely
  - work-with-agents-through-documentation
tags: [operations, monitoring]

---

# Operating a Small App

**Plain language:** After launch, the product still needs someone to notice trouble, protect saved work and choose the next change. You can keep this routine small. Name the important checks, who reads them and what happens when a check fails.

## The example on this page

The routine is illustrated with one invented case. A community centre runs a hosted class-signup app. Residents submit registrations for classes, staff use the saved list to plan each session, and an outside email service sends confirmation emails. The centre's coordinator is responsible for noticing failures and deciding what to do. If registrations go missing, residents turn up to a class that has no place for them; if the bill quietly grows, the centre pays for work that helps nobody.

Nothing here is built, and you do not need to build it. The same hosted app runs through every section below, including the cost example and the first-month record.

## Begin with the release handoff

Bring forward the delivered version, audience, known limitations and watch results from [Launching for Your First Users](contextqb://guides/launching-for-your-first-users). Name the owner of the application and each outside service or scheduled job it depends on. A **scheduled job** is work configured to run at particular times, such as a daily backup.

For each dependency, explain what stops working if it fails and how you would notice. Include coding-agent subscriptions and unattended agent jobs when they create recurring costs or operational responsibilities. A one-person product can have one owner; it still needs a written next action when that owner returns after a break.

## Choose a routine that matches the consequences

Review important failures as they occur, using the path established in [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring). Set a regular check of recent task results, overdue jobs, backup status, support reports, service notices and usage against limits. Choose the interval based on what could go wrong between checks, not a universal calendar rule.

At a deeper review, rehearse recovery again when storage, data shape or recovery arrangements change. Review dependencies and access as the product evolves. The [Operations Baseline Audit](contextqb://audits/operations-baseline) organizes these questions; [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) owns the recovery procedure.

Use [Changing Software Without Losing Control](contextqb://guides/changing-software-without-losing-control) to decide which maintenance is worthwhile, and [Update a Dependency Safely](contextqb://playbooks/update-a-dependency-safely) for a specific software update. A deferred update still needs an owner and a reason to revisit it.

Look at usefulness as well as health. [Monitoring vs. Product Analytics](contextqb://briefings/monitoring-vs-product-analytics) explains why successful requests do not prove a useful product. A short account of a real completed task can be more informative than collecting events with no decision in mind.

## Know which activity creates which bill

Separate fixed subscriptions from metered activity, which is charged according to usage. Check whether a subscription also permits overage charges or separately billed model calls. Building an app with an agent and running an AI feature inside the app can create different bills; neither is automatically included in the other.

Record the billed unit, included allowance, measured usage, reporting delay, warning threshold and any actual enforcement. A rate quota, such as requests per minute, is not a monthly spending ceiling. A notification alone does not stop spending. Google's [budget documentation](https://docs.cloud.google.com/billing/docs/how-to/budgets) distinguishes alerts-only budgets from supported spending controls; verify the actual behavior of your own service and plan.

### Worked cost decision

This is an **invented scenario** for the class-signup app, using made-up dollar amounts rather than any vendor's prices. Account identifiers and credentials have no place in the record:

```text
Coding-tool subscription: $20 per month, billed separately; no overage here
Hosting base charge: $12 per month
Confirmation emails: $0.01 per billed sending attempt, including retries
Expected registrations: 100 per month, one confirmation each
Usual attempts per confirmation: 1
Hosting-and-email warning: charges on that account reach $14; notification only
Enforced monthly spending cap: none demonstrated
```

This scenario assumes the email service bills every sending attempt, retries included. Not every email service bills that way; check the actual billed unit for yours. A billed attempt is also not proof that the email reached anyone: it records that the service was asked to send. And neither attempts nor deliveries are registrations; the registrations are the records the centre saved.

Each provider's alert covers its own configured billing scope; it does not automatically include another vendor's bill. Here the $14 warning sees only the hosting-and-email account, so you add the separate coding-tool subscription yourself.

With one attempt per confirmation, 100 billed attempts cost $1, so the hosting-and-email bill is $12 + $1 = **$13**, and the total with the coding tool is **$33**. If every confirmation needs its initial attempt plus two retries, 300 billed attempts cost $3: **$15** on the hosting-and-email account and **$35** overall. The useful work stayed at 100 registrations. Repeated attempts changed the cost, and pushed that account past its $14 warning.

At ten times the registrations, the same linear assumptions give $22 on the hosting-and-email account ($42 overall) with one attempt each, or $42 ($62 overall) with three. The $14 warning would then fire every month even without retries, so a threshold has to be chosen for the volume you actually expect. These are scenario calculations, not a forecast: real service tiers, units, allowances and reporting delays may change the result. Ask the agent to show its assumptions and compare them with the actual bill before deciding.

If the warning arrives at $14, what stops further activity? In this example, nothing has been shown to do so; it is a notification, not a cap, and it does not include the coding-tool bill. A useful next action is to inspect why confirmations are being retried and agree a bounded retry policy and an available usage control. Define what residents and staff see if sending is paused. Do not disable an essential service merely because an agent guessed that doing so is safe.

Before your first long coding session, [Choosing Your IDE and LLM](contextqb://guides/choosing-your-ide-and-llm) introduces the same billing distinction. The operating record carries it forward as actual usage accumulates.

## Worked first-month record

Every event below is **invented** for the class-signup app. Use this record to practice decisions, then replace it with evidence from your own product. The weeks illustrate kinds of work, not a universal weekly schedule:

- **Week 1 — essential jobs.** The coordinator reviews the successful registrations and tests that a failed submission reaches the responsible person. They also check that the backup job has a recent successful result. The useful question is not whether a dashboard is green, but whether someone can find evidence that these essential jobs happened.
- **Week 2 — an unfinished task.** For some saved registrations, the email service refuses the confirmation or returns no answer. The coordinator separates the two outcomes: the registrations exist and are safe, but their confirmations are unfinished, and for those with no answer it is unknown whether the email was accepted. They preserve the registration list and follow up on the sending problem, using [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) for the reporting path, rather than asking everyone to register again.
- **Week 3 — a cost surprise.** Usage records show three billed sending attempts for each intended confirmation. As the worked cost decision shows, that turns a $13 hosting-and-email bill into $15, and $33 overall into $35, crossing the $14 warning. The coordinator investigates the retries and the actual available controls before changing the running service, and does not treat the warning as a cap.
- **Week 4 — feedback.** Residents ask for a waiting list. The coordinator records the request and investigates how people currently find out that a class is full, before approving another feature. [Review Feedback and Plan the Next Change](contextqb://playbooks/review-feedback-and-plan-the-next-change) covers that investigation.

Operations includes understanding use and choosing the next worthwhile change, as well as fixing failures. Each entry should distinguish observation, interpretation, decision, owner and next check. A missing job result is unknown until investigated; it is not a zero-error result. Keep the record beside the existing project notes rather than inventing a new administration system.

For your app, keep a short record of what was observed, what it means, who owns the response and when the next check is needed. The routine should follow the promises people depend on.

## Maintain the product or retire it deliberately

Update the project map when services, owners, schedules or recovery paths change. [Work With Agents Through Documentation](contextqb://guides/work-with-agents-through-documentation) explains how the next session can inherit those decisions. A recurring agent check is useful only when someone reads its result and notices if the check stops.

If the product no longer serves its purpose, plan retirement: inform affected users under your actual commitments, preserve or export needed information, apply the retention plan and stop unnecessary resources deliberately. For a continuing product, finish each review with one justified next action or a reason to leave it unchanged. Reliable operation includes knowing when there is nothing useful to change.
