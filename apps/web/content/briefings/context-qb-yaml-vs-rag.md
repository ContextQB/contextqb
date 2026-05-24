---
id: context-qb-yaml-vs-rag
title: context.qb.yaml vs. RAG
summary: Both put information into the agent's context window, but they put very different kinds of information there. A manifest is a hand-curated map of the project's shape. RAG is an auto-generated search index over the project's content. They complement each other; they don't compete.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - developer
framing: "How is context.qb.yaml different from RAG (codebase indexing)?"
tags:
  - context-window
  - rag
  - context-qb
related:
  - understanding-the-context-window
  - context-quarterback-the-onboarding-map
  - write-a-context-qb
---

# context.qb.yaml vs. RAG

## The one-line answer

`context.qb.yaml` is a hand-curated **map**. RAG is an auto-generated **search index**. Both put information into the agent's context window, but they put very different _kinds_ of information there.

## The fundamental difference

`context.qb.yaml` tells the agent the **shape** of your project. RAG tells the agent the **contents** of your project.

A manifest answers questions like:

- _What apps are in this repo?_
- _Which workspaces exist?_
- _What ADRs are in play?_
- _What's the deploy target?_
- _What's the current status of the course platform?_

— questions about structure, decisions, and current state.

RAG (codebase indexing, semantic retrieval — the thing that powers Cursor's `@codebase`, Copilot's `@workspace`, and Aider's repo-map) answers questions like:

- _Where in this codebase is rate limiting implemented?_
- _Show me the function that handles webhook signature verification._
- _What does the schema for the users table look like?_

— questions about specific code or content.

## Side-by-side

|                                 | `context.qb.yaml`                                                     | RAG / codebase indexing                                                                         |
| ------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Who creates it**              | A human, deliberately                                                 | The IDE, automatically                                                                          |
| **What's in it**                | Structured metadata (project, stack, tree, routes, decisions, status) | Vector embeddings of file chunks                                                                |
| **Granularity**                 | High-level: "the methodology lives in `packages/methodology/`"        | Fine-grained: "lines 42–67 of `src/api/webhooks.ts`"                                            |
| **Size**                        | ~1–2 KB                                                               | Megabytes-to-gigabytes in the index; a few hundred to a few thousand tokens retrieved per query |
| **When it enters context**      | Read once at session start; stays for the whole session               | Queried on demand; chunks drop into context just-in-time                                        |
| **Where it lives**              | Committed to the repo at `/context.qb.yaml`                           | In the IDE's local storage; not in git                                                          |
| **How it changes**              | You edit it; the drift detector flags inconsistencies                 | Auto-rebuilt when files change                                                                  |
| **Trustworthiness**             | High — curated and machine-validated against the repo                 | Heuristic — the "most relevant chunks" might not be the actually-relevant ones                  |
| **Survives switching IDE**      | Yes — it's a plain file                                               | No — the index is IDE-specific                                                                  |
| **Survives switching machines** | Yes                                                                   | No — typically rebuilt on each machine                                                          |
| **What it answers**             | "What _is_ this project?"                                             | "Where _is_ this thing in this project?"                                                        |

## How they work together

They're complementary. A well-set-up agent session uses both:

1. **Boot.** The IDE reads `context.qb.yaml` (and `AGENTS.md`) automatically. The agent now knows the project shape — what workspaces exist, what decisions are in play, what the deploy story is. That's ~2 KB of high-signal context.
2. **Mid-session.** You ask "where does this app verify Stripe webhook signatures?" The agent uses the IDE's RAG to retrieve the relevant chunks of `route.ts` and `webhook-handler.ts`. Those chunks drop into context.
3. **Reasoning.** The agent now reasons with both — the **structural map** from the manifest plus the **specific code** from RAG. Without the manifest it would have to discover the project's shape from indexing artifacts (lossy). Without RAG it would have to load whole files to find anything (expensive).

## A concrete example

The agent is asked: _"Add rate limiting to the kickoff signup endpoint."_

**Without `context.qb.yaml`, with RAG only:**

- Agent searches the index for "kickoff" and "signup."
- Finds chunks from `kickoff/page.tsx`, `kickoff-form.tsx`, maybe `api/enroll-free/route.ts`.
- Doesn't know that `/api/enroll-free` lives in `apps/courses`, not `apps/web`.
- Doesn't know there's an ADR about rate-limiting strategy.
- Makes a confident, plausible, **wrong-shaped** change.

**With `context.qb.yaml`, with RAG:**

- Agent boots reading the manifest. Sees that `apps/web` handles `/kickoff` and `apps/courses` handles `/api/enroll-free`. Sees that ADR-0013 governs kickoff signups. Sees the deploy target.
- Pulls the ADR via the MCP (or by reading the file directly).
- Queries the index for the specific endpoint with the right scope.
- Makes a change that respects the architecture.

## Why this matters for the methodology

`context.qb.yaml` and RAG aren't competitors. They're load-bearing in different ways:

- **`context.qb.yaml` is what makes RAG usable.** A 100K-file repo without a structural map is a haystack. RAG retrieval works much better when the agent already knows the rough shape of the haystack.
- **RAG is what makes `context.qb.yaml` lean.** Without retrieval, you'd be tempted to stuff content into the manifest to make sure the agent has what it needs. With retrieval, the manifest can stay small and pointers-only — RAG (and explicit file mentions, and MCP) fetch the actual content when relevant.

The methodology bet is that **structured human-curated context + opportunistic machine-retrieved content** is the right division of labour. The manifest is the part you control deliberately. RAG is the part you let the machine handle. Both go into the context window; both have their failure modes; together they cover more ground than either alone.

## See also

- [Guide: Understanding the Context Window](contextqb://guides/understanding-the-context-window) — the deeper treatment of the underlying mechanics.
- [Principle: The Context Quarterback — Every Repo Has a Boot Manifest](contextqb://principles/context-quarterback-the-onboarding-map) — why the manifest exists at all.
- [Playbook: Write a context.qb for Your Repository](contextqb://playbooks/write-a-context-qb) — how to author one.
