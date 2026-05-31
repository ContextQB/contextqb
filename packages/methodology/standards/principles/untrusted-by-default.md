---
id: untrusted-by-default
title: Untrusted by Default
summary: Every input, model output, third-party response, and webpage is hostile until proven otherwise. Validate at the boundary, not in the middle.
version: 0.1.0
category: security
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 5
journey_rank: 0
tags:
  - security
  - validation
  - trust-boundaries
related:
  - failure-modes
  - state-ownership
anti_patterns:
  - User input is passed directly to database queries without validation.
  - API responses are trusted without checking status codes or schema.
  - AI-generated content is rendered without sanitisation.
  - Third-party webhooks are processed without signature verification.
  - Form data is validated only on the client, not on the server.
agent_instructions:
  - Treat every external input as potentially malicious until validated.
  - Validate at the system boundary, not deep in the call stack.
  - For LLM outputs, validate structure and content before acting on them.
  - Never trust client-side validation alone; always re-validate server-side.
  - When in doubt, reject rather than accept.
---

# Untrusted by Default

**Plain language:** Assume everything coming from outside your system is trying to break it — user input, AI responses, webhooks, API data, everything. Check it at the door, not after it's already inside.

## What it is

Every piece of data that crosses into your system from outside — user input, model output, third-party API responses, webhook payloads, scraped content — is untrusted by default. You don't know who crafted it, what their intent was, or whether the source has been compromised.

This is not paranoia. This is the baseline security posture that every professional system assumes. The question is not "could this input be hostile?" The answer is always yes. The question is "have I validated this input before acting on it?"

## Why it matters in agentic dev specifically

When you build with an AI agent, the trust surface expands dramatically:

1. **The agent generates code.** That code might contain security flaws the agent doesn't recognise. Treat agent output the same way you'd treat code from an untrusted contributor — review it before it runs.

2. **The agent processes external data.** If your agent reads user input, scrapes a webpage, or calls an API, it's handling untrusted data. A prompt injection attack works by hiding malicious instructions in data the agent processes.

3. **The agent executes tools.** When an agent calls a database, sends an email, or modifies a file, it's acting on your behalf. If that action was triggered by untrusted input, the untrusted input just got system-level consequences.

4. **The agent trusts its own output.** Agents don't second-guess themselves. If an agent generates a SQL query, it will execute that query unless you stop it. The agent doesn't know the query is malicious; it just sees text.

In a traditional system, you validate user input at the API boundary. In an agentic system, you must also validate what the agent produces before you act on it.

## Minimum acceptable posture

You can claim this principle if you meet all of the following:

1. **Server-side validation on all user input.** Client-side validation is UX; server-side validation is security. Every form field, query parameter, and request body is validated on the server.

2. **Schema validation on external API responses.** Before you use data from a third party, confirm it has the structure you expect. An API that changes its response format should break validation, not corrupt your data.

3. **Signature verification on webhooks.** If a third party sends you a webhook, verify the signature. If there's no signature, that's a trust decision you need to make explicitly.

4. **Sanitisation before rendering.** Any content that came from outside — user-generated content, AI output, API data — is sanitised before it's rendered in HTML. This is how you prevent XSS.

5. **Review before execution.** If an agent generates code that modifies data, sends messages, or changes configuration, you (or an automated policy) review it before it executes.

## Signals you're getting this wrong

- **Your app crashes on malformed input.** If a weird JSON payload or an empty string causes an unhandled exception, you're not validating at the boundary.

- **Your database has unexpected data shapes.** If you query the database and find records with missing fields, wrong types, or impossible values, something got in without validation.

- **Users can inject content into your UI.** If user input or AI output appears in your app without being escaped, you've got an XSS vector.

- **You process webhooks from anyone.** If your webhook endpoint accepts requests without verifying their source, an attacker can forge webhook payloads and trigger actions in your system.

- **Your agent executes commands it generated.** If the agent writes shell commands or API calls and immediately executes them without confirmation, you've given untrusted input system access.

## How it relates to other ContextQB principles

**Failure Modes** — Hostile input is a failure mode. "Untrusted by Default" tells you to anticipate hostile input; "Failure Modes" tells you to design what happens when validation rejects it.

**State Ownership** — External data becomes your state only after validation. Before validation, it's foreign; after validation, you own it and its consequences.

**Trust Boundaries Are Architecture** — "Untrusted by Default" is the mental model. Trust boundaries are where you draw the line in code. Every validation check you write is a trust boundary.

## See also

- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code) — the operational corollary for agent-generated code
- [Principle: Trust Boundaries Are Architecture](contextqb://principles/trust-boundaries-are-architecture) — where the validation lives in code
- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — identifies where untrusted data enters your system
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — systematic review of your validation posture
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
