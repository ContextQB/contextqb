---
id: launch-day-checklist
title: Run a Launch Day Checklist
summary: The going-live procedure — pre-flight verification, the deploy itself, live smoke checks, monitoring watch, and a recovery path you have actually tested. Launch is a stage, not a vibe.
version: 0.2.4
problem: |
  First launches fail in predictable ways: something passed locally but was never checked in production, an environment variable is missing, nobody is watching when the first real user hits an error, and when it goes wrong there is no practised way back. The fix is not courage — it is a checklist run in order.
when_to_use: |
  The day you take a feature or product live to real users — first deploy to production, opening a waitlist to the public, flipping a hostname. Also reusable for any deploy whose blast radius makes you nervous.
expected_outputs:
  - A go/no-go decision recorded with evidence, not vibes.
  - A deploy executed against a written sequence.
  - Live verification results (not local ones) for every critical flow.
  - A monitoring watch with a named person and a named window.
  - A rehearsed recovery plan covering compatible code and any stored-data change.
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 8
journey_rank: 10
related:
  - building-for-yourself-vs-others
  - deploying-vs-launching
  - detect-security-drift
  - feature-build-loop
  - launching-for-your-first-users
  - operating-a-small-app
  - operations-baseline
  - pre-launch-security
  - public-endpoint-exposure
  - rehearse-backup-and-recovery
  - release-readiness
  - respond-to-a-suspected-compromise
  - respond-to-an-outage
  - rollback-vs-restore
  - set-up-useful-monitoring
  - suspicious-behavior-investigation
  - the-plan-is-the-contract
related_principles:
  - failure-modes
  - public-endpoints-are-battlegrounds
  - security-drift-is-the-real-threat
tags:
  - launch
  - deploy
  - operations

---

# Run a Launch Day Checklist

**Plain language:** Launch day is not the day to improvise. This playbook is the ordered list you run from "we think we're ready" to "it's live and we're watching it" — with a way back if it goes wrong.

