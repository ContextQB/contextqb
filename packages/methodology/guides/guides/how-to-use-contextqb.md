---
id: how-to-use-contextqb
title: How to Use ContextQB
summary: A first-time orientation to ContextQB for people who have not built much with AI agents yet — what it is, why we built it, how we pay for it, and how to start using it without feeling lost.
version: 0.1.0
intro: |
  A plain-English orientation for people who want to start building with AI agents, but do not yet know how all the pieces fit together.
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
  - understanding-the-context-window
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

# How to Use ContextQB

**Plain language:** ContextQB is a practical learning system for people who want to build software with AI agents. You do not need to be a developer to start. You do need a way to work — how to brief the agent, give it useful context, break work into steps, check the output, and keep the project from drifting. That is what we teach.

## What this guide is about

ContextQB is for people who want to build software with AI agents. You may be a founder, marketer, operator, small business owner, designer, writer, hobbyist, or just someone with an idea you want to turn into a working thing. You do not need to be a traditional developer to begin — but you do need a way to work.

AI agents can write code, edit files, explain errors, generate interfaces, connect tools, and help you move much faster than you could on your own. The confusing part is that they can also lose the thread, make strange assumptions, break things that were already working, or turn a simple idea into a messy project you no longer understand. ContextQB exists to help with that.

We teach the basic operating habits of AI-assisted building: how to explain what you want, give the agent useful context, break work into manageable steps, check the output, and keep the project moving in the right direction. This guide explains what ContextQB is, why it exists, and how to take your first steps.

## First: you are not behind

If you landed here and words like agent, IDE, repo, MCP, context window, or CLI still feel unfamiliar, that is normal. This is a new way of working. The tools are moving quickly. The vocabulary is still settling. Even experienced developers are learning new habits.

You do not need to understand everything before you start. You need a basic orientation, a small project, and a willingness to work step by step. ContextQB is designed to help you build that confidence gradually.

Do not try to memorize the whole system. Read enough to get moving. Come back when you get stuck. Use the guides and playbooks when they become relevant. The goal is not to become an expert in ContextQB — the goal is to build.

## The basic idea

When you build with an AI agent, you are not just asking a chatbot for answers. You are directing a system that can take action. It can read your project, change files, write code, explain problems, propose fixes, and help you build something real.

But the agent only works well when it has the right context and clear instructions. That is the core idea behind ContextQB:

> Better context leads to better work.

If the agent understands the project, the goal, the constraints, and the next step, it can help you move forward. If it does not, it will guess. Sometimes the guesses are useful. Sometimes they create a mess. ContextQB gives you a method for reducing the guessing.

## You are the quarterback

The name ContextQB is the point. On a team, the quarterback reads the field, calls the play, adjusts in real time, and decides which receiver to throw to. The quarterback does not run every route — the team does that. The quarterback's job is judgment.

When you build with an AI agent, you are in that role. The agent runs the routes — it writes the code, scans the files, drafts the language. You read the field, call the play, and decide whether the result fits the goal. You are not the agent's tool. The agent is on your team.

Our job is to help you become a good context quarterback: someone who briefs cleanly, reviews honestly, keeps the play clear, and steers the project so it stays understandable as it grows. The single most important thing you call plays around is the agent's [context window](contextqb://guides/understanding-the-context-window) — what it can see and reason over in any given moment. The brand is named for that variable; the methodology is what lets you manage it on purpose.

## Some words you will see

You do not need to master these on day one. These are the basic terms that show up across the site:

- **AI agent** — an AI system that can do more than answer questions. It can take actions, such as reading files, editing code, running commands, or helping manage a project.
- **LLM** — a large language model, such as ChatGPT, Claude, or Gemini. The engine behind many AI tools.
- **IDE** — the app where software gets built. Many people now use tools like Cursor or VS Code because they let an AI agent work directly inside a coding project.
- **Repo** — short for repository. The folder where your project lives: code, files, notes, configuration, documentation, and everything else the app needs.
- **Context** — the information the agent is using to understand the task. Your prompt, your files, your project notes, your previous decisions, and the instructions you give it.
- **Context window** — the amount of information the AI can pay attention to at one time. It is not infinite. If the wrong things are in context, or the right things fall out of context, the agent can lose track.
- **MCP** — Model Context Protocol. A way for AI agents to connect to outside tools and resources. In ContextQB, MCP lets an agent access our principles, playbooks, and audits directly.
- **`context.qb.yaml`** — a small project map for your repo. It helps the agent understand what the project is, how it is organized, and what it needs to pay attention to.

You do not need all of these tools immediately. Start with the concepts. Add the machinery when you need it.

## What ContextQB actually gives you

ContextQB is a practical system for learning how to build with AI agents. It includes:

- **Guides** — plain-English explanations of the big ideas: context, agents, project structure, prompts, review habits, and the new skills involved in AI-assisted building.
- **Principles** — short lessons that explain how to think while working with agents. These help you understand why projects drift, why context matters, and why your job is still judgment.
- **Playbooks** — step-by-step operating patterns for common tasks. Use these when you want to brief an agent, review work, inspect a repo, set up a project, or recover from confusion.
- **Prompts and audits** — reusable instructions that help you ask an agent to do specific kinds of work more carefully.
- **Project mapping** — a way to describe your project so the agent has a stable picture of what it is working on.
- **Tools** — command-line and MCP tools for people who want to connect ContextQB directly to their coding workflow.

