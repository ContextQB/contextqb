---
id: respond-to-a-suspected-compromise
title: Respond to a Suspected Compromise
summary: When you discover or suspect a security incident — leaked credentials, unauthorized access, suspicious activity — follow this structured response to contain damage, investigate, and recover.
version: 0.1.0
problem: |
  When something security-related goes wrong, panic leads to mistakes. Without a plan, people either overreact (taking down everything) or underreact (ignoring the problem). A structured response limits damage and preserves evidence.
when_to_use: |
  Immediately when you discover or suspect a security incident — credentials exposed, unauthorized access, suspicious behavior, or any "something is wrong" gut feeling.
expected_outputs:
  - Incident contained (damage stopped from spreading).
  - Investigation documented (what happened, when, how).
  - Remediation completed (access revoked, secrets rotated, gaps fixed).
  - Post-mortem documented (lessons learned, prevention measures).
audience:
  - novice-builder
  - founder
  - operator
related_principles:
  - secrets-have-provenance
  - security-drift-is-the-real-threat
  - untrusted-by-default
tags:
  - security
---

# Respond to a Suspected Compromise

**Plain language:** Something bad happened (or might have happened). This playbook helps you stay calm, stop the bleeding, figure out what actually occurred, fix it, and make sure it doesn't happen again.

## When to use this

- You found a secret in a public place (GitHub, logs, Slack)
- You see unauthorized logins or access in audit logs
- A user reports suspicious activity on their account
- You notice unexpected behavior in your application
- A security tool or scanner sends an alert
- You have a gut feeling something is wrong
- A third party notifies you of potential exposure

**Start this playbook immediately.** The first hour matters.

## What you'll produce

1. **Containment** — Damage is stopped from spreading
2. **Investigation log** — What happened, when, and how
3. **Remediation** — Access revoked, secrets rotated, gaps closed
4. **Post-mortem** — Root cause analysis and prevention measures

## Before you start

**Do not panic.** Rushed actions often make things worse.

Gather:

- Access to your auth provider (Clerk, Supabase, etc.)
- Access to your secrets management
- Access to your application logs
- A notes document to record everything

**Start a timeline now:** Write down the current time and what you know so far.

## Steps

### Phase 1 — Contain (First 30 minutes)

The goal is to stop the incident from getting worse. Don't worry about understanding everything yet.

#### Step 1.1 — Assess the surface

Ask: "What type of incident is this?"

| Type                       | Examples                                                 | Immediate containment                |
| -------------------------- | -------------------------------------------------------- | ------------------------------------ |
| **Secret exposed**         | API key in public repo, credentials in logs              | Revoke/rotate the secret immediately |
| **Unauthorized access**    | Login from unknown location, admin actions by wrong user | Disable the affected account(s)      |
| **Data breach**            | User data accessed without authorization                 | Restrict access to the data source   |
| **Application compromise** | Unexpected behavior, modified files                      | Consider taking the service offline  |
| **Unknown**                | Something feels wrong but unclear                        | Increase monitoring, restrict access |

#### Step 1.2 — Take immediate containment actions

**If secret exposed:**

1. Revoke the exposed secret immediately
2. Generate a new secret
3. Update all systems that use the secret
4. Confirm the old secret no longer works

**If unauthorized access:**

1. Force logout all sessions for affected accounts
2. Reset credentials for affected accounts
3. Enable or require MFA
4. Review audit logs for what was accessed

**If data breach suspected:**

