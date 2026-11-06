---
id: append-dont-overwrite
title: Append, Don't Overwrite
summary: Documentation is append-only at three scales — archive whole files, strike through revised lines, and supersede rather than edit ADRs. Agents reading a doc see both the current state and the reasoning trail that produced it.
version: 0.4.0
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

---

# Append, Don't Overwrite

Documentation drifts silently when changes overwrite their predecessors. An agent reading the doc sees only the current state — never the reasoning trail that produced it. When things go wrong, no one can reconstruct what changed or why.

The fix is simple: **treat documentation as append-only**. At three different scales, the same rule applies.

## The records this applies to

This page is about the working records you and your agent steer by. ContextQB calls them **governance documents**: records that say what work is approved, what its boundaries are and where it stands. The common ones are:

- a **scope**, the agreed plan for one bounded piece of work, written before the work starts ([Scope vs. Punchlist](contextqb://briefings/scope-vs-punchlist) compares it with a punchlist);
- a **handoff**, notes that let a fresh session pick up where the last one stopped;
- a **punchlist**, the final list of defects before something counts as done;
- a **workstream record**, if you keep one, which tracks a larger objective across several scopes and sessions.

An **ADR** (architecture decision record) is a short file recording one structural decision and why it was made. A **load-bearing line** is a line the work is steered by: a goal, a boundary, a risk, a storage decision, a version target.

The examples below follow one small invented change. A club is building a room-booking system. Its approved scope says members can cancel a booking until 24 hours before it starts. The committee then explains that the person who arranges keys needs two days' notice, and approves a 48-hour cutoff. The requirement has changed for a reason the next agent session needs to see.

If the scope's editor simply replaces “24” with “48,” the latest rule is present, but the reason and the superseded decision disappear from the active document. An agent that later finds an old test or design note saying 24 hours may “correct” the scope back to 24, as if the 48 were the mistake. The old decision, the new requirement and the reason are all worth keeping where the next session will see them.

## The three scales

| Scale        | Rule                            | Example                                                                                                                                  |
| ------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **File**     | Archive, don't delete           | A reviewed, accepted, closed scope moves to `docs/archive/scopes/`, not to `/dev/null`.                                                  |
| **Line**     | Strike through, don't overwrite | `~~Cancellation cutoff: 24 hours.~~ Cancellation cutoff: 48 hours — the key holder needs two days' notice.`                              |
| **Decision** | Supersede, don't edit           | ADR-0003 "Send booking reminders by email" is superseded by ADR-0004 "Send booking reminders by text message"; ADR-0003 stays as it was. |

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

- **Agents can still reference it.** A code comment or another document that cites the scope, such as `see docs/scopes/booking-cancellation.md`, can still be followed after the scope is archived: the archive header records the original path, so a search for that filename finds the archived copy.
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
~~Cancellation cutoff: 24 hours before the booking.~~
Cancellation cutoff: 48 hours before the booking.
(Revised [date] after the committee confirmed the key-arrangement requirement.
Approved by [the responsible operator].)
```

The bracketed parts are placeholders: in a real project, record the actual date and the person who actually approved the change. An agent reading the club's scope now sees both lines. It knows 24 hours was the earlier rule, why it changed and who decided, so it won't quietly restore it. Tests and user-facing explanations then follow the approved current rule.

This is about keeping the reasoning where future work is directed. It does not mean showing members two contradictory cutoffs, or preserving every typo forever. For your own project's important change, leave enough history for a new session to know which decision governs now and why the older one should not return.

The canonical markdown form is `~~old text~~ new text`. Strikethrough is part of GitHub-flavoured Markdown rather than core Markdown, so it renders on GitHub and in most documentation tools that follow that flavour; where it doesn't render, the `~~` markers still show. Agents recognise `~~` as strikethrough; the original wording stays in context.

For anything else — a line that isn't load-bearing, or a document the agent won't re-read — a one-line entry in the document's **revision history table** is cheaper and keeps the body clean. That table is a short log near the top of the document, with one Date / Event row per change:

```markdown
| Date   | Event                                                                               |
| ------ | ----------------------------------------------------------------------------------- |
| [date] | Cancellation cutoff revised (24 h → 48 h) for key arrangements. Approved by [name]. |
| [date] | Tranche 1 moved from SHIPPED to VERIFIED after a fresh review.                      |
```

A **tranche** is one bounded batch of a plan's work. `SHIPPED` means the agent that did the batch says it is done; `VERIFIED` means a separate check agreed.

### When to use strikethrough

| Use strikethrough                       | Use the revision history table instead                                  |
| --------------------------------------- | ----------------------------------------------------------------------- |
| Decisions revised mid-flight            | Pure status flips (`Tranche 1 PENDING` → `Tranche 1 SHIPPED`)           |
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
- **Overwriting a load-bearing line.** A change, whether a pull request (PR) or a direct commit, rewrites the scope's goal from "A" to "B." The reviewer cannot tell whether this was a deliberate pivot or a silent rewrite.
- **Editing an accepted ADR.** The ADR now says something different from what it said when the decision was made. Anyone who read the original is now misaligned.
- **"Cleaning up" governance docs by removing content.** The doc is shorter. The trail is gone. The next incident cannot be debugged.
- **Strikethrough soup.** A line with five overlapping strikethroughs is unreadable. Demote to the revision history table.

## How to enforce this

Run this check when a change is accepted into the version you and your agent work from. If you use pull requests, that is before merging. If you commit directly without them, it is before you keep the commit as your current version: before you deploy it or start the next session from it. If a check fails, the change waits at that same point until it is fixed.

> Before accepting a change that modifies or removes a governance doc (merging its PR, or keeping a direct commit):
>
> 1. If the doc is being deleted, stop. Move it to `docs/archive/<category>/` with an archive header.
> 2. If a scope is being archived, confirm its review, acceptance, and obligation disposition are recorded. A delivery claim alone does not qualify it.
> 3. If the doc is being edited, check whether any load-bearing line (goal, risk, scope, version) changed. If yes, confirm the old value is preserved via strikethrough or the revision history table.
> 4. If the doc is an accepted ADR, reject the edit. A new ADR supersedes the old one.

## Companion principles

- [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture) — why documentation is load-bearing at all.
- [`documentation-file-naming`](contextqb://principles/documentation-file-naming) — how to name the files so the archive stays navigable.
- [`secrets-have-provenance`](contextqb://principles/secrets-have-provenance) — the carve-out for credentials and PII.
