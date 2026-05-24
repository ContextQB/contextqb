---
id: context-quarterback-the-onboarding-map
title: The Context Quarterback — Every Repo Has a Boot Manifest
summary: Every repository should ship a small, structured boot manifest that maps it for AI agents in as few tokens as possible. The file is the play-sheet; the agent is the player.
version: 0.1.0
category: documentation
audience:
  - novice-builder
  - founder
  - developer
  - agent
tags:
  - context
  - onboarding
  - tokens
  - context-qb
anti_patterns:
  - Letting the agent rediscover the repo's shape on every session — paying token cost to scan READMEs, ADR folders, and source trees before any real work begins.
  - A README.md that tries to be both the human introduction and the agent's boot manifest. They have different jobs.
  - Putting the map inside AGENTS.md. AGENTS.md is for rules; mixing rules with map makes both worse.
  - A map document that lives in many places (some in README, some in CONTRIBUTING, some in /docs) with no single entry point.
  - An auto-generated map that drifts silently from the source of truth. Stale maps are worse than no map — the agent's mental model is actively wrong.
  - Inlining content the map should reference. The map is an index, not an encyclopedia.
  - Putting secrets, PII, or internal-only endpoints in the file. Treat it as a public artifact even when the repo is private.
agent_instructions:
  - At the start of any session, look for `context.qb.yaml` at the workspace root and load it before anything else.
  - Treat `context.qb.yaml` as the canonical answer to "what is this repo, what's in it, and where should I start?" — do not re-derive that from source code.
  - When you change the shape of the repo (add a workspace package, attach a new hostname, record a new ADR, mark a feature in flight), update `context.qb.yaml` in the same change.
  - Reference deeper docs by their URI when the agent needs them; do not inline their content into `context.qb.yaml`.
  - Never write secrets or credentials into `context.qb.yaml`. The file is public-equivalent.
related:
  - documentation-as-architecture
  - separation-of-concerns
  - naming-conventions
---

# The Context Quarterback — Every Repo Has a Boot Manifest

A football quarterback reads the field, calls the play, and directs the offense. They do not run every route themselves; they have a play-sheet and a mental map of where every receiver is.

That is exactly the relationship between an AI agent and the repository it works in. The agent is a fast, capable player. It is not the coach. It needs a play-sheet.

## The principle

**Every repository should ship a `context.qb.yaml` file at the root** — a small, structured, hand-curated **boot manifest for the agent** that tells it, in as few tokens as possible:

- What this repo is (one paragraph)
- What's in it (the workspace tree with 1-line purposes)
- How it deploys (hostname → backend mapping)
- What decisions have been made (ADR index)
- What's happening right now (in-flight work)
- Where to go for more (entry-point links)

The file is the agent's play-sheet — brand metaphor — and the agent's boot manifest — technical role. The agent reads it first, every session, then drills into the deeper docs only when the play calls for it.

## Why this matters

Token economics are real. A coding agent that scans READMEs, ADR folders, and source trees before any work begins burns thousands of tokens before producing anything useful. `context.qb.yaml` is a one-time, small investment that pays for itself on the first turn.

Controlled evaluations of the equivalent `AGENTS.md` standard (124-PR benchmark) found approximately:

- **16.6% lower median output-token generation**
- **28.6% lower median wall-clock execution time**
- **~10% lower mean total token usage**

…and `AGENTS.md` only covers rules and commands. `context.qb` extends the same insight to navigation. The direction-of-effect is well-supported; the exact magnitude for `context.qb` specifically is an open empirical question (see `experiments/2026-05-context-qb-efficiency/`).

## The three artifacts that should exist together

| File               | Job                                                                 | Format   |
| ------------------ | ------------------------------------------------------------------- | -------- |
| `AGENTS.md`        | Rules, commands, boundaries — _how the agent should behave_         | Markdown |
| `context.qb.yaml`  | Map, index, status — _what exists, where to look, what's in flight_ | YAML 1.2 |
| `docs/status/*.md` | Per-feature work-in-progress state                                  | Markdown |

`context.qb.yaml` does not replace `AGENTS.md`. They answer different questions. Both should exist in any agent-discipline repo.

## What the file is not

- **Not the documentation itself.** It is the index. Real prose lives in `docs/`, ADRs, READMEs.
- **Not a code map.** Code-relationship questions ("what calls this function?") belong to AST-based tools like Aider's repo-map. `context.qb.yaml` works at the workspace-and-decisions level.
- **Not for humans first.** It is for agents. Humans will read it too — that's fine — but the optimisation is for token-efficient agent consumption, not pretty prose.
- **Not a place for secrets.** Treat the file as a public artifact even when the repo is private. Anything in `context.qb.yaml` ends up in every agent's context window every session, and on most provider terms of service can be used for training.

## How to write one

See the [`write-a-context-qb`](../../playbooks/playbooks/write-a-context-qb.md) playbook for the step-by-step. The short version: hand-author the first version against the spec at [`@context-qb/spec`](../../../qb/spec/SPEC.md), keep it under ~2,000 tokens, and update it whenever the shape of the repo changes.

## How to instruct an agent to enforce this

> Before doing non-trivial work on this repo, load `context.qb.yaml` at the workspace root. Treat it as the canonical answer to "what's in this repo and where do I start?" When you make a change that shifts the repo's shape — new workspace package, new ADR, new in-flight feature, new hostname — update `context.qb.yaml` in the same commit. Never write secrets, credentials, or internal-only endpoints into it; it is a public-equivalent file.

## Technical reference

For format implementors, tool authors, and developers who need the technical details:

- **[Format Explainer](../../../qb/docs/format-explainer.md)** — technical overview of the wire format, sections, versioning, and validation.
- **[Authoring Guide](../../../qb/docs/authoring-guide.md)** — step-by-step checklist for writing a `context.qb.yaml`.
- **[SPEC.md](../../../qb/spec/SPEC.md)** — the authoritative format specification.
