---
id: build-mcp-for-project-context
title: Build an MCP for Reusable Project Context
summary: Turn the prompts, principles, and standards your project relies on into an MCP server so any agent in any tool can pull them in.
version: 0.1.0
problem: |
  Project context — naming conventions, architectural decisions, prompts — lives in scattered Markdown files. Agents can read them only when copy-pasted into a chat. An MCP server makes them addressable from any tool.
when_to_use: |
  When you find yourself pasting the same context into multiple chats, or when multiple people on a team need the same architectural backbone.
expected_outputs:
  - A working MCP server exposing your project's resources.
  - A configuration file you can drop into Cursor, Claude Desktop, or any MCP-aware tool.
  - Documentation of which URIs and tools exist.
audience:
  - novice-builder
  - developer
  - founder
  - agent
related_principles:
  - separation-of-concerns
  - modularity
  - maintainability
tags:
  - mcp
  - tooling
---

# Build an MCP for Reusable Project Context

The Model Context Protocol turns your project's principles, prompts, and playbooks into resources any compatible agent can fetch by URI. This playbook shows you how to start small and grow.

The ContextQB MCP server (in `packages/mcp-server/` of this repository) is itself an example of this pattern.

## Step 1 — Inventory your context

Before you write any code, list everything you currently paste into agents:

- Naming conventions.
- Architecture decisions.
- Style preferences.
- Repeated prompts ("audit this," "plan this feature").
- Domain glossaries.

If the list has fewer than 5 items, you do not need an MCP yet. Use a single `AGENT_INSTRUCTIONS.md` file.

If the list has 10+ items, an MCP starts paying for itself.

## Step 2 — Organise by content type

Group your inventory into:

- **Principles** — things that are true for the whole project.
- **Playbooks** — repeatable workflows.
- **Audits** — templates for asking "evaluate X."
- **Prompts** — parametric prompts for common tasks.

The ContextQB content schemas ([`packages/content/src/schema.ts`](../content/src/schema.ts)) are a reasonable starting point. Copy and adapt them.

## Step 3 — Write the content as plain Markdown with frontmatter

Don't reach for a CMS. Markdown + frontmatter:

- Reads in any editor.
- Diffs cleanly in git.
- Validates with a simple schema.
- Renders in your IDE.

## Step 4 — Build a minimal MCP server

Start with the official MCP SDK and expose:

- One resource type per content type.
- One tool per common request ("list principles," "get principle by id").
- A clear URI scheme: `<project>://<kind>/<id>`.

Resist the urge to add embeddings, AST parsing, or repo analysis on day one. The static MCP is the product. Intelligence is a later addition.

## Step 5 — Document the integration

Add a `mcp-config.json` example for Cursor and Claude Desktop. See `examples/sample-mcp-configs/` in this repository for the shape.

## Step 6 — Distribute

Either:

- Publish the MCP package to npm with a `bin` so users can `npx your-mcp`.
- Or have users clone the repo and run it locally.

For small teams, local is fine. For wider distribution, npm.

## Step 7 — Iterate

Add resources as the team accumulates new patterns. Treat the MCP as living documentation: when a new principle becomes important, it goes into the MCP first.
