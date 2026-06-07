---
id: the-mental-model-of-your-app
title: The Mental Model of Your App
summary: Before you write a line of code or prompt a single agent, you have to know — in plain words — what your app is actually for. This guide helps you turn an idea into a working mental model.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 0
journey_rank: 20
intro: |
  Every app begins as a feeling: "I wish there was a thing that did this." This guide is for that moment — before the code, before the screens, before you know whether it's a website or an app or a script. You start with a mental model, and ContextQB helps you turn that model into a durable piece of software.
tags:
  - mental-model
  - getting-started
related:
  - what-an-application-is
  - building-for-yourself-vs-others
  - context-quarterback-the-onboarding-map
  - product-engineering-alignment
next_steps:
  - Write a one-paragraph working brief for your app.
  - List the buckets of information your app needs to hold.
  - Open a repo and add an AGENTS.md with the brief.
  - Run the new-project-foundation playbook.
---

# The Mental Model of Your App

**Plain language:** You have an idea. You think it might be an app. You don't know how to code, or maybe you do but you've never built something from nothing. This guide is your starting point. By the end you'll have a mental model clear enough that an AI agent can build the first version with you.

## You're in the right place

If you're reading this because you have an idea and aren't sure how to start — you're not behind. You're at the right step, doing the right kind of thinking.

Most people who imagine an app never begin, not because the idea is bad, but because they think the next move is "learn to code." That's no longer true. In 2026 the next move is "describe what you want clearly enough that an agent can build it." The bottleneck has shifted from syntax to clarity.

What you have right now — an idea that something _could_ exist — is the part the agent cannot do for you. Everything downstream depends on it being expressed clearly.

## What an app actually is

At the highest level, every application does one thing:

> It moves information from one place to another.

That's it. That's the whole surface.

Apps capture information from somewhere (a person typing, a device sensing, another service sending). They store it. They organise it. They show it back to someone in a useful form. They trigger something to happen based on it. Sometimes they send it somewhere else.

Everything else — the buttons, the colours, the animations, the auth screens, the dark mode — is _how_ the app does that. The mental model lives one level above the _how_. It lives at the _what_: what information, from where, to where, for whom, and why.

The reason this framing matters: once you can describe your idea in those terms, the agent has something concrete to build from. "Make me a Bible app" is too vague. "An app where I capture verses I want to remember, tag them with what I was going through, and search them later by mood" is a buildable concept.

## The parameters of your mental model

Inside that one-sentence frame ("moves information from one place to another"), there are five questions you have to answer for the agent to do anything useful. You don't have to answer them perfectly — just plausibly:

1. **What information is the app about?** What are the _things_ — verses, recipes, customers, photos, lessons, runs? In ContextQB terms these are your **entities**. The names of these things become the vocabulary of your whole project.
2. **Where does the information come from?** You typing it? Other people typing it? A spreadsheet you'll upload? A third-party API? An AI generating it?
3. **Where does it live?** A database? A document store? A file on disk? You don't need to pick a technology — just answer "is this information remembered, or does it disappear when I close the app?"
4. **Who interacts with it, and how?** Just you? You plus a few friends? Anyone on the internet? Read-only, or do they change things?
5. **What happens when the information changes?** Nothing? A notification? A re-rendering of a list? A bill goes out? An email gets sent?

If you can write a sentence answering each of those, you have a mental model. It will be wrong in places. That's fine — it gets revised. What matters is that it exists.

## You don't have to have it all figured out

This is the part that stops most people: the assumption that you have to fully understand the app before you can start. You don't. You can't, actually. The app teaches you what it wants to be as you build it.

What you need is a **core concept**: a single sentence that captures the promise of the app. In the first ContextQB course, this means resisting the urge to add features:

> Stay focused on one core promise. "Open the app and quickly find Scripture + my own reflections that speak into my day."

That's enough. From there, the agent can build you a prototype. From the prototype, you learn what works and what doesn't. From what works and what doesn't, you refine the mental model. The cycle continues forever.

Builders who insist on a complete blueprint before starting almost never start. Builders who insist on a complete blueprint before writing a line of code end up rebuilding from scratch when reality intrudes. The most durable approach is: hold the mental model lightly, ship something small, and let what you learn refine the model.

## Why ContextQB fits this stage

If you're new to building applications, ContextQB is built for exactly the moment you're in. Two reasons:

**It makes your mental model durable.** Agents have short memories. Each new chat session forgets what the last one knew. Without a system, you spend half your time re-explaining your app to the agent. ContextQB's whole point is that the things you've decided — your entities, your architecture, your conventions, your security posture — get written down once and live in places agents and humans can both read. Your mental model stops being a thing in your head and starts being a thing in your repo.

