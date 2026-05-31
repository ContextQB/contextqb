---
id: pre-launch-security
title: Pre-Launch Security Audit
summary: A condensed security checklist for launch day. Verify the essentials before going live — secrets secured, auth hardened, endpoints protected, and monitoring in place.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 7
journey_rank: 10
objective: |
  Verify minimum security posture before public launch. This is not a comprehensive audit — it's a launch gate that ensures critical bases are covered.
scope: |
  Production-readiness essentials: secrets, authentication, public endpoints, error handling, monitoring, and incident response readiness. Does NOT replace a full security audit — use this in addition to Application Security Baseline.
required_sections:
  - Launch readiness checklist
  - Secrets verification
  - Authentication verification
  - Public endpoint verification
  - Error handling verification
  - Monitoring verification
  - Incident response readiness
  - Launch decision
evaluation_criteria:
  - All production secrets are secured and rotated.
  - Authentication is hardened with brute-force protection.
  - No debug endpoints in production.
  - Errors don't leak internal information.
  - Basic monitoring and alerting is in place.
  - You know what to do if something goes wrong.
deliverables:
  - A single Markdown document with checklist results.
  - Go/no-go launch decision with blockers listed.
related:
  - untrusted-by-default
  - public-endpoints-are-battlegrounds
  - secrets-have-provenance
tags:
  - security
---

# Pre-Launch Security Audit

This is a condensed security checklist for launch day. It's designed to be fast (30-60 minutes) and catch the critical issues that would be embarrassing or damaging if discovered after launch. It is NOT a replacement for a comprehensive security audit — do that first, then use this as a final gate.

## Use this as an agent instruction

> You are performing a pre-launch security verification.
>
> Your task is NOT to do a comprehensive audit. Your task is to:
>
> 1. Verify critical security controls are in place
> 2. Confirm no obvious mistakes are going to production
> 3. Check launch-day readiness (monitoring, incident response)
> 4. Produce a go/no-go decision with blockers
>
> Be efficient. Focus on launch blockers, not aspirational improvements.

---

## Launch Readiness Checklist

Run through each section. Mark each item:

- ✅ **Pass** — Verified and acceptable
- ⚠️ **Warning** — Concern but not a blocker
- ❌ **Blocker** — Must fix before launch

---

## Section 1 — Secrets Verification

### Checklist

- [ ] **No secrets in code.** Grep codebase for API keys, passwords, tokens.
- [ ] **No secrets in git history.** Check recent commits for accidental exposure.
- [ ] **Production secrets are different from development.** Verify env separation.
- [ ] **All production secrets are in the deployment platform.** Not in files.
- [ ] **Critical secrets have been rotated recently.** Within last 90 days.
- [ ] **You know how to rotate each secret if needed.** Document rotation path.

### Quick tests

```bash
# Search for potential secrets in code
git grep -i "api_key\|secret\|password\|token" -- '*.ts' '*.tsx' '*.js'

# Check for .env files that shouldn't be committed
git ls-files | grep -i env

# Check recent commits for potential leaks
git log --oneline -20 -p | grep -i "key\|secret" | head -20
```

### Result

- Status: ✅ / ⚠️ / ❌
- Blockers: (list any)
- Warnings: (list any)

---

## Section 2 — Authentication Verification

### Checklist

- [ ] **Brute-force protection is enabled.** Rate limiting on login.
- [ ] **Account lockout is configured.** After N failed attempts.
- [ ] **Session lifetime is reasonable.** Not 30+ days for sensitive apps.
- [ ] **MFA is available.** At minimum for admin accounts.
- [ ] **Password reset is secure.** Links expire, single-use.
- [ ] **Session cookies have security flags.** HttpOnly, Secure, SameSite.

### Quick tests

- Try 10+ rapid login attempts — does rate limiting kick in?
- Inspect cookies in browser DevTools — are security flags present?
- Check auth provider dashboard for settings.

### Result

- Status: ✅ / ⚠️ / ❌
- Blockers: (list any)
- Warnings: (list any)

---

## Section 3 — Public Endpoint Verification

### Checklist

- [ ] **No debug endpoints in production.** /debug, /test, /dev, etc.
- [ ] **No admin endpoints without auth.** /admin/\* routes protected.
- [ ] **All webhooks verify signatures.** Stripe, Clerk, etc.
- [ ] **Rate limiting on form endpoints.** Contact forms, search, etc.
- [ ] **No source maps in production.** Check /\_next/static/ or equivalent.
- [ ] **robots.txt doesn't expose sensitive paths.**

### Quick tests

- Try accessing /debug, /test, /admin without auth.
- Check browser DevTools → Sources for source maps.
- Review robots.txt for internal paths.

