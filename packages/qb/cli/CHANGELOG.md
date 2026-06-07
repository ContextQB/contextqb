# Changelog

All notable changes to `@context-qb/cli` are documented in this file.

This format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_No unreleased changes._

## [2.5.0] — 2026-06-07

### Added

- **`contextqb membership project-id --accept`** — Writes the most-recently-suggested UUID (from a first-run `contextqb check` nudge) to `context.qb.yaml`. The suggestion is cached locally; `--accept` retrieves and writes it automatically, avoiding the copy-paste step. Suggestions expire after 30 days.
- **`--force-fresh` flag on `--regenerate`** — When a first-run suggestion is pending, `--regenerate` now warns and requires `--force-fresh` to proceed. This prevents accidental UUID replacement when the operator intended to accept the suggested one.
- **`--force` flag on `--accept`** — Overwrites an existing `project_id` when used with `--accept`. Without this flag, `--accept` refuses to overwrite to prevent accidental changes.
- **First-run nudge now mentions `--accept`** — The stderr message now includes `Or run \`contextqb membership project-id --accept\` to write it automatically.`

### Changed

- The first-run suggested UUID is now cached in `<credentials-dir>/last-suggested-project-id.json`. Previously it was ephemeral (printed once, never persisted).

### Documentation

- README: Membership section expanded with `project-id` flags (`--accept`, `--regenerate`, `--force-fresh`, `--force`).
- README: Comment-preservation note added — both `--accept` and `--regenerate` use `yaml.Document.set`, which preserves all comments and key ordering.
- README: Status table updated to include 2.5.0.

### Tests

- New regression test `project-id-comments.test.ts` verifying that YAML comments survive `doc.set()` calls. (qb-roundtrip-comments fixture from FB.2.)

**Scope:** `docs/scopes/cli-upgrade-feedback-followup.md` (Tranche FB.2).

## [2.4.1] — 2026-06-05

### Documentation

- **README updates** — Status table now lists every published 2.x release (2.0.x, 2.1.0, 2.2.0, 2.3.0, 2.4.x); the All Subcommands section documents `contextqb upgrade`; the Environment Variables table documents `CONTEXTQB_UPDATE_CHECK=npm`.
- **CHANGELOG link fixed** — README now points at an absolute public URL (`https://github.com/ContextQB/contextqb/blob/main/cli/CHANGELOG.md`) instead of a relative path that 404'd on the public mirror. The publish-to-public script keeps a copy of `CHANGELOG.md` at that stable path. (External adopter feedback, 2026-06-05.)
- **2.2.0 entry backfilled** — The 2026-06-02 integrity-model release was previously omitted from this changelog. (External adopter feedback, 2026-06-05.)

### Changed (CLI behavior)

- **First-run `project_id` prompt is more specific.** The stderr nudge now says "Add `project_id: \"<uuid>\"` **as a top-level key** to context.qb.yaml…" instead of leaving placement ambiguous. Previously some adopters nested it under a `project:` key, which doesn't match the loader contract. (External adopter feedback, 2026-06-05.)

No functional changes from 2.4.0 beyond the prompt-string clarification. The 2.4.0 upgrade-notice loop will not nag 2.4.0 users about 2.4.1; `CLI_VERSION_LATEST` on the worker stays at 2.4.0 by design.

## [2.4.0] — 2026-06-04

### Added

- **Always-on upgrade notice** — When the installed CLI version is older than the most recent `cli_version_latest` returned by the server (or the locally cached value), the CLI prints a one-line stderr notice on every invocation. The notice fires from `check`, `membership`, `mcp`, and `insights` subcommands. Establishes invariant INV-CLI-UPD-1.
- **`contextqb upgrade` subcommand (instructional only)** — Detects how the CLI was installed (npx, pnpm dlx, npm-global, pnpm-global, homebrew, local dev dependency) and prints the corresponding upgrade command. Does not run any installer itself. `--json` flag for machine-readable output. Establishes invariant INV-CLI-CONT-1.
- **`CONTEXTQB_UPDATE_CHECK=npm` opt-in fallback** — Telemetry-opt-out users can re-enable upgrade notices via this env var. Polls `https://registry.npmjs.org/@context-qb/cli/latest` at most once every 24 hours; cache stored locally and never transmitted.
- **Server-returned `cli_version_latest` field** — All `/membership/{register,status,revoke}` and `/telemetry/cli` responses now include the latest published CLI version. The CLI caches this at `<credentials-dir>/upgrade-check.json`.

