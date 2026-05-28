---
eyebrow: MCP
headline: The ContextQB MCP server.
subhead: >-
  Drop the ContextQB MCP into any compatible agent — Cursor, Claude Desktop,
  Windsurf, or any other MCP-aware tool — and your agent gains access to every
  guide, briefing, principle, playbook, audit, and prompt on this site,
  addressable by URI.
meta_title: MCP
meta_description: ""

---

## What it exposes

The MCP server publishes resources under the `contextqb://` scheme:

```
contextqb://principles/<id>
contextqb://playbooks/<id>
contextqb://audits/<id>
contextqb://prompts/<id>
contextqb://guides/<id>
contextqb://briefings/<id>
```

And the following tools, each returning a structured Markdown document:

- `list_principles` / `get_principle`
- `list_playbooks` / `get_playbook`
- `list_audits` / `get_audit_prompt`
- `list_prompts` / `get_prompt`
- `list_guides` / `get_guide`
- `list_briefings` / `get_briefing`
- `get_architecture_principles` — a single combined briefing.
- `generate_audit_instruction` — produce an agent-ready audit instruction by combining a template with a target system.
- `generate_feature_planning_prompt` — generate a feature planning prompt.
- `generate_refactor_plan_prompt` — generate a refactor planning prompt.
- `get_anti_spaghetti_checklist`
- `get_naming_convention_checklist`
- `get_state_management_checklist`

## Quick start (remote — recommended)

The hosted server at `mcp.contextqb.com` requires no installation. Just add the config and restart your tool.

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "contextqb": {
      "type": "http",
      "url": "https://mcp.contextqb.com/mcp"
    }
  }
}
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

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

### Windsurf

Add to your MCP config:

```json
{
  "mcpServers": {
    "contextqb": {
      "serverUrl": "https://mcp.contextqb.com/mcp"
    }
  }
}
```

## First useful prompt

Once installed, try this in your agent:

> Use the ContextQB MCP. Call `get_architecture_principles`. Then perform a UI architecture audit on the current repository using the template returned by `get_audit_prompt` with id `ui-architecture`. Produce the full document.

## Local install (alternative)

For offline use or development, you can run the MCP server locally. This requires cloning the repository:

```bash
git clone https://github.com/contextqb/contextqb.git
cd contextqb
pnpm install
```

Then configure your tool to run the local server. See the [sample configs](https://github.com/contextqb/contextqb/tree/main/examples/sample-mcp-configs) in the repository for details.

## Future tools

The roadmap includes repo-aware analysis (import graph mapping, god-component detection, duplicate-logic detection). Those are intentionally deferred — see [About](/about) for the reasoning.
