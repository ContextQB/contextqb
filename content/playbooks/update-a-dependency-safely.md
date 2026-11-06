---
id: update-a-dependency-safely
title: Update a Dependency Safely
summary: Investigate one software dependency update, check the behavior and compatibility it affects and record a justified adoption or deferral.
version: 0.3.0
audience: [novice-builder, founder, operator, agent]
journey_stage: 6
journey_rank: 40
problem: A new dependency version can fix a real problem while changing behavior elsewhere, and a successful installation does not show that the product still works.
when_to_use: When a package, framework or runtime update is needed for security, support, compatibility or a product change.
expected_outputs:
  - An identified dependency, current and proposed versions, reason and affected behavior.
  - A bounded update with baseline, compatibility and recovery evidence.
  - An adoption or deferral decision with an owner and a concrete follow-up.
related:
  - change-stored-data-safely
  - changing-software-without-losing-control
  - operating-a-small-app
  - review-an-agent-workstream
  - rollback-vs-restore
  - setting-up-git-and-github
  - testing-agent-built-software
related_principles:
  - maintainability
tags: [maintainability, reliability]

---

# Update a Dependency Safely

A **dependency** is software your project relies on, such as a package that reads files or a framework that runs the interface. Updates are ordinary product maintenance. Choose a specific reason, check the relevant behavior and keep a recovery path available.

