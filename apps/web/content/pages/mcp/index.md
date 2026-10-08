---
eyebrow: MCP
headline: Give your agent the ContextQB playbook.
subhead: >-
  Add the ContextQB MCP to any MCP-aware agent tool. Your agent gets access to
  every guide, briefing, principle, playbook, audit, prompt and reference table
  on this site, addressable by URI.
meta_title: MCP
meta_description: >-
  Install the ContextQB MCP so your agent can pull guides, principles,
  playbooks, audits, and prompts into the work by URI.
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review (stack-verification pass)"
  reviewer_notes: |-
    2026-10-07 renewal B2 (author self-checked; independent review pending; not
    operator-accepted): reference tools and resources listed with the pricing
    caveat; client snippets now match the setup reference (parity-checked
    against the CLI's output and the sample files), with Claude Code and VS Code
    added and the Windsurf section renamed for Devin Desktop's Cascade agent; the
    Cursor type difference is stated, not hidden; first-run wording matches the
    drift-detection playbook; the unpublished sample-config link and the local
    checkout steps are replaced. Earlier notes: Tool list updated for the Sept-2026 stack (Windsurf → Devin Desktop; added
    Claude Code + Antigravity). Earlier: added "Pair with the data cooperative"
    section and documented the four community_* tools per §5.2 of the
    cooperative flow scope.
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
contextqb://references/<group>
```

It also exposes tools that return structured Markdown:

- `list_principles` / `get_principle`
- `list_playbooks` / `get_playbook`
- `list_audits` / `get_audit_prompt`
- `list_prompts` / `get_prompt`
- `list_guides` / `get_guide`
- `list_briefings` / `get_briefing`
- `list_references` / `get_reference` — the reference tables (tools, models, pricing, setup): neutral, dated facts outside the learning sequence. Every response from the pricing group starts with a notice that prices are a dated reference, not a live quote, to be checked against the provider's official pricing page.
- `get_architecture_principles` — a single combined briefing.
- `generate_audit_instruction` — produce an agent-ready audit instruction by combining a template with a target system.
- `generate_feature_planning_prompt` — generate a feature planning prompt.
- `generate_refactor_plan_prompt` — generate a refactor planning prompt.
- `get_anti_spaghetti_checklist`
- `get_naming_convention_checklist`
- `get_state_management_checklist`

### Community insight tools (token-gated)

These four tools surface anonymized aggregates from the data cooperative.
They require a membership token (see [Pair with the data cooperative](#pair-with-the-data-cooperative) below):

- `community_stack_trends` — language and monorepo distribution
- `community_structure_patterns` — bucketed counts of tree entries, routes, and ADRs
- `community_common_mistakes` — drift-detection pass/fail distribution
- `community_deploy_distribution` — deployment platform mix

Until the cooperative reaches 30 distinct projects for a given topic (per ADR-0033), these tools return an "Insufficient data" Markdown table — see [Privacy & Telemetry](/privacy/telemetry) for the k-anonymity rationale.

## Fastest setup

The hosted server at `https://mcp.contextqb.com/mcp` requires no install. Add the configuration for your tool, restart it, and the corpus is available to your agent. These snippets carry no token; they give your agent every methodology tool. Each client's configuration format changes between versions — the [MCP client configuration reference](contextqb://references/setup#mcp-clients) records each one with the date and source it was checked against.

### Cursor

Add to `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (one project):

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

This is the shape `contextqb mcp setup --client cursor` prints. Cursor's own documentation shows remote servers with `url` (and optional `headers`) and documents `type` only for local command servers; the reference entry records that documented shape.

### Claude Desktop

Claude can add a remote server natively as a custom connector in its settings. To use the configuration file instead, add this to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

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

This runs the community `mcp-remote` bridge through `npx`, which downloads its latest version at launch. It is the shape `contextqb mcp setup --client claude` prints.

### Claude Code

Run in your project:

```bash
claude mcp add --transport http contextqb https://mcp.contextqb.com/mcp
```

### Devin Desktop (formerly Windsurf) — Cascade agent

Devin Desktop's legacy Cascade agent reads `~/.config/devin/mcp_config.json` (macOS and Linux) or `%APPDATA%\devin\mcp_config.json` (Windows):

```json
{
  "mcpServers": {
    "contextqb": {
      "serverUrl": "https://mcp.contextqb.com/mcp"
    }
  }
}
```

Devin Desktop's default agent configures MCP servers in the Devin CLI's configuration files instead; check its documentation.

### VS Code (GitHub Copilot)

Add to `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "contextqb": {
      "type": "http",
      "url": "https://mcp.contextqb.com/mcp"
    }
  }
}
```

VS Code also reads a portable `.mcp.json` at the workspace root, which uses a top-level `mcpServers` object, and prefers that destination for new servers.

### Other tools

Any MCP client that supports remote HTTP servers can connect to `https://mcp.contextqb.com/mcp`. Use your client's documented way of adding a remote server.

## Pair with the data cooperative

Methodology tools (`list_principles`, `get_audit_prompt`, `get_reference`, etc.) work for everyone with no token. The four `community_*` tools listed above are token-gated and surface aggregate trends from the cooperative.

To enable them, install the CLI (see [/check](/check)) and run:

```bash
contextqb mcp setup --client cursor   # or --client claude; no option prints both
```

The output is a ready-to-paste config snippet with your membership token already filled in, so you can drop it into the same config file the snippets above point at. Keep it out of your repository: the token is yours. The first run of any `contextqb` command, outside CI and unless you opt out, registers your machine and stores a membership token — see [What happens on first run](/check#install) on the `/check` page.

## Try it on a real review

Once the MCP is installed, ask your agent to use it on the current project:

> Use the ContextQB MCP. Call `get_architecture_principles`. Then perform a UI architecture audit on the current repository using the template returned by `get_audit_prompt` with id `ui-architecture`. Produce the full document.

## Local setup

Running the MCP server from a local checkout is for contributors working in the ContextQB source repository; there is no published package for running it offline. Use the hosted server above.
