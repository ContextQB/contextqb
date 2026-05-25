---
id: set-up-agents-md
title: Set Up AGENTS.md for Your Project
summary: How to author the single most leverage-positive file in an agentic codebase — the project-level operating instructions that every agent should read first.
version: 0.1.0
problem: |
  Without AGENTS.md, every agent prompt starts from zero. The agent invents the architecture, guesses at naming, and produces inconsistent output session to session. The cost is paid continuously.
when_to_use: |
  At the very start of a new project, immediately after the repository is initialized. Also: when you take over an existing project that does not have one.
expected_outputs:
  - A single AGENTS.md file at the repo root.
  - Sections covering project, boundaries, naming, state, orchestration, and out-of-scope behaviour.
  - References to ADRs, architecture overviews, and the relevant ContextQB principles.
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
related_principles:
  - documentation-as-architecture
  - separation-of-concerns
  - naming-conventions
tags:
  - agents
  - documentation
  - prompts
---

# Set Up AGENTS.md for Your Project

`AGENTS.md` is the single most leverage-positive file you can add to a codebase that will be touched by agents. It is the project's operating manual for AI collaborators.

## Why AGENTS.md specifically

Agentic tools across the ecosystem — Cursor, Claude Desktop, Aider, OpenAI Codex CLI, and others — have converged on `AGENTS.md` as a convention. Many auto-load it. All of them work better when a user can say "read AGENTS.md first."

Even without tool integration, the file pays for itself because it gives you a stable thing to point at: "before working on this, read AGENTS.md."

## What goes in it

The shortest useful AGENTS.md has six sections. Use this as your template:

```markdown
# AGENTS.md

This file is the canonical operating instructions for AI agents working in this repository. Read it before doing non-trivial work.

## 1. Project

<One paragraph: what this product is, who uses it, what surfaces it has.>

## 2. Package boundaries

<List every top-level package or directory and state its single responsibility in one sentence. State the allowed dependency directions explicitly.>

## 3. Naming

<File naming convention. Function naming convention. Anti-patterns ("no utils.ts", etc.). Reference the ContextQB naming-conventions principle.>

## 4. State and orchestration

<Where state lives. Who owns it. Where workflows are coordinated. Server vs. client state distinction if relevant.>

## 5. Output expectations

<When to produce a plan first. When to produce a document. When to write code directly. Reference the ContextQB feature-planning playbook for non-trivial changes.>

## 6. What the agent must not do

<Explicit list. "Do not extend a 300+ line file." "Do not introduce a new top-level directory without proposing it." "Do not duplicate state across modules." Etc.>

## Further reading

- ADRs in <path>
- Architecture overviews in <path>
- ContextQB principles: <list the ones most relevant>
```

That is it. Six sections, no ceremony.

## Length and voice

- **Keep it under 500 lines.** Longer means it will not be read.
- **Use plain language.** This file is read by agents, but it is also read by every new collaborator. It should be useful to both.
- **Be specific.** "Use clear naming" is useless. "Files are kebab-case. No `utils.ts`. Function names are verb + noun." is useful.
- **Use second person.** "You will not put data fetching in components." reads as instruction. "It is preferred that…" reads as suggestion.

## Update it when the architecture changes

A stale AGENTS.md is worse than no AGENTS.md, because the agent acts on it confidently. Make updating it part of the definition of done for any structural change. ADRs help — when you accept a new ADR, ask: "does AGENTS.md need to change because of this?"

## How to instruct an agent to write one

> Generate an AGENTS.md for this repository following the ContextQB set-up-agents-md playbook. Use the six-section template. Be specific to this project — do not produce generic best-practice advice. Reference real file paths and real package names. End with a "Further reading" section pointing to existing documentation in the repo.

After it returns, edit it. Some sections will be wrong; some will be vague. The agent's draft is a starting point, not the final word. You are the source of truth for your project's structure; AGENTS.md is your dictation of that truth.

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
- **A 2,000-line AGENTS.md.** Nothing past page two will be loaded into context reliably. Trim.
- **Generic best-practice advice.** "Write clean code" is noise. Project-specific specifics is the point.
- **No update process.** AGENTS.md must be updated as the project evolves, or it becomes actively misleading.
- **Conflicting AGENTS.md and ADRs.** Decide which one is authoritative on what. Typically: AGENTS.md describes _current_ shape; ADRs describe _why_ and historical decisions.
