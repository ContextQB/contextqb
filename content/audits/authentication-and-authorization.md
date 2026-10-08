---
id: authentication-and-authorization
title: Authentication & Authorization Audit
summary: A focused security audit of identity and access — verify login hardening, session security, authorization checks, and access control enforcement.
version: 0.2.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 5
journey_rank: 10
objective: |
  Assess the application's authentication and authorization posture. Identify gaps in brute-force protection, session management, role enforcement, and access control.
scope: |
  All authentication surfaces (login, signup, recovery) and authorization checks (route protection, role enforcement, resource access control). Covers the auth provider configuration and application-level implementation.
required_sections:
  - Executive summary
  - Authentication surfaces
  - Session configuration
  - Brute-force protection
  - MFA status
  - Authorization model
  - Route protection
  - Resource-level access
  - Critical findings
  - High-risk findings
  - Remediation roadmap
evaluation_criteria:
  - All authentication endpoints have brute-force protection.
  - Session lifetime is appropriate for data sensitivity.
  - MFA is available and required for privileged accounts.
  - Every protected route is actually protected.
  - Authorization is enforced at the resource level, not just route level.
  - No authorization bypass paths exist.
deliverables:
  - A single Markdown document with all required sections.
  - A complete auth surface inventory.
  - A prioritised remediation roadmap.
related:
  - application-security-baseline
  - harden-your-authentication
  - public-endpoint-exposure
  - public-endpoints-are-battlegrounds
  - trust-boundaries-are-architecture
  - untrusted-by-default
tags:
  - security
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.4 (agent)"
  reviewer_notes: "2026-10-07 renewal B7 (0.2.0; author self-checked; independent review pending; not operator-accepted): adds what to give the agent (settings exports or screenshots when it cannot see the provider dashboard) and a test-target rule: request bursts, brute-force and IDOR tests run only against a local or staging copy with test accounts, never production without separate authority from its owner; numeric values become deliberate, written-down choices compared with the dated security-defaults reference instead of fixed recommendations; passkeys (WebAuthn) or another phishing-resistant method added to the MFA checklist without per-provider claims; provider names become categories (managed-services reference); provider dashboard paths are not given, because the auth-provider-settings reference is unverified; independence note; reports never include secret values or session tokens. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; IDOR phase is the right kind of paranoid. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
---

# Authentication & Authorization Audit

This audit examines how users prove their identity (authentication) and how the application controls what they can access (authorization). It's designed for applications using a managed authentication provider or a framework auth library ([what common providers do](contextqb://references/tools#managed-services)) and focuses on configuration gaps and implementation errors.

**Before you run it.**

- **Give the agent what it cannot see.** Export or screenshot your auth provider's security, session, password and MFA settings; the agent cannot read the dashboard. Never paste secret keys or session tokens.
- **Choose the test target.** The tests below send many requests, try passwords and change IDs in requests. Run them only against a local copy or a staging deployment with test accounts. Against production, the agent only reads code and configuration and makes ordinary single requests — never bursts, password guessing or ID tampering without separate authority from the system's owner.
- **Use an independent reviewer.** A session that did not build the auth code, given the code and the settings. A different model can add variety; it does not by itself make the audit independent.

## Use this as an agent instruction

> You are performing a professional security audit focused on authentication and authorization.
>
> Your task is NOT to explain auth concepts. Your task is to:
>
> 1. Inventory all authentication surfaces and their configuration
> 2. Verify brute-force protection is active and effective
> 3. Test that authorization is enforced, not assumed
> 4. Identify bypass paths, misconfigurations, and missing checks
>
> You must produce evidence-based findings, not generic advice.
>
> Test target: run active tests (request bursts, password attempts, ID tampering, role changes in requests) only against the local or staging target I name, with test accounts. If I have not named one, do not run them: mark the check UNKNOWN and write the test you would run. Never include a password, secret key or session token in your report.

---

## Phase 1 — Authentication Surface Discovery

Identify every way users can authenticate.

### Primary authentication

| Surface        | URL/Path         | Provider | Status        |
| -------------- | ---------------- | -------- | ------------- |
| Sign in        | /sign-in         | ?        | Audit pending |
| Sign up        | /sign-up         | ?        | Audit pending |
| Password reset | /forgot-password | ?        | Audit pending |
| Magic link     | (email)          | ?        | Audit pending |
| OAuth          | /sso/\*          | ?        | Audit pending |

### Secondary authentication

- API key authentication (for machine access)
- Service account authentication
- Webhook authentication (signature verification)
- Admin/internal authentication

### Provider configuration

