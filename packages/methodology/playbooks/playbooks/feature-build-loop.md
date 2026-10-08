---
id: feature-build-loop
title: Run a Feature Build Loop From an Approved Plan
summary: A planner-executor loop that turns the seven-section feature brief from the feature-planning playbook into shipped code, with each section verified against the actual implementation before the next tranche begins.
version: 0.2.0
problem: |
  An approved feature plan does not ship itself. Letting an agent execute the plan top-to-bottom in one session reproduces every failure mode the plan was supposed to prevent — the agent picks the easiest place to put each line, edge cases get acknowledged but not handled, and "done" means "the agent said so."
when_to_use: |
  After the feature-planning playbook has produced an approved feature brief, and before any code is written. The brief is the input contract. If you do not have an approved brief yet, run feature-planning first.
expected_outputs:
  - A working feature whose behaviour matches the approved brief, end to end.
  - A tranche history log showing what was built, what drifted, what was rolled forward, and what was learned.
  - A status-tracked version of the original brief, with each of its seven sections marked VERIFIED against the actual implementation.
  - A feature contracts entry listing the public surface the feature now exposes (types, state shape, orchestrator entry point) for future agent sessions to respect.
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 3
journey_rank: 10
related:
  - agent-instructions
  - architectural-hardening-loop
  - feature-planning
  - launch-day-checklist
  - refactor-planning
  - review-an-agent-workstream
  - run-a-multi-agent-workflow
  - run-an-agent-workstream
  - work-with-agents-through-documentation
related_principles:
  - anti-spaghetti
  - documentation-as-architecture
  - failure-modes
  - orchestration
  - refactor-with-duplicates
  - separation-of-concerns
  - state-ownership
  - the-plan-is-the-contract
tags:
  - features
  - build
  - governance
  - planning
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-07 renewal B6 (0.2.0; author self-checked; independent review pending; not operator-accepted): this playbook now holds the canonical governed-loop section (roles, independence, SHIPPED versus VERIFIED, evidence, roll-forward, recorded authority) that the architectural hardening loop links to (DEC-05(a)); separation is of role and context, not app windows, with the in-tool planner / executor subagent or lane / fresh verifier version; the independence rule matches the workstream vertical; a criterion-based gate (more than one tranche, a new state owner, or several surfaces) replaces the implied size rule, with the small-change path; 'please use plan mode' becomes your tool's planning or read-only mode; walk 6 and the executor report ask for tests with command and exit status; the goal walk may use a browser-driving agent, with your own use as the standard; invariants path is 'or your project's equivalent'; review provenance neutralised. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; the seven-section governance walk is the corpus's deepest instrument and dogfooded by this repo's scopes; R8 pending P4. F-06, once listed as open, was resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal). 2026-10-02: body cross-references to the agent workstream method were added (those diffs were inspected in an independent final QA of the workstream vertical) and then finalized for publication (a wording edit that postdates that QA). The whole atom was not re-reviewed; last_reviewed reflects the earlier review."
---

# Run a Feature Build Loop From an Approved Plan

The feature brief and tranche log govern this loop's implementation details. When the work extends beyond code or beyond this loop, the [agent workstream](contextqb://playbooks/run-an-agent-workstream) method shows one way to keep the wider objective, relationships, decisions, and continuity in a shared record.

