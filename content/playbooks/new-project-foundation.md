---
id: new-project-foundation
title: Prepare a New Repo for AI-Assisted Development
summary: A practical sequence for setting up a fresh repository so agents have the structure, naming, and boundaries they need to produce coherent code.
version: 0.3.2
problem: |
  Agents generate code based on the structure they observe. An empty or poorly-structured repo produces sprawling, inconsistent output that compounds quickly.
when_to_use: |
  At the very start of a new project, before letting an agent write any feature code.
expected_outputs:
  - A repo with explicit package boundaries.
  - A documented naming convention.
  - A single `AGENTS.md` at the repo root that future agents read first, with security boundaries and a pointer to `context.qb.yaml`.
  - Agent tool permission settings that block or ask before destructive, deploy and secret-reading actions.
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
  - building-for-yourself-vs-others
  - choose-a-language-stack
  - choosing-your-application-channel
  - repo-readiness
  - set-security-guardrails-for-your-agent
  - set-up-a-documentation-system
  - set-up-agents-md
  - set-up-drift-detection
  - setting-up-git-and-github
  - the-mental-model-of-your-app
  - write-a-context-qb
  - write-an-adr
  - architectural-hardening-loop
  - repo-cleanup
related_principles:
  - machine-verifiable-substrate
  - modularity
  - naming-conventions
  - programming-language-selection
  - separation-of-concerns
tags:
  - foundation
  - setup
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent); R-01 remediation 2026-09-09"
  reviewer_notes: "2026-10-07 renewal B6 Tier-2 routing (0.3.2; author self-checked; independent review pending; not operator-accepted): related adds architectural-hardening-loop and repo-cleanup, whose Tier-2 labels now send young repositories here; body unchanged. 2026-10-07 renewal B3 reciprocal links (0.3.1; author self-checked; independent review pending; not operator-accepted): the tier and channel guides named in Step 1 are now links, closing the B2 deferral; related adds both. 2026-10-07 renewal B2 (0.3.0; author self-checked; independent review pending; not operator-accepted): roles made explicit — you write the overview and approve; the agent drafts naming, orchestration, AGENTS.md, context.qb.yaml and the first ADR in one reviewable change; single apps use folders and may keep naming/orchestration as AGENTS.md sections; new guardrails step (two layers) before broad permissions; the first feature ends with verifiers and the drift check; agent-tool list replaced by the instruction-files reference. Earlier notes: F-13 resolved 2026-09-09: Step 5 now teaches AGENTS.md (canon), and new Step 6 adds context.qb.yaml + first ADR — the corpus's own day-one minimum. Sibling links declared. 0.2.0 for the added sections."
---

# Prepare a New Repo for AI-Assisted Development

The first hour of a new project sets the trajectory. If you let an agent generate a sprawling `src/` directory full of unrelated files, every future generation will mimic that pattern.

This playbook is the discipline version of "scaffold a starter repo."

## Who does what

You decide what the product is and approve every structural choice. Your agent does most of the drafting. In practice:

- **You write** the one-page overview (Step 1) — or talk it through with your agent and edit its draft until it says what you mean.
- **The agent drafts** the structure, naming rules, orchestration notes, `AGENTS.md`, `context.qb.yaml` and the first decision record (Steps 2–7), ideally as one change you can review in one sitting.
- **You review and approve** the boundaries, the "must not" and security lists in `AGENTS.md`, and the first decision. Those are the parts an agent must never settle for you.
- **You check behaviour** at the end: the first feature works, the checks pass, and the readiness audit has no blocking findings.

Once the overview exists, a prompt like this gets the drafting done:

> Read `docs/product/overview.md`. Propose a folder structure, naming rules, an orchestration note, an `AGENTS.md` (following the set-up-agents-md template, including security boundaries and a first line pointing at `context.qb.yaml`), a `context.qb.yaml`, and ADR-0001 recording the structure decision. Put everything in one change, list your assumptions, and do not write feature code.

## Step 1 — Decide the shape

Before any code, write a single page that answers:

