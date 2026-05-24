---
id: review-your-ai-integration
title: Review Your AI Integration
summary: For any agent or LLM call in your system, document what it reads, what it writes, what it can execute, what data it sees, and where untrusted input can influence it.
version: 0.1.0
problem: |
  AI integrations frequently expand in capability without anyone tracking the cumulative trust surface. By the time something goes wrong, no one can answer "what can this thing actually do?"
when_to_use: |
  Before shipping any feature that calls an LLM or hosts an agent, and quarterly thereafter.
expected_outputs:
  - A per-integration AI surface document listing read, write, and execute capabilities.
  - A list of untrusted-input paths that can influence each integration's behaviour.
  - A capability minimisation plan for anything overprivileged.
audience:
  - novice-builder
  - founder
  - operator
related_principles:
  - ai-output-is-untrusted-code
  - least-privilege-for-agents
  - trust-boundaries-are-architecture
tags:
  - security
  - ai-safety
---

# Review Your AI Integration

**Plain language:** Every AI integration is a tiny employee with the keys you handed it. This playbook is the job description — what it can do, what data it sees, what it can break.

## When to use this

- Before shipping any feature that calls an LLM or hosts an agent (chatbot, autocomplete, agentic assistant)
- Before adding a new tool to an MCP server you control
- Quarterly, as part of your security hygiene loop
- Any time your AI integration's capability set expands
- After reading [AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code) and realising you don't actually know what your agent can do

## What you'll produce

A per-integration **AI surface document** — one section per AI/LLM/agent in your system, each answering:

1. What does this integration do?
2. What inputs does it receive (from where)?
3. What outputs does it produce (and how are they used)?
4. What tools or APIs can it call?
5. What data can it see?
6. Where can untrusted input influence its behaviour?
7. What is the worst case if it misbehaves?

