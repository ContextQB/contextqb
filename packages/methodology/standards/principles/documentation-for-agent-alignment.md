---
id: documentation-for-agent-alignment
title: Documentation for Agent Alignment
summary: In agentic development, the primary audience for your documentation is your current agent and your current self — not a future team. Docs are how you keep the agent on the architecture you've chosen, every prompt, every session.
version: 0.1.0
category: documentation
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 1
journey_rank: 10
tags:
  - documentation
  - agents
  - alignment
  - operator
anti_patterns:
  - "Writing docs for 'the team I'll hire one day' instead of for the agent you are talking to right now."
  - "Treating 'the code is the documentation' as a virtue. The code shows what; only documentation shows why."
  - Aspirational documentation — describing a future state the project is not actually in. Agents read it as truth and build to the wrong target.
  - Documentation that nobody (including the operator) ever links the agent to. If a doc is never in the context window, it does not exist for the agent.
  - Writing documentation as a separate sprint after the feature is "done." Docs that lag the code by even a week are docs that already lie.
  - Documentation written for two audiences at once (future engineer + current agent). The voice is usually wrong for both.
  - Wiki-style documentation that grows by accretion in a place the agent is never told to look.
agent_instructions:
  - When asked to do non-trivial work, name the documents you read first and quote the sentences that constrained your approach. If you cannot name them, ask for them before generating code.
  - When you observe that the operator's documentation does not reflect a constraint they just stated in chat, propose adding the constraint to the appropriate doc so the next session inherits it.
  - When a piece of documentation contradicts the current code, surface the drift. Do not silently make the code match the docs or vice versa.
  - When you make an architectural choice, propose writing it into a doc (an ADR, AGENTS.md, an overview) rather than carrying it in conversational memory.
  - Before declaring work complete, confirm which documentation was updated to reflect the change. If none, ask whether docs need updating.
related:
  - documentation-as-architecture
  - documentation-file-naming
  - naming-conventions
  - context-quarterback-the-onboarding-map
  - state-ownership
---

# Documentation for Agent Alignment

Traditional software engineering treats documentation as a courtesy to the next human who will work on the code. The next human has continuous memory. They read a file once, and the content sticks. Documentation, in that world, is mostly a one-time export.

Agentic development inverts the model. The agent has no continuous memory. Every prompt is a fresh boot. What the agent knows in this turn is exactly what is in its context window — your message, the files it has read, the system instructions it received, and nothing else.

That changes who documentation is for, and when it pays off.

## The rule

**The primary audience for documentation in agentic development is your current agent and your current self.** Future humans are a secondary, very real beneficiary — but they are not who the docs are written for. The docs are written so that the next prompt you write, and the next session the agent boots into, does not start from zero.

This is a shift in stance, not just in volume.

## The audience inversion

In traditional dev:

- **Primary audience:** the engineer who joins the team in twelve months.
- **Read pattern:** once, deeply, at onboarding.
- **Cost of skipping docs:** paid once, at the hiring or context-handoff event.

In agentic dev:

- **Primary audience:** the agent you are talking to right now, and yourself five minutes from now in a fresh session.
- **Read pattern:** every session, partially, as the agent loads what its tooling surfaces.
- **Cost of skipping docs:** paid every prompt, in tokens spent re-deriving context and in wrong-shaped output produced from guesses.

The teams getting consistent results from agents are not the teams with the best prompts. They are the teams whose documentation is the prompt — pointed at by short instructions like "before doing X, read these three files."

## The five questions to ask of any document

Before writing a doc, or when wondering whether an existing one is worth keeping, ask:

1. **Will my agent read this in the next session?** If no, why does it exist? Either delete it or make it the kind of document the agent reads.
2. **If my agent does not read this, will it reinvent the contents?** If yes, the doc is load-bearing. If no, it is decoration.
3. **Is this aspirational or actual?** A doc describing a future state the project is not yet in is worse than no doc. The agent reads it as truth and builds toward a target you did not choose.
4. **Is this short enough to live directly in a prompt, or is it referenced from the boot manifest?** Either is fine; uncertainty between the two is not.
5. **Will I actually link my agent to this, or will I assume it is "in the project somewhere?"** Documentation that is never in the context window does not exist for the agent.

If any answer is uncomfortable, the document is mis-shaped.

## The two-audiences trap

A document written for both "future engineer" and "current agent" usually serves neither. Future engineers want orientation, narrative, and history. Current agents want short, precise statements they can use without judgment. The voice that satisfies one degrades the other.

The cleanest discipline is to pick the primary audience per document and then ask whether the secondary audience needs anything different. Most of the time, the answer is "no — they will read this fine even though it was not written for them." Occasionally the answer is "they need a different document," and that is the moment to split.

The four documentation surfaces in [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture) — `AGENTS.md`, ADRs, architecture overviews, and the standards library — are all agent-primary. Each has a human-secondary value as a bonus, not as a design goal. The operator-facing guides (this content type) are operator-primary, with agent-secondary value at coaching time.

## The "I'll document later" tax

In traditional dev, "I'll document later" defers a cost that may or may not come due — depending on who joins the team and when.

In agentic dev, "I'll document later" defers a cost that is paid in every subsequent session. Each prompt that does not have access to the unwritten constraint is a prompt where the agent re-derives or invents the constraint. Over a week of work, the unwritten constraint has been re-litigated dozens of times and inconsistently applied. The cleanup cost rises faster than linear because each inconsistent application is itself a new fact the next session has to reconcile.

The economic frame: in traditional dev, documentation is amortised over hires. In agentic dev, documentation is amortised over **prompts**.

## What this principle does not say

- It does not say document everything. Documentation that does not change agent behaviour is overhead.
- It does not say write more words. Agent-aligned documentation is usually shorter than human-onboarding documentation, because it is read partially every time rather than fully once.
- It does not say skip documentation aimed at humans. If your project will grow to a team, that documentation is still worth writing. It just is not the primary motivation, and pretending it is leads to writing for the wrong audience first.

## The growth path

Operator-only today is fine. The agent is your only collaborator. Documentation focuses on keeping that collaboration on-architecture.

Operator + small team next quarter is also fine. The same documentation now serves a second purpose: orienting the new humans. The order matters — the docs were written for the agent first, and the humans benefit from clarity that was forced by writing for an audience with no continuous memory.

The teams that arrive at the team-stage with no documentation discipline find themselves writing both the agent-alignment docs and the human-onboarding docs at the same time, under deadline, from memory. That is the avoidable cost.

## How to ask an agent to enforce this

> For every documentation file in this repository, evaluate it against the five questions: (1) will my agent read this in the next session? (2) if my agent does not read this, will it reinvent the contents? (3) is this aspirational or actual? (4) is this short enough to live in a prompt, or is it referenced from the boot manifest? (5) will I actually link my agent to this? For each file, give a brief verdict and the next action — keep, shorten, split, delete, or rewrite for a clearer audience. Do not rewrite anything yet; produce the verdict list first.
