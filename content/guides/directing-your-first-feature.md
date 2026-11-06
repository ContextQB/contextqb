---
id: directing-your-first-feature
title: Directing Your First Feature
summary: Choose one useful part of your product, brief the agent clearly and decide whether the result is ready to accept.
version: 0.3.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 3
journey_rank: 0
intro: Your first feature should make one meaningful promise you can check. The agent can do the implementation; you choose the promise and judge the result. A worked brief for an invented personal warranty tracker shows what that looks like.
related:
  - checks-tests-and-review
  - designing-your-apps-data
  - feature-build-loop
  - feature-planning
  - how-the-parts-of-your-app-work-together
  - how-to-use-contextqb
  - making-your-app-usable
  - new-project-foundation
  - rehearse-backup-and-recovery
  - review-an-agent-workstream
  - testing-agent-built-software
  - the-mental-model-of-your-app
  - turn-a-feature-brief-into-checks
  - where-your-app-runs
  - work-with-agents-through-documentation
tags:
  - getting-started
  - planning
  - features

---

# Directing Your First Feature

**Plain language:** You can have a substantial product in mind and still begin with one small, useful feature. Decide what a person should be able to accomplish, agree how you will check it, and let the agent build that bounded piece. Your job is to keep the result connected to the promise.

## Get ready for one bounded build

