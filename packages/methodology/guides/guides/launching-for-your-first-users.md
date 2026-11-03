---
id: launching-for-your-first-users
title: Launching for Your First Users
summary: Choose a first audience, explain the promise and limits, and stay responsible for the result through the launch watch and handoff.
version: 0.1.2
audience: [novice-builder, founder, operator]
journey_stage: 8
journey_rank: 0
intro: Launching means inviting someone to depend on what you built. Make the first promise manageable and stay available to learn what happens.
related:
  - deploying-vs-launching
  - how-to-use-contextqb
  - launch-day-checklist
  - operating-a-small-app
  - preparing-for-real-users
  - release-readiness
  - respond-to-an-outage
  - review-feedback-and-plan-the-next-change
  - set-up-useful-monitoring
tags: [launch, getting-started]

---

# Launching for Your First Users

**Plain language:** Your first launch should make a useful promise to an audience you can support. Choose who will use it, explain what is ready and stay available while they begin. A quiet first release can be a serious step forward.

## Choose a scope you can support

Start with the decision from [Preparing for Real Users](contextqb://guides/preparing-for-real-users) and the findings from [Release Readiness Audit](contextqb://audits/release-readiness). Name the version, audience and supported task. Keep the first audience small enough that you can respond to what you learn, while still including people with the need you intend to serve.

For the local notebook, launch may mean moving from disposable practice notes to your own real work. For a team product, it may mean inviting a few colleagues under agreed access rules. A small audience reduces exposure; it does not remove the obligation to protect their information or tell them about limits.

## Explain the promise in ordinary language

Prepare a short introduction: what the person can accomplish, how to begin, what information is stored where, important limitations and how to report trouble. Avoid asking people to infer what “beta” means for their work. State the actual limitation, such as “notes are kept on this device; moving to another device does not copy them.” For browser storage, also explain that clearing browser data or browser storage policies can remove the only copy unless the person has exported it.

Include any recovery or support promise you are prepared to keep. If a task is unsuitable for sensitive information at this stage, say so before someone enters it. An accurate explanation helps the intended person decide whether the current product meets their need.

## Arrange the watch before making it available

A **launch watch** is a named period in which someone deliberately observes the new release and responds to problems. Choose a time when that person is available. For a solo founder, that may be you; do not imply continuous staffing you do not have.

Use [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) to identify the failure signal, where it appears and what action follows. Set a watch window and review interval suited to the task and expected activity. Name the conditions that would stop expansion, pause a feature or invoke a rehearsed recovery action.

## Execute the existing checklist

[Run a Launch Day Checklist](contextqb://playbooks/launch-day-checklist) owns the pre-flight, delivery, live checks and watch sequence. Give the agent the approved release record and ask it to work only within that authority. Keep unrelated cleanup and feature work outside the launch change.

As [Deploying vs. Launching](contextqb://briefings/deploying-vs-launching) explains, a successful deployment is only one piece of evidence. Verify the intended task on the actual delivered version. Use owned test identities and controlled records where applicable; do not casually create charges, send messages or change someone else's work as a smoke check. A **smoke check** is a small, immediate check that the important path still works in the target. For a single-owner local notebook, save a real note you intend to keep or check writing against a copy first. Made-up records in the working notebook need an agreed, supported removal method; a check against a copy is evidence about that copy, not the live write path.

## Decide from what you observe

During the watch, compare the actual result with the promised task. One successful attempt does not establish that every person or path works. Silence also needs interpretation: perhaps no one has tried it yet, or the reporting path is broken.

For an ordinary service failure, use [Respond to an Outage](contextqb://playbooks/respond-to-an-outage). Preserve the facts and use the rehearsed response appropriate to the current code and data. For a usability obstacle or request, keep the observation for [Review Feedback and Plan the Next Change](contextqb://playbooks/review-feedback-and-plan-the-next-change). Fixing every suggestion immediately can make the release harder to understand.

## Hand over to routine operation

Close the watch deliberately: record the delivered version, checks, observed use, incidents, remaining limits and who owns the next review. Expand access only when the evidence supports that separate decision. [Operating a Small App](contextqb://guides/operating-a-small-app) supplies the continuing routine.

Before launch, explain who will rely on the app, who will notice a failed task and what happens next. If one of those has no answer, you have a concrete preparation step to finish.
