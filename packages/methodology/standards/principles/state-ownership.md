---
id: state-ownership
title: State Ownership
summary: For every piece of state, name a single owner. Derived state should be derived, not duplicated.
version: 0.2.1
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
  - how-the-parts-of-your-app-work-together
  - least-privilege-for-agents
  - map-your-attack-surface
  - orchestration
  - refactor-planning
  - run-a-multi-agent-workflow
  - secrets-have-provenance
  - separation-of-concerns
  - setting-up-git-and-github
  - state-management
  - stored-data-derived-data-and-interface-state
  - the-plan-is-the-contract
  - ui-architecture
  - untrusted-by-default
  - where-your-data-lives

---

# State Ownership

State is where AI-generated applications fail most often. The visible symptom is "the UI is wrong" or "the data is stale." The hidden symptom is that no one owns the value, and three different parts of the system each think they do.

## The rule

**For every piece of state, you must be able to name its owner and its source.**

If you cannot, the state has no owner. That is the bug, even if the immediate symptom is something else.

**State** here means any information the app holds while it runs: the entries on screen, the text being typed, whether a panel is open. Its **owner** is the one part of the app responsible for the current value. Its **source** is where that value comes from: a saved file, a server, or the person's typing.

## What it looks like from the outside

You don't need to read code to spot a state-ownership problem. Here is an invented example. Maya, a fictional founder, keeps a small research notebook app: each entry is a source she has read plus her note about it. A later version lets her correct an entry's title. She opens an entry, changes "Bakery call, March 4" to "Bakery owner call, March 4", and presses Save. The edit screen shows the new title. The list of entries beside it still shows the old one until she closes and reopens the app.

- **Visible symptom:** two parts of the same screen disagree about one value.
- **What went wrong:** the list and the edit screen each kept their own copy of the entries. Saving updated the edit screen's copy and the saved file, but nothing told the list. Each part acted as if it owned the entries, so in practice nobody did.
- **The fix:** give the entries one owner, a single part of the app that loads them, saves them and hands the current values to every screen that shows them. After a save, the list and the edit screen both read the new title from that owner. If a screen holds a copy for speed, it is borrowed from the owner and refreshed when the owner changes; no screen updates its own copy independently.

**A question you can ask your agent:** "Where does an entry's title live while the app is running, and which screens read it from there? If I change it on one screen, what makes every other screen show the new value?"

A responsive answer names **one** owner: a file or module in the app's code that is responsible for the current entries (not the saved data file itself). It says where that owner gets the value from (its source, such as the saved file), lists the screens that read from it, and explains the mechanism that brings a change to every screen. Answers like "they're kept in sync," "it refreshes on reload," or a list of several places holding copies haven't established that yet. Copies can be fine when one owner hands them out and refreshes them, as the categories below show. So treat these answers as incomplete, not as proof of a bug, and ask a follow-up: "Which one piece of code owns the current entries, what is its source, and what exactly updates the other copies after a save?" If the agent can't name one owner, ask it to propose one.

## Categories of state

The rest of this page is reference depth for you and your agent: the kinds of state an app holds and who should own each.

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
