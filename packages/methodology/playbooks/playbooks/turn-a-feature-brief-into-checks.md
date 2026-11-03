---
id: turn-a-feature-brief-into-checks
title: Turn a Feature Brief Into Checks
summary: Translate an agreed user outcome into specific checks, then connect the results to the decision to accept the feature.
version: 0.1.3
audience:
  - novice-builder
  - founder
  - agent
journey_stage: 3
journey_rank: 40
problem: A feature can pass tests written from the agent's assumptions while failing the behavior the user actually requested.
when_to_use: Before implementing an agreed feature, and again when checking the delivered result against its acceptance criteria.
expected_outputs:
  - Observable examples for each important acceptance criterion.
  - A criterion-to-check record with target, result, evidence and limits.
  - On first use, a demonstrated defect-catching check on an isolated example or test target.
  - An acceptance or correction decision in the existing feature record.
related:
  - change-stored-data-safely
  - checks-tests-and-review
  - directing-your-first-feature
  - feature-build-loop
  - feature-planning
  - plan-data-retention-and-deletion
  - test-an-integration-failure
  - testing-agent-built-software
related_principles:
  - machine-verifiable-substrate
tags:
  - planning
  - testing

---

# Turn a Feature Brief Into Checks

Use this playbook to make the promised behavior checkable before the agent builds it. You decide what the product must do. The agent proposes and implements suitable checks, shows their results and explains their limits. An independent review and your acceptance remain separate from its completion report.

Start with a bounded brief from [Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning). If the testing terms are unfamiliar, read [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) first. This procedure adds evidence to the existing brief and build record; it does not create a second workstream.

## Step 1 — Make the expected behavior concrete

For each important acceptance criterion, describe the starting situation, action and expected result. Use a real intended task with synthetic data. Resolve ambiguity with the person responsible for the product before asking the code to decide it.

For the notebook's [worked brief](contextqb://guides/directing-your-first-feature), one example is: start with a disposable empty notebook, save a specified title and note, close and reopen the app using the same storage location, and read back the accepted values. Another is: enter a note containing only spaces; saving is refused and the draft remains available for correction.

Include a normal case and a meaningful failure or invalid-input case where relevant. Do not add a ceremonial number of cases. If a criterion still says “works properly,” replace it with something a person or test could observe.

## Step 2 — Choose a check that can see the failure

Ask the agent what each check will actually exercise. A unit test can check the blank-note rule; it cannot establish reopening behavior. A storage test can check a write and read; a user-path check verifies that the interface reaches the intended storage operation.

For a simulated failed save, name how failure will be introduced in the isolated test and what the interface should do. A substituted storage failure demonstrates the app's reaction to that simulation, not every failure the real storage system might produce. Record the limit.

Distinguish automation from human checks. Someone still needs to try the intended interaction and judge whether the explanation is understandable. [Checks, Tests and Review](contextqb://briefings/checks-tests-and-review) explains those complementary roles.

## Step 3 — Put the mapping in the feature record

Use one short entry per criterion in the existing plan. These illustrative fields are enough to start:

```text
Criterion: saved title and note survive reopening in the same browser
           profile or app installation on this device
Example: the title and note from our agreed brief
Check: save, close, reopen and read through the intended interface
Target: disposable local app and explicitly named storage location
Revision/configuration: record the actual version tested
Evidence: command/output or manual steps and observed values
Result: not run / passed / failed / blocked
Limits and next action: what this check cannot establish
```

A **revision** identifies the version of the files being checked, commonly a Git commit: a saved snapshot made with the Git version-control tool. If there are additional uncommitted changes, record that too; the commit identifier alone would not describe the tested files. The feature record owns this information, so the next session can find it.

## Step 4 — Build and run within the agreed target

Use the [feature build loop](contextqb://playbooks/feature-build-loop) or its small-change path to implement the approved feature and checks. Ask the agent to identify the actual commands already configured in your project; do not copy a command from an unrelated framework and assume it verifies your app.

Have it show execution results, including failed, skipped and blocked cases. “Tests added” is not “tests ran.” “Tests ran” is not “this acceptance criterion was checked.” Ask it to connect the output to the criterion and the exact target.

Run the project's existing mechanical checks as well. [Machine-Verifiable Substrate](contextqb://principles/machine-verifiable-substrate) explains their role. Do not remove a useful assertion or weaken an expectation to make the result green without a deliberate change to the requirement.

## Step 5 — Demonstrate that a check can catch a mistake

For this learning exercise, require one controlled demonstration. You can use the deliberately flawed note rule in [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software), a reproduced defect, or an explicitly approved temporary change in a disposable test copy.

Show that the correct expectation fails against the faulty implementation for the intended reason, then passes after the correction. If a temporary defect is introduced, restore the intended code, inspect the final difference and rerun the affected checks before continuing. Never perform this exercise against production or real user data.

This demonstration is a teaching aid for evaluating a test, not a demand to inject a defect into every future routine change. One demonstrated check does not validate an entire test suite.

## Step 6 — Review, use and decide

Use the fresh-session or human-review route in [Directing Your First Feature](contextqb://guides/directing-your-first-feature). Give that reviewer the brief, actual changes and evidence mapping. Ask them to inspect whether the checks support the important claims, including whether test substitutes hide a connection that remains untested. Use the feature yourself and compare the result with your original need.

Record the decision as accepted within a named scope, correction required, or blocked by a stated missing result. Preserve remaining limits. A successful local notebook exercise is not authorization to release a multi-user product.

## A prompt to start the mapping

Give the agent the brief and this instruction:

> Read **[brief path]**. For each important acceptance criterion, propose a concrete starting situation, action and expected result. Name the check that could detect a failure, its target and any substituted dependencies. Identify expectations that need my decision. Add the mapping to our existing feature record and mark every unrun check “not run.” Do not implement or run checks yet. Include one safe proposal for demonstrating that a meaningful check catches an intentional mistake.

Review that mapping before authorizing its execution. You are ready to continue when you can point from a requirement to an observed result, explain an important limit and say why the evidence supports your decision.
