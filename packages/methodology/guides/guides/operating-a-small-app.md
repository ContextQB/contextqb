---
id: operating-a-small-app
title: Operating a Small App
summary: Establish a manageable routine for health, recovery, costs and feedback so people can keep relying on the product after launch.
version: 0.3.0
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

The routine is illustrated with one invented case. Maya is a fictional first-time founder deciding which problem her business should solve for small independent bakeries. She keeps a small personal research notebook program on her own computer: each entry holds one source, usually a conversation with a bakery owner, with her note about what it showed, and all entries live in one local data file. Suppose the notebook has been built and launched in the simplest sense: Maya now keeps her real research notes in it, and she is both its only user and its operator. Her evidence would be hard to recreate, so its file, backups and program version are what she has to look after.

Nothing here is built, and you do not need to build it. The main scenario is that local-file version. One section later considers a different, made-up hosted version, only to show how usage bills work; the local notebook never becomes that version.

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

This is an **invented, redacted-style scenario**, using made-up dollar amounts rather than vendor prices. It is an optional alternative used only for cost reasoning: imagine the same notebook had instead been built as a hosted web app, with a hosting plan and a storage service billed per request. Maya's local-file notebook has no hosting or storage bill; only the coding-tool subscription would apply to her. Account identifiers and credentials have no place in the record:

```text
Coding-tool subscription: $20 per month, no overage in this scenario
Hosting base charge: $10 per month
Storage requests: $0.001 per billed attempt, including retries
Expected useful operations: 20,000 per month
Usual attempts per operation: 1
Hosting-account warning: hosting + storage charges reach $40; notification only
Enforced monthly spending cap: none demonstrated
```

Each provider's alert covers its own configured billing scope; it does not automatically include another vendor's bill. Track the coding-tool subscription separately. Here, you add the two bills yourself.

Under those assumptions, the expected monthly total is $20 + $10 + $20 = **$50**. If every operation needs its initial attempt plus two retries, 60,000 billed attempts cost $60, making the total **$90**. The useful work stayed at 20,000 operations. Repeated attempts changed the cost.

At ten times the useful work, the same linear assumptions produce $230 with one attempt each, or $630 with three. These are scenario calculations, not a forecast: real service tiers, units, allowances and reporting delays may change the result. Ask the agent to show its assumptions and compare them with the actual bill before deciding.

If the hosting-account alert arrives at $40, what stops further activity? In this example, nothing has been shown to do so. A useful next action is to inspect the retry cause and agree a bounded retry policy and an available usage control. Define the user-visible behavior if work is stopped. Do not disable an essential service merely because an agent guessed that doing so is safe.

Before your first long coding session, [Choosing Your IDE and LLM](contextqb://guides/choosing-your-ide-and-llm) introduces the same billing distinction. The operating record carries it forward as actual usage accumulates.

## Worked first-month record

Every event below is **simulated**, not an observation of a launched notebook. Weeks 1, 2 and 4 follow Maya's local-file notebook; week 3 belongs to the optional hosted alternative above. Use this record to practice decisions, then replace it with evidence from your own product:

- **Week 1 — ordinary use.** Maya records five save-and-reopen attempts with expected values. That supports those attempts, not all future behavior. She schedules a check of backup freshness and the failed-save reporting path.
- **Week 2 — a broken task.** A new version of the program displays an empty list while the saved entries remain present in her data file. Maya freezes unrelated changes and follows [Respond to an Outage](contextqb://playbooks/respond-to-an-outage). That playbook works through this same situation as a tabletop exercise: a discussion of supplied facts and choices on paper, not a real incident. She preserves the data rather than restoring an older backup reflexively.
- **Week 3 — a cost surprise.** In the hosted alternative, the hosting bill projects $70 instead of $30 because three attempts are being billed per operation. Adding the separate $20 coding-tool subscription gives $90 instead of $50 in total. The owner checks the retry evidence and chooses a bounded correction rather than treating the $40 hosting alert as a cap.
- **Week 4 — feedback and maintenance.** Struggling to find an earlier entry among many similar titles, Maya writes in her operating notes that she wants “folders”. She investigates the task through [Review Feedback and Plan the Next Change](contextqb://playbooks/review-feedback-and-plan-the-next-change). A cosmetic code reorganization is deferred because it does not address the observed obstacle. In the hosted alternative, the retry correction gets a defined success check.

Each entry should distinguish observation, interpretation, decision, owner and next check. A missing job result is unknown until investigated; it is not a zero-error result. Keep the record beside the existing project notes rather than inventing a new administration system.

## Maintain the product or retire it deliberately

Update the project map when services, owners, schedules or recovery paths change. [Work With Agents Through Documentation](contextqb://guides/work-with-agents-through-documentation) explains how the next session can inherit those decisions. A recurring agent check is useful only when someone reads its result and notices if the check stops.

If the product no longer serves its purpose, plan retirement: inform affected users under your actual commitments, preserve or export needed information, apply the retention plan and stop unnecessary resources deliberately. For a continuing product, finish each review with one justified next action or a reason to leave it unchanged. Reliable operation includes knowing when there is nothing useful to change.
