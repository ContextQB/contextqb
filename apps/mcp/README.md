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

The MCP server exposes 15 tools for accessing ContextQB methodology content:

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
- **Tables**: `members`, `cli_events`, `mcp_events`

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

## Related

- [`packages/methodology/mcp-server`](../../packages/methodology/mcp-server) — Local stdio-based MCP server (same functionality, local execution)
- [PRODUCTS.md](../../PRODUCTS.md) — Product overview
