---
id: write-a-context-qb
title: Write a context.qb for Your Repository
summary: Step-by-step for authoring a context.qb.yaml — the agent's boot manifest — that gets a coding agent up to speed in under 2,000 tokens.
version: 0.1.0
problem: |
  AI coding agents waste tokens (and time) at the start of every session re-scanning your repo to figure out what it is and where everything lives. Without a single small, structured map, you pay that scan-cost on every prompt.
when_to_use: |
  Once per repository, at any stage. If the repo already exists and you have not shipped a `context.qb.yaml`, write one now. Update it whenever the shape of the repo changes.
expected_outputs:
  - A `context.qb.yaml` file at the repo root that passes the schema in `packages/qb/spec/schema.json`.
  - The file is under ~2,000 tokens for a typical repo, ~5,000 for a large monorepo.
  - All referenced paths exist on disk.
  - Hand-authored sections (project summary, purposes, status) read naturally to a human.
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
related_principles:
  - context-quarterback-the-onboarding-map
  - documentation-as-architecture
  - separation-of-concerns
tags:
  - context
  - context-qb
  - onboarding
  - tokens
---

# Write a context.qb for Your Repository

A `context.qb.yaml` file is the agent's **boot manifest** — a small, structured artifact at the root of your repo that gets a coding agent oriented in as few tokens as possible. (The play-sheet metaphor is the brand; "boot manifest" is the engineering description.)

This playbook walks you through writing one for the first time. Full format spec at [`packages/qb/spec/SPEC.md`](../../../qb/spec/SPEC.md); the principle behind it is [`context-quarterback-the-onboarding-map`](../../standards/principles/context-quarterback-the-onboarding-map.md).

## Before you start

You need:

- A repository (any language, any size).
- Familiarity with YAML (the file is YAML 1.2).
- ~30 minutes for the first one.

The file does not replace `AGENTS.md`. They have different jobs (`AGENTS.md` is rules; `context.qb.yaml` is map). You should have both.

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

Resist verbose technology names. The agent already knows what Next.js is.

## Step 3 — Enumerate the tree

List every workspace package or top-level directory worth knowing about. The simple form is a one-liner:

```yaml
tree:
  apps/web: marketing site (Next.js static export)
  apps/api: REST API (Hono on Workers)
  packages/sdk: client SDK consumed by web + external integrators
```

For directories with meaningful dependencies, use the object form:

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
  docs.example.com: external (Notion)
```

This is the section that answers "where does this code actually run, and at what address?"

## Step 5 — Index the decisions

If you have an ADR system (you should — see the [`write-an-adr`](./write-an-adr.md) playbook), list each ADR with its ID and one-line summary:

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

If your repo uses the ContextQB tooling:

```bash
pnpm validate:qb
```

Otherwise, run any YAML validator against `packages/qb/spec/schema.json`. The validator catches:

- Missing required fields (`qb`, `project.name`, `project.summary`, `tree`)
- Wrong types
- (Soft) paths referenced in `tree` or `entry_points` that don't exist on disk

Fix any errors before committing.

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

## How to ask an agent to write the first one

If you're starting from scratch, this prompt works well:

> Read the spec at `packages/qb/spec/SPEC.md`. Walk the repository's directory tree, `package.json`, ADR folder, and deploy configs. Produce a `context.qb.yaml` file at the repo root that:
>
> 1. Captures the actual shape of the repo as it exists today.
> 2. Stays under 2,000 tokens.
> 3. Passes `pnpm validate:qb`.
> 4. Has hand-authored, plain-language `project.summary` and `tree[].purpose` fields — not lifted verbatim from READMEs.
>
> When you finish, run the validator and report any soft warnings.

## Anti-patterns

- **Inlining content the map should reference.** `decisions` is a list of IDs and one-liners with a `→ index` link, not the full ADR text.
- **Auto-generating without curation.** Auto-gen the `tree` and `decisions` skeletons if you want, but hand-write `project.summary` and per-entry `purpose` fields. The model reads those for meaning, not just lookup.
- **Letting status rot.** Stale `status:` is worse than empty `status:`. If a status hasn't moved in 30 days, either resolve it or rewrite it.
- **Two `context.qb.yaml` files saying different things.** Pick one canonical file at the repo root. Use nested files only if a subtree truly has its own scope and the root is already too dense to grow.
- **Treating `context.qb.yaml` as the only doc.** It's the index. Real documentation still belongs in `docs/`, READMEs, and ADRs. `context.qb.yaml` points at them.
- **Putting secrets, credentials, or internal-only endpoints in the file.** Treat `context.qb.yaml` as a public artifact even when the repo is private. Anything you write ends up in every agent's context window every session, and on most provider terms of service can be used for training. Secrets belong in `.env.local`, secret managers, or environment variables — never here. See [SPEC.md §14](../../../qb/spec/SPEC.md#14-privacy-and-security).

## Technical reference

For a compressed technical checklist (less methodology context, more step-by-step), see the [Authoring Guide](../../../qb/docs/authoring-guide.md).

For format implementors and tool authors, see the [Format Explainer](../../../qb/docs/format-explainer.md).