Use [Launching for Your First Users](contextqb://guides/launching-for-your-first-users) for the learner's decisions and [Release Readiness Audit](contextqb://audits/release-readiness) for the broader evidence assessment. This playbook owns execution after the owner's go decision. Apply it to the declared audience and channel: a personal installation can be a launch, with its installed package and local results in place of a public URL and hosting dashboard.

## When to use this

- First production deploy of a new product or feature
- Opening something from private (just-you, trusted-group) to public — the tier change that turns a deploy into a launch ([Building for Yourself vs. Building for Others](contextqb://guides/building-for-yourself-vs-others))
- Moving a hostname or cutting over infrastructure
- Any deploy where the answer to "what if it breaks?" is currently "uhh…"

If you have never launched before: nervous is normal. The checklist is how nervous becomes careful instead of frozen.

## Before you start

You need, already done:

- **A passing applicable pre-launch security gate.** Record why any check is not applicable to this product. Run [`pre-launch-security`](contextqb://audits/pre-launch-security) in the days before launch, not the morning of. Anything it flags as a blocker is a launch blocker.
- **A recovery path you have tested.** Name the exact command or action, the person who runs it and the trigger. Rehearse in a controlled target before today. [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) distinguishes code recovery from data recovery; verify compatibility and any loss of newer records. [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) supplies the data procedure. An agent can help with the rehearsal; actual recovery follows the owner's authority.
- **Somewhere to watch.** Use the appropriate hosted or local task signal, plus one place users can report trouble that you will actually read today. [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) connects detection, receipt and response.

## Step 1 — Pre-flight (T-minus one hour)

Confirm each applicable item for the intended production configuration, using read-only inspection and the separate rehearsals. Record evidence and justified exclusions; do not execute the recovery action merely to check this list:

- [ ] The required build and checks pass for the exact candidate. Record CI results, or the agreed local checks when this project has no CI, including any uncommitted source changes.
- [ ] Environment variables and secrets exist **in the production environment**, not just locally. Count them against your local `.env.example` or secrets inventory.
- [ ] Database migrations (if any) have been applied or are part of the deploy sequence, in the right order.
- [ ] The drift check (`contextqb check` or equivalent) passes — the map matches what you are about to ship.
- [ ] The recovery procedure has been rehearsed and remains compatible with the candidate's data format; any data-loss decision is recorded.
- [ ] Scheduled and background agents that could change this release target are paused for the launch window. No agent deploys or merges anything today unless you explicitly approve that one change.

Any unresolved applicable requirement is a **no-go**; an explicit, justified non-applicable item is not a failed requirement. This is the discipline: the checklist decides, not adrenaline.

## Step 2 — Deploy (the smallest delivery step)

- Execute the approved delivery to the intended target: deploy a hosted version or install/distribute the agreed local package. If supported, use the rehearsed staged or preview-then-promote path.
- Record the delivery: time and time zone, source and artifact identifiers, target, settings description and who ran it. One line in a status doc or chat is enough — you are writing the first entry of the incident log you hope never to need.
- Do not bundle "one more quick change" into the launch deploy. The launch deploy contains exactly what was verified. Nothing else.

## Step 3 — Live verification (T+0 to T+30)

In the live environment, with your own hands (then with an agent re-checking), walk the critical flows:

- [ ] The intended version loads at its actual URL or installed location.
- [ ] Sign-up and sign-in work end to end if accounts are part of this release; otherwise record the actual access boundary and why the account check is not applicable.
- [ ] The one thing your app exists to do — the core flow — works with controlled records appropriate to that target. For a single-owner local tool, the owner can use a real record they intend to keep. For example, the owner of a personal pantry app adds a tin of beans that is actually on their shelf and that they intend to keep in the list, then reopens the delivered app and checks that the item is there. That is a genuine use of the intended setup. Testing a disposable copy instead is a narrower result: it does not establish that the working copy can save. Invented items left in the real pantry list would make it less trustworthy. In a product with other records, use an equivalent genuine action the owner wants anyway, such as a real booking for themselves. Made-up records left in live data need a supported removal method. If writing is checked only against a copy, label that limit and leave the actual target's write check pending. Any real messages, charges or other consequential effects require their own authority.
- [ ] Every applicable new public endpoint responds as intended (see [`public-endpoint-exposure`](contextqb://audits/public-endpoint-exposure) if you have not run it).
- [ ] Errors render as your designed error state, not a stack trace.

Write down what you verified and what you saw. "Verified: signup → first project → save → reload" is a record. "Looks good" is not.

## Step 4 — The watch (the rest of launch day)

Launch day ends when the watch ends, not when the deploy lands.

- Name a watch window suited to the task and expected activity. A first-day window of 4–24 hours is an example, not a universal minimum.
- Name the watcher: a specific person (you, on a first launch) who checks logs and error dashboards on a schedule — say, every 30–60 minutes — not just when someone complains.
- An agent can help watch — reading logs and flagging anomalies with the [suspicious behavior investigation](contextqb://prompts/suspicious-behavior-investigation) prompt — but it does not replace the named watcher, and it takes no action itself. You decide what happens next.
- Know your first-user signals: sign-ups appearing, the first error spike, the first support message. Each gets a response, even if the response is "noted, watching."

## Step 5 — If it goes wrong

Do not debug in production under adrenaline. Follow the decision rule:

1. **Broken for everyone or unsafe?** Stop expanding access and use the rehearsed mitigation appropriate to the current code and data. A code rollback is suitable only if that version remains compatible. Follow [Respond to an Outage](contextqb://playbooks/respond-to-an-outage); use [Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise) if the cause might be security-relevant.
2. **Broken for some / degraded?** Compare the affected task with the written recovery trigger and choose a compatible mitigation or bounded forward repair under the owner's authority.
3. **Cosmetic?** Log it, add it to tomorrow's list, keep watching.

Whatever happens, write the post-launch note the same day: what shipped, what surprised you, what you'll check earlier next time.

## How to brief the agent on launch day

> We are launching today. The plan and the launch checklist are at [paths]. Do not deploy, merge, or start any background or scheduled work today unless I approve that specific action. Your job today is verification, not invention: walk each checklist item, produce evidence (commands run, output observed), and flag anything you cannot verify as a launch blocker. Do not write code today unless I explicitly approve a hotfix. If you find a problem, report it with the evidence — do not quietly fix it.

That instruction — verify, don't improvise — is the whole launch-day posture for an agent.

## Anti-patterns

- **The Friday-evening launch.** Launch when you can watch it. A Tuesday morning with eyes on logs beats a Friday night with hopes and prayers.
- **"It worked locally."** The four words before every launch incident. Production configuration is a different system; verify in it.
- **Bundling the launch with cleanup.** Every extra change in the launch deploy is an extra suspect when something breaks.
- **No rollback test.** The first time you run your rollback should not be during the incident.
- **Launching and logging off.** The watch is part of the launch. If nobody is watching, you have not finished launching.

## What "good enough" looks like

- [ ] Pre-flight evidence exists for every box, gathered today.
- [ ] The deploy sequence was followed from the written list, not from memory.
- [ ] Critical flows were verified live, with notes.
- [ ] The watch has a named person, a window, and a place they are looking.
- [ ] The recovery plan is written and rehearsed; any recovery action and its results are recorded.
- [ ] A same-day post-launch note exists.

You are launched when the watch ends cleanly. Carry the handoff into [Operating a Small App](contextqb://guides/operating-a-small-app), which covers keeping the product running once launch day is over. That routine includes the [`operations-baseline`](contextqb://audits/operations-baseline) audit and the drift-detection cadence you already have.