**It gives you the right shape to start.** When you don't know where to start, "open VS Code and write code" is not actionable. "Write an `AGENTS.md`, declare your boot manifest in `context.qb.yaml`, list your entities, run the `feature-planning` playbook" _is_ actionable. ContextQB provides the scaffolding so you can focus on the only part nobody can do for you — the mental model itself.

## Get organised and start building

You don't need to know how to code to start. You do need to do these things, in roughly this order:

1. **Write a working brief.** A paragraph in your own words: who it's for, what it does, what experience it creates, what it deliberately doesn't do. Write it like you're describing the app to a close friend over coffee.
2. **Have an agent restate your brief back to you.** Ask: "Restate this idea as a clear app concept with: who it's for, what problem it solves, what the core experience should feel like, what the must-have features are for V1." If the agent misunderstands your intent here, it will build the wrong thing later.
3. **List your entities.** What buckets of information does the app need? Don't worry about how they're stored. Just name them. "Verses. Notes. Tags. Users. Reading plans." That list is the first draft of your schema.
4. **Open a repo.** Even an empty folder counts. Initialise it with `git`. This is where your mental model becomes a durable artefact.
5. **Set up the project foundation.** Use the [`new-project-foundation`](contextqb://playbooks/new-project-foundation) playbook to give the repo the boundaries, naming, and orchestration story it needs before the first feature ships. Use the [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md) playbook to author the single most leverage-positive file in an agentic codebase.
6. **Write a `context.qb.yaml`.** This is the boot manifest agents read first. The [`write-a-context-qb`](contextqb://playbooks/write-a-context-qb) playbook walks you through it. It captures the mental model in machine-readable form.
7. **Plan the first feature, don't code it yet.** Use the [`feature-planning`](contextqb://playbooks/feature-planning) playbook to produce a feature brief, surface map, state plan, and risk list before any code is written. Now you let the agent build.

At step 7, you've turned an idea into a structured project an agent can extend. That's the whole on-ramp.

## Track your mental model as it evolves

The reason ContextQB exists is that mental models drift. You start thinking the app stores "notes." Two weeks in, you realise you really meant "annotations on verses," which is a different shape. If that change lives only in your head, the agent will keep building from the old model. If it lives in your repo — in `AGENTS.md`, in `context.qb.yaml`, in an ADR — every future session is grounded in current truth.

Here's how each piece of ContextQB holds part of the evolving model:

- **`AGENTS.md`** — the operating instructions for any agent touching the repo. Update this whenever a decision changes how the agent should behave.
- **`context.qb.yaml`** — the boot manifest. Lists modules, decisions, security posture, and the architecture principles in play. Updated when the structure of the project changes.
- **ADRs (Architecture Decision Records)** — the durable record of _why_ you made a particular structural choice. Written when you decide something that future-you (or a future agent) will need to defend. Use [`write-an-adr`](contextqb://playbooks/write-an-adr) for the format.
- **Status documents per feature** — small living docs that track purpose, scope, progress, and blockers for an in-flight feature. Surface area for what the agent should be doing right now.
- **The schema** — once your entities solidify, the schema becomes the spine of the app. It's the most opinionated document in the repo.

Each refinement is a permanent gain. You're not losing context every session — the system holds it for you. Three months from now, an agent can read your repo and know what you intended without you re-explaining anything.

## What "good enough" looks like at this stage

You don't need a fully formed mental model to start. You need:

- A short working brief in your own words.
- A list of the buckets of information your app handles.
- A first guess at where information enters the app and where it leaves.
- A repo set up to capture what you learn next.

That's the whole bar. The mental model evolves from there, and ContextQB gives you the structure to keep that evolution coherent.

You are doing the right kind of thinking. Keep going.

## See also

- [Guide: What an Application Is](contextqb://guides/what-an-application-is) - the substrate: files, runtimes, channels, and information flow.
- [Guide: Building for Yourself vs. Building for Others](contextqb://guides/building-for-yourself-vs-others) - decide who the first real user is before the plan hardens.
- [Playbook: Prepare a New Repo for AI-Assisted Development](contextqb://playbooks/new-project-foundation) — the practical sequence after this guide.
- [Playbook: Set Up AGENTS.md for Your Project](contextqb://playbooks/set-up-agents-md) — author the single most leverage-positive file.
- [Playbook: Write a context.qb for Your Repository](contextqb://playbooks/write-a-context-qb) — encode the mental model machine-readably.
- [Playbook: Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning) — when you're ready to start building.
- [Principle: The Context Quarterback — Every Repo Has a Boot Manifest](contextqb://principles/context-quarterback-the-onboarding-map) — why the mental model has to live in the repo.
- [Principle: Documentation as Architecture](contextqb://principles/documentation-as-architecture) — why writing it down is the architecture, not a byproduct.
- [Principle: Product-to-Engineering Alignment](contextqb://principles/product-engineering-alignment) — why the words in your mental model become the vocabulary of your code.
