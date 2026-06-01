---
id: retrofit-drift-detection
title: Retrofit Drift Detection on an Existing Repo
summary: Adopt the drift detector on a repo that predates the context.qb discipline — triage the wall of findings on first run, decide which to fix in code vs in the qb, and only then wire it into your pipeline.
version: 0.1.0
problem: |
  An existing repo without a context.qb.yaml — or with a stale one — produces a wall of findings on the first run. Operators who try to wire it into CI immediately get blocked. The safe path is to retrofit deliberately: triage findings, reconcile reality vs documentation, then enable enforcement only when the working tree is green.
when_to_use: |
  When you want to adopt drift detection on a repo that has accumulated state — workspaces, routes, ADRs — without a corresponding context.qb.yaml, or with one that has drifted. This is the explicit Tier 2 midstream-adoption companion to the Tier 1 set-up-drift-detection playbook.
expected_outputs:
  - "A reconciled context.qb.yaml whose tree, routes, and decisions match reality on disk."
  - "@context-qb/cli installed as a devDependency."
  - A passing run (`contextqb` exits 0).
  - Pre-commit and CI gates wired in only after the tree is green.
  - A short addendum in your AGENTS.md or onboarding doc explaining what was reconciled.
audience:
  - founder
  - operator
  - developer
  - agent
journey_stage: 6
journey_rank: 20
related:
  - repo-cleanup
  - write-a-context-qb
  - set-up-drift-detection
related_principles:
  - documentation-as-architecture
  - anti-spaghetti
  - machine-verifiable-substrate
tags:
  - context-qb
  - drift
  - retrofit
  - midstream
  - cleanup
---

# Retrofit Drift Detection on an Existing Repo

This is the midflight version of drift detection. If you are starting a fresh repo, use [`set-up-drift-detection`](./set-up-drift-detection.md) instead.

An existing repo has history. It has packages that were added in a hurry, deploy configs that changed, ADRs that never made it into the map, and status notes that went stale. Your first run may be noisy. That is normal. Do not wire the detector into CI until you have reconciled the findings.

## Pass 1 — Diagnosis (read-only)

Start by seeing what the tool would send, without sending telemetry:

```bash
npx @context-qb/cli@latest --telemetry-preview --no-telemetry
```

Then inspect the findings in JSON:

```bash
npx @context-qb/cli@latest --json --no-telemetry
```

If you use `jq`, the summary is useful:

```bash
npx @context-qb/cli@latest --json --no-telemetry | jq '.summary'
```

Save the first output somewhere temporary:

```bash
npx @context-qb/cli@latest --json --no-telemetry > /tmp/contextqb-findings.json
```

This first pass is read-only. Do not fix anything yet. You are learning the shape of the gap.

## Pass 2 — Triage the findings

For each finding, decide which of these three buckets it belongs to:

| Bucket             | Meaning                                                                                       | Action                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Fix code           | The repo is wrong. Something exists in config but should not, or the structure is accidental. | Fix the repo first, then re-run.                                            |
| Fix qb             | The repo is right. The map is stale or incomplete.                                            | Update `context.qb.yaml`.                                                   |
| Document exception | The mismatch is intentional but needs to be named.                                            | Add a short note in the qb or adjacent docs so the next operator knows why. |

Most retrofit work is "fix qb." Be careful before changing code just to satisfy the detector. The detector is a map check, not a product spec.

## Common finding patterns

### `tree-missing-entry`

A workspace exists on disk but is missing from `tree:`.

Usually the fix is to add the workspace to `context.qb.yaml` with a short purpose:

```yaml
tree:
  apps/admin:
    kind: next-app
    purpose: internal admin surface
```

### `tree-stale-entry`

The qb lists a path that no longer exists.

Decide whether the code was deleted intentionally. If yes, remove the stale `tree:` entry. If the directory was moved, update the key.

### `routes-missing-entry`

A deploy config declares a route that is missing from `routes:`.

Add the public surface to the map:

```yaml
routes:
  admin.example.com: apps/admin
```

If the route is temporary or externally managed, document that clearly. Future agents need to know whether it is part of the system.

### `decisions-missing-entry`

An ADR exists on disk but is missing from `decisions:`.

Add it by ID:

```yaml
decisions:
  "0027": third-party-adoption-analytics (accepted)
```

Keep the phrase short. The ADR file owns the full explanation.

### `decisions-status-drift`

The status in the qb does not match the ADR file.

Open the ADR and trust its `**Status:**` line first. Update the qb unless you discover the ADR itself is wrong. Accepted ADRs should not be edited casually; supersede them with a new ADR if the decision changed.

## Pass 3 — Reconcile the map

Now update `context.qb.yaml` in small batches:

1. Fix `tree:` first.
2. Fix `routes:` second.
3. Fix `decisions:` third.
4. Fix `status:` and `entry_points:` last.

If the repo does not have a qb file yet, write one using [`write-a-context-qb`](./write-a-context-qb.md). Do not try to make the first version perfect. Make it honest enough to pass the detector, then improve the prose over time.

## Pass 4 — Run until clean

After each small batch:

```bash
npx @context-qb/cli@latest --no-telemetry
```

Stop when you see:

```text
[check-qb] no drift detected.
```

If the findings list stays large, pause and write a short reconciliation note:

```markdown
# context.qb retrofit notes

- Date:
- Starting findings:
- Main source of drift:
- Decisions made:
- Follow-up:
```

Put it under `docs/` and link it from `AGENTS.md` or your onboarding doc. The note is not ceremony; it prevents the next operator from re-litigating the same cleanup.

## Pass 5 — Install and enforce

Once the run is clean, install the CLI:

```bash
pnpm add -D @context-qb/cli
```

Add the script:

```json
{
  "scripts": {
    "check:qb": "contextqb"
  }
}
```

Run the installed version:

```bash
pnpm check:qb
```

Only now should you add a pre-commit hook or CI step. If you add enforcement before the tree is green, you turn a useful diagnostic into a blocker.

For the pre-commit and CI examples, follow [`set-up-drift-detection`](./set-up-drift-detection.md).

## Pass 6 — Add the onboarding note

Add one short paragraph to `AGENTS.md` or your repo onboarding doc:

```markdown
Read `context.qb.yaml` before non-trivial work. The repo uses `pnpm check:qb`
to keep that file honest. If you add a workspace, route, or ADR, update the qb
in the same change.
```

If you wrote retrofit notes, link them there too.

## Common pitfalls

- **Enabling CI before the first clean run.** Reconcile first, enforce second.
- **Treating every finding as a code bug.** Most retrofit findings are documentation drift.
- **Adding many "known divergence" comments.** A few exceptions are fine. Many exceptions usually mean the qb file needs a clearer shape.
- **Skipping the preview.** Run the telemetry preview once. Operators should know what the tool sends.
- **Letting the retrofit sprawl.** Work in small batches. Get to a clean detector before starting unrelated cleanup.

## Done means green

The retrofit is complete when:

- `pnpm check:qb` exits 0.
- `context.qb.yaml` is committed.
- The enforcement hook or CI job is live.
- Future contributors know the check exists.

After that, treat the repo like a greenfield repo going forward. Shape changes and map changes move together.
