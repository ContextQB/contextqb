---
id: write-a-context-qb
title: Write a context.qb for Your Repository
summary: Step-by-step for authoring a context.qb.yaml — the agent's boot manifest — that gets a coding agent up to speed in under 2,000 tokens.
version: 0.3.0
problem: |
  AI coding agents waste tokens (and time) at the start of every session re-scanning your repo to figure out what it is and where everything lives. Without a single small, structured map, you pay that scan-cost on every prompt.
when_to_use: |
  Once per repository, at any stage. If the repo already exists and you have not shipped a `context.qb.yaml`, write one now. Update it whenever the shape of the repo changes.
expected_outputs:
  - A `context.qb.yaml` file at the repo root that validates against the published context.qb JSON Schema.
  - The file is under ~2,000 tokens for a typical repo, ~5,000 for a large monorepo.
  - All referenced paths exist on disk.
  - The meaning-carrying sections (project summary, purposes, status) have been checked by you for truth and read naturally to a human.
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
journey_rank: 30
related:
  - context-qb-yaml-vs-rag
  - documenting-for-your-agent
  - new-project-foundation
  - retrofit-drift-detection
  - set-up-a-documentation-system
  - set-up-agents-md
  - set-up-drift-detection
  - setting-up-git-and-github
  - the-mental-model-of-your-app
  - understanding-the-context-window
  - run-a-multi-agent-workflow
  - run-an-agent-workstream
related_principles:
  - context-quarterback-the-onboarding-map
  - documentation-as-architecture
  - separation-of-concerns
tags:
  - context
  - context-qb
  - onboarding
  - tokens
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-07 renewal B2 (0.3.0; author self-checked; independent review pending; not operator-accepted): the agent-drafted path now comes first, with Steps 1–7 as a review checklist; example values labelled as ContextQB's own; a single-app tree example added; the validation reference linked; the provider-terms sentence points to the data-use reference; links resolve publicly or are plain text. 2026-10-06 renewal fast-track repair (0.2.0; author self-checked; independent review pending; not operator-accepted): agent-drafted path made explicit (agent drafts, operator checks summary/purposes/status); YAML-writing prerequisite removed; validation now uses the published JSON Schema plus the drift detector, without a repository-internal command as a learner prerequisite, and states that the CLI does not run the schema check. Review provenance neutralised. Earlier notes describe the previous version: R3–R7 pass. Current with SPEC + feedback tail-block (ADR-0029). R8 pending P4. 2026-10-02: body cross-references to the agent workstream method were added (those diffs were inspected in an independent final QA of the workstream vertical) and then finalized for publication (a wording edit that postdates that QA). The whole atom was not re-reviewed; last_reviewed reflects the earlier review."
---

# Write a context.qb for Your Repository

A `context.qb.yaml` file is the agent's **boot manifest** — a small, structured artifact at the root of your repo that gets a coding agent oriented in as few tokens as possible. (The play-sheet metaphor is the brand; "boot manifest" is the engineering description.)

