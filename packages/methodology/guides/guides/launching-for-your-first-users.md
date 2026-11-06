---
id: launching-for-your-first-users
title: Launching for Your First Users
summary: Choose a first audience, explain the promise and limits, and stay responsible for the result through the launch watch and handoff.
version: 0.3.0
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

What launch means depends on the product. Take one invented example. A community garden has tested an app for volunteers to sign up for watering shifts, replacing a paper sheet on the shed door. The coordinator is ready to invite ten volunteers for the first week. The app is already online, but launch begins when people are asked to depend on it instead of the old arrangement: from then on, a lost signup means plants that nobody waters. Nothing here is built, and you do not need to build it.

A small invitation list makes it easier to observe and respond; it does not make losing a volunteer's assignment acceptable, or remove the obligation to protect their information and tell them about limits. For a personal tool, launch is simply the moment you start keeping real information in it instead of practice data.

## Explain the promise in ordinary language

Prepare a short introduction: what the person can accomplish, how to begin, what information is stored where, important limitations and how to report trouble. Avoid asking people to infer what “beta” means for their work. For the garden, the introduction would say what the app supports: view this week's shifts, take an available shift and see who is responsible for each one. It would state the limit that affects their use: during this pilot, cancellations go through the coordinator, not the app. And it would give one clear contact for trouble. Do not make “beta” carry explanations the volunteers need in order to organize their week. If your product keeps information only on one device or in the browser, say so plainly, including that clearing browser data can remove the only copy unless the person has exported it.

Include any recovery or support promise you are prepared to keep. If a task is unsuitable for sensitive information at this stage, say so before someone enters it. An accurate explanation helps the intended person decide whether the current product meets their need.

## Arrange the watch before making it available

A **launch watch** is a named period in which someone deliberately observes the new release and responds to problems. Choose a time when that person is available. For a solo founder, that may be you; do not imply continuous staffing you do not have.

Use [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) to identify the failure signal, where it appears and what action follows. Set a watch window and review interval suited to the task and expected activity. Name the conditions that would stop expansion, pause a feature or invoke a rehearsed recovery action.

## Execute the existing checklist

[Run a Launch Day Checklist](contextqb://playbooks/launch-day-checklist) owns the pre-flight, delivery, live checks and watch sequence. Give the agent the approved release record and ask it to work only within that authority. Keep unrelated cleanup and feature work outside the launch change.

As [Deploying vs. Launching](contextqb://briefings/deploying-vs-launching) explains, a successful deployment is only one piece of evidence. Verify the intended task on the actual delivered version. Use owned test identities and controlled records where applicable; do not casually create charges, send messages or change someone else's work as a smoke check. A **smoke check** is a small, immediate check that the important path still works in the target. For the garden, the coordinator checks which version is actually delivered, then watches the first genuine signups arrive and confirms that the shared rota shows the expected assignments. If they need to try signing up before anyone else, they use an agreed test identity and a shift they will remove through a supported method, or take a shift they genuinely intend to work. For a single-owner tool, the equivalent is one genuine action the owner wants anyway, such as saving a real record they intend to keep, rather than a fake record left in live data. Made-up records in the working data need an agreed, supported removal method; a check against a copy is evidence about that copy, not the live write path.

## Decide from what you observe

During the watch, compare the actual result with the promised task. One successful attempt does not establish that every person or path works. Silence also needs interpretation: perhaps no one has tried it yet, or the reporting path is broken.

Decide before launch what happens if the main task stops working. If garden signups fail, the coordinator pauses new use of the app and follows the agreed fallback, such as volunteers phoning the coordinator, who keeps a list. During the pause, that list is the only place new assignments are made, so there is still one authoritative record of who waters when. Before reopening the app, the coordinator enters those assignments into it, checks the rota and retires the list. Otherwise two channels could quietly promise the same shift to two people, or leave a shift that each channel thinks the other has covered.

For an ordinary service failure, use [Respond to an Outage](contextqb://playbooks/respond-to-an-outage). Preserve the facts and use the rehearsed response appropriate to the current code and data. For a usability obstacle or request, keep the observation for [Review Feedback and Plan the Next Change](contextqb://playbooks/review-feedback-and-plan-the-next-change). Fixing every suggestion immediately can make the release harder to understand.

## Hand over to routine operation

Close the watch deliberately: record the delivered version, checks, observed use, incidents, remaining limits and who owns the next review. Expand access only when the evidence supports that separate decision. [Operating a Small App](contextqb://guides/operating-a-small-app) supplies the continuing routine.

Before launch, identify who is being invited, what they are being asked to rely on, how you will notice a broken task and who will respond that day. If one of those has no answer, you have a concrete preparation step to finish.