Start with [Changing Software Without Losing Control](contextqb://guides/changing-software-without-losing-control) and an understood verification baseline from [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software). A security notice may require prompt action; it still needs an identified target and a checked response.

## Step 1 — Identify what actually changes

Ask the agent to name the exact package and publisher, installed version, proposed version and where the app uses it. A **direct dependency** is one your project selects; a **transitive dependency** is brought in by another dependency. GitHub's [dependency graph documentation](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-graph) describes tracing those relationships; the task does not require GitHub.

A **manifest** declares the dependencies your project asks for. A **lockfile** records the resolved versions selected for installation. Inspect both and the installed result: a range in a manifest is not necessarily the version currently running. npm's [lockfile documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/) explains its role; use your project's own package manager and supported update procedure.

Include the required runtime, the program that executes the application, and any companion packages that must move together. A hosted service's API version may require coordination too, but changing a local package does not automatically change that service. Record that as a separate target if needed.

## Step 2 — Read the reason and compatibility evidence

Use the maintainer's release notes, migration instructions and relevant **security advisory**, a published notice from the maintainer or a security database, rather than an agent's memory of the latest version. Verify the package identity and distribution source before installing it. Check supported runtime versions, changed interfaces or defaults, installation scripts, known issues and license changes, which can change whether you may use or distribute the package. An installation can execute code; npm's [lifecycle-script documentation](https://docs.npmjs.com/cli/v11/using-npm/scripts/) is one example. Keep production credentials out of the rehearsal environment and use the project's established installation policy.

For projects following [Semantic Versioning](https://semver.org/), major/minor/patch numbers communicate intended compatibility: breaking changes, compatible additions and compatible fixes after version 1.0. Initial `0.x` releases have a weaker stability promise. Version numbers help you decide what to inspect; they do not replace release notes or your checks.

If a security advisory prompted the update, record the affected version range, whether your installed version falls within it, whether the affected function is used or reachable, and any remaining uncertainty. Do not dismiss a finding merely because a quick scan found no obvious use. If exposure or urgency is unclear, get appropriate technical help and consider a bounded mitigation while investigating.

## Step 3 — Plan one update and preserve the baseline

Save a recoverable source checkpoint, a recorded version you can return to using [Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github), along with the manifest and lockfile, and the environment assumptions needed to reproduce the existing build. Record current check results before the update so an older failure is not misattributed to it. Explain any baseline gap that prevents a meaningful comparison.

Scope one dependency change and the related compatibility work it requires. A transitive fix may mean updating its direct parent. Forcing a different version of a transitive dependency outside the parent's supported range needs separate compatibility evidence; a smaller-looking file change is not automatically safer.

Name the user tasks, failure cases and stored data that could change. [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) governs the recovery decision. If the update writes a new data format or runs migrations, use [Change Stored Data Safely](contextqb://playbooks/change-stored-data-safely) before treating the old package version as a recovery option.

## Step 4 — Update an isolated copy and check the product

Have the agent use the project's existing package manager in a separate working copy or approved branch, with controlled data and no automatic deployment. Inspect the manifest and lockfile diff, including unexpected transitive changes. Install from that result in a clean, isolated environment and record the resolved versions. A lockfile aids reproducibility; it does not establish the safety of the downloaded code or reproduce every external service and machine setting.

Run the applicable checks and build, then exercise the behavior that uses the dependency. Include a representative failure and any data-compatibility case identified in the plan. An installation success or a zero-warning scan alone does not establish product behavior. Keep results tied to the exact candidate and test environment.

## Worked decision: a green build with a broken export

This is an **invented update exercise**; the library is unnamed and every observation below is made up for teaching. A volunteer coordinator's app exports the weekly rota as a CSV file so helpers can open it in a spreadsheet and see where they are assigned. **CSV** (comma-separated values) is a plain-text table format: each line is a row, and a comma normally starts the next column. The app uses a library to write that file. The library's release notes say a new version fixes an export problem the coordinator has run into, so the agent tries the update in an isolated copy of the project. Nothing needs to be built or installed to follow the example.

Before reading the results, notice what a comma inside a value means. A two-column rota has a `helper` column and a `location` column. If a location's name itself contains a comma, such as “Hall, East”, CSV marks that value as one field by putting it in double quotation marks. Spreadsheets then read `"Hall, East"` as one location, not two columns.

The installation and the build both succeed. The coordinator then checks a made-up export containing one ordinary row and one location with a comma. Here is the output from the current library:

```text
helper,location
Test Volunteer,"Hall, East"
Test Helper B,Kitchen
```

And here is the output from the candidate version (fictional observation):

```text
helper,location
Test Volunteer,Hall, East
Test Helper B,Kitchen
```

The candidate fails to quote the location. A spreadsheet reads the second line as three columns: “Test Volunteer”, “Hall” and “ East”. The helper's location now appears as just “Hall”, with a stray value in a column that has no heading. A volunteer could go to the wrong hall.

The update has broken the useful promise even though the build is green. Keep the candidate out of the working export path, and ask the agent to find out whether the cause is the library, the way the app calls it (for example, a changed default setting), or the test setup. Then check a corrected candidate against the same expectations:

- an ordinary row is exported unchanged;
- a value containing a comma stays one quoted field and reads back as exactly “Hall, East”;
- an empty rota produces just the heading line, `helper,location`, with no blank rows.

Compare what the file means when a spreadsheet reads it, not just whether a file was produced. For your own update, identify the task that actually uses the dependency and choose one input that could expose a meaningful difference. A version change is successful when the required behavior survives, not merely when the package manager finishes.

If an update is driven by a security advisory, the earlier steps still apply: check whether your version and usage are actually affected, and consider a bounded mitigation while a broken candidate is investigated. Do not simply keep an exposed vulnerable version indefinitely.

## Step 5 — Review, decide and leave the next action

Use a fresh reviewer through [Review an Agent Workstream Result](contextqb://prompts/review-an-agent-workstream) to inspect the actual change, notices and evidence. Decide whether to adopt, correct, mitigate and defer, or investigate further. Record any unknown that matters to the exposed task.

Keep the before/after versions, reason, changed files, checks, recovery limits, decision, owner and follow-up in the existing project record. If the project has no such record yet, create one short note where it keeps its documentation, for example `docs/dependency-updates.md`; no new documentation structure is needed. Set a review date or concrete trigger for a deferral, especially a security or end-of-support issue. [Operating a Small App](contextqb://guides/operating-a-small-app) owns the recurring maintenance routine. A tested update candidate still follows the project's release process before users receive it.
