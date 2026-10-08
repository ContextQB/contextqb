---
id: mcp-project
title: MCP Project Audit
summary: An audit template for evaluating the design and quality of an MCP server — resource model, tool surface, content boundary, and integration story.
version: 0.2.3
audience:
  - developer
  - agent
journey_stage: 4
journey_rank: 40
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
  - Trust and security (access policy and actual exposure, authentication and authorization, tool privileges, untrusted outputs, secrets, transports)
  - Findings
  - Recommendations
evaluation_criteria:
  - URI scheme is consistent and addressable.
  - Tools have clear, single purposes and structured outputs.
  - Content is cleanly separated from server logic.
  - Versioning is explicit, both per-resource and per-server.
  - Integration instructions are validated mechanically, and in one real MCP-aware client where the operator permits it.
  - The server has an explicit access policy — which resources and tools are intentionally public and read-only, and which data or actions are protected — and its actual exposure matches it; anything anonymous is intentionally public and read-only, and protected data and actions require authentication and authorization. Tools have the least privilege their job needs, tool outputs are treated as untrusted content, and no secret appears in committed client configuration.
deliverables:
  - A single Markdown document with the required sections.
related:
  - ai-integration-security
  - least-privilege-for-agents
  - mcp-vs-paste
  - separation-of-concerns
  - modularity
  - maintainability
  - build-mcp-for-project-context
  - skills-mcp-and-agents-md
tags:
  - mcp
  - audit
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.4 (agent)"
  reviewer_notes: "2026-10-07 renewal B7 clarification (0.2.3; author self-checked; independent review pending; not operator-accepted): when no access policy is written, a policy inferred from the code is only an unconfirmed hypothesis — the missing operator intent is recorded as a finding and the access decision stays UNKNOWN until the operator confirms it, so the implementation is not checked against itself. 2026-10-07 renewal B6 reciprocal links (0.2.2; author self-checked; independent review pending; not operator-accepted): related adds build-mcp-for-project-context and skills-mcp-and-agents-md, which now link here; body unchanged. 2026-10-07 renewal B5 review correction (0.2.1; author self-checked; independent review pending; not operator-accepted): the trust criterion no longer requires authentication for every remote server; it requires an explicit access policy (intentionally public read-only resources may be anonymous; protected data and actions need authentication and authorization) and checks actual exposure and privileges against it, with unauthenticated access tests only where the operator authorizes them; criterion and body agree. 2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): adds a Trust and security section (an MCP server is code an agent trusts: authentication for remote servers, least-privilege tools, tool outputs as untrusted content, secrets kept out of committed client configuration, supported transports and how authorization differs), linked to the AI integration security audit and least-privilege principle, with fuller security treatment left to the security stage; 'try them in your head' becomes mechanical validation (parse, resolve paths, and connect one real client and list tools only where the operator permits); the named clients become 'at least one current MCP-aware client' with the dated client reference, which records each client's documented shape without claiming they all agree; asks for a reviewer that did not build the server; reciprocal link with mcp-vs-paste. Earlier notes (2026-09-09 epistemology review): R3–R7 pass. R8 pending P4."
---

# MCP Project Audit

This audit applies the ContextQB principles to an MCP server specifically.

## Use this as an agent instruction

> You are evaluating an MCP server's architectural quality. Read the server source, the content it exposes, and any integration documentation.
>
> Produce a Markdown document with these sections, in order:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **Resource model.** List every URI exposed. Evaluate the scheme for consistency. For each resource kind, list the metadata fields.
> 3. **Tool surface.** List every tool. For each: purpose, inputs, output format. Flag tools that do more than one thing.
> 4. **Content boundary.** Is content cleanly separated from server logic? Quote any place server code contains hard-coded content, or content packages contain logic.
> 5. **Versioning and stability.** Is each resource versioned? Is the server itself versioned? What is the deprecation story?
> 6. **Integration story.** Are there configurations for at least one current MCP-aware client? Validate each one mechanically: parse it, confirm every file path it references exists, and confirm it uses the client's documented shape. Only if the operator permits it, install one configuration in one real client — with a test or anonymous setup, never a personal token — start the server and list its tools; record what you ran and what you saw. Otherwise mark that check "not run".
> 7. **Trust and security.** An MCP server is code an agent trusts, and its outputs land in the agent's context. First, find or ask for the server's access policy: which resources and tools are intentionally public and read-only (these may be anonymous), and which data or actions are protected (these need authentication and authorization). If there is no written policy, report the missing operator intent as a finding and ask for it. You may describe the policy the code appears to implement, but label it an unconfirmed hypothesis: it shows what the server does, not what it is meant to do, so it cannot show that the observed exposure is intended. Mark each access decision UNKNOWN until the operator confirms the intended policy. Then check the actual exposure against it: what an unauthenticated caller can reach, which is evidence from reading the code unless the operator authorizes a test request against a local or test server; which transports the server supports and how authorization differs between them; whether each tool has only the access its job needs (read-only where possible); whether tool outputs that include outside content are treated as untrusted rather than as instructions; and whether any secret or token appears in committed configuration or examples. This is a first pass, not a full security review.
> 8. **Findings.** Ordered by severity.
> 9. **Recommendations.** Ordered by impact and risk.
>
> Be specific. Quote code and URIs. Do not write code.

**Before you run it.** Use a session that did not build the server — a fresh session, a second agent, or a person — and give it the project instructions, the project map, and the server code. A different model can add variety; it does not by itself make the audit independent.

**Where the facts live.** Client configuration shapes differ by client and change over time; the dated [MCP client reference](contextqb://references/setup#mcp-clients) records each client's documented shape, and the [transports and authorization reference](contextqb://references/setup#mcp-transports-auth) records the protocol's transports. For the security side in depth, use the [AI integration security audit](contextqb://audits/ai-integration-security) and the [least privilege for agents](contextqb://principles/least-privilege-for-agents) principle. Whether to run an MCP server at all, rather than a file in the repository, is covered in [MCP vs. pasting context](contextqb://briefings/mcp-vs-paste).
