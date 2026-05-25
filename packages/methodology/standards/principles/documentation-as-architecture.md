---
id: documentation-as-architecture
title: Documentation as Architecture
summary: In the agentic era, documentation is not a byproduct of building — it is load-bearing. Agents re-derive context on every call; without explicit docs, every prompt starts from zero.
version: 0.1.0
category: documentation
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
tags:
  - documentation
  - adrs
  - agents
anti_patterns:
  - "We do not have time to write docs right now."
  - "The code is the documentation."
  - A README that names the project and nothing else.
  - Architectural decisions discussed in Slack, Discord, or chat — and never written down.
  - A single sprawling "docs.md" that grows by accretion and is read by no one.
  - Documentation that describes what the code obviously does, but never why.
  - Updates that ship without touching the docs they invalidated.
agent_instructions:
  - Before doing non-trivial work, read AGENTS.md, the relevant ADRs, and any architecture overviews for the area you are touching.
  - When you make a decision that future readers might question, propose an ADR rather than leaving the decision implicit in code.
  - When you change behaviour described in documentation, update the documentation in the same change.
  - If a section of documentation is contradicted by the current code, flag it. Do not silently make the code match the docs or vice versa — surface the drift.
related:
  - separation-of-concerns
  - maintainability
  - naming-conventions
  - documentation-for-agent-alignment
  - documentation-file-naming
---

# Documentation as Architecture

In a traditional codebase, documentation is helpful. In an agentic codebase, documentation is structural. The difference is that an agent does not accumulate context the way a human teammate does. Every prompt starts from approximately zero. The agent reads what it can find in the working set, makes assumptions about everything else, and acts.

If the working set is just code, the agent will reinvent your architecture every session. It will guess at naming. It will guess at where state lives. It will guess at which boundaries are intentional and which are accidental. Sometimes it will guess right. Often it will not — and the guesses compound.

Explicit documentation closes that gap.

## The rule

**Treat documentation as part of the system, not as a description of it.**

Three documentation surfaces are load-bearing in an agentic project. Skip any of them and you pay continuously, not once.

### 1. `AGENTS.md` — the project-level operating instructions

A single file at the repo root that an agent is expected to read first. It tells the agent:

- What the project is.
- The package boundaries and their responsibilities.
- The naming conventions.
- Where state lives, where orchestration lives.
- What the agent must not do.
- Where to look next (ADRs, architecture overviews, principles).

`AGENTS.md` is becoming the de facto convention across agentic tools — Cursor, Claude Desktop, Aider, and others all recognise it. Even tools that do not auto-load it benefit when a user says "read AGENTS.md first."

Without `AGENTS.md`, every prompt has to either re-explain the project or accept whatever defaults the agent invents. With it, every prompt starts from a shared baseline.

See the [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md) playbook.

### 2. Architectural Decision Records (ADRs) — the why

An ADR is a short, dated record of a structural decision: the context, the choice, and the consequences. ADRs are not for everything. They are for the decisions a future reader (human or agent) might reasonably question — and which would otherwise be invisible.

Why ADRs matter for agents specifically:

- An agent reading code cannot distinguish "we chose this on purpose" from "we did this because the AI suggested it first." ADRs make intent explicit.
- An agent proposing a refactor will undo prior decisions unless those decisions are visible. ADRs prevent the refactor from being a regression.
- An agent encountering an ambiguity can ask "is there an ADR about this?" and either find an answer or know to ask.

See the [`write-an-adr`](contextqb://playbooks/write-an-adr) playbook.

### 3. Architecture overviews — the what

Distinct from ADRs, architecture overviews describe the _current_ shape of the system: package boundaries, data flow, the runtime surface. They answer "what does this look like today?" rather than "why did we decide it this way?"

These are typically short — one page per area — and live alongside ADRs. The ADRs are the historical record; the overviews are the snapshot.

## Why this matters more in agentic dev

In traditional dev, the cost of missing documentation falls mostly on new hires and on yourself six months later. The team carries the context.

In agentic dev, the cost falls on every interaction. The agent is your new hire, every prompt. There is no accumulating team knowledge — only what you write down.

The teams that get consistent performance from agents are not the ones with the best prompts. They are the ones with the best documentation, and prompts that point the agent at it.

## The compounding effect

Each undocumented decision generates micro-drift. The agent makes a slightly different call this time than last time. Over weeks, the system becomes a museum of inconsistent choices. Naming drifts. State ownership drifts. Module boundaries soften.

The cure is not more prompts. The cure is documentation that the prompts can point at.

## Anti-patterns in detail

- **"We do not have time to write docs right now."** True. You also do not have time to keep re-explaining the architecture to the agent. Pick one.
- **"The code is the documentation."** The code shows _what_. Documentation shows _why_. Agents need both.
- **Slack-only decisions.** A decision discussed in chat and never written down is a decision the agent does not know about. The next refactor undoes it.
- **Docs that paraphrase the code.** "`fetchUserProfile` fetches the user profile." Worse than nothing — it crowds out the docs that would be useful.
- **Docs that go stale.** Documentation only works if it is updated. Treat docs touches as part of every meaningful change.

## How to ask an agent to enforce this

> Audit this repository's documentation surface. Confirm that the following exist and have meaningful content:
>
> 1. `AGENTS.md` at the repo root.
> 2. An ADR directory with a template and at least one decision recorded.
> 3. Per-area architecture overviews.
>
> For each, evaluate whether the content is specific to this project or generic. Flag generic content. Flag any place where current code contradicts documentation. Propose a prioritised list of documentation work, smallest viable items first.

## Companion principles

This principle establishes that documentation is load-bearing. Two companion principles handle the related questions:

- [`documentation-for-agent-alignment`](contextqb://principles/documentation-for-agent-alignment) answers _who the documentation is for_ — your current agent and current self, not a future team.
- [`documentation-file-naming`](contextqb://principles/documentation-file-naming) answers _what to call the files_ — describing responsibility rather than category, with a small list of conventional exceptions.