### Result

- Status: ✅ / ⚠️ / ❌
- Blockers: (list any)
- Warnings: (list any)

---

## Section 4 — Error Handling Verification

### Checklist

- [ ] **Production errors don't show stack traces.** Custom error page.
- [ ] **API errors return generic messages.** Not internal details.
- [ ] **404s don't leak private route existence.** Consistent response.
- [ ] **No environment variables in error output.**

### Quick tests

- Trigger a 500 error — what do users see?
- Request a nonexistent API route — does response leak info?
- Trigger a validation error — is the message appropriate?

### Result

- Status: ✅ / ⚠️ / ❌
- Blockers: (list any)
- Warnings: (list any)

---

## Section 5 — Data Protection Verification

### Checklist

- [ ] **Database access uses appropriate credentials.** Not service role everywhere.
- [ ] **RLS is enabled on sensitive tables.** (If using Supabase/similar)
- [ ] **No PII in logs.** Check logging configuration.
- [ ] **HTTPS enforced.** No mixed content, redirects to HTTPS.

### Quick tests

- Review database roles and permissions.
- Check log output for email addresses, passwords, tokens.
- Try accessing site via HTTP — does it redirect?

### Result

- Status: ✅ / ⚠️ / ❌
- Blockers: (list any)
- Warnings: (list any)

---

## Section 6 — Monitoring Verification

### Checklist

- [ ] **Error monitoring is configured.** Sentry, LogRocket, etc.
- [ ] **Alerts will reach someone.** Email, Slack, PagerDuty.
- [ ] **You can see auth failures.** Login attempts, lockouts.
- [ ] **You can see application errors.** 500s, crashes.
- [ ] **You have a status page or health endpoint.**

### Quick tests

- Trigger an error — does it appear in monitoring?
- Who gets alerted? Is someone actually watching?

### Result

- Status: ✅ / ⚠️ / ❌
- Blockers: (list any)
- Warnings: (list any)

---

## Section 7 — Incident Response Readiness

### Checklist

- [ ] **You know how to take the site offline.** (If needed urgently)
- [ ] **You know how to rotate each critical secret.** Document exists.
- [ ] **You know how to invalidate all sessions.** Through auth provider.
- [ ] **You have contact info for key services.** Stripe support, Clerk, etc.
- [ ] **Someone is on call.** Or at least checking email.

### Quick documentation

| Scenario           | Action                | Who    |
| ------------------ | --------------------- | ------ |
| Secret leaked      | Rotate at [where]     | [name] |
| Auth compromise    | Invalidate at [where] | [name] |
| Need to go offline | [how]                 | [name] |

### Result

- Status: ✅ / ⚠️ / ❌
- Blockers: (list any)
- Warnings: (list any)

---

## Launch Decision

### Summary

| Section           | Status       |
| ----------------- | ------------ |
| Secrets           | ✅ / ⚠️ / ❌ |
| Authentication    | ✅ / ⚠️ / ❌ |
| Public Endpoints  | ✅ / ⚠️ / ❌ |
| Error Handling    | ✅ / ⚠️ / ❌ |
| Data Protection   | ✅ / ⚠️ / ❌ |
| Monitoring        | ✅ / ⚠️ / ❌ |
| Incident Response | ✅ / ⚠️ / ❌ |

### Decision

**❌ NO-GO** if any blocker exists.

Blockers that must be fixed:

1. [Blocker 1]
2. [Blocker 2]

**⚠️ GO WITH CAUTION** if warnings but no blockers.

Warnings to address post-launch:

1. [Warning 1]
2. [Warning 2]

**✅ GO** if all sections pass.

---

## What this audit does NOT cover

This is a launch gate, not a comprehensive audit. It does NOT:

- Perform penetration testing
- Review all code for vulnerabilities
- Assess third-party dependency security
- Evaluate AI/agent security comprehensively
- Replace [Application Security Baseline](contextqb://audits/application-security-baseline)

Do a full security audit before or soon after launch.

---

## Post-launch

After successful launch:

1. **Schedule a full security audit** if you haven't done one.
2. **Set up ongoing monitoring** for security-relevant events.
3. **Plan your first regression check** for 30 days out.
4. **Document your baseline** so future checks have a reference.

---

## See also

- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — comprehensive audit
- [Audit: Security Regression](contextqb://audits/security-regression) — ongoing drift detection
- [Playbook: Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise) — if something goes wrong
- [Playbook: Triage Your Secrets](contextqb://playbooks/triage-your-secrets) — secrets inventory
- [Playbook: Harden Your Authentication](contextqb://playbooks/harden-your-authentication) — auth hardening steps
