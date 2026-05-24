---
id: detect-security-drift
title: Detect Security Drift
summary: Compare your current application state against your security baselines and prior audits to identify what changed, what degraded, and what new risks emerged.
version: 0.1.0
problem: |
  Security doesn't fail in one big moment — it degrades gradually. A setting gets changed, a new endpoint is added without auth, a secret stops rotating. By the time you notice, the drift has accumulated.
when_to_use: |
  After shipping features, during periodic reviews, or whenever you suspect something changed that shouldn't have.
expected_outputs:
  - A drift report comparing current state to baseline.
  - List of changes that degraded security posture.
  - Action items to remediate or accept each finding.
audience:
  - novice-builder
  - founder
  - operator
related_principles:
  - security-drift-is-the-real-threat
  - documentation-as-architecture
  - untrusted-by-default
tags:
  - security
---

# Detect Security Drift

**Plain language:** Security doesn't break — it rots. This playbook helps you compare where your security is today against where it was last time you checked, so you can catch the slow changes before they become big problems.

## When to use this

- After shipping a significant feature
- After onboarding new team members or agents
- Monthly or quarterly as a hygiene check
- When you have a "feeling" something changed
- After a security incident (to understand scope)
- When preparing for an audit or compliance review

## What you'll produce

A **drift report** containing:

1. Changes since your last baseline (new endpoints, changed configs, new secrets)
2. Security regressions (things that got worse)
3. Accepted risks (things you knew about and decided to keep)
4. Action items (things that need fixing)

## Before you start

You'll need:

- Your previous attack surface inventory or security audit
- Access to your current codebase
- Access to your deployment and auth provider dashboards
- Your `context.qb.yaml` if you maintain one

**If you don't have a baseline:** Run [Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) first. You can't detect drift without knowing where you started.

## Steps

### Step 1 — Gather your baseline documents

Collect your prior security state:

- Attack surface inventory (from Map Your Attack Surface playbook)
- Secrets inventory (from Triage Your Secrets playbook)
- Previous audit reports
- Auth configuration documentation
- Your `context.qb.yaml` from the last stable point

If you use version control, you can diff these documents:

```bash
git diff HEAD~30 -- docs/security/attack-surface.md
```

Or ask your agent: "Show me all changes to security-related documentation in the last 30 days."

### Step 2 — Scan for new public surfaces

Compare current public endpoints to your baseline.

**What to look for:**

- New routes that weren't in the baseline
- Routes that changed from authenticated to unauthenticated
- New webhooks or API endpoints
- New subdomains or deployment targets

Ask your agent: "List all public endpoints in this codebase. Compare to [baseline document] and identify any new or changed entries."

**Record your findings:**

| Endpoint      | In baseline? | Change     | Risk assessment              |
| ------------- | ------------ | ---------- | ---------------------------- |
| /api/v2/users | No           | New        | Medium — verify auth         |
| /api/health   | Yes          | Now public | Low — intentional            |
| /admin/debug  | No           | New        | Critical — why is this here? |

### Step 3 — Check authentication configuration drift

Compare current auth settings to your documented policy.

**What to look for:**

- Session lifetime changes
- Rate limiting disabled or loosened
- MFA requirements changed
- New OAuth providers added
- Password policy changes

Check your auth provider dashboard against your authentication policy document.

**Record your findings:**

| Setting          | Baseline    | Current        | Drift?                     |
| ---------------- | ----------- | -------------- | -------------------------- |
| Session lifetime | 7 days      | 30 days        | Yes — why extended?        |
| Rate limiting    | 10/min      | 10/min         | No                         |
| MFA for admins   | Required    | Required       | No                         |
| OAuth providers  | Google only | Google, GitHub | Yes — was GitHub reviewed? |

### Step 4 — Audit secrets drift

Compare current secrets to your secrets inventory.

**What to look for:**

- New secrets added (documented?)
- Secrets that should have rotated but haven't
- Secrets missing owners
- Secrets in unexpected places

Ask your agent: "Compare the environment variables in this codebase to [secrets inventory]. Identify new, removed, or changed entries."

**Record your findings:**

