---
id: changing-software-without-losing-control
title: Changing Software Without Losing Control
summary: Choose a worthwhile maintenance change, preserve the behavior people rely on and check the result before accepting a cleaner-looking implementation.
version: 0.2.0
audience: [novice-builder, founder, operator]
journey_stage: 6
journey_rank: 0
intro: "Once a feature works, each change has two jobs: deliver the improvement and preserve the promises you still intend to keep."
related:
  - anti-spaghetti-review
  - change-stored-data-safely
  - feature-planning
  - how-to-use-contextqb
  - maintainability
  - operating-a-small-app
  - refactor-planning
  - refactor-with-duplicates
  - review-an-agent-workstream
  - rollback-vs-restore
  - testing-agent-built-software
  - update-a-dependency-safely
  - work-with-agents-through-documentation
tags: [refactor, maintainability]

---

# Changing Software Without Losing Control

**Plain language:** A working feature gives you something valuable to protect. Before asking an agent to improve it, name the problem, the benefit of changing it and the behavior that must stay the same. Sometimes the right maintenance decision is to leave it alone.

## Name the kind of change

Start with a feature you have accepted and the checks explained in [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software).

This guide uses one invented example. A small packing team uses an app to work out how many cartons an order needs. Each carton holds six identical items, so seven items need two cartons: one full carton and another holding the remaining item. Both the order screen and the printable packing sheet show that number. If the app reports too few cartons, someone at the packing bench finds the order does not fit. Nothing here is built, and you don't need to build it. A **regression** is a change that breaks something that previously worked. Your existing checks are a starting point for detecting one; they do not automatically cover everything the new change touches.

Different reasons call for different instructions:

