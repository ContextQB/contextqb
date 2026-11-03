---
id: operations-baseline
title: Operations Baseline Audit
summary: A recurring audit of the boring machinery that keeps a live application alive — monitoring, logging, alerting, backups, dependency health, and cost. Check preparation before launch, then repeat on the running system and on an agreed cadence.
version: 0.2.1
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 9
journey_rank: 10
objective: |
  Verify that the candidate or live application has the appropriate operational posture to detect trouble, survive data loss, and answer "what happened?" — before an incident tests it for you.
scope: |
  The candidate preparation or running system as operated: monitoring and alerting, logging, backups and restore paths, dependency and vendor health, cost and quota drift, and the runbook surface. Security posture is out of scope — that is the Application Security Baseline audit's job.
required_sections:
  - Executive summary
  - Monitoring and alerting inventory
  - Logging posture
  - Backup and restore verification
  - Dependency and vendor watch
  - Cost and quota drift
  - Runbook and ownership surface
  - Blocking findings
  - Non-blocking suggestions
evaluation_criteria:
  - Every critical user flow has at least one signal that would fire if it broke.
  - Alerts route to a place a human actually reads, with a named owner.
  - Backups exist AND a restore has been tested or rehearsed.
  - Every third-party dependency has a named owner and a "what breaks if it dies" answer.
  - Logs answer "what happened?" without containing secrets or PII.
deliverables:
  - A single Markdown document with the required sections.
  - A prioritised list of operational gaps.
related:
  - detect-security-drift
  - documentation-as-architecture
  - failure-modes
  - launch-day-checklist
  - operating-a-small-app
  - pre-launch-security
  - rehearse-backup-and-recovery
  - release-readiness
  - respond-to-a-suspected-compromise
  - respond-to-an-outage
  - security-drift-is-the-real-threat
  - security-regression
  - set-up-useful-monitoring
  - suspicious-behavior-investigation
tags:
  - operations
  - audit
  - monitoring

---

# Operations Baseline Audit

**Plain language:** Security audits get the attention, but most apps that die young die of neglect — nobody watched the logs, nobody tested the backup, nobody noticed the dependency that deprecated itself last month. This audit checks the boring machinery that keeps a live app alive.

