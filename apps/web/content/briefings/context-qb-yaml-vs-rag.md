---
id: context-qb-yaml-vs-rag
title: context.qb.yaml vs. RAG
summary: Both put information into the agent's context window, but they put very different kinds of information there. A manifest is a hand-curated map of the project's shape. RAG is automatic search over the project's content, sometimes through an index the tool builds. They complement each other; they don't compete.
version: 0.2.1
audience:
  - novice-builder
  - founder
  - operator
  - developer
journey_stage: 1
journey_rank: 0
framing: "How is context.qb.yaml different from RAG (codebase indexing)?"
tags:
  - context-window
  - rag
  - context-qb
related:
  - understanding-the-context-window
  - context-quarterback-the-onboarding-map
  - write-a-context-qb
  - mcp-vs-paste
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.6 (agent)"
  reviewer_notes: "2026-10-07 renewal B2 review correction (0.2.1; author self-checked; independent review pending; not operator-accepted): the boot row now says the manifest is re-read when needed after compaction or a lost context instead of staying for the whole session; the summary, opening, RAG rows and the example no longer assume an index is always built and rebuilt, since plain text search is allowed; the example reads the ADR from the repository instead of through the MCP, which serves the methodology rather than a project's own files. 2026-10-07 renewal B2 (0.2.0; author self-checked; independent review pending; not operator-accepted): code search described by category with a link to the tools reference instead of a product list; table no longer assumes embeddings, IDE-local storage or that the drift detector checks status prose; size row uses the spec's token guidance; repository example labelled; small-repo note added. 2026-10-06 renewal fast-track repair (0.1.1; author self-checked; independent review pending; not operator-accepted): corrected the boot step: tools may load AGENTS.md automatically; context.qb.yaml is read because AGENTS.md points to it; replaced the ~2 KB size with the spec's token guidance. Earlier notes describe the previous version: R3–R7 pass. The one briefing is good — single framed question, comparative table, complement-not-compete thesis, related: == See also. Evidence for 'grow the type' in G-05. R8 pending P4."
---

# context.qb.yaml vs. RAG

## The one-line answer

`context.qb.yaml` is a hand-curated **map**. RAG is automatic **search**, sometimes through an index the tool builds. Both put information into the agent's context window, but they put very different _kinds_ of information there.

## The fundamental difference

`context.qb.yaml` tells the agent the **shape** of your project. RAG tells the agent the **contents** of your project.

A manifest answers questions like:

- _What apps are in this repo?_
- _Which workspaces exist?_
- _What ADRs are in play?_
- _What's the deploy target?_
- _What's the current status of the course platform?_

— questions about structure, decisions, and current state.

