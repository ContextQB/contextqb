---
id: set-up-agents-md
title: Set Up AGENTS.md for Your Project
summary: How to author the single most leverage-positive file in an agentic codebase — the project-level operating instructions that every agent should read first.
version: 0.2.1
problem: |
  Without AGENTS.md, every agent session starts from guesses. Whatever the tool remembers on its own is partial; the agent invents the architecture, guesses at naming, and produces inconsistent output session to session. The cost is paid continuously.
when_to_use: |
  At the very start of a new project, immediately after the repository is initialized. Also: when you take over an existing project that does not have one.
expected_outputs:
  - A single AGENTS.md file at the repo root.
  - Sections covering project, security boundaries, package boundaries, naming, state, orchestration, output expectations and out-of-scope behaviour, opening with a pointer to `context.qb.yaml`.
  - References to ADRs, architecture overviews, and the relevant ContextQB principles.
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
journey_rank: 20
related_principles:
  - documentation-as-architecture
  - naming-conventions
  - separation-of-concerns
tags:
  - agents
  - documentation
  - prompts
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent); R-01 remediation 2026-09-09"
  reviewer_notes: "2026-10-07 renewal B3 coherence repair (0.2.1; author self-checked; independent review pending; not operator-accepted): the problem statement no longer says every prompt starts from zero, matching the shared memory premise (tool memory is partial; the repository is what reliably carries). 2026-10-07 renewal B2 (0.2.0; author self-checked; independent review pending; not operator-accepted): tool-support claims replaced by category wording and the instruction-files reference; template gains a security boundaries section (seven sections); TypeScript-specific examples labelled; long-file wording corrected; fresh-session check, nested files and review-before-accepting added. 2026-10-06 renewal fast-track repair (0.1.4; author self-checked; independent review pending; not operator-accepted): template now opens by pointing the agent at context.qb.yaml, with a short section on the separate roles of AGENTS.md (rules) and the manifest (map). Earlier notes describe the previous version: R3–R7 pass. Now points at the worked AGENTS.md examples on /examples/ (F-18 wire-in). R8 pending P4 (passed P4 2026-09-09)."
related:
  - agents-md-vs-readme
  - build-mcp-for-project-context
  - choosing-your-ide-and-llm
  - documenting-for-your-agent
  - new-project-foundation
  - run-a-multi-agent-workflow
  - set-security-guardrails-for-your-agent
  - set-up-a-documentation-system
  - set-up-drift-detection
  - the-mental-model-of-your-app
  - understanding-the-context-window
  - write-a-context-qb
---

# Set Up AGENTS.md for Your Project

`AGENTS.md` is the single most leverage-positive file you can add to a codebase that will be touched by agents. It is the project's operating manual for AI collaborators.

## Why AGENTS.md specifically

