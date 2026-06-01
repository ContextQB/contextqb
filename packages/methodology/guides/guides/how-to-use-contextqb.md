---
id: how-to-use-contextqb
title: How To Use ContextQB
summary: A first-time orientation to ContextQB for people who have not built much with AI agents yet — what it is, why we built it, how we pay for it, and how to start using it without feeling lost.
version: 0.1.0
intro: |
  If you just landed on contextqb.com and you are not sure what most of it means, this guide is for you. We will walk through what ContextQB actually is, why we built it, how we keep the lights on, and how to start using it — without assuming you are already a developer.
audience:
  - novice-builder
  - founder
  - agent
journey_stage: 0
journey_rank: 0
related:
  - what-an-application-is
  - choosing-your-ide-and-llm
  - understanding-llms
tags:
  - orientation
  - getting-started
  - ai
next_steps:
  - "Pick an IDE you are comfortable with (Cursor is the easiest entry point)."
  - "Pick an LLM you trust to work with day to day."
  - "Read one principle or one playbook on contextqb.com — not all of them."
  - "When you have a real project, install @context-qb/cli and run it once."
---

# How To Use ContextQB

## "Wait, what the heck is going on here?"

You found ContextQB. There is a website with principles and playbooks, a thing called an MCP server, a tool called `contextqb`, and references to "agents" and "context.qb files" and other words that probably look like jargon.

That is a lot of new vocabulary. Take a breath. None of this is required reading on day one.

If this is the first time you are running into most of these ideas, you are going to want to spend a little while just reading and clicking around. That is normal. Most of what we publish is meant to be read once, mulled over, and re-read later when you actually need it. The goal is not to memorise the methodology. The goal is to start building things.

If your first reaction is "this is too much, I do not feel ready to do this yet" — that is also normal. The pool is deeper than it looks. Give yourself a couple of weeks to read around, watch a few videos, and try one or two small things before you feel brave enough to dive in. Most people do.

## Some words you will see a lot

If a few of these are new, here are the short versions. Each one has its own rabbit hole. We have linked the friendliest entrances we know.

**LLM** — a Large Language Model. The engine inside tools like ChatGPT, Claude, and Gemini. We have our own short [Understanding LLMs](/guides/understanding-llms) guide. Simon Willison's [blog](https://simonwillison.net/) is the best plain-English source on the open internet for keeping up.

**Agent** — an LLM that can take actions, not just answer questions. When the model reads files in your project, runs commands, or edits code, it is acting as an agent.

