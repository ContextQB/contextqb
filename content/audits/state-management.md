---
id: state-management
title: State Management Audit
summary: A targeted audit that maps every piece of state in a system, identifies owners, surfaces duplicates, and flags derived-but-stored values.
version: 0.3.1
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 4
journey_rank: 0
objective: |
  Produce a complete state map for the system, with clear owners and a list of state problems to fix.
scope: |
  All state in the target codebase: server state, durable client state, shared transient state, local component state, and any derived values stored as state.
required_sections:
  - Executive summary
  - State inventory table
  - Ownership analysis
  - Duplication and drift findings
  - Derived-but-stored findings
  - Recommendations
evaluation_criteria:
  - Every shared state value appears in the inventory.
  - Each state value has a named owner.
  - Duplicates are linked to each other in the findings.
  - Derived values that are stored unnecessarily are flagged.
deliverables:
  - A single Markdown document with the required sections, including the state inventory table.
related:
  - anti-spaghetti
  - orchestration
  - repo-cleanup
  - state-ownership
  - stored-data-derived-data-and-interface-state
tags:
  - state
  - audit

---

# State Management Audit

This audit is narrower than a full architecture review. It focuses on state ownership: which part is responsible for each value and how other parts use it.

Read [Stored Data, Derived Data and Interface State](contextqb://briefings/stored-data-derived-data-and-interface-state) for a beginner explanation. Those descriptions can overlap: a derived value can also be cached durably. In the inventory below, name the owner and source separately from durability and derivation. A legitimate cache needs an explicit refresh or invalidation rule; do not recommend removing every duplicate without understanding its job.

## Use this as an agent instruction

> You are a senior architect performing a state management audit of this codebase. Your job is to map every piece of state and identify problems with ownership, duplication, and derivation.
>
> Produce a Markdown document with these sections, in order:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **State inventory.** A table with columns: `name`, `kind` (server / durable-client / shared-transient / local), `owner` (file or module), `source`, `consumers`, `duplicates`, `derived`, `verified by` (read the code, or ran the app and observed it). Cover every shared state value. Use real file paths. Run the app only if you are permitted to, against a local or test copy.
> 3. **Ownership analysis.** For each row in the table where the owner is unclear, explain what is ambiguous and where ownership should live.
> 4. **Duplication and drift.** For each pair of duplicates, explain why they exist and propose a single owner.
> 5. **Derived-but-stored.** Any value that could be computed from another value but is stored as its own state.
> 6. **Recommendations.** Ordered by impact and risk.
>
> Be specific. Quote code. Reference files. Do not write code. End with the recommendations.
