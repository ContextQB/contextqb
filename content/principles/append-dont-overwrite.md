---
id: append-dont-overwrite
title: Append, Don't Overwrite
summary: Documentation is append-only at three scales — archive whole files, strike through revised lines, and supersede rather than edit ADRs. Agents reading a doc see both the current state and the reasoning trail that produced it.
version: 0.2.0
category: documentation
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 1
journey_rank: 50
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
  - Archive a scope only after its required review and acceptance are recorded and its remaining obligations are resolved or explicitly transferred. An executor's delivery claim (`SHIPPED`) alone is not enough. Then move it to `docs/archive/scopes/` with an archive header. Do not delete it.
  - When you revise a load-bearing line in a governance doc (goal, risk, scope boundary, version target), use strikethrough (`~~old~~ new`) to preserve the original.
  - Never edit an accepted ADR. If the decision needs to change, propose a new ADR that supersedes the old one.
  - If a paragraph accumulates three or more overlapping strikethroughs, demote the change trail to the revision history table and leave only the current state in the body.
related:
  - documentation-as-architecture
  - documentation-file-naming
  - documenting-for-your-agent
  - run-an-agent-workstream
  - scope-vs-punchlist
  - secrets-have-provenance
  - set-up-a-documentation-system
  - the-plan-is-the-contract
  - update-an-agent-workstream
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.2 (agent)"
  reviewer_notes: "2026-10-07 renewal B3 (0.2.0; author self-checked; independent review pending; not operator-accepted): the line-scale rule now leads with its real argument (visibility inside the agent's context window — git keeps history, but agents don't read it unprompted) and uses strikethrough only for load-bearing lines in active documents the agent re-reads, with a revision-history line otherwise; says which scale applies on day one; corrected memory premise; rendering note says GitHub-flavoured Markdown rather than every surface; the link to this repository's own AGENTS.md is replaced by the rule to put in yours. Earlier notes (2026-09-09 epistemology review): R3–R6 pass; R8 pending P4; F-11 was resolved on 2026-09-09 (link depth fixed) and is not open; the link itself is replaced in 0.2.0. 2026-10-02: archive trigger clarified (a delivery claim alone is insufficient; required review/acceptance and obligation disposition precede archival) and an optional workstreams/ category added, following the workstream governance decision. The whole atom was not re-reviewed; last_reviewed reflects the earlier review."
---

# Append, Don't Overwrite

Documentation drifts silently when changes overwrite their predecessors. An agent reading the doc sees only the current state — never the reasoning trail that produced it. When things go wrong, no one can reconstruct what changed or why.

The fix is simple: **treat documentation as append-only**. At three different scales, the same rule applies.

## The three scales

| Scale        | Rule                            | Example                                                                                 |
| ------------ | ------------------------------- | --------------------------------------------------------------------------------------- |
| **File**     | Archive, don't delete           | A reviewed, accepted, closed scope moves to `docs/archive/scopes/`, not to `/dev/null`. |
| **Line**     | Strike through, don't overwrite | `~~Risk #5: Backward compat~~ Removed — we're the only consumer pre-launch.`            |
| **Decision** | Supersede, don't edit           | ADR-0010 is superseded by ADR-0011; ADR-0010 stays exactly as it was when accepted.     |

All three preserve the trail. An agent (or a future human) can see what the document said at an earlier point and what changed it.

## File scale — archive, don't delete

When a governance document is finished, move it to the archive. Do not delete it. Finished means:

- **A scope:** its required review and acceptance are recorded, and its remaining obligations are resolved or explicitly transferred. An executor's delivery claim (`SHIPPED`) alone is not enough; the work may still fail review.
- **A handoff:** the next session has consumed it.
- **A punchlist:** every item is closed.
- **A [workstream record](contextqb://playbooks/run-an-agent-workstream)**, if your project keeps them: the objective is accepted, transferred, or cancelled, with its obligations disposed of.

```
docs/archive/
  scopes/           ← reviewed, accepted, closed scopes
  punchlists/       ← closed remediation lists
  handoffs/         ← consumed handoffs
  ad-hoc/           ← one-offs that don't fit elsewhere
  workstreams/      ← closed workstream records (only if you keep them)
```

Add a category only when records of that kind exist. Existing records do not need to move.

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

## Which scale applies on day one

One rule applies from the first day: **never edit an accepted ADR; supersede it.** The other two arrive as the project grows. Archiving starts with the first scope or handoff that finishes (see [`set-up-a-documentation-system`](contextqb://playbooks/set-up-a-documentation-system) for the growth curve). Strikethrough starts with the first active governance document — a scope or a plan — whose load-bearing line changes.

## Line scale — strike through, don't overwrite

Git already keeps every old version of a file. The reason to keep the old wording _in the document_ is visibility: the agent reads the document, not its git history, and won't look at `git log` unless you ask it to. If a load-bearing line changed and the document shows only the new value, the agent can't tell that a decision was revisited — and may "restore" the old one from some other stale source.

So when you revise a load-bearing line in an active governance doc that the agent will keep re-reading — a scope, a plan, a punchlist — preserve the original using strikethrough:

```markdown
~~Version target: v1.1.0 (additive minor).~~
Version target: v2.0.0 (honest major — we're the only consumer pre-launch).
```

The canonical markdown form is `~~old text~~ new text`. Strikethrough is part of GitHub-flavoured Markdown rather than core Markdown, so it renders on GitHub and in most documentation tools that follow that flavour; where it doesn't render, the `~~` markers still show. Agents recognise `~~` as strikethrough; the original wording stays in context.

For anything else — a line that isn't load-bearing, or a document the agent won't re-read — a one-line entry in the revision history table is cheaper and keeps the body clean.

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

The old ADR stays exactly as it was. Put the rule in your own `AGENTS.md` so the agent sees it every session: "Do not edit ADRs after they are Accepted; supersede them with a new ADR."

Supersession is the decision-scale equivalent of archive-don't-delete: the old artifact is preserved; a new artifact records the change.

## Why this matters for agents

Agent memory is partial and belongs to the tool ([what agents keep](contextqb://references/setup#agent-memory)); what reliably carries from one session to the next is what the agent re-reads in your documents. If the docs only show current state, the agent has no way to know:

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
> 2. If a scope is being archived, confirm its review, acceptance, and obligation disposition are recorded. A delivery claim alone does not qualify it.
> 3. If the doc is being edited, check whether any load-bearing line (goal, risk, scope, version) changed. If yes, confirm the old value is preserved via strikethrough or the revision history table.
> 4. If the doc is an accepted ADR, reject the edit. A new ADR supersedes the old one.

## Companion principles

- [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture) — why documentation is load-bearing at all.
- [`documentation-file-naming`](contextqb://principles/documentation-file-naming) — how to name the files so the archive stays navigable.
- [`secrets-have-provenance`](contextqb://principles/secrets-have-provenance) — the carve-out for credentials and PII.
