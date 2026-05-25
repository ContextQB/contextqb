---
id: agent-instructions
title: Create Agent Instructions That Produce Documents, Not Chat Replies
summary: How to write agent prompts that return structured, decision-grade documents rather than meandering conversational answers.
version: 0.1.0
problem: |
  Most agent prompts produce conversational answers — useful for back-and-forth, useless as a permanent artifact. For audits, reviews, and plans, you want a document you can save, share, and act on.
when_to_use: |
  Whenever you need an agent to produce something you will save, share with a stakeholder, or use as the basis for further work.
expected_outputs:
  - A prompt that produces a structured document.
  - A clear set of required sections.
  - A defined audience and tone.
  - A defined deliverable format.
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 2
related_principles:
  - orchestration
  - maintainability
tags:
  - prompts
  - documents
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
> 7. Implementation plan — 30 / 60 / 90 days."

### 4. Evaluation criteria

What makes the document good vs. mediocre?

> "A good document is specific. It quotes file paths and code. It does not make general claims like 'consider modularity' — it points at the exact module that lacks it and explains what good would look like."

### 5. Tone constraints

Especially important for non-developer audiences.

> "Write so a non-developer can read it. Define any technical term the first time you use it. Avoid enterprise jargon."

### 6. Out-of-scope

What the agent should _not_ do.

> "Do not write code. Do not propose changes outside the scope of this review."

## A template

Copy and adapt:

```text
You are <ROLE>, producing <DOCUMENT_TYPE> for <AUDIENCE>.

Objective: <ONE SENTENCE>.

Required sections, in this order:
1. <SECTION>
2. <SECTION>
3. ...

Evaluation criteria: <WHAT MAKES THIS GOOD VS MEDIOCRE>.

Tone: <CONSTRAINTS>.

Out of scope: <EXPLICIT NON-GOALS>.

Source material: <PATHS / RESOURCES / CONTEXT>.

Produce the full document. Do not summarise it. Do not ask clarifying questions — make reasonable assumptions and state them.
```

## Why this matters

A document is a contract. It survives. It can be reviewed. It can be acted on. A chat reply evaporates.
