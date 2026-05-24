---
id: suspicious-behavior-investigation
title: Suspicious Behavior Investigation
summary: A prompt for investigating anomalies — unexpected errors, unusual access patterns, or anything that makes you think "something is off."
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
use_case: |
  When you notice something unusual — unexpected errors, strange access patterns, unfamiliar activity — and need to determine if it's a bug, a misconfiguration, or a security incident.
variables:
  - ANOMALY_DESCRIPTION
  - LOGS_OR_DATA
  - CONTEXT
expected_output: |
  A structured investigation report determining whether the anomaly is benign, suspicious, or confirmed malicious, with evidence, timeline, and recommended next steps.
quality_standard: |
  Investigation must be evidence-based. Conclusions must be supported by specific data points. If evidence is insufficient, explicitly state what additional information is needed.
related:
  - untrusted-by-default
  - security-drift-is-the-real-threat
  - failure-modes
tags:
  - security
---

# Suspicious Behavior Investigation

This prompt helps investigate anomalies that might be security-relevant. Use it when you notice something unusual and need to determine if it's innocent, suspicious, or an active incident.

The goal is triage: figure out what happened, assess the risk, and decide what to do next.

## The prompt

````text
You are investigating a potentially suspicious anomaly in a production system.

**What was observed:** {{ANOMALY_DESCRIPTION}}

