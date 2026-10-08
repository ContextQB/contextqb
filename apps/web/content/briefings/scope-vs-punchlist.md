---
id: scope-vs-punchlist
title: Scope vs. Punchlist
summary: A scope is the contract you write before the build; a punchlist is the remediation list you write at the end of one. Most governance documents are scopes; true punchlists are rare. Naming yours correctly is what keeps the archive navigable.
version: 0.2.0
audience:
  - operator
  - developer
  - founder
  - agent
journey_stage: 2
journey_rank: 10
framing: "ContextQB talks about scopes and punchlists — which document am I actually writing?"
tags:
  - documentation
  - governance
  - naming
related:
  - append-dont-overwrite
  - documentation-file-naming
  - write-an-adr
  - feature-planning
  - run-an-agent-workstream
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review Q5 (authored 2026-09-09)"
  reviewer_notes: "2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): opens with what a first-project reader needs (write the scope before the build; you may never need a punchlist); 'the convention this repo uses' becomes ContextQB's convention; the workstream paragraph is one sentence; review provenance neutralised. Earlier notes: Maintainer-approved for publish 2026-09-09. Authored from G-05 (grow briefings). Canonises the ADR-0025 vocabulary distinction that documentation-file-naming and the scopes README rely on. 2026-10-02: body cross-references to the agent workstream method were added (those diffs were inspected in an independent final QA of the workstream vertical) and then finalized for publication (a wording edit that postdates that QA). The whole atom was not re-reviewed; last_reviewed reflects the earlier review."
---

# Scope vs. Punchlist

## The one-line answer

**If this is your first project:** write a scope before the agent builds anything. You may never need a punchlist.

A **scope** is written before the work: what we're building, what it touches, what's out of bounds. A **punchlist** is written near the end: the specific defects between "it works" and "it's done." If the document exists before the build, it's a scope. If it exists because the build almost passed inspection, it's a punchlist.

## The construction origin

Both terms come from construction, and the construction meaning is the whole point:

- The **scope** (scope of work) is agreed before anyone picks up a tool. It says what will be built, what it will and won't include, and what risks are accepted.
- The **punchlist** is the walk-through at the end: the door sticks, the paint is thin by the window, the outlet in the hall is dead. Small, specific, verifiable items between "substantially complete" and "done."

A pre-build remediation list is a contradiction. A post-build plan is a scope for the _next_ build.

## Side-by-side

|                  | Scope                                           | Punchlist                                      |
| ---------------- | ----------------------------------------------- | ---------------------------------------------- |
| **Written**      | Before the work starts                          | At the end, when the work is nearly done       |
| **Contents**     | Goal, surfaces, state plan, risks, out-of-scope | Specific defects, each small enough to verify  |
| **Answers**      | "What are we building, and why this shape?"     | "What exactly is left before we ship?"         |
| **Lifetime**     | Lives and is updated through the build          | Burns down to zero, then is archived           |
| **Failure mode** | Missing → the agent invents the boundaries      | Missing → "done" means "nobody looked closely" |

## Why the naming matters

In an agentic project, these documents are load-bearing: agents read them to decide what to do next. A file named `PUNCHLIST.md` that actually contains a pre-build plan misleads every future reader — human or agent — about which part of the timeline they're in. The [documentation-file-naming](contextqb://principles/documentation-file-naming) principle exists because the second document of any kind always arrives; the name has to survive that arrival.

ContextQB's convention (one reasonable choice, not a requirement):

- Scopes live in `docs/scopes/`, named `NNNN-<slug>.md` when they implement an ADR or `<descriptive-slug>.md` otherwise.
- Punchlists are rare and usually live embedded in the scope's tranche history until they outgrow it — see [Append, Don't Overwrite](contextqb://principles/append-dont-overwrite) for how finished ones archive.

## The deeper reason

The vocabulary is a checksum on the process. If you can't tell whether you're writing a scope or a punchlist, the uncertainty is probably real: you may be planning remediation for a build you haven't specified yet. Name the document correctly and the process question answers itself. For the pre-build contract's shape, the [feature-planning](contextqb://playbooks/feature-planning) playbook's seven sections are the default; [write-an-adr](contextqb://playbooks/write-an-adr) covers the decision records scopes anchor to.

When the work spans several assignments or sessions, each scope is one authorized piece of a larger [agent workstream](contextqb://playbooks/run-an-agent-workstream), whose record keeps the objective and next action visible.

## See also

- [Principle: Documentation File Naming](contextqb://principles/documentation-file-naming) — the naming rule this distinction leans on
- [Principle: Append, Don't Overwrite](contextqb://principles/append-dont-overwrite) — where finished scopes and punchlists go
- [Playbook: Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning) — the default scope shape
- [Playbook: Write an Architectural Decision Record](contextqb://playbooks/write-an-adr) — the decisions scopes anchor to
