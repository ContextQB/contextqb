---
id: anti-spaghetti-review
title: Anti-Spaghetti Review Prompt
summary: A targeted prompt that runs the ContextQB anti-spaghetti checklist over a feature or codebase and produces a structured diagnostic document.
version: 0.3.0
audience:
  - founder
  - developer
  - agent
journey_stage: 6
journey_rank: 10
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
  - changing-software-without-losing-control
  - modularity
  - orchestration
  - refactor-planning
  - repo-cleanup
  - state-ownership
tags:
  - audit
  - diagnosis

---

# Anti-Spaghetti Review Prompt

This prompt is what you reach for when something feels wrong but you cannot yet name it. Run it in a session that did not write the code under review — a fresh session, a second agent, or a person. The prompt is self-contained: it carries all eight signals, so the agent does not need access to ContextQB.

**Fill in the two values before you paste.** Replace each `{{…}}` placeholder, including the braces:

- `{{SCOPE_PATH}}` — the folder or files to review: the part of the code that feels wrong. For example `src/checkout/` for a whole feature folder, or `src/checkout/cart.ts, src/checkout/payment.ts` for two files. Use `.` only when you want the whole repository reviewed; a smaller scope gives sharper evidence. The agent may read other files to follow how the scope is used, but it reports only on the scope.
- `{{OUTPUT_PATH}}` — where the report should be saved, for example `docs/reviews/anti-spaghetti-review.md`.

## The prompt

```text
You are performing an anti-spaghetti review of the following scope (a folder or list of files): {{SCOPE_PATH}}.

Evaluate only this scope. You may read other files to understand how it is used; mention problems outside it only in a short "Outside the scope" note at the end of the report.

For each of the eight anti-spaghetti signals listed below, produce a section in your output with:
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