Before building, you need a working description of the product, a place to keep its files and decisions, and appropriate permissions for the agent. If you are new to the tools, use [The Mental Model of Your App](contextqb://guides/the-mental-model-of-your-app) to turn your idea into a one-sentence promise, then complete the setup in Steps 1–7 of [Prepare a New Repo for AI-Assisted Development](contextqb://playbooks/new-project-foundation). Its first-feature step brings you back here. You can read and discuss the example below before you have an IDE open; this page explains everything you need to follow it.

If you have already tried building, bring that experience. Identify what you want to keep, what actually works and what remains uncertain. A convincing demonstration is a useful starting point, but it does not answer whether information survives reopening or whether the next change will break an earlier feature.

## The worked project

This page uses one invented example to show what a good first-feature brief looks like. It is a reading illustration: you do not need to build it, and other lessons use their own examples.

Imagine you want a personal warranty tracker. You buy a kettle, a lamp or a washing machine, and each one comes with a warranty that ends on some date. By the time something breaks, you can never remember whether the cover has run out, and the paperwork is somewhere in a drawer. The tracker is a small tool for your own use.

It would be easy to imagine a large first version: scan receipts, send reminders before warranties end, look products up in a database. None of that is needed for the first useful result. The first feature needs to keep one fact that you can find again: which item, and when its warranty ends.

**What one saved record is.** In this first version, one record represents one item whose warranty you are tracking. It has two fields: the _item name_, such as “Desk lamp,” and the _warranty end date_. If you later want to attach a receipt or record where you bought the item, that would be a deliberate change to the data, not part of this feature.

The first feature has this scope:

- **Person and need:** you want to record an item's warranty end date when you buy it, so the date is there when something breaks and you need to know whether it is still covered.
- **Useful behavior:** enter an item name and a warranty end date, save them, close the app, then reopen it on the same device, in the same browser profile or app installation, and see those same values.
- **Input rules:** the item name must contain something besides whitespace: blank characters such as spaces, tabs and line breaks. Remove whitespace at the beginning and end of an accepted name; preserve spacing within it. The end date must be a real calendar date, so 31 June 2028 is refused because June has 30 days. A date in the past is allowed: an expired warranty is still worth recording, because it tells you not to spend time on a claim.
- **Failure behavior:** if saving fails, do not show success or discard what was typed. Explain that the item has not been saved and let the person try again. Otherwise you might walk away believing the end date was recorded, and discover it is missing only when something breaks. The tracker records a date, not proof of purchase: keep the receipt wherever a warranty claim might need it.
- **First target:** a local test copy with synthetic data: made-up practice items you can safely delete. The agent proposes storage appropriate to that target, explains where the records are kept and what could remove them, such as clearing browser data or deleting a file.
- **Excluded from this feature:** uploading or scanning receipts, reminders, sharing with other people, automatic warranty lookup, accounts, cross-device synchronization and search. With a handful of items, reading the list is enough; search is worth adding once there are many.

For a concrete example, save “Desk lamp” with a warranty end date of 30 June 2028. After closing and reopening the app, the lamp should still be listed with exactly that date, not a day earlier or later. Some ways of storing dates convert them through time zones, and that can quietly shift a date with no time attached. An item name containing only spaces should be refused with an explanation the person can act on. So should 31 June 2028. An end date of 15 January 2024 should be accepted.

Whoever writes the brief owns those expectations: in this example, the person tracking their warranties; on your project, you. The agent can propose improvements, but it should not silently replace them with whatever is easiest to implement.

If you are working on your own product, write an equivalent short brief for one useful behavior. Name the person and what they need, what one record represents, the result you will check after reopening, one input that must be refused, what the person sees if the action fails, and what is excluded. For a booking tool, one record might be one booking: a time, a service and the customer's name. The check might be that a booking made today is still listed after the app is reopened, and a booking with no time is refused. You do not need to build the warranty tracker first.

## Build a small complete path

A complete path reaches the result the person needs. For the warranty tracker, a polished entry form that never saves is incomplete. A storage function with no way for the intended person to use it is also incomplete for this feature. Enter, save and retrieve: that is a small complete result. Follow the information through the application using [How the Parts of Your App Work Together](contextqb://guides/how-the-parts-of-your-app-work-together).

Small scope means limiting the promise. It does not mean omitting the parts needed to keep that promise. Reminders can wait; saving and reopening cannot, because they are the point of this feature.

Keep a short list of later ideas in the project's existing notes. When the agent suggests adding reminders or receipt scanning, ask whether they are needed for this feature's agreed result. A plausible future feature does not have to become today's work.

## Turn the brief into a plan

Use [Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning) to have the agent identify the files, responsibilities, data ownership, coordinating function, risks and exclusions. That playbook owns the planning procedure; this guide helps you judge its output.

Read the goal and exclusions first. Then ask the agent to explain any structural term you cannot connect to the product. You should be able to say where the saved record lives, what happens if writing fails and which part coordinates saving. Ask it to distinguish existing files from proposed additions.

Before implementation, define the checks in [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) and [Turn a Feature Brief Into Checks](contextqb://playbooks/turn-a-feature-brief-into-checks). You can choose the expected behavior now even though the automated check will run later. This prevents the code from quietly becoming the specification for its own tests.

## Approve work you can inspect

When the plan matches your intent, authorize that plan. For a feature involving several parts, use the existing [feature build loop](contextqb://playbooks/feature-build-loop), which separates implementation from verification. That playbook also defines the proportional path for a small change. You do not need to invent another management system to use this lesson.

Before edits, have the agent identify a source checkpoint: a saved snapshot of the project files that you can return to. Have it explain which files and test data it will use. A source checkpoint lets you recover code; it does not automatically recover a database or an outside service. Keep this first exercise in its local test setting.

If implementation reveals a missing decision, return to the affected part of the plan. For example, if the agent discovers the selected storage is temporary, decide how to meet the reopening requirement before continuing. Do not silently weaken the requirement to make a passing result easier.

## Inspect what came back

Ask the agent to show the changed files, checks it ran, results and unresolved concerns. Use the feature yourself with the agreed example. Confirm that the reopened app reads the saved values, rather than relying on a success message or screenshot from the original session.

Have the change reviewed independently as the build procedure requires: use a fresh agent session that did not write the code, or another person, with [Review an Agent Workstream Result](contextqb://prompts/review-an-agent-workstream). You can recognize a wrong product outcome without understanding every line of code; an independent reviewer can examine the implementation and checks. Those are complementary responsibilities. Neither a review nor a test run makes the application's remaining work disappear.

Accept the feature only within the scope demonstrated. Before using it for a team's private information or paying customers, work through the additional protection and readiness decisions those uses require.

## Leave a useful next step

Update the feature record with what was accepted, the evidence, remaining concerns and the next authorized action. If the project has no feature record yet, create one short note named for the feature wherever the project keeps its documentation. [Work With Agents Through Documentation](contextqb://guides/work-with-agents-through-documentation) explains how to carry that understanding between sessions. A new chat should not have to reconstruct your decision from a long conversation.

Before continuing, explain these three things in your own words: why this feature is useful to the person it serves (the warranty tracker's owner, or your own user), which check would expose a false “Saved” message, and which later idea you deliberately excluded. If you can answer, you have more than generated files: you have a decision you can defend and a result you know how to inspect.
