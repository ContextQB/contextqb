---
id: understanding-the-context-window
title: Understanding the Context Window
summary: ContextQB is named for this. The context window is the agent's working memory — finite, lossy, and the most important variable in agentic coding. Understanding how it behaves is the difference between an agent that helps you and one that forgets what you told it five minutes ago.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 0
intro: |
  The context window is the room the agent works in. Everything it's currently aware of — your prompts, the files it's read, the responses it's already given, the system instructions it received at the start — has to fit inside that room. Outside the room, nothing exists. This guide is about what lives in the room, why the room is smaller than it seems, and how to make sure the right things are in it at the right time.
tags:
  - context-window
  - llm
  - methodology
  - core
related:
  - understanding-llms
  - choosing-your-ide-and-llm
  - the-mental-model-of-your-app
  - context-quarterback-the-onboarding-map
  - documentation-as-architecture
next_steps:
  - Open your IDE and identify which files are currently "in context" for your active agent session.
  - Write or update your AGENTS.md so it primes any new session correctly.
  - Write or update your context.qb.yaml so the agent can boot from one file.
  - When you finish your next coding session, write a one-paragraph handoff note for next time.
---

# Understanding the Context Window

**Plain language:** When you talk to an AI agent, everything it's "thinking with" — your messages, its replies, the files it's read, the instructions it was given at the start — has to fit inside a fixed budget called the context window. It's the agent's entire working memory for that conversation. The window is finite. When it fills up, things fall out. Even before it fills up, the agent has a harder time finding what's in the middle. Almost every weird thing an agent does — forgetting a constraint you mentioned earlier, contradicting a decision you made, making the same mistake twice — comes back to how you managed the window.

## You're in the right place

The context window is the single most important concept in agentic coding, and almost nobody explains it well. Marketing pages talk about "200K context" or "1M context" as if it were a feature like RAM. It is not. It's a constraint that shapes every interaction with the model, whether you notice or not.

ContextQB is _literally named for this problem_. The brand is "Context Quarterback" — the idea that every repo needs someone (you, with help from the methodology) calling the plays about what context the agent gets, when, and in what order. This guide is the foundation that every other ContextQB piece builds on. If you understand the context window, the rest of the methodology stops looking like overhead and starts looking obvious.

## What the context window actually is

Imagine a worktable. The agent — the LLM — can only work with what's on the table right now. If a piece of paper is on the table, the agent can read it, refer to it, reason about it. If a piece of paper is not on the table, that information may as well not exist for this agent, in this moment. There is no filing cabinet to pull things from. There is no memory of last week. There is only the table.

The **context window** is the maximum amount of text that fits on the table. It's measured in **tokens** — roughly three-quarters of a word per token. Different models have different table sizes:

| Model family            | Typical context size (mid-2026) |
| ----------------------- | ------------------------------- |
| Claude (frontier)       | 200K tokens                     |
| GPT (frontier)          | 200K–400K tokens                |
| Gemini                  | 1M+ tokens                      |
| Most open-source models | 8K–128K tokens                  |

For perspective: 200K tokens is roughly 150,000 words, or about three average-length novels. That sounds enormous. In practice, you'll be surprised how fast it fills.

## What lives in the context

When you send a message in an agentic IDE, the context typically contains all of the following at once:

1. **The system prompt** — the IDE's instructions to the model about how to behave (often hidden from you, often a few hundred to a few thousand tokens).
2. **Your messages** so far in this session.
3. **The agent's responses** so far in this session.
4. **Every file the agent has opened or been shown.** When the agent reads `src/api.ts`, the entire contents of that file are now on the table, consuming as many tokens as the file is large.
5. **Every tool call result** — output from any shell command, search, web fetch, or other tool the agent invoked.
6. **Anything pulled via MCP** — like the ContextQB principles, when your agent calls `get_principle`, the principle's full Markdown text drops onto the table.
7. **Project-level primers** — `AGENTS.md`, `.cursorrules`, `context.qb.yaml`, or whatever your IDE loads automatically at session start.

Each of these costs tokens. The agent has access to all of them, but the table only holds so much. Once you exceed the limit, the IDE has to make a decision about what to drop or compress. You usually don't get to choose what gets dropped — the IDE does, on a best-effort basis (usually dropping the oldest turns first).

## The two failure modes

### 1. The window runs out

