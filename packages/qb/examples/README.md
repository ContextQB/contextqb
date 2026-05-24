# Sample `context.qb.yaml` files

Worked examples of the `context.qb` file format for different project shapes. Use these as starting points when writing your own.

## What is a `context.qb.yaml` file?

A `context.qb.yaml` file is the agent's **boot manifest** — a small, structured artifact at the root of a repository that tells an AI agent, in as few tokens as possible, what the project is, where things live, what decisions have been made, and what's in flight right now.

In narrative terms, it is the agent's **play-sheet** (the brand metaphor). Think of Aaron Rodgers reading the field before a snap: he doesn't run every route himself — he has a play-sheet, a mental map of where every receiver is, and a clear picture of what the defence is doing. He calls the play, then trusts the offence to execute. That is exactly the relationship between you and your AI coding agent. The agent is a fast, capable player. It is not the coach.

## Why the canonical filename is `context.qb.yaml`

The format name is `context.qb` (the brand, ContextQB = Context Quarterback). The canonical filename on disk is `context.qb.yaml` — same convention `AGENTS.md` uses, where the brand lives in the filename root and the extension is the standard one for the underlying format. The `.yaml` extension means generic YAML tooling (editors, syntax highlighters, linters, GitHub's web viewer) recognises the file automatically without configuration.

## Why the format mixes plain language with structured data

The format is YAML 1.2 with intentional prose mixed in (top-of-file comment header explaining sections, free-text `summary` fields, multi-line descriptions). This is deliberate. Empirical work on agent context shows that **agents perform best with a mix of plain language and structured data** — pure structure is hard to interpret without a schema in hand, and pure prose costs tokens to scan. The combination gives the agent both the shape and the meaning in one read.

The self-documenting comment header at the top of every `context.qb.yaml` means a model that has never seen the format before can still decode it from the first line.

## A standard for agentic coding

`context.qb` is being released as **an open standard for agentic coding** — a shared format that lets developers control their token efficiency the same way `AGENTS.md` lets them control agent behaviour. The two formats are complementary:

| File              | Job                                                     | Format   |
| ----------------- | ------------------------------------------------------- | -------- |
| `AGENTS.md`       | Rules / commands / boundaries — _how_ the agent behaves | Markdown |
| `context.qb.yaml` | Map / index / status — _what exists, where to look_     | YAML 1.2 |

Both should exist in a healthy agent-discipline repo. Neither replaces the other.

The full specification lives at [`packages/qb/spec/SPEC.md`](../spec/SPEC.md). Validate your file with `pnpm validate:qb`.

## Examples in this folder

| File                                                                           | Project shape                              | Highlights                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------ | -------------------------------------------------------------------- |
| [`nextjs-web-app.context.qb.yaml`](nextjs-web-app.context.qb.yaml)             | Single Next.js app deployed to a host      | Shortest practical shape. Demonstrates `routes` and a single `tree`. |
| [`cli-tool.context.qb.yaml`](cli-tool.context.qb.yaml)                         | Small CLI tool with one binary             | No `routes`. Demonstrates the minimal viable `context.qb.yaml`.      |
| [`python-data-pipeline.context.qb.yaml`](python-data-pipeline.context.qb.yaml) | Python ETL / data pipeline                 | Demonstrates non-TypeScript stacks and structured `status` for runs. |
| [`saas-monorepo.context.qb.yaml`](saas-monorepo.context.qb.yaml)               | Multi-app SaaS with shared packages        | Demonstrates `tree` with nested objects and per-package `purpose`.   |
| [`mcp-server-project.context.qb.yaml`](mcp-server-project.context.qb.yaml)     | Repository whose primary product is an MCP | Demonstrates `entry_points` aimed at agent installation, not humans. |

## Writing your own

Read the [`write-a-context-qb`](../../methodology/playbooks/playbooks/write-a-context-qb.md) playbook for the step-by-step. The short version:

1. Hand-author the first version. Do not generate it. Force yourself to think about each section.
2. Keep it under ~2,000 tokens for typical repos.
3. Reference deeper docs by URI; do not inline their content.
4. Update it whenever the shape of the repo changes — new package, new ADR, new in-flight feature, new hostname.
5. **Never write secrets, credentials, PII, or internal-only endpoints into the file.** It is a public-equivalent artifact even when the repo is private. See [SPEC.md §14](../spec/SPEC.md#14-privacy-and-security).

Validate with `pnpm validate:qb` (or any YAML 1.2 parser plus the JSON schema at `packages/qb/spec/schema.json`).
