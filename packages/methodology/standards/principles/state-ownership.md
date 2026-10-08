---
id: state-ownership
title: State Ownership
summary: For every piece of state, name a single owner. Derived state should be derived, not duplicated.
version: 0.1.2
category: state
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 2
journey_rank: 20
tags:
  - state
  - data-flow
anti_patterns:
  - Two components keep their own copies of the same data and slowly drift apart.
  - Server state is copied into client state and then "synced" by hand.
  - Derived values are stored in state instead of computed on render.
  - Multiple places update the same state value from different events.
agent_instructions:
  - For every piece of state, name its owner and its source.
  - Distinguish server state from client state. Treat server state as borrowed.
  - Distinguish transient interaction state from durable persisted state.
  - Never duplicate state that can be derived.
related:
  - ai-output-is-untrusted-code
  - anti-spaghetti
  - anti-spaghetti-review
  - application-security-baseline
  - architectural-hardening-loop
  - architecture-review
  - backend-architecture
  - bug-as-investigation
  - building-for-yourself-vs-others
  - documentation-for-agent-alignment
  - extension-architecture
  - extension-ui-audit
  - failure-modes
  - feature-build-loop
  - feature-planning
  - general-technical-audit
  - least-privilege-for-agents
  - map-your-attack-surface
  - orchestration
  - refactor-planning
  - secrets-have-provenance
  - separation-of-concerns
  - setting-up-git-and-github
  - state-management
  - ui-architecture
  - untrusted-by-default
  - where-your-data-lives
  - the-plan-is-the-contract
  - run-a-multi-agent-workflow
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.2 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 (0.1.2; author self-checked; independent review pending; not operator-accepted): preserved; the library list becomes 'the data-fetching layer your framework recommends' with a link to the dated data-fetching reference; localStorage and IndexedDB labelled as browser examples; one bridging sentence to where-your-data-lives (where the truth is stored vs who owns each copy while the app runs). Earlier notes (2026-09-09 epistemology review): R3–R7 pass. The state taxonomy table is the corpus reference. R8 pending P4."
---

# State Ownership

State is where AI-generated applications fail most often. The visible symptom is "the UI is wrong" or "the data is stale." The hidden symptom is that no one owns the value, and three different parts of the system each think they do.

## The rule

**For every piece of state, you must be able to name its owner and its source.**

If you cannot, the state has no owner. That is the bug, even if the immediate symptom is something else.

## Categories of state

This is a different question from [where your data lives](contextqb://guides/where-your-data-lives). That guide decides where the truth is stored; this table decides who owns each copy of it while the app is running.

Treating these as the same thing is the source of most bugs:

| Kind                    | Where it lives                                                        | Who owns it                   |
| ----------------------- | --------------------------------------------------------------------- | ----------------------------- |
| Server state            | The server                                                            | The server. You borrow it.    |
| Durable client state    | Device storage (in a browser, for example, localStorage or IndexedDB) | A single client module.       |
| Shared transient state  | A store, context, or top-level state                                  | The container that scopes it. |
| Local interaction state | A component's own state                                               | The component.                |
| Derived state           | Nowhere                                                               | It is computed, not owned.    |

## Rules of thumb

- **Don't duplicate state.** If it can be computed, compute it.
- **Don't sync state by hand.** If two places need the same value, lift it to a shared owner or fetch from the source.
- **Treat server state as borrowed.** Use the data-fetching layer your framework recommends instead of hand-rolled caching ([current libraries, dated](contextqb://references/tools#data-fetching)).
- **Don't mix durability levels.** Transient interaction state and persisted state belong in different stores.

## How to ask an agent to enforce this

> For every piece of state used in this feature, fill in a table with columns: name, owner, source, durability (server / durable-client / shared-transient / local), and whether any duplicate or derived copies exist elsewhere. Flag any duplicates or undefined ownership.
