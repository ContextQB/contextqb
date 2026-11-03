---
id: backend-architecture
title: Backend Architecture Audit
summary: A structured prompt for evaluating a backend or API layer — its boundaries, data ownership, transport coupling, and operational soundness.
version: 0.4.2
audience:
  - founder
  - developer
  - agent
journey_stage: 4
journey_rank: 10
objective: |
  Produce a system-level assessment of the backend, focused on data integrity, separation of concerns, and operational readiness.
scope: |
  HTTP endpoints, background jobs, data access, domain logic, integrations, and any orchestration layer between them.
required_sections:
  - Executive summary
  - Surface map (endpoints, jobs, integrations)
  - Layering analysis (transport / domain / data)
  - Data ownership (who owns which records, sources of truth)
  - Reliability and error handling
  - Operational surface (logging, observability, configuration)
  - Security surface (auth boundaries, secret handling, input validation)
  - Anti-spaghetti scan
  - Recommendations
  - Now / next / later plan
evaluation_criteria:
  - Findings reference specific files and quote code.
  - Layering analysis identifies every place transport, domain, and data are mixed.
  - Data ownership clearly names a source of truth for each record type.
  - Recommendations are prioritised by impact and risk.
deliverables:
  - A single Markdown document with the required sections.
related:
  - anti-spaghetti
  - change-stored-data-safely
  - connecting-services-reliably
  - designing-your-apps-data
  - modularity
  - rehearse-backup-and-recovery
  - separation-of-concerns
  - state-ownership
  - test-an-integration-failure
tags:
  - backend
  - audit

---

# Backend Architecture Audit

Backends fail in a small number of ways: mixed layers, unclear data ownership, accidental coupling between transport and domain, and no story for failures. This audit surfaces those.

If these terms are new, start with [Designing Your App's Data](contextqb://guides/designing-your-apps-data). Bring its record examples, ownership rules and permitted actions into the review. Distinguish a code-level finding from an executed recovery check: use [Change Stored Data Safely](contextqb://playbooks/change-stored-data-safely) and [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) when stored information is at risk. A structural report alone does not establish that records survive a change.

For an outside service, use [Connecting Services Reliably](contextqb://guides/connecting-services-reliably) to name the contract and failure decisions. [Test an Integration Failure](contextqb://playbooks/test-an-integration-failure) checks missing, repeated and late results on an isolated target. Keep the structural findings separate from evidence that the actual connector preserves state and avoids duplicate effects.

## Use this as an agent instruction

> You are a senior backend architect performing a structural review of this codebase's server-side code for the project's owner, who may not be a developer. Write in plain language and define each technical term the first time you use it. Read the backend code carefully — HTTP handlers, services, data access, jobs, and integrations.
>
> Produce a Markdown document with these sections, in order:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **Surface map.** List every HTTP endpoint, background job, and external integration. For each, name the file that handles it.
> 3. **Layering analysis.** For each surface, identify whether transport (HTTP / queue), domain logic, and data access are properly separated or mixed. Quote examples where they are mixed.
> 4. **Data ownership.** For each major record type, name the source of truth and any places where the same data is stored, cached, or denormalised. Flag drift risks.
> 5. **Reliability and error handling.** How does the system fail? Where are retries? Where are timeouts? Where do partial failures leave the system? If you are permitted to run commands, run the test suite and any health checks against a local or test copy — never production — and record each command and its result here; otherwise say they were not run.
> 6. **Operational surface.** Logging, metrics, configuration, secret management.
> 7. **Security surface.** Auth boundaries, input validation, secret exposure, injection surfaces. Note anything that needs a deeper security audit; this section is a first pass, not a security review.
> 8. **Anti-spaghetti scan.** For each of the eight signals — unclear data flow, repeated logic, mixed concerns, unpredictable side effects, state updated from too many places, hidden dependencies, fragile lifecycle assumptions, features bolted on rather than integrated — say present, partly or absent, with evidence.
> 9. **Recommendations.** Ordered by impact and risk.
> 10. **Now / next / later plan.** 3–5 concrete actions in each.
>
> Be specific. Quote code. Reference files. Do not write code. Do not end with a summary — end with the plan.

**Before you run it.** Use a session that did not build the backend — a fresh session, a second agent, or a person — and give it the project instructions, the project map, and the code. A different model can add variety; it does not by itself make the audit independent.

**After it runs.** The eight signals in section 8 come from the [anti-spaghetti principle](contextqb://principles/anti-spaghetti), which explains each one. Section 7 is deliberately shallow: the security-stage audits (for example, the authentication and authorization audit and the attack-surface map) go deeper. To see what a finished report looks like, read the [worked example: a backend audit of a fictional ingestion service](https://contextqb.com/examples/backend-ingestion-audit-example/). It follows the same ten sections and explains who asked for it, why, and which details belong only to that example.
