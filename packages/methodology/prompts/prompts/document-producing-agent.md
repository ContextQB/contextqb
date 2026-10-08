---
id: document-producing-agent
title: Document-Producing Agent Instruction Template
summary: A reusable template that turns any analytical request into a structured document rather than a conversational reply.
version: 0.2.1
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 2
journey_rank: 0
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
  - OUTPUT_PATH
expected_output: |
  A complete Markdown document with the specified sections, written for the specified audience, satisfying the specified evaluation criteria, saved at the specified path and reported by path rather than pasted into the conversation.
quality_standard: |
  The document must be self-contained, decision-grade, and useful as a saved artifact. It must not read like a chat reply.
related:
  - agent-instructions
  - maintainability
  - separation-of-concerns
  - skills-mcp-and-agents-md
tags:
  - prompts
  - template
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.5 (agent)"
  reviewer_notes: "2026-10-07 renewal B6 reciprocal link (0.2.1; author self-checked; independent review pending; not operator-accepted): related adds skills-mcp-and-agents-md, which suggests a filled-in template as a first skill; body unchanged. 2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): this prompt is now the single home of the document template (DEC-05(b)); the agent-instructions playbook points here. Adds an OUTPUT_PATH variable and the instruction to write the document there and report the path instead of pasting it; replaces 'do not ask clarifying questions' with stated assumptions plus a question only when an assumption would change the conclusions, and states that the instruction authorizes writing only that document; says most variables are one line; the worked example is labelled fictional and names its output path. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; the meta-template the other prompts instantiate. R8 pending P4."
---

# Document-Producing Agent Instruction Template

This is the meta-template. Most ContextQB prompts are filled-in versions of this. It is the one maintained copy of the template; [Create Agent Instructions That Produce Documents](contextqb://playbooks/agent-instructions) explains each part.

Most variables are one line. `{{SECTIONS}}` and `{{EVALUATION_CRITERIA}}` are short lists. `{{OUTPUT_PATH}}` is where the finished document should be saved, for example `docs/reviews/auth-module-review.md`.

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

Save the document to: {{OUTPUT_PATH}}

Produce the full document and write it to that path. Then report the path and a two-line description; do not paste the document into the conversation. This instruction authorizes writing that one document only; do not change other files.

Where information is missing, make reasonable assumptions and list them in an "Assumptions" section. Ask me a question only if an assumption would change the document's conclusions; if you ask, wait for my answer before writing. Do not summarise the document at the end.
```

## Worked example — code review document (fictional project)

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

Save the document to: docs/reviews/auth-module-review.md

Produce the full document and write it to that path. Then report the path and a two-line description; do not paste the document into the conversation. This instruction authorizes writing that one document only; do not change other files.

Where information is missing, make reasonable assumptions and list them in an "Assumptions" section. Ask me a question only if an assumption would change the document's conclusions; if you ask, wait for my answer before writing. Do not summarise the document at the end.
```

## Why this template works

It treats the deliverable as a contract. The agent knows exactly what to produce, who it is for, what good looks like, and what to omit. The result is something you can save, version, and act on — not a chat reply that scrolls away.