Many agentic coding tools read `AGENTS.md`. It is an open format, now stewarded by the Agentic AI Foundation under the Linux Foundation. Support is not uniform: some tools load it automatically at the start of every session, some read it only when there is no tool-specific instruction file (such as a `CLAUDE.md`), some need a setting to point at it, and some check their own files first. The [instruction-files reference](contextqb://references/setup#agents-md-support) records, with dates, which tools read which files and in what order. Check the tool you actually use.

Even without tool integration, the file pays for itself because it gives you a stable thing to point at: "before working on this, read AGENTS.md."

## What goes in it

The shortest useful AGENTS.md has seven sections. Use this as your template:

```markdown
# AGENTS.md

This file is the canonical operating instructions for AI agents working in this repository. Read it before doing non-trivial work. Then read `context.qb.yaml` at the repository root: it is the map of what exists and where.

## 1. Project

<One paragraph: what this product is, who uses it, what surfaces it has.>

## 2. Security boundaries for this agent

<What the agent must never do without your approval — read secrets, delete, deploy, change git history — and the list of public surfaces and outside services. Paste and adapt the block from the set-security-guardrails-for-your-agent playbook; your agent tool's permission settings enforce it.>

## 3. Package boundaries

<List every top-level package or directory and state its single responsibility in one sentence. State the allowed dependency directions explicitly. For a single app these are folders, not packages.>

## 4. Naming

<File naming convention. Function naming convention. Anti-patterns (in a TypeScript project, for example, "no utils.ts"). Reference the ContextQB naming-conventions principle.>

## 5. State and orchestration

<Where state lives. Who owns it. Where workflows are coordinated. Server vs. client state distinction if relevant.>

## 6. Output expectations

<When to produce a plan first. When to produce a document. When to write code directly. Reference the ContextQB feature-planning playbook for non-trivial changes.>

## 7. What the agent must not do

<Explicit list. For example: "Do not extend a file that is already over 300 lines; propose a split." "Do not introduce a new top-level directory without proposing it." "Do not duplicate state across modules.">

## Further reading

- ADRs in <path>
- Architecture overviews in <path>
- ContextQB principles: <list the ones most relevant>
```

That is it. Seven sections, no ceremony. The security section sits second, right after the project paragraph, so the agent reads it before any task instructions. Keep the opening line that points to `context.qb.yaml` if your project has one; if it doesn't yet, add the line when you write it.

In a monorepo you can add a nested `AGENTS.md` inside a package for rules that apply only there; tools that support nesting use the one closest to the file being edited.

Worked examples for three project shapes live at [contextqb.com/examples/](https://contextqb.com/examples/) — a full-stack web app, a browser extension, and an MCP project. If you are unsure which is closest, start from the web app; it is the most complete.

## Rules and map: `AGENTS.md` and `context.qb.yaml`

The two files do different jobs:

- **`AGENTS.md` holds the rules** — how the agent should behave here, what it must not do, what to produce before writing code. Many agent tools load it automatically at the start of a session; support varies by tool and version, so check yours, and if it doesn't, start each session with "read AGENTS.md first."
- **`context.qb.yaml` holds the map** — what exists, where it lives, what has been decided and what is in flight. No agent tool needs to know this format. The agent reads it because the opening line of `AGENTS.md` tells it to.

That pointer is the link between them. Without it, the manifest is a file nobody opens. Write the map with [`write-a-context-qb`](contextqb://playbooks/write-a-context-qb).

## Length and voice

- **Keep it under 500 lines.** Longer means it will not be read.
- **Use plain language.** This file is read by agents, but it is also read by every new collaborator. It should be useful to both.
- **Be specific.** "Use clear naming" is useless. "Files are kebab-case. No `utils.ts`. Function names are verb + noun." is useful.
- **Use second person.** "You will not put data fetching in components." reads as instruction. "It is preferred that…" reads as suggestion.

## Update it when the architecture changes

A stale AGENTS.md is worse than no AGENTS.md, because the agent acts on it confidently. Make updating it part of the definition of done for any structural change. ADRs help — when you accept a new ADR, ask: "does AGENTS.md need to change because of this?"

## How to instruct an agent to write one

> Generate an AGENTS.md for this repository following the ContextQB set-up-agents-md playbook. Use the seven-section template, and leave the security boundaries section as a marked draft for me to decide. Be specific to this project — do not produce generic best-practice advice. Reference real file paths and real package names. End with a "Further reading" section pointing to existing documentation in the repo. If the repository has a context.qb.yaml, keep the opening line that tells agents to read it.

After it returns, edit it. Some sections will be wrong; some will be vague. The agent's draft is a starting point, not the final word. You are the source of truth for your project's structure; AGENTS.md is your dictation of that truth. Never accept the security boundaries or the "must not" list without reading every line yourself — they are your decisions, not the agent's.

## Check that it is being read

Start a fresh session and ask, before giving any task: "What are the rules for working in this repository, and what must you not do?" A good answer quotes your `AGENTS.md` — the security section and the "must not" list — and mentions `context.qb.yaml`. If the agent answers generically, your tool is not loading the file: check the instruction-files reference for your tool, or begin each session with "read AGENTS.md first".

## A common mistake

Treating AGENTS.md like a wishlist. The file should describe how the project actually works, not how you wish it worked. If you write "all state is owned by a single store" and that is not currently true, the agent will produce code that contradicts the rest of the codebase.

If you want to assert a target state, either:

- Refactor the code to match (best), or
- Mark the gap explicitly ("The current code violates this in `src/legacy/` — do not extend that pattern").

## Pairing AGENTS.md with ContextQB

If your project uses the ContextQB MCP, your AGENTS.md can be short — most of its content can be replaced with a few references:

```markdown
## Architectural principles

This project follows the ContextQB principles. Before structural work, ask the
ContextQB MCP for the principle by id. The principles most relevant here are:

- separation-of-concerns
- state-ownership
- modularity
- naming-conventions
- anti-spaghetti
```

That lets a single AGENTS.md stay focused on what is _specific_ to this project, while the agent pulls the universal architectural standards from the MCP as needed.

## Anti-patterns

- **A README masquerading as AGENTS.md.** The README is for humans browsing the repo. AGENTS.md is for agents executing in it. They serve different audiences.
- **A 2,000-line AGENTS.md.** Long files are followed less reliably, and some tools truncate them. Trim.
- **Generic best-practice advice.** "Write clean code" is noise. Project-specific specifics is the point.
- **No update process.** AGENTS.md must be updated as the project evolves, or it becomes actively misleading.
- **Conflicting AGENTS.md and ADRs.** Decide which one is authoritative on what. Typically: AGENTS.md describes _current_ shape; ADRs describe _why_ and historical decisions.
