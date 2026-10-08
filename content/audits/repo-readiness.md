---
id: repo-readiness
title: Repo Readiness Audit
summary: A quick audit for a newly-prepared repo — does it have the boundaries, naming, and orchestration story it needs before the first feature ships?
version: 0.2.2
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
journey_rank: 0
objective: |
  Verify that a fresh or recently-cleaned repository has the structural prerequisites for sustainable AI-assisted development.
scope: |
  The whole repository: package boundaries, naming, documentation, orchestration, agent instructions.
required_sections:
  - Executive summary
  - Verification check
  - Package boundary check
  - Naming check
  - Documentation check
  - Orchestration check
  - Agent instructions check
  - Blocking findings
  - Non-blocking suggestions
evaluation_criteria:
  - The project's verifiers (typecheck, lint, format, tests — whichever exist) have named commands and were run, with exit status reported.
  - A `context.qb.yaml` exists, validates against the published schema and passes the drift check.
  - At least one architectural decision record exists.
  - Each package (in a multi-package repo) or top-level area (in a single app) has a clear, single responsibility that is written down.
  - No dumping-ground files exist at the time of audit.
  - There is an `AGENTS.md` file at the repo root (see the `set-up-agents-md` playbook) that points to `context.qb.yaml` and states security boundaries.
  - The orchestration layer is documented.
deliverables:
  - A single Markdown document with the required sections.
related:
  - agent-substrate
  - how-to-use-contextqb
  - modularity
  - naming-conventions
  - new-project-foundation
  - separation-of-concerns
  - repo-cleanup
tags:
  - readiness
  - audit
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.4 (agent); R-01 remediation 2026-09-09"
  reviewer_notes: "2026-10-07 renewal B6 Tier-2 routing (0.2.2; author self-checked; independent review pending; not operator-accepted): related adds repo-cleanup, whose Tier-2 labels now send young repositories here; body unchanged. 2026-10-07 renewal B3 reciprocal link (0.2.1; author self-checked; independent review pending; not operator-accepted): related adds how-to-use-contextqb, whose already-have-a-project lane now points here. 2026-10-07 renewal B2 (0.2.0; author self-checked; independent review pending; not operator-accepted): the gate now checks what the foundation playbook teaches — a new Verification check section (run the verifiers, the schema check and the drift check first), context.qb.yaml and a first ADR in the documentation check, AGENTS.md pointer and security boundaries; README-per-package scoped to multi-package repos; banned names given per-language equivalents; roles stated. Earlier notes describe the previous version: R3–R7 pass. F-13 resolved 2026-09-09: evaluation_criteria now names AGENTS.md (the canon) instead of the AGENT_INSTRUCTIONS fossil. R8 pending P4 (passed P4 2026-09-09)."
---

# Repo Readiness Audit

This is the audit that runs _before_ the first real feature ships. It is the gate between "we scaffolded a repo" and "we are ready to build."

**Who does what.** You ask your agent to run the audit with the instruction below. The agent runs the commands and checks and writes the report. You read the blocking findings and decide which to fix before feature work — the agent does not decide that the repo is ready.

It checks the footprint the [foundation playbook](contextqb://playbooks/new-project-foundation) sets up. Mechanical checks come first so the agent's judgment goes to the two questions only a reading can answer: are the boundaries right, and is it clear where workflows live?

## Use this as an agent instruction

> You are auditing whether this repository is ready for sustained AI-assisted development. Read the top-level structure, `AGENTS.md`, `context.qb.yaml`, package or folder READMEs, and any architecture documentation.
>
> Do the mechanical checks first (sections 2, 4 and 5), then spend your judgment on boundaries and orchestration (sections 3 and 6).
>
> Produce a Markdown document with these sections:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **Verification check.** Name the commands that typecheck, lint, format-check and test this project (whichever exist; say which are missing). Run each and report its exit status. Validate `context.qb.yaml` against the published schema and run the drift check; report each result.
> 3. **Package boundary check.** For a multi-package repo, state each package's single responsibility (from its README) and flag any package with no README, an ambiguous responsibility, or overlapping responsibility with another package. For a single app, do the same for its top-level folders, using wherever the project documents them.
> 4. **Naming check.** Scan for `utils.ts`, `helpers.ts`, `misc.ts`, `manager.ts`, `common.ts`, `lib.ts` at unscoped paths, and their equivalents in the project's languages (for example `utils.py` or `helpers.go`). Flag each occurrence.
> 5. **Documentation check.** Confirm that at minimum the following exist and have meaningful content: README at the repo root, `AGENTS.md`, `context.qb.yaml`, a naming conventions document or section, package or folder boundary documentation, and at least one architectural decision record.
> 6. **Orchestration check.** Confirm there is a documented answer to "where do workflows live?" for at least one example user flow.
> 7. **Agent instructions check.** Confirm `AGENTS.md` tells the agent to read `context.qb.yaml`, and covers naming, boundaries, security boundaries (what the agent must never do without approval) and out-of-scope behaviour.
> 8. **Blocking findings.** Anything that should be fixed before feature work begins.
> 9. **Non-blocking suggestions.** Improvements that can wait.
>
> Be specific. Reference file paths and the exact commands you ran. Do not write code. Do not change files.
