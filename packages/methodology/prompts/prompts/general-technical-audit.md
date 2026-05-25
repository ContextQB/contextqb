---
id: general-technical-audit
title: General Technical Audit Prompt
summary: A comprehensive application audit covering architecture, data, scalability, reliability, infrastructure, security, code quality, and product alignment.
version: 0.1.0
audience:
  - founder
  - developer
  - agent
journey_stage: 4
use_case: |
  When you need a single, broad technical assessment of an application before making investment decisions, hiring, or starting a major refactor.
variables:
  - REPO_PATH
  - PRODUCT_SUMMARY
expected_output: |
  A long-form Markdown document with an executive summary, current-state assessment by domain (architecture, data, scalability, reliability, infrastructure, security, code quality, product-engineering alignment), findings, risks, recommendations, target state, and a 30/60/90 day plan.
quality_standard: |
  Each finding must be backed by specific file references or quoted code. Recommendations must be prioritised by impact and risk, not by ease.
related:
  - separation-of-concerns
  - modularity
  - state-ownership
  - anti-spaghetti
tags:
  - audit
  - comprehensive
---

# General Technical Audit Prompt

Use this when you want one broad document covering an application end to end.

## The prompt

```text
You are a senior technical advisor performing a comprehensive audit of this application for a non-technical decision-maker.

Product summary: {{PRODUCT_SUMMARY}}
Repository path: {{REPO_PATH}}

Read the codebase carefully. Produce a Markdown document with these sections, in order:

1. Executive summary. 5–7 bullets in plain language. Lead with the most important thing.

2. Current state, organised by domain:
   - Architecture: surface map, layering, package boundaries.
   - Data: schemas, sources of truth, integrity model.
   - Scalability: where bottlenecks would appear at 10x, 100x.
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

7. 30 / 60 / 90 day plan. 3–5 concrete actions per window.

Tone: Direct. Plain language. Define any technical term the first time you use it. No enterprise jargon.

Do not write code in this document. Do not summarise at the end — end with the 90-day plan. Make and state any assumptions you need.
```

## How to read the output

- Start with findings, not the executive summary. The summary is for sharing; the findings are for thinking.
- Verify each finding by opening the cited file. If you cannot find the evidence, treat the finding as suspect.
- Feed the recommendations into [`refactor-planning`](contextqb://playbooks/refactor-planning) before approving any code change.
