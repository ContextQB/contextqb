---
id: understanding-llms
title: Understanding LLMs
summary: >-
  A field guide to the models you'll work with. Each LLM has a working style you
  learn over time: strengths, costs, recurring quirks, and failure modes you can
  plan around.
version: 0.3.1
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 0
journey_rank: 30
intro: |
  LLMs are not interchangeable. They behave differently, cost differently, and feel different in your hands. This guide gives you the map you need to choose a starting model, notice when it is the wrong fit, and switch with purpose instead of guesswork.
tags:
  - llm
  - ai-models
  - getting-started
related:
  - ai-output-is-untrusted-code
  - choosing-your-ide-and-llm
  - how-to-use-contextqb
  - security-critical-code-review
  - understanding-the-context-window
  - untrusted-by-default
next_steps:
  - Pick one model and use it for a week before forming opinions.
  - If your tool has a reasoning-effort setting, try raising it on a hard task before you switch models.
  - Set a billing alert at your provider's dashboard.
  - Note which kinds of tasks feel easy vs. forced — that's where you'll learn what each model is good at.
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.1 (agent)"
  reviewer_notes: "2026-10-07 renewal B3 review correction (0.3.1; author self-checked; independent review pending; not operator-accepted): the spending-cap habit now distinguishes a hard limit that stops requests from an alert that only notifies, says what to do when only alerts are available, and links the provider console reference. 2026-10-07 renewal B3 (0.3.0; author self-checked; independent review pending; not operator-accepted): model names, tier names, prices and context sizes moved to the dated model and pricing references; the body keeps the role tiers (careful, workhorse, fast), the cost ratios, the habits and the failure modes to listen for, now described as unnamed patterns; the how-to-use steps come first and add raising the reasoning effort before switching models; the unsupported 'default many builders reach for' endorsement removed; the only remaining dollar figure is ContextQB's own labelled estimate for a first spending cap. Earlier notes (2026-09-09 epistemology review: lineups verified in place, with open items F-09 and F-06) are closed by this revision: version-pinned claims now live in references with their own review dates, and the vendor documentation links moved there. R3, R4, R6, R7 passed then; R8 pending P4."
---

# Understanding LLMs

**Plain language:** You'll work with multiple AI models over the course of building anything serious. They're not the same. Each one has a working style you start to recognise — strengths, weaknesses, recurring quirks — the way you'd recognise a collaborator after a few weeks. This guide gives you enough map to choose one, budget for it, and learn when to switch.

## Why this matters

The first instinct of most new builders is to pick "the best" model and use only that. There is no best. There are families, and within each family there's a fast cheap one, a careful expensive one, and the trade-off between them is real.

Knowing the landscape — even at the level of "this family is careful but slow, that one is fast at routine edits, this other one takes very long inputs" — is what lets you make small daily decisions that compound. If you're stuck on the wrong model for the task, you'll think the problem is your prompt when really it's the model.

## How to use this guide

Do not try to become a model expert before you build. Pick one good default,
use it on real work, and keep a short note about what you learn. The useful
question is not "which model is best?" The useful question is "which model is
good enough for this task, at this cost, with this failure mode?"

Start simple:

1. Use your tool's default model for a week of normal work.
2. When a task feels stuck, first raise the reasoning-effort setting if your tool has one, and try again. Many tools let you ask the same model to think longer before you change anything else.
3. If it is still stuck, switch once to a stronger reasoning model and compare the result.
4. Use a cheaper model for formatting, renames, and routine edits.
5. Use a stronger model for architecture, security, data models, and reviews.
6. Write down the pattern you observe so future-you does not have to relearn it.

That is enough. Your model strategy should grow from real feedback, not from reading every benchmark. The rest of this guide explains the map behind those steps.

## The shape of the landscape

A handful of providers make the leading closed model families. You reach them through the provider's own apps and API, or through your coding tool's plan. Alongside them are **open-weight** models — published for anyone to download and run on their own machine or a host they choose.

The names, versions and context limits change several times a year, so ContextQB keeps them in dated references rather than in this guide:

