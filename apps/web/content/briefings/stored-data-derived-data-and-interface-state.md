---
id: stored-data-derived-data-and-interface-state
title: Stored Data, Derived Data and Interface State
summary: Distinguish what your app remembers, what it calculates and what belongs to the current interaction.
version: 0.1.2
audience: [novice-builder, founder, operator]
journey_stage: 2
journey_rank: 20
framing: Which values should survive reopening, and which can be calculated or discarded?
tags: [state, getting-started]
related:
  - designing-your-apps-data
  - making-your-app-usable
  - state-management
  - state-ownership
---

# Stored Data, Derived Data and Interface State

The note someone saved, the text they are still typing and the number of matching notes may appear on the same screen. They do not have the same job. If the agent treats them as interchangeable, a reload can lose work or two parts of the app can disagree.

## Classify the value by its purpose

Use the notebook's dictionary from [Designing Your App's Data](contextqb://guides/designing-your-apps-data):

- **Stored data** is kept for later. The saved title and note need to survive reopening under the promise of this feature.
- **Derived data** is calculated from other information. The count of records matching a filter can be calculated from the matching records. If only one page of results is loaded, its count is not automatically the total across storage.
- **Interface state** describes the current interaction, such as the selected tab, current filter or unfinished form. Decide explicitly whether any of it should also be saved for later.

These are questions about purpose, not mutually exclusive storage technologies. A user preference can begin as interface state and intentionally be stored. A calculated value can be cached for performance, but then its freshness and invalidation need an owner. That is a deliberate design choice, not a reason to duplicate every value.

## Catch the mistaken ownership proposal

Suppose the agent proposes storing a second `noteCount` and incrementing it whenever the Save button is pressed. A rejected save or a later deletion can make it disagree with the records. Ask which source defines the count and why it cannot be calculated from that source. [State Ownership](contextqb://principles/state-ownership) holds the canonical ownership rules.

Classify these five values before asking the agent: a saved note, the unfinished replacement text, the selected tab, the count of displayed matches and a “Saving…” indicator. Explain which should survive reopening under your current promise. If you decide to preserve drafts, add that requirement deliberately and consider where their private contents will live.

Record the decisions in the existing data or state map. When inspecting implemented code, the [State Management Audit](contextqb://audits/state-management) can locate actual owners and duplicates. A plausible classification exercise is not evidence that the implementation follows it.