You hit the token limit. The IDE has to drop something. Usually it drops the earliest messages — which is _usually_ the worst possible thing to drop, because the earliest messages are where you established the goal, the constraints, the architecture. Now turn 80 is going great except the agent has forgotten the rule you set in turn 3 about not modifying the public API.

If your IDE doesn't drop things, it _summarizes_ them — collapsing earlier turns into a short note. That's better than dropping but still lossy. A summary of "we decided to use SQLite" might leave out the four important reasons _why_, which the agent then violates because the reasons aren't on the table anymore.

### 2. Recall degrades even before the window runs out

This is the subtle, dangerous one. Even when there's plenty of room on the table, the model doesn't attend to all of it evenly. There's a well-documented effect — **"lost in the middle"** — where models recall information from the start and end of the context much better than information from the middle. A massive 1M-token context window does not mean the model will reliably find the relevant detail buried at position 500,000.

This is why "just load the whole codebase into context" doesn't work as well as the marketing suggests. The model technically has access to it. It can't reliably _use_ all of it.

## Why this is the foundation of agentic coding

Three consequences flow directly from these mechanics. Internalise these and the rest of the methodology stops looking like overhead.

### Consequence 1: The agent forgets between sessions

There is no continuity between session A and session B unless you create it. When you open a new chat tomorrow, _everything is gone_ unless something brings it back onto the table. Whatever architectural decision you made yesterday doesn't exist for the new agent unless it's written somewhere the agent reads at the start of the new session.

This is the load-bearing claim behind every artifact in the methodology — `AGENTS.md`, `context.qb.yaml`, ADRs, status documents, the MCP. Each of them is a way to put yesterday's context back on tomorrow's table.

### Consequence 2: Within a session, things you said earlier are at risk

If you're 100 turns into a conversation, the things you said in turn 5 are deep in the middle of the context. They might still be physically present, but the model attends to them less reliably. Long sessions degrade. There is no good "treat me like one long thought" mode; the longer it gets, the more the early decisions slip away.

This is why the methodology pushes you toward short, structured sessions with explicit handoffs between them. Not because long sessions are technically impossible, but because long sessions are reliably worse than two short well-handed-off sessions.

### Consequence 3: Loading files is not free, and it lingers

When the agent reads `src/payments.ts` to answer your question, that file is now on the table. It will be on the table for the rest of the session. If `payments.ts` is 3,000 tokens, you're paying for those 3,000 tokens on _every subsequent turn_ — because most pricing charges for the full context on every model response.

The corollary: **a thoughtful agent that reads one targeted file is cheaper and more accurate than an enthusiastic agent that reads twenty.** You want the table to hold what matters and nothing else.

## The cost shape

Every token in your context is sent to the model on every turn of the conversation. If your context is 50,000 tokens and you exchange 20 messages, the model has been billed for processing roughly 1,000,000 tokens of input across that session — on top of whatever output it generated.

Practical implications:

- **Long sessions cost more per turn than short ones.** Not just in total — _per turn_. Each turn carries the full weight of everything before it.
- **Reading large files mid-session** means every subsequent turn pays for those files. If you've read 20K tokens of code at turn 3, turn 50 pays for those 20K tokens too.
- **Closing the session resets the meter.** A fresh session with the same primers but no accumulated history can be 5–10× cheaper than continuing a long one.
- **Pay-per-token plans surface this cost; bundled plans hide it behind rate limits.** Either way, the underlying mechanic is the same — the cost just shows up in different places.

This is not a small effect. The difference between a builder who manages context tightly and one who doesn't can be a 10× spread in monthly LLM bills for the same amount of actual progress.

## Strategies (this is the ContextQB methodology)

Here is where the brand earns its name. Every piece of the methodology you'll see on this site is a strategy for managing what's on the table:

### 1. Boot with a primer

Every session should start with the agent reading two things:

