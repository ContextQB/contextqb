---
id: agents-md-vs-readme
title: AGENTS.md vs. README.md
summary: They sit at the same spot in the repo and look like siblings, but they answer different questions for different readers. The README is the human's front door; AGENTS.md is the agent's operating manual. A repo that confuses them serves neither.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - developer
journey_stage: 1
journey_rank: 15
framing: "I already have a README — why does ContextQB want a second file called AGENTS.md?"
tags:
  - documentation
  - agents
  - getting-started
related:
  - set-up-agents-md
  - documentation-as-architecture
  - documentation-for-agent-alignment
  - context-quarterback-the-onboarding-map
review:
  status: draft
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review Q5 (authored 2026-09-09)"
  reviewer_notes: "Authored from G-05 (grow briefings). Resolves the README/AGENTS.md confusion named in set-up-agents-md's anti-patterns."
---

# AGENTS.md vs. README.md

## The one-line answer

The README tells a human what this project is. `AGENTS.md` tells an agent how to work in it. Same folder, different jobs.

## The fundamental difference

A README is read **once, by a person, deciding whether to care.** It earns its place with a pitch: what the project is, why it exists, how to install it, where to learn more.

`AGENTS.md` is read **every session, by a machine, deciding what to do.** It earns its place with constraints: the naming rules, the package boundaries, where state lives, what the agent must not do, and where to look next.

The tells are different too. A good README has a logo and a quickstart. A good `AGENTS.md` has a banned-filenames list.

## Side-by-side

|                  | README.md                              | AGENTS.md                                         |
| ---------------- | -------------------------------------- | ------------------------------------------------- |
| **Reader**       | A human browsing the repo              | An agent about to edit the repo                   |
| **Read when**    | Once, at discovery                     | Every session, at boot                            |
| **Voice**        | Inviting, outward-facing               | Direct, second person, operational                |
| **Content**      | What and why; install; links           | How to work here: rules, boundaries, prohibitions |
| **Failure mode** | Out of date → a human is mildly misled | Out of date → an agent confidently builds wrong   |
| **Convention**   | Universal, decades old                 | Emerging standard across agentic tools            |

## How they work together

Keep both, small, and cross-linked. The README points at `AGENTS.md` for contributors using agents; `AGENTS.md` points at the README for the product pitch and at the deeper docs for the rules. What neither should do is contain the other: a README with a "Rules for AI" appendix nobody maintains is worse than a two-line pointer to a real `AGENTS.md`.

And neither replaces the map. The README is the front door, `AGENTS.md` is the operating manual, and [`context.qb.yaml`](contextqb://principles/context-quarterback-the-onboarding-map) is the play-sheet the agent boots from. Three small files, three jobs.

## The deeper reason

The agent does not accumulate context between sessions — every prompt starts from zero. The README was never designed for that reader. [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture) is the principle: in an agentic project, the operating instructions are load-bearing, so they get their own file with its own conventions. [Set Up AGENTS.md for Your Project](contextqb://playbooks/set-up-agents-md) is the playbook.

## See also

- [Playbook: Set Up AGENTS.md for Your Project](contextqb://playbooks/set-up-agents-md) — the six-section template
- [Principle: Documentation for Agent Alignment](contextqb://principles/documentation-for-agent-alignment) — who documentation is really for
- [Principle: The Context Quarterback](contextqb://principles/context-quarterback-the-onboarding-map) — the boot manifest that pairs with AGENTS.md
