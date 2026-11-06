---
id: release-readiness
title: Release Readiness Audit
summary: Assess whether the evidence supports a specific application version, audience and release scope, without turning the audit into deployment authority.
version: 0.3.0
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

This is a **fictional no-go assessment**. A community hall has a candidate app for room requests. Visitors submit a preferred room and time; a coordinator must receive and review each request before confirming a booking. The hall's committee asks whether the public request form can be opened to real visitors. If a request never reaches the coordinator, a group may wait for a reply that never comes, or assume the room is theirs.

The supplied release record says three things: the app builds, the field-validation tests pass, and someone checked the form's appearance in a screenshot. Nobody has yet verified that a submitted request appears in the coordinator's actual queue. The assessment sorts those facts into the seven sections. The record and its results are invented for teaching; they are not a receipt for an implemented app, and no evidence identifiers are made up to look like one.

1. **Candidate and intended audience:** the record names the tested build and the proposed audience, members of the public using the request form, with the coordinator as the only person reading requests. Online payment and instant booking are excluded. The working queue connection has not been verified, so the tested build has not yet been shown to work in the setup visitors would use.
2. **Evidence for critical tasks:** the critical task is submit-to-coordinator. The field-validation tests are useful, but they check only the form's inputs; the path from a submitted request to the coordinator's queue is not run. Validation tests cannot close that gap.
3. **Usability, accessibility and performance:** an attractive screenshot does not show that a person understands “request” versus “confirmed booking,” or can operate the form using the keyboard. No observed task attempt, keyboard check or realistic-volume timing is supplied.
4. **Protection and data handling:** the queue holds visitors' names and contact details, so access to it needs evidence. A private-looking queue address does not establish a permission boundary. How long requests are kept has not been decided.
5. **Delivery and recovery:** the record mentions a database backup, but restoring it and reading the restored requests through the app have not been demonstrated. Rolling back the code would not recover lost requests; [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) is the method for checking that, and [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) separates the two choices. Nothing here shows this candidate has been restored.
6. **Monitoring, support and cost:** a coordinator is named, but no check has shown that a failed submission or a queue of unanswered requests reaches that person. Hosting costs and any service limits are not recorded.
7. **Findings and recommendation:** no-go for real room requests. Each blocker below leaves a group without a reliable answer to its request; the committee owns arranging each missing result:
   - submit-to-coordinator path: missing an end-to-end check on the working setup;
   - queue access: missing a check that only the coordinator can read requests;
   - recovery: missing a restore whose requests are read back through the app;
   - failure reporting: missing a demonstrated signal reaching the coordinator.

   Reassess once those results exist. This recommendation does not authorize any deployment.

This is not a demand for an arbitrary number of tests. Each missing fact concerns something visitors or the coordinator will rely on. In your own assessment, identify which unanswered question could change the decision and what specific evidence would resolve it.
