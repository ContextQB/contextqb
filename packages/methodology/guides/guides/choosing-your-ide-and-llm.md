---
id: choosing-your-ide-and-llm
title: Choosing Your IDE and LLM
summary: Your IDE is the workshop. The LLM is the collaborator. This guide helps you pick both, wire them together, and understand what each costs — without getting locked into a choice you'll regret.
version: 0.3.1
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 0
journey_rank: 50
intro: |
  Agentic coding requires two kinds of software, which may or may not come from the same company: an IDE or agentic tool (where you and the agent work together) and an LLM (the model that actually does the reasoning). They're often bundled in marketing, but they're separable layers — and getting comfortable with that separation is the difference between feeling locked in and feeling in control.
tags:
  - ide
  - llm
  - tooling
  - getting-started
related:
  - ai-output-is-untrusted-code
  - choosing-your-application-channel
  - how-to-use-contextqb
  - least-privilege-for-agents
  - secrets-have-provenance
  - set-security-guardrails-for-your-agent
  - set-up-agents-md
  - setting-up-git-and-github
  - the-mental-model-of-your-app
  - understanding-llms
  - understanding-the-context-window
  - what-an-application-is
next_steps:
  - Pick one agentic coding tool from the current options in the agentic tools reference and install it.
  - Start on the plan the tool includes; connect your own model provider only when you outgrow it.
  - Run your first agentic prompt on a small, real task.
  - Plug the ContextQB MCP in so your agent has the methodology on day one.
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.1 (agent)"
  reviewer_notes: "2026-10-07 renewal B3 review correction (0.3.1; author self-checked; independent review pending; not operator-accepted): the spending-cap advice now distinguishes a hard limit that stops requests from an alert that only notifies, says to check which one you have and what to do when only alerts exist; the pitfall and setup step say the same. 2026-10-07 renewal B3 (0.3.0; author self-checked; independent review pending; not operator-accepted): the tool and model tables, the named starter setup and every price moved out of the lesson; the guide now teaches the kinds of tools, the selection criteria (including plan gating and data use), the three wiring patterns with the bundled plan as the default path, and how agent spending works, and links the dated references for current tools, models, plan prices, API prices, provider consoles and local models. The unsupported claim that ContextQB writing is tested against one setup was removed; the only remaining dollar figure is ContextQB's own labelled estimate for a first spending cap. Earlier notes (2026-09-09 epistemology review: landscape rebuilt and prices verified in place, with open items F-09 and F-06) are closed by this revision: the version-pinned material now lives in references with their own review dates, and the links resolve. R3, R4, R6, R7 passed then; R8 pending P4."
---

# Choosing Your IDE and LLM

**Plain language:** You need two things to start coding with AI. The first is an IDE — basically a fancy text editor where you and the agent can both see and change files — or an agentic tool that plays the same role from a terminal or desktop app. The second is an LLM — the model that does the actual reasoning when the agent works. They're separate layers, and learning that they're separate is the most important lesson in this guide. Once you know that, every other choice gets simpler.

## You're in the right place

If you've never picked an IDE before, or if the difference between the name of a coding tool and the name of a model is fuzzy, you're not behind. You're at the right step. This stuff is genuinely new — most of these tools didn't exist in their current form a few years ago, and the marketing around them mixes the layers on purpose so each product can claim more credit.

By the end of this guide you'll know what you're choosing, why, and how to change your mind later without losing work. That's all you need.

## Your IDE is your workshop. Your LLM is your collaborator.

The mental model that makes everything else easy:

- The **IDE** is the room. It's where the files live in front of you, where the agent's changes appear, where the terminal opens, where you commit code, where you browse the codebase. It's a piece of software that runs on your computer.
- The **LLM** is the brain. It's a service that usually lives on a model provider's servers. When the agent in your IDE "thinks," it's sending a request to that service and getting back text. (You can also run smaller models on your own machine — Pattern C below.)

