---
id: document-producing-agent
title: Document-Producing Agent Instruction Template
summary: A reusable template that turns any analytical request into a structured document rather than a conversational reply.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
use_case: |
  Whenever you need an agent to produce a deliverable you will save, share, or act on.
variables:
  - ROLE
  - DOCUMENT_TYPE
  - AUDIENCE
  - OBJECTIVE
  - SECTIONS
  - EVALUATION_CRITERIA
  - TONE_CONSTRAINTS
  - OUT_OF_SCOPE
  - SOURCE_MATERIAL
expected_output: |
  A complete Markdown document with the specified sections, written for the specified audience, satisfying the specified evaluation criteria.
quality_standard: |
  The document must be self-contained, decision-grade, and useful as a saved artifact. It must not read like a chat reply.
related:
  - maintainability
  - separation-of-concerns
tags:
  - prompts
  - template
---

# Document-Producing Agent Instruction Template

This is the meta-template. Most ContextQB prompts are filled-in versions of this.

## The template

```text
You are {{ROLE}}, producing {{DOCUMENT_TYPE}} for {{AUDIENCE}}.

Objective: {{OBJECTIVE}}

Required sections, in order:
{{SECTIONS}}

Evaluation criteria — what makes this document good vs. mediocre:
{{EVALUATION_CRITERIA}}

Tone constraints:
{{TONE_CONSTRAINTS}}

Out of scope:
{{OUT_OF_SCOPE}}

Source material:
{{SOURCE_MATERIAL}}

Produce the full document. Do not summarise it at the end. Do not ask clarifying questions — make and state reasonable assumptions where information is missing.
```

## Worked example — code review document

```text
You are a senior software architect, producing an architectural code review document for a non-technical product founder.

Objective: Identify the three highest-impact structural issues in the user authentication module and recommend remediation.

Required sections, in order:
1. Executive summary (3 bullets).
2. Module map (files, responsibilities).
3. The three issues — each with: title, evidence (quoted code), principle violated, plain-language explanation of impact.
4. Recommendations — ordered by impact-to-risk ratio.
5. Implementation plan.

Evaluation criteria:
- Every issue is backed by quoted code with file path and line numbers.
- Plain-language explanations do not assume engineering background.
- Recommendations are prioritised by impact, not by ease.

Tone constraints:
- Direct. Short sentences. Define any technical term the first time it appears.

Out of scope:
- Style and formatting issues.
- Issues outside the authentication module.

Source material:
- apps/web/src/auth/
- apps/web/src/middleware.ts

Produce the full document. Do not summarise at the end. Make and state any assumptions you need.
```

## Why this template works

It treats the deliverable as a contract. The agent knows exactly what to produce, who it is for, what good looks like, and what to omit. The result is something you can save, version, and act on — not a chat reply that scrolls away.
