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

## What this guide is about

ContextQB is for people who want to build software with AI agents.

You may be a founder, marketer, operator, small business owner, designer, writer, hobbyist, or just someone with an idea you want to turn into a working thing. You do not need to be a traditional developer to begin.

But you do need a way to work.

AI agents can write code, edit files, explain errors, generate interfaces, connect tools, and help you move much faster than you could on your own. The confusing part is that they can also lose the thread, make strange assumptions, break things that were already working, or turn a simple idea into a messy project you no longer understand.

ContextQB exists to help with that.

We teach the basic operating habits of AI-assisted building: how to explain what you want, give the agent useful context, break work into manageable steps, check the output, and keep the project moving in the right direction.

This guide explains what ContextQB is, why it exists, and how to take your first steps.

## First: you are not behind

If you landed here and words like agent, IDE, repo, MCP, context window, or CLI still feel unfamiliar, that is normal.

This is a new way of working. The tools are moving quickly. The vocabulary is still settling. Even experienced developers are learning new habits.

You do not need to understand everything before you start.

You need a basic orientation, a small project, and a willingness to work step by step. ContextQB is designed to help you build that confidence gradually.

Do not try to memorize the whole system. Read enough to get moving. Come back when you get stuck. Use the guides and playbooks when they become relevant.

The goal is not to become an expert in ContextQB.

The goal is to build.

## The basic idea

When you build with an AI agent, you are not just asking a chatbot for answers.

You are directing a system that can take action.

It can read your project.
It can change files.
It can write code.
It can explain problems.
It can propose fixes.
It can help you build something real.

But the agent only works well when it has the right context and clear instructions.

That is the core idea behind ContextQB:

**Better context leads to better work.**

If the agent understands the project, the goal, the constraints, and the next step, it can help you move forward. If it does not, it will guess. Sometimes the guesses are useful. Sometimes they create a mess.

ContextQB gives you a method for reducing the guessing.

## Some words you will see

You do not need to master these on day one. These are just the basic terms that will show up across the site.

**AI agent**
An AI system that can do more than answer questions. It can take actions, such as reading files, editing code, running commands, or helping manage a project.

**LLM**
A large language model, such as ChatGPT, Claude, or Gemini. This is the engine behind many AI tools.

**IDE**
The app where software gets built. Many people now use tools like Cursor or VS Code because they let an AI agent work directly inside a coding project.

**Repo**
Short for repository. This is the folder where your project lives: code, files, notes, configuration, documentation, and everything else the app needs.

**Context**
The information the agent is using to understand the task. This can include your prompt, your files, your project notes, your previous decisions, and the instructions you give it.

**Context window**
The amount of information the AI can pay attention to at one time. It is not infinite. If the wrong things are in context, or the right things fall out of context, the agent can lose track.

**MCP**
Model Context Protocol. A way for AI agents to connect to outside tools and resources. In ContextQB, MCP lets an agent access our principles, playbooks, and audits directly.

**context.qb.yaml**
A small project map for your repo. It helps the agent understand what the project is, how it is organized, and what it needs to pay attention to.

You do not need all of these tools immediately. Start with the concepts. Add the machinery when you need it.

## What ContextQB actually gives you

ContextQB is a practical system for learning how to build with AI agents.

It includes:

**Guides**
Plain-English explanations of the big ideas: context, agents, project structure, prompts, review habits, and the new skills involved in AI-assisted building.

**Principles**
Short lessons that explain how to think while working with agents. These help you understand why projects drift, why context matters, and why your job is still judgment.

**Playbooks**
Step-by-step operating patterns for common tasks. Use these when you want to brief an agent, review work, inspect a repo, set up a project, or recover from confusion.

**Prompts and audits**
Reusable instructions that help you ask an agent to do specific kinds of work more carefully.

**Project mapping**
A way to describe your project so the agent has a stable picture of what it is working on.

**Tools**
Command-line and MCP tools for people who want to connect ContextQB directly to their coding workflow.

You can use ContextQB lightly or deeply. You can simply read the guides, or you can wire the tools into your agentic development setup.

The important thing is to start at the right level.

## Why we built it

AI has changed who can build software.

