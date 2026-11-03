---
id: set-up-drift-detection
title: Set Up Drift Detection on Day One
summary: Wire the contextqb drift detector into your repo from the moment you author your first context.qb.yaml, so the map can never drift away from the territory unnoticed.
version: 0.3.3
problem: |
  A context.qb.yaml is only useful if it stays honest as the repo changes. Without a drift detector wired into your loop, every map becomes a stale map within a month, and your agent silently reads the wrong file. Setting it up on day one costs five minutes; setting it up later means triaging accumulated drift first.
when_to_use: |
  Immediately after authoring your first context.qb.yaml on a fresh or near-fresh repo. Pair this with the write-a-context-qb playbook: author the file, then run this playbook the same day.
expected_outputs:
  - "@context-qb/cli installed as a devDependency in your project."
  - A passing first run (`contextqb` exits 0, "no drift detected").
  - A `check:qb` script in `package.json` that wraps the binary.
  - A pre-commit hook or equivalent that runs `check:qb` before every commit.
  - A CI step that runs `check:qb` on every pull request.
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
journey_rank: 45
related:
  - new-project-foundation
  - retrofit-drift-detection
  - set-up-agents-md
  - write-a-context-qb
related_principles:
  - context-quarterback-the-onboarding-map
  - documentation-as-architecture
  - machine-verifiable-substrate
tags:
  - context-qb
  - drift
  - onboarding
  - ci

---

# Set Up Drift Detection on Day One

Your `context.qb.yaml` is the map your agent reads first. The drift detector is the habit that keeps that map honest.

Set this up while the repo is still simple. A clean first run tells you the file matches reality. After that, every workspace, route, or ADR change has to update the map before it can ship.

## Before you start

You need:

- A repo with a `context.qb.yaml` at the root.
- Node.js and your package manager (`pnpm`, `npm`, or `yarn`).
- Five minutes to wire the check into your normal workflow.

