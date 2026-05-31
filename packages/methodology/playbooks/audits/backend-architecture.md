---
id: backend-architecture
title: Backend Architecture Audit
summary: A structured prompt for evaluating a backend or API layer — its boundaries, data ownership, transport coupling, and operational soundness.
version: 0.1.0
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
  - 30 / 60 / 90 day plan
evaluation_criteria:
  - Findings reference specific files and quote code.
  - Layering analysis identifies every place transport, domain, and data are mixed.
  - Data ownership clearly names a source of truth for each record type.
  - Recommendations are prioritised by impact and risk.
deliverables:
  - A single Markdown document with the required sections.
related:
  - separation-of-concerns
  - state-ownership
  - modularity
  - anti-spaghetti
tags:
  - backend
  - audit
---

# Backend Architecture Audit

Backends fail in a small number of ways: mixed layers, unclear data ownership, accidental coupling between transport and domain, and no story for failures. This audit surfaces those.

## Use this as an agent instruction

> You are a senior backend architect performing a structural review of this codebase's server-side code for a technical decision-maker. Read the backend code carefully — HTTP handlers, services, data access, jobs, and integrations.
>
> Produce a Markdown document with these sections, in order:
>
> 1. **Executive summary.** 3–5 bullets.
> 2. **Surface map.** List every HTTP endpoint, background job, and external integration. For each, name the file that handles it.
> 3. **Layering analysis.** For each surface, identify whether transport (HTTP / queue), domain logic, and data access are properly separated or mixed. Quote examples where they are mixed.
> 4. **Data ownership.** For each major record type, name the source of truth and any places where the same data is stored, cached, or denormalised. Flag drift risks.
> 5. **Reliability and error handling.** How does the system fail? Where are retries? Where are timeouts? Where do partial failures leave the system?
> 6. **Operational surface.** Logging, metrics, configuration, secret management.
> 7. **Security surface.** Auth boundaries, input validation, secret exposure, injection surfaces.
> 8. **Anti-spaghetti scan.** Eight ContextQB signals, present / partly / absent, with evidence.
> 9. **Recommendations.** Ordered by impact and risk.
> 10. **30 / 60 / 90 day plan.** 3–5 concrete actions per window.
>
> Be specific. Quote code. Reference files. Do not write code. Do not end with a summary — end with the 90-day plan.
