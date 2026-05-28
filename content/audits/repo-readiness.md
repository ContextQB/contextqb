---
id: repo-readiness
title: Repo Readiness Audit
summary: A quick audit for a newly-prepared repo — does it have the boundaries, naming, and orchestration story it needs before the first feature ships?
version: 0.1.0
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
objective: |
  Verify that a fresh or recently-cleaned repository has the structural prerequisites for sustainable AI-assisted development.
scope: |
  The whole repository: package boundaries, naming, documentation, orchestration, agent instructions.
required_sections:
  - Executive summary
  - Package boundary check
  - Naming check
  - Documentation check
  - Orchestration check
  - Agent instructions check
  - Blocking findings
  - Non-blocking suggestions
evaluation_criteria:
  - Each package has a clear, single responsibility documented in its README.
  - No dumping-ground files exist at the time of audit.
  - There is an AGENT_INSTRUCTIONS file or equivalent.
  - The orchestration layer is documented.
deliverables:
  - A single Markdown document with the required sections.
related:
  - separation-of-concerns
  - modularity
  - naming-conventions
tags:
  - readiness
  - audit
---

# Repo Readiness Audit

This is the audit that runs _before_ the first real feature ships. It is the gate between "we scaffolded a repo" and "we are ready to build."

## Use this as an agent instruction

> You are auditing whether this repository is ready for sustained AI-assisted development. Read the top-level structure, package READMEs, and any architecture documentation.
>
> Produce a Markdown document with these sections:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **Package boundary check.** For each package, state its single responsibility (from its README). Flag any package with no README, an ambiguous responsibility, or overlapping responsibility with another package.
> 3. **Naming check.** Scan for `utils.ts`, `helpers.ts`, `misc.ts`, `manager.ts`, `common.ts`, `lib.ts` at unscoped paths. Flag each occurrence.
> 4. **Documentation check.** Confirm that at minimum the following exist and have meaningful content: README at the repo root, naming conventions document, package boundary documentation, agent instructions file.
> 5. **Orchestration check.** Confirm there is a documented answer to "where do workflows live?" for at least one example user flow.
> 6. **Agent instructions check.** Confirm there is a file an agent can be told to read first, and that it covers naming, boundaries, and out-of-scope behaviour.
> 7. **Blocking findings.** Anything that should be fixed before feature work begins.
> 8. **Non-blocking suggestions.** Improvements that can wait.
>
> Be specific. Reference file paths. Do not write code.
