---
id: set-up-a-documentation-system
title: Set Up a Documentation System for Your Project
summary: Scaffold the small, deliberate set of documentation surfaces your project needs from day one — sized for an operator with one agent today, ready to grow into a team-sized doc system later without restructuring.
version: 0.2.1
problem: |
  Without an intentional documentation system, every project drifts into one of two failure modes: a sprawling "docs/" folder no one reads, or no documentation at all. Both leave the agent reinventing the project on every prompt. The cost is paid in every session, not at some far-off handoff.
when_to_use: |
  At the very start of a new project, alongside `set-up-agents-md` and `write-a-context-qb`. Also: at the start of a new major objective or subsystem, when a new documentation surface (a workstream, scope, runbook, or post-mortem) is about to appear for the first time.
expected_outputs:
  - A documented set of audience surfaces (AGENTS.md, ADRs, architecture overviews, operator-facing content) with one example file in each.
  - A list of the process surfaces (scopes, workstreams, handoffs, post-mortems, experiments, runbooks) you will add when each first instance arrives, plus an archive policy from day one.
  - A naming pattern recorded in each directory's README so the second instance of any document already knows what to call itself.
  - References to the three documentation-related principles so future contributors do not re-derive the system.
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 1
journey_rank: 40
related_principles:
  - append-dont-overwrite
  - context-quarterback-the-onboarding-map
  - documentation-as-architecture
  - documentation-file-naming
  - documentation-for-agent-alignment
  - naming-conventions
tags:
  - documentation
  - greenfield
  - setup
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-07 renewal B3 cross-link (0.2.1; author self-checked; independent review pending; not operator-accepted): one sentence after the scaffold prompt points to the fresh-session test in documenting-for-your-agent (already in related). 2026-10-07 renewal B2 (0.2.0; author self-checked; independent review pending; not operator-accepted): day-one footprint sized for one operator and aligned with the foundation, language-stack and documenting-for-your-agent atoms (overview, stack, first ADR, archive policy); process directories added when their first document arrives instead of up front; rule count fixed (four); runbook example made generic; roles stated; stale open-finding notes cleared (F-03, F-06 are resolved). Earlier notes: F-03 resolved 2026-09-09: keeps rank 40; set-up-drift-detection moved to 45.R3–R7 pass; the audience/process surface split is the corpus's clearest doc-system statement. R8 pending P4. 2026-10-02: body cross-references to the agent workstream method were added (those diffs were inspected in an independent final QA of the workstream vertical) and then finalized for publication (a wording edit that postdates that QA). The whole atom was not re-reviewed; last_reviewed reflects the earlier review."
related:
  - documenting-for-your-agent
  - new-project-foundation
  - run-an-agent-workstream
  - set-up-agents-md
  - start-an-agent-workstream
  - work-with-agents-through-documentation
  - write-a-context-qb
  - write-an-adr
---

# Set Up a Documentation System for Your Project

A documentation system is not "a `docs/` folder." It is a small, deliberate set of surfaces, each with a defined audience, update cadence, and naming pattern. The cost of getting it wrong on day one is small. The cost of getting it wrong on day ninety is enormous, because by then every contributor and every agent has made assumptions about where things live and what they are called.

This playbook produces the smallest viable system you can stand up in under an hour, sized for an operator working with one agent today and ready to absorb team-scale usage later without restructuring. Your agent can create every file; you decide which surfaces exist and you check that each first document says what is true.

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

