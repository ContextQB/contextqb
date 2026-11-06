---
id: turn-a-feature-brief-into-checks
title: Turn a Feature Brief Into Checks
summary: Translate an agreed user outcome into specific checks, then connect the results to the decision to accept the feature.
version: 0.3.0
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

If you do not have a brief of your own yet, practise with this invented one. Imagine an organiser who runs a family workshop, such as a Saturday pottery morning, and wants a simple form for reserving places. One person may reserve between one and four places: enough for a family, without letting one booking take most of the session. Before the agent builds the form, the organiser writes that limit into the brief. The brief also says a reservation must still be there after the app is reopened, and the form must never say a reservation is confirmed when it was not saved. How many places the whole workshop has is a separate rule that this brief does not set. You do not need to build a booking system to write these examples.

“The form works” would not tell a reviewer what to check. A starting situation, an action and an expected result will:

- **Normal case:** start with no reservations in a disposable test copy. Enter two places and submit. Expected: one saved reservation for two places, still listed after the app is closed and reopened using the same storage location.
- **Invalid input:** enter zero, five, or one and a half places. Each is refused, because a reservation needs a whole number from one through four. Nothing is saved, and the person can correct the number.
- **Failed save:** with a valid request of two places, make storage fail in the isolated test. Expected: the form does not say the reservation is confirmed, keeps what was entered and explains that it was not saved.

Include a normal case and a meaningful failure or invalid-input case where relevant. Do not add a ceremonial number of cases. If a criterion still says “works properly,” replace it with something a person or test could observe.

## Step 2 — Choose a check that can see the failure

Ask the agent what each check will actually exercise. In the workshop brief, a small rule test can check which numbers are allowed. It cannot show that a reservation was saved. A storage check can show that a record was written and read back, but it would still miss a form that never calls the saving code. A user-path check follows the form into storage and reads the reservation back after reopening.

For each promise in your brief, write down what would expose it being broken, which check sees that failure, and what that check leaves untested. You can find gaps this way without reading code. If the only evidence for “still there after reopening” is a screenshot taken before the app was closed, that promise has not been checked.

For a simulated failed save, name how failure will be introduced in the isolated test and what the interface should do. A substituted storage failure demonstrates the app's reaction to that simulation, not every failure the real storage system might produce. Record the limit.

Distinguish automation from human checks. Someone still needs to try the intended interaction and judge whether the explanation is understandable. [Checks, Tests and Review](contextqb://briefings/checks-tests-and-review) explains those complementary roles.

## Step 3 — Put the mapping in the feature record

Use one short entry per criterion in the existing plan. These illustrative fields are enough to start:

```text
Criterion: a valid reservation survives reopening the app
Example: start with no reservations; reserve 2 places
Check: submit through the form, close, reopen and read the
       reservation through the intended interface
Target: disposable test copy and explicitly named storage location
Revision/configuration: record the actual version tested
Evidence: command/output or manual steps and observed values
Result: not run / passed / failed / blocked
Limits and next action: what this check cannot establish
```

A second entry for the same brief might record the criterion “zero, five and 1.5 places are refused” with a rule test as its check. Its limits would say that the rule test does not show the form uses the rule. Keep one entry per criterion so each limit stays next to the promise it affects.

A **revision** identifies the version of the files being checked, commonly a Git commit: a saved snapshot made with the Git version-control tool. If there are additional uncommitted changes, record that too; the commit identifier alone would not describe the tested files. The feature record owns this information, so the next session can find it.

## Step 4 — Build and run within the agreed target

Use the [feature build loop](contextqb://playbooks/feature-build-loop) or its small-change path to implement the approved feature and checks. Ask the agent to identify the actual commands already configured in your project; do not copy a command from an unrelated framework and assume it verifies your app.

Have it show execution results, including failed, skipped and blocked cases. “Tests added” is not “tests ran.” “Tests ran” is not “this acceptance criterion was checked.” Ask it to connect the output to the criterion and the exact target.

Run the project's existing mechanical checks as well. [Machine-Verifiable Substrate](contextqb://principles/machine-verifiable-substrate) explains their role. Do not remove a useful assertion or weaken an expectation to make the result green without a deliberate change to the requirement.

## Step 5 — Demonstrate that a check can catch a mistake

For this learning exercise, require one controlled demonstration. You can use the worked exercise in [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software): it uses the same one-to-four-places rule. A deliberately flawed version accepts a reservation for zero places, and a test with the wrong expectation lets it pass. It is a teaching specimen, not a rule to adopt. Alternatively, use a reproduced defect or an explicitly approved temporary change in a disposable test copy.

Show that the correct expectation fails against the faulty implementation for the intended reason, then passes after the correction. If a temporary defect is introduced, restore the intended code, inspect the final difference and rerun the affected checks before continuing. Never perform this exercise against production or real user data.

This demonstration is a teaching aid for evaluating a test, not a demand to inject a defect into every future routine change. One demonstrated check does not validate an entire test suite.

## Step 6 — Review, use and decide

Use the fresh-session or human-review route in [Directing Your First Feature](contextqb://guides/directing-your-first-feature). Give that reviewer the brief, actual changes and evidence mapping. Ask them to inspect whether the checks support the important claims, including whether test substitutes hide a connection that remains untested. Use the feature yourself and compare the result with your original need.

Record the decision as accepted within a named scope, correction required, or blocked by a stated missing result. Preserve remaining limits. A successful local practice exercise is not authorization to release a product other people rely on. A checked one-to-four rule, for example, still says nothing about total workshop capacity or two people reserving the last places at once.

## A prompt to start the mapping

Give the agent the brief and this instruction:

> Read **[brief path]**. For each important acceptance criterion, propose a concrete starting situation, action and expected result. Name the check that could detect a failure, its target and any substituted dependencies. Identify expectations that need my decision. Add the mapping to our existing feature record and mark every unrun check “not run.” Do not implement or run checks yet. Include one safe proposal for demonstrating that a meaningful check catches an intentional mistake.

Review that mapping before authorizing its execution. You are ready to continue when you can point from a requirement to an observed result, explain an important limit and say why the evidence supports your decision.