This playbook walks you through your first one. The quickest path is to ask your agent to draft the file with the prompt just below, use Steps 1–7 to check what it produced, and validate it in Step 8. You can also write it yourself step by step. Either way, the parts that carry meaning — the project summary, each `purpose` and the `status` entries — are yours to write or check, because only you know whether they are true. The full format specification is [SPEC.md in the public ContextQB repository](https://github.com/ContextQB/contextqb/blob/main/format/SPEC.md); the principle behind it is [`context-quarterback-the-onboarding-map`](contextqb://principles/context-quarterback-the-onboarding-map).

## Before you start

You need:

- A repository (any language, any size).
- No YAML-writing skill. Your agent can draft the file. You need to read the summary, purposes and status and judge whether they are true.
- ~30 minutes for the first one.

The file does not replace `AGENTS.md`. They have different jobs (`AGENTS.md` is rules; `context.qb.yaml` is map). You should have both.

## The quickest path: ask your agent to draft it

For a first file, this is the path this playbook recommends. Give your agent this prompt:

> Read the context.qb specification (`format/SPEC.md` in the public ContextQB repository on GitHub, `ContextQB/contextqb`). Walk the repository's directory tree, `package.json`, ADR folder, and deploy configs. Produce a `context.qb.yaml` file at the repo root that:
>
> 1. Captures the actual shape of the repo as it exists today.
> 2. Stays under 2,000 tokens.
> 3. Validates against the published JSON Schema (`format/schema.json` in the same repository).
> 4. Has plain-language `project.summary` and `purpose` fields written for this project — not lifted verbatim from READMEs. Mark anything you are unsure of so I can check it.
>
> When you finish, validate the file against the schema, check that every path in `tree` and `entry_points` exists, and report what you found. I will then read the summary, purposes and status for truth.

After it returns, read `project.summary`, every `purpose` and every `status` entry yourself. The agent can map folders and ADRs reliably; whether the summary says what the project is _for_, and whether a status is still true, is your call.

Steps 1–7 below describe each section. If your agent drafted the file, use them as a checklist: for each section, compare the draft with the step and fix what is wrong. If you prefer to write the file yourself, follow them in order.

## Step 1 — Decide what's at the top

Open a new file at the repo root called `context.qb.yaml`. Start with the header comment and the required fields:

```yaml
# context.qb 1.0 — <your project name>
#
# The agent's play-sheet. Read this first; drill into the referenced
# URIs only when the play calls for it.
#
# Sections: project, stack, tree, routes, decisions, status, entry_points

qb: "1.0"

project:
  name: <one-word identifier>
  v: <version, e.g. 0.1.0>
  summary: |
    <One or two paragraphs in plain English. What is this project?
    Who is it for? What surfaces does it expose?>
```

The `summary` is the most important thing in the file. It's prose, not bullets — agents read prose well and the nuance matters here. Keep it under 4–5 sentences.

## Step 2 — Sketch the stack

A plain-language stack section. Keys are conventional; use whatever names are natural:

```yaml
stack:
  lang: TypeScript
  mono: pnpm 10
  web: Next.js 15 + React 19 + Tailwind v4
  deploy: Cloudflare Workers
  data: Supabase
  pay: Stripe Checkout
```

These values are ContextQB's own stack, shown as an illustration; write yours. Resist verbose technology names — the agent already knows what a common framework is.

## Step 3 — Enumerate the tree

List every workspace package or top-level directory worth knowing about. The simple form is a one-liner (the entries below describe an illustrative project):

```yaml
tree:
  apps/web: marketing site (Next.js static export)
  apps/api: REST API (Hono on Workers)
  packages/sdk: client SDK consumed by web + external integrators
```

A single app with one source folder still needs a `tree` — the section is required — with one entry:

```yaml
tree:
  src: the whole app — pages, API handlers and data access
```

For directories with meaningful dependencies, use the object form (this example is from ContextQB's own repository):

```yaml
tree:
  apps/courses:
    kind: next-ssr
    deploy: courses.contextqb.com
    deps: [supabase, lemonsqueezy, heroui-pro]
    purpose: paid course platform
```

Do **not** enumerate every source file. The unit of `tree` is the package or top-level directory, not the file. If your repo has 200 directories at the top, group them into logical buckets.

## Step 4 — Map the surfaces

If your project has any externally-reachable surfaces (web hostnames, MCP servers, CLI commands), list them:

```yaml
routes:
  example.com: apps/web
  api.example.com: apps/api
  docs.example.com: external (a hosted documentation tool)
```

This is the section that answers "where does this code actually run, and at what address?"

## Step 5 — Index the decisions

If you have an ADR system (you should — see the write-an-adr playbook), list each ADR with its ID and one-line summary. These entries are ContextQB's own; yours will be different:

```yaml
decisions:
  "0001": pnpm-monorepo (accepted)
  "0008": cloudflare-workers-static-assets (accepted)
  "0010": course-platform-supabase (superseded-by 0011)
  "0011": lemonsqueezy-free-core-pricing (accepted)
  index: docs/architecture/decisions/README.md
```

If you don't have ADRs yet, skip this section for now. (And consider adopting them.)

## Step 6 — Write the status block

The status block is updated frequently — it captures what's _in flight_. One-line entries:

```yaml
status:
  api-v2: in design (see docs/status/api-v2.md)
  payments: blocked-on legal review of EU VAT registration
  search-rebuild: pending; targeting next sprint
```

This is the section that an agent needs most when joining a session mid-project. Keep it current; stale status is misleading.

Point each entry at whatever record holds that work's current state: a status document, an owning scope, or, if you use the [agent workstream](contextqb://playbooks/run-an-agent-workstream) method, a workstream record such as `docs/workstreams/api-v2.md`. The path matters less than the pointer: a fresh session should reach the active record from here without being told its filename.

## Step 7 — Hand out entry points

Tell the agent where to start for specific concerns:

```yaml
entry_points:
  rules: AGENTS.md
  map: context.qb.yaml (this file)
  decisions: docs/architecture/decisions/README.md
  api: apps/api/src/index.ts
  ui: apps/web/src/app
  ops: docs/operations/runbook.md
```

The agent will use this when given a vague task: "help me with the API" → load `apps/api/src/index.ts`. Without it, the agent guesses.

## Step 8 — Validate

Two checks answer two different questions.

**Is the file well-formed?** Validate it against the [published JSON Schema](https://github.com/ContextQB/contextqb/blob/main/format/schema.json) with any JSON Schema validator, after parsing the YAML. The easiest route is to ask your agent:

> Parse `context.qb.yaml` and validate it against the published context.qb JSON Schema at https://github.com/ContextQB/contextqb/blob/main/format/schema.json. Report every error. Then check that every path named in `tree` and `entry_points` exists in this repository.

The schema check catches:

- Missing required fields (`qb`, `project.name`, `project.summary`, and a `tree` with at least one entry)
- Wrong types, such as an unquoted `qb: 1.0` (the version must be a string, `"1.0"`)
- Top-level keys the format does not define — for example a `security:` section, which is planned but not yet part of the format

**Does the file match the repository?** That is the drift detector's job (`contextqb`, from the `@context-qb/cli` package), set up in the next playbook. It compares `tree`, `routes` and `decisions` with your workspaces, deploy configuration and ADR files, and it reports a missing file or invalid YAML. It does **not** run the JSON Schema check, so do both.

Fix any errors before committing. Where the CLI, the specification and the schema are published, and which deployment configuration files the drift check reads, are recorded in the [context.qb validation reference](contextqb://references/setup#context-qb-validation).

## Step 9 — Wire it into your AGENTS.md

Tell agents the file exists, so they actually load it. Add a one-liner to `AGENTS.md`:

```markdown
## Where to start

Read `context.qb.yaml` at the repo root before doing any non-trivial work. It is the map of this repository.
```

## Step 10 — Maintain it

The single most important habit: **update `context.qb.yaml` in the same commit as any change that shifts the repo's shape.**

Shape changes include:

- A new workspace package
- A new ADR
- A new hostname or deploy target
- A feature that starts (add to `status`) or finishes (remove from `status`)
- A change in stack (e.g. swapping the database)

Treat `context.qb.yaml` like a load-bearing wall. If you change it, the agent's mental model changes. If you don't, the agent has the wrong map.

## Anti-patterns

- **Inlining content the map should reference.** `decisions` is a list of IDs and one-liners with a `→ index` link, not the full ADR text.
- **Auto-generating without curation.** Auto-gen the `tree` and `decisions` skeletons if you want, but hand-write `project.summary` and per-entry `purpose` fields. The model reads those for meaning, not just lookup.
- **Letting status rot.** Stale `status:` is worse than empty `status:`. If a status hasn't moved in 30 days, either resolve it or rewrite it.
- **Two `context.qb.yaml` files saying different things.** Pick one canonical file at the repo root. Use nested files only if a subtree truly has its own scope and the root is already too dense to grow.
- **Treating `context.qb.yaml` as the only doc.** It's the index. Real documentation still belongs in `docs/`, READMEs, and ADRs. `context.qb.yaml` points at them.
- **Putting secrets, credentials, or internal-only endpoints in the file.** Treat `context.qb.yaml` as a public artifact even when the repo is private. Anything you write ends up in every agent's context window every session, and may be retained or used to improve models under your provider's terms, which differ by provider and plan (see [whether providers train on what you send](contextqb://references/setup#provider-data-use)). Secrets belong in `.env.local`, secret managers, or environment variables — never here. See [SPEC.md §14](https://github.com/ContextQB/contextqb/blob/main/format/SPEC.md#14-privacy-and-security).

## What's next

Once your file passes validation, set up the detector that keeps it honest. Use [`set-up-drift-detection`](contextqb://playbooks/set-up-drift-detection) to install `@context-qb/cli`, add `check:qb`, and wire the check into your commit and CI loop.

## Technical reference

For a compressed technical checklist (less methodology context, more step-by-step), and for format implementors and tool authors, the ContextQB repository keeps two technical companions in `packages/qb/docs/`: the Authoring Guide and the Format Explainer. They are not yet published on this site.

## How did this go? Share your experience

ContextQB improves on the back of adopter feedback. If anything about this playbook — or the `context.qb` format itself — surprised you, frustrated you, worked unusually well, or could have been clearer, **tell us**. We treat field reports as first-class evidence (see ADR-0029 in the public repository).

Three ways to submit, in order of friction:

1. **Call the MCP tool.** If you have `mcp.contextqb.com` loaded in your AI client, the agent can call `submit_feedback` directly without leaving the conversation. The tool prepares a submission and the agent surfaces it to you to confirm.
2. **Open the GitHub issue template.** Visit [github.com/ContextQB/contextqb/issues/new/choose](https://github.com/ContextQB/contextqb/issues/new/choose) and pick **"External adopter feedback."** The structured form takes 3–5 minutes.
3. **File via `gh`.** If you've already drafted a markdown report, `gh issue create --repo ContextQB/contextqb --title "[feedback] <summary>" --body-file ./report.md --label feedback,triage`.

What we want most: the verbatim friction. If a step took longer than expected, say so. If an error message misled you, paste it. If your agent ran into something a human wouldn't have, that's especially useful — we treat agent-authored reports as first-class data, not noise.

What we'll do with it: a maintainer files your submission verbatim into the project's `feedback/captures/` directory and triages it into structured reports over the following days. Synthesised insights drive ADRs and content changes; your words are republished only with your explicit consent (`consent: public` in the form).