You can use ContextQB lightly or deeply. You can simply read the guides, or you can wire the tools into your agentic development setup. The important thing is to start at the right level.

## Why we built it

AI has changed who can build software. That does not mean software is suddenly easy — it means more people can now participate if they learn the right working habits. A person with a clear idea can now sit down with an AI agent and make progress that would have required a technical team only a few years ago. They can prototype, test, revise, and sometimes ship real products.

But the new bottleneck is not just code. The bottleneck is clarity. Can you explain what you want? Can you break it into parts? Can you tell when the agent misunderstood? Can you review the work? Can you keep track of decisions? Can you stop the project from becoming a pile of unrelated fixes? ContextQB was built to teach those skills.

We want more people to become capable builders — not by pretending everyone is now a software engineer, and not by selling the fantasy that agents can do everything for you. The point is more grounded:

> AI agents make building more accessible. ContextQB teaches the discipline that makes that access useful.

## How we make money

ContextQB is being built as an open, practical learning system. The public methodology is free to read. The goal is to make the basic ideas available to anyone who wants to learn how to build with agents.

Over time, ContextQB may be supported by paid courses, workshops, tools, templates, products, and consulting. The free material will remain the foundation. Paid offerings will provide deeper structure, guided paths, and more direct support for people who want help applying the method.

The best way to support the project right now is simple: use it, build with it, tell us what is confusing, show us where the method helped, and tell us where it broke down. ContextQB should improve by being used in the field.

## How to start

Pick the lane that matches where you are.

### If you are completely new

Start by reading a few guides. Do not try to understand the entire system at once. Your goal is basic orientation: What is an agent? What is context? Why do agents lose track? How do you give better instructions? How do you check the work?

Once those ideas start to make sense, pick a small project and try to build something. Small is good — a personal website, a simple calculator, a tiny directory, a basic dashboard, a landing page, a tool that solves one annoying problem. The goal of the first project is not perfection. The goal is to learn how the agent behaves.

### If you already have an idea

Write down the simplest version of what you want to build. Do not start with every feature; start with the core: who is it for, what does it help them do, what is the first useful version, what should happen on the first screen, what information does the app need, and what would count as "working." Then use ContextQB to turn that idea into a clearer brief for your agent.

### If you already have a project

Start by helping the agent understand the project. Before asking for new features, make sure the agent knows what already exists. Give it a map. Ask it to inspect the structure. Ask it to explain how the project works. Ask it where the risks are.

Then move in smaller steps. Do not ask the agent to rebuild everything unless you actually want everything rebuilt. Ask for specific changes, review the result, and keep track of what changed.

### If you are using Cursor or another agentic IDE

Use ContextQB as a working method inside your IDE. Before each task, brief the agent clearly. Before accepting changes, inspect the output. After meaningful changes, update the project map. When the project starts to feel confusing, stop and re-orient. The agent can move quickly. Your job is to keep the work legible.

## A reasonable first day

Here is a simple first path:

1. Read the [Start Here](/start-here) page.
2. Read one guide about context.
3. Pick a small project or existing idea.
4. Write a plain-English description of what you want to build.
5. Ask your AI agent to help you turn that description into a simple project plan.
6. Build one small piece.
7. Review what the agent made.
8. Write down what you learned.

That is enough for day one. You do not need to install every tool, read every playbook, or understand every acronym before you begin. Start with one small build, then come back for the next play.

## The main habit

ContextQB is built around one simple habit:

> Before you ask the agent to act, make sure it understands the job.

That means giving it the right context, the right instructions, and the right standard for success. When the work comes back, do not just accept it because it looks impressive. Read it. Test it. Ask what changed. Ask what might have broken. Ask whether the result matches the original goal.

This is the new skill — not coding from scratch, not blindly trusting the machine, not collecting clever prompts. The skill is learning how to direct agentic work. That is what ContextQB teaches, and it is what makes you a good context quarterback over time.

## Where to go next

If you are new, start with the basic orientation guides. If you have a project, move into the playbooks. If you are ready to connect tools, explore the [MCP](/mcp) and the [drift detector](/check) setup.

And if you feel overwhelmed, return to the simple rule: give the agent better context, ask for smaller steps, inspect the work, and keep the project understandable. That is the path.

## See also

- [Guide: Understanding the Context Window](contextqb://guides/understanding-the-context-window) — the variable the brand is named for, and what you are calling plays around.
- [Guide: What an Application Is](contextqb://guides/what-an-application-is) — the substrate every app sits on, in plain language.
- [Guide: Choosing Your IDE and LLM](contextqb://guides/choosing-your-ide-and-llm) — set up the workshop where you and the agent will build.
- [Guide: Understanding LLMs](contextqb://guides/understanding-llms) — how the models behave and why they are not interchangeable.
- [Principle: The Context Quarterback — Every Repo Needs a Boot Manifest](contextqb://principles/context-quarterback-the-onboarding-map) — the boot manifest you carry into every session.
