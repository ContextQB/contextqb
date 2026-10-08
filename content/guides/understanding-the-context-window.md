---
id: understanding-the-context-window
title: Understanding the Context Window
summary: ContextQB is named for this. The context window is the agent's working memory — finite, lossy, and the most important variable in agentic coding. Understanding how it behaves is the difference between an agent that helps you and one that forgets what you told it five minutes ago.
version: 0.3.1
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 0
journey_rank: 40
intro: |
  The context window is the room the agent works in. Everything it's currently aware of — your prompts, the files it's read, the responses it's already given, the system instructions it received at the start — has to fit inside that room. Outside the room, nothing exists. This guide is about what lives in the room, why the room is smaller than it seems, and how to make sure the right things are in it at the right time.
tags:
  - context-window
  - llm
  - methodology
  - core
related:
  - build-mcp-for-project-context
  - choosing-your-ide-and-llm
  - context-qb-yaml-vs-rag
  - context-quarterback-the-onboarding-map
  - documentation-as-architecture
  - how-to-use-contextqb
  - mcp-vs-paste
  - resume-an-agent-workstream
  - run-an-agent-workstream
  - set-up-agents-md
  - the-mental-model-of-your-app
  - understanding-llms
  - work-with-agents-through-documentation
  - write-a-context-qb
  - write-an-adr
next_steps:
  - Open your agentic tool and identify which files are currently "in context" for your active session.
  - Write or update your AGENTS.md so it primes any new session correctly.
  - Write or update your context.qb.yaml so the agent can boot from one file.
  - When you finish your next coding session, write a one-paragraph handoff note for next time.
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.1 (agent)"
  reviewer_notes: "2026-10-07 renewal B3 review correction (0.3.1; author self-checked; independent review pending; not operator-accepted): removed the unsupported attribution of the status-document habit to a ContextQB course; the habit and its reasons are unchanged. 2026-10-07 renewal B3 (0.3.0; author self-checked; independent review pending; not operator-accepted): window sizes, the per-tool table and named tool and model call-outs moved to dated references (model families, agent memory and compaction, codebase search, instruction files), leaving the four patterns and questions to ask of your own tool; compaction replaces drop-the-oldest as the usual behaviour; tool memory described as partial, tool-owned and something to audit; the cost section notes prompt caching and softens the unsourced multipliers; the 1% arithmetic and dated phrases removed; the ContextQB MCP serves the methodology while project files come through the agent's workspace access. Review provenance neutralised. 2026-10-06 renewal fast-track repair (0.2.5; author self-checked; independent review pending; not operator-accepted): corrected the claim that tools read AGENTS.md and context.qb.yaml automatically: tools may load AGENTS.md; the manifest is read because AGENTS.md points to it. Earlier notes describe earlier versions: 2026-09-09 epistemology review — context sizes, the per-tool matrix and model handling were updated in place (moved to references in 0.3.0); R3, R4, R6, R7 pass; flagship; F-09 resolved 2026-09-09; R8 passed P4. 2026-10-02: body cross-references to the agent workstream method were added (those diffs were inspected in an independent final QA of the workstream vertical) and then finalized for publication (a wording edit that postdates that QA). The whole atom was not re-reviewed; last_reviewed reflects the earlier review."
---

# Understanding the Context Window

**Plain language:** When you talk to an AI agent, everything it's "thinking with" — your messages, its replies, the files it's read, the instructions it was given at the start — has to fit inside a fixed budget called the context window. It's the agent's entire working memory for that conversation. The window is finite. When it fills up, the tool compresses or drops older material to make room. Even before it fills up, the agent has a harder time finding what's in the middle. Almost every weird thing an agent does — forgetting a constraint you mentioned earlier, contradicting a decision you made, making the same mistake twice — comes back to how you managed the window.

## You're in the right place

The context window is the single most important concept in agentic coding, and almost nobody explains it well. Marketing pages quote context sizes as if they were a feature like RAM. It is not. It's a constraint that shapes every interaction with the model, whether you notice or not.

ContextQB is _literally named for this problem_. The brand is "Context Quarterback" — the idea that every repo needs someone (you, with help from the methodology) calling the plays about what context the agent gets, when, and in what order. This guide is the foundation that every other ContextQB piece builds on. If you understand the context window, the rest of the methodology stops looking like overhead and starts looking obvious.

