---
id: least-privilege-for-agents
title: Least Privilege for Agents
summary: Give the agent only the tools, scopes, and data it needs for the current task. Default to denying tool access; expand explicitly. Most security failures in agentic systems come from agents that had more capability than the task required.
version: 0.1.0
category: security
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 5
journey_rank: 40
tags:
  - security
  - agents
  - capability
related:
  - state-ownership
  - orchestration
  - ai-output-is-untrusted-code
anti_patterns:
  - One MCP server exposes a single "do_anything" tool the agent always calls.
  - The agent has filesystem write access to the entire repo, including .env and secrets.
  - Shell commands run without confirmation because "the agent needs to be productive."
  - Tools added for a one-off task are never removed.
  - A production agent and a development agent share the same credentials and scopes.
agent_instructions:
  - Before requesting a tool, justify it against the current task.
  - If a task can be completed read-only, do not ask for write access.
  - If a task can be completed in a scratch directory, do not touch the rest of the repo.
  - If you need a new capability, name it explicitly and request it; do not assume it.
  - When unsure whether you have a capability, ask before attempting it.
---

# Least Privilege for Agents

**Plain language:** If your assistant doesn't need keys to the whole building, don't give them keys to the whole building.

## What it is

Least privilege is the rule that any actor — human, service, or agent — gets exactly the capabilities it needs for the task in front of it, and nothing more. The default is deny; access is granted explicitly, named explicitly, and revoked when the task is done.

Applied to agents, it has four facets:

| Facet      | The question                                                              |
| ---------- | ------------------------------------------------------------------------- |
| **Tools**  | Which functions can the agent invoke? (read_file, run_shell, deploy, ...) |
| **Scope**  | Within each tool, how much can it touch? (this directory, this DB row)    |
| **Data**   | Which records, secrets, or files can it see?                              |
| **Effect** | Which mutations can it cause? (read-only? write? destructive?)            |

A capable agent with narrow privileges is a productive collaborator. A capable agent with broad privileges is a single command from a disaster. The capability is not the problem; the breadth is.

## Why it matters in agentic dev specifically

Almost every notable agentic-coding incident reported in the wild has the same shape: an agent with more capability than the task required, acting on a confused or compromised instruction. The fix in every case is not "smarter agent." It's "smaller scope."

Three specific dynamics amplify this in agentic dev:

1. **Capability is cheap to grant and expensive to revoke.** You wired up shell access for one debugging session. Six months later it's still there, and you don't remember which session needed it. Privileges accumulate.

2. **Blast radius math is non-obvious.** Capability × autonomy = risk. An agent that can edit any file is bounded by how much it edits. An agent that can edit any file AND auto-execute its edits has no bound at all. Both inputs are easy to expand individually without noticing what the product is.

3. **Prompt injection turns broad privileges into a weapon.** A poisoned webpage, a malicious file in a retrieval set, or a crafted issue comment can hijack an agent's behaviour. If that agent can only read, the worst case is misinformation. If it can write, deploy, or run shell, the worst case is unbounded.

The defence is the same one humans use: scope down. Give the agent the smallest set of tools and the narrowest scope per tool that gets the task done. Expand explicitly when needed.

## Minimum acceptable posture

You can claim this principle if all of the following hold:

1. **The agent's tool list is finite and enumerated.** You can list every tool the agent can call. "Whatever Cursor offers" is not a list.

2. **Destructive tools are gated.** Delete, deploy, drop, and send all require explicit per-call confirmation. The user clicks an approval, or a policy explicitly allows it.

3. **No ambient access to secrets.** The agent does not have unscoped access to `.env`, the production database, or your cloud account. Specific tasks may grant specific scopes, but the default is no.

4. **Per-environment separation.** Your development agent has development credentials. Your production agent (if any) has separate, narrower credentials. They do not share.

5. **Capabilities are revisited.** At least quarterly, you re-read your agent's capability set and remove the ones the agent didn't actually use.

## Signals you're getting this wrong

- **The agent surprised you.** It did something correct but unexpected — and on inspection, you realise it had a capability you didn't know about.

- **Shell is the default.** Every problem becomes "let me run a quick command." The agent is operating as a shell user rather than a tool user.

- **You can't list the tools.** Asked what the agent can do, you describe vibes ("it can mostly do stuff in this repo") rather than naming tools.

- **One MCP server exposes everything.** A single tool with `command: string` lets the agent run arbitrary code; you've replaced fine-grained tools with a generic shell.

- **Old approvals stick around.** A capability was granted for a single session and never revoked.

## How it relates to other ContextQB principles

**State Ownership** — Every privilege is the right to mutate some piece of state. If the agent owns the privilege but the user owns the consequences, that's a mismatch. Privilege scope and state ownership should align.

**Orchestration** — Orchestration decides what coordinates what. Privilege decides what each part is allowed to do. They're the same question viewed from different angles — and the agent sits in the middle of both.

**AI Output Is Untrusted Code** — If you've internalised that agent output is untrusted, the natural follow-up is "well then, what is it allowed to do?" Least privilege is the answer.

## See also

- [Playbook: Set Security Guardrails for Your Agent](contextqb://playbooks/set-security-guardrails-for-your-agent) — write the AGENTS.md block that codifies this
- [Playbook: Review Your AI Integration](contextqb://playbooks/review-your-ai-integration) — inventory current capabilities and minimise
- [Playbook: Triage Your Secrets](contextqb://playbooks/triage-your-secrets) — ensure agents have scoped credentials
- [Audit: AI Integration Security](contextqb://audits/ai-integration-security) — adversarial check on agent privileges
- [Audit: Secrets & Credentials](contextqb://audits/secrets-and-credentials) — verify secret scope and access
- [Principle: Untrusted by Default](contextqb://principles/untrusted-by-default)