{{#if LOGS_OR_DATA}}
**Available data:**
{{LOGS_OR_DATA}}
{{/if}}

{{#if CONTEXT}}
**Additional context:** {{CONTEXT}}
{{/if}}

Your task is to investigate this anomaly and determine its nature. This is a security triage, not a comprehensive forensic analysis.

## Investigation approach

### Step 1 — Establish the timeline

Based on available data, construct a timeline:
- When did this start?
- What was the first sign?
- What happened before/after?
- Is it ongoing or has it stopped?

### Step 2 — Characterise the anomaly

Categorise what you're seeing:

**Error patterns:**
- Is this a code bug, configuration error, or something else?
- Is the error rate unusual, or normal variance?
- Are errors concentrated on specific endpoints/users/resources?

**Access patterns:**
- Are there unexpected sources (IPs, locations, user agents)?
- Are there unexpected targets (resources, endpoints)?
- Is the volume unusual?
- Is the timing unusual (off-hours, rapid succession)?

**Authentication patterns:**
- Are there failed login attempts?
- Are there successful logins from new locations/devices?
- Are there privilege escalations or role changes?

**Data patterns:**
- Is there unexpected data access?
- Is there data export or bulk retrieval?
- Is there data modification or deletion?

### Step 3 — Assess indicators

For each relevant category, note:
- **Normal indicator:** Evidence suggesting benign activity
- **Suspicious indicator:** Evidence suggesting possible malicious activity
- **Confirmed indicator:** Evidence proving malicious activity

Be specific. Reference actual data points.

### Step 4 — Determine classification

Based on evidence, classify the anomaly:

**Benign:** Normal behavior, false alarm
- Evidence clearly explains the anomaly as legitimate
- No indicators of malicious activity
- Action: Document and close

**Suspicious:** Possibly malicious, needs more investigation
- Some indicators of potentially malicious activity
- Evidence is insufficient to confirm or rule out
- Action: Gather more data, increase monitoring

**Incident:** Confirmed or highly likely malicious
- Clear indicators of unauthorised or malicious activity
- Evidence supports ongoing or completed compromise
- Action: Escalate to incident response

**Unknown:** Insufficient data to classify
- Anomaly is real but evidence is inconclusive
- More information needed
- Action: Identify what data would clarify

### Step 5 — Identify gaps

What information would help clarify?
- What logs or data are missing?
- What additional context would be useful?
- What tests could confirm or rule out hypotheses?

### Step 6 — Recommend next steps

Based on classification:

**If benign:**
- Document the false alarm for future reference
- Consider if monitoring should be tuned

**If suspicious:**
- What additional monitoring should be enabled?
- What investigation should continue?
- Who should be notified?

**If incident:**
- What immediate containment is needed?
- Who should be escalated to?
- What evidence should be preserved?

**If unknown:**
- What data needs to be gathered?
- What timeline is appropriate for re-evaluation?

## Output format

Provide your findings as:

```markdown
## Investigation Summary

**Anomaly:** [Brief description]
**Classification:** Benign / Suspicious / Incident / Unknown
**Confidence:** High / Medium / Low
**Timeframe:** [When this occurred/started]

## Timeline

[Chronological sequence of events]

## Evidence Analysis

### Indicators suggesting benign:
- [Evidence point]

### Indicators suggesting malicious:
- [Evidence point]

## Gaps and limitations

- [What data is missing]
- [What couldn't be verified]

## Conclusion

[Summary of what happened and why you classified it this way]

## Recommended actions

1. [Immediate action]
2. [Follow-up action]
3. [Monitoring/documentation action]
````

````

## When to use this

- You see unusual errors in logs and don't know why
- You notice unexpected access patterns in analytics or audit logs
- A user reports something "weird" happening
- Automated monitoring triggers an alert
- You have a gut feeling something is off
- Before deciding whether to wake someone up at 2am

## What to do with the output

### If classification is "Benign"

- Document the investigation for future reference
- Consider tuning monitoring if this is a common false alarm
- Close and move on

### If classification is "Suspicious"

- Do NOT ignore it
- Gather the additional data identified
- Increase monitoring on the relevant area
- Set a follow-up time to re-evaluate
- Consider informing relevant team members

### If classification is "Incident"

- **Stop and follow your incident response playbook**
- See [Respond to a Suspected Compromise](/playbooks/respond-to-a-suspected-compromise)
- Containment is more important than investigation
- Preserve evidence before taking actions that might destroy it

### If classification is "Unknown"

- Prioritise gathering the missing data
- Don't escalate without evidence, but don't ignore without certainty
- Set a clear timeline for when you'll re-evaluate

## Example output

```markdown
## Investigation Summary

**Anomaly:** Spike in 401 errors on /api/admin/* endpoints
**Classification:** Suspicious
**Confidence:** Medium
**Timeframe:** 2024-03-15 02:00-04:00 UTC

## Timeline

- 02:00 — First 401 errors appear
- 02:15 — Error rate increases 10x normal
- 02:45 — Errors concentrated on /api/admin/users
- 03:30 — Rate decreases
- 04:00 — Returns to normal levels

## Evidence Analysis

### Indicators suggesting benign:
- Error spike coincides with a scheduled batch job that might have stale credentials
- All 401s are actual authentication failures (not bypasses)
- No successful admin access during the window

### Indicators suggesting malicious:
- Source IPs are diverse (not our batch server)
- User agents include generic HTTP libraries
- Timing is off-hours for our team
- Requests targeted multiple admin endpoints systematically

## Gaps and limitations

- Cannot confirm batch job timing
- No visibility into attacker intent
- IP geolocation not available in current logs

## Conclusion

This looks like automated credential stuffing or endpoint probing against admin routes. The attack did not succeed (all 401s), but the pattern suggests intentional reconnaissance rather than legitimate activity or misconfiguration.

## Recommended actions

1. **Immediate:** Verify no successful admin logins in the timeframe
2. **Immediate:** Confirm batch job credentials are current (rule out false positive)
3. **Follow-up:** Enable rate limiting on /api/admin/* if not present
4. **Follow-up:** Consider IP blocking for the most active sources
5. **Monitoring:** Alert on similar patterns going forward
````

## See also

- [Playbook: Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise) — if this escalates to incident
- [Playbook: Detect Security Drift](contextqb://playbooks/detect-security-drift) — proactive anomaly detection
- [Principle: Security Drift Is the Real Threat](contextqb://principles/security-drift-is-the-real-threat) — why monitoring matters
- [Audit: Security Regression](contextqb://audits/security-regression) — systematic change detection
