---
id: ai-integration-security
title: AI Integration Security Audit
summary: A focused audit of every AI/LLM integration in the application — prompt injection surface, tool execution, autonomous loops, data leakage, cross-session contamination.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
objective: |
  For each AI integration, enumerate the trust surface and identify realistic abuse paths. Produce findings the builder can act on without deep ML expertise.
scope: |
  Every LLM call, every agent, every retrieval pipeline, every place AI output influences behaviour. Out of scope: non-AI authentication, payments, generic web vulnerabilities — those go to the Application Security Baseline audit.
required_sections:
  - Executive summary
  - AI integration inventory
  - Per-integration analysis
  - Prompt injection surface
  - Tool execution analysis
  - Data leakage analysis
  - Cross-session contamination analysis
  - Critical findings
  - High-risk findings
  - Medium-risk findings
  - Unknowns and assumptions
  - What I would attack first
  - Remediation roadmap
evaluation_criteria:
  - Every AI integration has been enumerated and analysed individually.
  - Untrusted-input paths into each integration are explicit.
  - Tool execution risks are assessed by blast radius, not just presence.
  - Data leakage paths (logs, telemetry, embeddings, cross-session) are checked.
  - Findings are prioritised by realistic exploitability, not novelty.
deliverables:
  - A single Markdown document with all required sections.
  - A prioritised list of findings with severity ratings.
  - A remediation roadmap with clear next actions.
related:
  - ai-output-is-untrusted-code
  - least-privilege-for-agents
  - trust-boundaries-are-architecture
tags:
  - security
  - ai-safety
---

# AI Integration Security Audit