Identify the auth provider (a hosted provider, a framework auth library, or custom) and verify its configuration — from the dashboard if you have access, otherwise from the settings export or screenshots the operator provides. Mark anything you could not see as UNKNOWN.

---

## Phase 2 — Brute-Force Protection

Check that authentication endpoints are protected from automated attacks.

### Rate limiting

For each auth endpoint, verify:

- [ ] Rate limiting is enabled
- [ ] The limit is a deliberate, written-down number suited to your traffic (there is no single standard figure)
- [ ] Rate limiting applies per-IP AND per-account
- [ ] Rate limit responses are consistent (no enumeration via timing)

Test: "If I try 100 passwords in 1 minute, what happens?"

### Account lockout

Verify:

- [ ] Account locks, or slows down, after a set number of failed attempts — compare your setting with the standards and provider defaults in the dated [security defaults reference](contextqb://references/pricing#security-defaults)
- [ ] Lockout duration is a deliberate choice, recorded with the threshold
- [ ] Lockout notification is sent to account owner
- [ ] Lockout can be bypassed via forgot password (not via login)

### Credential stuffing protection

- [ ] Breached password detection is enabled
- [ ] Common passwords are rejected
- [ ] Password requirements enforce a minimum length that follows a published standard (current figures in the [security defaults reference](contextqb://references/pricing#security-defaults)); length matters more than composition rules

For each **FAIL**, document:

- Current configuration
- Attack scenario
- Recommended fix

---

## Phase 3 — Session Security

Audit how sessions are created, maintained, and terminated.

### Session configuration

| Setting             | Current value | Recommended | Status |
| ------------------- | ------------- | ----------- | ------ |
| Session lifetime    | ?             | 7 days max  | ?      |
| Inactivity timeout  | ?             | 30 min      | ?      |
| Concurrent sessions | ?             | Limited     | ?      |
| Session revocation  | ?             | Available   | ?      |

### Cookie/token security

Inspect session cookies in browser DevTools:

- [ ] `HttpOnly` flag set (prevents XSS cookie theft)
- [ ] `Secure` flag set (HTTPS only)
- [ ] `SameSite` attribute set (Lax or Strict)
- [ ] Reasonable expiration

### Session lifecycle

- [ ] Sessions are invalidated on password change
- [ ] Sessions are invalidated on role change
- [ ] "Sign out everywhere" functionality exists
- [ ] Session tokens are not predictable

---

## Phase 4 — Multi-Factor Authentication

Verify MFA availability and enforcement.

### MFA configuration

- [ ] MFA is available to all users
- [ ] TOTP (authenticator app) is supported
- [ ] Passkeys (WebAuthn) or another phishing-resistant method is available, if the provider offers one
- [ ] SMS MFA is available but not the only option
- [ ] MFA recovery process exists

### MFA enforcement

- [ ] MFA is required for admin/privileged accounts
- [ ] MFA can be required by organization policy
- [ ] MFA bypass scenarios are documented and intentional

### MFA implementation

- [ ] MFA challenge happens before session is granted
- [ ] MFA tokens have appropriate lifetime
- [ ] Backup codes are securely generated and stored

---

## Phase 5 — Authorization Model

Understand and verify the authorization structure.

### Identify the model

What authorization model does this application use?

- **Role-based (RBAC):** Users have roles (admin, user, viewer)
- **Permission-based:** Users have specific permissions
- **Attribute-based (ABAC):** Access based on user/resource attributes
- **Row-level security (RLS):** Database enforces access
- **Custom:** Application-level checks

### Document the roles/permissions

| Role/Permission | Description     | Who has it | How assigned |
| --------------- | --------------- | ---------- | ------------ |
| admin           | Full access     | ?          | ?            |
| user            | Standard access | ?          | ?            |
| ...             | ...             | ...        | ...          |

### Verify role assignment

- [ ] Role assignment requires privileged access
- [ ] Role changes are logged
- [ ] Default role for new users is least-privilege

---

## Phase 6 — Route Protection

Verify that protected routes are actually protected.

### Route inventory

List all routes and their protection status:

| Route         | Requires auth? | Requires role? | Actually enforced? |
| ------------- | -------------- | -------------- | ------------------ |
| /             | No             | No             | N/A                |
| /dashboard    | Yes            | No             | Verify             |
| /admin        | Yes            | admin          | Verify             |
| /api/users    | Yes            | No             | Verify             |
| /api/admin/\* | Yes            | admin          | Verify             |
| ...           | ...            | ...            | ...                |

### Test route protection

For each protected route, on the local or staging target only:

1. **Unauthenticated access:** What happens if you access without a session?
2. **Wrong role access:** What happens if a regular user accesses admin routes?
3. **Direct API access:** Can you bypass UI protection by calling APIs directly?

### Common bypass patterns

Check for:

- [ ] No middleware on new API routes
- [ ] Client-side only protection (server doesn't check)
- [ ] Inconsistent protection (some admin routes protected, others not)
- [ ] Parameter manipulation bypass (changing role in request)

---

## Phase 7 — Resource-Level Access Control

Route protection is not enough — verify access control on individual resources.

### IDOR testing (Insecure Direct Object Reference)

Test, on the local or staging target with two test accounts: "If I change the ID in a request, can I access another user's data?"

| Resource     | Endpoint        | Access control | IDOR test result |
| ------------ | --------------- | -------------- | ---------------- |
| User profile | /api/users/:id  | ?              | Pass/Fail        |
| Orders       | /api/orders/:id | ?              | Pass/Fail        |
| Documents    | /api/docs/:id   | ?              | Pass/Fail        |

### RLS verification (if using database RLS)

- [ ] RLS policies are enabled on sensitive tables
- [ ] RLS policies correctly filter by user ID
- [ ] Service role bypasses are intentional and limited

### Data leakage

- [ ] API responses don't include data the user shouldn't see
- [ ] Error messages don't leak resource existence
- [ ] List endpoints are scoped appropriately

---

## Phase 8 — OAuth and SSO

If OAuth/SSO is used, verify secure configuration.

### OAuth providers

| Provider | Enabled | Scopes requested | Account linking behavior |
| -------- | ------- | ---------------- | ------------------------ |
| Google   | ?       | email, profile   | ?                        |
| GitHub   | ?       | ?                | ?                        |
| ...      | ...     | ...              | ...                      |

### OAuth security

- [ ] Only necessary scopes are requested
- [ ] OAuth state parameter is used (CSRF protection)
- [ ] Account linking is secure (can't hijack via OAuth)
- [ ] OAuth client secrets are rotated periodically

---

## Phase 9 — Severity Classification

### Critical findings

- Authentication bypass (login without credentials)
- Authorization bypass (access admin as user)
- Session hijacking vulnerability
- Missing authentication on sensitive endpoints
- IDOR on sensitive data

### High-risk findings

- No brute-force protection
- Session lifetime too long for data sensitivity
- MFA not available or not enforced for admins
- Inconsistent route protection

### Medium-risk findings

- No inactivity timeout
- Missing security cookie flags
- OAuth scopes broader than necessary
- No session revocation capability

---

## Phase 10 — Output Format

Produce a Markdown document with:

1. **Executive Summary** — Key stats and critical issues
   - Auth provider: X
   - Brute-force protection: Enabled/Disabled
   - MFA status: Available/Required/Not available
   - Authorization model: RBAC/RLS/etc.
   - Critical gaps: X

2. **Authentication Surfaces** — Complete inventory

3. **Session Configuration** — Current vs. recommended

4. **Brute-Force Protection** — Status and gaps

5. **MFA Status** — Configuration and enforcement

6. **Authorization Model** — How access is controlled

7. **Route Protection** — What's protected and what's not

8. **Resource-Level Access** — IDOR and RLS findings

9. **Critical Findings** — Must fix immediately

10. **High-Risk Findings** — Must fix soon

11. **Remediation Roadmap** — Prioritised actions

---

## Important rules for the auditor

- Do NOT assume middleware is applied — verify each route
- Do NOT skip IDOR testing — it's the most common authz bug
- Do NOT trust UI-based protection — always test API directly
- Test with actual requests, not just code review — on the local or staging target only; if none is named, mark the check UNKNOWN and write the test
- Flag any "unclear" authorization as a finding
- Verify auth provider configuration from the dashboard or the operator's export, not just code
- Never include passwords, secret keys or session tokens in the report

---

## How to consume the output

1. **Fix critical findings immediately.** Auth bypass is a blocker.
2. **Enable brute-force protection** if disabled.
3. **Configure MFA** for admin accounts at minimum.
4. **Fix all IDOR issues** — these are easy to exploit.
5. **Document your authorization model** for future reference.

Use [Harden Your Authentication](contextqb://playbooks/harden-your-authentication) for implementation guidance.

---

## See also

- [Playbook: Harden Your Authentication](contextqb://playbooks/harden-your-authentication) — implementation steps
- [Principle: Public Endpoints Are Battlegrounds](contextqb://principles/public-endpoints-are-battlegrounds) — why auth is under attack
- [Principle: Trust Boundaries Are Architecture](contextqb://principles/trust-boundaries-are-architecture) — where auth fits in security
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — comprehensive audit including auth
- [Audit: Public Endpoint Exposure](contextqb://audits/public-endpoint-exposure) — companion audit for exposed surfaces
