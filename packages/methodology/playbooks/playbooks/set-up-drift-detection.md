---
id: set-up-drift-detection
title: Set Up Drift Detection on Day One
summary: Wire the contextqb drift detector into your repo from the moment you author your first context.qb.yaml, so the map can never drift away from the territory unnoticed.
version: 0.1.0
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
journey_rank: 40
related:
  - write-a-context-qb
  - set-up-agents-md
  - retrofit-drift-detection
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

No `context.qb.yaml` yet? Start with [`write-a-context-qb`](./write-a-context-qb.md). Write the map first, then come back here.

## Step 1 — Preview before opting in

Run the detector in preview mode before it sends telemetry:

```bash
npx @context-qb/cli@latest --telemetry-preview
```

Preview mode prints the payload that would be sent and exits without sending it. Use it to inspect the fields yourself: CLI version, subcommand, event kind, adapter coverage, counts, and finding codes. It does not include file contents, file paths, secrets, or project names.

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

If you use Husky, add a pre-commit hook:

```bash
pnpm dlx husky init
printf 'pnpm check:qb\n' > .husky/pre-commit
```

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
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check:qb
```

This makes drift visible before it merges. The check is small, fast, and specific.

## What happens on first run

On the first real run, the CLI provisions a membership token and stores it locally. That token lets the CLI send privacy-preserving telemetry and lets you use community insight tools later.

You can inspect or opt out at any time:

```bash
contextqb membership status
contextqb membership revoke
```

For one run only, use:

```bash
contextqb --no-telemetry
```

For CI systems where you do not want provisioning at all, set:

```bash
CONTEXTQB_NO_PROVISION=true
```

## What's next

If your agent uses MCP, run:

```bash
contextqb mcp setup --client cursor
```

That prints the client configuration with your membership token filled in. See the [MCP page](https://contextqb.com/mcp) for the full setup path.

If this repo is not actually greenfield and the first run produced a wall of findings, switch to [`retrofit-drift-detection`](./retrofit-drift-detection.md). An accumulated repo needs a reconciliation pass before enforcement.

## How did this go? Share your experience

The drift detector improves on the back of adopter feedback — and the first run is the most likely moment to surface friction worth sharing. **If anything misled you, took longer than expected, or worked unusually well, tell us.** We treat field reports as first-class evidence (see ADR-0029 in the public repository).

The single most valuable thing you can do: **share what your first `pnpm check:qb` (or `npx contextqb`) output looked like before you fixed anything**, plus how you interpreted each finding. Drift-detector error messages are one of the surfaces we most actively iterate on; your raw reading is the data we need.

Three submission paths, in order of friction:

1. **Call the MCP tool.** If you set up MCP above, your agent can call `submit_feedback` directly. The tool prepares a submission and surfaces it to you to confirm.
2. **Open the GitHub issue template.** [github.com/ContextQB/contextqb/issues/new/choose](https://github.com/ContextQB/contextqb/issues/new/choose) → **"External adopter feedback."** 3–5 minutes.
3. **File via `gh`.** `gh issue create --repo ContextQB/contextqb --title "[feedback] <summary>" --body-file ./report.md --label feedback,triage`.

What we want most: the verbatim friction. Paste the exact command, the exact output, the exact step you were on when something stopped making sense. Agent-authored reports are first-class — if your AI agent ran into something a human wouldn't have, that's especially useful.

What we'll do with it: a maintainer files your submission verbatim into the project's `feedback/captures/` directory and triages it into structured reports over the following days.
