---
id: state-ownership
title: State Ownership
summary: For every piece of state, name a single owner. Derived state should be derived, not duplicated.
version: 0.1.0
category: state
audience:
  - novice-builder
  - agent
  - developer
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
  - separation-of-concerns
  - orchestration
  - anti-spaghetti
---

# State Ownership

State is where AI-generated applications fail most often. The visible symptom is "the UI is wrong" or "the data is stale." The hidden symptom is that no one owns the value, and three different parts of the system each think they do.

## The rule

**For every piece of state, you must be able to name its owner and its source.**

If you cannot, the state has no owner. That is the bug, even if the immediate symptom is something else.

## Categories of state

Treating these as the same thing is the source of most bugs:

| Kind                    | Where it lives                       | Who owns it                   |
| ----------------------- | ------------------------------------ | ----------------------------- |
| Server state            | The server                           | The server. You borrow it.    |
| Durable client state    | localStorage, IndexedDB, etc.        | A single client module.       |
| Shared transient state  | A store, context, or top-level state | The container that scopes it. |
| Local interaction state | A component's own state              | The component.                |
| Derived state           | Nowhere                              | It is computed, not owned.    |

## Rules of thumb

- **Don't duplicate state.** If it can be computed, compute it.
- **Don't sync state by hand.** If two places need the same value, lift it to a shared owner or fetch from the source.
- **Treat server state as borrowed.** Use a real data fetching layer (React Query, SWR, RSC, etc.) instead of hand-rolled caching.
- **Don't mix durability levels.** Transient interaction state and persisted state belong in different stores.

## How to ask an agent to enforce this

> For every piece of state used in this feature, fill in a table with columns: name, owner, source, durability (server / durable-client / shared-transient / local), and whether any duplicate or derived copies exist elsewhere. Flag any duplicates or undefined ownership.
