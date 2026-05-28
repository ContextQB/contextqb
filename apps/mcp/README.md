# ContextQB MCP Server (Remote)

A remote MCP (Model Context Protocol) server that serves the ContextQB methodology content over HTTP. Deployed to Cloudflare Workers.

## Endpoints

- **Production**: `https://mcp.contextqb.com/mcp`
- **Workers.dev**: `https://contextqb-mcp.symbolscape-inc.workers.dev/mcp`

## Using the MCP Server

### In Cursor

Add to your MCP settings:

```json
{
  "mcpServers": {
    "contextqb": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.contextqb.com/mcp"]
    }
  }
}
```

### In Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "contextqb": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.contextqb.com/mcp"]
    }
  }
}
```

### In Windsurf

Add to `mcp_config.json`:

```json
{
  "mcpServers": {
    "contextqb": {
      "serverUrl": "https://mcp.contextqb.com/mcp"
    }
  }
}
```

## Available Tools

The MCP server exposes methodology tools (free) and community insight tools (token-gated):

### List tools

- `list_principles` — List all architecture principles
- `list_playbooks` — List all playbooks
- `list_audits` — List all audit templates
- `list_prompts` — List all reusable prompts

### Get tools

- `get_principle` — Get a principle by id
- `get_playbook` — Get a playbook by id
- `get_audit_prompt` — Get an audit template by id
- `get_prompt` — Get a prompt by id

### Briefing tools

- `get_architecture_principles` — Get all principles in one document
- `get_anti_spaghetti_checklist` — Get the anti-spaghetti checklist
- `get_naming_convention_checklist` — Get the naming conventions checklist
- `get_state_management_checklist` — Get the state management checklist

### Generator tools

- `generate_audit_instruction` — Generate an audit instruction from a template
- `generate_feature_planning_prompt` — Generate a feature planning prompt
- `generate_refactor_plan_prompt` — Generate a refactor planning prompt

### Community insight tools (token-gated)

These tools require a membership token. Without a valid token, they return a message prompting registration.

- `community_stack_trends({ dim1?: "lang" | "mono" })` — Community-wide stack trends
- `community_structure_patterns({ dim1?: "tree_entries" | "routes" | "decisions" })` — Project structure patterns
- `community_common_mistakes({ dim1?: "validation_status" })` — Common validation outcomes
- `community_deploy_distribution({})` — Deployment platform distribution

All return Markdown tables with bucketed community sizes (e.g., `n>30`, `n>100`, `n>1000`) and percentage breakdowns.

## Health Check

```bash
curl https://mcp.contextqb.com/
```

Returns:

```json
{
  "name": "contextqb",
  "version": "0.1.0",
  "status": "ok",
  "mcp": "/mcp",
  "d1": "ok",
  "content": {
    "principles": 21,
    "playbooks": 21,
    "audits": 14,
    "prompts": 8
  }
}
```

## Development

```bash
# Bundle content and start dev server
pnpm dev

# Deploy to Cloudflare Workers
pnpm deploy
```

## Architecture

This is a stateless MCP server using Cloudflare's `createMcpHandler` with the streamable HTTP transport. Content is bundled at build time from the methodology packages (`packages/methodology/standards`, `packages/methodology/playbooks`, `packages/methodology/prompts`) into a JSON file that gets embedded in the Worker.

The server requires no authentication (public read-only access to methodology content).

## D1 Database

The Worker has a D1 database binding `DB` for telemetry storage (per [ADR-0018](../../docs/architecture/decisions/0018-data-cooperative-telemetry.md)).

### Binding

- **Binding name**: `DB`
- **Database name**: `contextqb-telemetry`
- **Tables**: `members`, `cli_events`, `mcp_events`, `insights`

### Migrations

We use `wrangler d1 migrations`. Migrations live at `apps/mcp/migrations/NNNN_<slug>.sql`.

```bash
# Apply migrations to remote D1
pnpm exec wrangler d1 migrations apply contextqb-telemetry --remote

