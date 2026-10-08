---
id: agent-instructions
title: Create Agent Instructions That Produce Documents, Not Chat Replies
summary: How to write agent prompts that return structured, decision-grade documents rather than meandering conversational answers.
version: 0.2.1
problem: |
  Most agent prompts produce conversational answers — useful for back-and-forth, useless as a permanent artifact. For audits, reviews, and plans, you want a document you can save, share, and act on.
when_to_use: |
  Whenever you need an agent to produce something you will save, share with a stakeholder, or use as the basis for further work.
expected_outputs:
  - A prompt that produces a structured document.
  - A clear set of required sections.
  - A defined audience and tone.
  - A defined deliverable format.
  - A defined path where the document is saved.
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 2
journey_rank: 10
related_principles:
  - maintainability
  - orchestration
tags:
  - prompts
  - documents
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-07 renewal B6 reciprocal link (0.2.1; author self-checked; independent review pending; not operator-accepted): related adds skills-mcp-and-agents-md, the briefing that explains where a saved template lives as a skill; body unchanged. 2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): adds a seventh element (where to save the document) and the conditional clarifying-questions rule, both matching the document-producing-agent prompt; the template block now points to that prompt, its single maintained home (DEC-05(b)), instead of restating it; the 30/60/90-day plan example becomes next session / next week / later; one line on saving a filled template as a reusable instruction, linking the dated setup reference. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; pairs cleanly with the document-producing-agent prompt (pattern vs instance). R8 pending P4."
related:
  - architectural-hardening-loop
  - architecture-review
  - feature-build-loop
  - run-a-multi-agent-workflow
  - review-an-agent-workstream
  - audit-a-workstream-record
  - skills-mcp-and-agents-md
  - document-producing-agent
---

# Create Agent Instructions That Produce Documents, Not Chat Replies

There is a profound difference between asking an agent a question and asking an agent to produce a document. The former returns whatever the model feels like saying. The latter returns an artifact you can save, version, and act on.

## The shape of a document-producing prompt

A good document prompt has these elements:

### 1. Role

Tell the agent what kind of expert is being summoned and for what audience.

> "You are an experienced software architect reviewing a codebase for a non-developer founder."

### 2. Objective

State what the document is for in one sentence.

> "Produce an architectural review of the codebase that a non-developer can read, understand, and use to prioritise refactor work."

### 3. Required sections

List the exact sections the document must contain, in order.

> "The document must include:
>
> 1. Executive summary (3–5 bullets).
> 2. Current state — what exists, with file references.
> 3. Findings — ordered by severity, each with evidence.
> 4. Risks — what becomes harder if nothing is done.
> 5. Recommendations — ordered by impact.
> 6. Target architecture — a sketch of where this should head.
> 7. Implementation plan — next session, next week, later."

### 4. Evaluation criteria

What makes the document good vs. mediocre?

> "A good document is specific. It quotes file paths and code. It does not make general claims like 'consider modularity' — it points at the exact module that lacks it and explains what good would look like."

### 5. Tone constraints

Especially important for non-developer audiences.

> "Write so a non-developer can read it. Define any technical term the first time you use it. Avoid enterprise jargon."

### 6. Out-of-scope

What the agent should _not_ do.

> "Do not write code. Do not propose changes outside the scope of this review."

### 7. Where to save it

Name the file the document goes in, and ask the agent to report the path instead of pasting the document into the chat. A document that lives only in a conversation scrolls away; a file can be reviewed, linked from your project records, and read by the next session.

> "Save the review to `docs/reviews/architecture-review.md` and tell me the path. Do not paste it into the chat. Do not change any other file."

### Missing information: assumptions first, questions only when they matter

An agent asked for a document will often lack some fact. Ask it to state its assumptions in the document, and to ask you a question only when an assumption would change the conclusions — then wait for your answer before writing. This keeps you from a round of trivial questions without letting a wrong guess shape the verdict. It is a rule for producing a document; it never authorizes the agent to change code or other files.

## The template

The copy-ready template, with every element above as a fill-in variable and a worked example, is the [Document-Producing Agent Instruction Template](contextqb://prompts/document-producing-agent). Keep using that one copy rather than a private variant, so improvements reach every document you ask for.

If you use the same filled-in template often, many agentic tools let you save it as a reusable instruction — a skill, a prompt file or a command — so you can call it by name ([which tools offer what](contextqb://references/setup#reusable-instructions)).

## Why this matters

A document is a contract. It survives. It can be reviewed. It can be acted on. A chat reply evaporates.
