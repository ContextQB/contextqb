---
id: bug-as-investigation
title: Convert a Bug Into an Architectural Investigation
summary: Most bugs are symptoms of a structural problem. This playbook turns a single bug report into a clean diagnosis of what is actually wrong.
version: 0.2.0
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
journey_rank: 20
related_principles:
  - anti-spaghetti
  - state-ownership
  - orchestration
  - the-plan-is-the-contract
related:
  - run-an-agent-workstream
tags:
  - debugging
  - investigation
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-07 renewal B6 (0.2.0; author self-checked; independent review pending; not operator-accepted): reproduction asks for a failing automated test where possible, so the fix shows red then green; adds a plain trigger (the agent's fix adds an if without explaining why the wrong value got there); the investigation authorizes no fix — you choose, and the real fix is recorded as a proposed addition in the outstanding-items register (run-an-agent-workstream Step 5) so it does not silently become work; framed as a first-build habit, not a Tier-2 artifact. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; short and sharp; symptom/cause + minimum-fix/real-fix split is distinctive. R8 pending P4."
---

# Convert a Bug Into an Architectural Investigation

A bug is data. The shape of the bug tells you something about the shape of the system.

If your reaction to a bug is "okay, I'll add an `if` to handle that," you have not finished investigating. The plain trigger for this playbook: **the agent's fix adds an `if` without explaining why the wrong value got there in the first place.** That is a symptom being hidden, not a cause being fixed. It happens in a first build as often as in an old codebase.

## The investigation prompt

> A bug has been reported: **\[describe the bug, including how to reproduce it].**
>
> Before proposing a fix, produce an investigation document with these sections:
>
> 1. **Reproduction.** Confirm the steps to reproduce, with specific file references showing what code runs. Where possible, write a failing automated test that reproduces the bug, run it, and report the command and its failing result.
> 2. **Symptom.** What the user sees.
> 3. **Direct cause.** The line or function that produces the wrong behaviour.
> 4. **Underlying cause.** What about the system's structure made this bug possible. Reference the ContextQB principle being violated.
> 5. **Related risks.** Where else this same structural cause could produce a different bug.
> 6. **Minimum viable fix.** The smallest change that resolves the symptom. State its risks.
> 7. **Real fix.** The structural change that prevents this class of bug. State its scope and risks.
>
> Do not change the application code. Be specific. Quote files and lines.

## How to decide between the two fixes

The investigation is a diagnosis, not permission to fix. You decide which fix to authorize.

- If the underlying cause is shared by no other code, the minimum fix is fine.
- If the underlying cause shows up in two or more places, ship the minimum fix to stop the bleeding, then schedule the real fix. Record the real fix as a _proposed addition_ in your project's outstanding items (see [Run an Agent Workstream](contextqb://playbooks/run-an-agent-workstream), Step 5), with the investigation as its evidence, so it is neither forgotten nor started without your approval.
- If the underlying cause is structural (state ownership, orchestration, separation of concerns), the real fix is mandatory eventually.

## Why bother

Whichever fix you choose, the failing test from step 1 should now pass; that red-then-green pair is evidence you can read without reading the code. Every bug you fix without diagnosing the structural cause is a bug you are guaranteed to see again, slightly different. The investigation costs minutes. The cumulative cost of not investigating is months.
