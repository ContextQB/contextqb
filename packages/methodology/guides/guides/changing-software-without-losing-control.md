---
id: changing-software-without-losing-control
title: Changing Software Without Losing Control
summary: Choose a worthwhile maintenance change, preserve the behavior people rely on and check the result before accepting a cleaner-looking implementation.
version: 0.1.1
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

Start with a feature you have accepted and the checks explained in [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software). A **regression** is a change that breaks something that previously worked. Your existing checks are a starting point for detecting one; they do not automatically cover everything the new change touches.

Different reasons call for different instructions:

- **A defect fix** brings behavior back into line with a requirement. “A blank note should be rejected, but a tab character gets through.”
- **A feature change** intentionally changes what people can do. “Let me search the titles of saved notes.”
- **A refactor** changes the internal organization without changing what the software observably does. If you decide some current behavior is wrong, correcting it is a separate defect fix. “Move the duplicated validation rule into one place” is a refactor when the behavior stays the same. Martin Fowler's [refactoring definition](https://refactoring.com/) uses this distinction.
- **A dependency update** replaces software the project relies on with a different version. Follow [Update a Dependency Safely](contextqb://playbooks/update-a-dependency-safely), including any compatibility work it requires.

A refactor can support a future feature, but keep their acceptance decisions separate. If searching is new behavior, it needs its own requirements. Calling the whole change “cleanup” makes it harder to tell whether a difference was intended.

## Choose a problem worth solving

**Technical debt** is a useful name for a design or implementation choice that makes later work more costly or risky. Show the cost: two copies of a rule have diverged, a small change repeatedly touches unrelated files, or nobody can identify the owner of saved state. The [Anti-Spaghetti Review](contextqb://prompts/anti-spaghetti-review) can investigate those symptoms. A long file or an agent's preference for another framework is not, by itself, a reason to rebuild the product.

Compare the cost of leaving the problem with the cost and risk of changing it. [Maintainability](contextqb://principles/maintainability) explains why understandable boundaries matter. For a first release, fixing a demonstrated loss of work may deserve attention immediately; reorganizing a working screen that nobody struggles to change may wait.

Here is an **illustrative decision** for the notebook, not a report of a real project:

```text
Symptom: after a later edit feature, add-note and edit-note duplicate the rule.
Evidence: the copies match today; the next planned change would edit both.
Decision: propose one shared rule, preserving today's agreed behavior.
Scope: validation and its two callers; no storage-format or screen redesign.
Checks: blank input, ordinary input, whitespace and saved text unchanged.
Recovery: retain the old paths until the replacement and callers are checked.
Deferred: rename every folder; no demonstrated benefit to this change.
```

You could reasonably defer even this refactor if the next change is uncertain and the duplication causes little trouble. Record why and what would make you revisit it. The decision should follow the product's needs.

## Decide what to preserve before you refactor

A **characterization test** records what the current code does. It helps reveal a change in behavior, but current behavior can contain a defect. Compare those observations with the product requirement before deciding what must be preserved. Separate a discovered defect into an explicit decision rather than silently fixing it inside the refactor or declaring it correct because an old test passes.

Use [Plan a Refactor Without Rewriting the Whole Repo](contextqb://playbooks/refactor-planning) to scope and sequence the work. [Refactor With Duplicates, Not Overwrites](contextqb://principles/refactor-with-duplicates) supplies the replacement pattern: keep the old implementation available, move callers in small steps, verify, then remove the old path separately. A **caller** is a part of the program that asks another part to do work.

Comparing two pure calculations is different from doing a real action twice. Do not run old and new versions against the same live write, email or charge just to compare them. Use isolated test inputs, controlled storage and the relevant failure checks; keep one owner of each real effect.

## Worked comparison: a shorter function changes the promise

The notebook's rule is that the note must contain something other than whitespace. Whitespace includes spaces, tabs and line breaks; spacing inside a valid note should survive. The following two functions are **illustrative**. Both return an object describing whether the text is valid and what text would be saved:

```js
function currentRule(text) {
  const note = text.trim();
  return { isValid: note.length > 0, note };
}

function proposedRule(text) {
  const note = text.replaceAll(" ", "");
  return { isValid: note.length > 0, note };
}
```

`trim()` removes whitespace at the ends. `replaceAll(" ", "")` removes every ordinary space, including spaces between words, and leaves tabs untouched. Use these expected results before running either function:

- Input `"   "`: invalid, with an empty saved-text candidate.
- Input `"\t"` (one tab): invalid, with an empty saved-text candidate.
- Input `"  field  notes  "`: valid, with the text `"field  notes"`, preserving the two internal spaces.

Ask the agent to run both functions against those expectations in a disposable exercise, without writing any actual notes. The proposed rule should fail the tab and internal-spacing cases. A comparison that checks only ordinary single-word text misses both problems. You can inspect the inputs, expected values and differences without having to understand every line of the application.

The decision is to reject that replacement as behavior-preserving. Ask for a correction, then repeat the comparison. Finally check the actual callers and the save-and-reopen task in a safe app copy. Passing these tiny functions alone does not establish that the interface calls the replacement or that stored records remain intact.

## Finish with a bounded decision

For intentional new behavior, [Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning) owns the brief. A stored-format change needs [Change Stored Data Safely](contextqb://playbooks/change-stored-data-safely). [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) explains why returning code to an earlier version may not recover data or reverse an outside action.

Have a fresh session that did not make the change, or another qualified person, review the result; [Review an Agent Workstream Result](contextqb://prompts/review-an-agent-workstream) provides the structure. Inspect the agreed checks, relevant interactions and remaining unknowns. Accept the change, request a correction or defer it with a reason.

Leave a short record of the problem, scope, preserved promises, evidence, decision and any temporary duplicate's owner and removal condition. [Work With Agents Through Documentation](contextqb://guides/work-with-agents-through-documentation) keeps that decision available to the next session. The useful outcome is a justified maintenance action or deferral, with enough evidence to explain it.
