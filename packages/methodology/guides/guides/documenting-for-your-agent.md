---
id: documenting-for-your-agent
title: Documenting for Your Agent
summary: Documentation in agentic dev isn't paperwork for a future hire — it's how you keep your current agent on the architecture you've chosen. This guide is the operator's plain-language introduction to the documentation discipline ContextQB depends on.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 1
journey_rank: 20
intro: |
  If you've been told that "writing documentation" is what you do after the code is finished — for some hypothetical future engineer — you've been told the wrong story for agentic development. In agentic dev, documentation is what you write so the agent you're talking to right now does not reinvent your project on every prompt. This guide reframes the whole exercise and gives you the day-one minimum.
tags:
  - documentation
  - operator
  - alignment
related:
  - documentation-for-agent-alignment
  - documentation-file-naming
  - documentation-as-architecture
  - context-quarterback-the-onboarding-map
  - the-mental-model-of-your-app
next_steps:
  - Open the project you're working on and identify which documents your agent actually reads.
  - Write or update your `AGENTS.md` so the next session does not start from zero.
  - Write or update your `context.qb.yaml` so the agent can boot from one file.
  - Pick one decision you've made this week and write a one-page ADR for it.
  - Before creating your next document, run the three filename smell tests from `documentation-file-naming`.
---

# Documenting for Your Agent

**Plain language:** Documentation, in traditional software, is something you write at the end of a project so the next engineer can understand it. In agentic software, documentation is something you write while you build, so the agent you're talking to right now can understand it. The audience is different. The timing is different. The economics are different. Almost everything you've heard about documentation needs to be re-thought.

## You're in the right place

If you've ever felt that documentation is overhead — the kind of thing serious engineers do but that nobody really reads — you are not wrong about traditional software. You are reading the wrong rulebook for agentic software, though, and the wrong rulebook is expensive. Every session you spend re-explaining your project to an agent is documentation work you are doing anyway, just informally, and forgetting at the end.

The mental shift this guide asks you to make is simple. It is also a real shift, not a small one.

## The shift, in one sentence

> Documentation in agentic dev is not for the engineer you will hire in two years. It is for the agent you are talking to right now, and for yourself five minutes from now in a fresh session.

That sentence is the whole guide. Everything else explains why it is true and what it changes about how you work.

## Why the shift matters

The agent has no continuous memory. Every prompt is a fresh boot. What the agent knows in this turn is exactly what is in its working memory — your message, the files it has read, the system instructions it received, and nothing else.

If the working memory does not include your project's structure, conventions, and decisions, the agent makes them up. Sometimes the guesses are good. Often they are not, and over a week of work the project quietly drifts as each session makes slightly different calls than the last.

The teams getting consistent results from agents are not the teams with better prompts. They are the teams whose documentation is the prompt — short instructions like "before doing X, read these three files," pointing at documents that exist and say what they need to say.

Your job, as the operator, is to make those documents exist. Not all of them. Not perfectly. The day-one minimum.

## The day-one minimum

These four pieces of documentation pay back the time you spend on them in the first session you do not have to re-explain your project. Set them up now, even if you have not written a feature yet.

| Document                                | What it answers                                              | Where it lives                 |
| --------------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| `AGENTS.md`                             | "How do agents work in this repo today?"                     | Repo root                      |
| `context.qb.yaml`                       | "What is this repo, what's in it, and where should I start?" | Repo root                      |
| One Architectural Decision Record (ADR) | "Why did we decide \[the first thing you decided]?"          | `docs/architecture/decisions/` |
| One architecture overview               | "What does this part of the system look like today?"         | `docs/architecture/`           |

Four files. Each one short. Together they let you write a prompt like "before this work, read AGENTS.md and the ADR for our database choice" — and that prompt actually works because those files actually exist.