The artifact lives next to your attack surface inventory (from [`map-your-attack-surface`](contextqb://playbooks/map-your-attack-surface)). The two together describe your full agentic surface.

## Before you start

You'll need:

- A list of every AI/agent integration in your project (chatbots, autocomplete, agentic assistants, summarisation, embeddings, retrieval pipelines, copilots — anything that involves an LLM call)
- Your attack surface inventory from `map-your-attack-surface`, if you have one
- Access to the code that defines each integration (system prompts, tool definitions, input handling)

If you have an `AGENTS.md` or `context.qb.yaml`, pull them up — both will speed up discovery.

## Steps

### Step 1 — List every AI integration

Walk through your project (or ask your agent to) and list every place an LLM is called. Don't miss the small ones — auto-suggest features, summary generators, classification calls, embedding generators, and retrieval pipelines all count.

For each, write down:

| Integration            | Where it lives      | What it nominally does                       |
| ---------------------- | ------------------- | -------------------------------------------- |
| Support chatbot        | `/api/support/chat` | Answers user questions from a knowledge base |
| Email summariser       | Background job      | Summarises incoming support tickets          |
| Code-explanation popup | Browser extension   | Explains highlighted code to user            |
| Internal MCP server    | `apps/mcp`          | Exposes methodology content to agents        |

If the list is longer than you expected, that's the first finding. Keep going.

### Step 2 — Document inputs per integration

For each integration, list every source of input:

| Source                   | Example                                               | Trust level                 |
| ------------------------ | ----------------------------------------------------- | --------------------------- |
| **System prompt**        | Your own instructions to the model                    | Trusted (you wrote it)      |
| **User input**           | Whatever the user typed                               | Untrusted                   |
| **Retrieved context**    | Documents pulled from your DB / vector store / scrape | Mixed — depends on source   |
| **Tool results**         | Output of a tool the agent called                     | Mixed — depends on the tool |
| **Conversation history** | Previous turns in the same session                    | Mixed — could be poisoned   |

The line that matters: **anywhere untrusted input can land in the prompt is a prompt injection surface**. Mark each one explicitly.

### Step 3 — Document outputs per integration

For each integration, where do the outputs go?

| Output destination     | Example                                  | Risk                                      |
| ---------------------- | ---------------------------------------- | ----------------------------------------- |
| **Rendered in HTML**   | Chatbot reply shown in the UI            | XSS if not sanitised                      |
| **Executed as code**   | Generated query, shell command, API call | Code injection — high impact              |
| **Stored as state**    | Summary written to a DB row              | Persistent poisoning                      |
| **Triggers an action** | Output causes a deploy, send, charge     | Most dangerous — full unauthorised action |
| **Just displayed**     | Informational text the user reads        | Misinformation risk                       |

The destinations that **execute or trigger** are where the integration becomes a real attack surface.

### Step 4 — Inventory tools and APIs the integration can call

If the integration is an agent (calls tools, not just generates text), list every tool it can invoke:

| Tool             | What it does                    | Blast radius if abused                 |
| ---------------- | ------------------------------- | -------------------------------------- |
| `read_file`      | Reads a project file            | Information disclosure                 |
| `write_file`     | Writes / overwrites a file      | Code injection, secret exfiltration    |
| `run_shell`      | Runs an arbitrary shell command | Full system compromise                 |
| `query_database` | Reads from DB                   | Data exposure (depends on credentials) |
| `send_email`     | Sends email on behalf of org    | Social engineering, spam               |

If the agent has a tool you cannot justify against a current task, that's a finding.

### Step 5 — Document data access

Independent of tools, what data does the integration actually see?

- User PII? (names, emails, addresses)
- Other users' data? (cross-tenant exposure)
- Payment information?
- Secrets (API keys, tokens, env vars)?
- Internal documents not meant for users?

Write down what's in the prompt context, what's in the retrieval set, and what's accessible via tools.

### Step 6 — Identify untrusted-input paths

Now combine the above. For each integration, trace every path by which untrusted input (user, scraped content, third-party data) can reach the model:

```
User message → system prompt → model → tool call → DB
^ untrusted                                       ^ trusted, mutated
```

For each such path, ask:

- Can untrusted input override the system prompt? (prompt injection)
- Can it cause the model to call a tool the user shouldn't be able to invoke?
- Can it leak data the user shouldn't see?
- Can it cause a destructive action without user intent?

This is the heart of the review. Most findings live here.

### Step 7 — Mark each capability minimisable or required

For each tool, scope, and data access you've documented, decide:

- **Required** — the integration cannot do its job without this
- **Required but narrowable** — needed, but the scope is wider than necessary
- **One-off** — granted for a specific past task, never used since
- **Unjustified** — no current task needs this

Anything marked "narrowable", "one-off", or "unjustified" is a remediation candidate. Plan to remove or scope down.

### Step 8 — Write the worst-case for each integration

Finish each integration's section with a single sentence: **"If an attacker compromised this, the worst they could do is **\_\_\_**."**

This is the disciplined version of `think-like-an-attacker` applied to AI surfaces. If the worst case is "make the chatbot say something wrong", you can sleep. If the worst case is "drain the database", you cannot.

## Common mistakes

- **Treating "the AI just suggests" as zero-trust.** Suggestions become actions when the user reflexively approves. Suggestion is action.
- **Forgetting retrieval as an input.** If the agent reads from a vector store full of user-submitted content, every record is a prompt injection vector.
- **Mistaking system prompt for security.** "Do not reveal secrets" in the system prompt is a hope, not a control. Untrusted input can override system prompts; the model will sometimes comply.
- **Not separating user/agent boundary from user/admin.** An agent acting on behalf of a user inherits the user's privileges by default; that's often more than the agent should have for the task in front of it.
- **Skipping the small integrations.** A "harmless" autocomplete that calls the LLM with user input is still a prompt injection surface.

## What "good enough" looks like

Your AI surface document is good enough when:

- [ ] Every AI/LLM call in the system has a section
- [ ] Every section lists inputs, outputs, tools, and data access
- [ ] Every untrusted-input path is acknowledged
- [ ] Every capability is marked required, narrowable, one-off, or unjustified
- [ ] Every integration has a one-sentence worst-case
- [ ] You've removed or scoped at least the unjustified ones

## When to do this again

- Whenever a new AI integration ships
- Whenever an existing integration gets a new tool
- Whenever the system prompt materially changes
- Quarterly, regardless of changes — capability accretion is silent
- Right after a near-miss (the agent did something it shouldn't have, or almost did)

## See also

- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code)
- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents)
- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — sibling playbook covering the non-AI surface
- [Playbook: Set Security Guardrails for Your Agent](contextqb://playbooks/set-security-guardrails-for-your-agent) — translates this review into AGENTS.md rules
- [Prompt: Security-Critical Code Review](contextqb://prompts/security-critical-code-review) — review agent-generated code for security issues
- [Audit: AI Integration Security](contextqb://audits/ai-integration-security) — agent-runnable audit of the AI surface
