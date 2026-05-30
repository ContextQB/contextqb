---
id: append-dont-overwrite
title: Append, Don't Overwrite
summary: Documentation is append-only at three scales — archive whole files, strike through revised lines, and supersede rather than edit ADRs. Agents reading a doc see both the current state and the reasoning trail that produced it.
version: 0.1.0
category: documentation
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 1
tags:
  - documentation
  - governance
  - history
anti_patterns:
  - Deleting a scope, handoff, or other governance document because the work is done.
  - Overwriting a load-bearing line in a scope without preserving what it replaced.
  - Editing an accepted ADR instead of superseding it with a new one.
  - Removing content from a governance doc to "clean it up" without moving it to an archive.
  - Accumulating so many strikethroughs on a single line that the doc becomes unreadable.
agent_instructions:
  - When a scope is DONE or SHIPPED, move it to `docs/archive/scopes/` with an archive header. Do not delete it.
  - When you revise a load-bearing line in a governance doc (goal, risk, scope boundary, version target), use strikethrough (`~~old~~ new`) to preserve the original.
  - Never edit an accepted ADR. If the decision needs to change, propose a new ADR that supersedes the old one.
  - If a paragraph accumulates three or more overlapping strikethroughs, demote the change trail to the revision history table and leave only the current state in the body.
related:
  - documentation-as-architecture
  - documentation-file-naming
  - secrets-have-provenance
---

# Append, Don't Overwrite

Documentation drifts silently when changes overwrite their predecessors. An agent reading the doc sees only the current state — never the reasoning trail that produced it. When things go wrong, no one can reconstruct what changed or why.

The fix is simple: **treat documentation as append-only**. At three different scales, the same rule applies.

## The three scales

| Scale        | Rule                            | Example                                                                             |
| ------------ | ------------------------------- | ----------------------------------------------------------------------------------- |
| **File**     | Archive, don't delete           | A finished scope moves to `docs/archive/scopes/`, not to `/dev/null`.               |
| **Line**     | Strike through, don't overwrite | `~~Risk #5: Backward compat~~ Removed — we're the only consumer pre-launch.`        |
| **Decision** | Supersede, don't edit           | ADR-0010 is superseded by ADR-0011; ADR-0010 stays exactly as it was when accepted. |

All three preserve the trail. An agent (or a future human) can see what the document said at an earlier point and what changed it.

## File scale — archive, don't delete

When a governance document is finished — a scope ships, a handoff is consumed, a punchlist is closed — move it to the archive. Do not delete it.

```
docs/archive/
  scopes/           ← finished scopes
  punchlists/       ← closed remediation lists
  handoffs/         ← consumed handoffs
  ad-hoc/           ← one-offs that don't fit elsewhere
```

Every archived file gets a short header noting:

- **Original path** — where the file lived before archiving.
- **Archive date** — when it moved.
- **Superseded by** — the file (if any) that replaced it.
- **Reason** — one line explaining why it was archived.

The body of the file stays verbatim. Archive is a move, not an edit.

### Why not delete?

- **Agents can still reference it.** A code comment that says "per scope 0018 Tranche C" continues to resolve after the scope is archived.
- **Post-mortems need the trail.** When something breaks, the archived governance docs show what was planned and what actually shipped.
- **Onboarding uses finished examples.** A new contributor reading a finished scope learns how governance docs are structured.

### The carve-out — secrets, credentials, PII

Secrets, credentials, tokens, API keys, and personally identifiable information are **deleted, not archived**. Archiving them turns the archive into a long-lived liability. See [`secrets-have-provenance`](contextqb://principles/secrets-have-provenance).

If you find a secret in a doc that needs archiving, redact it in place before moving the file.

## Line scale — strike through, don't overwrite

When you revise a load-bearing line in a scope, a punchlist, or any other governance doc, preserve the original using strikethrough:

```markdown
~~Version target: v1.1.0 (additive minor).~~
Version target: v2.0.0 (honest major — we're the only consumer pre-launch).
```

The canonical markdown form is `~~old text~~ new text`. It renders correctly in GitHub, Keystatic, Next.js (remark), and every other surface the methodology corpus uses. Agents recognise `~~` as strikethrough; the original wording stays in context.

### When to use strikethrough

| Use strikethrough                       | Use the revision history table instead                                  |
| --------------------------------------- | ----------------------------------------------------------------------- |
| Decisions revised mid-flight            | Pure status flips (`T1 PENDING` → `T1 SHIPPED`)                         |
| Risks retired or added                  | Typo fixes                                                              |
| Scope statements re-bounded             | Style or grammar edits                                                  |
| Items moved in or out of "Out of scope" | Anywhere strikethrough accumulation would make the paragraph unreadable |
| Version targets changed                 | Transient placeholder text                                              |

### The demote rule

If a single line accumulates three or more overlapping strikethroughs, the inline form has become noise. Promote the change trail to the revision history table at the top of the doc and leave only the current state in the body.

The revision history table is designed for this: "Date / Event" rows that capture what changed and why. Strikethrough is for one or two revisions of a load-bearing line; the table is for the full timeline.

## Decision scale — supersede, don't edit

ADRs are immutable once accepted. If the decision needs to change:

1. Write a new ADR that explains the new context and the new decision.
2. Mark the old ADR as "Superseded by ADR-NNNN."
3. Link forward from the old ADR to the new one.

The old ADR stays exactly as it was. This is already ContextQB canon — see [`AGENTS.md §6`](../../../AGENTS.md) ("Do not edit ADRs after they are Accepted").

Supersession is the decision-scale equivalent of archive-don't-delete: the old artifact is preserved; a new artifact records the change.

## Why this matters for agents

Agents do not carry session memory. Every prompt re-reads the docs. If the docs only show current state, the agent has no way to know:

- What used to be true.
- Why it changed.
- Whether a current constraint is new or old.

When the docs preserve the trail — via archive, strikethrough, and supersession — the agent can reason about change, not just about state.

## Anti-patterns in detail

- **Deleting a finished scope.** The scope is gone. Any code comment that referenced it now points at nothing. Future contributors cannot see what was planned.
- **Overwriting a load-bearing line.** A PR changes the scope's goal from "A" to "B." The reviewer cannot tell whether this was a deliberate pivot or a silent rewrite.
- **Editing an accepted ADR.** The ADR now says something different from what it said when the decision was made. Anyone who read the original is now misaligned.
- **"Cleaning up" governance docs by removing content.** The doc is shorter. The trail is gone. The next incident cannot be debugged.
- **Strikethrough soup.** A line with five overlapping strikethroughs is unreadable. Demote to the revision history table.

## How to enforce this

> Before merging a PR that modifies or removes a governance doc:
>
> 1. If the doc is being deleted, stop. Move it to `docs/archive/<category>/` with an archive header.
> 2. If the doc is being edited, check whether any load-bearing line (goal, risk, scope, version) changed. If yes, confirm the old value is preserved via strikethrough or the revision history table.
> 3. If the doc is an accepted ADR, reject the edit. A new ADR supersedes the old one.

## Companion principles

- [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture) — why documentation is load-bearing at all.
- [`documentation-file-naming`](contextqb://principles/documentation-file-naming) — how to name the files so the archive stays navigable.
- [`secrets-have-provenance`](contextqb://principles/secrets-have-provenance) — the carve-out for credentials and PII.
