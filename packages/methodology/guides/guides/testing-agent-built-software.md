---
id: testing-agent-built-software
title: Testing Agent-Built Software
summary: Choose checks from the behavior you need, recognize weak tests and judge what a passing result actually demonstrates.
version: 0.1.4
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 3
journey_rank: 20
intro: An agent can write the code and its tests from the same mistaken assumption. Start with the result you need and make the checks answer to that expectation.
related:
  - bug-as-investigation
  - changing-software-without-losing-control
  - check-a-user-journey-with-a-person
  - checks-tests-and-review
  - directing-your-first-feature
  - how-to-use-contextqb
  - machine-verifiable-substrate
  - making-your-app-usable
  - preparing-for-real-users
  - test-an-integration-failure
  - turn-a-feature-brief-into-checks
  - update-a-dependency-safely
tags:
  - getting-started
  - testing

---

# Testing Agent-Built Software

**Plain language:** A test is useful when it checks something your product actually needs to do. An agent can write many tests that all agree with a wrong implementation. You do not need to write every test yourself, but you do need to choose the expected behavior and inspect the evidence.

## Start with the promise, before the code

Use this guide after choosing a bounded feature in [Directing Your First Feature](contextqb://guides/directing-your-first-feature). You can design the checks before the feature exists. For the research notebook, the promise includes reopening saved notes, rejecting blank input and keeping a draft when saving fails.

Write an **acceptance criterion**: a condition the feature must meet for you to accept it. “The note is still available after I close and reopen the app” is a criterion. “The agent added a save function” describes an implementation action; it does not establish that the useful behavior works.

Then choose a specific example. Use synthetic values that are safe to create, change and remove. State the expected result before reading the agent's result, so an attractive output does not quietly change your standard.

## Match the check to the question

Different checks see different parts of the application:

- **Unit test** — checks a small piece on its own. For the notebook, does the input rule reject a note containing only spaces?
- **Integration test** — checks parts working together. Does saving through the application logic write values that the storage layer reads back correctly?
- **End-to-end test** — exercises a user path through the running application. Can an automated run, acting like the person, enter, save and reopen the note through the intended interface?

An automated test performs an action and compares the result with an expectation. A manual check is a person deliberately trying a case and recording what happened. Human observation also answers questions about whether an interface is understandable that automated behavior checks do not settle. MDN's [testing curriculum](https://developer.mozilla.org/en-US/curriculum/extensions/testing/) distinguishes functional checks from usability, compatibility and other testing concerns.

You do not need every kind of test for every change. Choose the smallest check that can catch the relevant mistake, then cover the connections on which the user's result depends. A unit test cannot establish that a database connection works if it never uses one.

## Know what the test substitutes

A **fixture** is prepared example data. A **test double**, often loosely called a mock, substitutes for a real dependency, such as storage or an outside service. Substitutes can make a failure easy to reproduce without touching real data, but their limits matter.

If a test replaces storage with an in-memory list, it can help check how the interface responds to a save result. It cannot demonstrate survival after closing the application. Ask which parts are real, which are substituted and what additional check covers the real connection.

For this local notebook, test the chosen storage in a disposable location and reopen using that same location, including the same browser profile and site address when storage is in the browser. Do not silently switch to a different test directory and interpret the missing note as a storage failure. Have the agent explain its setup and cleanup so you can understand what was actually exercised.

## Worked exercise: a passing test with the wrong expectation

This deliberately flawed JavaScript example checks only whether a note is acceptable. You can understand it in plain language: `text.length` measures the length of text, including spaces, and `> 0` asks whether there is at least one. The notebook's [agreed input rule](contextqb://guides/directing-your-first-feature) requires something besides spaces.

The faulty implementation is:

```js
function canSaveNote(text) {
  return text.length > 0;
}
```

Now imagine a test whose name says “rejects blank notes,” but whose actual check is `canSaveNote("   ") === true`. `===` means “is exactly equal to,” and `"   "` is a note of three spaces. In plain language, this check says a note of only spaces should be accepted. The test passes. The name sounds reassuring; the expectation says the wrong result is acceptable.

Here is an illustrative completion report, not a real test receipt:

```text
Added note validation. “Rejects blank notes” passes. All checks are green.
The feature is ready for customers.
```

Before reading further, decide what you would challenge. Which part contradicts the brief? What evidence about saving and reopening is absent? What justifies the claim about customers?

The assertion should be `canSaveNote("   ") === false`: a note of three spaces must be rejected. A check that expects `false` fails against this implementation. The agent could correct this rule with `text.trim().length > 0`: `trim()` removes whitespace, including spaces, tabs and line breaks, at the ends before the length check, as [MDN documents](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim). It should also show that an ordinary note is accepted and an empty string is rejected. This fixes the illustrated rule. To verify the full feature, also check that the interface uses it and that accepted notes survive saving and reopening.

The lesson is not to memorize JavaScript. Ask the agent to show the **assertion**, the actual comparison in a test, and translate it into plain language. A test name is a label; the assertion determines what the check accepts.

## Make a failure informative

For a reported defect, ask for a check that fails on the incorrect behavior before the fix and passes afterward. Inspect why it failed: an unrelated setup error does not prove that the test catches the defect. Preserve the same expected behavior across the correction rather than changing it to match the broken code.

In a disposable local exercise, you can also ask the agent to introduce one controlled mistake to demonstrate that a check detects it, then restore the correct implementation and rerun. Agree the exact edit and test target first. This is not an instruction to break a live application or leave a deliberately faulty change in the project.

When a bug needs diagnosis, use [Convert a Bug Into an Architectural Investigation](contextqb://playbooks/bug-as-investigation). Reproducing the user's problem is useful evidence; it does not mean every small defect requires redesigning the entire application.

## Repeat useful checks as the product changes

A **regression** is something that used to work and stops working after a change. Keep valuable checks so they can expose that loss. **Continuous integration**, or CI, means running agreed automated checks as changes enter the shared project. Ask the agent which checks run there and which still require local setup or human use.

The broader principle is [Machine-Verifiable Substrate](contextqb://principles/machine-verifiable-substrate): use mechanical checks to catch the mistakes they can detect. Those checks still need correct expectations. Passing results apply to the tested revision, configuration, inputs and paths, not every possible future situation.

## Use the evidence to make a decision

For each important criterion, ask the agent to show the check, target, command or manual steps, observed result and remaining limits. Treat an unrun check as unknown. Use the fresh-session or human-review route described in [Directing Your First Feature](contextqb://guides/directing-your-first-feature) to inspect the relevant code and checks against the brief; your own use should confirm the promised behavior.

Keep the evidence in the existing feature record. The playbook [Turn a Feature Brief Into Checks](contextqb://playbooks/turn-a-feature-brief-into-checks) turns this approach into a repeatable procedure. [Checks, Tests and Review](contextqb://briefings/checks-tests-and-review) helps you read a completion report without treating different kinds of evidence as interchangeable.

Before you move on, choose one requirement in your own product and name a test that could pass while that requirement still fails. Then name the missing check. That decision is the skill you are practicing.
