---
id: skills-mcp-and-agents-md
title: Skills vs. MCP vs. AGENTS.md
summary: Three ways to give an agent context that lasts beyond one chat. AGENTS.md holds the rules every session follows. A skill holds a procedure the agent loads only when it is needed. An MCP server serves shared content or actions to any compatible tool. Choose by when the context is needed and who needs it, not by how much of it there is.
version: 0.1.1
audience:
  - novice-builder
  - founder
  - operator
  - developer
journey_stage: 1
journey_rank: 10
framing: "I keep hearing about skills, MCP servers and AGENTS.md. Which one does my project need?"
tags:
  - agents
  - mcp
  - documentation
related:
  - agent-instructions
  - build-mcp-for-project-context
  - document-producing-agent
  - mcp-project
  - mcp-vs-paste
review:
  status: draft
  last_reviewed: ""
  reviewer: "renewal B6 author (agent)"
  reviewer_notes: "2026-10-07 renewal B6 review correction (0.1.1; author self-checked; independent review pending; not operator-accepted; still draft): MCP is no longer called the only one of the three that lives outside the project — skills can live in a user profile and a local server can live in the repository; what sets MCP apart is the protocol interface any client can call and reusable delivery to many tools, projects and people. A skill with a script is no longer said to run it whenever used: the skill may tell the agent to run bundled scripts when needed, subject to permissions, and loading instructions is distinct from executing code. 2026-10-07 renewal B6 (0.1.0; authored under DEC-04; author self-checked; independent review pending; not operator-accepted): new short briefing comparing project instruction files, skills and MCP servers by category, with dated reference links for which tools support what; no endorsements, no item-count thresholds; remote-server trust follows the mcp-project audit's explicit access policy. Status stays draft until independent review and the operator's decision."
---

# Skills vs. MCP vs. AGENTS.md

## The one-line answer

`AGENTS.md` holds the rules every session should follow. A **skill** holds a procedure the agent loads only when it is needed. An **MCP server** serves content or actions to any compatible tool, across projects and people. Most projects need the first, many benefit from the second, and some need the third.

## The three, in plain terms

**`AGENTS.md` (and your tool's own instruction file).** A Markdown file at the root of your project that many agentic tools load at the start of every session ([which tools read which files](contextqb://references/setup#agents-md-support)). It is for things that are always true here: what the project is, its rules, its boundaries, what the agent must not do, and where to look next. Because it is read every time, it should stay short; longer project documents live in files it points to.

**Skills (reusable instructions).** A skill is a named procedure — "write a release note", "run our review checklist" — stored as a file the agent loads only when you invoke it by name or when its description matches the task. Until then, only its short description takes up room in the context window. Several tools support an open skills format, and some use prompt files or commands for the same job ([which tools offer what](contextqb://references/setup#reusable-instructions)). A filled-in version of the [document-producing template](contextqb://prompts/document-producing-agent) is a good first skill.

**An MCP server.** A small program that serves resources (documents) and tools (actions) over the Model Context Protocol to any MCP-aware client. A server can run from inside your repository or be hosted elsewhere; what sets it apart is the interface, not the location. Any MCP-aware client calls it the same way, so one server can serve every tool you use, every project you open, and every person on a team. It can also serve content you don't keep in your repository — the ContextQB methodology is served this way.

## Side-by-side

|                        | `AGENTS.md`                                  | Skill                                                              | MCP server                                                         |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **Loaded when**        | At the start of every session, in many tools | When invoked, or when its description matches the task             | When the agent calls one of its resources or tools                 |
| **Good for**           | Rules and boundaries that always apply       | Procedures you repeat, on demand                                   | Content or actions shared across tools, projects or people         |
| **Lives in**           | Your repository                              | Your repository or your user profile, per tool                     | A separate program, local or hosted                                |
| **Works across tools** | Where the tool reads it                      | Where the tool supports the format                                 | Any MCP-aware client                                               |
| **Setup**              | Write one file                               | Write one folder or file per skill                                 | Build or install a server, then configure each client              |
| **Trust**              | You review it like any project file          | Skills can bundle scripts the agent may run: review them like code | Code your agent trusts: check what it can reach and who can use it |

## How to choose

Ask three questions about each piece of context, in this order:

1. **Should every session follow it, whatever the task?** Put it in `AGENTS.md`, or in a project document that `AGENTS.md` points to.
2. **Is it a procedure you run sometimes, by name?** Make it a skill or prompt file in the tool you use.
3. **Does it need to reach several tools, projects or people, stay centrally versioned, or come from somewhere other than your repository?** That is what an MCP server is for.

The amount of context does not decide this; when it is needed and who needs it does. Many projects use all three: rules in `AGENTS.md`, a few skills for repeated procedures, and an MCP server — their own or someone else's, such as ContextQB's — for shared material. [MCP vs. pasting context](contextqb://briefings/mcp-vs-paste) covers the smaller choice between pasting, a file in the repo and a server.

## Trust is different for each

A wrong line in `AGENTS.md` misleads every session until someone fixes it, so review changes to it. A skill is instructions first; loading it does not run anything. But a skill can bundle scripts and tell the agent to run them when needed, subject to your tool's permission settings — so read a skill, scripts included, before you install someone else's. An MCP server is code your agent trusts and whose output lands in its context. Before connecting a remote server, find out its access policy: intentionally public, read-only content may be open to anyone, while protected data and actions need authentication and authorization. The [MCP project audit](contextqb://audits/mcp-project) checks a server against that policy.

## See also

- [Playbook: Build an MCP for Reusable Project Context](contextqb://playbooks/build-mcp-for-project-context) — when you do need your own server
- [Playbook: Create Agent Instructions That Produce Documents](contextqb://playbooks/agent-instructions) — writing the instructions a skill will hold
- [Briefing: MCP vs. Pasting Context Into Chat](contextqb://briefings/mcp-vs-paste) — the paste, file and server choice
- References (dated facts): [instruction files each agent reads](contextqb://references/setup#agents-md-support), [skills and prompt files](contextqb://references/setup#reusable-instructions), [MCP client configuration](contextqb://references/setup#mcp-clients)