1. Restrict access to the affected data source
2. Enable additional logging
3. Preserve current logs (don't let them rotate away)

**If application compromise:**

1. Consider taking the service offline
2. Preserve server state for investigation
3. Do not redeploy yet — you might redeploy the compromise

Record: "At [time], took containment action: [action]"

#### Step 1.3 — Notify stakeholders

Who needs to know now?

- Technical team members who can help
- Leadership (if significant impact)
- Affected users (if their data was exposed) — this can wait until you understand scope

Keep notifications factual: "We discovered [what] at [time] and have taken [action]. Investigation ongoing."

### Phase 2 — Investigate (Hours 1-4)

Now that bleeding is stopped, understand what happened.

#### Step 2.1 — Build a timeline

Work backwards from discovery:

| Time      | Event                 | Source                |
| --------- | --------------------- | --------------------- |
| [Now]     | Incident discovered   | [How you found it]    |
| [Earlier] | Last known good state | [Logs, commits, etc.] |
| [Between] | Suspicious activity   | [What you find]       |

Ask:

- When did this start?
- What was the first sign?
- What happened between then and now?

#### Step 2.2 — Determine scope

**What was exposed?**

- Which secrets were affected?
- Which accounts were accessed?
- What data could have been reached?
- What actions could have been taken?

**What was actually accessed?**

- Review audit logs for actual access
- Check database query logs
- Review API access logs
- Check file modification times

The "could have been" is the worst case. The "actually was" is the real impact. Document both.

#### Step 2.3 — Identify root cause

Ask: "How did this happen?"

Common root causes:

| Root cause             | Examples                                             |
| ---------------------- | ---------------------------------------------------- |
| Human error            | Secret committed to repo, credentials shared in chat |
| Missing controls       | No MFA, no rate limiting, weak password              |
| Software vulnerability | Unpatched dependency, insecure code                  |
| Social engineering     | Phishing, impersonation                              |
| Third-party breach     | Vendor compromised, API provider breached            |
| Misconfiguration       | Overly permissive settings, public by accident       |

Record: "Root cause appears to be: [cause]"

#### Step 2.4 — Assess impact

| Impact area    | Assessment                                 |
| -------------- | ------------------------------------------ |
| **Data**       | What data was or could have been accessed? |
| **Users**      | Which users are affected?                  |
| **Financial**  | Any monetary impact?                       |
| **Reputation** | Is this public or could it become public?  |
| **Legal**      | Any regulatory notification requirements?  |

Be honest about worst case and likely case.

### Phase 3 — Remediate (Hours 4-24)

Now fix the underlying problem, not just the symptom.

#### Step 3.1 — Complete credential rotation

If any secret was potentially exposed:

1. Rotate ALL related secrets, not just the one you know about
2. Update all environments (dev, staging, production)
3. Update your secrets inventory
4. Verify old credentials don't work

Use your [Triage Your Secrets](contextqb://playbooks/triage-your-secrets) inventory to ensure nothing is missed.

#### Step 3.2 — Close the gap

Based on root cause, fix the vulnerability:

| Root cause       | Remediation                                                 |
| ---------------- | ----------------------------------------------------------- |
| Secret in repo   | Remove from history (git filter-repo), add pre-commit hooks |
| Missing MFA      | Enable and require MFA                                      |
| Weak auth        | Implement rate limiting, lockout                            |
| Misconfiguration | Fix config, add validation                                  |
| Vulnerable code  | Patch, add tests, add security review step                  |

#### Step 3.3 — Verify remediation

- Confirm the specific attack vector no longer works
- Test that legitimate access still works
- Review related areas for similar issues

#### Step 3.4 — Restore normal operations

If you took anything offline or restricted:

1. Verify remediation is complete
2. Restore services incrementally
3. Monitor closely for recurrence

### Phase 4 — Post-mortem (Within 1 week)

Learn from this incident to prevent future ones.

#### Step 4.1 — Document what happened

Write up the incident:

```markdown
## Incident Report: [Title]

**Date:** [Date]
**Severity:** [Critical/High/Medium/Low]
**Duration:** [Time from start to resolution]

### Summary

[One paragraph description]

### Timeline

[Detailed timeline from Phase 2]

### Root cause

[What allowed this to happen]

### Impact

[What was actually affected]

### Remediation taken

[What you did to fix it]

### Lessons learned

[What you learned]

### Prevention measures

[What you'll do to prevent recurrence]
```

#### Step 4.2 — Identify prevention measures

Ask: "What would have prevented this?"

| Category       | Prevention measures                         |
| -------------- | ------------------------------------------- |
| **Detection**  | Better monitoring, alerts, audit logging    |
| **Prevention** | Stronger controls, automation, training     |
| **Response**   | Better runbooks, faster rotation capability |

#### Step 4.3 — Update your security baseline

- Update attack surface inventory
- Update secrets inventory
- Update authentication policy
- Add new checks to your security review process

#### Step 4.4 — Communicate (if needed)

If users were affected:

1. Notify affected users directly
2. Explain what happened (at appropriate detail level)
3. Explain what you did to fix it
4. Explain what they should do (reset password, review activity, etc.)

If legally required (data breach notification):

1. Consult legal/compliance requirements for your jurisdiction
2. File required notifications within required timeframes
3. Document notification for your records

## Common mistakes

- **Moving too fast.** Take 5 minutes to think before acting. Wrong actions can make things worse.
- **Not preserving evidence.** Logs, states, and timestamps are valuable. Don't destroy them.
- **Only fixing the symptom.** Rotating a leaked secret without fixing how it leaked.
- **Not communicating.** Stakeholders need to know, even if you don't have all answers.
- **Assuming one thing.** If one secret leaked, assume related secrets may have too.
- **Skipping the post-mortem.** Without learning, you'll have the same incident again.

## What "good enough" looks like

Your incident response is good enough when:

- [ ] The immediate threat is contained
- [ ] You understand what happened (timeline and scope)
- [ ] You know the root cause
- [ ] Affected credentials are rotated
- [ ] The vulnerability is fixed
- [ ] You have a documented post-mortem
- [ ] Prevention measures are identified and scheduled

## See also

- [Playbook: Triage Your Secrets](contextqb://playbooks/triage-your-secrets) — know your secrets before an incident
- [Playbook: Detect Security Drift](contextqb://playbooks/detect-security-drift) — catch issues before they become incidents
- [Prompt: Suspicious Behavior Investigation](contextqb://prompts/suspicious-behavior-investigation) — agent prompt for investigating anomalies
- [Principle: Secrets Have Provenance](contextqb://principles/secrets-have-provenance) — why tracking secrets matters
- [Principle: Security Drift Is the Real Threat](contextqb://principles/security-drift-is-the-real-threat) — why continuous monitoring matters
