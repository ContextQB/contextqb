---
id: general-technical-audit
title: General Technical Audit Prompt
summary: A comprehensive application audit covering architecture, data, scalability, reliability, infrastructure, security, code quality, and product alignment.
version: 0.2.1
audience:
  - founder
  - developer
  - agent
journey_stage: 4
journey_rank: 0
use_case: |
  When you need a single, broad technical assessment of an application before making investment decisions, hiring, or starting a major refactor.
variables:
  - REPO_PATH
  - PRODUCT_SUMMARY
  - OUTPUT_PATH
expected_output: |
  A long-form Markdown document with an executive summary, current-state assessment by domain (architecture, data, scalability, reliability, infrastructure, security, code quality, product-engineering alignment), findings, risks, recommendations, target state, and a now / next / later plan, saved at the given path; the reply gives the path, the executive summary and the top five findings.
quality_standard: |
  Each finding must be backed by specific file references or quoted code. Recommendations must be prioritised by impact and risk, not by ease.
related:
  - anti-spaghetti
  - architecture-review
  - modularity
  - refactor-planning
  - separation-of-concerns
  - state-ownership
tags:
  - audit
  - comprehensive
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.5 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 review correction (0.2.1; author self-checked; independent review pending; not operator-accepted): one workflow instead of two conflicting ones — the prompt saves the full report to a new OUTPUT_PATH variable and replies with the path, the executive summary and the top five findings; How to read starts from that reply and then the detailed findings in the saved report. No approval gate added. 2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): says when to use this rather than the architecture review; scalability statements are labelled projections; verifiers and the app are run where permitted, against a local or test copy, with commands and results recorded; suggests asking for the summary and top five findings first, then a second, independent session to challenge them; the 30/60/90-day plan becomes now / next / later. Earlier notes (2026-09-09 epistemology review): R3–R7 pass. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
---

# General Technical Audit Prompt

Use this when you want one broad document covering an application end to end — typically when you face a decision such as whether to invest, hire or refactor. When your question is only the shape of the code, the [architecture review](contextqb://playbooks/architecture-review) is narrower and faster.

**How it works.** The agent writes the full report to a file and replies with only the path, the executive summary and the top five findings. You read that short reply first, then open the report for the detail. `{{OUTPUT_PATH}}` is where the report should be saved, for example `docs/reviews/technical-audit.md`.

## The prompt

```text
You are a senior technical advisor performing a comprehensive audit of this application for a non-technical decision-maker.

Product summary: {{PRODUCT_SUMMARY}}
Repository path: {{REPO_PATH}}
Save the report to: {{OUTPUT_PATH}}

Read the codebase carefully. If you are permitted to run commands, run the project's verifier commands (type check, lint, tests, build) and start the application against a local or test copy — never production data or live services — and record each command and its result. If you are not permitted, say which checks you could not run. Produce a Markdown document with these sections, in order:

1. Executive summary. 5–7 bullets in plain language. Lead with the most important thing.

2. Current state, organised by domain:
   - Architecture: surface map, layering, package boundaries.
   - Data: schemas, sources of truth, integrity model.
   - Scalability: where bottlenecks would appear at 10x, 100x. Label these as projections, not measurements, unless you measured them.
   - Reliability: failure modes, retries, error handling, observability.
   - Infrastructure: deployment, environments, configuration, secrets.
   - Security: auth, input validation, secret handling, threat surface.
   - Code quality: modularity, naming, state ownership, anti-spaghetti signals.
   - Product-engineering alignment: do the abstractions match the product?

3. Findings. Group by severity (Critical / Important / Minor). Each finding must include:
   - Title.
   - Files involved with paths.
   - Quoted evidence.
   - The principle it violates.
   - Why it matters (impact in plain language).

4. Risks. What becomes more expensive if nothing changes? Be specific.

5. Recommendations. Ordered by impact and risk, not by ease. For each:
   - The action.
   - The principle it advances.
   - The estimated risk.
   - The dependency on other recommendations.

6. Target architecture. 5–10 paragraphs sketching where this should head. Cover module structure, data model, state ownership, orchestration, and operational story.

7. Now / next / later plan. 3–5 concrete actions in each.

Tone: Direct. Plain language. Define any technical term the first time you use it. No enterprise jargon.

Do not write code in this document. Do not summarise at the end — end with the plan. Make and state any assumptions you need.

Write the full document to the path above; do not change any other file. Then reply with only: the path, the executive summary, and the five most important findings, one line each with its severity. Do not paste the full document into the conversation.
```

## How to read the output

- Start with the agent's short reply: the executive summary and top five findings tell you where to look. Then open the saved report and read the findings section in detail — the summary is for sharing; the findings are for thinking.
- Verify each finding by opening the cited file. If you cannot find the evidence, treat the finding as suspect.
- Feed the recommendations into [`refactor-planning`](contextqb://playbooks/refactor-planning) before approving any code change.
- Before acting on the top findings, give them to a second, independent session — one that did not write the audit and did not build the code — with the audit and the cited files, and ask it to challenge each finding: confirm, weaken or refute it with evidence. A different model can add variety; it does not by itself make the challenge independent.
