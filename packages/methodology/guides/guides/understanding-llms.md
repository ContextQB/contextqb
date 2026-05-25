---
id: understanding-llms
title: Understanding LLMs
summary: A short field guide to the models you'll work with. Each LLM has a personality you get a feel for over time, like a coworker. This stub covers the families, the pricing shape, and the heuristics — fuller treatment to come.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 0
intro: |
  LLMs are not interchangeable. They behave differently, cost differently, and feel different in your hands. This is the rough map. The deeper one — model-by-model strengths, prompt techniques specific to each, when to escalate from a cheap model to an expensive one — comes later as the methodology matures.
tags:
  - llm
  - ai-models
  - getting-started
  - stub
related:
  - choosing-your-ide-and-llm
  - ai-output-is-untrusted-code
next_steps:
  - Pick one model and use it for a week before forming opinions.
  - Set a billing alert at your provider's dashboard.
  - Note which kinds of tasks feel easy vs. forced — that's where you'll learn what each model is good at.
---

# Understanding LLMs

> This guide is a **stub**. It captures the working mental model and enough to get you started. It will grow into a fuller treatment as the methodology matures.

**Plain language:** You'll work with multiple AI models over the course of building anything serious. They're not the same. Each one has a personality you start to recognise — strengths, weaknesses, recurring quirks — the way you'd recognise a coworker after a few weeks. This guide is the rough map: who makes which models, what they cost, and what to listen for as you get a feel for each.

## Why this matters

The first instinct of most new builders is to pick "the best" model and use only that. There is no best. There are families, and within each family there's a fast cheap one, a careful expensive one, and the trade-off between them is real.

Knowing the landscape — even at the level of "Claude is good at long careful reasoning, GPT is fast at routine edits, Gemini handles huge context" — is what lets you make small daily decisions that compound. If you're stuck on the wrong model for the task, you'll think the problem is your prompt when really it's the model.

## The major families in 2026

| Family                                                 | Maker               | What it's known for                                                                                                                                                                        | Watch for                                                                                                                     |
| ------------------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Claude** (Opus, Sonnet, Haiku)                       | Anthropic           | Long chains of careful reasoning. Strong at refactoring, code review, agentic loops that need to follow many steps without losing the plot. The default many ContextQB builders reach for. | Tends to over-explain. Can be verbose in chat; reins itself in nicely in agent mode.                                          |
| **GPT** (5, 5.1)                                       | OpenAI              | Fast, broad capability. Excellent instruction following. Very good at routine edits, generating boilerplate, mapping between formats. Huge integrations ecosystem.                         | Can sound more confident than it should. The line between "knows" and "guesses" is thinner than with Claude.                  |
| **Gemini** (3.x)                                       | Google              | Enormous context windows — useful when you need to feed a whole codebase or a long document. Strong multimodal capability (handles images well).                                           | The behavior of long-context retrieval can be uneven; what's in context isn't always reasoned about evenly across the window. |
| **Grok**                                               | xAI                 | Less common for serious coding work. Tightly tied to X's data and ecosystem.                                                                                                               | Quality has moved fast but isn't yet differentiated for typical builder workflows.                                            |
| **Open-source** (Llama, Qwen, DeepSeek, Mistral, etc.) | Various / community | Run them locally for free; meaningfully behind the frontier closed models but rapidly closing the gap.                                                                                     | Quality varies wildly by model size. A laptop-runnable model is not a Claude-Opus replacement.                                |

Within each family there's typically a tier:

- **Opus / GPT-5 / Gemini Pro / large open models** — the careful, expensive ones. Use for hard reasoning.
- **Sonnet / GPT-5-mini / Gemini Flash / mid open models** — the workhorses. Use for most tasks.
- **Haiku / GPT-5-nano / Gemini Nano / small open models** — the fast cheap ones. Use for routine work, formatting, classification, anything that doesn't need depth.

Most builders end up using two to three models regularly — usually a careful one for hard tasks and a fast one for everything else.

## How they're priced

The base unit is the **token**. A token is roughly a syllable — about three-quarters of a word. Pricing is quoted in dollars per million tokens, separately for input (what you send) and output (what the model returns). Output is usually 4–5× more expensive than input.

A few practical shapes to internalise:

- **Frontier (most expensive):** several dollars per million input tokens, multiples of that for output. A long, deep agent session can hit a few dollars on its own.
- **Mid-tier:** an order of magnitude cheaper. Good for the bulk of daily work.
- **Small / fast:** another order of magnitude cheaper. Functionally a rounding error for most personal use.
- **Local models:** zero API cost. Hardware and electricity instead.

