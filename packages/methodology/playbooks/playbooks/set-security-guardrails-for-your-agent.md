---
id: set-security-guardrails-for-your-agent
title: Set Security Guardrails for Your Agent
summary: Set your agent tool's permission controls first, then write a security section in your AGENTS.md that explicitly bounds what your agent can do — which files it can edit, which commands it can run, which secrets it can read, which integrations it can call.
version: 0.2.0
problem: |
  Agents inherit whatever privileges the environment hands them. Without an explicit security section in AGENTS.md, you've consented to "anything the host shell allows."
when_to_use: |
  Before letting an agent touch any project beyond toy scope, and any time the agent's capabilities expand.
expected_outputs:
  - Your agent tool's permission, approval and sandbox settings configured so destructive and secret-reading actions are blocked or need your approval.
  - An AGENTS.md "Security boundaries" section that explicitly enumerates allow/deny rules and lists your public surfaces and outside services.
  - A short paste-ready template the reader can adapt.
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 1
journey_rank: 50
related_principles:
  - ai-output-is-untrusted-code
  - least-privilege-for-agents
tags:
  - security
  - agents
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-06 renewal fast-track repair (0.2.0; author self-checked; independent review pending; not operator-accepted): replaced the template's unsupported context.qb.yaml security.public / security.third_party instructions with an AGENTS.md-resident 'Public surfaces and outside services' list; added the tool-settings enforcement layer; verification now checks that the tool blocks or prompts, using a harmless test action. Earlier notes describe 0.1.1: R3–R7 pass; template + verification step are excellent. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
related:
  - choosing-your-ide-and-llm
  - map-your-attack-surface
  - review-your-ai-integration
  - set-up-agents-md
---

# Set Security Guardrails for Your Agent

**Plain language:** Your `AGENTS.md` is the rule book your assistant reads first. If it doesn't have a security section, the rule is "anything goes."

## When to use this