| Secret            | In inventory? | Status                          | Action                         |
| ----------------- | ------------- | ------------------------------- | ------------------------------ |
| NEW_SERVICE_KEY   | No            | New, undocumented               | Add to inventory, assign owner |
| STRIPE_SECRET_KEY | Yes           | Should have rotated 60 days ago | Rotate immediately             |
| OLD_ANALYTICS_KEY | Yes           | No longer referenced            | Revoke and remove              |

### Step 5 — Check for removed security controls

Sometimes drift removes protection rather than adding exposure.

**What to look for:**

- Middleware removed from routes
- Input validation commented out or bypassed
- Rate limiting disabled "temporarily"
- Error handling removed (now leaking stack traces)
- Security headers removed

Ask your agent: "Search for TODO, FIXME, or 'temporary' comments related to security, validation, or authentication in this codebase."

**Record your findings:**

| Control               | Baseline          | Current                 | Impact            |
| --------------------- | ----------------- | ----------------------- | ----------------- |
| CORS policy           | Strict origin     | `*` (allow all)         | High — revert     |
| Rate limit middleware | On all API routes | Missing from /api/v2/\* | Medium — add back |
| Input validation      | On /api/submit    | Commented out           | High — restore    |

### Step 6 — Review agent capability drift

If you use AI agents in development or production, check if their capabilities expanded.

**What to look for:**

- New tools or MCP servers added
- Broader file access granted
- New shell or execution capabilities
- Access to production data or secrets

Check `AGENTS.md`, MCP configurations, and any agent-related settings.

**Record your findings:**

| Agent       | Baseline capability  | Current capability  | Change                            |
| ----------- | -------------------- | ------------------- | --------------------------------- |
| Cursor      | Read/write workspace | Read/write + shell  | Shell added — review restrictions |
| Support bot | Read knowledge base  | Read KB + user data | User data access — why?           |

### Step 7 — Compile the drift report

Bring findings together:

```markdown
## Security Drift Report

**Date:** [Today]
**Baseline:** [Date of last audit]
**Scope:** [What you reviewed]

### Summary

- **New surfaces:** [N] (X unevaluated)
- **Configuration changes:** [N] (X regressions)
- **Secrets drift:** [N] items
- **Removed controls:** [N] found

### Critical findings

1. [Finding] — [Impact] — [Recommended action]
2. ...

### Accepted drift

- [Item] — Accepted because [reason] — Review date [future date]

### Action items

- [ ] [Action] — Owner: [Name] — Due: [Date]
- [ ] ...
```

### Step 8 — Remediate or accept

For each finding, decide:

1. **Fix** — Restore the security control or remove the exposure
2. **Accept** — Document why this drift is acceptable and set a review date
3. **Escalate** — This needs broader discussion or approval

**Do not leave findings in limbo.** Every item either gets fixed, accepted with documentation, or escalated.

## Common mistakes

- **No baseline to compare against.** You can't detect drift if you never recorded the starting state.
- **Only checking code.** Configuration drift in auth providers and deployment platforms is just as dangerous.
- **Ignoring "small" changes.** A session lifetime change from 7 to 30 days looks small but multiplies breach impact.
- **Accepting drift without documentation.** "We decided to keep it" is not acceptance. Document why.
- **Not setting review dates.** Accepted risks must be re-evaluated periodically.

## What "good enough" looks like

Your drift detection is good enough when:

- [ ] You have a documented baseline to compare against
- [ ] You've checked all major surfaces (endpoints, auth, secrets, agents)
- [ ] Every finding is categorized (fix, accept, escalate)
- [ ] Accepted risks have documented rationale and review dates
- [ ] Action items have owners and due dates
- [ ] The baseline is updated to reflect current accepted state

## When to do this again

- Monthly for high-sensitivity applications
- Quarterly for typical applications
- After every major release
- After any security incident
- After team changes (new members may introduce drift unknowingly)

## See also

- [Principle: Security Drift Is the Real Threat](contextqb://principles/security-drift-is-the-real-threat) — why continuous detection matters
- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — create your initial baseline
- [Playbook: Triage Your Secrets](contextqb://playbooks/triage-your-secrets) — secrets-specific inventory
- [Audit: Security Regression](contextqb://audits/security-regression) — agent-driven regression detection
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — comprehensive agent audit