Use [Operating a Small App](contextqb://guides/operating-a-small-app) for the learner's routine and its worked cost/first-month record. This audit can inspect preparation before launch, then verify the actual running arrangement afterward. [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) owns signal implementation and testing; [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) owns recovery evidence. State the target and any untested delivery or recovery link.

## When to use this

- Before launch, to inspect operational preparation; after launch, to confirm the actual arrangement
- Monthly or quarterly thereafter, on a calendar — not when something smells wrong
- After any incident, to catch the posture gap that let it happen
- When a dependency announces a deprecation and you realise you don't have a list of your dependencies

## Use this as an agent instruction

> You are performing an operations baseline audit of this application. State whether the target is a pre-launch candidate or a live application. Distinguish prepared configuration from observed operation. Your job is not features and not security — it is the machinery that detects trouble, survives data loss, and answers "what happened?" at 2am.
>
> Read the project instructions, deployment configuration, CI workflows, environment setup, and any monitoring/logging configuration. You cannot see provider dashboards: use the settings exports and screenshots the operator gives you, and mark anything you could not see as UNKNOWN. Never copy a secret or personal data into the report. Then produce a Markdown document with these sections, in order:
>
> 1. **Executive summary.** 3–5 bullets: the overall operational posture and the single most important gap.
> 2. **Monitoring and alerting inventory.** For each critical user flow (the core action, sign-in if accounts exist, checkout/payment if offered): what signal fires if it breaks? Where does that signal go? Who reads it? Flag any critical flow with no signal.
> 3. **Logging posture.** What is logged, where, with what retention? Could you reconstruct "what happened to user X at time T" from logs alone? Flag any logs containing secrets or PII.
> 4. **Backup and restore verification.** What is backed up, where, how often? When was a restore last tested, by whom, onto what, and what evidence shows it worked (for example, the restored copy's record counts or a check you ran against it)? A backup that has never been restored is a hypothesis, not a backup: report "backup exists, restore untested" as UNKNOWN, never as a pass. Do not run a restore yourself; the operator performs or witnesses it, on a non-production copy.
> 5. **Dependency and vendor watch.** Every third-party service the app depends on (auth, database, payments, email, AI provider, hosting), and every agent-run component: scheduled agents, agent-run jobs, and the MCP servers the app or its developers rely on. For each: who owns it, what breaks if it goes down or misbehaves, and how would we notice a deprecation announcement or a run that silently stopped?
> 6. **Cost and quota drift.** Current monthly cost per service, with source, billed unit, included allowance, reporting delay and assumptions — including model and agent spend, both the app's own model calls and the coding agents and scheduled agents that run on its behalf — quota headroom (rate limits, storage, invocations), and what happens at 10× usage. Identify the agreed warning and enforcement controls, or the reason no metered control applies. Distinguish quotas from monthly spend caps and show whether a hard spending limit is actually configured: an alert notifies, it does not stop spending ([provider consoles and spending limits](contextqb://references/setup#provider-console)).
> 7. **Runbook and ownership surface.** If the app breaks tonight, is there a document that says what to check first? Who is "on call" (even if that's just you)? Do `AGENTS.md` and `context.qb.yaml` reflect the system as it runs today?
> 8. **Blocking findings.** Gaps that should be fixed this week — a critical flow with no alerting, an untested backup, an orphan dependency.
> 9. **Non-blocking suggestions.** Improvements that can wait.
>
> Be specific. Reference real dashboards, config files, and cron jobs. Do not write code. Do not give generic "you should monitor" advice — every finding names the flow, the missing signal, and the concrete place to add it.

The cost scenario in [Operating a Small App](contextqb://guides/operating-a-small-app) shows how repeated attempts can increase the bill without increasing useful work. Apply its questions to actual usage and provider terms; the scenario's invented prices are not a reference table. For ordinary failures, use [Respond to an Outage](contextqb://playbooks/respond-to-an-outage).

## How to read the output

- **Start with blocking findings.** An app with no alerting on its core flow is flying blind — that is a this-week fix.
- **The restore test is the tell.** If the audit reports "backups exist" but no restore has ever been run, treat the backup as absent until tested. Do the restore yourself, or watch it done, on a copy — that is the one part of this audit you should not delegate.
- **Run it on a schedule if you like.** An agent can run this audit monthly and leave you the report to read. That is an option you can set up later; the audit works by hand too.
- **Compare against last time.** On the second and later runs, the delta is the story: new dependencies, new costs, new unmonitored flows. Save each report; the cadence is the point.

## Common mistakes

- **Monitoring the server, not the flow.** "CPU fine" is not "users can sign in." Alerts belong on user-facing flows.
- **Alerts nobody reads.** An alert channel muted since March is not alerting; it is archiving.
- **Backup existence without restore rehearsal.** The failure mode of backups is discovering the restore doesn't work during the incident.
- **Deprecations learned from the outage.** Vendor deprecation emails are operational signals; somebody has to read them.
- **PII in logs.** An operational convenience that becomes a privacy incident. Check before you need the logs.

## What "good enough" looks like

- [ ] Every critical flow has a signal and every signal has a reader.
- [ ] A restore has been tested within the last quarter.
- [ ] Every third-party dependency has an owner and a "what breaks" answer.
- [ ] Every metered service has an agreed warning or usage control — including model and agent spend — and you know what actually enforces a limit and what only notifies.
- [ ] Every scheduled agent, agent-run job and MCP server has an owner and a "what breaks" answer.
- [ ] A short runbook exists: what to check first, in what order, and who does it.
- [ ] The next audit date is on the calendar.

## See also

- [Playbook: Run a Launch Day Checklist](contextqb://playbooks/launch-day-checklist) — the day before this audit's world begins
- [Playbook: Detect Security Drift](contextqb://playbooks/detect-security-drift) — the security-side drift instrument
- [Audit: Security Regression](contextqb://audits/security-regression) — change-focused security comparison
- [Playbook: Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise) — when the baseline audit finds something already on fire
- [Prompt: Suspicious Behavior Investigation](contextqb://prompts/suspicious-behavior-investigation) — for the anomalies the monitoring surfaces