This playbook is the executor for the artifact produced by [`feature-planning`](contextqb://playbooks/feature-planning). The plan defines the contract; this loop ships against the contract without letting the agent invent architecture along the way.

If you do not have an approved feature brief yet — one with all seven sections (Goal, Surfaces touched, New modules, State plan, Orchestration, Edge cases and risks, Out of scope) and an explicit "Implement plan as written" approval — stop and run [`feature-planning`](contextqb://playbooks/feature-planning) first. The build loop has no input without it.

## Why one-shot execution fails the plan

You wrote the plan to prevent three failure modes. A single-session execution reproduces all three:

- **Plan amnesia.** The agent reads the plan, starts coding, and by file three has stopped re-checking it. The plan becomes background noise.
- **Edge-case theater.** "Edge cases and risks" gets acknowledged in chat ("yes, I'll handle empty state") and never lands in code. The agent self-reports completion against the plan without anyone walking the actual implementation.
- **Scope creep into out-of-scope.** While implementing one section, the agent notices something adjacent that "would be quick" and ships it anyway. The "Out of scope" list is the first casualty.

The build loop is designed to defend against all three.

## When to use the loop, and when not

Use the loop when any of these is true:

- the plan needs more than one tranche to build;
- it introduces a new state owner;
- it touches several surfaces.

Otherwise, take the small-change path: plan → build → one independent review ([Review an Agent Workstream Result](contextqb://prompts/review-an-agent-workstream)) → your own use of the feature. That keeps the contract and the independent check without the tranche machinery.

## The shape of the loop

```
   approved plan ──▶ tranche planning ──▶ execution ──▶ verification ──┐
                          ▲                                            │
                          │                                            │
                          └──────── roll-forward of failures ──────────┘
                                            │
                                            ▼
                              feature contract extraction
                                            │
                                            ▼
                                  (occasional) plan revision
```

The plan is the map. The tranche is the unit of work. Verification walks the plan's seven sections against the code. Plan revision is the escape valve when reality contradicts the plan.

## The governed loop: roles, independence, evidence and authority

This section is the one shared description of how a governed loop works. The [architectural hardening loop](contextqb://playbooks/architectural-hardening-loop) uses the same mechanics and links here; only its input (an audit instead of a plan) and its extracted artifact (invariants instead of feature contracts) differ.

**Roles.** The loop needs three separated roles:

- **Planner.** Reasons about the plan. Defines tranches. Never executes code changes.
- **Executor.** Implements one tranche. Preserves existing behavior outside the tranche scope. Reports completion in a structured format. Never self-certifies.
- **Verifier.** Checks the completed tranche against the plan and the actual code, in a context that did not produce it. In this playbook the planner, started fresh, does the verifying; the executor never does.

What matters is separation of _role and context_, not separate app windows. In a tool with subagents or parallel lanes ([which tools describe them](contextqb://references/tools#agentic-ides)), the planner can run in your main session, hand each tranche to an executor subagent or lane, and have a fresh session or subagent verify. If you run planning, execution and verification in the same context, the loop collapses into single-shot execution.

**Independence.** A verifier counts as independent only when it did not produce the work and is given the plan (or audit), the governance record and the actual artifacts. The executor's completion report is a claim for the verifier to test, not evidence. A different model can add variety to verification; it does not by itself make it independent. [Review an Agent Workstream Result](contextqb://prompts/review-an-agent-workstream) is a ready-made independent-review prompt.

**`SHIPPED` versus `VERIFIED`.** `SHIPPED` means the executor claims the item is done. `VERIFIED` means a verifier checked the actual code and evidence and agrees. Only the planner (as verifier) moves items to `VERIFIED`. The gap between the two counts is the loop working.

**Evidence.** Prefer evidence that can be re-run over prose: a test that exercises the item, the command that ran it and its exit status, a diff limited to the named surfaces. A passing test for each edge case or invariant is stronger than a `file:line` reference alone.

**Roll-forward first.** Anything incomplete, inaccurate or regressed becomes the first task of the next tranche.

**Recorded authority.** The approved plan (or audit) and its tranche log are the authority. When reality contradicts them, the planner revises the affected section on the record and the operator re-approves before work continues. A tranche never silently widens its own scope.

In this loop the planner also walks each of the seven plan sections and extracts feature contracts. See [`agent-instructions`](contextqb://playbooks/agent-instructions) for how to write document-producing prompts that hold an executor to a structured output.

## The seven-section plan as the governance document

This is the load-bearing tie-in. The feature brief is not a one-time artifact — it becomes the loop's living governance document. Each section gets a status field and is walked at every verification pass.

| Plan section          | Verification question (Phase A)                                               | Status taxonomy                                      |
| --------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1. Goal               | Does the feature, end to end, do what the goal sentence says?                 | `UNTOUCHED` / `IN PROGRESS` / `SHIPPED` / `VERIFIED` |
| 2. Surfaces touched   | Did changes stay inside the named surfaces? Any unauthorized surface touched? | per surface, same statuses                           |
| 3. New modules        | Were the named modules created? Does each have a single responsibility?       | per module, same statuses                            |
| 4. State plan         | Is state owned where the plan said? No copies, no drift?                      | per state-owner pair                                 |
| 5. Orchestration      | Is the named file/function actually coordinating, or did orchestration leak?  | single status                                        |
| 6. Edge cases / risks | Was each named edge case actually handled in code, or only acknowledged?      | per edge case, same statuses                         |
| 7. Out of scope       | Did the executor stay out? Any creep gets reverted in the next tranche.       | `CLEAN` / `CREEP DETECTED — ROLL FORWARD`            |

The planner does not invent verification criteria — they are already in the plan. This is what makes the loop honest. A claim of "feature complete" can be checked against seven concrete probes; the planner cannot wave it through and the executor cannot self-certify around it.

Add a **tranche history log** at the bottom of the plan. Per tranche, record:

- What was attempted.
- What was actually completed (with line-of-code evidence).
- What was incomplete or inaccurate.
- Remediation rolled forward into the next tranche.
- Plan revisions made (see below).
- Feature contracts extracted.

This is [`documentation-as-architecture`](contextqb://principles/documentation-as-architecture) applied to feature-build governance: the log is the operational memory of how the feature actually shipped, not how it was claimed to ship.

## What a tranche looks like

A feature is bounded — the plan defines the universe — so feature-build tranches are usually smaller and fewer than hardening tranches. Most features ship in one to three tranches. A common decomposition:

- **Tranche 1 — Foundations.** New modules + state plan. Establish ownership before anything depends on it. Outputs: the named modules exist with single responsibilities; state lives where the plan said.
- **Tranche 2 — Orchestration and the happy path.** Wire the orchestrator. The Goal sentence is demonstrable end-to-end. Outputs: the named coordinator coordinates; one user can complete the feature flow with no errors.
- **Tranche 3 — Edge cases.** Every named risk handled and verified, in the order the plan listed them (most likely failure first). Outputs: each item in section 6 has a corresponding handler in code.

A tranche definition contains, at minimum:

- Tranche name / number.
- Plan sections it advances (which of the seven).
- Audit items / brief items it converts to `SHIPPED`.
- Remediation items carried forward from the last verification pass.
- Architectural rationale tied to the plan.
- Expected files / components / services impacted (cross-checked against "Surfaces touched").
- Implementation constraints (must include "Out of scope" verbatim as a guardrail).
- Verification requirements — phrased as questions against the seven sections.
- Risks (often a subset of the plan's section 6).

Cross-reference: [`refactor-planning`](contextqb://playbooks/refactor-planning) describes the same decomposition discipline applied to a refactor; a feature-build tranche is the same shape with a feature plan as input instead of a refactor brief.

## Verification — walking the seven sections

Verification is the step that turns the plan from a one-time artifact into a contract. The planner, in a fresh session, performs all seven walks before any new tranche is planned:

1. **Goal walk.** Open the feature. Use it. Does the user achieve the Goal sentence? An agent that can drive a browser can walk the flow and report what it saw, but your own use of the feature is the standard. If yes, mark Goal `SHIPPED` (only `VERIFIED` after every other section is also clean).
2. **Surfaces walk.** Diff the tranche against the surfaces named in the plan. Any file changed outside the named surfaces is unauthorized — surface it as a finding, decide whether to revert or to revise the plan.
3. **New modules walk.** For each named module: does it exist? Does its content match its stated single responsibility? Or has it grown a second concern already?
4. **State walk.** For each piece of state: where does it live in the code? Does that match the plan? If the plan said "owned by the server" and you find a parallel client copy, that is drift.
5. **Orchestration walk.** Open the named coordinator. Is it actually orchestrating? Or did the executor put orchestration into a component / hook / handler instead?
6. **Edge cases walk.** For each named risk: find the code that handles it and the test that exercises it, and run the test. A passing test (command and exit status recorded) is the evidence; the list of test names is something the operator can read. If you cannot find the code, the case is not handled — only acknowledged. Roll it forward.
7. **Out-of-scope walk.** Diff the tranche against the "Out of scope" list. Any item that crept in: revert, or escalate to a plan revision (see below).

Write the result of each walk into the plan's status fields. Update the tranche history log. The first time you do this honestly, the rate of `VERIFIED` items will be lower than the rate of `SHIPPED` items. That gap is the loop working — it is the difference between what was claimed and what was actually built.

For the failure-mode taxonomy that informs walks 4–6 in particular, see [`failure-modes`](contextqb://principles/failure-modes).

## Plan revisions — when reality contradicts the plan

This is the one step the build loop has that the hardening loop does not. The feature plan can be wrong. You will discover this during execution — usually at walk 4 or walk 5, when the executor reports "I had to put state on the server because the client lifecycle does not survive the redirect" or "the orchestrator can't be a hook, it has to be a server action."

When this happens:

1. **Stop.** Do not silently roll forward. Silent roll-forward turns the plan into a fiction — and a fiction is worse than no plan, because future agents will read it as truth.
2. **Return to feature-planning.** Revise the affected sections of the brief. Strike through revised lines (`~~old~~ new`) for substantive changes; promote noisy lines to the revision history table. Mark the change in the tranche history log with the rationale.
3. **Re-approve.** "Implement revised plan as written" — the contract is amendable, but only deliberately.
4. **Resume the loop** with the revised brief as the new input.

Without this step, the loop devolves into rationalization: every divergence becomes a discovery, every shortcut becomes a feature. Plan revision is what keeps the brief honest as the source of truth.

## Feature contracts — the extracted artifact

Hardening extracts _invariants_ — universal architectural rules. Feature-build extracts _feature contracts_ — the public surface this specific feature now exposes that future agent sessions must not silently break.

Examples of real feature contracts:

- The orchestrator at `apps/web/src/app/checkout/orchestrate.ts` is the single entry point to the checkout flow. Other surfaces invoke it; they do not duplicate its logic.
- Cart state is owned by the server cookie; the client only reads. Never write cart state from the client.
- Webhook signatures are verified in `verifyWebhookSignature`. Adding a new webhook handler must call this verifier first.
- The `OrderStatus` type is the union of these five literals; adding a sixth requires updating the renderer in three named files.

After each tranche, the planner writes any new contracts into the feature's own README, an `AGENTS.md` cross-reference, or `docs/architecture/invariants.md` (or your project's equivalent) if the contract has system-wide reach. Cross-reference [`anti-spaghetti`](contextqb://principles/anti-spaghetti) for what these contracts defend against.

## Prompt 1 — Kickoff (one-time)

Use this once, after the feature plan has been written and approved per [`feature-planning`](contextqb://playbooks/feature-planning). The kickoff prompt converts the brief into a governance document and plans Tranche 1. **It does not execute any code changes.**

Run this in your **planner** session. Planning-mode names differ by tool ([reference](contextqb://references/setup#planning-modes)); a planning mode does not by itself stop every action, so the prompt also says not to execute changes.

> If your tool has a planning or read-only mode, use it for this turn.
>
> We are establishing a feature build loop for an approved feature plan.
>
> Approved feature brief: **\[path]**
> Supporting context (context.qb.yaml, AGENTS.md, related ADRs): **\[paths, if any]**
>
> Treat the feature brief as the contract. The codebase is the source of truth for what currently exists; the brief is the source of truth for what we are building. Verify every claim against actual implementation reality before planning any tranche.
>
> ### Task 1 — Prepare the brief as a governance document
>
> Update the brief format so each of the seven sections is status-tracked. Use the taxonomy: `UNTOUCHED`, `IN PROGRESS`, `SHIPPED`, `VERIFIED`, plus `CLEAN`/`CREEP DETECTED — ROLL FORWARD` for section 7.
>
> Add a **tranche history / execution log** section at the bottom. This will function as the durable record for the build process. It must support: tranche summaries, verification findings per plan section, plan revisions with rationale, feature contracts extracted, deferred edge cases, scope creep events, cross-cutting concerns.
>
> ### Task 2 — Plan Tranche 1
>
> Identify the first architecturally coherent tranche. The tranche must:
>
> - prioritise foundations (new modules + state plan) before orchestration or edges
> - maintain low blast radius
> - preserve deployability of the rest of the codebase
> - avoid mixing unrelated concerns
> - advance one or more of the seven plan sections, named explicitly
> - reproduce the brief's "Out of scope" list verbatim as an implementation constraint
>
> Produce, for Tranche 1:
>
> - Tranche objectives.
> - Plan sections this tranche advances (which of the seven).
> - Brief items this tranche converts to `SHIPPED`.
> - Architectural rationale referencing the plan.
> - Expected files / components / services impacted, cross-checked against "Surfaces touched."
> - Implementation constraints (including the verbatim "Out of scope" list).
> - Verification requirements, phrased as questions against the seven sections.
> - Risks (drawn from the plan's section 6 plus any new ones surfaced by codebase review).
> - Feature contracts the tranche is expected to establish.
>
> Also surface:
>
> - any plan section that appears inaccurate or inconsistent with the actual codebase
> - hidden dependencies between plan sections
> - sequencing concerns affecting later tranches
>
> **Do not execute any implementation in this turn.** This pass is for governance preparation, tranche planning, and dependency analysis only.

After this turn returns, hand the Tranche 1 spec to a **separate executor session** for implementation.

## Prompt 2 — Loop continuation (recurring)

Use this for every cycle after Tranche 1 has been executed. Run it in a **fresh planner session** — not the session that planned the previous tranche, and never the session that executed it.

> If your tool has a planning or read-only mode, use it for this turn.
>
> We are continuing the feature build loop for an approved feature plan.
>
> Approved feature brief (governance version): **\[path]**
> Last completed tranche: **\[tranche name / number]**
>
> Your first responsibility is a full verification pass on the last tranche, against the actual codebase — not against the executor's completion notes.
>
> ### Phase A — Walk the seven sections
>
> Walk every section of the brief and report findings:
>
> 1. **Goal walk.** Use the feature. Does the user achieve the Goal sentence? If not, what fails?
> 2. **Surfaces walk.** Diff the tranche. Any file changed outside the named surfaces is unauthorized — surface it.
> 3. **New modules walk.** Each named module: exists? Single responsibility? Or has it grown a second concern?
> 4. **State walk.** Each piece of state: where does it live? Does it match the plan? Any parallel copy is drift.
> 5. **Orchestration walk.** Is the named coordinator actually orchestrating? Has orchestration leaked into a component, hook, or handler?
> 6. **Edge cases walk.** Each named risk: where in the code is it handled, and which test exercises it? Run the tests and record the command and exit status. If you cannot find the code, the case is acknowledged but not handled — roll forward.
> 7. **Out-of-scope walk.** Any creep into the "Out of scope" list: revert, or flag for plan revision.
>
> For every issue discovered: explain the gap, assess severity, propose remediation, and include the remediation as **the first task** in the next tranche.
>
> ### Phase B — Update the governance record
>
> Update each of the seven sections' statuses based on the walk. Add an entry to the tranche history log describing: what was verified, what was actually complete, what was incomplete or inaccurate, remediation required, plan revisions made (see Phase B').
>
> ### Phase B' — Plan revisions, if reality contradicted the plan
>
> If any walk surfaced a contradiction between the plan and what the codebase requires (typical for state ownership and orchestration), do not silently roll forward. Instead:
>
> - identify the specific plan section to revise
> - state the reason in one paragraph (what reality required and why)
> - rewrite the affected section
> - log the revision in the tranche history with the rationale
> - flag the brief as requiring re-approval before the next tranche begins
>
> ### Phase C — Plan the next tranche
>
> Identify the next architecturally coherent tranche. It must:
>
> - put remediation items from Phase A first
> - advance the next plan section in foundations → orchestration → edges order
> - reproduce the (revised, if applicable) "Out of scope" list verbatim as a constraint
> - preserve deployability
>
> Produce, for the next tranche:
>
> - Tranche name / number.
> - Plan sections advanced.
> - Remediation items carried forward.
> - Architectural rationale.
> - Expected surfaces / components / services impacted.
> - Implementation constraints (including verbatim "Out of scope").
> - Verification requirements as questions against the seven sections.
> - Risks.
> - Feature contracts the tranche should establish or reinforce.
>
> ### Phase D — Feature contract extraction
>
> If the verified tranche established new public surface (types, state shape, orchestrator entry point) that future agent sessions must respect, write the contract into the feature's README or `docs/architecture/invariants.md` (or this project's equivalent) as appropriate. Note the addition in the tranche history log.
>
> **Do not execute the next tranche in this turn unless explicitly instructed.** This turn is for verification, governance updates, plan revisions, contract extraction, and next-tranche planning.

After this turn returns, hand the next tranche to a fresh executor session.

## The executor session — completion-reporting contract

The executor never plans the next tranche and never verifies its own work. Its job is to implement the given tranche and report completion in a format the planner can verify against the seven plan sections. Require this structure in every executor reply:

> ```
> ## Plan sections advanced
> ## Surfaces touched (matched against tranche scope)
> ## Modules created / modified
> ## State changes (where state moved to/from)
> ## Orchestration changes (entry-point file, function names)
> ## Edge cases handled (with file:line references)
> ## Out-of-scope items NOT touched (re-stated for the planner)
> ## Plan-reality contradictions encountered
> ## Tests written and run (command and exit status for each)
> ## Remaining concerns
> ```

The executor must also be told, explicitly:

- The brief is the contract. Do not improvise architecture; if reality requires divergence, surface a "Plan-reality contradiction" rather than improvising a fix.
- Preserve existing behavior outside the tranche scope.
- Do not perform opportunistic rewrites.
- Do not extend the "Out of scope" list silently — every item there is a guardrail, not a suggestion.

## Anti-patterns the loop prevents

- **Plan amnesia.** The seven-section verification walk forces every item back into focus on every cycle.
- **Edge-case theater.** Walk 6 demands a `file:line` reference for each named risk. "I'll handle that" without code is not a handle.
- **Scope creep.** Walk 7 plus the verbatim "Out of scope" guardrail in tranche definitions catches creep before it ships.
- **Silent plan rewriting.** Plan revision is an explicit phase with a re-approval requirement. Drift becomes a deliberate amendment instead of a quiet fait accompli.
- **Self-certified completion.** Planner / executor separation, with verification in a context that did not produce the work, is the same defence the hardening loop uses.

## When the loop is done

The loop has done its job when:

- All seven sections of the plan are `VERIFIED`.
- The Goal sentence is demonstrable end-to-end with no caveats.
- No items remain rolled forward.
- The "Out of scope" walk reports `CLEAN`.
- All feature contracts are written down in the appropriate location.

At that point the feature ships. The plan, with its tranche history log, becomes the post-hoc record of how the feature was built — useful as a reference for the next person (human or agent) who has to extend it.

## What this is, in one sentence

A governed build loop that turns the seven-section feature brief from feature-planning into shipped code, with each section verified against the actual implementation before the next tranche begins — and with plan revision as the only honest answer when reality contradicts the contract.