# Apply migrations to local dev D1
pnpm exec wrangler d1 migrations apply contextqb-telemetry --local
```

### Schema versioning

Both `cli_events` and `mcp_events` carry an integer `payload_schema_version` column. Bump only on backwards-incompatible payload-shape changes; the aggregation pipeline filters or coerces per version.

See the [Tranche A section of punchlist 0018](../../docs/punchlists/0018-data-cooperative.md) for the schema rationale.

## Membership Endpoints

Three HTTP endpoints for the data cooperative membership system (per [ADR-0018](../../docs/architecture/decisions/0018-data-cooperative-telemetry.md), Tranche B).

### POST /membership/register

Register a new member. Idempotent — re-registering the same `anonymous_id` returns the existing token.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"anonymous_id":"a1b2c3d4e5f6...64-char-hex..."}' \
  https://mcp.contextqb.com/membership/register
```

Success (200):

```json
{ "token": "mt_550e8400-e29b-41d4-a716-446655440000" }
```

Error (400 — invalid input):

```json
{
  "error": "invalid_anonymous_id",
  "message": "anonymous_id must be a 64-character lowercase hex string"
}
```

### POST /membership/revoke

Revoke membership and delete all associated events. Requires valid token.

```bash
curl -X POST \
  -H "Authorization: Bearer mt_550e8400-e29b-41d4-a716-446655440000" \
  https://mcp.contextqb.com/membership/revoke
```

Success (200):

```json
{ "ok": true, "deleted": { "cli_events": 5, "mcp_events": 12 } }
```

Error (401 — invalid/missing token):

```json
{ "error": "invalid_token", "message": "Token not found or revoked" }
```

### GET /membership/status

Get membership status and event counts. Requires valid token.

```bash
curl -H "Authorization: Bearer mt_550e8400-e29b-41d4-a716-446655440000" \
  https://mcp.contextqb.com/membership/status
```

Success (200):

```json
{
  "anonymous_id": "a1b2c3d4e5f6...64-char-hex...",
  "opted_in_at": 1716681600,
  "revoked_at": null,
  "event_counts": { "cli": 5, "mcp": 12 }
}
```

Error (401 — missing token):

```json
{ "error": "missing_token", "message": "Authorization header or ?token= query param required" }
```

### Token authentication

All token-gated endpoints accept the token via:

1. **Authorization header** (preferred): `Authorization: Bearer mt_...`
2. **Query parameter** (fallback): `?token=mt_...`

## Insights API

Query community-wide aggregated insights. Requires valid membership token. CORS-enabled for `https://contextqb.com`.

### GET /insights

```bash
curl -H "Authorization: Bearer mt_550e8400-e29b-41d4-a716-446655440000" \
  "https://mcp.contextqb.com/insights?topic=stack&dim1=lang"
```

#### Query Parameters

| Parameter | Required | Description                                                                       |
| --------- | -------- | --------------------------------------------------------------------------------- |
| `topic`   | Yes      | One of: `stack`, `structure`, `mistakes`, `deploy`                                |
| `dim1`    | No       | Dimension filter (topic-specific: `lang`, `mono`, `tree_entries`, `routes`, etc.) |
| `dim2`    | No       | Second dimension filter (max 2 dimensions)                                        |

#### Success Response (200)

```json
{
  "topic": "stack",
  "dim1": "lang",
  "n_bucket": "n>30",
  "percentages": [
    { "value": "typescript", "pct": 45.5 },
    { "value": "python", "pct": 30.2 },
    { "value": "go", "pct": 12.1 }
  ]
}
```

#### Insufficient Data Response (200)

Returned when fewer than 30 distinct users have data for the requested topic/dimension:

```json
{
  "topic": "mistakes",
  "insufficient_data": true,
  "threshold": 30
}
```

#### Error Responses

| Status | Error Code            | Description                        |
| ------ | --------------------- | ---------------------------------- |
| 400    | `missing_topic`       | No topic parameter provided        |
| 400    | `unknown_topic`       | Topic not in allow-list            |
| 400    | `too_many_dimensions` | More than 2 dimension parameters   |
| 400    | `invalid_dim1`        | Dimension not valid for topic      |
| 401    | `missing_token`       | No Authorization header or ?token= |
| 401    | `invalid_token`       | Token not found or revoked         |