### Migration note

- If you previously set `CONTEXTQB_NO_PROVISION=true` only on CI runners, you can remove it. CI environments are now auto-detected (`GITHUB_ACTIONS`, `GITLAB_CI`, `CIRCLECI`, `BUILDKITE`, `JENKINS_URL`, `TF_BUILD`, `BITBUCKET_BUILD_NUMBER`, `CODEBUILD_BUILD_ID`, `VERCEL`, `NETLIFY`, `CF_PAGES`, `CI`) and skip auto-provisioning by default. Override with `CONTEXTQB_FORCE_PROVISION=true` for long-lived self-hosted runners you want counted as cooperative members.

### Privacy

- CI environments are auto-detected and skip telemetry auto-provisioning by default. Probed env vars: `GITHUB_ACTIONS`, `GITLAB_CI`, `CIRCLECI`, `BUILDKITE`, `JENKINS_URL`, `TF_BUILD`, `BITBUCKET_BUILD_NUMBER`, `CODEBUILD_BUILD_ID`, `VERCEL`, `NETLIFY`, `CF_PAGES`, `CI`. Override with `CONTEXTQB_FORCE_PROVISION=true` for long-lived self-hosted runners.
- Both silent-skip paths now print a one-line stderr disclosure naming the trigger (`CONTEXTQB_NO_PROVISION`, sticky opt-out, or the matched CI env var).
- Privacy page updated to disclose the upgrade-notice signal, the always-on notice, and the npm-poll opt-in (with explicit network-call disclosure for `registry.npmjs.org`).

### Changed

- `ensureMembership()` precedence ladder reordered so sticky opt-out (INV-6) wins over `CONTEXTQB_NO_PROVISION` and over the new CI auto-detect. Behavior change is observable only via the stderr line that gets printed; null-return cases unchanged.
- INV-TEL-1 rewritten — the "90-day deprecation window" wording is removed. The server now accepts every payload version ever shipped indefinitely. The upgrade-notice loop replaces the deprecation window as the forcing function.

**Decision:** ADR-0034
**Scope:** Internal punchlist `docs/punchlists/cli-upgrade-path.md` (Tranches U.0–U.7); CI auto-detect content carried forward from `docs/punchlists/telemetry-identity-hardening.md` Tranche C (INV-MEM-1).

## [2.3.0] — 2026-06-03

### Added

- **project_id support (ADR-0032):** CLI now reads `project_id` from `context.qb.yaml` and includes it in v3 telemetry payloads.
- New subcommand `contextqb membership project-id` to show or regenerate project identity.
- First-run UX: when `project_id` is absent, prints a one-time message with a generated UUID and instructions to commit it.
- `--telemetry-preview` now shows `project_id` field.

### Changed

- Telemetry payload schema bumped from v2 to v3.

**Scope:** Internal punchlist `docs/punchlists/telemetry-identity-hardening.md` Tranche E.2.

## [2.2.0] — 2026-06-02

### Added

- **Telemetry integrity model (ADR-0028, INV-INT-1).** All `/membership/register` and `/telemetry/cli` requests are now signed with HMAC-SHA256 in a Stripe-style `X-ContextQB-Signature: t=<unix>,v1=<hex>` header. The shared secret is injected into the published CLI at build time via `scripts/inject-integrity-secret.mjs` from the `CONTEXTQB_INTEGRITY_SECRET` env var; the git-tracked `src/integrity-secret.ts` only contains the placeholder. The server validates signature, timestamp window, User-Agent, and Origin before accepting the request body.
- New helper `signedFetch` in `packages/qb/cli/src/membership.ts` wraps `fetch` with the signature header. Every signed request also carries `User-Agent: contextqb-cli/<version>` for server-side audit.

### Changed

- `tsconfig.build.json` includes `scripts/integrity-secret.ts` so the build can write the runtime constant.
- CI `qb.yml` workflow now declares a `workflow_dispatch` publish job that injects `CONTEXTQB_INTEGRITY_SECRET` from GitHub Secrets.

### Notes

- Backfilled 2026-06-05 — the 2026-06-02 release shipped without a CHANGELOG entry. Original commit: `9fdaa6c feat(telemetry): implement integrity model per ADR-0028 + INV-INT-1`.

**Scope:** Internal punchlist `docs/punchlists/telemetry-soundness-hardening.md` Tranches A–D.

## [2.1.0] - 2026-05-31

