---
eyebrow: Privacy
headline: Telemetry & Privacy
subhead: ""
meta_title: Telemetry & Privacy
meta_description: What data ContextQB collects and how we use it.
review:
  status: draft
  last_reviewed: "2026-05-27"
  reviewer: "agent:pre-audit"
  reviewer_notes: |-
    This is the longest prose page on the site and it reads as a hybrid of legal disclosure and developer documentation. Specific notes for the copywriter:

    (1) The three-phase structure (Phase 1 / Phase 2 / Phase 3) is internal jargon. A reader doesn't know what makes a "phase" or which one they're in. Consider replacing with what-actually-happens framing: "Visiting this site", "Using the CLI", "Using the MCP with a token".

    (2) "Data NOT collected" lists are valuable but the repeated "What X NOT collects" headings get visually noisy. Consider consolidating into one "What we never collect, period" section.

    (3) The "Three ways to opt out" enumeration is good — keep that structure.

    (4) k-anonymity section may be over-explanation for a privacy page. Could move to a sub-page or footnote-link to ADR-0018 (which is already linked).

    (5) Tone is currently technical-reassuring. Worth considering whether the audience here is "concerned user" (wants short, friendly assurances) or "compliance/security buyer" (wants exhaustive detail). The current page tries to serve both.
---

ContextQB collects anonymous telemetry to understand how developers use the methodology and to provide community insights. This page explains exactly what we collect, how we protect your privacy, and how you can opt out.

## Phase 1 — Edge analytics (always-on)

Our MCP server (`mcp.contextqb.com`) and website use [Cloudflare Workers Analytics](https://developers.cloudflare.com/workers/observability/analytics-engine/). This is Cloudflare's built-in analytics — we do not run any custom telemetry code for this phase.

### Data collected automatically by Cloudflare:

- **Request count** — how many requests hit the server
- **Response time** — how long each request took to process
- **Country code** — derived from Cloudflare's edge location, not your IP
- **Status codes** — whether requests succeeded or failed

### Data NOT collected:

- **Your IP address** — Cloudflare processes it at the edge but does not store or expose it to us
- **Request body contents** — we don't see what you asked for
- **Cookies or tracking identifiers** — we don't use any

This phase is aggregate and anonymous at the point of collection. There is no opt-out because there is nothing to opt out of — no individual is tracked.

## Phase 2 — CLI auto-provisioning (opt-out)

When you first run the `contextqb` CLI, a membership token is silently provisioned and stored locally. This enables community insights and helps us understand how developers structure their projects. Telemetry is on by default.

### What the CLI collects:

- **Anonymous ID** — a SHA-256 hash of your machine ID, not reversible to your identity
- **Stack categories** — programming language, whether it's a monorepo, deployment target
- **Structure counts** — number of tree entries, routes, ADRs (counts only, not names)
- **Validation findings** — types of drift detected (e.g., "missing workspace"), not file paths or content

### What the CLI does NOT collect:

- **File paths** — we don't see your project structure
- **File contents** — we don't read your code
- **Environment variables or secrets** — never accessed
- **Git history or commit messages** — never accessed

### Three ways to opt out:

1. **Per-run:** `contextqb check --no-telemetry` — skips telemetry for this run only
2. **Sticky:** `contextqb membership revoke` — permanently opts you out and deletes all your data from our servers
3. **CI escape hatch:** Set `CONTEXTQB_NO_PROVISION=true` in your environment to skip auto-provisioning entirely

After a sticky revocation, subsequent CLI runs will not re-provision a token. To re-provision with a fresh identity (if you change your mind), delete the credentials file:

- **macOS:** `~/Library/Preferences/contextqb-nodejs/credentials.json`
- **Linux:** `~/.config/contextqb-nodejs/credentials.json`
- **Windows:** `%APPDATA%\contextqb-nodejs\Config\credentials.json`

## Phase 3 — MCP token-gated telemetry

When you use the MCP server with a membership token (configured via `contextqb mcp setup`), we record which tools are called and how long they take. This helps us prioritize methodology improvements.

### What MCP telemetry collects:

- **Tool name** — e.g., `get_principle`, `list_playbooks`
- **Response time** — how long the call took
- **Country code** — from Cloudflare's edge
- **Client hint** — which MCP client you're using (Cursor, Claude, etc.)

### What MCP telemetry does NOT collect:

- **Tool arguments** — we don't see which principle or playbook you requested
- **Response content** — we don't log what we returned to you
- **Your project context** — the MCP server has no access to your filesystem

MCP telemetry requires a token. If you don't configure one, or if you revoke your membership, no MCP telemetry is collected. Methodology tools remain free and accessible without a token.

## k-anonymity guards

Even with anonymous IDs, aggregate data can sometimes reveal information about small groups. We apply k-anonymity guards to prevent this:

- **Minimum threshold (k=30):** We never report statistics for groups with fewer than 30 distinct members
- **Maximum 2 dimensions:** Queries can filter by at most 2 attributes simultaneously
- **Bucketed counts:** Instead of exact numbers, we report "30+", "100+", or "1000+"

These guards ensure that even if you're in a unique combination (e.g., "Rust developers deploying to Railway"), your data cannot be singled out.

## Data retention

- **Cloudflare Analytics (Phase 1):** 90 days, then deleted
- **CLI and MCP events (Phase 2/3):** Retained until you revoke, then immediately deleted
- **Aggregated insights:** Retained indefinitely, but they contain no individual-level data

## Why we collect it

Aggregate usage data helps us:

- Understand which resources are most valuable
- Identify common project structures and pain points
- Prioritize methodology improvements
- Provide community insights (e.g., "70% of TypeScript projects use this pattern")

We do not use this data to identify individuals, build profiles, or sell to third parties.

## Technical details

For the full technical specification, see [ADR-0018: Data Cooperative Telemetry](https://github.com/Industrial-Semiotics/contextqb/blob/main/docs/architecture/decisions/0018-data-cooperative-telemetry.md).

## Questions?

If you have questions about our privacy practices, open an issue on [GitHub](https://github.com/Industrial-Semiotics/contextqb/issues) or reach out through the channels listed on the [About](/about) page.
