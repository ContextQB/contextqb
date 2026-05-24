---
id: architecture-review
title: Ask an Agent for a Comprehensive Architecture Review
summary: How to commission a real architectural review from an agent — not a list of nitpicks, but a structured assessment with findings, risks, and a remediation plan.
version: 0.1.0
problem: |
  "Review my code" produces a list of small comments. What you actually want is a structural assessment of the system as a whole.
when_to_use: |
  When you are about to commit to a direction, hand off the project, or invest meaningfully in a refactor.
expected_outputs:
  - A long-form review document with the required sections.
  - A prioritised list of findings backed by evidence.
  - A target architecture sketch.
  - An implementation plan.
audience:
  - founder
  - novice-builder
  - developer
  - agent
related_principles:
  - separation-of-concerns
  - modularity
  - state-ownership
  - anti-spaghetti
tags:
  - review
  - audit
---

# Ask an Agent for a Comprehensive Architecture Review

This playbook turns "look at my code" into a serious review. The trick is to _instruct the agent to produce a document_ (see [`agent-instructions`](contextqb://playbooks/agent-instructions)) and to tell it what to look for.

## The prompt

> You are a senior software architect performing an architectural review of this codebase. Your audience is the founder (a non-developer) who needs to decide what to invest in next.
>
> Read the repository. Produce a document with these sections, in order:
>
> 1. **Executive summary.** 3–5 bullets, plain language.
> 2. **Current state.** A description of the architecture as it actually exists. Use real file paths. Identify the major surfaces and how they relate.
> 3. **Findings.** Group by severity (Critical / Important / Minor). For each finding, include: the file or files involved, a short description of the problem, evidence quoted from the code, and the ContextQB principle it violates ([`separation-of-concerns`](contextqb://principles/separation-of-concerns), [`modularity`](contextqb://principles/modularity), etc.).
> 4. **Risks.** What becomes more expensive if nothing changes? Be concrete: which features are about to become hard.
> 5. **Recommendations.** Ordered by impact. For each, name the principle it advances, the surface it touches, and the estimated risk.
> 6. **Target architecture.** Sketch where this should head, in 5–10 paragraphs. Cover module structure, state ownership, orchestration, and extension points.
> 7. **Implementation plan.** 30 / 60 / 90 days. For each window, list 3–5 concrete actions.
>
> Be specific. Quote code. Use file paths. Do not write code in this document. Do not summarise the document at the end — it ends with the implementation plan.
>
> Make and state any reasonable assumptions you need.

## How to read the output

- Read the **findings** first. Look for evidence quoted from the code. A finding without evidence is opinion.
- Cross-check the **target architecture** against your understanding of the product. If you don't recognise the system being described, push back.
- Treat the **implementation plan** as the starting point for [`refactor-planning`](contextqb://playbooks/refactor-planning), not a commitment.

## Common failure modes

- The agent produces a list of generic best practices instead of system-specific findings. Push back: "quote the specific code that exhibits this."
- The agent finds nothing wrong. Push back: "rank the top three concerns even if they are small."
- The agent recommends a full rewrite. Push back: "produce a refactor plan that keeps the system working at every step."