These four are the day-one minimum for any project that will be touched by agents. Set them all up before writing your first feature — if you followed [`new-project-foundation`](contextqb://playbooks/new-project-foundation), most of them already exist.

| Surface                | Path                           | Purpose                                                                                           |
| ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `AGENTS.md`            | Repo root                      | Current operating instructions. See [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md). |
| `context.qb.yaml`      | Repo root                      | Boot manifest. See [`write-a-context-qb`](contextqb://playbooks/write-a-context-qb).              |
| ADRs                   | `docs/architecture/decisions/` | Append-only structural decisions. See [`write-an-adr`](contextqb://playbooks/write-an-adr).       |
| Architecture overviews | `docs/architecture/`           | Short "what does this look like today?" docs, one per area.                                       |

Concrete first files — the same footprint the foundation playbook creates:

- `AGENTS.md` — the seven-section template, under 500 lines.
- `context.qb.yaml` — workspace tree, routes, decisions, status, entry points.
- `docs/product/overview.md` — the one-page "what is this, who is it for" you wrote first.
- `docs/architecture/stack.md` — the language and stack decision (the output of the choose-a-language-stack playbook). This is your first architecture overview.
- `docs/architecture/decisions/0001-<your-first-decision>.md` — the first real ADR, even if it just records "use this language and framework."
- `docs/architecture/decisions/README.md` — index pointing at the entries.
- `docs/archive/README.md` — one paragraph stating the archive policy (below). No subfolders yet.

That is the entire day-one footprint. Naming rules and the orchestration note can live as sections of `AGENTS.md` in a single app; move them to `docs/architecture/naming.md` and `docs/architecture/orchestration.md` when they outgrow a screen. Add an ADR `_template.md` when you write the second decision, if a template helps.

## The process surfaces (add each when its first document arrives)

These are the surfaces that show up the moment work is underway. The trap is to write the first instance wherever is handy, at which point the operator names the file `PUNCHLIST.md` or `HANDOFF.md` and starts the bad-naming cycle.

The fix is not to create every directory on day one. It is to know the list below, and when the first document of a kind is about to be written, create its directory with a one-line `README.md` naming the pattern first. The first real document then has a name pattern waiting for it.

| Surface      | Path                 | When it shows up                                                                      | Naming pattern                                                                                                 |
| ------------ | -------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Scopes       | `docs/scopes/`       | First bounded assignment that takes more than a session.                              | `NNNN-<slug>.md` (ADR-anchored) or `<objective-slug>.md`.                                                      |
| Workstreams  | `docs/workstreams/`  | First objective that needs several passes, a review, or a session boundary.           | `<objective-slug>.md`; one current record per objective. An owning scope may serve instead.                    |
| Handoffs     | `docs/handoffs/`     | First time you stop work mid-objective and need to leave context for a fresh session. | `YYYY-MM-DD-<objective-slug>.md`.                                                                              |
| Post-mortems | `docs/post-mortems/` | First incident or non-trivial bug.                                                    | `YYYY-MM-DD-<incident-slug>.md`.                                                                               |
| Experiments  | `experiments/`       | First time you want to test a claim with data.                                        | `YYYY-MM-<experiment-slug>/` folder with `experiment-protocol.md` and other files.                             |
| Runbooks     | `docs/operations/`   | First time you need to record "how to deploy" or "how to rotate this secret."         | `<verb-noun>.md` (e.g. `rotate-<service>-keys.md`).                                                            |
| Archive      | `docs/archive/`      | Day one (policy README only); populated when the first scope or handoff finishes.     | One subfolder per archived category (`scopes/`, `handoffs/`, …), created on first use. Files keep their names. |
| Changelog    | `<package>/`         | First version you want to record (often v1.0.0).                                      | `CHANGELOG.md` (Keep a Changelog format).                                                                      |

**Terminology note:** A _scope_ is the pre-build contract (goal, surfaces, risks, tranches). A _punchlist_ is the end-of-build remediation list. Most governance docs are scopes; true punchlists are rare. See [`append-dont-overwrite`](contextqb://principles/append-dont-overwrite) for the full vocabulary.

A **workstream** is the continuing flow of work toward an objective. Its record coordinates the objective, deliverables, approved scopes, pass history, evidence, decisions, and next action. A scope is one bounded assignment inside that flow; a handoff is a continuity record for moving it between sessions. Use [`run-an-agent-workstream`](contextqb://playbooks/run-an-agent-workstream) when the work needs that continuity, and register the record in your boot map so the next session finds it. The workstream record points to architecture docs, ADRs, and specialized loops; it does not replace them.

You do not need to create any of these on day one except the archive policy. When the moment for one arrives, set it up before writing the first document inside it — never the other way around. `docs/archive/` is the exception: its `README.md` exists from day one so the policy is visible from the start; its subfolders appear with the first archived document. A `punchlists/` directory, like `workstreams/`, appears only if you ever need one.

## The discipline that makes this work

Four rules. All small, all cheap to enforce:

1. **Set up the directory before the first instance.** When you realise a new kind of document is about to be written for the first time, pause and create the directory with its `README.md` first. This takes two minutes and prevents the `PUNCHLIST.md` problem.
2. **Document the naming pattern in the directory's `README.md`.** Even one line is enough: "Files in this directory are named `<pattern>`. See [`documentation-file-naming`](contextqb://principles/documentation-file-naming)." The second contributor (human or agent) does not have to guess.
3. **Update docs in the same change that triggers the update.** Not a separate sprint, not a "TODO: update docs." If the structural decision changes, the ADR (or AGENTS.md, or context.qb.yaml) changes with it.
4. **Archive finished governance docs; never delete them.** When a scope has been reviewed and accepted, and its remaining obligations are resolved or transferred, or when a handoff is consumed, move it to `docs/archive/<category>/`. An executor's delivery claim (`SHIPPED`) alone is not enough. This preserves references and post-mortem trails. See [`append-dont-overwrite`](contextqb://principles/append-dont-overwrite).

## Copy-pasteable scaffold

This is what a freshly-scaffolded greenfield repo looks like on day one. Adjust for stack, but keep the shape.

```
your-project/
├── AGENTS.md                          ← Day 1
├── README.md                          ← Day 1
├── context.qb.yaml                    ← Day 1
└── docs/
    ├── product/
    │   └── overview.md                ← Day 1
    ├── architecture/
    │   ├── stack.md                   ← Day 1 (first architecture overview)
    │   └── decisions/
    │       ├── README.md              ← Day 1 (ADR index)
    │       └── 0001-<your-decision>.md ← Day 1 (first ADR)
    └── archive/
        └── README.md                  ← Day 1 (archive policy only)
```

Later, each process directory from the table above appears with its first document — `docs/scopes/`, `docs/handoffs/`, `docs/operations/`, `docs/post-mortems/`, `experiments/`, archive subfolders — each with a one-line `README.md` written just before that first document.

Each directory's `README.md` is one screen at most. Index, naming pattern, link to the relevant ContextQB principle. Nothing more.

## How to ask an agent to scaffold this

> Scaffold a ContextQB-style documentation system for this project per the `set-up-a-documentation-system` playbook. Create only the day-one footprint: drafts of AGENTS.md and context.qb.yaml if they do not exist, docs/product/overview.md (leave the content for me if it is missing), docs/architecture/stack.md if a stack decision exists, docs/architecture/decisions/ with its README index and ADR 0001, and docs/archive/README.md stating the archive policy from `append-dont-overwrite`. Do not create process directories (scopes, handoffs, operations, post-mortems, experiments) or archive subfolders; I will add each when its first document arrives. After scaffolding, list every file you created and the one-line purpose of each.

Then read the agent's output. Each generated file is a draft, not a finished document. The structure is what the playbook produces; the specifics — especially the overview and the first decision — are your call. To check that the drafts actually work, run the fresh-session test in [Documenting for Your Agent](contextqb://guides/documenting-for-your-agent).

## Anti-patterns

- **A single `docs/` folder with no internal structure.** Inevitable accretion produces a folder no one reads.
- **Deferring the first ADR until "we have something worth deciding."** The act of writing the first ADR — even for a small decision — is what teaches the team (including the agent) where ADRs live and what they look like.
- **Creating empty process directories with no `README.md`.** The directory's purpose has to be readable from inside it, or the next contributor will create a different directory for the same purpose.
- **A README at the repo root that tries to be both human introduction and agent boot manifest.** Those are two different jobs. See [`context-quarterback-the-onboarding-map`](contextqb://principles/context-quarterback-the-onboarding-map).
- **Generic process docs at the repo root (`PUNCHLIST.md`, `HANDOFF.md`, `NOTES.md`).** These violate [`documentation-file-naming`](contextqb://principles/documentation-file-naming) on day one and cost a rename the moment a second instance appears.
- **Deleting finished scopes or handoffs instead of archiving them.** The archive exists so references continue to resolve and post-mortems have a trail. See [`append-dont-overwrite`](contextqb://principles/append-dont-overwrite).

## Pairing this with ContextQB

If your project uses the ContextQB MCP, your scaffolded system can lean on the published methodology rather than restating it. Your project-specific documentation only needs to capture what is _specific_ to your project; the universal principles are available to the agent on demand. That keeps your own documentation lighter and forces it to focus on what only you can answer.
