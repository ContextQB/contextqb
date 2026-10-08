---
id: build-mcp-for-project-context
title: Build an MCP for Reusable Project Context
summary: Turn the prompts, principles, and standards your project relies on into an MCP server so any agent in any tool can pull them in.
version: 0.2.1
problem: |
  Project context — naming conventions, architectural decisions, prompts — lives in scattered Markdown files. An agent with access to your workspace can read them, but each tool, project and person has to find them, and copies drift apart. An MCP server makes the same content addressable and consistently delivered across tools, projects and people.
when_to_use: |
  When you find yourself pasting the same context into multiple chats, or when multiple people on a team need the same architectural backbone.
expected_outputs:
  - A working MCP server exposing your project's resources.
  - Example configurations for at least one current MCP-aware client, with no secrets committed.
  - Documentation of which URIs and tools exist.
audience:
  - novice-builder
  - developer
  - founder
  - agent
journey_stage: 6
journey_rank: 30
related_principles:
  - maintainability
  - modularity
  - separation-of-concerns
tags:
  - mcp
  - tooling
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent); R-01/R-05/R-06 remediation 2026-09-09"
  reviewer_notes: "2026-10-07 renewal B6 review correction (0.2.1; author self-checked; independent review pending; not operator-accepted): the problem statement no longer says agents can read the files only when pasted; workspace-capable agents read local files, and the problem is consistent discovery and distribution across tools, projects and people. Body unchanged. 2026-10-07 renewal B6 (0.2.0; author self-checked; independent review pending; not operator-accepted): the item-count threshold becomes a three-way choice by when context is needed and who needs it (AGENTS.md, a tool's skills or prompt files, or an MCP server), linking the new skills-mcp-and-agents-md briefing; adds local or remote, and for a hosted server an explicit access policy (public read-only may be anonymous; protected data and actions need authentication and authorization) with links to the transports reference and the MCP project audit; the agent scaffolds from SDK docs while you own inventory, organisation and content; named clients replaced by the dated client reference, with no secrets in committed examples; remote hosting added as a distribution option; the repository-relative schema and examples paths, which learners cannot reach, replaced by a description; duplicate heading removed. Earlier notes (2026-09-09 epistemology review): F-13/F-14/F-04 resolved 2026-09-09: AGENTS.md canon reference, post-restructure paths, working schema link, rank moved 20→30 (retrofit-drift-detection keeps 20)."
related:
  - set-up-agents-md
  - understanding-the-context-window
  - mcp-project
  - skills-mcp-and-agents-md
  - mcp-vs-paste
---

# Build an MCP for Reusable Project Context

The Model Context Protocol turns your project's principles, prompts, and playbooks into resources any compatible agent can fetch by URI. This playbook shows you how to start small and grow. The ContextQB MCP server, which serves this methodology, is itself an example of the pattern.

**Who does what.** The agent can scaffold the server from the official SDK documentation ([MCP SDKs](contextqb://references/tools#mcp-sdks)). Your work is the part only you can do: deciding what goes in, organising it, and writing the content.

## Step 1 — Inventory your context, then choose where it belongs

Before you write any code, list everything you currently paste into agents:

- Naming conventions.
- Architecture decisions.
- Style preferences.
- Repeated prompts ("audit this," "plan this feature").
- Domain glossaries.

Then sort each item by when it is needed and who needs it — not by how many items there are:

- **Rules every session in this project should follow** → your `AGENTS.md`, or project documents it points to (see [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md)).
- **Procedures you run sometimes, by name, in one tool** → that tool's skills, prompt files or commands ([which tools offer what](contextqb://references/setup#reusable-instructions)).
- **Content shared across tools, projects or people, versioned in one place, or served from outside the repository** → an MCP server. That is what the rest of this playbook builds.

[Skills vs. MCP vs. AGENTS.md](contextqb://briefings/skills-mcp-and-agents-md) explains the three in more detail. If nothing on your list lands in the third group, you do not need an MCP yet.

## Step 2 — Organise by content type

Group the MCP-bound items into:

- **Principles** — things that are true for the whole project.
- **Playbooks** — repeatable workflows.
- **Audits** — templates for asking "evaluate X."
- **Prompts** — parametric prompts for common tasks.

Give each type a small frontmatter schema — the fields every item of that type must have (an `id`, a title, a one-line summary, and whatever else the type needs) — and validate the files against it. ContextQB uses one schema per content type; start with the fields you actually use.

## Step 3 — Write the content as plain Markdown with frontmatter

Don't reach for a CMS. Markdown + frontmatter:

- Reads in any editor.
- Diffs cleanly in git.
- Validates with a simple schema.
- Renders in your IDE.

## Step 4 — Build a minimal MCP server

Start with an official MCP SDK and expose:

- One resource type per content type.
- One tool per common request ("list principles," "get principle by id").
- A clear URI scheme: `<project>://<kind>/<id>`.

Resist the urge to add embeddings, AST parsing, or repo analysis on day one. The static MCP is the product. Intelligence is a later addition.

**Local or remote?** A local server runs on each user's machine and is started by their client. A remote server is hosted once and reached over the network; the protocol's transports and how authorization works for each are in the [transports and authorization reference](contextqb://references/setup#mcp-transports-auth). If you host it, write down its access policy before you deploy: content that is intentionally public and read-only may be open to anyone; private content and any tool that changes something need authentication and authorization. The [MCP project audit](contextqb://audits/mcp-project) checks a server against that policy.

## Step 5 — Document the integration

Add example configurations for at least one current MCP-aware client. Client configuration shapes differ and change; the dated [MCP client configuration reference](contextqb://references/setup#mcp-clients) records the documented shape for the clients ContextQB has checked. Keep tokens and other secrets out of any example you commit.

## Step 6 — Distribute

Choose one:

- Publish the server package to npm with a `bin` so users can `npx your-mcp`.
- Have users clone the repository and run it locally.
- Host it remotely, with the access policy from Step 4, so users only add a URL to their client.

For small teams, local is fine. For wider distribution, a published package or a hosted server.

## Step 7 — Iterate

Add resources as the team accumulates new patterns. Treat the MCP as living documentation: when a new principle becomes important, it goes into the MCP first.
