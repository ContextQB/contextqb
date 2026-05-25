---
id: set-up-a-documentation-system
title: Set Up a Documentation System for Your Project
summary: Scaffold the small, deliberate set of documentation surfaces your project needs from day one — sized for an operator with one agent today, ready to grow into a team-sized doc system later without restructuring.
version: 0.1.0
problem: |
  Without an intentional documentation system, every project drifts into one of two failure modes: a sprawling "docs/" folder no one reads, or no documentation at all. Both leave the agent reinventing the project on every prompt. The cost is paid in every session, not at some far-off handoff.
when_to_use: |
  At the very start of a new project, alongside `set-up-agents-md` and `write-a-context-qb`. Also: at the start of a new major feature or subsystem, when a new documentation surface (a punchlist, a runbook, a post-mortem) is about to appear for the first time.
expected_outputs:
  - A documented set of audience surfaces (AGENTS.md, ADRs, architecture overviews, operator-facing content) with one example file in each.
  - A documented set of process surfaces (punchlists, handoffs, post-mortems, experiments, runbooks) — or an explicit list of which are not in use yet.
  - A naming pattern recorded in each directory's README so the second instance of any document already knows what to call itself.
  - References to the three documentation-related principles so future contributors do not re-derive the system.
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 1
related_principles:
  - documentation-as-architecture
  - documentation-for-agent-alignment
  - documentation-file-naming
  - naming-conventions
  - context-quarterback-the-onboarding-map
tags:
  - documentation
  - greenfield
  - setup
---

# Set Up a Documentation System for Your Project

A documentation system is not "a `docs/` folder." It is a small, deliberate set of surfaces, each with a defined audience, update cadence, and naming pattern. The cost of getting it wrong on day one is small. The cost of getting it wrong on day ninety is enormous, because by then every contributor and every agent has made assumptions about where things live and what they are called.

This playbook produces the smallest viable system you can stand up in under an hour, sized for an operator working with one agent today and ready to absorb team-scale usage later without restructuring.

## Before you start

Read these three principles first; they are the substrate this playbook rests on:

