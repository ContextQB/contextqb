---
id: security-regression
title: Security Regression Audit
summary: A change-focused security audit comparing current state against a prior baseline. Identifies what changed, what degraded, and whether new risks were introduced by recent work.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 7
objective: |
  Compare current security posture against a documented baseline to identify regressions, new attack surfaces, and configuration drift. Produce a focused report on what changed and what needs attention.
scope: |
  Changes since the last security audit or baseline. Compares endpoints, auth configuration, secrets, third-party integrations, and agent capabilities against prior state.
required_sections:
  - Executive summary
  - Baseline reference
  - New attack surfaces
  - Removed protections
  - Configuration drift
  - New dependencies
  - Agent capability changes
  - Regressions requiring remediation
  - Accepted changes
  - Remediation roadmap
evaluation_criteria:
  - All changes since baseline are identified.
  - Every new endpoint is assessed for security impact.
  - Every removed protection is flagged.
  - Every configuration change is evaluated.
  - Regressions are clearly distinguished from acceptable evolution.
deliverables:
  - A single Markdown document with all required sections.
  - A diff-style comparison of security posture.
  - A prioritised remediation roadmap for regressions.
related:
  - security-drift-is-the-real-threat
  - documentation-as-architecture
  - untrusted-by-default
tags:
  - security
---

# Security Regression Audit

This audit compares current security posture against a documented baseline to identify what changed and whether those changes introduced risk. It's the operational companion to [Application Security Baseline](contextqb://audits/application-security-baseline) — run that first to establish your baseline, then run this periodically to catch drift.

## Use this as an agent instruction

> You are performing a security regression audit.
>
> Your task is NOT to re-audit everything from scratch. Your task is to:
>
> 1. Compare current state against the provided baseline
> 2. Identify what is NEW (endpoints, integrations, capabilities)
> 3. Identify what is REMOVED (protections, middleware, checks)
> 4. Identify what CHANGED (configuration, scope, permissions)
> 5. Assess each change for security impact
>
> Focus on delta, not absolute state. The baseline already passed review.

---

## Prerequisites

You need a baseline to compare against. This can be:

