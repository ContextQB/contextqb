---
id: work-with-agents-through-documentation
title: Work With Agents Through Documentation
summary: A plain-language introduction to using project records to direct agents, evaluate results, govern discoveries, and continue work across sessions.
version: 0.3.1
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 1
journey_rank: 60
intro: |
  You do not need to know how to build every part of a system before you can direct an agent to make one. You do need a way to keep the goal, the agreement, the evidence, and the next decision visible. This guide explains the working habit that makes that possible.
tags:
  - documentation
  - agents
  - getting-started
  - governance
related:
  - architectural-hardening-loop
  - audit-a-workstream-record
  - context-quarterback-the-onboarding-map
  - documentation-as-architecture
  - documentation-for-agent-alignment
  - feature-build-loop
  - feature-planning
  - resume-an-agent-workstream
  - review-an-agent-workstream
  - run-a-multi-agent-workflow
  - run-an-agent-workstream
  - set-up-a-documentation-system
  - setting-up-git-and-github
  - start-an-agent-workstream
  - the-plan-is-the-contract
  - understanding-the-context-window
  - update-an-agent-workstream
next_steps:
  - State one outcome you want an agent to help you achieve, and one result you could check yourself.
  - Give your agent the start-an-agent-workstream prompt to create the record and propose the first bounded assignment.
  - Use the workstream playbook when the flow needs detailed record fields, review rules, or closure decisions.
review:
  status: final
  last_reviewed: "2026-10-02"
  reviewer: "Independent agent review of 0.1.1 (2026-10-02); independent check and final independent QA of 0.2.0 (2026-10-02)"
  reviewer_notes: "2026-10-07 renewal B4 review correction (0.3.1; author self-checked; independent review pending; not operator-accepted): the git sentence no longer claims a commit and branch give the same safety for the whole folder; it now says git restores committed project files it tracks, and that copies, drafts and test accounts are still needed for data, accounts and outside effects git cannot undo. 2026-10-07 renewal B4 (0.3.0; author self-checked; independent review pending; not operator-accepted; targeted additions to the operator-accepted 2026-10-02 vertical): adds the independence rule for subagents and separate review tools (independent only if it did not produce the work and is given the record, agreement and outputs; the builder's account is a claim to test; a different model does not by itself make a review independent), and links the copy habit to the git guide. Review provenance neutralised (agent and model detail kept in private records); the 2026-10-02 acceptance and its history are unchanged. 2026-10-02: An agent developer revised this atom in 0.2.0 (FIX-01). The final independent QA of the vertical returned verified with follow-up (2026-10-02). Travis (operator) accepted the vertical for publication on 2026-10-02. 0.2.1 removes the body draft note for publication; lesson, contract, and example content unchanged."
---

# Work With Agents Through Documentation

You bring an intention to an agent: make a tool, investigate a question, repair a failing process, prepare material, or improve something that already exists. The agent can do much of the reading and production. You still need to direct the work.

Directing the work does not mean telling the agent every keystroke. It means keeping five things clear:

1. What are we trying to achieve?
2. What work are we agreeing to do next?
3. How will we know whether it worked?
4. What did we learn, and what needs a decision?
5. What should happen when this session ends?

Documentation gives those answers a durable home. The agent can read them before acting, update them as the work changes, and hand them to the next session. You can inspect the same records without reconstructing a long conversation.

## The agent is capable; you remain responsible for direction

An agent can propose a solution, create files, run checks, and report completion. Those abilities do not make its first proposal your decision or its confidence proof that the result works.

Your useful contribution is judgment. You say what matters, decide what is in bounds, choose whether evidence is sufficient, and decide whether a new idea should become work. The agent turns those decisions into plans and actions and records what actually happened.

This is why ContextQB treats documentation as part of the system. A decision that stays in a chat is easy to lose. A decision in the project record can guide the current agent, a reviewer, and a fresh session.

## A simple working cycle

Imagine you want a small tool that organizes downloaded files. You do not need to begin with a technical design. Begin with an outcome:

> I want to organize a copy of 20 downloaded files into agreed categories so I can see whether the rules work before using the tool on my real folder.

Notice the copy. A first assignment you can undo is a good habit: work on copies, drafts, or a test account before anything real. In a project that uses git, a commit before the assignment and a branch for the experiment let you put the project's files back the way they were — but only files git tracks and you have committed. Git does not undo changes to data outside the project, to accounts or services, or messages that were sent, so keep using copies, drafts, and test accounts for those. See [Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github).

Ask the agent to create or reuse a **workstream** for that objective. A workstream is the continuing flow of work toward an objective. Its record keeps the objective, responsibilities, decisions, evidence, and next action together. The same idea works for infrastructure recovery, research, writing, or a product capability.

