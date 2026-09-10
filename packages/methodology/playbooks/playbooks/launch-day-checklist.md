---
id: launch-day-checklist
title: Run a Launch Day Checklist
summary: The going-live procedure — pre-flight verification, the deploy itself, live smoke checks, monitoring watch, and a rollback path you have actually tested. Launch is a stage, not a vibe.
version: 0.1.1
problem: |
  First launches fail in predictable ways: something passed locally but was never checked in production, an environment variable is missing, nobody is watching when the first real user hits an error, and when it goes wrong there is no practised way back. The fix is not courage — it is a checklist run in order.
when_to_use: |
  The day you take a feature or product live to real users — first deploy to production, opening a waitlist to the public, flipping a hostname. Also reusable for any deploy whose blast radius makes you nervous.
expected_outputs:
  - A go/no-go decision recorded with evidence, not vibes.
  - A deploy executed against a written sequence.
  - Live verification results (not local ones) for every critical flow.
  - A monitoring watch with a named person and a named window.
  - A rollback plan that has been tested at least once.
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 8
journey_rank: 0
related:
  - detect-security-drift
  - feature-build-loop
  - operations-baseline
  - pre-launch-security
  - public-endpoint-exposure
  - respond-to-a-suspected-compromise
  - the-plan-is-the-contract
related_principles:
  - failure-modes
  - public-endpoints-are-battlegrounds
  - security-drift-is-the-real-threat
tags:
  - launch
  - deploy
  - operations
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review Q3 (authored 2026-09-09)"
  reviewer_notes: "Maintainer-approved for publish 2026-09-09. Authored from gap G-01 — stage 8 (Launch) was the corpus's only empty non-deferred stage. Deliberately operational (no code), in the corpus's step-by-step playbook voice."
---

# Run a Launch Day Checklist

**Plain language:** Launch day is not the day to improvise. This playbook is the ordered list you run from "we think we're ready" to "it's live and we're watching it" — with a way back if it goes wrong.

## When to use this

- First production deploy of a new product or feature
- Opening something from private (just-you, trusted-group) to public
- Moving a hostname or cutting over infrastructure
- Any deploy where the answer to "what if it breaks?" is currently "uhh…"

If you have never launched before: nervous is normal. The checklist is how nervous becomes careful instead of frozen.

## Before you start

You need, already done:

- **A passing pre-launch security gate.** Run [`pre-launch-security`](contextqb://audits/pre-launch-security) in the days before launch, not the morning of. Anything it flags as a blocker is a launch blocker.
- **A rollback path you have tested.** "We can revert" is not a rollback plan. A rollback plan names the exact command or dashboard action, the person who runs it, and the signal that triggers it — and you have done it once in staging (or on a preview deploy) before today.
- **Somewhere to watch.** At minimum: your platform's logs or error dashboard open in a tab (Cloudflare / Vercel / Supabase), plus one place users can report trouble that you will actually read today.

## Step 1 — Pre-flight (T-minus one hour)

Confirm each of these with evidence, in production configuration — not from memory:

- [ ] The build is green in CI on the exact commit you are about to deploy.
- [ ] Environment variables and secrets exist **in the production environment**, not just locally. Count them against your local `.env.example` or secrets inventory.
- [ ] Database migrations (if any) have been applied or are part of the deploy sequence, in the right order.
- [ ] The drift check (`contextqb check` or equivalent) passes — the map matches what you are about to ship.
- [ ] Your rollback command works: you know it, and it has been run before.

Any unchecked box is a **no-go** until resolved. This is the discipline: the checklist decides, not adrenaline.

## Step 2 — Deploy (the smallest public step)

- Deploy to production. If your platform supports it, prefer a staged or preview-then-promote path over a single global flip.
- Record the deploy: time, commit, who ran it. One line in a status doc or chat is enough — you are writing the first entry of the incident log you hope never to need.
- Do not bundle "one more quick change" into the launch deploy. The launch deploy contains exactly what was verified. Nothing else.

## Step 3 — Live verification (T+0 to T+30)

In the live environment, with your own hands (then with an agent re-checking), walk the critical flows:

- [ ] The app loads at the public URL.
- [ ] Sign-up and sign-in work end to end.
- [ ] The one thing your app exists to do — the core flow — works with real data.
- [ ] Every new public endpoint responds as intended (see [`public-endpoint-exposure`](contextqb://audits/public-endpoint-exposure) if you have not run it).
- [ ] Errors render as your designed error state, not a stack trace.

Write down what you verified and what you saw. "Verified: signup → first project → save → reload" is a record. "Looks good" is not.

## Step 4 — The watch (the rest of launch day)

Launch day ends when the watch ends, not when the deploy lands.

- Name the window: the first 4–24 hours, depending on traffic.
- Name the watcher: a specific person (you, on a first launch) who checks logs and error dashboards on a schedule — say, every 30–60 minutes — not just when someone complains.
- Know your first-user signals: sign-ups appearing, the first error spike, the first support message. Each gets a response, even if the response is "noted, watching."

## Step 5 — If it goes wrong

Do not debug in production under adrenaline. Follow the decision rule:

1. **Broken for everyone or unsafe?** Roll back now. That is what the tested rollback path is for. Investigate after the bleeding stops — [`respond-to-a-suspected-compromise`](contextqb://playbooks/respond-to-a-suspected-compromise) if the cause might be security-relevant.
2. **Broken for some / degraded?** Decide: roll back or hotfix forward — but decide against the written rollback trigger you named in pre-flight, not against your mood.
3. **Cosmetic?** Log it, add it to tomorrow's list, keep watching.

Whatever happens, write the post-launch note the same day: what shipped, what surprised you, what you'll check earlier next time.

## How to brief the agent on launch day

> We are launching today. The plan and the launch checklist are at [paths]. Your job today is verification, not invention: walk each checklist item, produce evidence (commands run, output observed), and flag anything you cannot verify as a launch blocker. Do not write code today unless I explicitly approve a hotfix. If you find a problem, report it with the evidence — do not quietly fix it.

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
- [ ] The rollback plan is written, tested, and unneeded (so far).
- [ ] A same-day post-launch note exists.

You are launched when the watch ends cleanly. Tomorrow, the stage changes: you are now in operations — see stage 9, starting with [`operations-baseline`](contextqb://audits/operations-baseline) and the drift-detection cadence you already have.
