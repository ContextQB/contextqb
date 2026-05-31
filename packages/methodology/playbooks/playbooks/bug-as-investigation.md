---
id: bug-as-investigation
title: Convert a Bug Into an Architectural Investigation
summary: Most bugs are symptoms of a structural problem. This playbook turns a single bug report into a clean diagnosis of what is actually wrong.
version: 0.1.0
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
tags:
  - debugging
  - investigation
---

# Convert a Bug Into an Architectural Investigation

A bug is data. The shape of the bug tells you something about the shape of the system.

If your reaction to a bug is "okay, I'll add an `if` to handle that," you have not finished investigating.

## The investigation prompt

> A bug has been reported: **\[describe the bug, including how to reproduce it].**
>
> Before proposing a fix, produce an investigation document with these sections:
>
> 1. **Reproduction.** Confirm the steps to reproduce, with specific file references showing what code runs.
> 2. **Symptom.** What the user sees.
> 3. **Direct cause.** The line or function that produces the wrong behaviour.
> 4. **Underlying cause.** What about the system's structure made this bug possible. Reference the ContextQB principle being violated.
> 5. **Related risks.** Where else this same structural cause could produce a different bug.
> 6. **Minimum viable fix.** The smallest change that resolves the symptom. State its risks.
> 7. **Real fix.** The structural change that prevents this class of bug. State its scope and risks.
>
> Do not write code. Be specific. Quote files and lines.

## How to decide between the two fixes

- If the underlying cause is shared by no other code, the minimum fix is fine.
- If the underlying cause shows up in two or more places, ship the minimum fix to stop the bleeding, then schedule the real fix.
- If the underlying cause is structural (state ownership, orchestration, separation of concerns), the real fix is mandatory eventually.

## Why bother

Every bug you fix without diagnosing the structural cause is a bug you are guaranteed to see again, slightly different. The investigation costs minutes. The cumulative cost of not investigating is months.