The agent proposes a first **scope**: the specific work you are authorizing. You agree on the outputs, boundaries, and checks. Include at least one check you can perform yourself: "I open the output folder and see all 20 files." The agent records your reply as the approval; its own suggestion is not approval. The agent then carries out the assignment and records what it actually produced.

A separate review checks the result against the agreement. If a file type was skipped, that is a correction. If the agent suggests running the tool automatically every day, that is an addition requiring your decision.

When you stop, a **checkpoint** records the reconciled state. A **handoff** tells the next session what to read, verify, and do. The next session reads the record and checks the actual files before it continues.

After the first review, a short record might look like this:

```text
Objective: organize 20 copied files; real Downloads folder untouched
Scope S1 (approved by me, March 2: "Yes, go ahead on the copies")
  Checks: all 20 appear once · contents unchanged · unknown types go to Other
          · I open the output folder and count 20 files
Review V1: 19 of 20 — an unusual file type was skipped
Outstanding: C-01 correction (fix unknown types) · A-01 daily scheduling,
             proposed, not approved
Next: correct C-01 under S1, then a fresh review
```

The complete version, with the correction, a stale handoff, and acceptance, is the worked example in [Run an Agent Workstream](contextqb://playbooks/run-an-agent-workstream).

The words matter because they answer different questions, but you learn them by using them. You do not need to memorize a vocabulary list before you start.

## What the records protect

The records protect your control in five ways.

**They protect the intention.** The objective says why the work exists. An agent can suggest many technically reasonable directions; the objective lets you judge whether a direction still serves your purpose.

**They protect the agreement.** The scope says what the agent may change and how the result will be judged. This gives the agent room to work without turning every suggestion into permission.

**They protect the evidence.** A delivery report says what the agent claims to have done. A review says what someone actually checked, what passed, and what remains uncertain. Keeping those statements separate prevents "done" from becoming a substitute for proof.

**They protect your decisions.** A new idea is recorded as a proposal with an owner. It does not quietly become work, and a rejected idea does not come back as if it were approved.

**They protect continuity.** A current state and handoff let a new session resume from the latest authority. The next agent does not need to trust an old summary blindly; it reads the records and reconciles them with the files, outputs, and processes that actually exist.

## Who checks the work

There are three kinds of checking:

- **Self-check:** the agent that did the work checks it. Useful, but not a review.
- **Independent review:** a reviewer that did not produce the work checks it. A fresh session that did not build the work can do this; [restart deliberately](contextqb://guides/understanding-the-context-window) and give it the record, the agreement, and the outputs. Opening another tab on the same conversation does not count. The same rule applies to a subagent, a second agent, or a separate review tool: it counts as independent only when it did not produce the work and is given the record, the agreement, and the outputs to check. What the builder says about its own work is useful, but it is a claim for the reviewer to test, not a finding. Using a different model can widen what a review notices; it does not by itself make the review independent.
- **Your inspection:** something you can judge yourself, such as opening the folder, reading the page, or trying the tool once.

Ask which kind of check produced each claim.

## The questions to ask at each stage

When an agent proposes work, ask: "What will I receive, what will change, what is excluded, and what will show that it worked, including something I can check myself?"

When an agent reports completion, ask: "Which agreed checks were run, by whom, what evidence did they produce, and what remains unverified?"

When a discovery appears, ask: "Is this unfinished agreed work, a correction, a new proposal, or a blocker? Who decides, and where does it go?"

When a session ends, ask: "What is the current state, what is the next authorized action, where is the record saved, and what must the next session read before it acts?"

These questions let you direct an agent without pretending to be the implementation specialist. They also make it easier to notice when the agent has quietly expanded the assignment or mistaken a local success for the outcome you wanted.

## Keep the records proportional

Not every request needs a new workstream. A small one-pass task may need only a checklist. Use a workstream when the objective needs several assignments, a decision, review, or a later session.

Begin with one record. Ask the agent to keep a short current summary and a dated history, and to add a line to the project's starting files so the next session can find it. Link a detailed scope, review, audit, or handoff only when that material becomes long or needs to stand on its own.

To begin, give your agent [Start an Agent Workstream](contextqb://prompts/start-an-agent-workstream). The detailed operating shape is in [Run an Agent Workstream](contextqb://playbooks/run-an-agent-workstream).

The record is not a second copy of every document. The scope remains the authority for its contract. The review remains the authority for its findings. The workstream record points to those details and keeps the coordination state legible.

## The transfer test

Give a fresh session the project instructions, the workstream record, the approved scope, the latest review, and the handoff. Ask:

> What are we trying to achieve? What work is authorized? What evidence exists? What still needs my decision? What should happen next?

If the session can answer those questions and verify the actual state before acting, the records are doing their job. If it cannot, improve the record before asking it to improvise.

This habit applies whether the objective is a new application, a backup process, a research report, a publishing workflow, or a repair. The implementation changes. The operator's responsibility for intention, agreement, evidence, decisions, and continuity does not.
