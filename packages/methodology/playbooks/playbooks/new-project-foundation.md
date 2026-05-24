---
id: new-project-foundation
title: Prepare a New Repo for AI-Assisted Development
summary: A practical sequence for setting up a fresh repository so agents have the structure, naming, and boundaries they need to produce coherent code.
version: 0.1.0
problem: |
  Agents generate code based on the structure they observe. An empty or poorly-structured repo produces sprawling, inconsistent output that compounds quickly.
when_to_use: |
  At the very start of a new project, before letting an agent write any feature code.
expected_outputs:
  - A repo with explicit package boundaries.
  - A documented naming convention.
  - A short "agent instructions" file that future prompts can reference.
  - A defined orchestration layer (where workflows live).
audience:
  - novice-builder
  - founder
  - agent
related_principles:
  - separation-of-concerns
  - modularity
  - naming-conventions
  - machine-verifiable-substrate
  - programming-language-selection
tags:
  - foundation
  - setup
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

## Step 5 — Create the agent instructions file

Create `AGENT_INSTRUCTIONS.md` at the repo root. Include:

- The product overview.
- The naming rules.
- The package boundaries.
- The orchestration layer description.
- A short list of things the agent must not do (mix concerns, create dumping-ground files, duplicate state, etc.).

Future prompts can begin with "Read AGENT_INSTRUCTIONS.md, then…" and the agent will start aligned.

## Step 6 — Add a single first feature, end-to-end

Pick the smallest meaningful feature and implement it across every package boundary. This exercises your structure and produces the first example future generations will mimic.

## Step 7 — Lock in with a review

Run the [`repo-readiness`](contextqb://audits/repo-readiness) audit on the result. Fix anything it flags before adding feature #2.