### Added

- New telemetry fields: `event_kind`, `subcommand`, `is_first_run_locally`, `exit_code`, `findings_total`, `info_count`, `adapter_coverage`
- Server accepts both `payload_schema_version: 1` and `payload_schema_version: 2` during a 90-day deprecation window (INV-TEL-1)
- Aggregation queries for adapter coverage and usage patterns (v2 events only)

### Fixed

- `cli_version` field now reports the actual package version (was hardcoded to `0.1.0` for every event since first publish)

### Privacy

- Privacy page updated to disclose all new fields. No new sensitive data category. No file contents, paths, or PII added.

**Scope:** Internal scope document 0027-telemetry-completeness

## [2.0.3] - 2026-05-31

### Security

- Removed private documentation path references from JSDoc comments in 13 source files
- Compiled `dist/` files no longer contain paths to internal documentation
- Invariant references (INV-2, INV-6) retained as plain text without file paths

No functional changes from 2.0.2.

## [2.0.2] - 2026-05-31

### Security

- Audited and fixed 7 broken/private-path links in README.md — replaced monorepo-relative paths with absolute URLs to public destinations (`github.com/ContextQB/contextqb`, `contextqb.com`, `npmjs.com`)
- Tightened `files` array to explicitly exclude `tsconfig.tsbuildinfo` from the npm tarball
- Added `CHANGELOG.md` to the `files` array so the README's `./CHANGELOG.md` link resolves on npm

### Changed

- README cross-references now use absolute URLs instead of monorepo-relative paths
- Removed private ADR links (ADR-0024, ADR-0018) from public-facing documentation

No code changes from 2.0.1.

## [2.0.1] - 2026-05-31

### Changed

- Filled in npm package metadata: `author` (Industrial Semiotics), `license` (MIT), `homepage` (https://contextqb.com/check), `repository` (public mirror), `bugs`, and `keywords` for npm search
- Added "About" section to the README pointing at contextqb.com and Industrial Semiotics
- Description now includes "An Industrial Semiotics project" attribution

No code changes from 2.0.0.

## [2.0.0] - 2026-05-31

### Added

- Vercel adapter: reads `redirects[].destination` and `rewrites[].destination` host bindings
- Netlify adapter: reads `[[redirects]].to` host bindings via `smol-toml`
- Fly adapter: reads top-level `app` field → `<app>.fly.dev`
- npm/yarn workspaces adapter: reads `package.json#workspaces` with exotic-glob detection
- Configurable ADR path via `paths.decisions:` field in `context.qb.yaml`
- `routesHaveSource` signal to handle dashboard-only deploy configurations

### Changed

- Adapter layer restructured into `adapters/{workspaces,routes,decisions}/` with dispatchers
- Routes dispatcher aggregates all four adapters with first-host-wins dedup

### Fixed

- Edge case #2: repos with no config file (dashboard-only routes) no longer emit false `routes-stale-entry`

**Decision:** ADR-0024
**Scope:** Internal scope document 0024-context-qb-adapter-expansion

## [1.0.1] - 2026-05-29

### Added

- Published to npm as `@context-qb/cli@1.0.1`
- Build step via `tsconfig.build.json` → `dist/`
- Proper `main`/`types`/`exports`/`bin` fields for npm consumers
- Entry-point detection using `fs.realpathSync` for pnpm symlink compatibility

### Changed

- Repo now dogfoods the published artifact: root `devDependencies` lists `@context-qb/cli`, `pnpm check:qb` invokes the npm-installed binary

### Fixed

- Gap VII: package-by-name resolution now works via symlinked binary

**Decision:** ADR-0023

## [1.0.0] - 2026-05-22

### Added

- Initial release of the drift detector for `context.qb.yaml` files
- Three section validators: `tree:`, `routes:`, `decisions:`
- pnpm workspaces adapter: reads `pnpm-workspace.yaml`
- Cloudflare Workers adapter: reads `wrangler.jsonc`
- ADR adapter: reads `docs/architecture/decisions/` directory
- Human-readable output with line numbers in lint-style format
- `--json` flag for machine-readable output (CI consumption)
- Exit codes: `0` clean, `1` drift detected, `2` malformed input
- Regression test harness with `qb-drift/` fixture
- Hooked into `pnpm validate` as part of repo-discipline gates

### Security

- Local-only operation; no network access

**Decision:** ADR-0014

---

## Development Trail

Development history is preserved in internal scope documents.