This is the focused security audit for the AI surface of an application. Run it alongside the [Application Security Baseline Audit](contextqb://audits/application-security-baseline) — that one covers the application generally; this one goes deep on the AI integrations specifically.

Designed to be executed by an AI agent against your codebase. The output is a Markdown report a non-developer can read and act on.

## Use this as an agent instruction

> You are performing a focused security audit of the AI / LLM / agent integrations in this application.
>
> Your task is NOT generic AI security advice. Your task is to:
>
> 1. Inventory every AI integration in the codebase
> 2. Analyse each for prompt injection surface, tool execution risk, and data leakage
> 3. Look specifically for cross-session contamination and autonomous-loop risks
> 4. Produce prioritised, actionable findings
>
> Operate like a security engineer who specialises in agentic systems. Be skeptical of trust assumptions, especially the assumption that AI output is "just suggestions."

---

## Phase 1 — AI integration inventory

First, find every place an LLM is called. Do NOT assume — search the codebase for:

- Direct API calls to OpenAI, Anthropic, Google, Mistral, Cohere, etc.
- LangChain, LlamaIndex, AI SDK, Vercel AI usage
- MCP server definitions (incoming or outgoing)
- Embedding generation
- Retrieval pipelines / vector store reads
- Agent loops (agents that can call tools)
- Browser-side AI usage (Web LLM, Transformers.js, etc.)
- Background jobs that invoke models (summarisation, classification, generation)

For each, document:

| Integration | Where it lives | Nominal purpose | Model |
| ----------- | -------------- | --------------- | ----- |
| ...         | ...            | ...             | ...   |

If the list is shorter than you expected, search harder. AI integrations are easy to miss in larger codebases.

---

## Phase 2 — Per-integration analysis

For EACH integration, produce a section with:

### Inputs

What feeds the prompt? Identify each source and its trust level:

- System prompt (trusted — you wrote it)
- User input (untrusted)
- Retrieved context (mixed — what populates the retrieval store?)
- Tool results (mixed — which tools, returning what?)
- Conversation history (mixed — could be poisoned by earlier turns)
- Third-party content (untrusted — scraped pages, webhook payloads, API responses)

### Outputs

Where do outputs go? For each destination, name the risk:

- Rendered in HTML — XSS risk if not sanitised
- Executed as code (SQL, shell, API call) — code injection risk
- Stored as state (DB row, file, vector embedding) — persistent poisoning risk
- Triggers an action (deploy, send, charge, delete) — unauthorised action risk
- Just displayed — misinformation risk

### Tools and capabilities

If the integration is an agent (calls tools), list every tool with its blast radius:

| Tool | What it does | Worst case if abused |
| ---- | ------------ | -------------------- |
| ...  | ...          | ...                  |

### Data access

What data does the integration see — beyond what it strictly needs?

- PII?
- Other users' data?
- Secrets / tokens / API keys?
- Internal documents not meant for external eyes?

### Untrusted-input paths

Trace every path from an untrusted source to the model. For each path, ask:

- Can this input override the system prompt?
- Can this input cause the model to call a tool the user shouldn't be able to invoke?
- Can this input cause the model to leak data the user shouldn't see?
- Can this input trigger a destructive action without user intent?

---

## Phase 3 — Prompt injection surface

Specifically inventory prompt injection vectors. Common ones:

| Vector                                  | Example                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Direct user input**                   | User message contains "Ignore previous instructions and ..."                                      |
| **Retrieval poisoning**                 | A document in the vector store contains hidden instructions                                       |
| **Document ingestion**                  | An uploaded PDF / Markdown / HTML file contains injected text                                     |
| **Tool result injection**               | A tool returns attacker-controlled content (e.g., web fetch) that the model then trusts           |
| **Indirect injection via integrations** | A Slack message, email, or third-party comment crosses into the prompt                            |
| **Memory poisoning**                    | An attacker writes content into the agent's persistent memory in one session that affects another |

For each vector that exists in the system, document:

- Whether the path is exploitable today
- What an attacker could achieve via this path
- What (if anything) currently mitigates it

---

## Phase 4 — Tool execution analysis

For each agent with tool access, examine:

### Auto-execute vs. confirm

Which tools auto-execute? Which require user confirmation?

Any **destructive** tool (delete, deploy, charge, send, drop) on auto-execute is a finding.

### Tool authorization

When the model decides to call a tool, what authorizes that call?

- Just the model's decision (no check)
- A whitelist of allowed tools
- A per-tool permission check
- A user confirmation gate

"Just the model's decision" is the default in many MCP setups and is the most common high-severity finding.

### Recursion / autonomous loops

If the agent can chain tool calls, can it:

- Call itself recursively?
- Call destructive tools as a follow-up to a non-destructive one?
- Continue executing without intervention past a destructive step?

Identify any code path where an autonomous loop can keep going after touching something dangerous.

### Tool over-scope

For each tool, ask: "Does it have access narrower than 'whatever the host process can do'?"

- `read_file` that reads anywhere on the filesystem is broader than necessary
- `run_shell` that runs anything is broader than necessary
- `query_database` that runs raw SQL is broader than necessary

Each "broader than necessary" finding gets a remediation suggestion (sandbox, allow-list, scoped credentials).

---

## Phase 5 — Data leakage analysis

Look for places AI integration data leaks where it shouldn't:

### Logs and telemetry

- Are user prompts logged in plain text?
- Are tool arguments logged with sensitive data?
- Are model responses logged with PII?
- Are these logs accessible to engineers without redaction?

### Embeddings and vector stores

- What's in your vector store?
- Are different users' embeddings co-mingled in a single namespace?
- Can a query for one user return embeddings derived from another user's content?
- Are embeddings deletable when a user requests deletion (GDPR / SOC2)?

### Memory and context retention

- Does the model have persistent memory across sessions?
- Is that memory scoped per-user, or shared?
- Can a memory written in one session influence another user's session?
- Can users see what's in their memory?

### Third-party model providers

- What data leaves the system when you call the provider?
- Does the provider train on your data by default? (Some do; some explicit opt-out is required.)
- Is the API key scoped to only this project?

---

## Phase 6 — Cross-session contamination analysis

This is the AI-specific cousin of insecure-direct-object-reference. Specifically check:

- Can a user influence the AI's response to another user via shared context, memory, or retrieval?
- Can a malicious uploaded document poison the experience for everyone else who ingests the same retrieval set?
- Does conversation history persist in a place where another session could pull it in?
- Are agent-generated artifacts (summaries, classifications) trusted by downstream systems for other users?

If any of these are possible, the system has a cross-session contamination surface. Treat it as high-severity by default.

---

## Phase 7 — Adversarial review

Now think like an attacker who specifically targets AI systems. Ask:

- Where would I plant a prompt-injection payload that would be picked up by every retrieval?
- Which tool would I trick the agent into calling for me?
- Where would a small change in an uploaded document propagate the furthest?
- Which "harmless" integration has the largest blast radius?
- What's the chain of trust between user input and the model's most dangerous tool, and where in that chain could I intercept?

Document:

- **Most likely attack paths**
- **Highest-impact attack paths**
- **What I would attack first**

---

## Phase 8 — Severity classification

Use the same rubric as the [Application Security Baseline Audit](contextqb://audits/application-security-baseline):

- **Critical** — auth bypass via AI, code execution via injection, full database access via tool abuse, cross-user data exposure
- **High** — significant data leakage, privilege escalation via agent capability, persistent poisoning
- **Medium** — non-sensitive information disclosure, missing rate limiting on AI endpoints, logged secrets in non-public logs
- **Low** — best-practice violations with low impact

---

## Phase 9 — Output format

Produce a single Markdown document with these sections:

1. **Executive Summary** — 5–7 bullets a founder can read in 2 minutes
2. **AI Integration Inventory** — every integration found
3. **Per-Integration Analysis** — section per integration
4. **Prompt Injection Surface** — explicit vector inventory
5. **Tool Execution Analysis** — auto-execute, authorization, recursion, over-scope findings
6. **Data Leakage Analysis** — logs, embeddings, memory, providers
7. **Cross-Session Contamination Analysis** — shared-context risks
8. **Critical Findings** — fix immediately
9. **High-Risk Findings** — fix this week
10. **Medium-Risk Findings** — fix this month
11. **Unknowns and Assumptions** — what couldn't be verified
12. **What I Would Attack First** — honest adversarial answer
13. **Remediation Roadmap** — prioritised action list

---

## Important rules for the auditor

- Do NOT treat "the AI just suggests" as zero-trust. Suggestions become actions when users approve reflexively.
- Do NOT skip small integrations. An autocomplete that calls the LLM with user input is a real surface.
- Do NOT assume the system prompt protects against prompt injection — it is not a security control.
- Be specific about untrusted-input paths; "user input goes to the model" is not enough — trace which field reaches which prompt slot.
- Treat retrieval and memory as input sources, not as trusted context.
- Prioritise realistic exploitability over theoretical risks (e.g., "this integration is reachable by anonymous users and can call a destructive tool" beats "this model could in principle hallucinate").

---

## How to consume the output

1. **Critical findings:** stop and address before the next deploy. No exceptions.
2. **High-risk findings:** scheduled within the week. Add to the next sprint or the equivalent.
3. **Medium-risk findings:** open tickets, fix on a normal cadence.
4. **Update your AI surface document** (from [`review-your-ai-integration`](contextqb://playbooks/review-your-ai-integration)) with anything new the audit found.
5. **Save the report as your AI integration baseline.** When you re-run this audit (after a feature ships, quarterly), you'll compare against it to spot drift.

## See also

- [Playbook: Review Your AI Integration](contextqb://playbooks/review-your-ai-integration) — produces the inventory this audit drills into
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — the broader audit; pairs with this one
- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code)
- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents)
- [Prompt: Think Like an Attacker](contextqb://prompts/think-like-an-attacker)
- [Prompt: Security-Critical Code Review](contextqb://prompts/security-critical-code-review) — checklist-driven security review
- [Prompt: Suspicious Behavior Investigation](contextqb://prompts/suspicious-behavior-investigation) — investigate AI anomalies
