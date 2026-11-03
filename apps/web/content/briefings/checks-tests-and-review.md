---
id: checks-tests-and-review
title: Checks, Tests and Review
summary: Understand what different checks establish so you can read an agent's completion report without accepting claims it has not demonstrated.
version: 0.1.3
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 3
journey_rank: 30
framing: What does “all checks passed” actually tell you about the feature you asked for?
related:
  - directing-your-first-feature
  - machine-verifiable-substrate
  - testing-agent-built-software
  - turn-a-feature-brief-into-checks
tags:
  - testing
  - audit

---

# Checks, Tests and Review

An agent says “all checks passed.” That may be useful evidence, but you need to know which checks ran and what they examined. A correctly formatted application can still save the wrong information, and a passing test can check the wrong expectation.

## Read the claim behind the label

The [Machine-Verifiable Substrate](contextqb://principles/machine-verifiable-substrate) principle supplies the full verifier hierarchy. When reading a completion report, ask what each result establishes:

- **Type checks** inspect relationships between declared kinds of values. They can expose inconsistencies without running the app, but they do not establish that external data or business expectations are correct.
- **Schema checks** examine data against a declared shape and its validation rules. An accepted record can still be the wrong record for the user's goal.
- **Formatting and lint checks** inspect written code against configured rules. Check the user's task separately.
- **Behavior tests** exercise selected cases and compare results with expectations. Their value depends on those expectations, their inputs and the parts they actually exercise.
- **Independent review** examines the change against the requirement from outside the implementation session. Review can find omissions or mistaken assumptions; it is not a guarantee that none remain.
- **Your use of the feature** checks the intended task directly. It adds evidence about the experience, while leaving many code paths and failure conditions unexamined.

The principle groups independent review and your own use together in its final level. For a solo founder, [Directing Your First Feature](contextqb://guides/directing-your-first-feature) explains how to use a fresh agent session or another person as the reviewer. These forms of evidence complement one another. A count of passing checks cannot tell you whether the important behavior is among them.

## A report you should challenge

Use the [flawed note-validation exercise](contextqb://guides/testing-agent-built-software). The requirement rejects notes containing only spaces, but the test expects those notes to be accepted. The test passes and the agent calls the feature ready for customers.

You have three reasons to stop: the expectation contradicts the requirement, saving and reopening have not been demonstrated, and customer readiness extends beyond the local exercise. Ask for corrected evidence and a narrower conclusion, rather than requesting “more tests” without specifying the missing claim.

GitHub's [responsible-use guidance for its agents](https://docs.github.com/en/copilot/responsible-use/agents) also calls for reviewing and testing generated work. That guidance supports the need for scrutiny; it does not establish that every tool's review has the same capabilities or catches every error.

## Make the next decision explicit

Ask the agent to identify the tested revision and configuration, show the actual results, separate passed cases from skipped or unrun ones, and list material limits. An independent reviewer should inspect the actual changes and expectations. Your acceptance should state the behavior and scope you are accepting.

Try this before asking for help: your app's type check passes and the Save button displays a success message. Which evidence is missing for the claim “the note will still be there tomorrow”? A write-and-read check through the actual storage path, including reopening in the agreed environment, addresses that claim more directly than another formatting check.

Use [Turn a Feature Brief Into Checks](contextqb://playbooks/turn-a-feature-brief-into-checks) to connect the requirements, checks and results in the existing feature record. The useful question is specific: “What evidence supports this promise?”