- What is this product?
- Who uses it — just you, or other people too? (The guide [Building for Yourself vs. Building for Others](contextqb://guides/building-for-yourself-vs-others) helps you decide.)
- Where do people use it — a website, a mobile app, a command-line tool, something else? (See the guide [Choosing Your Application Channel](contextqb://guides/choosing-your-application-channel).)
- What are the major surfaces? (UI, API, background jobs, etc.)
- What is each surface responsible for?

Save it as `docs/product/overview.md`. Every future prompt to an agent can reference it.

Once you have identified the surfaces, decide which language each will use. Run the [`choose-a-language-stack`](contextqb://playbooks/choose-a-language-stack) playbook to produce a stack decision document before writing any code — the language is the substrate on which the agent builds, and a substrate with strong verifiers produces better results.

## Step 2 — Choose your package boundaries

Even a small project benefits from explicit boundaries. Don't dump everything into `src/`. For a single app, these boundaries are folders, not separate packages; a multi-part project (a website plus a background service, say) may use packages.

Ask the agent to propose the structure from your overview; you approve it. A reasonable starting structure for a multi-part project:

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

Have the agent draft `docs/architecture/naming.md` — or, for a single app, a "Naming" section in `AGENTS.md`. You review it. Cover:

- File names (kebab-case, domain-meaningful).
- Function names (verb + noun).
- Folder names (responsibility, not type).
- What you will _not_ allow (`utils.ts`, `manager.ts`, etc. — see [`naming-conventions`](contextqb://principles/naming-conventions)).

## Step 4 — Define the orchestration layer

Decide, before any feature, where workflows live. For a typical web app:

- UI components do not own data fetching or business logic.
- A coordinating layer (page, route handler, service) owns the workflow.
- State has a clear owner.

Have the agent draft `docs/architecture/orchestration.md` (or an `AGENTS.md` section, for a single app) answering: where does the control flow live for the most common user actions? Check that the answer matches how you picture the app working.

## Step 5 — Create the AGENTS.md

Have the agent draft `AGENTS.md` at the repo root — the single most leverage-positive file in an agentic codebase. Many agent tools load it automatically, and the rest read it when asked; which tools do which is in the [instruction-files reference](contextqb://references/setup#agents-md-support). It is also the stable thing every future prompt can point at ("read AGENTS.md first").

Include:

- A first line telling the agent to read `context.qb.yaml`.
- The product overview.
- The naming rules.
- The package or folder boundaries.
- The orchestration layer description.
- Security boundaries (Step 6 fills these in).
- A short list of things the agent must not do (mix concerns, create dumping-ground files, duplicate state, etc.).

Follow the [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md) playbook — it carries the template and the voice rules (specific, second person, under 500 lines). Read the "must not" list yourself before you accept the file: it is your rule book, not the agent's.

## Step 6 — Set guardrails before the agent gets broad permissions

Before the agent runs commands freely in this repo, set the two layers from [`set-security-guardrails-for-your-agent`](contextqb://playbooks/set-security-guardrails-for-your-agent): configure your agent tool's own permission and approval settings so delete, deploy and secret-reading actions are blocked or need your approval, and add the matching "Security boundaries for this agent" section to `AGENTS.md`. On a brand-new project its list of public surfaces and outside services simply starts empty.

## Step 7 — Write the boot manifest and the first ADR

Two small files make the structure you just created durable. The agent drafts both; you check the manifest's summary and status for truth and approve the decision.

1. **`context.qb.yaml` at the repo root** — the agent's boot manifest: what this repo is, what's in it, how it deploys, what decisions exist. Follow [`write-a-context-qb`](contextqb://playbooks/write-a-context-qb); keep it under ~2,000 tokens. Once it exists, wire the drift detector so the map can't silently rot — [`set-up-drift-detection`](contextqb://playbooks/set-up-drift-detection).
2. **The first ADR** — `docs/architecture/decisions/0001-<your-first-decision>.md`. Even "use TypeScript + Next.js" counts: the point is teaching every future contributor (human or agent) where decisions live. Follow [`write-an-adr`](contextqb://playbooks/write-an-adr).

## Step 8 — Add a single first feature, end-to-end

Pick the smallest meaningful feature and have the agent implement it across every boundary. This exercises your structure and produces the first example future generations will mimic. When it is done, have the agent run the project's verifiers (typecheck, lint, format check, tests — whichever exist) and the drift check, and use the feature yourself.

## Step 9 — Lock in with a review

Have the agent run the [`repo-readiness`](contextqb://audits/repo-readiness) audit on the result. It checks the files from Steps 1–7 and the results from Step 8. You decide which blocking findings to fix before adding feature #2.