- [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture) — why documentation is load-bearing in agentic dev.
- [`documentation-for-agent-alignment`](contextqb://principles/documentation-for-agent-alignment) — who the documentation is _for_ (your current agent and current self, not a future team).
- [`documentation-file-naming`](contextqb://principles/documentation-file-naming) — how to name the files so the second instance of any document does not require a rename.

Five minutes on each. The rest of this playbook makes more sense afterward.

## The two kinds of documentation surface

Every long-lived project ends up with two kinds of documentation:

1. **Audience surfaces** — written for a specific reader (the agent, the operator, the future engineer). Defined by [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture).
2. **Process surfaces** — written to track the work itself (planning, handoffs, postmortems, experiments). These are the documents `documentation-as-architecture` does not name, and they are where the [`documentation-file-naming`](contextqb://principles/documentation-file-naming) discipline matters most because a second instance almost always arrives.

Set up both at once. Treating them as the same thing is the most common documentation-design mistake.

## The audience surfaces (day one minimum)

These four are the day-one minimum for any project that will be touched by agents. Set them all up before writing your first feature.

| Surface                | Path                           | Purpose                                                                                           |
| ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `AGENTS.md`            | Repo root                      | Current operating instructions. See [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md). |
| `context.qb.yaml`      | Repo root                      | Boot manifest. See [`write-a-context-qb`](contextqb://playbooks/write-a-context-qb).              |
| ADRs                   | `docs/architecture/decisions/` | Append-only structural decisions. See [`write-an-adr`](contextqb://playbooks/write-an-adr).       |
| Architecture overviews | `docs/architecture/`           | Short "what does this look like today?" docs, one per area.                                       |

Concrete first files:

- `AGENTS.md` — six sections, under 500 lines.
- `context.qb.yaml` — workspace tree, routes, decisions, status, entry points.
- `docs/architecture/decisions/_template.md` — copy of the ADR template.
- `docs/architecture/decisions/0001-<your-first-decision>.md` — the first real ADR, even if it just records "use this language and framework."
- `docs/architecture/decisions/README.md` — index pointing at the entries.
- `docs/architecture/repo-structure.md` — one page describing how the repo is shaped today.

Those six files are the entire day-one audience-surface footprint.

## The process surfaces (set up the directories empty)

These are the surfaces that show up the moment work is underway. The trap is to ignore them until the first instance appears, at which point the operator names the file `PUNCHLIST.md` or `HANDOFF.md` and starts the bad-naming cycle.

The fix is to set up the directories empty, with a `README.md` in each that documents the naming pattern. The first real document then has a name pattern waiting for it.

| Surface      | Path                 | When it shows up                                                                    | Naming pattern                                                                             |
| ------------ | -------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Punchlists   | `docs/punchlists/`   | First feature that takes more than a session.                                       | `NNNN-<slug>.md` where `NNNN` is the related ADR number, OR `<feature-slug>-punchlist.md`. |
| Handoffs     | `docs/handoffs/`     | First time you stop work mid-feature and need to leave context for a fresh session. | `YYYY-MM-DD-<feature-slug>.md`.                                                            |
| Post-mortems | `docs/post-mortems/` | First incident or non-trivial bug.                                                  | `YYYY-MM-DD-<incident-slug>.md`.                                                           |
| Experiments  | `experiments/`       | First time you want to test a claim with data.                                      | `YYYY-MM-<experiment-slug>/` folder with `experiment-protocol.md` and other files inside.  |
| Runbooks     | `docs/operations/`   | First time you need to record "how to deploy" or "how to rotate this secret."       | `<verb-noun>.md` (e.g. `rotate-supabase-keys.md`).                                         |

You do not need to create all of these at once. Create the directories you anticipate needing in the next month; defer the others. When the moment for one arrives, set it up before writing the first document inside it — never the other way around.

## The discipline that makes this work

Three rules. All small, all cheap to enforce:

1. **Set up the directory before the first instance.** When you realise a new kind of document is about to be written for the first time, pause and create the directory with its `README.md` first. This takes two minutes and prevents the `PUNCHLIST.md` problem.
2. **Document the naming pattern in the directory's `README.md`.** Even one line is enough: "Files in this directory are named `<pattern>`. See [`documentation-file-naming`](contextqb://principles/documentation-file-naming)." The second contributor (human or agent) does not have to guess.
3. **Update docs in the same change that triggers the update.** Not a separate sprint, not a "TODO: update docs." If the structural decision changes, the ADR (or AGENTS.md, or context.qb.yaml) changes with it.

## Copy-pasteable scaffold

This is what a freshly-scaffolded greenfield repo looks like. Adjust for stack, but keep the shape.

```
your-project/
├── AGENTS.md                          ← Day 1
├── README.md                          ← Day 1
├── LICENSE
├── context.qb.yaml                    ← Day 1
├── docs/
│   ├── architecture/
│   │   ├── repo-structure.md          ← Day 1
│   │   ├── decisions/
│   │   │   ├── README.md              ← Day 1 (ADR index)
│   │   │   ├── _template.md           ← Day 1
│   │   │   └── 0001-<your-decision>.md ← Day 1 (first ADR)
│   │   └── <other-area>.md            ← Add as the system grows
│   ├── punchlists/
│   │   └── README.md                  ← Created when the first cross-cutting feature lands
│   ├── handoffs/
│   │   └── README.md                  ← Created when the first session-handoff happens
│   ├── operations/
│   │   └── README.md                  ← Created when the first runbook is needed
│   └── post-mortems/
│       └── README.md                  ← Created when the first incident happens
└── experiments/
    └── README.md                      ← Created when the first experiment is registered
```

Each directory's `README.md` is one screen at most. Index, naming pattern, link to the relevant ContextQB principle. Nothing more.

## How to ask an agent to scaffold this

> Scaffold a ContextQB-style documentation system for this project per the `set-up-a-documentation-system` playbook. Create the day-one audience surfaces (AGENTS.md draft, context.qb.yaml draft, docs/architecture/decisions/ with template and index, docs/architecture/repo-structure.md). Set up the docs/punchlists/ and docs/handoffs/ directories with READMEs documenting the naming pattern from `documentation-file-naming`. Do not create the other process-surface directories yet — note them in docs/architecture/repo-structure.md as "not yet in use." After scaffolding, list every file you created and the one-line purpose of each.

Then read the agent's output. Each generated file is a draft, not a finished document. The structure is what the playbook produces; the specifics are your call.

## Anti-patterns

- **A single `docs/` folder with no internal structure.** Inevitable accretion produces a folder no one reads.
- **Deferring the first ADR until "we have something worth deciding."** The act of writing the first ADR — even for a small decision — is what teaches the team (including the agent) where ADRs live and what they look like.
- **Creating empty process directories with no `README.md`.** The directory's purpose has to be readable from inside it, or the next contributor will create a different directory for the same purpose.
- **A README at the repo root that tries to be both human introduction and agent boot manifest.** Those are two different jobs. See [`context-quarterback-the-onboarding-map`](contextqb://principles/context-quarterback-the-onboarding-map).
- **Generic process docs at the repo root (`PUNCHLIST.md`, `HANDOFF.md`, `NOTES.md`).** These violate [`documentation-file-naming`](contextqb://principles/documentation-file-naming) on day one and cost a rename the moment a second instance appears.

## Pairing this with ContextQB

If your project uses the ContextQB MCP, your scaffolded system can lean on the published methodology rather than restating it. Your project-specific documentation only needs to capture what is _specific_ to your project; the universal principles are available to the agent on demand. That keeps your own documentation lighter and forces it to focus on what only you can answer.