- Before letting a coding agent or AI-enabled editor touch any project beyond toy scope
- Right after running [`map-your-attack-surface`](contextqb://playbooks/map-your-attack-surface) or [`review-your-ai-integration`](contextqb://playbooks/review-your-ai-integration) so you know what you're guarding
- When your agent's capability set expands (new MCP server, new tool, new credentials)
- After a near-miss — the agent did or almost did something destructive

## What you'll produce

Two things, in this order:

1. **Your agent tool's own permission settings**, configured so the risky actions in this playbook are blocked or need your approval.
2. A **"Security boundaries for this agent"** section in your project's `AGENTS.md`. It explicitly enumerates:
   - Files and directories the agent can / cannot edit
   - Commands the agent can / cannot run
   - Secrets the agent can / cannot read
   - Integrations the agent can / cannot call
   - Per-session allowances (things normally denied that are unlocked for a specific session)
   - Your public surfaces and outside services, in a short list the agent keeps current

The block is short, paste-ready, and lives at the top of `AGENTS.md` so the agent reads it before any task instructions.

## Two layers: settings enforce, `AGENTS.md` explains

An `AGENTS.md` rule is an instruction the agent reads and usually follows. It is not a lock. A model can misread it, a long session can push it out of view, and text the agent reads from a web page or file can try to argue it away (prompt injection). The lock is your agent tool's own controls. Most coding agents and AI-enabled editors offer some of these; their names, defaults and coverage vary by tool and version, so check your tool's documentation:

- **Approval prompts** — the tool asks you before it runs a shell command, edits files or calls an outside tool.
- **Allow and deny lists** — commands, paths or tools that are always permitted or always refused.
- **Sandboxing** — the agent runs with limited access to files or the network, so a mistake cannot reach beyond the project.
- **Read-only or planning modes** — the agent can look and propose, but not change anything.

Set those controls first, so that delete, deploy, charge, send and secret-reading actions are blocked or need your approval. Then write the `AGENTS.md` section so the agent knows the rules, the reasons and how to ask. You need both: settings without the section leave the agent guessing why it was blocked; the section without settings is a request, not a boundary.

## Before you start

You'll need:

- An existing `AGENTS.md` at the root of your project. If you don't have one, run [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md) first.
- If your project is already live or has outside integrations: a current attack-surface inventory (from `map-your-attack-surface`) or AI surface document (from `review-your-ai-integration`) so you know what you're protecting. On a brand-new project you can start without one — the list in the template begins empty and grows as you add surfaces.
- Knowledge of which agent tool(s) actually run in this repo, and where each one's permission settings live. Different tools enforce different things; the section and the settings need to match the tool you actually use.

## Steps

### Step 1 — Identify the agent's current capability set

For each agent that operates in this repo, list what it can do today — and which permission mode it runs in (for example: asks before every command, asks only for some, or runs without asking):

- File reads
- File writes
- Shell execution
- Network requests
- Database access
- Secret reads
- Deployments
- External integration calls (payment, sign-in, email or other outside services)

If you don't know, ask the agent to enumerate its tools, and check the tool's settings screen or configuration file for the permission mode. The agent's own description is a starting point; the settings are the record.

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

### Step 4 — Set the enforcement layer in your tool

Using your tool's documentation, configure its permission, approval and sandbox settings to match your Step 2 decisions:

- Anything marked **Denied** is refused by the tool, not just discouraged in writing.
- Anything marked **Required with confirmation** or **Per-session unlock** makes the tool ask you first.
- Secret-bearing files and paths are outside what the agent can read, where your tool supports that.

If your tool cannot enforce a rule you need, note that next to the rule when you adapt the template, and treat that action as one you watch yourself.

### Step 5 — Paste the template (below) and adapt it

Use the template at the end of this playbook as a starting point. Adapt:

- Replace generic capabilities with the specific tools your agent has
- Add project-specific files / directories that are off-limits
- Add the per-session unlocks you decided in Step 3
- Fill in the "Public surfaces and outside services" list: one line per public endpoint (method and path, who can call it, why it is public) and one per outside service (its role, what data it receives, which secret it uses). Leave "none yet" if there are none.

Do not add a `security:` section to `context.qb.yaml`. A structured security section is planned on the format roadmap, but it has not shipped: the published schema does not allow it, so schema validators reject the file. Until it ships, this list in `AGENTS.md` is the record.

### Step 6 — Place the block at the top of `AGENTS.md`

The security boundaries section must appear before task instructions, so the agent reads it as setup, not as an aside. The natural location is right after the project intro and before the "How to work in this repo" section.

### Step 7 — Reference it from the operating instructions

In the body of `AGENTS.md`, add a sentence like:

> Before acting on any task, confirm the action against the "Security boundaries for this agent" section. If you are about to take an action that section forbids or requires confirmation for, stop and ask.

This is what turns a rule book into operating behaviour.

### Step 8 — Verify the tool enforces it and the agent honours it

Use a harmless test. Create a scratch file such as `guardrail-test.txt`, start a fresh session, and ask the agent to delete it — or to run a deploy command in a project where nothing is set up to deploy.

1. **Check the tool first.** It should block the action or ask for your approval before anything happens. Decline the approval.
2. **Then check the agent.** It should name the security section and ask, rather than look for a way around it.

A refusal from the agent alone is sampled behaviour — it chose not to this time — not a boundary. If the tool let the action through without asking, fix the settings (Step 4) before you trust the guardrails. If the agent did not mention the section, check that `AGENTS.md` is being read (see [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md)).

## The paste-ready template

```markdown
## Security boundaries for this agent

These rules state intent. My agent tool's permission, approval and sandbox
settings are what enforce them, and they are set to match this list.

- DO NOT read or write secrets (anything in .env, .env.local, or matching common
  secret patterns) without explicit permission per session.
- DO NOT run shell commands that delete files, modify git history, or change
  global configuration without explicit confirmation.
- DO NOT deploy to production without explicit confirmation.
- DO NOT add a new public endpoint or connect a new outside service without
  adding it to "Public surfaces and outside services" below and telling me.

If a task seems to require any of the above, ask first and explain why.

### Public surfaces and outside services

- Public endpoints: none yet. (One line each: method and path, who can call
  it, why it is public.)
- Outside services: none yet. (One line each: the service's role, what data
  it receives, which secret it uses.)
```

The canonical copy of this block, with adaptation notes, lives at [`packages/qb/examples/agents-md-security-block.md`](../../../qb/examples/agents-md-security-block.md) for direct reuse.

## Common mistakes

- **Aspirational rules.** Writing "the agent never reads secrets" when in practice every session needs to. The agent will ignore aspirational rules; write what's true.
- **Vague nouns.** "Don't touch important files" is meaningless. "Don't touch `apps/web/.env` or anything under `secrets/`" is enforceable.
- **No per-session escape hatch.** If the only options are "deny" and "always allowed", legitimate tasks become impossible and the user starts disabling the section.
- **Rules with no settings behind them.** The section says "ask before deploying" but the tool is set to run commands without asking. Writing the rule is half the job; Step 4 is the other half.
- **The section is at the bottom of `AGENTS.md`.** The agent reads top-down; the section must be load-bearing, which means early.
- **You never tested it.** A guardrail you didn't test is a guardrail you don't have — and a test that only checks the agent's answer misses whether the tool would have stopped it.

## What "good enough" looks like

Your guardrails are good enough when:

- [ ] Your agent tool's settings block or require approval for delete, deploy, charge, send and secret-reading actions
- [ ] Every destructive capability is named (delete, deploy, charge, send, drop)
- [ ] Every secret-bearing file or pattern is named
- [ ] Per-session unlocks have a documented grant mechanism
- [ ] The section is at the top of `AGENTS.md`, before task instructions
- [ ] The body of `AGENTS.md` references it from the operating instructions
- [ ] The "Public surfaces and outside services" list is present ("none yet" counts) and current
- [ ] In a test session with a harmless action, the tool blocked or asked, and the agent named the section

## When to do this again

- Whenever your agent gets a new tool, or you switch or update the agent tool (its settings may change)
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
