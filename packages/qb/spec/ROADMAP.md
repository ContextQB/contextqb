# `context.qb` Tooling Roadmap

This document tracks the tooling we commit to building alongside the format spec. The spec alone is not enough — without tooling, the convention decays. This roadmap exists so commitments are visible and so we can resist tool sprawl when we're tempted to ship something that doesn't earn its place.

Status legend: ✅ shipped | 🟡 designed | ⏳ committed | 📋 considered | ❌ rejected

## Validation

| Tool                                       | Status | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Priority |
| ------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `pnpm validate:qb` (in this repo)          | ✅     | JSON Schema validation + soft-warning checks for missing paths and deprecated extension                                                                                                                                                                                                                                                                                                                                                                            | —        |
| Standalone CLI `contextqb validate`        | ⏳     | Same as above but as a published npm package any repo can install                                                                                                                                                                                                                                                                                                                                                                                                  | P1       |
| `contextqb check --stale` (drift detector) | ✅     | Compares `tree:`, `routes:`, `decisions:` against sources of truth (pnpm/npm/yarn workspaces; Cloudflare/Vercel/Netlify/Fly route configs; ADRs at `docs/architecture/decisions/` or the path declared via `paths.decisions:`). v1 shipped 2026-05-22; v1.0.1 published to npm 2026-05-29 (dogfood); **v2.0.0 published 2026-05-31 (multi-format adapter expansion).** Version history at [@context-qb/cli on npm](https://www.npmjs.com/package/@context-qb/cli). | P0       |
| Soft secret detector                       | 📋     | Pattern matches for common secret-key prefixes (`sk-`, `ghp_`, `eyJ…`, base64 blobs over a length threshold). Warn-not-fail. Implements SPEC.md §14 soft warnings.                                                                                                                                                                                                                                                                                                 | P1       |
| Token budget warning                       | ⏳     | Soft warn if file exceeds 5,000 tokens (per SPEC.md §3 budget guidance)                                                                                                                                                                                                                                                                                                                                                                                            | P2       |

## Authoring

| Tool                            | Status | What it does                                                                                                                                                                                                                                                                                            | Priority |
| ------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `contextqb init`                | ⏳     | Interactive walk-through to author the first `context.qb.yaml` for any repo. Reads `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` to suggest `stack:` entries; reads `pnpm-workspace.yaml` (or equivalent) to suggest `tree:` entries; opens the user's editor with a pre-filled template. | P1       |
| `contextqb gen` (auto-populate) | 📋     | Non-interactive version of `init` that regenerates the auto-generatable sections (`tree`, `routes`, `decisions`, `stack`) from sources of truth on every commit. Hand-authored sections preserved.                                                                                                      | P2       |
| Repo skeleton import            | 📋     | Pull a starter `context.qb.yaml` from a curated set based on detected stack (e.g. Next.js + Supabase → corresponding example as starting point).                                                                                                                                                        | P3       |

## Integration

| Tool                                | Status | What it does                                                                                                                                                                                                                                  | Priority |
| ----------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| GitHub Action template              | ⏳     | Runs validator + soft warnings on every PR; comments on the PR if validation fails or stale-drift is detected. Single YAML file to copy into `.github/workflows/`.                                                                            | P1       |
| Pre-commit hook                     | 📋     | Lightweight client-side validation (using the `pre-commit` framework) so failures surface before CI.                                                                                                                                          | P2       |
| MCP tool                            | 📋     | Serve `context.qb.yaml` slices via the MCP protocol (`<scheme>://repo/map`, `<scheme>://repo/decisions`, etc.) so any MCP-aware agent can query addressable sections instead of reading the whole file.                                       | P2       |
| Editor extension (VS Code / Cursor) | 📋     | Syntax highlighting + schema-aware autocomplete + inline soft warnings. May not be needed — `.yaml` extension already gets generic YAML support; the editor extension would only add schema-driven autocomplete and ContextQB-specific lints. | P3       |

## Distribution

| Tool                          | Status | What it does                                                                                                                                                                                                                            | Priority |
| ----------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Spec hosted publicly          | 📋     | Move spec to its own repo (e.g. `github.com/symbolscape/context-qb-spec`) once stable for 60 days of production use. Public stewardship governance modelled on the Linux Foundation Agentic AI Foundation's stewardship of `AGENTS.md`. | P2       |
| npm package `@context-qb/cli` | 📋     | Single-command install for the validator/CLI: `npx @context-qb/cli init`, `npx @context-qb/cli validate`, etc.                                                                                                                          | P1       |
| Curated examples site         | 📋     | A web-hosted collection of well-authored `context.qb.yaml` files for common stacks. Index lives at `contextqb.com/examples`.                                                                                                            | P3       |

## Telemetry

| Tool                         | Status | What it does                                                                                                                                                                                         | Priority |
| ---------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| MCP anonymous analytics      | 📋     | Cloudflare Analytics for aggregate MCP usage (request counts, tool popularity, geographic distribution). No code changes required.                                                                   | P1       |
| MCP user registration        | 📋     | Optional `?user=<id>` parameter for users who want attribution. Registration at `contextqb.com/telemetry/register`. Enables per-user dashboards.                                                     | P2       |
| CLI telemetry (`telemetry:`) | 📋     | Opt-in section in context.qb.yaml. Sends anonymized stats (section counts, stack categories, validation errors) on `contextqb check`. `--telemetry-preview` shows payload without sending. ADR-0015. | P2       |
| Public stats dashboard       | 📋     | `contextqb.com/stats` showing aggregate adoption metrics, popular stacks, common validation errors. Powered by telemetry data.                                                                       | P3       |
| Privacy documentation        | 📋     | `contextqb.com/privacy/telemetry` documenting exactly what's collected, retention policy, deletion requests. Required before any telemetry ships.                                                    | P1       |

## Security pillar integration

Planned additions that surface ContextQB's security pillar inside the format and tooling. Tracked here because the spine of the pillar is mechanical drift detection, which is qb tooling.

| Feature                                       | Status | What it does                                                                                                                                                                                                                                                                                                                                                                                    | Priority |
| --------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `security:` section in `context.qb.yaml`      | 📋     | Optional top-level section recording the project's security-relevant shape: `public:` routes, `authenticated:` routes, `privileged:` routes, `agents:` (what each agent in the system can do), `secrets:` provenance map, `third_party:` trust list, optional `threat_model:` pointer. Required-status remains optional in v1.x per the format's stability guarantee. Schema additions via ADR. | P1       |
| Drift detector — public route detection       | 📋     | Detect new public routes not listed in `security.public`. Pairs with the methodology playbook `detect-security-drift`.                                                                                                                                                                                                                                                                          | P1       |
| Drift detector — auth boundary detection      | 📋     | Detect routes that were `authenticated`/`privileged` and are now `public`, or vice versa. Weakening is a hard finding; strengthening is info.                                                                                                                                                                                                                                                   | P1       |
| Drift detector — third-party integration scan | 📋     | Detect new env-var patterns matching known providers (Clerk, Supabase, LemonSqueezy, Stripe, OpenAI, etc.) that aren't recorded under `security.third_party`. Warn-not-fail.                                                                                                                                                                                                                    | P1       |
| Drift detector — agent capability scan        | 📋     | Detect new tool-execution surfaces in `apps/mcp` or `packages/**/mcp-server` that aren't recorded under `security.agents`.                                                                                                                                                                                                                                                                      | P2       |

## Discipline (the most important section)

These are constraints, not features. They resist tool sprawl.

| Constraint                                             | Status  | Rationale                                                                                                                                                  |
| ------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Required-fields set will not grow in v1.x              | ✅      | Stability guarantee per SPEC.md §13. Locked.                                                                                                               |
| Optional sections in v1.0 will not be removed in v1.x  | ✅      | Same. Locked.                                                                                                                                              |
| Each new tool needs an explicit user pain point        | Ongoing | Resist building tools for theoretical demand. A pain point looks like "a user/repo could not be served without this."                                      |
| Spec changes require an ADR                            | Ongoing | Per SPEC.md §13. Changes go through the same discipline as architectural decisions in any ContextQB-discipline project.                                    |
| Auto-generation must respect hand-authored content     | ⏳      | When `contextqb gen` ships, it must never overwrite `project.summary`, per-entry `purpose:` fields, `status:`, or `entry_points:`. These belong to humans. |
| No tool should require network access at validate time | Ongoing | Validation is local-only; soft warnings are local-only. Secrets must not be sent anywhere by tooling.                                                      |

## Priority decoder

- **P0** — must ship before the format graduates from "this repo uses it" to "we recommend others adopt it"
- **P1** — first round of public-facing tooling; comes with the format's first published release
- **P2** — second round; ships when adoption demand exists
- **P3** — optional polish; only build if a user asks

## Status as of 2026-05-31

- Spec v1.0 published in this repo
- `pnpm validate:qb` shipped
- Five example files authored
- Refinement pass after external steelman review (May 20, 2026)
- Empirical experiment protocol authored (not yet run): `experiments/2026-05-context-qb-efficiency/`
- **Drift detector v1 shipped** (May 22): `@context-qb/cli` package; runnable via `pnpm check:qb`; ADR-0014
- **Remote MCP server shipped** (May 23): `mcp.contextqb.com` serves methodology content; zero-install access
- **Telemetry spec drafted** (May 23): ADR-0015 covers opt-in tracking for both MCP and CLI
- **Drift detector v2.0.0 shipped** (May 31): npm/yarn workspaces + Vercel/Netlify/Fly route adapters + configurable ADR path; ADR-0024
- **`@context-qb/cli@2.0.0` published to npm** (May 31): this repo dogfoods the published artifact via root devDependency
- All other P1 items are deliberately not built yet — we want to use the format ourselves for some weeks before committing to a public tooling release.