### CORS

The `/insights` endpoint responds to `OPTIONS` preflight with:

- `Access-Control-Allow-Origin: https://contextqb.com`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Authorization, Content-Type`

## Aggregation Pipeline

A daily Cron job aggregates raw CLI telemetry events into privacy-preserving insight cells (per [ADR-0018](../../docs/architecture/decisions/0018-data-cooperative-telemetry.md), Tranche E).

### Cron Schedule

| Schedule    | Description        |
| ----------- | ------------------ |
| `0 6 * * *` | Daily at 06:00 UTC |

The Cron trigger is configured in `wrangler.jsonc` under `triggers.crons`.

### Insights Table Schema

```sql
CREATE TABLE insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT NOT NULL,         -- 'stack' | 'structure' | 'mistakes' | 'deploy'
  dim1_key TEXT NOT NULL,      -- e.g. 'lang', 'mono', 'tree_entries'
  dim1_value TEXT NOT NULL,    -- e.g. 'typescript', 'true', '1-10'
  dim2_key TEXT,               -- nullable; max 2 dimensions
  dim2_value TEXT,             -- nullable
  n_users INTEGER NOT NULL CHECK(n_users >= 30),  -- k-anonymity enforced
  percentage REAL NOT NULL,    -- pre-computed for fast read
  computed_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(topic, dim1_key, dim1_value, dim2_key, dim2_value)
);
```

### Topics

| Topic       | Dimensions                            | Description                                             |
| ----------- | ------------------------------------- | ------------------------------------------------------- |
| `stack`     | `lang`, `mono`                        | Distribution of programming language and monorepo usage |
| `structure` | `tree_entries`, `routes`, `decisions` | Bucketed counts (0, 1-10, 11-50, 51-100, 100+)          |
| `mistakes`  | `validation_status`                   | Distribution of passed/failed validation                |
| `deploy`    | `platform`                            | Distribution of deployment platforms                    |

### k-anonymity

All insight cells have `n_users >= 30`. Cells with fewer distinct users are not written (enforced by `HAVING` clause in aggregation queries). The `CHECK(n_users >= 30)` constraint provides database-level enforcement.

### Idempotent Re-runs

Each aggregation run deletes existing rows for a topic before inserting new ones. Re-running the Cron produces identical results (modulo `computed_at` timestamp).

```bash
# Manual trigger via Cloudflare dashboard:
# Workers > contextqb-mcp > Triggers > Cron > "Trigger now"
```

## Rate Limits

Cloudflare Rate Limiting Rules protect the membership and telemetry endpoints from abuse.

| Endpoint               | Limit       | Key   | Rule Name                       |
| ---------------------- | ----------- | ----- | ------------------------------- |
| `/membership/register` | 60 req/min  | IP    | `contextqb-membership-register` |
| `/membership/revoke`   | 60 req/min  | IP    | `contextqb-membership-revoke`   |
| `/telemetry/cli`       | 600 req/min | Token | `contextqb-telemetry-cli`       |
| `/insights`            | 60 req/min  | Token | `contextqb-insights`            |

Exceeding a limit returns `429 Too Many Requests`. Rules are configured in the Cloudflare dashboard under Security > WAF > Rate limiting rules.

## Token Rotation

v1 does not provide an in-place token rotation endpoint. To rotate a token:

1. Run `contextqb membership revoke` (deletes all server-side data and marks local credentials as `opted_out`)
2. Delete the local credentials file at `~/.config/contextqb/credentials.json` (or `$CONTEXTQB_HOME/credentials.json` if set)
3. Run any `contextqb` command — a fresh membership is auto-provisioned

This is intentionally a destructive operation: rotation = revoke + re-register. A non-destructive rotation endpoint may be added in a future version.

## Related

- [`packages/methodology/mcp-server`](../../packages/methodology/mcp-server) — Local stdio-based MCP server (same functionality, local execution)
- [PRODUCTS.md](../../PRODUCTS.md) — Product overview