RAG — here meaning any code search an agent tool runs for you: a semantic index, a fast text search or a generated map of the repository; each tool does it differently (see [how agentic tools search a codebase](contextqb://references/tools#codebase-retrieval)) — answers questions like:

- _Where in this codebase is rate limiting implemented?_
- _Show me the function that handles webhook signature verification._
- _What does the schema for the users table look like?_

— questions about specific code or content.

## Side-by-side

|                                 | `context.qb.yaml`                                                             | RAG / codebase indexing                                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Who creates it**              | You and your agent, deliberately                                              | The agent tool, automatically                                                                                   |
| **What's in it**                | Structured metadata (project, stack, tree, routes, decisions, status)         | Your code, searched directly or through embeddings of file chunks, a text index or a map, depending on the tool |
| **Granularity**                 | High-level: "the methodology lives in `packages/methodology/`"                | Fine-grained: "lines 42–67 of `src/api/webhooks.ts`"                                                            |
| **Size**                        | ~500–2,000 tokens for a typical repo (the format's own guidance)              | Whatever the tool searches; a few hundred to a few thousand tokens retrieved per query                          |
| **When it enters context**      | Read at session start; re-read when needed after compaction or a lost context | Queried on demand; chunks drop into context just-in-time                                                        |
| **Where it lives**              | Committed to the repo at `/context.qb.yaml`                                   | Any index is managed by the tool, not in git                                                                    |
| **How it changes**              | You edit it; the drift detector flags inconsistencies                         | Kept current by the tool — an index is rebuilt, a plain text search reads the files as they are                 |
| **Trustworthiness**             | High when kept current — the drift detector checks its structure              | Heuristic — the "most relevant chunks" might not be the actually-relevant ones                                  |
| **Survives switching tools**    | Yes — it's a plain file                                                       | No — each tool searches in its own way                                                                          |
| **Survives switching machines** | Yes                                                                           | Plain search needs nothing; an index only if the tool stores it for you                                         |
| **What it answers**             | "What _is_ this project?"                                                     | "Where _is_ this thing in this project?"                                                                        |

## How they work together

They're complementary. A well-set-up agent session uses both:

1. **Boot.** The agent tool loads `AGENTS.md` — many tools do this automatically ([which ones, and when](contextqb://references/setup#agents-md-support)); otherwise you ask the agent to read it — and a line near the top of `AGENTS.md` tells the agent to read `context.qb.yaml` next. The agent now knows the project shape — what workspaces exist, what decisions are in play, what the deploy story is. That's typically a few hundred to a couple of thousand tokens of high-signal context.
2. **Mid-session.** You ask "where does this app verify Stripe webhook signatures?" The agent uses the tool's code search to retrieve the relevant chunks of `route.ts` and `webhook-handler.ts`. Those chunks drop into context.
3. **Reasoning.** The agent now reasons with both — the **structural map** from the manifest plus the **specific code** from RAG. Without the manifest it would have to discover the project's shape from search results (lossy). Without RAG it would have to load whole files to find anything (expensive).

## A concrete example

This example uses ContextQB's own repository as it was laid out when this briefing was written; the paths and ADR are real there, not a template for yours.

The agent is asked: _"Add rate limiting to the kickoff signup endpoint."_

**Without `context.qb.yaml`, with RAG only:**

- Agent searches the code for "kickoff" and "signup."
- Finds chunks from `kickoff/page.tsx`, `kickoff-form.tsx`, maybe `api/enroll-free/route.ts`.
- Doesn't know that `/api/enroll-free` lives in `apps/courses`, not `apps/web`.
- Doesn't know there's an ADR about rate-limiting strategy.
- Makes a confident, plausible, **wrong-shaped** change.

**With `context.qb.yaml`, with RAG:**

- Agent boots reading the manifest. Sees that `apps/web` handles `/kickoff` and `apps/courses` handles `/api/enroll-free`. Sees that ADR-0013 governs kickoff signups. Sees the deploy target.
- Reads that ADR file from the repository.
- Searches for the specific endpoint with the right scope.
- Makes a change that respects the architecture.

## Why this matters for the methodology

`context.qb.yaml` and RAG aren't competitors. They're load-bearing in different ways:

- **The manifest pays off as the repo grows.** In a tiny repo an agent can find its way by listing files. Once there are several apps, packages or deploy targets, the map saves the agent from rediscovering the shape — and from guessing it wrong.
- **`context.qb.yaml` is what makes RAG usable.** A 100K-file repo without a structural map is a haystack. RAG retrieval works much better when the agent already knows the rough shape of the haystack.
- **RAG is what makes `context.qb.yaml` lean.** Without retrieval, you'd be tempted to stuff content into the manifest to make sure the agent has what it needs. With retrieval, the manifest can stay small and pointers-only — RAG (and explicit file mentions, and MCP) fetch the actual content when relevant.

The methodology bet is that **structured human-curated context + opportunistic machine-retrieved content** is the right division of labour. The manifest is the part you control deliberately. RAG is the part you let the machine handle. Both go into the context window; both have their failure modes; together they cover more ground than either alone.

## See also

- [Guide: Understanding the Context Window](contextqb://guides/understanding-the-context-window) — the deeper treatment of the underlying mechanics.
- [Principle: The Context Quarterback — Every Repo Has a Boot Manifest](contextqb://principles/context-quarterback-the-onboarding-map) — why the manifest exists at all.
- [Playbook: Write a context.qb for Your Repository](contextqb://playbooks/write-a-context-qb) — how to author one.