The IDE talks to the LLM over the internet. Many tools let you swap one without swapping the other: the same tool with a different model, or the same model in a different tool. The skill is recognising which layer you're configuring at any given moment.

## The kinds of tools

Products change names, merge and reprice every few months, so this guide teaches the _kinds_ of tool. The current options — what each one is, which surfaces it runs on and where its documentation lives — are in the dated [agentic coding tools reference](contextqb://references/tools#agentic-ides).

- **Agentic editors.** A full code editor rebuilt around an agent: you see the files, the agent's edits and the terminal in one window. The most familiar starting point if you have never coded.
- **Editor plus extension.** A general-purpose editor with an AI agent added as an extension. Useful if you already use that editor.
- **Terminal and desktop agents.** An agent you talk to from a terminal or its own app, which edits the files in your project folder. Often paired with an ordinary editor for reading the code.
- **Agent command centres.** Apps for running several agents at once, locally or in the cloud, and reviewing their work. Powerful later; more than a first project needs.
- **Open-source agents.** Tools you can point at any model, including one running on your own machine.

Many products now span several of these kinds. Choose by the criteria below, not by the category label.

## What to look for in an IDE

A few criteria worth applying when you choose:

1. **MCP support.** The Model Context Protocol is how agents pull in external context — like the ContextQB methodology. Most agentic tools support it now; the [MCP client configuration reference](contextqb://references/setup#mcp-clients) shows the setup for the clients ContextQB has checked.
2. **Agent mode quality.** "Chat with the editor" is table stakes. The differentiator is the agent mode — can the AI loop on a task, run shell commands, edit multiple files, and report back? Try it on a small real task rather than trusting a feature list.
3. **Model picker and effort settings.** Are you locked into one model, or can you swap a careful model for hard reasoning and a fast one for routine edits? Many tools also have a reasoning-effort setting — often the first thing to change before switching models.
4. **Plan gating.** Some models, effort levels and agent features are only available on higher plans. Check what the plan you're considering actually includes before you pay.
5. **Bring-your-own-key.** Can you plug in your own API key to bypass the tool's subscription? Useful if you already have credits with a provider, or if you want to run a local model.
6. **Privacy posture.** Does the tool send your code to its servers? Does the provider train on what you send? Defaults differ by provider and plan — see [whether providers train on what you send](contextqb://references/setup#provider-data-use) and read the privacy page before you start. (Even with privacy settings on, don't paste secrets. See [Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github) for why.)
7. **Cost predictability.** Subscriptions are simpler to budget than per-token usage. Pay-per-token gives you finer control but can surprise you when you run a long agent session. The "What it costs" section below explains how the bills work.

## The LLM landscape, briefly

The deeper version of this section is in [Understanding LLMs](contextqb://guides/understanding-llms). The short version:

- A handful of providers make the leading closed **model families**. You reach them through a provider's own app or API, or through your coding tool's plan.
- Each family has **tiers**: a careful, expensive model for hard reasoning; a workhorse for most tasks; and a fast, cheap model for routine work.
- **Open-weight** models are published for anyone to download and run, on your own machine or a host you choose. They are free to run apart from hardware and electricity, and the ones that fit on a laptop are usually behind the frontier closed models for coding.

Current families, tiers and context limits, with the date they were checked, are in the [model families reference](contextqb://references/models#families) and the [open-weight models reference](contextqb://references/models#open-weight).

You don't need to understand every model. Start with the default your tool offers, do real work with it for a couple of weeks, and you'll develop intuition about when to reach for something else. Most builders end up using two or three models regularly.

## How to wire them together

Three patterns. Start with Pattern A; move to B or C when you have a reason to.

### Pattern A — Tool-bundled subscription (start here)

You pay the tool's maker a flat monthly fee, or use a free tier. The plan includes access to the models they offer. Most agentic tools offer a plan like this ([current plans and prices](contextqb://references/pricing#ide-plans)).

- **Pros:** One bill. No API keys to manage. The tool picks sensible defaults.
- **Cons:** You're limited to the models the plan offers, at the usage limits it sets. Heavy users can hit caps.
- **Setup:** Sign up, pay if needed, log in. The tool handles the rest.

### Pattern B — Bring your own API key (when you outgrow the bundle)

You sign up directly with a model provider, create an API key, and add it to your tool's settings.

- **Pros:** Pay per token used, full model picker, no tool-imposed limits. Switch providers without changing tools.
- **Cons:** You manage the keys. Cost is harder to predict (a runaway agent loop can be expensive). You'll want billing alerts.
- **Setup:**
  1. Create an account in the provider's developer console ([where the consoles, keys and spending limits are](contextqb://references/setup#provider-console)).
  2. Generate an API key. Treat it like a secret — see [Secrets Have Provenance](contextqb://principles/secrets-have-provenance).
  3. In your tool's settings, find the "model providers" or "AI settings" pane and add the key there. That pane stores the key for the tool to use. Never paste the key into the chat with the agent: anything in the chat is sent to the model and may be kept in logs or history.
  4. Set a spending limit in the provider's console, and check whether it is a hard limit (requests stop) or only an alert (you get an email and spending continues). Do this _before_ your first heavy session.

### Pattern C — Local model (when privacy or offline work requires it)

You run a model on your own machine with a local model runner. Your tool talks to that local server instead of a cloud API.

- **Pros:** No API cost. Private. Works offline. Useful for prototyping or for situations where you can't send code to a third party.
- **Cons:** The open-weight models you can run on a laptop are usually behind frontier closed models for coding. Setup is real work. Not the right starting point for first-time builders.
- **Setup:** Install a runner, download a model, and point your tool at the local address the runner serves. The [local models reference](contextqb://references/setup#local-models) has the commands for the runners ContextQB has checked. Most tools that support bring-your-own-key also support this.

Most builders start with Pattern A, move to Pattern B once they have a model preference or hit the plan's limits, and only touch Pattern C for specific privacy or experimental reasons.

## A sensible first setup

ContextQB does not recommend a particular product. A first setup that works with this methodology has these properties, whichever products you choose:

1. **One agentic tool** with an agent mode, MCP support and a model picker, chosen from the [agentic coding tools reference](contextqb://references/tools#agentic-ides) using the criteria above.
2. **Its bundled plan (Pattern A)** for the first month, with its default model. You'll develop a feel for whether you need more control.
3. **The [ContextQB MCP](https://contextqb.com/mcp)** — five minutes — so your agent has the methodology corpus from session one.
4. **Git set up first**, so every agent change can be undone. See [Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github).

## What it costs

Prices change often, so this guide explains how the bills work and links to dated price tables: [agentic coding plan prices](contextqb://references/pricing#ide-plans) and [model API list prices](contextqb://references/pricing#model-api). Check the date on each table and the provider's own page before you decide.

- **Bundled plans** charge a flat monthly fee, often with a free tier and higher tiers for heavy use or extra features. The cost is predictable; the limit shows up as usage caps or slower responses instead.
- **Pay-per-token** bills input (what you send) and output (what the model writes) separately, priced per million tokens. Output costs several times more than input, careful models cost much more than fast ones, and many providers charge less for input they have recently seen (prompt caching).
- **Local models** have no API cost. You pay in setup time, hardware (a machine with plenty of memory or a capable graphics card helps), and lower quality.

### How agent sessions spend money

An agent costs more than a chat because it works in loops. Every step sends the conversation so far, plus every file the agent has read, back to the model. A long session, a large file or the same files re-read several times multiply the tokens — see [The cost shape](contextqb://guides/understanding-the-context-window) in the context-window guide. On a bundled plan the same mechanics show up as hitting your usage limit sooner.

Habits that keep spending predictable:

- **Set a monthly spending limit** in the provider's console before you start any pay-per-token plan, and confirm what kind it is. A _hard limit_ makes requests fail once you reach it; an _alert_ only notifies you, and the agent keeps spending. Providers and plans differ ([where each console's limits are](contextqb://references/setup#provider-console)). If only alerts are available, set one well below your real limit, stop and check usage the day it arrives, and keep sessions short until you know your usage. Choose an amount you could lose without regret. (ContextQB's rough starting estimate for a solo learner is about $50 a month — an estimate, not a price.)
- **Give the agent scoped tasks.** "Fix the date format on the signup page" costs less than "improve the app", and is easier to check.
- **Start a fresh session for a new task** instead of continuing a long one.
- **Look at the usage page after your first few sessions.** If a task read the whole repo three times and edited eight files, it cost noticeably more than a one-file question. That's fine — but be aware.

## You can change your mind later

The single most important property of this whole space: **nothing you choose here is permanent**. Your code lives in git, not in the tool. Your prompts and principles live in Markdown, not in any one vendor's system. If your tool changes its pricing in a way you don't like, you can move the same project to another agentic tool in twenty minutes. If a model stops feeling right, you can switch models in one settings change.

Resist the urge to research every option to perfection before starting. Pick something plausible, work in it for two weeks, then evaluate. You'll learn more by using one tool than by reading reviews of all five.

## Common pitfalls

- **Pasting secrets into chat.** Your `.env` file is _not_ documentation, and an API key belongs in the tool's settings, not in the conversation. See the [git setup guide](contextqb://guides/setting-up-git-and-github) for what to do instead.
- **Letting agent mode loose on an uncommitted repo.** Always commit before running a big agent task. Always. See [Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github) for the rhythm.
- **Ignoring billing alerts, or mistaking an alert for a cap.** Pay-per-token plans can rack up faster than you'd expect if an agent goes into a loop. An alert does not stop spending; set a hard limit where your provider offers one, and act on alerts where it doesn't.
- **Choosing based on benchmarks instead of feel.** Public LLM benchmarks measure things that aren't your work. The model that "wins" on a benchmark may feel worse for your actual codebase. Use the model for a week before deciding.
- **Conflating the IDE and the LLM.** "This tool is bad at refactoring" usually means "the model the tool was using was bad at refactoring" — or its effort setting was low. Raise the effort or switch the model first.

## What "good enough" looks like at this stage

You've picked the right setup if:

- [ ] You have one agentic tool installed and you've opened a real project in it.
- [ ] You have model access set up (bundled or your own key).
- [ ] You've done at least one productive agent session — even if small.
- [ ] You know how to switch models, and change the effort setting if your tool has one.
- [ ] You know roughly what a day of usage costs you, or how much of your plan's limit it uses (check the dashboard).
- [ ] The [ContextQB MCP](https://contextqb.com/mcp) is installed so your agent has methodology context.

That's enough. The deeper questions — when to use which model, how to optimise prompts, how to stretch a free tier — those come with use.

## See also

- [Guide: Understanding LLMs](contextqb://guides/understanding-llms) — model tiers, working styles and how pricing works.
- [Guide: Understanding the Context Window](contextqb://guides/understanding-the-context-window) — why long sessions cost more and drift.
- [Guide: The Mental Model of Your App](contextqb://guides/the-mental-model-of-your-app) — what you think about before you open the IDE.
- [Guide: Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github) — the safety net that makes agentic coding survivable.
- [Playbook: Set Up AGENTS.md for Your Project](contextqb://playbooks/set-up-agents-md) — operating instructions for whatever agent you choose.
- [Playbook: Set Security Guardrails for Your Agent](contextqb://playbooks/set-security-guardrails-for-your-agent) — what to bound your agent's capabilities to.
- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code) — the mental model for what the LLM produces.
- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents) — what to give the IDE/agent access to.
- References (dated facts): [agentic coding tools](contextqb://references/tools#agentic-ides), [model families](contextqb://references/models#families), [plan prices](contextqb://references/pricing#ide-plans), [model API prices](contextqb://references/pricing#model-api), [provider consoles and spending limits](contextqb://references/setup#provider-console), [local models](contextqb://references/setup#local-models), [provider data use](contextqb://references/setup#provider-data-use).