- **[`AGENTS.md`](contextqb://playbooks/set-up-agents-md)** — operating instructions for the repo. What the project is, what conventions matter, what the agent should and shouldn't do.
- **[`context.qb.yaml`](contextqb://playbooks/write-a-context-qb)** — the boot manifest. The project's map in a structured, machine-readable form.

Together these are typically under 2,000 tokens — about 1% of a typical context window. They prime the agent with what it needs to make good decisions for the rest of the session. Modern IDEs (Cursor, Claude Code, Windsurf, etc.) read these automatically.

### 2. Write decisions down so the table can re-load them

Every meaningful architectural choice should land in an **[ADR (Architecture Decision Record)](contextqb://playbooks/write-an-adr)**. ADRs are referenced in `context.qb.yaml`. When the agent boots and reads the manifest, it sees the list of decisions and can pull individual ADRs into context as needed.

The principle: **a decision in your head exists for one session. A decision in an ADR exists forever.**

### 3. Use status documents for in-flight work

When you're partway through a feature and need to end the session, write a **status document** — what's been done, what's in progress, what's blocked, what decisions you made along the way. The next session reads it as one of the first things and resumes with full context, without you having to re-explain.

The first ContextQB course treats this as one of the highest-leverage habits in agentic building. It is correct.

### 4. Hand off cleanly between sessions

A **session handoff** is a short note (often part of the status document) that captures the last useful moment in a conversation, written specifically for next time. "We were about to refactor `authMiddleware` to use the new RBAC model. The plan is X. The blocker is Y. Start by reading Z."

This is the alternative to "I'll just keep this chat open for two weeks." You won't. The chat will degrade. Write the handoff.

### 5. Use the MCP to pull only what you need

The whole point of the [ContextQB MCP](contextqb://playbooks/build-mcp-for-project-context) is that it gives agents a way to pull in specific principles, playbooks, audits, or prompts _by URI_ — without you having to paste the whole methodology into the chat. The agent calls `get_principle` or `get_playbook` only when it needs the content. The rest stays off the table.

Every MCP server is, conceptually, a way to add precise things to the table only when they're needed.

### 6. Don't load files speculatively

When the agent asks "should I read the whole repo first?", the answer is almost always no. Have it read what it needs for the immediate task. If it turns out more is needed, load more then. Targeted reads are cheaper, faster, and more accurate than dump-everything-in-just-in-case.

### 7. Summarize before you compress

If a session is approaching the limit, don't let the IDE auto-truncate randomly. Stop, ask the agent to write a summary of the session so far (file changes, decisions, open questions), save that summary to a status document, and start a fresh session with the summary as input. You've turned an about-to-degrade context into a curated one.

### 8. Restart sessions deliberately

The single most under-used habit in agentic coding: **closing the chat and starting a new one when the current one feels heavy.** A new session with `AGENTS.md`, `context.qb.yaml`, the relevant ADRs, and your specific question on it will outperform a 200-turn marathon almost every time.

## How modern IDEs help with the context window

Knowing what your IDE does for you automatically is half the battle. The other half is doing the things it _doesn't_ do — which is where the methodology in the previous section earns its keep. As of 2026, every major agentic IDE has its own approach to context management. None of them solve the problem completely. They make different trade-offs between **automatic compression** (less work for you, but lossy) and **manual control** (more work for you, but precise).

Four patterns recur across the landscape. Recognising them is more useful than memorising any one IDE's features.

### The four patterns

**1. Context compaction** (also called summarization or compression). The IDE periodically takes the older parts of a conversation and rewrites them as a shorter summary. The summary stays in context; the original messages drop out. This buys you more room in the window at the cost of some fidelity — the summary loses detail. Some IDEs do this automatically and silently; some give you a manual trigger and show you what was compacted.

**2. Codebase indexing** (also called semantic retrieval or RAG over the codebase). The IDE pre-processes your repo into an index — a vector embedding, a symbolic map, or a hybrid — that it can query on demand. When you ask a question, instead of loading every file into context, the IDE retrieves only the chunks that look relevant. This is what makes "ask a question about a 100K-file repo" feel workable. The trade-off: relevance is heuristic. The index can miss what matters and surface what doesn't.

**3. Persistent memory** (also called long-term memory or agent memory). The IDE stores facts about your project, your preferences, or past sessions in a separate store that survives across conversations. The next session pulls from that store to bootstrap. This is the part of "the agent learns over time" that's actually real — and it's still early in 2026, mostly limited to short pinned facts rather than full session continuity.

**4. Explicit context controls** (also called @-mentions, slash commands, or pins). Manual tools you use to say "load _this_ file, _these_ functions, _that_ documentation page" into the current context. Every modern IDE has some version of this. They are the most precise tool but the most labour-intensive.

### How the major IDEs implement them (mid-2026)

| IDE                             | Compaction                                                 | Codebase indexing                                       | Persistent memory                                                                     | Explicit controls                                            |
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Cursor**                      | Automatic session summarization at long-context thresholds | Built-in codebase indexing (semantic + symbolic)        | Rules files (`AGENTS.md`, `.cursorrules`) plus lightweight memories                   | `@file`, `@folder`, `@codebase`, `@docs`, `@web`, `@git`     |
| **Claude Code**                 | `/compact` (manual) plus auto-compact at threshold         | Native file / grep / glob tools instead of an index     | Project rules in `CLAUDE.md` (and now `AGENTS.md`); subagents preserve scoped context | Slash commands, `@`-mentions, MCP for everything else        |
| **Windsurf**                    | Cascade auto-summarization within long sessions            | Live codebase awareness, real-time indexing             | **Memories** — explicit long-term notes the agent maintains across sessions           | `@`-mentions, pins, Cascade flow controls                    |
| **GitHub Copilot (in VS Code)** | Limited automatic summarization                            | Workspace indexing (`@workspace`)                       | Custom instructions in `.github/copilot-instructions.md`                              | `@workspace`, `@terminal`, `@vscode`, slash commands         |
| **Aider**                       | Token-budget-aware truncation                              | **Repo-map** — a compact symbolic summary of every file | None native                                                                           | `/add`, `/drop`, `/clear`, `/tokens` for explicit management |
| **Continue**                    | Customizable per provider                                  | Plugs into your choice of indexer                       | Context providers can be persistent                                                   | Highly customizable `@`-mentions and slash commands          |
| **Zed**                         | Minimal — relies on user control                           | Project search rather than full RAG                     | None native                                                                           | Slash commands and explicit file mentions                    |
| **JetBrains AI Assistant**      | Limited                                                    | Project-wide indexing for relevant files                | None native                                                                           | `#`-mentions and project context selectors                   |
| **Claude Desktop**              | Per-conversation                                           | None (it's a chat client, not a code IDE)               | **Claude Projects** — pinned files plus instructions per project                      | Project files, MCP resources                                 |

A few specific patterns worth calling out by name:

- **Cursor's automatic summarization** is the most opaque mechanism in the table. It happens silently during long sessions — the IDE detects you're approaching limits and compacts older turns into a summary. You usually don't see it happen; you only notice the side effects (the agent "forgetting" something specific you said earlier). The fix is the same as hitting a hard limit: restart with proper primers.
- **Claude Code's `/compact`** is the inverse — explicit, user-triggered. You decide when to compact, you can see the summary it produced, and you can edit it before continuing. More work; more control.
- **Windsurf's Memories** is the most ambitious attempt at persistent agent memory in 2026. It works well for short pinned facts ("the user prefers ESM imports", "we deploy to Cloudflare Workers") but isn't yet a replacement for `AGENTS.md` for project-level rules.
- **Aider's repo-map** is a structurally different solution. Instead of indexing chunks for retrieval, it sends a compact symbolic outline of the whole repo (function signatures, class names, file structure) so the model has _shape_ without _content_. The agent asks for specific files only when it needs them. Old idea; still effective.
- **Claude Desktop's Projects** behaves like a per-project context container: pinned files, instructions, and a knowledge base that any conversation inside the project sees automatically. The closest analogue to a stable boot primer in a chat-first product.

### What this means for the methodology

No IDE in 2026 fully solves the context window problem. Each one solves _part_ of it, and the part it solves changes how you should layer the strategies from the previous section:

- If your IDE has **strong codebase indexing** (Cursor, Copilot), you can write a thinner `AGENTS.md` because the IDE will find code on demand. But you still need primers for the things that aren't in the code — your priorities, your tone preferences, your "don't ever do X" rules.
- If your IDE has **automatic compaction** (Cursor, Windsurf), you can have longer sessions before things degrade — but the compaction is lossy, so the "restart deliberately" habit still matters. The IDE delays the failure; it doesn't eliminate it.
- If your IDE has **explicit controls only** (Aider, Zed), you need _more_ discipline, not less. Every file load is a choice you have to make. The upside: you always know exactly what's on the table.
- If your IDE supports **MCP** (most modern ones now do), the [ContextQB MCP](contextqb://playbooks/build-mcp-for-project-context) plus any project-specific MCP servers give you the most precise context-loading mechanism available — pull specific resources by URI, only when needed.

A useful rule of thumb: **the more your IDE does automatically, the less you can _see_ what's actually in the context** — which makes failure modes harder to diagnose. The more explicit your IDE, the more work you do, but the easier it is to know exactly what the model is reasoning over.

The methodology from the previous section is designed to be IDE-agnostic. Boot primers, status documents, ADRs, and deliberate session restarts work regardless of which IDE you use. What changes per-IDE is _how much you can lean on the tool_ and _how much you have to do manually_. As IDEs mature, the manual share shrinks. It is not zero in 2026, and won't be soon.

## How different models handle the context window

Like with [personalities](contextqb://guides/understanding-llms), each model has a context-handling style:

- **Claude** — generally strong at long context, especially when content is well-structured (markdown with clear headers, named sections). The "lost in the middle" effect is real but less severe than in some peers. Good for long agentic loops.
- **GPT** — competitive on long context. Has a tendency to "forget" stylistic instructions or constraints when they're buried mid-context. Better at retrieving specific facts than at maintaining a complex persona across a long window.
- **Gemini** — the largest windows in 2026 (1M+). Be careful: "in the window" is not "well-attended-to." Excellent for needle-in-haystack tasks, less so for whole-window reasoning.
- **Local / open-source models** — typically much smaller windows (8K–128K). You have to be more selective about what loads. Disciplined context management is _mandatory_ if you're running these.

Match the model to the shape of the work. A massive whole-codebase context-load benefits from Gemini's window. A long, careful refactor benefits from Claude's attention quality. A series of targeted small tasks doesn't need a huge window at all.

## Common mistakes

- **Pasting an entire log file when you wanted one error.** Now you're paying tokens for thousands of lines you didn't need, on every turn, and the actual signal is buried.
- **Starting a new chat and re-explaining from scratch.** You should have a handoff doc or `AGENTS.md` primer. If you don't, write one before you start the new chat.
- **Letting auto-truncation decide what to drop.** Take control. Summarize and restart instead.
- **Assuming the agent remembers yesterday.** It does not. Yesterday is on a different table.
- **Reading whole files when grep would have done.** Use the agent's search/grep tools first, narrow to the relevant section, then read only that section if needed.
- **Long branching conversations.** Each branch keeps history. If you're exploring three different approaches, do them in three different sessions and merge the conclusions in a status document.
- **Treating context size as the same thing as model intelligence.** A bigger window doesn't make the model smarter. It just means it's _allowed_ to look at more — not that looking at more will help.
- **Forgetting that MCP responses are context too.** Calling `list_principles` and then `get_principle` for each one is fine when you need them all; not fine when you needed two. Be specific.

## What "good enough" looks like

You're managing context well when:

- [ ] You can name, in plain language, what's currently on the agent's table.
- [ ] You have an `AGENTS.md` and a `context.qb.yaml` the agent reads at session start.
- [ ] When you finish a meaningful session, you write a short status / handoff note.
- [ ] You restart sessions deliberately when they grow heavy, instead of letting them degrade.
- [ ] You load files surgically — what the current task needs, not what _might_ be relevant.
- [ ] You use the MCP (or equivalent) for reusable context, not paste.
- [ ] You can sense when a session is getting too long _before_ the model starts forgetting things.

That last one is the skill you're building. Like everything else in agentic coding, it's developed by doing — not by reading. Notice when an agent contradicts itself. Notice when it asks you something you told it twenty turns ago. Those are the symptoms of the table being too full or too old. Restart. Re-prime. Try again.

The methodology won't save you from a context window that's been mismanaged. But it gives you a way to manage it on purpose, instead of by accident.

## See also

- [Principle: The Context Quarterback — Every Repo Has a Boot Manifest](contextqb://principles/context-quarterback-the-onboarding-map) — the principle this guide operationalises.
- [Principle: Documentation as Architecture](contextqb://principles/documentation-as-architecture) — why writing things down is what makes context durable.
- [Playbook: Set Up AGENTS.md for Your Project](contextqb://playbooks/set-up-agents-md) — the single most important file for session priming.
- [Playbook: Write a context.qb for Your Repository](contextqb://playbooks/write-a-context-qb) — the structured boot manifest.
- [Playbook: Write an Architectural Decision Record](contextqb://playbooks/write-an-adr) — how to make decisions durable across sessions.
- [Playbook: Build an MCP for Reusable Project Context](contextqb://playbooks/build-mcp-for-project-context) — how to make your own context server.
- [Guide: Choosing Your IDE and LLM](contextqb://guides/choosing-your-ide-and-llm) — where window sizes and pricing live.
- [Guide: Understanding LLMs](contextqb://guides/understanding-llms) — model personalities and the cost shape.