That does not mean software is suddenly easy. It means more people can now participate if they learn the right working habits.

A person with a clear idea can now sit down with an AI agent and make progress that would have required a technical team only a few years ago. They can prototype, test, revise, and sometimes ship real products.

But the new bottleneck is not just code.

The bottleneck is clarity.

Can you explain what you want?
Can you break it into parts?
Can you tell when the agent misunderstood?
Can you review the work?
Can you keep track of decisions?
Can you stop the project from becoming a pile of unrelated fixes?

ContextQB was built to teach those skills.

We want more people to become capable builders. Not by pretending everyone is now a software engineer, and not by selling the fantasy that agents can do everything for you.

The point is more grounded:

**AI agents make building more accessible. ContextQB teaches the discipline that makes that access useful.**

## How we make money

ContextQB is being built as an open, practical learning system.

The public methodology is free to read. The goal is to make the basic ideas available to anyone who wants to learn how to build with agents.

Over time, ContextQB may be supported by paid courses, workshops, tools, templates, products, and consulting. The free material will remain the foundation. Paid offerings will provide deeper structure, guided paths, and more direct support for people who want help applying the method.

The best way to support the project right now is simple:

Use it.
Build with it.
Tell us what is confusing.
Show us where the method helped.
Tell us where it broke down.

ContextQB should improve by being used in the field.

## How to start

Pick the lane that matches where you are.

### If you are completely new

Start by reading a few guides. Do not try to understand the entire system at once.

Your goal is basic orientation:

What is an agent?
What is context?
Why do agents lose track?
How do you give better instructions?
How do you check the work?

Once those ideas start to make sense, pick a small project and try to build something.

Small is good. A personal website. A simple calculator. A tiny directory. A basic dashboard. A landing page. A tool that solves one annoying problem.

The goal of the first project is not perfection. The goal is to learn how the agent behaves.

### If you already have an idea

Write down the simplest version of what you want to build.

Do not start with every feature. Start with the core:

Who is it for?
What does it help them do?
What is the first useful version?
What should happen on the first screen?
What information does the app need?
What would count as "working"?

Then use ContextQB to turn that idea into a clearer brief for your agent.

### If you already have a project

Start by helping the agent understand the project.

Before asking for new features, make sure the agent knows what already exists. Give it a map. Ask it to inspect the structure. Ask it to explain how the project works. Ask it where the risks are.

Then move in smaller steps.

Do not ask the agent to rebuild everything unless you actually want everything rebuilt. Ask for specific changes, review the result, and keep track of what changed.

### If you are using Cursor or another agentic IDE

Use ContextQB as a working method inside your IDE.

Before each task, brief the agent clearly.
Before accepting changes, inspect the output.
After meaningful changes, update the project map.
When the project starts to feel confusing, stop and re-orient.

The agent can move quickly. Your job is to keep the work legible.

## A reasonable first day

Here is a simple first path:

1. Read the Start Here page.
2. Read one guide about context.
3. Pick a small project or existing idea.
4. Write a plain-English description of what you want to build.
5. Ask your AI agent to help you turn that description into a simple project plan.
6. Build one small piece.
7. Review what the agent made.
8. Write down what you learned.

That is enough for day one.

You do not need to install every tool, read every playbook, or understand every acronym before you begin.

Start with one small build.

Then come back for the next play.

## The main habit

ContextQB is built around one simple habit:

**Before you ask the agent to act, make sure it understands the job.**

That means giving it the right context, the right instructions, and the right standard for success.

When the work comes back, do not just accept it because it looks impressive. Read it. Test it. Ask what changed. Ask what might have broken. Ask whether the result matches the original goal.

This is the new skill.

Not coding from scratch.
Not blindly trusting the machine.
Not collecting clever prompts.

The skill is learning how to direct agentic work.

That is what ContextQB teaches.

## Where to go next

If you are new, start with the basic orientation guides.

If you have a project, move into the playbooks.

If you are ready to connect tools, explore the MCP and CLI setup.

And if you feel overwhelmed, return to the simple rule:

Give the agent better context.
Ask for smaller steps.
Inspect the work.
Keep the project understandable.

That is the path.