**IDE** — Integrated Development Environment. The thing where you write code. Most builders we know are using [Cursor](https://cursor.com), an editor with an AI agent built in. VS Code with extensions also works. If you have never opened one, [Choosing Your IDE and LLM](/guides/choosing-your-ide-and-llm) is the place to start.

**MCP** — Model Context Protocol. A small spec that lets agents talk to outside tools and data sources in a standard way. Our MCP server (`mcp.contextqb.com`) hands the methodology — principles, playbooks, prompts — to any MCP-compatible agent. The official docs live at [modelcontextprotocol.io](https://modelcontextprotocol.io).

**Vibe coding** — a phrase coined by Andrej Karpathy [in early 2025](https://x.com/karpathy/status/1886192184808149383). It describes the experience of telling an LLM what you want and accepting most of what it produces. It is a real shift in how software gets made. ContextQB is, in part, a methodology for vibe coding well enough that the result actually works.

**`context.qb.yaml`** — a small file you put at the root of a project to give an agent the shape of the codebase. It is the agent's map. You can read [the spec](https://github.com/ContextQB/contextqb/blob/main/format/SPEC.md) when you are ready, or browse [worked examples](https://github.com/ContextQB/contextqb/tree/main/format/examples).

If a lot of this is fully new, [Ethan Mollick's One Useful Thing](https://www.oneusefulthing.org/) is one of the more grounded places to read about AI as a normal person, not as an engineer.

## What ContextQB actually is

ContextQB is a small bundle of things that work together:

- **A methodology** — principles, playbooks, audits, and prompts for building software with AI agents. Free. Public. Browse it on [contextqb.com](https://contextqb.com).
- **A small file format** — `context.qb.yaml`, the map you put in your repo so an agent always reads a consistent picture of the project.
- **A drift detector** — a CLI called `@context-qb/cli` that checks whether your map still matches the territory. It catches the moment your project changes shape and your agent starts working from a stale picture.
- **An MCP server** — `mcp.contextqb.com`, which serves the methodology to any agent that speaks MCP. Pair it with Cursor or Claude Desktop and your agent can quote principles and run audits without you copy-pasting anything.
- **A course platform** — early; not yet open. When it launches, the courses will be the deeper, paid path through the methodology.

The name is the point. A quarterback gives the play in the huddle. The team needs the play before the snap. ContextQB is the play-sheet for the agent on your team.

## Why we built it

Two answers, depending on how deep you want to go.

**The short answer.** We want to help more people build real things with AI. The tools are good enough now that ordinary people — founders, hobbyists, small-team builders — can put working software into the world. What is missing is the discipline to do it well: how to brief an agent, how to organise context, how to catch the moment a model starts hallucinating, how to keep a project from sprawling into something nobody understands. That discipline is what ContextQB is.

**The longer answer.** A lot of what is broken about the current world comes from a small number of very large companies controlling how things — software, media, commerce, work itself — get made. The path back from that is more people making more things on their own terms: small applications, small businesses, small communities, small infrastructure. AI does not fix that on its own, but it does shift the floor. People who would never have shipped a working app five years ago can ship one this month, if they have a clear way to work. Building that clear way is the project.

This is a values stance, not a manifesto. We are not promising to fix anything by ourselves. We are trying to be useful to the people who are doing the building.

## How we make money

We don't, yet.

The methodology is free and intentionally permissive (CC BY-SA 4.0). The drift detector is MIT-licensed. The MCP server is free to use.

Three plans for keeping the lights on, roughly in the order we expect them to land:

1. **Courses** — when the course platform opens, paid tracks will fund the work. The methodology stays free; the deeper, structured paths cost money.
2. **Dogfooding** — we use ContextQB to build our own products. [Football Country](https://footballcountry.com), the [Industrial Semiotics Studio](https://industrialsemiotics.com), and [Skysquare](https://skysquare.app) are real projects we ship using these tools. If those make money, ContextQB stays funded.
3. **Sponsorship or partnership** — eventually, but not how we want to start.

If you want to support the project today, the most useful thing is to actually use it and tell us what is broken.

## How to actually start using it

Pick the lane that matches where you are.

### "I just want to read and learn"

Browse [the principles](https://contextqb.com/principles), [the playbooks](https://contextqb.com/playbooks), and [the guides](https://contextqb.com/guides). They are written to be read top-down. The [Start Here](https://contextqb.com/start-here) page has a recommended reading order. Coming back later when you need a specific play is the normal pattern.

### "I have a project I am working on"

If you already have a project (any size, any language), the next step is to write a `context.qb.yaml` for it and install the drift detector. Two playbooks walk you through it:

- [Write a context.qb for Your Repository](https://contextqb.com/playbooks/write-a-context-qb)
- [Set Up Drift Detection on Day One](https://contextqb.com/playbooks/set-up-drift-detection)

If your project has been around for a while and accumulated some chaos, this one is for you instead:

- [Retrofit Drift Detection on an Existing Repo](https://contextqb.com/playbooks/retrofit-drift-detection)

### "I want my agent to read this stuff directly"

Connect the ContextQB MCP server to your IDE. Run:

```bash
npx @context-qb/cli@latest mcp setup --client cursor
```

(or `--client claude` for Claude Desktop). Paste the printed snippet into your client's MCP config. After a restart, your agent can call tools like `list_principles`, `get_playbook`, and `generate_audit_instruction` directly. Full setup details live on the [MCP page](https://contextqb.com/mcp).

### "I have not done any of this before"

That is fine. A reasonable first day:

1. Pick an IDE. [Cursor](https://cursor.com) is the easiest entry point most builders we know are using.
2. Pick an LLM you trust. Most readers use Claude or GPT — either works.
3. Read one principle or one playbook. Do not try to read all of them. [Documentation as Architecture](https://contextqb.com/principles/documentation-as-architecture) is a good first stop.
4. When you have a project to work on, come back here.

## What to do next

The methodology will still be here next week. So will we. Take your time.

If you want to be told when the courses open, drop your email on [the kickoff page](https://contextqb.com/kickoff). If you build something with ContextQB and want to share it, the [members area](https://members.contextqb.com) is where field notes go up.