The [`set-up-a-documentation-system`](contextqb://playbooks/set-up-a-documentation-system) playbook is the step-by-step. If you want the deeper "why" first, the principle behind all of this is [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture).

## What about future engineers?

If your project grows enough to bring on people, the documentation you wrote for your agent will help them too. That is a real, valuable benefit — but it is not the goal. It is a bonus. Writing for the agent first produces shorter, sharper, more current documentation than writing for a hypothetical future engineer first. The future engineer gets the same docs, written better, because they were forced to survive the test of being read every session by an audience with no continuous memory.

This is one of the genuinely good surprises of agentic dev: doing the thing that helps you most today turns out to also be the thing that helps future contributors most.

## The "I'll do it later" tax

In a traditional project, "I'll document later" defers a cost that may or may not come due — depending on who joins the team and when. In an agentic project, "I'll document later" defers a cost that is paid in every subsequent session. Each prompt that does not have access to the unwritten constraint is a prompt where the agent re-derives or invents it. Over a week of work, the unwritten constraint has been re-litigated dozens of times and applied inconsistently.

The cleanup cost rises faster than linearly because each inconsistent application is a new fact the next session has to reconcile.

The cure is not "write more documentation." The cure is to write the small, specific document that the agent would have invented from, the moment you realise the agent would have invented from it. Usually that is one or two paragraphs. Usually it goes into `AGENTS.md`, an ADR, or the relevant architecture overview. Usually it takes five minutes.

## Naming the files matters more than you think

Most operators give the first instance of a new document a generic name — `PUNCHLIST.md`, `SETUP.md`, `NOTES.md`, `HANDOFF.md`. It feels harmless because there is only one of these documents and the name is short. The trap is that the second one always arrives, and now you are stuck either renaming the first (expensive) or stapling a disambiguator onto the second (`HANDOFF-task-8.5.md`, `PUNCHLIST-v2.md`) — which is itself a sign that the name was wrong from the start.

A documentation filename should describe what specifically the document is, not what kind of document it is. `qb-cli-v1-punchlist.md` is a name. `PUNCHLIST.md` is a category. The same rule that governs code filenames governs documentation filenames; the principle is [`documentation-file-naming`](contextqb://principles/documentation-file-naming), and the three smell tests are quick:

1. **The "the" test.** Read the filename aloud with "the" in front. "The PUNCHLIST" sounds wrong because there is no specific punchlist being referenced.
2. **The collision test.** Imagine the second instance arriving in six months. Does the name still work?
3. **The standalone-listing test.** Imagine the filename shown alone, with no folder context. Is it clear what the document is?

Five seconds at creation time. Never has to be paid again.

A small number of UPPERCASE filenames earn singleton status because every tool in the ecosystem recognises them: `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`. Outside that list, an UPPERCASE singleton is a smell.

## How docs grow with your project

You do not need to set everything up at once. You do need to set each thing up _before the first instance of it_, so the first instance lands inside a system rather than starting one.

A reasonable growth curve looks like this:

- **Day 1.** `AGENTS.md`, `context.qb.yaml`, the first ADR, the first overview, and `docs/archive/` (empty but with a README explaining the archive policy).
- **First feature that takes more than a session.** Add `docs/scopes/` with a `README.md` describing the naming pattern. Then create the scope for the feature.
- **First time you stop work mid-feature.** Add `docs/handoffs/` with a `README.md` describing the naming pattern. Then write the handoff.
- **First incident.** Add `docs/post-mortems/` with a `README.md`. Then write the post-mortem.
- **First time you want to test a claim with data.** Add `experiments/` with a `README.md`. Then write the protocol.
- **First scope or handoff that finishes.** Move it to `docs/archive/<category>/` with an archive header. Never delete a governance doc. See [`append-dont-overwrite`](contextqb://principles/append-dont-overwrite).

Each step is small. Each one prevents the next bad-naming cycle. The discipline is not "have every directory ready on day one" — it is "create the directory before the first file goes in it, and put the naming pattern in a README inside it."

## The one test you can run today

Pick a feature you have shipped recently. Open a fresh agent session — no context, no history, just a blank prompt. Ask the agent:

> Read this repository and tell me how it is structured, what its main conventions are, and what the most important architectural decisions have been. Cite the files you used to learn this.

Then read the answer. Three things can happen:

1. **The agent quotes your actual documentation and gives a correct answer.** Your documentation system is working. Keep it healthy as the project grows.
2. **The agent invents a plausible-sounding but wrong answer.** Your documentation system has a gap. The specific things the agent got wrong are the documents that need to exist or need to be more findable.
3. **The agent says it cannot find any documentation and walks the source tree.** Your project does not yet have a documentation system. Today is a good day to start.

This is the single highest-signal experiment you can run on an agentic project, and it costs one prompt.

## Where to go from here

If this guide reframed something for you, the next steps depend on where you are:

- **You are starting fresh.** Read [`set-up-a-documentation-system`](contextqb://playbooks/set-up-a-documentation-system) and stand up the day-one minimum. It takes under an hour.
- **You already have a project and the structure feels coherent.** Run the one-prompt test above. If you get a wrong answer, you have your next documentation task.
- **You want to internalise the underlying principles.** Read the three documentation principles in order: [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture), [`documentation-for-agent-alignment`](contextqb://principles/documentation-for-agent-alignment), [`documentation-file-naming`](contextqb://principles/documentation-file-naming). Five minutes each. They become the spine you reason from.

The shift from "documentation is for future engineers" to "documentation is how I direct my agent" is small in words and large in effect. Once you make it, every other ContextQB principle gets easier — because most of them rely on documentation being the medium that carries them between sessions.

## See also

- [Playbook: Set Up a Documentation System for Your Project](contextqb://playbooks/set-up-a-documentation-system) — the step-by-step.
- [Playbook: Set Up AGENTS.md for Your Project](contextqb://playbooks/set-up-agents-md) — the single most leverage-positive file.
- [Playbook: Write a context.qb for Your Repository](contextqb://playbooks/write-a-context-qb) — the boot manifest agents read first.
- [Principle: Documentation for Agent Alignment](contextqb://principles/documentation-for-agent-alignment) — the deeper "why."
- [Principle: Documentation File Naming](contextqb://principles/documentation-file-naming) — how to name the files.
- [Principle: Documentation as Architecture](contextqb://principles/documentation-as-architecture) — the foundational principle.
- [Principle: The Context Quarterback — Every Repo Has a Boot Manifest](contextqb://principles/context-quarterback-the-onboarding-map) — the boot-manifest principle behind `context.qb.yaml`.
