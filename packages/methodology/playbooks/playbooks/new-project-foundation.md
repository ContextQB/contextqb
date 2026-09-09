---
id: new-project-foundation
title: Prepare a New Repo for AI-Assisted Development
summary: A practical sequence for setting up a fresh repository so agents have the structure, naming, and boundaries they need to produce coherent code.
version: 0.2.0
problem: |
  Agents generate code based on the structure they observe. An empty or poorly-structured repo produces sprawling, inconsistent output that compounds quickly.
when_to_use: |
  At the very start of a new project, before letting an agent write any feature code.
expected_outputs:
  - A repo with explicit package boundaries.
  - A documented naming convention.
  - A single `AGENTS.md` at the repo root that future agents read first.
  - A `context.qb.yaml` boot manifest at the repo root.
  - The first ADR recorded under `docs/architecture/decisions/`.
  - A defined orchestration layer (where workflows live).
audience:
  - novice-builder
  - founder
  - agent
journey_stage: 1
journey_rank: 10
related:
  - choose-a-language-stack
  - repo-readiness
  - set-up-agents-md
  - write-a-context-qb
  - write-an-adr
related_principles:
  - separation-of-concerns
  - modularity
  - naming-conventions
  - machine-verifiable-substrate
  - programming-language-selection
tags:
  - foundation
  - setup
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent); R-01 remediation 2026-09-09"
  reviewer_notes: "F-13 resolved 2026-09-09: Step 5 now teaches AGENTS.md (canon), and new Step 6 adds context.qb.yaml + first ADR — the corpus's own day-one minimum. Sibling links declared. 0.2.0 for the added sections."
---

# Prepare a New Repo for AI-Assisted Development

The first hour of a new project sets the trajectory. If you let an agent generate a sprawling `src/` directory full of unrelated files, every future generation will mimic that pattern.

This playbook is the discipline version of "scaffold a starter repo."

## Step 1 — Decide the shape

Before any code, write a single page that answers:

- What is this product?
- Who uses it?
- What are the major surfaces? (UI, API, background jobs, etc.)
- What is each surface responsible for?

Save it as `docs/product/overview.md`. Every future prompt to an agent can reference it.

Once you have identified the surfaces, decide which language each will use. Run the [`choose-a-language-stack`](contextqb://playbooks/choose-a-language-stack) playbook to produce a stack decision document before writing any code — the language is the substrate on which the agent builds, and a substrate with strong verifiers produces better results.

## Step 2 — Choose your package boundaries

Even a small project benefits from explicit packages. Don't dump everything into `src/`.

A reasonable starting structure:

```txt
apps/
  web/                 # The user-facing app
packages/
  domain/              # Business types and pure functions
  data/                # Database access and queries
  api/                 # HTTP / API layer
docs/
```

The exact shape matters less than: _each module has a name that describes its responsibility, and no module is allowed to dump random logic into another._

## Step 3 — Document the naming convention

Write `docs/architecture/naming.md`. Cover:

- File names (kebab-case, domain-meaningful).
- Function names (verb + noun).
- Folder names (responsibility, not type).
- What you will _not_ allow (`utils.ts`, `manager.ts`, etc. — see [`naming-conventions`](contextqb://principles/naming-conventions)).

## Step 4 — Define the orchestration layer

Decide, before any feature, where workflows live. For a typical web app:

- UI components do not own data fetching or business logic.
- A coordinating layer (page, route handler, service) owns the workflow.
- State has a clear owner.

Write `docs/architecture/orchestration.md` answering: where does the control flow live for the most common user actions?

## Step 5 — Create the AGENTS.md

Create `AGENTS.md` at the repo root — the single most leverage-positive file in an agentic codebase. Agentic tools (Cursor, Claude Code, and others) pick it up automatically; it is also the stable thing every future prompt can point at ("read AGENTS.md first").

Include:

- The product overview.
- The naming rules.
- The package boundaries.
- The orchestration layer description.
- A short list of things the agent must not do (mix concerns, create dumping-ground files, duplicate state, etc.).

Follow the [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md) playbook — it carries the six-section template and the voice rules (specific, second person, under 500 lines).

## Step 6 — Write the boot manifest and the first ADR

Two small files make the structure you just created durable:

1. **`context.qb.yaml` at the repo root** — the agent's boot manifest: what this repo is, what's in it, how it deploys, what decisions exist. Follow [`write-a-context-qb`](contextqb://playbooks/write-a-context-qb); keep it under ~2,000 tokens. Once it exists, wire the drift detector so the map can't silently rot — [`set-up-drift-detection`](contextqb://playbooks/set-up-drift-detection).
2. **The first ADR** — `docs/architecture/decisions/0001-<your-first-decision>.md`. Even "use TypeScript + Next.js" counts: the point is teaching every future contributor (human or agent) where decisions live. Follow [`write-an-adr`](contextqb://playbooks/write-an-adr).

## Step 7 — Add a single first feature, end-to-end

Pick the smallest meaningful feature and implement it across every package boundary. This exercises your structure and produces the first example future generations will mimic.

## Step 8 — Lock in with a review

Run the [`repo-readiness`](contextqb://audits/repo-readiness) audit on the result. Fix anything it flags before adding feature #2.
