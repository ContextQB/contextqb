---
id: directing-your-first-feature
title: Directing Your First Feature
summary: Choose one useful part of your product, brief the agent clearly and decide whether the result is ready to accept.
version: 0.1.5
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 3
journey_rank: 0
intro: Your first feature should make one meaningful promise you can check. The agent can do the implementation; you choose the promise and judge the result.
related:
  - checks-tests-and-review
  - designing-your-apps-data
  - feature-build-loop
  - feature-planning
  - how-the-parts-of-your-app-work-together
  - how-to-use-contextqb
  - making-your-app-usable
  - new-project-foundation
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

Before this lesson, you need a working description of the product, a place to keep its files and decisions, and appropriate permissions for the agent. If you are new to the tools, use [The Mental Model of Your App](contextqb://guides/the-mental-model-of-your-app), then complete the setup in Steps 1–7 of [Prepare a New Repo for AI-Assisted Development](contextqb://playbooks/new-project-foundation). Its first-feature step brings you back here. You can discuss the example below before you have an IDE open.

If you have already tried building, bring that experience. Identify what you want to keep, what actually works and what remains uncertain. A convincing demonstration is a useful starting point, but it does not answer whether information survives reopening or whether the next change will break an earlier feature.

## The worked project

This is the shared illustrative brief for these first-feature lessons. The product is a **research notebook**: a reading list with notes that helps someone keep track of useful sources while exploring a problem. It is a learning example, not an implemented application or evidence of customer demand.

The first feature has this scope:

- **Person and need:** one researcher wants to keep a source title and their own note together so they can return to the thought later.
- **Useful behavior:** enter a title and note, save them, then reopen the app in the same browser profile or app installation on the same device and read the saved values.
- **Input rule:** both title and note must contain something besides whitespace: blank characters such as spaces, tabs and line breaks. Remove whitespace at the beginning and end of accepted values; preserve spacing within the text.
- **Failure behavior:** if saving fails, do not show success or discard the draft. Explain that it has not been saved and let the person try again.
- **First target:** local, single-user use with synthetic data: made-up practice values you can safely delete. The agent proposes storage appropriate to that target and explains its limits.
- **Excluded from this feature:** team sharing, accounts, payments, automatic article fetching, cross-device synchronization and AI summaries.

For a concrete example, save the title “Interview notes” and the note “Ask how the team finds old decisions.” After closing and reopening the app, those values should still be available. A note containing only spaces should be rejected with an explanation the person can act on.

The learner owns those expectations. The agent can propose improvements, but it should not silently replace them with whatever is easiest to implement. If you use your own product, write an equivalent short brief for one useful behavior; you do not need to build the notebook first.

## Build a small complete path

A complete path reaches the result the person needs. For the notebook, a polished form that never saves is incomplete. A storage function with no way for the intended person to use it is also incomplete for this feature. Follow the information through the application using [How the Parts of Your App Work Together](contextqb://guides/how-the-parts-of-your-app-work-together).

Small scope means limiting the promise. It does not mean omitting the parts needed to keep that promise. Team sharing can wait; saving and reopening cannot, because they are the point of this feature.

Keep a short list of later ideas in the project's existing notes. When the agent suggests adding accounts or summaries, ask whether they are needed for this feature's agreed result. A plausible future feature does not have to become today's work.

## Turn the brief into a plan

Use [Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning) to have the agent identify the files, responsibilities, data ownership, coordinating function, risks and exclusions. That playbook owns the planning procedure; this guide helps you judge its output.

Read the goal and exclusions first. Then ask the agent to explain any structural term you cannot connect to the product. You should be able to say where the saved note lives, what happens if writing fails and which part coordinates saving. Ask it to distinguish existing files from proposed additions.

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

Update the existing feature record with what was accepted, the evidence, remaining concerns and the next authorized action. [Work With Agents Through Documentation](contextqb://guides/work-with-agents-through-documentation) explains how to carry that understanding between sessions. A new chat should not have to reconstruct your decision from a long conversation.

Before continuing, explain these three things in your own words: why this feature is useful, which check would expose a false “Saved” message, and which later idea you deliberately excluded. If you can answer, you have more than generated files: you have a decision you can defend and a result you know how to inspect.