No `context.qb.yaml` yet? Start with [`write-a-context-qb`](contextqb://playbooks/write-a-context-qb). Write the map first, then come back here.

**Who does what.** Step 1 is your decision: read it and choose how the CLI should run on your machine. Steps 2–6 are mechanical — ask your agent to do them in one pass. Then read the first clean run's output and the hook and CI files it added; that is your check that the setup works.

## Step 1 — Know what the CLI sends, then choose

Read this before your first run, because the first run is when the choice matters:

- **Every `contextqb` command registers on first use.** The first time any command runs on your machine (outside CI), the CLI registers with ContextQB and stores a membership token locally. There is no separate opt-in step.
- **What registering is for.** Registration makes this machine a member of ContextQB's data cooperative: projects contribute anonymized counts from their maps, and members can read the aggregate patterns on the [community insights page](https://contextqb.com/insights) (which languages projects declare, how many parts, routes and decision records their maps list, how often drift checks pass, where projects deploy). Patterns are shown only for groups of at least 30 projects. Your token lets you read them; your project only counts toward them if its `context.qb.yaml` includes a `project_id` and you run checks with CLI 2.3.0 or newer. The value is a comparison with what other projects did, not advice about what your project should do. The drift check works the same whether or not you register, so choose based on whether that comparison is worth the event described next.
- **Only the drift check sends a telemetry event.** When a registered machine runs the check (`contextqb` or `contextqb check`), it sends one event after printing the results: CLI version, subcommand, event kind, adapter coverage, counts and finding codes. It does not include file contents, file paths, secrets or project names. The other commands (`membership`, `mcp setup`, `insights`, `upgrade`) do not send this event.
- **`--no-telemetry` skips that event for one run.** It does not stop first-use registration.
- **To run without registering at all,** set `CONTEXTQB_NO_PROVISION=true` for the run:

  ```bash
  CONTEXTQB_NO_PROVISION=true npx @context-qb/cli@latest
  ```

- **To see the exact event before it is sent,** add `--telemetry-preview` on a machine that is already registered. It prints the payload and sends nothing. On a machine that has never registered, preview mode skips registration, so there is no payload to show yet.

The full privacy page is at [contextqb.com/privacy/telemetry](https://contextqb.com/privacy/telemetry).

## Step 2 — Install the CLI

Install the detector as a development dependency:

```bash
pnpm add -D @context-qb/cli
```

Or, if the project uses npm:

```bash
npm install --save-dev @context-qb/cli
```

Or yarn:

```bash
yarn add -D @context-qb/cli
```

Use a dev dependency rather than relying on `npx` forever. The repo should declare the tool it depends on.

## Step 3 — Add a script

Add a script to `package.json`:

```json
{
  "scripts": {
    "check:qb": "contextqb"
  }
}
```

Now every contributor can run the same command:

```bash
pnpm check:qb
```

## Step 4 — Run it once

On a fresh or near-fresh repo, expect a clean run:

```bash
pnpm check:qb
```

Clean output looks like this:

```text
[check-qb] no drift detected.
```

If it reports drift on day one, treat that as useful feedback. The most likely cause is not bad code; it is that the first `context.qb.yaml` missed something real:

- A workspace exists on disk but is missing from `tree:`.
- A deploy config declares a route that is missing from `routes:`.
- An ADR exists but is missing from `decisions:`.
- The status in `decisions:` does not match the ADR file.

Fix the map, then run the check again.

## Step 5 — Add a pre-commit check

The goal is simple: if the repo shape changes, the same commit updates `context.qb.yaml`.

If you use Husky (one of several Git hook managers), install it, initialise it, and set the pre-commit hook to run the check:

```bash
pnpm add --save-dev husky
pnpm exec husky init
printf 'pnpm check:qb\n' > .husky/pre-commit
```

`husky init` creates `.husky/pre-commit` and a `prepare` script; the last line replaces the hook's default contents. The commands for npm and other package managers are in the [Git hooks reference](contextqb://references/setup#git-hooks).

If you do not use Husky, a plain Git hook works:

```bash
mkdir -p .git/hooks
cat > .git/hooks/pre-commit <<'EOF'
#!/usr/bin/env sh
pnpm check:qb
EOF
chmod +x .git/hooks/pre-commit
```

Either version is fine. The important part is that the check runs before the commit is accepted.

A hook runs the check on every commit, and on a registered machine each check sends one telemetry event. If you would rather the hook not send them, make the hook line `pnpm exec contextqb --no-telemetry` instead of `pnpm check:qb`.

## Step 6 — Add a CI check

Add a small GitHub Actions job:

```yaml
name: contextqb

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check-qb:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      # Reads the pnpm version from the "packageManager" field in package.json.
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check:qb
```

This makes drift visible before it merges. The check is small, fast, and specific.

This is the recipe for a pnpm project. It expects a `packageManager` field in `package.json` (for example `"packageManager": "pnpm@<version>"`) and a committed `pnpm-lock.yaml`; without the field, give `pnpm/action-setup` a `version` input instead. For npm or yarn, drop the pnpm step and use that package manager's install command.

The versions in this recipe were checked in October 2026 (last verified 2026-10): Node.js 24 is a long-term-support line, supported until April 2028 according to the Node.js release schedule, and these three action versions run on Node 24 themselves. Runtimes and action versions move on; before you copy the recipe, check the [CI runtime and action versions reference](contextqb://references/setup#ci-recipes), which records the release lines and action versions with their dates, and prefer a supported long-term-support line.

## What happens on first run

On the first run of any `contextqb` command, outside CI and unless you have opted out, the CLI registers this machine and stores a membership token locally. With that token, drift checks send the telemetry event described in Step 1, and the token-gated community insight tools become available to you: the [insights page](https://contextqb.com/insights) and the community tools in the ContextQB MCP server. Step 1 explains what they show and when your project counts toward them.

You can inspect or opt out at any time. `revoke` deletes your membership data and records a lasting opt-out on this machine:

```bash
contextqb membership status
contextqb membership revoke
```

To skip the telemetry event for one check run (registration still happens on first use):

```bash
contextqb --no-telemetry
```

To run without registering, set `CONTEXTQB_NO_PROVISION=true` for that run.

CI environments are auto-detected by default — the CLI skips registration, and therefore sends no telemetry, when it sees `GITHUB_ACTIONS`, `GITLAB_CI`, `CIRCLECI`, and similar signals. To override this on a long-lived self-hosted runner that you want counted as a cooperative member, set `CONTEXTQB_FORCE_PROVISION=true`.

## What's next

If your agent uses MCP, run:

```bash
contextqb mcp setup --client cursor
```

Use `--client claude` for the Claude Desktop shape, or no option to print both. The command prints the client configuration with your membership token filled in; keep that output out of your repository. The configurations without a token, for several clients, are in the [MCP client configuration reference](contextqb://references/setup#mcp-clients); see the [MCP page](https://contextqb.com/mcp) for the full setup path.

If this repo is not actually greenfield and the first run produced a wall of findings, switch to [`retrofit-drift-detection`](contextqb://playbooks/retrofit-drift-detection). An accumulated repo needs a reconciliation pass before enforcement.

## Keep it current

The drift detector is stable, but its capabilities expand over time. You do not need a calendar reminder: from 2.4.0 onward the CLI prints an upgrade notice on every run when a newer version exists. When you see it, run:

```bash
contextqb upgrade
```

It prints the right upgrade command for how the CLI was installed. Run that command, then re-run `contextqb check`. If you want to look yourself, your package manager can list outdated packages (see the [package manager commands reference](contextqb://references/setup#package-manager-commands)).

## How did this go? Share your experience

The drift detector improves on the back of adopter feedback — and the first run is the most likely moment to surface friction worth sharing. **If anything misled you, took longer than expected, or worked unusually well, tell us.** Use the [feedback form](https://github.com/ContextQB/contextqb/issues/new?template=external-adopter-feedback.yml), or ask your agent to use the ContextQB `submit_feedback` tool. GitHub issues are public; leave out secrets and private project details.

The single most valuable thing you can do: **share what your first `pnpm check:qb` (or `npx contextqb`) output looked like before you fixed anything**, plus how you interpreted each finding. Drift-detector error messages are one of the surfaces we most actively iterate on; your raw reading is the data we need.

What we want most: the verbatim friction. Paste the exact command, the exact output, the exact step you were on when something stopped making sense. Agent-authored reports are first-class — if your AI agent ran into something a human wouldn't have, that's especially useful.
