---
id: stored-data-derived-data-and-interface-state
title: Stored Data, Derived Data and Interface State
summary: Distinguish what your app remembers, what it calculates and what belongs to the current interaction.
version: 0.2.1
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

Take one invented example. Maya is a fictional first-time founder deciding which problem her business should solve for small independent bakeries. She keeps a small personal research notebook, used only by her: each saved entry pairs one source she learned from, such as a conversation with a bakery owner, with her own note about what it showed. Its promise is that she can find that evidence again when she decides. Her first version's screen shows a list of saved entries, a form for a new entry and a message while saving.

To give this page more values to classify, imagine one later addition that her first feature deliberately leaves out. Once she has dozens of entries, she wants to see every conversation where one problem came up, so a filter shows only entries containing a word such as “spreadsheet”, with a count of matching entries. The filter is imagined here for this exercise; it is not part of her first feature, and nothing needs to be built. The entry's fields are defined in [Designing Your App's Data](contextqb://guides/designing-your-apps-data); you don't need them to follow this page.

- **Stored data** is kept for later. Each entry's saved title and note need to survive reopening, because finding them later is the point of the notebook.
- **Derived data** is calculated from other information. The count of records matching a filter can be calculated from the matching records. If only one page of results is loaded, its count is not automatically the total across storage.
- **Interface state** describes the current interaction, such as the selected tab, current filter or unfinished form. Decide explicitly whether any of it should also be saved for later.

These are questions about purpose, not mutually exclusive storage technologies. A user preference can begin as interface state and intentionally be stored. A calculated value can be cached for performance, but then its freshness and invalidation need an owner. That is a deliberate design choice, not a reason to duplicate every value.

## Catch the mistaken ownership proposal

Suppose the agent proposes storing a second `noteCount` and incrementing it whenever the Save button is pressed. A rejected save or a later deletion can make it disagree with the records. Ask which source defines the count and why it cannot be calculated from that source. [State Ownership](contextqb://principles/state-ownership) holds the canonical ownership rules.

Classify these five values before asking the agent: a saved entry, the unfinished replacement text, the selected tab, the count of displayed matches and a “Saving…” indicator. Explain which should survive reopening under your current promise. If you decide to preserve drafts, add that requirement deliberately and consider where their private contents will live.

Record the decisions in the existing data or state map. When inspecting implemented code, the [State Management Audit](contextqb://audits/state-management) can locate actual owners and duplicates. A plausible classification exercise is not evidence that the implementation follows it.
