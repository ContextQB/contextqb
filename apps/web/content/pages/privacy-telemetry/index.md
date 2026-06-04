---
eyebrow: Privacy
headline: Telemetry & Privacy
subhead: >-
  We collect limited aggregate data to improve the methodology. We do not read
  your code, store your project files, or sell personal data.
meta_title: Telemetry & Privacy
meta_description: What data ContextQB collects and how we use it.
review:
  status: final
  last_reviewed: "2026-06-03"
  reviewer: "agent:tranche-e4-docs-governance"
  reviewer_notes: |-
    Tranche E.4: Added project_id disclosure bullet to "What the CLI records".
    Rewrote "Community insights stay aggregate" for project-only k-anonymity (ADR-0033).
    Updated "70% of TypeScript projects" framing. Preserved Automatic CI detection subsection.
    Previous: Added Automatic CI detection subsection (Tranche C, INV-MEM-1). CI environments
    are now auto-skipped by default. Reworded bullet 3 of opt-out list.
---

ContextQB collects limited, privacy-preserving telemetry so we can understand which parts of the methodology are useful and where builders get stuck. This page explains what we collect, what we never collect, and how you can opt out.

## Visiting the site or MCP server

Our MCP server (`mcp.contextqb.com`) and website use [Cloudflare Workers Analytics](https://developers.cloudflare.com/workers/observability/analytics-engine/). This is Cloudflare's built-in analytics — we do not run any custom telemetry code for this phase.

### What Cloudflare analytics records

- **Request count** — how many requests hit the server
- **Response time** — how long each request took to process
- **Country code** — derived from Cloudflare's edge location, not your IP
- **Status codes** — whether requests succeeded or failed

### What it does not record

- **Your IP address** — Cloudflare processes it at the edge but does not store or expose it to us
- **Request body contents** — we don't see what you asked for
- **Cookies or tracking identifiers** — we don't use any

This phase is aggregate and anonymous at the point of collection. There is no opt-out because there is nothing to opt out of — no individual is tracked.

## Using the CLI

When you first run the `contextqb` CLI, a membership token is silently provisioned and stored locally. This enables community insights and helps us understand how developers structure their projects. Telemetry is on by default.

### What the CLI records

- **Anonymous ID** — a SHA-256 hash of your machine ID, not reversible to your identity
- **CLI version** — which version of the CLI you're running, so we can correlate behavior with releases
- **Stack categories** — programming language, whether it's a monorepo, deployment target
- **Structure counts** — number of tree entries, routes, ADRs (counts only, not names)
- **Validation findings** — types of drift detected (e.g., "missing workspace"), not file paths or content
- **Subcommand and event kind** — which top-level command you invoked (`check`, `membership`, `mcp`, `insights`) and whether it was a first-time run on this machine
- **Adapter coverage** — boolean flags indicating which source-of-truth files were present (e.g., `wrangler.jsonc`, `pnpm-workspace.yaml`); never the file contents
- **Exit code** — whether the CLI run succeeded, reported drift, or crashed
- **Project ID** (`project_id` in your `context.qb.yaml`, if set) — an opaque v4 UUID you commit to identify your project for cooperative counting. Opt in by adding the field; opt out by deleting it. See `contextqb membership project-id` for inspection.

### What the CLI never records

- **File paths** — we don't see your project structure
- **File contents** — we don't read your code
- **Environment variables or secrets** — never accessed
- **Git history or commit messages** — never accessed

### Integrity headers

The CLI sends two headers with each telemetry submission:

- **User-Agent:** `contextqb-cli/<version>` — identifies the CLI version making the request
- **X-ContextQB-Signature:** A cryptographic signature (HMAC-SHA256) that proves the payload came from a published CLI build

These headers allow the server to reject forged requests that could pollute community data. No new user data is collected — the signature is computed from the request body using a key baked into the CLI at publish time. The key is not personally identifiable; it is the same for all CLI installations of a given version.

### Automatic CI detection

The CLI automatically detects CI environments and skips telemetry auto-provisioning when any of the following environment variables is set to a non-empty, non-`"false"` value: `GITHUB_ACTIONS`, `GITLAB_CI`, `CIRCLECI`, `BUILDKITE`, `JENKINS_URL`, `TF_BUILD`, `BITBUCKET_BUILD_NUMBER`, `CODEBUILD_BUILD_ID`, `VERCEL`, `NETLIFY`, `CF_PAGES`, `CI`. When this skip is triggered, the CLI prints a single stderr line naming the matched variable.

**Why this exists:** Each pristine CI runner has a fresh machine identity, so without this skip every CI run would register as a new "member" and inflate the counts that community insights rely on. CI runs do not represent humans.

**How to override:** Set `CONTEXTQB_FORCE_PROVISION=true` to bypass auto-detection — for example, if you have a long-lived self-hosted CI runner that you want to count as a cooperative member. Sticky opt-out (`contextqb membership revoke`) still wins over this override. Devcontainer and Codespaces environments are intentionally treated as human work; set `CONTEXTQB_NO_PROVISION=true` manually if you disagree.

When `--telemetry-preview` is used in a CI environment, only the auto-detect stderr line prints; no payload preview is shown. Set `CONTEXTQB_FORCE_PROVISION=true` to see the preview.

### Four ways to opt out:

1. **Per-run:** `contextqb check --no-telemetry` — skips telemetry for this run only
2. **Sticky:** `contextqb membership revoke` — permanently opts you out and deletes all your data from our servers
3. **Manual env-var opt-out:** Set `CONTEXTQB_NO_PROVISION=true` to skip auto-provisioning entirely. (CI environments are auto-skipped without this flag — see Automatic CI detection above.)
4. **Trust-but-verify:** `contextqb check --telemetry-preview` — prints the JSON payload that would be sent and exits without sending, so you can inspect it before opting in

After a sticky revocation, subsequent CLI runs will not re-provision a token. To re-provision with a fresh identity (if you change your mind), delete the credentials file:

- **macOS:** `~/Library/Preferences/contextqb-nodejs/credentials.json`
- **Linux:** `~/.config/contextqb-nodejs/credentials.json`
- **Windows:** `%APPDATA%\contextqb-nodejs\Config\credentials.json`

## Using the MCP with a token

When you use the MCP server with a membership token (configured via `contextqb mcp setup`), we record which tools are called and how long they take. This helps us prioritize methodology improvements.

### What MCP telemetry records

- **Tool name** — e.g., `get_principle`, `list_playbooks`
- **Response time** — how long the call took
- **Country code** — from Cloudflare's edge
- **Client hint** — which MCP client you're using (Cursor, Claude, etc.)

### What MCP telemetry never records

- **Tool arguments** — we don't see which principle or playbook you requested
- **Response content** — we don't log what we returned to you
- **Your project context** — the MCP server has no access to your filesystem

MCP telemetry requires a token. If you don't configure one, or if you revoke your membership, no MCP telemetry is collected. Methodology tools remain free and accessible without a token.

## Community insights stay aggregate

Even anonymous data can reveal too much when a group is small. We use k-anonymity guards before reporting community insights:

- **Minimum threshold (k=30):** We never report statistics for groups with fewer than 30 distinct projects (each project identified by `project_id` in its `context.qb.yaml`)
- **Maximum 2 dimensions:** Queries can filter by at most 2 attributes simultaneously
- **Bucketed counts:** Instead of exact numbers, we report "30+", "100+", or "1000+"

These guards mean that even if your project is in an unusual combination (for example, "Rust projects deploying to Railway"), your project's data cannot be singled out.

**For early adopters:** until the cooperative reaches 30 distinct projects for a given topic, queries on `/insights` and through the `community_*` MCP tools will return "Insufficient data". This is the privacy guard working — not a bug. CLI events without a `project_id` are still accepted and stored, but they do not contribute to cooperative aggregates.

## Data retention

- **Cloudflare Analytics (Phase 1):** 90 days, then deleted
- **CLI and MCP events (Phase 2/3):** Retained until you revoke, then immediately deleted
- **Aggregated insights:** Retained indefinitely, but they contain no individual-level data

## Why we collect it

Aggregate usage data helps us:

- Understand which resources are most valuable
- Identify common project structures and pain points
- Prioritize methodology improvements
- Provide community insights based on project-level data (e.g., "70% of TypeScript projects use this pattern")

We do not use this data to identify individuals, build profiles, or sell to third parties.

## Technical details

For the technical specification, see the privacy section of our public methodology and tooling at [contextqb.com](https://contextqb.com).

## Questions?

If you have questions about our privacy practices, open an issue on [GitHub](https://github.com/ContextQB/contextqb/issues) or reach out through the channels listed on the [About](/about) page.
