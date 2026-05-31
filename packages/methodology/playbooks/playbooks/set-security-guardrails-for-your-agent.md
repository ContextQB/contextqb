---
id: set-security-guardrails-for-your-agent
title: Set Security Guardrails for Your Agent
summary: Write a security-aware section in your AGENTS.md that explicitly bounds what your agent can do — which files it can edit, which commands it can run, which secrets it can read, which integrations it can call.
version: 0.1.0
problem: |
  Agents inherit whatever privileges the environment hands them. Without an explicit security section in AGENTS.md, you've consented to "anything the host shell allows."
when_to_use: |
  Before letting an agent touch any project beyond toy scope, and any time the agent's capabilities expand.
expected_outputs:
  - An AGENTS.md "Security boundaries" section that explicitly enumerates allow/deny rules.
  - A short paste-ready template the reader can adapt.
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 1
journey_rank: 50
related_principles:
  - least-privilege-for-agents
  - ai-output-is-untrusted-code
tags:
  - security
  - agents
---

# Set Security Guardrails for Your Agent

**Plain language:** Your `AGENTS.md` is the rule book your assistant reads first. If it doesn't have a security section, the rule is "anything goes."

## When to use this

- Before letting an agent (Cursor, Claude Code, Copilot, etc.) touch any project beyond toy scope
- Right after running [`map-your-attack-surface`](contextqb://playbooks/map-your-attack-surface) or [`review-your-ai-integration`](contextqb://playbooks/review-your-ai-integration) so you know what you're guarding
- When your agent's capability set expands (new MCP server, new tool, new credentials)
- After a near-miss — the agent did or almost did something destructive

## What you'll produce

A **"Security boundaries for this agent"** section in your project's `AGENTS.md`. It explicitly enumerates:

- Files and directories the agent can / cannot edit
- Commands the agent can / cannot run
- Secrets the agent can / cannot read
- Integrations the agent can / cannot call
- Per-session allowances (things normally denied that are unlocked for a specific session)

The block is short, paste-ready, and lives at the top of `AGENTS.md` so the agent reads it before any task instructions.

## Before you start

You'll need:

- An existing `AGENTS.md` at the root of your project. If you don't have one, run [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md) first.
- A current attack-surface inventory (from `map-your-attack-surface`) or AI surface document (from `review-your-ai-integration`) so you know what you're protecting.
- Knowledge of which agent(s) actually run in this repo — Cursor, Claude Code, Copilot, an MCP-using IDE, etc. Different agents respect different rules; the section needs to be written for the one you actually use.

## Steps

### Step 1 — Identify the agent's current capability set

For each agent that operates in this repo, list what it can do today:

- File reads
- File writes
- Shell execution
- Network requests
- Database access
- Secret reads
- Deployments
- External integration calls (Stripe, Clerk, etc.)

If you don't know, ask the agent to enumerate its tools. Most agents will list them when asked.

### Step 2 — For each capability, decide the rule

For each, pick one:

- **Required** — the agent needs this for ordinary work
- **Required with confirmation** — allowed, but every invocation requires explicit user approval
- **Per-session unlock** — denied by default; allowed only when the user explicitly grants it for this session
- **Denied** — the agent must not do this; if it tries, it should stop and ask

The default for anything that can destroy, deploy, charge, or send is **per-session unlock** or **denied**. Read-only operations can usually be **required**.

### Step 3 — Identify per-session allowances

Some tasks legitimately need broader privileges. Examples:

- "This session is allowed to deploy" (for a release task)
- "This session is allowed to read `.env`" (for a config debugging task)
- "This session is allowed to modify `package.json`" (for a dependency update)

Decide which capabilities you sometimes unlock per session. The section will name them and how to grant them.

### Step 4 — Paste the template (below) and adapt it

Use the template at the end of this playbook as a starting point. Adapt:

- Replace generic capabilities with the specific tools your agent has
- Add project-specific files / directories that are off-limits
- Add the per-session unlocks you decided in Step 3
- Reference your `context.qb.yaml`'s `security:` section once it ships (currently planned on the qb roadmap)

### Step 5 — Place the block at the top of `AGENTS.md`

The security boundaries section must appear before task instructions, so the agent reads it as setup, not as an aside. The natural location is right after the project intro and before the "How to work in this repo" section.

### Step 6 — Reference it from the operating instructions

In the body of `AGENTS.md`, add a sentence like:

> Before acting on any task, confirm the action against the "Security boundaries for this agent" section. If you are about to take an action that section forbids or requires confirmation for, stop and ask.

This is what turns a rule book into operating behaviour.

### Step 7 — Verify the agent honours it

Start a fresh session. Ask the agent to do something the section forbids (e.g., "delete the .env file"). Confirm it refuses and cites the section. If it doesn't, the agent isn't reading `AGENTS.md` correctly — fix that before you trust the guardrails.

## The paste-ready template

```markdown
## Security boundaries for this agent

- DO NOT read or write secrets (anything in .env, .env.local, or matching common
  secret patterns) without explicit permission per session.
- DO NOT run shell commands that delete files, modify git history, or change
  global configuration without explicit confirmation.
- DO NOT deploy to production without explicit confirmation.
- DO NOT add new public endpoints without updating `context.qb.yaml`'s
  `security.public` section.
- DO NOT add new third-party integrations without recording them in
  `context.qb.yaml`'s `security.third_party` section.

If a task seems to require any of the above, ask first and explain why.
```

A standalone copy of this block lives at [`packages/qb/examples/agents-md-security-block.md`](../../../qb/examples/agents-md-security-block.md) for direct reuse.

## Common mistakes

- **Aspirational rules.** Writing "the agent never reads secrets" when in practice every session needs to. The agent will ignore aspirational rules; write what's true.
- **Vague nouns.** "Don't touch important files" is meaningless. "Don't touch `apps/web/.env` or anything under `secrets/`" is enforceable.
- **No per-session escape hatch.** If the only options are "deny" and "always allowed", legitimate tasks become impossible and the user starts disabling the section.
- **The section is at the bottom of `AGENTS.md`.** The agent reads top-down; the section must be load-bearing, which means early.
- **You never verified the agent reads it.** A guardrail you didn't test is a guardrail you don't have.

## What "good enough" looks like

Your security boundaries section is good enough when:

- [ ] Every destructive capability is named (delete, deploy, charge, send, drop)
- [ ] Every secret-bearing file or pattern is named
- [ ] Per-session unlocks have a documented grant mechanism
- [ ] The section is at the top of `AGENTS.md`, before task instructions
- [ ] The body of `AGENTS.md` references it from the operating instructions
- [ ] You've verified the agent refuses to violate it in a test session

## When to do this again

- Whenever your agent gets a new tool
- Whenever you add a new MCP server
- Whenever a new sensitive surface ships (a new public endpoint, a new admin route, a new integration)
- After a near-miss
- Quarterly, as part of security hygiene

## See also

- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents)
- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code)
- [Playbook: Set Up Agents.md](contextqb://playbooks/set-up-agents-md) — the prerequisite `AGENTS.md` foundation
- [Playbook: Review Your AI Integration](contextqb://playbooks/review-your-ai-integration) — produces the capability inventory this playbook bounds
- [`packages/qb/examples/agents-md-security-block.md`](../../../qb/examples/agents-md-security-block.md) — standalone copy of the template
