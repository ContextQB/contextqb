---
id: state-ownership
title: State Ownership
summary: For every piece of state, name a single owner. Derived state should be derived, not duplicated.
version: 0.3.0
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

**State** here means any information the app holds while it runs: the items in a basket, the text being typed, whether a panel is open. Its **owner** is the one part of the app responsible for the current value. Its **source** is where that value comes from: a saved file, a server, or the person's typing.

## What it looks like from the outside

You don't need to read code to spot a state-ownership problem. Here is an invented example you have probably met in some form. In an online shop, you put a mug and a tea towel in your basket. You open the basket drawer at the side of the page and remove the mug. The drawer now shows only the tea towel. But the checkout summary on the same page still lists both items, with the higher total. Which basket will the shop try to submit when you press Pay?

- **Visible symptom:** two parts of the same page disagree about one thing, the current basket.
- **What went wrong:** in this example, inspecting the code shows that the drawer and the checkout summary each kept their own editable copy of the basket. Removing the mug updated the drawer's copy but not the checkout's. Each part acted as if it owned the basket, so in practice nobody did. The disagreement is the symptom; competing ownership is the cause, and it was established by that inspection. In a real app, the symptom alone would not prove this diagnosis; a slow server reply or a display bug could look similar.
- **The fix:** give the current basket one owner that both views read. A remove action goes through that owner. The drawer's item list and the checkout's total then both reflect the same accepted basket, and the total is calculated from the items rather than kept as a separate number. If the server owns the basket, the page may hold a temporary copy, but that copy is borrowed: it follows the server's accepted result, and if a removal fails, the page says so instead of showing a basket the server never accepted.

A shared owner keeps the two views in agreement. It does not, by itself, show that prices, stock levels or payment processing are correct; those need their own checks.

**A question you can ask your agent:** "Which part owns the current basket, where does its accepted value come from, and how do both views receive a change?" Replace “basket” with the shared information in your own app: a list of jobs, a booking, a document's title.

A responsive answer names **one** owner: a file or module in the app's code, or the server, responsible for the current value (not just “the database”). It says where that owner gets the value from (its source), lists the views that read from it, and explains the mechanism that brings a change to every view. Answers like "they're kept in sync," "it refreshes on reload," or a list of several places holding copies haven't established that yet. Copies can be fine when one owner hands them out and refreshes them, as the categories below show. So treat these answers as incomplete, not as proof of a bug, and ask a follow-up: "Which one piece of code owns the current value, what is its source, and what exactly updates the other copies after a change?" If the agent can't name one owner, ask it to propose one.

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
