---
eyebrow: Privacy
headline: Privacy, Tracking & Telemetry
subhead: >-
  Learn how website tracking, email signups and aggregate project telemetry work.
  We do not read your code, store your project files, or sell personal data.
meta_title: "ContextQB Privacy, Website Tracking and Telemetry"
meta_description: "Choose website tracking preferences and learn how ContextQB handles email signups, Mautic page tracking and aggregate CLI and MCP telemetry."

---

ContextQB uses optional website tracking to understand your interests, email signup records to manage the messages you request, and separate aggregate telemetry to improve the methodology. This page explains those different uses and your choices.

## Website tracking and your choice

We use our own Mautic installation at `map.contextqb.com` to remember which ContextQB pages you visit **after you choose “Allow website tracking.”** Until you allow it, we do not load the website tracker. Declining does not prevent reading the site or signing up.

Tracking uses cookies and browser storage to recognize the same browser across visits. It records page paths and titles, visit times, referrer origin, browser/device information and the connection IP seen by Mautic. We do not send page query strings, URL fragments, signup form contents or full referrer URLs in website pageviews. We do not identify different people by a shared IP address.

Mautic can also estimate an approximate country, region or city from the connection IP using a local MaxMind GeoLite2 database. This is an estimate, not your precise location. We download the database from MaxMind; individual visitor IPs are not sent to MaxMind for these lookups.

If Mautic can associate your browser with an existing contact, for example after you follow a tracked email link, page visits can help us tailor future messages to your interests. Website tracking permission does not subscribe you to email. Email targeting must also respect your confirmed signup permission and unsubscribe, bounce and complaint status. We do not sell this information.

Use **Tracking preferences** at the bottom of any page to allow or turn off tracking. Turning it off clears the website's Mautic browser identifiers and reloads the page without the tracker. It stops new website tracking; it does not erase previously stored records or cookies on the separate Mautic hostname. Do Not Track and Global Privacy Control signals prevent the website tracker from loading. Your preference is saved on the current website hostname; another browser or the `www` hostname can have a separate choice.

## Email signups and email tracking

The kickoff form sends your address securely to Mautic to request signup. You receive a confirmation request, and only an explicit confirmation adds you to the confirmed kickoff list and sends the welcome email. The form does not pass website tracking cookies or your browser IP to the signup relay. You can sign up with website tracking off.

Mautic keeps the address, signup source, permission purpose/version, request and confirmation timestamps, delivery records and suppression preferences. The current permission is for the kickoff announcement; a page visit alone does not expand it. Email opens may be measured with a pixel, and ordinary email links may be tracked. The signed confirmation link is excluded from click tracking. Email clients can block images or fetch them automatically, so open counts do not prove a person read a message.

Use the unsubscribe link in an email to stop further marketing messages, or contact `info@contextqb.com` about your preferences or records. Website tracking choices and email unsubscribe are separate. Stored contact and visit history currently has no automatic deletion schedule; deletion requests are handled separately, and encrypted backup copies expire under backup retention.

## Visiting the site or MCP server

Our MCP server (`mcp.contextqb.com`) and website also use [Cloudflare Workers Analytics](https://developers.cloudflare.com/workers/observability/analytics-engine/). The following describes that aggregate infrastructure analytics, separately from optional Mautic website tracking.

### What Cloudflare analytics records

- **Request count** — how many requests hit the server
- **Response time** — how long each request took to process
- **Country code** — derived from Cloudflare's edge location, not your IP
- **Status codes** — whether requests succeeded or failed

### What it does not record

- **Your IP address** — Cloudflare processes it at the edge but does not store or expose it to us
- **Request body contents** — we don't see what you asked for
- **Cookies or tracking identifiers** — this aggregate analytics layer does not use the Mautic identifiers described above

This aggregate analytics layer does not provide individual visitor profiles. Its collection is separate from the optional website tracking choice.

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
- **Latest CLI version (server-returned, not collected)** — every membership and telemetry response includes a `cli_version_latest` field naming the most recent published CLI version. The CLI caches this locally at `<credentials-dir>/upgrade-check.json` so it can warn you when your installed version is older. This is a one-way signal from the server to your CLI; it is not telemetry the CLI sends.

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

### Upgrade notice

When your installed CLI version is older than the most recent `cli_version_latest` returned by the server (or cached from a prior server response), the CLI prints a one-line stderr notice on every invocation:

    [contextqb] You are running v<current>; latest is v<latest>. Run `contextqb upgrade` for install instructions.

The notice fires from `contextqb check`, `contextqb membership`, `contextqb mcp`, and `contextqb insights`. It is not rate-limited and continues to print on every run until you upgrade or until the cached `cli_version_latest` matches your installed version. The `contextqb upgrade` subcommand is **instructional only** — it detects how the CLI was installed (npx, pnpm dlx, npm-global, pnpm-global, homebrew, local dev dependency) and prints the corresponding install command. It does not run any installer itself.

This behavior is governed by an internal architecture decision record (ADR-0034, not published) and the architectural invariant INV-CLI-UPD-1. The CLI never silently degrades; older versions continue to send telemetry and continue to work, but their data is not counted in cooperative aggregates until the operator upgrades to a version that includes `project_id` (CLI 2.3.0 or newer).

#### Opt-in npm-registry poll

If you have opted out of telemetry, the upgrade notice cannot fire by default — the server-returned `cli_version_latest` signal travels with telemetry responses, so opting out of telemetry also opts you out of the upgrade signal. To re-enable upgrade notices without re-enabling telemetry, set the environment variable:

    CONTEXTQB_UPDATE_CHECK=npm

When this variable is set, the CLI polls `https://registry.npmjs.org/@context-qb/cli/latest` at most once every 24 hours, caches the result locally, and uses that for the upgrade notice. This is the only network call the CLI makes outside of telemetry, and it sends nothing about you, your project, or your machine — only an unauthenticated GET to a public npm endpoint. The cache is stored in your CLI config directory and is never transmitted.

This is **opt-in only**. Without `CONTEXTQB_UPDATE_CHECK=npm`, telemetry-opt-out users will never see an upgrade notice and will never make this network call.

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

### Upgrade advisory on community-tool responses

When you call community-insight tools (`community_stack_trends`, `community_structure_patterns`, `community_common_mistakes`, `community_deploy_distribution`) through an MCP-connected agent, the response may include a one-line advisory if your CLI is older than the latest published version. The advisory is computed from the same `cli_version` field already disclosed under "What the CLI records" above; no new data is collected. The advisory fires at most once per 24-hour window per member (per INV-CLI-UPD-2). If you have opted out of telemetry, the server has no `cli_version` data to compare, so no advisory fires.

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
- **Mautic contacts and visits:** No automatic deletion schedule is currently configured; request changes or deletion through `info@contextqb.com`. Protected backup copies expire under their separate retention.

## Why we collect it

Aggregate usage data helps us:

- Understand which resources are most valuable
- Identify common project structures and pain points
- Prioritize methodology improvements
- Provide community insights based on project-level data (e.g., "70% of TypeScript projects use this pattern")

The CLI/MCP cooperative data is not used to identify individuals or build marketing profiles. Optional Mautic website tracking can record interests for permitted email targeting, as described above. We do not sell either kind of data.

## Technical details

For the technical specification, see the privacy section of our public methodology and tooling at [contextqb.com](https://contextqb.com).

## Questions?

If you have questions about our privacy practices, open an issue on [GitHub](https://github.com/ContextQB/contextqb/issues) or reach out through the channels listed on the [About](/about) page.
