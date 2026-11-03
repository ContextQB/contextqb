---
id: deploying-vs-launching
title: Deploying vs. Launching
summary: Delivering a version to a target and inviting people to depend on it are separate decisions, supported by different evidence.
version: 0.1.1
audience: [novice-builder, founder, operator]
journey_stage: 3
journey_rank: 80
framing: If the deploy succeeded, what still needs to happen before people use the product?
related:
  - where-your-app-runs
  - preparing-for-real-users
  - launching-for-your-first-users
  - launch-day-checklist
tags: [deploy, launch]

---

# Deploying vs. Launching

**Deploying** puts a chosen application version into an environment where it can run. **Launching** makes a promise to an intended audience: this is ready for the use you are inviting. They may happen together, but a successful deployment does not supply the launch decision.

For a local tool, installing or distributing a package is the equivalent delivery step. Production can be your own working installation. [Where Your App Runs](contextqb://guides/where-your-app-runs) explains how to identify the version, settings and data in that target.

## Read what the evidence actually says

“Build passed” says the files could be prepared under the build's conditions. “Deployment succeeded” says the platform accepted and placed that version. “Saved and reopened the note on the deployed version” supplies evidence about a specific running task. “Ready for this audience” needs a decision covering the intended use and remaining risks.

An unlisted preview link is not an access restriction. If strangers can reach it, it has public exposure even if you have not announced it. Verify the boundary you intend before treating it as a private rehearsal.

## Classify three situations

These are illustrative decisions:

1. **A candidate is installed in a disposable directory and only you test made-up notes.** Delivery and a rehearsal; not yet an invitation to rely on it. Record the task results and gaps.
2. **A web version is deployed behind verified restricted access, then you invite two team members to use it for their work.** The deploy and the small launch are distinct steps. Those people's real work brings readiness and support obligations even though the audience is small.
3. **The code is already running and you enable a feature for customers.** No new code delivery may be needed, but this is still a launch decision about changed availability and behavior.

For your own project, name the action that changes who can rely on the app. Use [Preparing for Real Users](contextqb://guides/preparing-for-real-users) before that decision and [Launching for Your First Users](contextqb://guides/launching-for-your-first-users) to prepare the watch. [Run a Launch Day Checklist](contextqb://playbooks/launch-day-checklist) remains the execution procedure.
