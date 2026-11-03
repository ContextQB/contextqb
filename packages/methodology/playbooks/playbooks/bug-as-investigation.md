---
id: bug-as-investigation
title: Convert a Bug Into an Architectural Investigation
summary: Most bugs are symptoms of a structural problem. This playbook turns a single bug report into a clean diagnosis of what is actually wrong.
version: 0.4.1
problem: |
  Patching the immediate bug fixes the symptom and leaves the structural cause in place. The next bug arrives soon, in a different shape.
when_to_use: |
  When a bug is the second of its kind, or when the obvious fix feels like duct tape.
expected_outputs:
  - A diagnosis distinguishing symptom from cause.
  - The principle being violated.
  - A "minimum viable fix" and a "real fix" — clearly separated.
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 3
journey_rank: 60
related_principles:
  - anti-spaghetti
  - orchestration
  - state-ownership
  - the-plan-is-the-contract
related:
  - respond-to-an-outage
  - review-feedback-and-plan-the-next-change
  - run-an-agent-workstream
  - testing-agent-built-software
tags:
  - debugging
  - investigation

---

# Convert a Bug Into an Architectural Investigation

A bug is data. The shape of the bug tells you something about the shape of the system.

If your reaction to a bug is "okay, I'll add an `if` to handle that," you have not finished investigating. The plain trigger for this playbook: **the agent's fix adds an `if` without explaining why the wrong value got there in the first place.** That is a symptom being hidden, not a cause being fixed. It happens in a first build as often as in an old codebase.

## The investigation prompt

You can give the agent a useful starting report without diagnosing the code: “I entered a title and note, pressed Save, closed the app and reopened it. I expected the same values, but the note was missing.” Record the target and steps, using synthetic data where possible. Then ask it to investigate what actually happened. [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) explains how a failing check can preserve that expectation while the cause is investigated.

**Before you paste.** Replace the first bracketed text with your bug report, and the bracketed “Principles” line at the end with your choice below. Section 4 asks the agent to name the design principle the bug breaks. An agent without the ContextQB library may not know these principles, so give it the ones that fit: attach or paste one or two whose descriptions match your bug. Three that often explain bugs are [state ownership](contextqb://principles/state-ownership) (two parts of the app each think they own the same value), [orchestration](contextqb://principles/orchestration) (nobody coordinates the steps of a workflow) and [anti-spaghetti](contextqb://principles/anti-spaghetti) (a checklist of eight signs of tangled code). If your agent is connected to the ContextQB MCP server, you can instead name the principles you want in the request's last line and the agent will retrieve them from the server. Either way, the agent may cite only principle text it actually has in front of it: what you attached or pasted, or what you named and it retrieved. If you supply none, the agent should describe the structural cause in plain words.

> A bug has been reported: **\[describe the bug, including how to reproduce it].**
>
> Before proposing a fix, produce an investigation document with these sections:
>
> 1. **Reproduction.** Confirm the steps to reproduce, with specific file references showing what code runs. Where possible, write a failing automated test that reproduces the bug, run it, and report the command and its failing result.
> 2. **Symptom.** What the user sees.
> 3. **Direct cause.** The line or function that produces the wrong behaviour.
> 4. **Underlying cause.** What about the system's structure made this bug possible. If I have attached or pasted design principles, or named principles below for you to retrieve from the ContextQB MCP server and you retrieved them, name the one this violates and quote the part that applies. If retrieval fails, say so. If none fits, or I supplied none, describe the structural cause in plain words. Cite only principle text you actually have from me or retrieved at my request; do not cite principles from memory.
> 5. **Related risks.** Where else this same structural cause could produce a different bug.
> 6. **Minimum viable fix.** The smallest change that resolves the symptom. State its risks.
> 7. **Real fix.** The structural change that prevents this class of bug. State its scope and risks.
>
> Do not change the application code. Be specific. Quote files and lines.
>
> Principles: **\[paste or attach them below, or write "retrieve from the ContextQB MCP: state-ownership, orchestration" — or "none"].**

## How to decide between the two fixes

The investigation is a diagnosis, not permission to fix. You decide which fix to authorize.

- If the underlying cause is shared by no other code, the minimum fix is fine.
- If the underlying cause shows up in two or more places, ship the minimum fix to stop the bleeding, then schedule the real fix. Record the real fix as a _proposed addition_ in your project's outstanding items (see [Run an Agent Workstream](contextqb://playbooks/run-an-agent-workstream), Step 5), with the investigation as its evidence, so it is neither forgotten nor started without your approval.
- If the underlying cause is structural (state ownership, orchestration, separation of concerns), the real fix is mandatory eventually.

## Why bother

Whichever fix you choose, the failing test from step 1 should now pass; that red-then-green pair is evidence you can read without reading the code. Every bug you fix without diagnosing the structural cause is a bug you are guaranteed to see again, slightly different. The investigation costs minutes. The cumulative cost of not investigating is months.
