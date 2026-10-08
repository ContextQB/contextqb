# @context-qb/spec — the `context.qb` file format

`context.qb` is a small, structured **boot manifest** that lives at the root of any repository and tells AI coding agents — in as few tokens as possible — what the repository is, what's in it, and where to look next.

The name is a deliberate play: **ContextQB = Context Quarterback**. The file is the agent's play-sheet. It reads the field and calls the play; it does not execute every route.

The canonical filename is **`context.qb.yaml`**. The format name is "context.qb" (the brand stays in the filename root); the `.yaml` extension is a concession to tooling so generic YAML editors, syntax highlighters, and linters work without configuration. This follows the same naming convention as `AGENTS.md` — brand-in-root, standard extension.

## Why

By 2026 every coding agent ships a context-loading step at the start of every session. Agents that scan whole READMEs, ADR folders, and source trees burn token budget before any real work begins. `context.qb.yaml` is a single small file the agent loads first, paying ~500–2,000 tokens to learn the map of a repo it would otherwise spend 10× more discovering.

Properties:

- **One file.** `context.qb.yaml` at the repo root. Nested files allowed in monorepo subtrees (same hierarchical-discovery pattern as `AGENTS.md`).
- **YAML 1.2.** Every coding agent in 2026 parses YAML fluently (GitHub Actions, Helm, Kubernetes, Docker Compose, npm/PyPI manifests are all YAML-shaped). Zero training-data tax.
- **Self-documenting.** A comment header in every file names the sections so the format is decodable by an agent that has never seen a `context.qb.yaml` before.
- **Mixed structure + prose.** Lookup-shaped data (`routes`, `decisions`, `tree`) is structured; meaning-shaped data (`summary`, `purpose`) is multiline prose.
- **Stable.** Required fields will not grow in v1.x. Optional sections in v1.0 will not be removed in v1.x. See [SPEC.md §13](./SPEC.md#13-stability-guarantee).
- **Public-equivalent.** Never put secrets, PII, or internal-only endpoints in the file. See [SPEC.md §14](./SPEC.md#14-privacy-and-security).
- **Validated.** A JSON Schema (`schema.json`) defines what's required and what's optional. A small validator (`pnpm validate:qb` in this repo) catches drift and emits soft warnings for things like deprecated extensions and stale paths.

## Read the spec

- **[SPEC.md](./SPEC.md)** — the format spec, v1.0.
- **[schema.json](./schema.json)** — JSON Schema for validation.
- **[ROADMAP.md](./ROADMAP.md)** — the tooling roadmap.
- **[`../../context.qb.yaml`](../../context.qb.yaml)** — the canonical exemplar (this repo's own `context.qb.yaml`).
- **[`../examples/`](../examples/)** — worked examples for different project shapes (CLI tool, Next.js web app, Python data pipeline, MCP server project, SaaS monorepo).

## License

The spec (this package's `SPEC.md` and `README.md`) is licensed [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). Use it, fork it, ship your own `context.qb.yaml` files — attribution to the ContextQB project is requested but no restrictions on derivative works.

The JSON Schema and any tooling code are MIT-licensed.

The intent is for the format to become a community-maintained standard. If it proves useful enough to spread, the spec will move to its own repo with public-stewardship governance similar to `AGENTS.md` (Linux Foundation Agentic AI Foundation).

## How to write one

See the [`write-a-context-qb`](../../methodology/playbooks/playbooks/write-a-context-qb.md) playbook in this repo.

## Versioning

The format uses a `qb: <major>.<minor>` field at the top of every file. v1.0 is the current spec. Backward-incompatible changes bump the major; backward-compatible additions bump the minor. Older files always remain valid against future minor versions.

A stability guarantee (SPEC.md §13) commits the required-fields set to not grow within v1.x, so files written today will validate against every future v1.x release.

## Status

v1.0 — initial publication, refined post external review (May 2026). In production use by this repository.
