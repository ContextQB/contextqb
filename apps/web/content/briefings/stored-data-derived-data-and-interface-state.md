---
id: stored-data-derived-data-and-interface-state
title: Stored Data, Derived Data and Interface State
summary: Distinguish what your app remembers, what it calculates and what belongs to the current interaction.
version: 0.3.0
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

A saved record, the text someone is still typing and the number of matching records may appear on the same screen. They do not have the same job. If the agent treats them as interchangeable, a reload can lose work or two parts of the app can disagree.

## Classify the value by its purpose

Take one invented example. Imagine a household task board that a family shares. It remembers jobs such as “Replace the hallway bulb,” each marked finished or unfinished. You can filter the board to show only unfinished jobs, see how many match, and start typing a new job in a box at the top. All those values appear on one screen, but they serve different purposes. Nothing needs to be built to follow this page.

- **Stored data** is kept for later. The saved jobs and their completion status must still exist tomorrow; a board that forgot them overnight would be useless.
- **Derived data** is calculated from other information. The number of unfinished jobs can be counted from the saved jobs. If the board loads only the first 20 jobs, counting those 20 is not automatically the total across storage.
- **Interface state** describes the current interaction, such as the selected filter, the open tab or the job you are still typing. You may decide to remember the filter next time, or to preserve an unfinished job if the page closes, but that is an additional product decision, not a consequence of the values appearing on screen.

These are questions about purpose, not mutually exclusive storage technologies. A user preference can begin as interface state and intentionally be stored. A calculated value can be cached for performance, but then its freshness and invalidation need an owner. That is a deliberate design choice, not a reason to duplicate every value.

## Catch the mistaken ownership proposal

Suppose the agent proposes saving a separate `unfinishedTotal` and reducing it by one whenever the Complete button is pressed. If the actual update to the job fails, the total still falls, even though the job is still unfinished. The board now shows one fewer job to do than really exists. Deleting a job or reopening a finished one creates more chances for the two to disagree. Calculating the total from the saved jobs avoids that particular disagreement; a larger system that caches the count needs an explicit owner and a way to keep it current. Ask which source defines the count and why it cannot be calculated from that source. [State Ownership](contextqb://principles/state-ownership) holds the canonical ownership rules.

Classify these five values from the task board: a saved job and its completion status, the new job still being typed, the selected “Unfinished” filter, the count of unfinished jobs shown and a “Saving…” indicator. Explain which should survive reopening, which can be calculated and which belong to the current interaction. Then pick one screen in your own app and do the same. If you decide to preserve drafts, add that requirement deliberately and consider where their private contents will live.

Record the decisions in the existing data or state map. When inspecting implemented code, the [State Management Audit](contextqb://audits/state-management) can locate actual owners and duplicates. A plausible classification exercise is not evidence that the implementation follows it.
