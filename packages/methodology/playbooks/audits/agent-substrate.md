---
id: agent-substrate
title: Agent Substrate Audit
summary: A retrospective audit that scores an existing repository's language stack on agent-friendliness — are verifiers in place to catch the agent's mistakes before they ship?
version: 0.2.0
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 2
journey_rank: 0
objective: |
  Assess whether the repository's language choices and verifier configuration provide sufficient mechanical verification for sustainable AI-assisted development.
scope: |
  All surfaces in the repository: frontend, backend, jobs, scripts, infrastructure-as-code. Focus on language selection, type coverage, schema validation at boundaries, linter strictness, and CI enforcement.
required_sections:
  - Executive summary
  - Surface inventory
  - Verifier coverage matrix
  - Gap analysis
  - Blocking findings
  - Non-blocking suggestions
evaluation_criteria:
  - Every surface uses a language with compile-time or static type checking, or has an explicit documented exception.
  - Type coverage is above 90% (no widespread `any`, `unknown`, or untyped code), measured with the language's coverage tool where one exists, or estimated qualitatively and labelled as an estimate.
  - Every I/O boundary (API call, database query, file read, user input) has schema validation.
  - CI gates on type check and lint failures; builds do not pass with errors.
  - A canonical formatter is enforced; formatting is not a manual review concern.
deliverables:
  - A single Markdown document with all required sections.
  - A verifier coverage matrix showing each surface and its verifier status.
  - A prioritised list of gaps to close.
related:
  - choose-a-language-stack
  - machine-verifiable-substrate
  - programming-language-selection
  - repo-readiness
tags:
  - audit
  - verifiability
  - language
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.4 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): named configuration files replaced by 'the type-checker, linter and formatter configuration files for each language', which the agent finds (with a link to the dated verifiers reference); the matrix example labelled illustrative; says how type coverage is measured; states that a new project runs this after its first feature (new-project-foundation, then repo-readiness, then this), so 'existing repository' includes yours; framed as agent-run, with you reading the score and top blockers. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; A–F scoring rubric is a good instrument. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
---

# Agent Substrate Audit

This audit evaluates whether an existing repository provides the mechanical verification needed for sustainable AI-assisted development. It is the retrospective counterpart to the [`choose-a-language-stack`](contextqb://playbooks/choose-a-language-stack) playbook — run it on codebases that already exist to identify gaps.

"Existing" includes a new project once its first feature is in. The usual order is: set up the repository (the _Prepare a New Repo for AI-Assisted Development_ playbook), check it with [`repo-readiness`](contextqb://audits/repo-readiness), build the first feature, then run this audit.

**Who does what.** The agent runs the audit and writes the report. You read the score and the blocking findings, and decide which gaps to fix first.

## Use this as an agent instruction

> You are auditing this repository's language stack for agent-friendliness. Your goal is to determine whether the agent's output can be mechanically verified before it ships, or whether human review is required to catch errors.
>
> Read the repository structure, the type-checker, linter and formatter configuration files for each language in the repository (find them; they differ by language and tool version), the CI workflows, and sample source files. Then produce a Markdown document with these sections:
>
> ### 1. Executive summary
>
> 3–5 bullets summarising the overall state: which surfaces are well-verified, which are gaps, and the single most important improvement.
>
> ### 2. Surface inventory
>
> List every surface in the repository:
>
> | Surface              | Path(s)     | Language   | Purpose               |
> | -------------------- | ----------- | ---------- | --------------------- |
> | (e.g., Web frontend) | `apps/web/` | TypeScript | User-facing React app |
>
> ### 3. Verifier coverage matrix
>
> For each surface, assess the verifier stack:
>
> | Surface      | Type checker | Strict mode? | Schema at boundaries? | Linter | Formatter | CI enforced? |
> | ------------ | ------------ | ------------ | --------------------- | ------ | --------- | ------------ |
> | Web frontend | tsc          | Yes          | Yes (Zod)             | ESLint | Prettier  | Yes          |
>
> (The row above is an illustrative TypeScript example; use the tools this repository actually has.)
>
> Use these values:
>
> - **Yes** — verifier is present and enforced.
> - **Partial** — verifier exists but is not strict or not enforced in CI.
> - **No** — verifier is absent.
>
> ### 4. Gap analysis
>
> For each gap (any cell that is not "Yes"), explain:
>
> 1. What the gap is.
> 2. What errors could slip through because of it.
> 3. The recommended fix.
>
> Prioritise by impact: gaps in production code before gaps in scripts; gaps in CI enforcement before gaps in local tooling.
>
> ### 5. Blocking findings
>
> Issues that should be fixed before significant new AI-assisted work:
>
> - Surfaces with no type checking at all.
> - I/O boundaries with no schema validation.
> - CI that does not gate on type/lint failures.
>
> ### 6. Non-blocking suggestions
>
> Improvements that are valuable but not urgent:
>
> - Increasing strictness of existing linter rules.
> - Adding schema validation to internal boundaries (not just external I/O).
> - Migrating permissive-language scripts to typed alternatives.
>
> Be specific. Reference file paths and configuration keys. Do not write code unless proposing a fix.

## Scoring guide

Use this rubric to summarise the overall state:

| Score | Meaning                                                                                                                                 |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | All surfaces have compile-time types, strict mode, schema validation at boundaries, and CI enforcement. Agent output is fully verified. |
| **B** | Most surfaces are verified; one or two have partial gaps (e.g., no schema validation, linter not strict).                               |
| **C** | Core surfaces are verified, but scripts or secondary surfaces are permissive.                                                           |
| **D** | Significant surfaces lack type checking or CI enforcement. Agent output requires substantial human review.                              |
| **F** | No mechanical verification. Agent output is trusted without checks.                                                                     |

Include the score in the executive summary.

## What to do with the output

1. **Triage blocking findings.** These are the highest-leverage improvements. A single PR to enable strict mode or add schema validation can shift the entire codebase from D to B.

2. **Create tickets for gaps.** Each gap in the matrix is a concrete task. Prioritise by impact.

3. **Re-audit after fixes.** Run this audit again after addressing blocking findings to confirm the score improved.

## Related resources

- [`machine-verifiable-substrate`](contextqb://principles/machine-verifiable-substrate) — the principle this audit operationalises.
- [`programming-language-selection`](contextqb://principles/programming-language-selection) — guidance on choosing languages.
- [`repo-readiness`](contextqb://audits/repo-readiness) — the broader audit for new repositories.
- The current type checkers, linters and formatters for each language are in the dated [verifiers reference](contextqb://references/tools#verifiers-by-language).
