# MCP Setup Guide

Connect your AI agent to the ContextQB methodology server.

## What you get

The ContextQB MCP server provides your AI agent with:

- **Principles** — Core architecture concepts (modularity, state ownership, etc.)
- **Playbooks** — Step-by-step workflows for common tasks
- **Audits** — Templates for comprehensive system reviews
- **Prompts** — Reusable prompts for specific tasks

Your agent can query these resources directly, pulling relevant guidance into context when needed.

## Server URL

```
https://mcp.contextqb.com
```

## Configuration

### Cursor

Add to your MCP settings (`.cursor/mcp.json` or via Settings → MCP):

```json
{
  "mcpServers": {
    "contextqb": {
      "url": "https://mcp.contextqb.com/sse"
    }
  }
}
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "contextqb": {
      "url": "https://mcp.contextqb.com/sse"
    }
  }
}
```

### Other MCP clients

The server uses Server-Sent Events (SSE) transport. Point your client to:

```
https://mcp.contextqb.com/sse
```

## Available tools

Once connected, your agent has access to:

| Tool | Description |
|------|-------------|
| `list_principles` | List all architecture principles |
| `get_principle` | Get a specific principle by ID |
| `list_playbooks` | List all playbooks |
| `get_playbook` | Get a specific playbook by ID |
| `list_audits` | List all audit templates |
| `get_audit` | Get a specific audit by ID |
| `list_prompts` | List all prompts |
| `get_prompt` | Get a specific prompt by ID |

## Example usage

Ask your agent:

> "Use the ContextQB MCP to get the state-ownership principle and apply it to review my current codebase."

> "List all available audits from ContextQB and run the repo-readiness audit on this project."

> "Get the feature-planning playbook and help me plan this new feature."

## No authentication required

The MCP server is free to use. No API key or registration needed.

## Privacy

We collect only aggregate analytics (request counts, response times, country codes) via Cloudflare Workers Analytics. We do not see what you request or any details about your projects. See [contextqb.com/privacy/telemetry](https://contextqb.com/privacy/telemetry) for details.