- **A defect fix** brings behavior back into line with a requirement. “The order screen accepts a negative quantity, but an order can't contain fewer than zero items.”
- **A feature change** intentionally changes what people can do. “Support a second carton size that holds twelve items.”
- **A refactor** changes the internal organization without changing what the software observably does. If you decide some current behavior is wrong, correcting it is a separate defect fix. “Move the duplicated carton calculation into one shared function” is a refactor when the results stay the same. Martin Fowler's [refactoring definition](https://refactoring.com/) uses this distinction.
- **A dependency update** replaces software the project relies on with a different version, such as the library that formats the printable sheet. Follow [Update a Dependency Safely](contextqb://playbooks/update-a-dependency-safely), including any compatibility work it requires.

A refactor can support a future feature, but keep their acceptance decisions separate. If a second carton size is new behavior, it needs its own requirements. Calling the whole change “cleanup” makes it harder to tell whether a difference was intended.

## Choose a problem worth solving

**Technical debt** is a useful name for a design or implementation choice that makes later work more costly or risky. Show the cost: two copies of a rule have diverged, a small change repeatedly touches unrelated files, or nobody can identify the owner of saved state. The [Anti-Spaghetti Review](contextqb://prompts/anti-spaghetti-review) can investigate those symptoms. A long file or an agent's preference for another framework is not, by itself, a reason to rebuild the product.

Compare the cost of leaving the problem with the cost and risk of changing it. [Maintainability](contextqb://principles/maintainability) explains why understandable boundaries matter. For a first release, fixing a demonstrated loss of work may deserve attention immediately; reorganizing a working screen that nobody struggles to change may wait.

Here is an **illustrative decision** for the packing app, not a report of a real project:

```text
Symptom: the order screen and the packing sheet each calculate cartons.
Evidence: the copies match today; the planned carton-size feature would
          have to change both.
Decision: propose one shared calculation, preserving today's results.
Scope: this calculation and its two callers; no order-screen redesign and
       no change to carton capacity.
Checks: 0, 1, 6, 7 and 12 items give the agreed carton counts; both
        callers use the accepted function.
Recovery: keep the old calculations until the replacement and callers
          are checked.
Deferred: renaming every folder; no demonstrated benefit to this change.
```

You could reasonably defer even this refactor if the carton-size feature is uncertain and the duplication causes little trouble. Record why and what would make you revisit it. The decision should follow the product's needs.

## Decide what to preserve before you refactor

A **characterization test** records what the current code does. It helps reveal a change in behavior, but current behavior can contain a defect. Compare those observations with the product requirement before deciding what must be preserved. Separate a discovered defect into an explicit decision rather than silently fixing it inside the refactor or declaring it correct because an old test passes.

Use [Plan a Refactor Without Rewriting the Whole Repo](contextqb://playbooks/refactor-planning) to scope and sequence the work. [Refactor With Duplicates, Not Overwrites](contextqb://principles/refactor-with-duplicates) supplies the replacement pattern: keep the old implementation available, move callers in small steps, verify, then remove the old path separately. A **caller** is a part of the program that asks another part to do work.

Comparing two pure calculations is different from doing a real action twice. Do not run old and new versions against the same live write, email or charge just to compare them. Use isolated test inputs, controlled storage and the relevant failure checks; keep one owner of each real effect.

## Worked comparison: a one-word change breaks the promise

The agent proposes moving the two duplicated calculations into one shared function, and in doing so writes the calculation slightly differently. A refactor must preserve the agreed result, so compare them. The following two functions are **illustrative**. Both take the number of items in an order and return the number of cartons:

```js
function currentCartons(itemCount) {
  return Math.ceil(itemCount / 6);
}

function proposedCartons(itemCount) {
  return Math.round(itemCount / 6);
}
```

`itemCount / 6` divides the items by the carton capacity; seven items give about 1.17. `Math.ceil` rounds **up** to the next whole number, so 1.17 becomes 2: any leftover items get a carton of their own. `Math.round` rounds to the **nearest** whole number, so 1.17 becomes 1. For seven items, the current function says two cartons and the proposed one says one. The two functions look almost identical, and the change is a single word, yet the proposed one reports a number of cartons the order cannot fit into. That is a semantic regression: the code's structure is unchanged, but its meaning, and the promise to the packing team, is not.

Write the expected results before running either function:

- 0 items: 0 cartons.
- 1 item: 1 carton.
- 6 items: 1 carton.
- 7 items: 2 cartons.
- 12 items: 2 cartons.

Ask the agent to run both functions against those expectations in a disposable exercise, without touching any real orders. The current function meets all five. The proposed one fails two: it gives 0 cartons for 1 item and 1 carton for 7 items. A comparison that checked only 6 and 12, where both functions agree, would miss the difference entirely. You can inspect the inputs, expected values and differences without having to understand every line of the application.

This comparison assumes the quantity has already been checked to be a whole number of zero or more. Whether the order screen enforces that is a separate check, and a negative quantity getting through would be the defect described earlier, not part of this refactor.

The decision is to reject that replacement as behavior-preserving. Ask for a correction, then repeat the comparison. Finally check that both real callers, the order screen and the packing sheet, use the accepted function, in a safe copy of the app. Passing the small calculation alone does not show that the printed sheet was updated.

For your own maintenance task, decide first whether you want an intentional new behavior or an internal change that must leave behavior intact, and write expected results that would reveal the difference.

## Finish with a bounded decision

For intentional new behavior, [Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning) owns the brief. A stored-format change needs [Change Stored Data Safely](contextqb://playbooks/change-stored-data-safely). [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) explains why returning code to an earlier version may not recover data or reverse an outside action.

Have a fresh session that did not make the change, or another qualified person, review the result; [Review an Agent Workstream Result](contextqb://prompts/review-an-agent-workstream) provides the structure. Inspect the agreed checks, relevant interactions and remaining unknowns. Accept the change, request a correction or defer it with a reason.

Leave a short record of the problem, scope, preserved promises, evidence, decision and any temporary duplicate's owner and removal condition. [Work With Agents Through Documentation](contextqb://guides/work-with-agents-through-documentation) keeps that decision available to the next session. The useful outcome is a justified maintenance action or deferral, with enough evidence to explain it.