You don't need to memorise specific prices — they change. You need to know the rough ratio so you can match the model to the task. Don't use the frontier model to format a CSV. Don't use the small model to design your data model.

**Two habits make this safe:**

1. Set a hard monthly cap at the provider dashboard before you start using a pay-per-token plan. $50 is a reasonable first ceiling.
2. Watch a long agent task complete and look at the cost in the dashboard. Once a week is enough. You'll quickly develop intuition for "that prompt was a $0.05 prompt" vs "that prompt was a $5 prompt."

## Getting a feel for each model

This is the most important section in this guide.

You're not picking a tool. You're picking a collaborator. Just like you'd notice that one coworker is great at first drafts but bad at polish, that another is meticulous but slow, that a third has a habit of agreeing too readily — every LLM has a working personality you'll learn over time. There's no shortcut. You have to use it.

A few specific things to listen for:

- **How does it handle "I don't know"?** Some models are willing to say it directly. Others paper over uncertainty with confidence. Both are usable; you adjust your trust accordingly.
- **How does it handle ambiguous prompts?** Does it ask a clarifying question, or does it pick a path and run? Both are valid styles; one wastes more time than the other depending on the task.
- **What does its output _feel_ like?** Some models are verbose by default; some are terse. Some lean structured; some lean conversational. None of these is wrong, but you'll have preferences.
- **Where does it break?** Every model has failure modes. Claude can get stuck in over-cautiousness loops. GPT can pretend to remember things from earlier in a session that it doesn't. Gemini can lose context in the middle of a long window. Learning each model's failure modes is half the skill.
- **How does it behave in agent mode vs. chat?** Some models that feel mediocre in chat shine when given tools and asked to loop. The opposite is also true.

Two weeks of focused use with one model teaches you more than two months of reading comparisons. Pick one, build something with it, and let the feel develop.

## When to use which (rough heuristics)

These are starting points, not rules. You'll override them based on your own feel within a month.

| Situation                                                | Lean toward                                                                                                                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Designing the data model or a new feature from scratch   | A frontier reasoning model (Claude Opus, GPT-5, Gemini Pro). The cost of being wrong is high.                                                                                                 |
| Long agentic refactor — many files, many steps           | Claude (Sonnet or Opus). Strong on staying on-task through long loops.                                                                                                                        |
| Routine edits, renames, formatting fixes                 | A mid-tier or small model. Cheap, fast, sufficient.                                                                                                                                           |
| Reviewing a large document or codebase you've never seen | Gemini Pro for the context size; Claude Opus if the document is gnarly and needs careful reading.                                                                                             |
| Anything security-critical                               | A frontier reasoning model, and apply the [security-critical code review prompt](contextqb://prompts/security-critical-code-review). Don't skimp on the model when the cost of error is high. |
| Generating boilerplate, scaffolding, type stubs          | A mid-tier or small model. This is what they're cheap for.                                                                                                                                    |
| You don't know which to use                              | Whichever your IDE has set as default. Try the task. Switch if it feels wrong.                                                                                                                |

## A note on what's coming

This guide will expand into:

- Per-family deep-dives with concrete examples of each model's strengths and known failure modes.
- The prompt-engineering differences between families (Claude responds to one shape of instruction; GPT to another; the differences are real but often overstated).
- How to think about combining models in a single workflow — cheap model for a first pass, expensive model for verification, etc.
- A treatment of local LLMs and when they're actually viable.
- Notes on privacy posture per provider and the data-handling commitments each one makes.

For now, the goal of this stub is to take you from "I don't know what to pick" to "I have a working starting point and I know what to pay attention to."

## See also

- [Guide: Choosing Your IDE and LLM](contextqb://guides/choosing-your-ide-and-llm) — the practical setup that uses the models in this guide.
- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code) — the mental model for what the LLM produces.
- [Prompt: Security-Critical Code Review](contextqb://prompts/security-critical-code-review) — when to lean on a frontier model.
- [Principle: Untrusted by Default](contextqb://principles/untrusted-by-default) — every model output is hostile until validated.
- [Anthropic model docs](https://docs.claude.com/en/docs/about-claude/models)
- [OpenAI model docs](https://platform.openai.com/docs/models)
- [Google Gemini model docs](https://ai.google.dev/gemini-api/docs/models)
