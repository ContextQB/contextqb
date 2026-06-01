# Changelog

All notable changes to `@context-qb/cli` are documented in this file.

This format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

**Decision:** [ADR-0024](../../../docs/architecture/decisions/0024-context-qb-adapter-expansion.md)
**Scope:** [docs/scopes/0024-context-qb-adapter-expansion.md](../../../docs/scopes/0024-context-qb-adapter-expansion.md)

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

**Decision:** [ADR-0023](../../../docs/architecture/decisions/0023-publish-and-dogfood-context-qb-cli.md)

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

**Decision:** [ADR-0014](../../../docs/architecture/decisions/0014-drift-detector-v1.md)

---

## Development Trail

The v1 development history is preserved at:
[`docs/archive/scopes/qb-cli-v1-development-trail.md`](../../../docs/archive/scopes/qb-cli-v1-development-trail.md)

The v2 (adapter expansion) scope is at:
[`docs/scopes/0024-context-qb-adapter-expansion.md`](../../../docs/scopes/0024-context-qb-adapter-expansion.md)
