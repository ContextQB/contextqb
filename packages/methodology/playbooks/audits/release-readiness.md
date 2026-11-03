---
id: release-readiness
title: Release Readiness Audit
summary: Assess whether the evidence supports a specific application version, audience and release scope, without turning the audit into deployment authority.
version: 0.2.0
audience: [novice-builder, founder, operator, agent]
journey_stage: 7
journey_rank: 50
objective: Assess the actual candidate and release evidence, identify consequential gaps and recommend go, no-go or a narrower supported scope.
scope: The proposed release, its critical tasks, applicable protections, data and recovery, operational arrangements and known limits. Underlying specialist audits retain their own procedures.
required_sections:
  - Candidate and intended audience
  - Evidence for critical tasks
  - Usability, accessibility and performance
  - Protection and data handling
  - Delivery and recovery
  - Monitoring, support and cost
  - Findings and recommendation
evaluation_criteria:
  - Evidence identifies the revision, target, result and limits.
  - Critical unknowns are not silently counted as passes.
  - Non-applicable checks have product-specific reasons.
  - The recommendation does not authorize deployment or waive unresolved blockers.
deliverables:
  - A Markdown assessment with all required sections and evidence references.
  - A bounded recommendation and the missing result for every blocker.
related:
  - launch-day-checklist
  - launching-for-your-first-users
  - operations-baseline
  - pre-launch-security
  - preparing-for-real-users
  - rehearse-backup-and-recovery
  - rollback-vs-restore
  - set-up-useful-monitoring
  - where-your-app-runs
tags: [launch, audit]

---

# Release Readiness Audit

Use this after [Preparing for Real Users](contextqb://guides/preparing-for-real-users). Give the reviewer the actual candidate, release record, applicable audit results and rehearsal evidence. Use a fresh agent session that did not implement it, or another suitably qualified reviewer. The product owner makes the release decision.

## Use this as an agent instruction

Give the agent this bounded assignment:

> Review **[candidate and release-record paths]** for **[audience and promised task]**. Read project instructions first. Inspect the candidate and supporting evidence; do not infer readiness from the author's completion report. Do not edit, deploy, restore data, send notifications or run active/load tests. Identify any additional check and its target for separate authorization. Never print secrets or user records.
>
> Produce these seven sections:
>
> 1. **Candidate and intended audience.** Identify source, artifact, configuration, data format, target, access and exclusions. Explain any mismatch between the tested candidate and proposed release.
> 2. **Evidence for critical tasks.** Map each promise to the check, target, observed result and limits. Distinguish passed, failed, not run and unavailable evidence. Inspect whether the checks could miss the claimed behavior.
> 3. **Usability, accessibility and performance.** Cite actual observations, devices, access needs, representative data/load and agreed targets. Separate structural review from observed use and preliminary checks from full conformance claims.
> 4. **Protection and data handling.** Cite the applicable security findings, access checks and retention/deletion decisions. Do not duplicate the security checklist. Explain exclusions and unresolved settings; an unknown is not a pass.
> 5. **Delivery and recovery.** Verify the candidate's environment map and delivery evidence. Identify data changes, compatible recovery versions, restore rehearsal, possible lost work and authority for execution. A code rollback is not proof of data recovery.
> 6. **Monitoring, support and cost.** Name the critical signal, observed delivery to its owner, watch arrangements, support route, dependencies, quotas and spending controls. Distinguish warnings from enforced limits.
> 7. **Findings and recommendation.** Recommend go, no-go or a narrower evidenced scope. For each blocker, give the evidence, consequence, missing result and owner. Preserve accepted limitations only when the responsible owner has actually accepted them. End with the next decision; do not authorize its execution.

The [Pre-Launch Security Audit](contextqb://audits/pre-launch-security) owns the security gate. The [Operations Baseline Audit](contextqb://audits/operations-baseline) can assess operational preparation before launch and the running system afterward. [Run a Launch Day Checklist](contextqb://playbooks/launch-day-checklist) owns launch execution after the decision.

## Worked assessment: a convincing package, incomplete evidence

This is a **fictional no-go assessment**. Maya is an invented first-time founder deciding which problem her business should solve for small independent bakeries. She wants a personal research notebook program on her own computer: each entry keeps one source, such as a conversation with a bakery owner, with her note about what it showed, all in one local data file used only by her. An agent has built a candidate package, and she asks whether she can start relying on it for her real notes, which she could not recreate if lost.

Before the review, some things are known: the package exists, the record says a build and unit checks passed, and a practice backup-and-recovery exercise on a two-record file has been done. Others are unknown: whether the installed package itself saves and reopens entries, how its data file is protected, and whether a failed save reaches her. The assessment sorts those facts into the seven sections. Identifiers and results are invented for teaching; they are not a receipt for an implemented app. The linked lessons give procedural detail if you want it; you do not need them to follow the assessment.

1. **Candidate and intended audience:** package `notebook-candidate-1` (an illustrative label for this candidate), described as built from source `example-rev-1`; one owner using local files. The rehearsal folder is named, but no installed-version evidence is supplied. Team sharing and accounts are excluded.
2. **Evidence for critical tasks:** the fictional record says build and unit checks passed. Saving and reopening through the installed candidate is marked not run. Unit checks cannot close that gap.
3. **Usability, accessibility and performance:** code review of labels is supplied; keyboard use, a real task attempt and representative-file timing are not run. Needed evidence must match the owner's intended device and task.
4. **Protection and data handling:** the intended local-only scope is recorded. Storage permissions and whether diagnostic output contains note text remain unknown. No-account is a reason to exclude sign-in tests, not the file-access check.
5. **Delivery and recovery:** the file exercise in [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) shows what an older backup omits. The candidate has not reopened that recovered file. The owner has not decided whether that loss is acceptable; [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) identifies the separate recovery choices.
6. **Monitoring, support and cost:** the owner is named, but the failed-save signal and report location have not been exercised. No hosted service is required for this local case. The next test should follow [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) using local error reporting.
7. **Findings and recommendation:** no-go for reliance on real notes. Keep the candidate as a disposable rehearsal. Verify its identity and save/reopen path, resolve the protection and recovery gaps, and demonstrate the failure signal before requesting another assessment.

The useful result is a small set of missing facts, not a demand for every possible test. In your own assessment, identify which missing fact could change the decision and what specific evidence would resolve it.
