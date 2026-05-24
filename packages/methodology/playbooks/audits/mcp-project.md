---
id: mcp-project
title: MCP Project Audit
summary: An audit template for evaluating the design and quality of an MCP server — resource model, tool surface, content boundary, and integration story.
version: 0.1.0
audience:
  - developer
  - agent
objective: |
  Evaluate an MCP server's architectural quality: clean resource model, clear tool surface, well-defined content boundary, and usable integration with agentic IDEs.
scope: |
  The MCP server package and any content packages it depends on.
required_sections:
  - Executive summary
  - Resource model (URI scheme, kinds, metadata)
  - Tool surface (purpose, inputs, outputs)
  - Content boundary (where content lives vs server logic)
  - Versioning and stability
  - Integration story (how users install and configure)
  - Findings
  - Recommendations
evaluation_criteria:
  - URI scheme is consistent and addressable.
  - Tools have clear, single purposes and structured outputs.
  - Content is cleanly separated from server logic.
  - Versioning is explicit, both per-resource and per-server.
  - Integration instructions actually work in a target IDE.
deliverables:
  - A single Markdown document with the required sections.
related:
  - separation-of-concerns
  - modularity
  - maintainability
tags:
  - mcp
  - audit
---

# MCP Project Audit

This audit applies the ContextQB principles to an MCP server specifically.

## Use this as an agent instruction

> You are evaluating an MCP server's architectural quality. Read the server source, the content it exposes, and any integration documentation.
>
> Produce a Markdown document with these sections:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **Resource model.** List every URI exposed. Evaluate the scheme for consistency. For each resource kind, list the metadata fields.
> 3. **Tool surface.** List every tool. For each: purpose, inputs, output format. Flag tools that do more than one thing.
> 4. **Content boundary.** Is content cleanly separated from server logic? Quote any place server code contains hard-coded content, or content packages contain logic.
> 5. **Versioning and stability.** Is each resource versioned? Is the server itself versioned? What is the deprecation story?
> 6. **Integration story.** Are there working configurations for at least one MCP-aware tool (Cursor, Claude Desktop)? Try them in your head: do they reference files that exist?
> 7. **Findings.** Ordered by severity.
> 8. **Recommendations.** Ordered by impact and risk.
>
> Be specific. Quote code and URIs. Do not write code.
