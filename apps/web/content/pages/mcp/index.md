---
eyebrow: MCP
headline: Give your agent the ContextQB playbook.
subhead: >-
  Add the ContextQB MCP to Cursor, Claude Desktop, Windsurf, or any MCP-aware
  tool. Your agent gets access to every guide, briefing, principle, playbook,
  audit, and prompt on this site, addressable by URI.
meta_title: MCP
meta_description: >-
  Install the ContextQB MCP so your agent can pull guides, principles,
  playbooks, audits, and prompts into the work by URI.
review:
  status: final
  last_reviewed: "2026-05-27"
  reviewer: "agent:brand-voice-pass"
  reviewer_notes: |-
    Primetime pass completed. Reframed the page around what the MCP lets an
    agent do, tightened install headings, removed roadmap material, and added
    social/search metadata.
---

## What it exposes

The MCP server gives your agent two useful things: readable resources and tools
that return agent-ready instructions. Resources live under the `contextqb://`
scheme:

```
contextqb://principles/<id>
contextqb://playbooks/<id>
contextqb://audits/<id>
contextqb://prompts/<id>
contextqb://guides/<id>
contextqb://briefings/<id>
```

It also exposes tools that return structured Markdown:

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

## Fastest setup

The hosted server at `mcp.contextqb.com` requires no install. Add the config,
restart your tool, and the corpus is available in your agent.

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

## Try it on a real review

Once the MCP is installed, ask your agent to use it on the current project:

> Use the ContextQB MCP. Call `get_architecture_principles`. Then perform a UI architecture audit on the current repository using the template returned by `get_audit_prompt` with id `ui-architecture`. Produce the full document.

## Local setup

For offline use or development, run the MCP server from a local checkout:

```bash
git clone https://github.com/contextqb/contextqb.git
cd contextqb
pnpm install
```

Then configure your tool to run the local server. See the [sample configs](https://github.com/contextqb/contextqb/tree/main/examples/sample-mcp-configs) in the repository for details.