- [Model families and current lineups](contextqb://references/models#families) — providers, current models, role tiers, context and output limits, each with the date it was checked.
- [Open-weight model families](contextqb://references/models#open-weight) — publishers and licences.

What lasts is the shape. Within each family there's typically a tier:

- **Careful and expensive** — the top tier. Use for hard reasoning, design decisions and long agentic work where a mistake is costly.
- **Workhorse** — the middle tier. Use for most tasks.
- **Fast and cheap** — the small tier. Use for routine work, formatting, classification, anything that doesn't need depth.

Open-weight models span the same range by size. The ones small enough to run on a laptop are usually behind the frontier closed models for coding; larger ones need serious hardware.

Most builders end up using two to three models regularly — usually a careful one for hard tasks and a fast one for everything else.

## How they're priced

The base unit is the **token**. A token is roughly a syllable — about three-quarters of a word. Pricing is quoted in dollars per million tokens, separately for input (what you send) and output (what the model returns). Output usually costs several times more than input.

A few practical shapes to internalise:

- **Top tier (most expensive):** the highest per-token prices. A long, deep agent session on it can cost noticeably more than a day of light use.
- **Workhorse tier:** often around an order of magnitude cheaper. Good for the bulk of daily work.
- **Small and fast:** cheaper again. Close to negligible for most personal use.
- **Repeated input:** many providers charge less for input they have recently seen (prompt caching), which helps long sessions.
- **Local models:** zero API cost. Hardware and electricity instead.

You don't need to memorise specific prices — they change. Current list prices, including caching, are in the dated [model API prices reference](contextqb://references/pricing#model-api); check the date and the provider's own page before you budget. What you need is the rough ratio, so you can match the model to the task. Don't use the top-tier model to format a CSV. Don't use the small model to design your data model.

**Two habits make this safe:**

1. Before you start a pay-per-token plan, set a monthly spending limit in the provider's console, and check whether it is a _hard limit_ that stops requests or only an _alert_ that emails you while spending continues. Providers and plans differ ([where each console's limits are](contextqb://references/setup#provider-console)). If only alerts are available, set one well below the amount you could afford to lose, act on it the day it arrives, and keep agent sessions short until you know your usage. Choose an amount you could lose without regret. (ContextQB's rough starting estimate for a solo learner is about $50 a month — an estimate, not a price.)
2. Watch a long agent task complete and look at the cost in the dashboard. Once a week is enough. You'll quickly develop intuition for "that was a cheap prompt" vs "that one was a hundred times more expensive".

## Getting a feel for each model

This is the most important section in this guide.

You're not picking a tool. You're picking a collaborator. Just like you'd notice that one coworker is great at first drafts but bad at polish, that another is meticulous but slow, that a third has a habit of agreeing too readily — every LLM has a working personality you'll learn over time. There's no shortcut. You have to use it.

A few specific things to listen for:

- **How does it handle "I don't know"?** Some models are willing to say it directly. Others paper over uncertainty with confidence. Both are usable; you adjust your trust accordingly.
- **How does it handle ambiguous prompts?** Does it ask a clarifying question, or does it pick a path and run? Both are valid styles; one wastes more time than the other depending on the task.
- **What does its output _feel_ like?** Some models are verbose by default; some are terse. Some lean structured; some lean conversational. None of these is wrong, but you'll have preferences.
- **Where does it break?** Every model has failure modes, and they change between versions. Some models get stuck in over-cautious loops. Some claim to remember earlier parts of a session that they have actually lost. Some lose track of material in the middle of a very long context. Learning your models' failure modes is half the skill.
- **How does it behave in agent mode vs. chat?** Some models that feel mediocre in chat shine when given tools and asked to loop. The opposite is also true.

Two weeks of focused use with one model teaches you more than two months of reading comparisons. Pick one, build something with it, and let the feel develop.

## When to use which (rough heuristics)

These are starting points, not rules. You'll override them based on your own feel within a month.

| Situation                                                | Lean toward                                                                                                                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Designing the data model or a new feature from scratch   | A top-tier reasoning model, or your workhorse with the effort setting raised. The cost of being wrong is high.                                                                                |
| Long agentic refactor — many files, many steps           | A model that stays on task through long loops — usually a top-tier or strong workhorse model. Notice which of yours does.                                                                     |
| Routine edits, renames, formatting fixes                 | A workhorse or small model. Cheap, fast, sufficient.                                                                                                                                          |
| Reviewing a large document or codebase you've never seen | A model whose context window fits it ([current limits](contextqb://references/models#families)) — and a careful model if the document is gnarly and needs close reading.                      |
| Anything security-critical                               | A top-tier reasoning model, and apply the [security-critical code review prompt](contextqb://prompts/security-critical-code-review). Don't skimp on the model when the cost of error is high. |
| Generating boilerplate, scaffolding, type stubs          | A workhorse or small model. This is what they're cheap for.                                                                                                                                   |
| You don't know which to use                              | Whichever your tool has set as default. Try the task. Raise the effort, then switch if it still feels wrong.                                                                                  |

## See also

- [Guide: Choosing Your IDE and LLM](contextqb://guides/choosing-your-ide-and-llm) — the practical setup that uses the models in this guide.
- [Guide: Understanding the Context Window](contextqb://guides/understanding-the-context-window) — why long sessions cost more and drift.
- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code) — the mental model for what the LLM produces.
- [Prompt: Security-Critical Code Review](contextqb://prompts/security-critical-code-review) — when to lean on a top-tier model.
- [Principle: Untrusted by Default](contextqb://principles/untrusted-by-default) — every model output is hostile until validated.
- References (dated facts): [model families and limits](contextqb://references/models#families), [open-weight models](contextqb://references/models#open-weight), [model API prices](contextqb://references/pricing#model-api).