- A prior [Application Security Baseline](contextqb://audits/application-security-baseline) audit
- An attack surface inventory from [Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface)
- A documented security review
- Your `context.qb.yaml` from a known-good state

If you don't have a baseline, stop and run the baseline audit first. You cannot detect regression without a reference point.

---

## Phase 1 — Baseline Establishment

Document what you're comparing against.

### Baseline metadata

| Field                    | Value                                       |
| ------------------------ | ------------------------------------------- |
| Baseline date            | ?                                           |
| Baseline source          | (prior audit / inventory / context.qb.yaml) |
| Time since baseline      | X days                                      |
| Commits since baseline   | X commits                                   |
| Deployers since baseline | (who shipped changes)                       |

### Baseline summary

From the baseline, extract:

- Public endpoint count: X
- Protected endpoint count: X
- Secrets count: X
- Third-party integrations: X
- AI/agent capabilities: X

---

## Phase 2 — New Attack Surfaces

Identify everything that exists now but didn't exist in the baseline.

### New endpoints

| Endpoint       | Purpose         | Auth required? | In baseline? | Risk assessment           |
| -------------- | --------------- | -------------- | ------------ | ------------------------- |
| /api/v2/export | Data export     | Yes            | No — new     | High — data exfil vector  |
| /webhooks/new  | New integration | No             | No — new     | Medium — verify signature |

### New integrations

| Integration          | Purpose  | Data access | In baseline? | Risk assessment      |
| -------------------- | -------- | ----------- | ------------ | -------------------- |
| Analytics SDK        | Tracking | Page views  | No — new     | Low — verify no PII  |
| New payment provider | Payments | Financial   | No — new     | High — verify config |

### New agent capabilities

| Agent/AI feature | Capability         | In baseline? | Risk assessment             |
| ---------------- | ------------------ | ------------ | --------------------------- |
| New chatbot      | User conversations | No — new     | Medium — review data access |
| Agent tool       | File system access | No — new     | High — verify sandboxing    |

For each new surface, answer:

- Was this change reviewed for security?
- Does it follow existing security patterns?
- Is it documented?

---

## Phase 3 — Removed Protections

Identify protections that existed in the baseline but are now missing.

### Removed middleware/checks

Search for:

- Auth middleware removed from routes
- Validation functions commented out or deleted
- Rate limiting disabled
- Security headers removed

| Protection       | Was on        | Status now                  | Impact                 |
| ---------------- | ------------- | --------------------------- | ---------------------- |
| Auth middleware  | /api/admin/\* | Missing on /api/admin/new   | Critical — auth bypass |
| Rate limiting    | /api/search   | Commented out               | Medium — abuse vector  |
| Input validation | /api/submit   | Simplified (missing checks) | High — injection risk  |

### Removed configuration

Check:

- Security-related environment variables
- Auth provider settings
- CORS policies
- Content Security Policy

| Configuration        | Baseline         | Current  | Impact                 |
| -------------------- | ---------------- | -------- | ---------------------- |
| CORS allowed origins | example.com only | \* (all) | High — request forgery |
| Rate limit threshold | 10/min           | 100/min  | Medium — more abuse    |

---

## Phase 4 — Configuration Drift

Identify settings that changed (not added or removed, but modified).

### Auth configuration

| Setting                 | Baseline   | Current     | Intentional?    |
| ----------------------- | ---------- | ----------- | --------------- |
| Session lifetime        | 7 days     | 30 days     | ?               |
| MFA required for admins | Yes        | Yes         | N/A — no change |
| Failed login lockout    | 5 attempts | 10 attempts | ?               |

### Secrets changes

| Secret            | Baseline status | Current status | Change                   |
| ----------------- | --------------- | -------------- | ------------------------ |
| STRIPE_SECRET_KEY | Exists          | Exists         | Rotated ✓ / Not rotated  |
| NEW_SERVICE_KEY   | N/A             | Exists         | New — verify management  |
| OLD_SERVICE_KEY   | Exists          | Missing        | Removed — verify revoked |

### Permission scope changes

| Credential/Permission | Baseline scope | Current scope | Change      |
| --------------------- | -------------- | ------------- | ----------- |
| Database role         | read-only      | read-write    | Elevated ⚠️ |
| API key scope         | analytics only | full access   | Elevated ⚠️ |

---

## Phase 5 — Dependency Changes

New dependencies can introduce vulnerabilities.

### New dependencies

| Dependency  | Version | Purpose   | Known vulnerabilities? |
| ----------- | ------- | --------- | ---------------------- |
| new-package | 1.0.0   | Feature X | Check npm audit / Snyk |

### Upgraded dependencies

| Dependency | Baseline version | Current version | Security notes                    |
| ---------- | ---------------- | --------------- | --------------------------------- |
| framework  | 2.0              | 3.0             | Breaking changes? Security fixes? |

### Removed dependencies

| Dependency   | Baseline version | Why removed? | Replacement?    |
| ------------ | ---------------- | ------------ | --------------- |
| old-auth-lib | 1.0              | Deprecated   | Replaced with X |

---

## Phase 6 — Agent/AI Capability Changes

If the application uses AI/agents, check for capability drift.

### Agent permission changes

| Agent     | Baseline capability | Current capability   | Change assessment |
| --------- | ------------------- | -------------------- | ----------------- |
| Dev agent | Read workspace      | Read + write + shell | Elevated ⚠️       |
| User AI   | Read knowledge base | Read KB + user data  | Elevated ⚠️       |

### New AI integrations

- New model providers added?
- New tool capabilities granted?
- New data sources accessible to AI?

### Prompt/guardrail changes

- System prompts modified?
- Safety guidelines changed?
- Output validation modified?

---

## Phase 7 — Regression Classification

Categorize each change:

### Regressions (security got worse)

| Finding                   | Category           | Impact   | Remediation        |
| ------------------------- | ------------------ | -------- | ------------------ |
| Auth middleware removed   | Removed protection | Critical | Restore middleware |
| Rate limiting disabled    | Removed protection | Medium   | Re-enable          |
| Session lifetime extended | Config drift       | Medium   | Review and justify |

### Acceptable evolution (change is fine)

| Finding              | Category    | Why acceptable           |
| -------------------- | ----------- | ------------------------ |
| New endpoint /api/v2 | New surface | Auth properly configured |
| New dependency       | Dependency  | No known vulnerabilities |

### Needs review (unclear if regression)

| Finding            | Question                    | Who decides   |
| ------------------ | --------------------------- | ------------- |
| MFA now optional   | Was this intentional?       | Product owner |
| New OAuth provider | Was this security reviewed? | Security lead |

---

## Phase 8 — Severity Classification

### Critical regressions

- Authentication bypass introduced
- Authorization check removed
- Secrets exposed
- Critical dependency vulnerable

Action: Fix before any other work. Consider reverting changes.

### High-risk regressions

- Rate limiting disabled
- Input validation weakened
- Session configuration degraded
- Elevated agent permissions

Action: Fix this sprint. Do not ship more features until addressed.

### Medium-risk regressions

- Configuration drift without clear justification
- New surfaces without security review
- Documentation out of date

Action: Fix this cycle. Track as tech debt if not immediate.

---

## Phase 9 — Output Format

Produce a Markdown document with:

1. **Executive Summary**
   - Baseline date: X
   - Time since baseline: X days
   - Changes detected: X
   - Regressions: X (critical: Y, high: Z)

2. **Baseline Reference** — What you compared against

3. **New Attack Surfaces** — Everything added since baseline

4. **Removed Protections** — Everything removed since baseline

5. **Configuration Drift** — Settings that changed

6. **New Dependencies** — Packages added or updated

7. **Agent Capability Changes** — AI/agent permission changes

8. **Regressions Requiring Remediation** — Must fix

9. **Accepted Changes** — Changes reviewed and approved

10. **Remediation Roadmap** — Prioritised actions

---

## Important rules for the auditor

- Do NOT re-audit everything — focus on changes
- Do NOT assume changes were reviewed — verify
- Treat removed protections as critical until proven intentional
- Configuration drift without documentation is suspicious
- New capabilities without security review are findings
- Compare line-by-line when possible, not just at summary level

---

## How to consume the output

1. **Revert or fix critical regressions immediately.**
2. **Investigate "unclear" changes** — was this intentional?
3. **Document accepted changes** in your baseline.
4. **Update your baseline** after remediation.
5. **Schedule the next regression audit** (monthly or per-release).

Use [Detect Security Drift](contextqb://playbooks/detect-security-drift) for manual drift detection between audits.

---

## See also

- [Principle: Security Drift Is the Real Threat](contextqb://principles/security-drift-is-the-real-threat) — why this audit exists
- [Playbook: Detect Security Drift](contextqb://playbooks/detect-security-drift) — manual drift detection
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — establish the baseline first
- [Audit: Pre-Launch Security](contextqb://audits/pre-launch-security) — launch-day verification
