---
id: anti-spaghetti-review
title: Anti-Spaghetti Review Prompt
summary: A targeted prompt that runs the ContextQB anti-spaghetti checklist over a feature or codebase and produces a structured diagnostic document.
version: 0.2.0
audience:
  - founder
  - developer
  - agent
journey_stage: 6
journey_rank: 0
use_case: |
  When you want a focused diagnosis of structural decay — hidden coupling, ambiguous state ownership, ad hoc orchestration, brittle lifecycles — without a full architecture review.
variables:
  - SCOPE_PATH
  - OUTPUT_PATH
expected_output: |
  A Markdown document that evaluates each of the eight anti-spaghetti signals against the target scope, with evidence and a prioritised remediation plan.
quality_standard: |
  Every signal must be evaluated explicitly (present / partly / absent) with quoted evidence or a stated absence. Generic best-practice advice is not acceptable — only project-specific findings.
related:
  - anti-spaghetti
  - modularity
  - orchestration
  - refactor-planning
  - state-ownership
tags:
  - audit
  - diagnosis
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.5 (agent)"
  reviewer_notes: "2026-10-07 renewal B6 (0.2.0; author self-checked; independent review pending; not operator-accepted): preserved; the only changes are an OUTPUT_PATH variable with the instruction to write the report to that file and report the path (consistent with the document-producing template) and a note to run the review in a session that did not write the code. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; the eight signals restate the principle faithfully as an instrument. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
---

# Anti-Spaghetti Review Prompt

This prompt is what you reach for when something feels wrong but you cannot yet name it. Run it in a session that did not write the code under review — a fresh session, a second agent, or a person. `{{OUTPUT_PATH}}` is where the report should be saved, for example `docs/reviews/anti-spaghetti-review.md`.

## The prompt

```text
You are performing an anti-spaghetti review of the following scope: {{SCOPE_PATH}}.

For each of the eight ContextQB anti-spaghetti signals, produce a section in your output with:
- Signal name.
- Verdict: PRESENT / PARTLY PRESENT / ABSENT.
- Evidence: quoted code with file paths and line numbers (or a stated absence).
- Impact: in plain language, what this is costing or what it might cost.
- Smallest viable fix.

The eight signals are:

1. Unclear data flow — you cannot trace a single user action through the system in one minute.
2. Repeated logic — the same logic appears in multiple places, slightly different.
3. Mixed concerns — one file owns transport, domain, state, and presentation.
4. Unpredictable side effects — function names promise less than they do, or effects fire in unexpected orders.
5. State updated from too many places — more than three or four updaters for a single value.
6. Hidden dependencies — module A breaks when module B changes despite no direct import.
7. Fragile lifecycle assumptions — depends on a specific render or mount order, or breaks if requests finish "too fast."
8. Features bolted on, not integrated — recent features visible as scattered if-branches and feature flags.

After the eight sections, produce:

- Cross-cutting findings. Patterns visible across multiple signals.
- Prioritised remediation plan. Order the fixes by impact and risk, smallest viable changes first.

Be specific. Quote code. Reference files. Do not write code. Do not give generic best-practice advice — only findings grounded in this codebase.

Write the report to {{OUTPUT_PATH}} and do not change any other file. Then reply with the path and the verdict for each signal, one line each.
```

## How to read the output

- If three or more signals are PRESENT, you have a structural problem, not a bug.
- Pair this output with [`refactor-planning`](contextqb://playbooks/refactor-planning) before approving any code change.