## What the context window actually is

Imagine a worktable. The agent — the LLM — can only work with what's on the table right now. If a piece of paper is on the table, the agent can read it, refer to it, reason about it. If a piece of paper is not on the table, that information may as well not exist for this agent, in this moment. The model has no filing cabinet it can reach into on its own. Some tools keep notes between sessions, but those notes count only once the tool puts them back on the table. There is only the table.

The **context window** is the maximum amount of text that fits on the table. It's measured in **tokens** — roughly three-quarters of a word per token. Different models have different table sizes, and the sizes change with each release: the largest frontier windows are very large, while many smaller and locally run models hold far less. Current limits, with the date they were checked, are in the [model families reference](contextqb://references/models#families) and the [open-weight models reference](contextqb://references/models#open-weight).

For perspective: 100,000 tokens is roughly 75,000 words — about one long novel. Large windows sound enormous. In practice, you'll be surprised how fast it fills: a whole-codebase read, a long session's history, and a few tool results can eat a megatoken window faster than you'd think.

## What lives in the context

When you send a message in an agentic IDE, the context typically contains all of the following at once:

1. **The system prompt** — the IDE's instructions to the model about how to behave (often hidden from you, often a few hundred to a few thousand tokens).
2. **Your messages** so far in this session.
3. **The agent's responses** so far in this session.
4. **Every file the agent has opened or been shown.** When the agent reads `src/api.ts`, the entire contents of that file are now on the table, consuming as many tokens as the file is large.
5. **Every tool call result** — output from any shell command, search, web fetch, or other tool the agent invoked.
6. **Anything pulled via MCP** — like the ContextQB principles, when your agent calls `get_principle`, the principle's full Markdown text drops onto the table.
7. **Project-level primers** — `AGENTS.md` or a tool-specific instruction file your tool loads at session start ([which tools read which files](contextqb://references/setup#agents-md-support)), plus anything those files tell the agent to read, such as `context.qb.yaml`.
8. **Notes the tool saved for itself** — some tools write their own memory notes and load them at the start of each session ([what agents keep between sessions](contextqb://references/setup#agent-memory)).

Each of these costs tokens. The agent has access to all of them, but the table only holds so much. When it fills, the tool has to make room. Most current agentic tools _compact_: they rewrite older turns as a shorter summary and keep the summary. Some simply drop the oldest turns. Either way, you usually don't get to choose what is lost — the tool does, on a best-effort basis.

## The two failure modes

### 1. The window runs out

You hit the token limit and the tool makes room. Usually it _compacts_ — collapsing earlier turns into a short summary. That's better than losing them outright, but it's lossy. A summary of "we decided to use SQLite" might leave out the four important reasons _why_, which the agent then violates because the reasons aren't on the table anymore. Or the rule you set in turn 3 about not modifying the public API survives only as a vague line, and turn 80 quietly breaks it.

A tool that drops the earliest messages instead does worse: those are where you established the goal, the constraints, the architecture.

What survives compaction differs by tool. At least one tool re-reads the project's root instruction file from disk after compacting, while instructions you gave only in conversation do not come back ([details by tool](contextqb://references/setup#agent-memory)). That is the practical rule: **the primer carries the constraints, and the status document carries the detail.** Anything that must survive goes in a file, not only in chat.

### 2. Recall degrades even before the window runs out

This is the subtle, dangerous one. Even when there's plenty of room on the table, the model doesn't attend to all of it evenly. There's a widely reported effect — **"lost in the middle"** — where models often recall information from the start and end of the context much better than information from the middle. A very large window does not mean the model will reliably find a detail buried halfway through it.

This is why "just load the whole codebase into context" doesn't work as well as the marketing suggests. The model technically has access to it. It can't reliably _use_ all of it.

## Why this is the foundation of agentic coding

Three consequences flow directly from these mechanics. Internalise these and the rest of the methodology stops looking like overhead.

### Consequence 1: Little carries between sessions unless you write it down

When you open a new chat tomorrow, yesterday's conversation is not on the table. Some tools bring a little back on their own — an instruction file they load, notes they saved — but that memory is partial, owned by the tool, often stored outside your project, and hard to inspect. Whatever architectural decision you made yesterday is reliable for the new session only if it's written in the repository, somewhere the agent reads at the start.

This is the load-bearing claim behind every artifact in the methodology — `AGENTS.md`, `context.qb.yaml`, ADRs, status documents, the MCP. Each of them is a way to put yesterday's context back on tomorrow's table.

### Consequence 2: Within a session, things you said earlier are at risk

If you're 100 turns into a conversation, the things you said in turn 5 are deep in the middle of the context. They might still be physically present, but the model attends to them less reliably. Long sessions degrade. There is no good "treat me like one long thought" mode; the longer it gets, the more the early decisions slip away.

This is why the methodology pushes you toward short, structured sessions with explicit handoffs between them. Not because long sessions are technically impossible, but because long sessions are reliably worse than two short well-handed-off sessions.

### Consequence 3: Loading files is not free, and it lingers

When the agent reads `src/payments.ts` to answer your question, that file is now on the table, and it stays there until the tool compacts or drops it. If `payments.ts` is 3,000 tokens, those 3,000 tokens are sent again on _every subsequent turn_ — because the whole context goes to the model on each response. Many providers charge less for input they have recently seen (prompt caching; [current API prices](contextqb://references/pricing#model-api)), which lowers the bill but not the attention problem: the file still competes for the model's attention.

The corollary: **a thoughtful agent that reads one targeted file is cheaper and more accurate than an enthusiastic agent that reads twenty.** You want the table to hold what matters and nothing else.

## The cost shape

Every token in your context is sent to the model on every turn of the conversation. If your context is 50,000 tokens and you exchange 20 messages, the model has processed roughly 1,000,000 tokens of input across that session — on top of whatever output it generated. Prompt caching can make much of that repeated input cheaper; it is still processed.

Practical implications:

- **Long sessions cost more per turn than short ones.** Not just in total — _per turn_. Each turn carries the full weight of everything before it.
- **Reading large files mid-session** means every subsequent turn pays for those files. If you've read 20K tokens of code at turn 3, turn 50 pays for those 20K tokens too.
- **Closing the session resets the meter.** A fresh session with the same primers but no accumulated history can be several times cheaper per turn than continuing a long one.
- **Pay-per-token plans surface this cost; bundled plans hide it behind rate limits.** Either way, the underlying mechanic is the same — the cost just shows up in different places.

This is not a small effect. Managing context tightly can change your monthly bill several-fold for the same amount of actual progress — an estimate from how the arithmetic above compounds, not a measured study.

## Strategies (this is the ContextQB methodology)

Here is where the brand earns its name. Every piece of the methodology you'll see on this site is a strategy for managing what's on the table:

### 1. Boot with a primer

Every session should start with the agent reading two things:

- **[`AGENTS.md`](contextqb://playbooks/set-up-agents-md)** — operating instructions for the repo. What the project is, what conventions matter, what the agent should and shouldn't do.
- **[`context.qb.yaml`](contextqb://playbooks/write-a-context-qb)** — the boot manifest. The project's map in a structured, machine-readable form.

Together these are typically a few thousand tokens at most — a small fraction of a large context window. They prime the agent with what it needs to make good decisions for the rest of the session. Many coding agents load `AGENTS.md` automatically at the start of a session — support varies by tool and version, so [check yours](contextqb://references/setup#agents-md-support), and if it doesn't, start by asking the agent to read it. No tool needs to know about `context.qb.yaml` on its own: the agent reads it because a line near the top of `AGENTS.md` says to.

### 2. Write decisions down so the table can re-load them

Every meaningful architectural choice should land in an **[ADR (Architecture Decision Record)](contextqb://playbooks/write-an-adr)**. ADRs are referenced in `context.qb.yaml`. When the agent boots and reads the manifest, it sees the list of decisions and can pull individual ADRs into context as needed.

The principle: **a decision in your head exists for one session. A decision in an ADR exists forever.**

### 3. Use status documents for in-flight work

When you're partway through a feature and need to end the session, write a **status document** — what's been done, what's in progress, what's blocked, what decisions you made along the way. The next session reads it as one of the first things and resumes with full context, without you having to re-explain.

It is one of the highest-leverage habits in agentic building: a few minutes of writing at the end of a session saves re-explaining at the start of the next.

When the work spans several passes, needs a review, or needs your decision, the status document can grow into a workstream record: the same idea, plus the approved scope, review evidence, and outstanding decisions. See [Work With Agents Through Documentation](contextqb://guides/work-with-agents-through-documentation).

### 4. Hand off cleanly between sessions

A **session handoff** is a short note (often part of the status document) that captures the last useful moment in a conversation, written specifically for next time. "We were about to refactor `authMiddleware` to use the new RBAC model. The plan is X. The blocker is Y. Start by reading Z."

This is the alternative to "I'll just keep this chat open for two weeks." You won't. The chat will degrade. Write the handoff.

### 5. Use the MCP to pull only what you need

The whole point of the [ContextQB MCP](contextqb://playbooks/build-mcp-for-project-context) is that it gives agents a way to pull in specific principles, playbooks, audits, or prompts _by URI_ — without you having to paste the whole methodology into the chat. The agent calls `get_principle` or `get_playbook` only when it needs the content. The rest stays off the table. (The ContextQB MCP serves the methodology and its references. Your own project's files reach the agent through its ordinary access to your workspace.)

Every MCP server is, conceptually, a way to add precise things to the table only when they're needed.

### 6. Don't load files speculatively

When the agent asks "should I read the whole repo first?", the answer is almost always no. Have it read what it needs for the immediate task. If it turns out more is needed, load more then. Targeted reads are cheaper, faster, and more accurate than dump-everything-in-just-in-case.

### 7. Summarize before you compress

If a session is approaching the limit, don't wait for the tool to compact on its own terms. Stop, ask the agent to write a summary of the session so far (file changes, decisions, open questions), save that summary to a status document, and start a fresh session with the summary as input. You've turned an about-to-degrade context into a curated one.

### 8. Restart sessions deliberately

The single most under-used habit in agentic coding: **closing the chat and starting a new one when the current one feels heavy.** A new session with `AGENTS.md`, `context.qb.yaml`, the relevant ADRs, and your specific question on it will outperform a 200-turn marathon almost every time.

## How agentic tools help with the context window

Knowing what your tool does for you automatically is half the battle. The other half is doing the things it _doesn't_ do — which is where the methodology in the previous section earns its keep. Every major agentic tool has its own approach to context management. None of them solve the problem completely. They make different trade-offs between **automatic compression** (less work for you, but lossy) and **manual control** (more work for you, but precise).

Four patterns recur across the landscape. Recognising them is more useful than memorising any one tool's features.

### The four patterns

**1. Context compaction** (also called summarization or compression). The tool periodically takes the older parts of a conversation and rewrites them as a shorter summary. The summary stays in context; the original messages drop out. This buys you more room in the window at the cost of some fidelity — the summary loses detail. Some tools do this automatically and silently; some give you a manual trigger, let you say what to keep, or show you what was compacted.

**2. Codebase search** (also called codebase indexing, semantic retrieval or RAG over the codebase). Some tools pre-process your repo into an index — a vector embedding, a symbolic map, or a hybrid — that they query on demand; others search the files directly with fast text search each time. When you ask a question, instead of loading every file into context, the tool retrieves only what looks relevant. This is what makes "ask a question about a 100K-file repo" feel workable. The trade-off: relevance is heuristic. The index can miss what matters and surface what doesn't.

**3. Persistent memory** (also called long-term memory or agent memory). The tool stores facts about your project, your preferences, or past sessions in a separate store that survives across conversations, and the next session loads from it. This is the part of "the agent learns over time" that's actually real. It can be substantial — some tools write and maintain their own memory files — but it belongs to the tool: often outside your repository, only partly visible, not shared with your other tools or collaborators, and sometimes wrong. Treat auto-saved memories as drafts that earn promotion into `AGENTS.md`: read what your tool remembered, and move the true facts into a document the whole project shares.

**4. Explicit context controls** (also called @-mentions, slash commands, or pins). Manual tools you use to say "load _this_ file, _these_ functions, _that_ documentation page" into the current context. Every modern agentic tool has some version of this. They are the most precise tool but the most labour-intensive.

### Which tool does what

Exactly how each tool compacts, searches, remembers and loads instruction files changes with each release, so ContextQB keeps those details in dated references rather than in this guide:

- [What agents keep between turns and sessions](contextqb://references/setup#agent-memory) — memory files and compaction, for the tools whose documentation was checked.
- [How agentic tools search a codebase](contextqb://references/tools#codebase-retrieval) — indexes, repository maps and on-demand search.
- [Project instruction files each agent reads](contextqb://references/setup#agents-md-support) — `AGENTS.md` and tool-specific files.

Instead of memorising a feature matrix, ask these questions of the tool you actually use (its documentation answers most of them, and you can ask the agent to find out):

- **Compaction.** Does it compact automatically? Can you trigger it yourself, tell it what to keep, or see the summary it produced? Which files does it re-read afterwards?
- **Search.** Does it build an index of your code, or search the files directly each time? Can you see what it retrieved?
- **Memory.** Does it save its own notes between sessions? Where are they stored, and can you read and edit them?
- **Explicit controls.** How do you add a specific file, folder or documentation page to the current context — and how do you remove one?

A tool that compacts silently is the most opaque case: you notice only the side effects (the agent "forgetting" something specific you said earlier). The fix is the same as hitting a hard limit — restart with proper primers. A tool that saves its own memories is useful and also a drift risk: a wrong learned "fact" persists until someone reviews it.

### What this means for the methodology

No tool fully solves the context window problem. Each one solves _part_ of it, and the part it solves changes how you should layer the strategies from the previous section:

- If your tool has **strong codebase search**, you can write a thinner `AGENTS.md` because the tool will find code on demand. But you still need primers for the things that aren't in the code — your priorities, your tone preferences, your "don't ever do X" rules.
- If your tool has **automatic compaction**, you can have longer sessions before things degrade — but the compaction is lossy, so the "restart deliberately" habit still matters. The tool delays the failure; it doesn't eliminate it.
- If your tool **saves its own memories**, review them now and then. Promote what is true into `AGENTS.md` or a project document, and delete what is wrong.
- If your tool relies mostly on **explicit controls**, you need _more_ discipline, not less. Every file load is a choice you have to make. The upside: you always know exactly what's on the table.
- If your tool supports **MCP** (most agentic tools now do), the [ContextQB MCP](contextqb://playbooks/build-mcp-for-project-context) plus any project-specific MCP servers give you the most precise context-loading mechanism available — pull specific resources by URI, only when needed.

A useful rule of thumb: **the more your tool does automatically, the less you can _see_ what's actually in the context** — which makes failure modes harder to diagnose. The more explicit your tool, the more work you do, but the easier it is to know exactly what the model is reasoning over.

The methodology from the previous section is designed to be tool-agnostic. Boot primers, status documents, ADRs, and deliberate session restarts work regardless of which tool you use. What changes per tool is _how much you can lean on the tool_ and _how much you have to do manually_. As tools mature, the manual share shrinks. It is not zero today, and won't be soon.

## How different models handle the context window

Like with [working styles](contextqb://guides/understanding-llms), models differ in how they handle long context, and window sizes differ by model ([current limits](contextqb://references/models#families)). A few patterns hold across them:

- **Structure helps every model.** Content with clear headers and named sections is easier to use than one long wall of text.
- **"In the window" is not "well attended to."** Finding one specific fact in a huge context is easier than reasoning evenly over all of it, and instructions buried mid-context are the first to be ignored.
- **Smaller and locally run models usually have much smaller windows.** You have to be more selective about what loads; disciplined context management is _mandatory_ there.

Match the model to the shape of the work. A one-off read of a very large document benefits from a large window. A long, careful refactor benefits from a careful model. A series of targeted small tasks doesn't need a huge window at all.

## Common mistakes

- **Pasting an entire log file when you wanted one error.** Now you're paying tokens for thousands of lines you didn't need, on every turn, and the actual signal is buried.
- **Starting a new chat and re-explaining from scratch.** You should have a handoff doc or `AGENTS.md` primer. If you don't, write one before you start the new chat.
- **Letting automatic compaction decide what survives.** Take control. Summarize into a status document and restart instead.
- **Assuming the agent remembers yesterday.** Some tools keep notes, but you can't count on which ones, or on their being right. If it matters, it's in a file the agent reads.
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
- [Guide: Choosing Your IDE and LLM](contextqb://guides/choosing-your-ide-and-llm) — choosing and wiring the tool and the model.
- [Guide: Understanding LLMs](contextqb://guides/understanding-llms) — model working styles and the cost shape.
- References (dated facts): [model families and context limits](contextqb://references/models#families), [what agents keep between sessions](contextqb://references/setup#agent-memory), [how agentic tools search a codebase](contextqb://references/tools#codebase-retrieval), [model API prices](contextqb://references/pricing#model-api).
