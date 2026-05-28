---
id: engagement-ingestion-audit
title: Engagement Ingestion Audit Prompt
summary: Audit how engagement data is ingested, stored, and displayed — distinguishing historical truth from moment-of-view accuracy.
version: 0.1.0
audience:
  - founder
  - developer
  - agent
journey_stage: 5
use_case: |
  When a product ingests engagement data (likes, replies, views, follows) from an external source, stores it for analytics, and also shows it live to the user — and the relationship between those layers is unclear.
variables:
  - REPO_PATH
  - INGESTION_LAYER_DESCRIPTION
  - DISPLAY_LAYER_DESCRIPTION
expected_output: |
  A Markdown document evaluating the ingestion pipeline, the storage model, the live hydration path, and whether any "refresher" component is still necessary given the existence of a historically-truthful storage layer.
quality_standard: |
  The audit must explicitly distinguish backend truth (durable historical record) from user-facing truth (moment-of-view accuracy). It must identify any place where the two are conflated.
related:
  - state-ownership
  - separation-of-concerns
tags:
  - audit
  - data
  - ingestion
---

# Engagement Ingestion Audit Prompt

This prompt comes from a real-world pattern: a system that ingests social engagement metrics (the "TAP" — total accumulated record), stores them as historical truth, _and_ hydrates them live when displaying to the user. A common failure mode is keeping a separate "engagement refresher" that is no longer doing useful work once the TAP exists.

The conceptual model the prompt enforces:

- **TAP = historical truth and backend integrity.**
- **Live hydration = moment-of-view accuracy.**
- **A refresher is only useful if it bridges a gap neither of those layers can.**

## The prompt

```text
You are a senior data architect auditing the engagement ingestion and display architecture of this product.

Repository path: {{REPO_PATH}}
Ingestion layer: {{INGESTION_LAYER_DESCRIPTION}}
Display layer: {{DISPLAY_LAYER_DESCRIPTION}}

Produce a Markdown document with these sections:

1. Executive summary. 3–5 bullets.

2. Architecture as it exists today.
   - Where does engagement data enter the system?
   - Where is it stored?
   - When the user views a piece of content, where do the engagement numbers shown actually come from?
   - List every "refresher", "syncer", "updater", or background job touching engagement data.

3. Conceptual model.
   - Which layer represents historical / backend truth?
   - Which layer represents the moment-of-view accuracy seen by the user?
   - Are these two concerns cleanly separated in the code, or conflated?

4. Necessity analysis. For each background job or refresher, answer:
   - What is it for?
   - Is its purpose served by historical truth (TAP) or by live hydration?
   - If both layers already do its job, why does it still exist?
   - Recommend keep / consolidate / retire.

5. Drift and freshness.
   - Where can the user see stale numbers? Why?
   - Where can the historical record diverge from reality? Why?
   - What is the worst-case staleness, and is it documented anywhere?

6. Findings. Ordered by severity.

7. Recommended target architecture. Specifically address whether the refresher should remain, be consolidated into the TAP, or be retired in favour of live hydration.

8. 30 / 60 / 90 day plan.

Be specific. Quote code. Reference files. Do not write code.
```

## Why this prompt teaches by example

This prompt is a good model of teaching ContextQB principles. It does not say "apply separation of concerns." It instead names two specific concerns (historical truth vs. moment-of-view accuracy) and forces the agent to identify where they are conflated. That is what good architectural thinking looks like in practice.
