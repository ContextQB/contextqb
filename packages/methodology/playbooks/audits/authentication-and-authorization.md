---
id: authentication-and-authorization
title: Authentication & Authorization Audit
summary: A focused security audit of identity and access — verify login hardening, account recovery, session security against your declared policy, authorization checks, and access control enforcement.
version: 0.4.1
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
  - Session lifetime, inactivity timeout and revocation match a declared policy chosen for the data's sensitivity; gaps against applicable cited guidance are reported separately; missing policy is reported as an open decision.
  - A locked-out owner regains access only through the product's documented, verified recovery flow; a recovery request alone never unlocks an account, signs anyone in or clears the failed-attempt count.
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
  - authentication-vs-authorization
  - harden-your-authentication
  - protecting-users-and-their-data
  - public-endpoint-exposure
  - public-endpoints-are-battlegrounds
  - trust-boundaries-are-architecture
  - untrusted-by-default
tags:
  - security

---

# Authentication & Authorization Audit

This audit examines how users prove their identity (authentication) and how the application controls what they can access (authorization). It's designed for applications using a managed authentication provider or a framework auth library ([what common providers do](contextqb://references/tools#managed-services)) and focuses on configuration gaps and implementation errors.

For the concepts and a controlled two-account example, read [Authentication vs. Authorization](contextqb://briefings/authentication-vs-authorization). Apply this audit to the identity and access model the product actually has. A local no-account tool does not need a login service to complete a lesson; it still needs its file and device boundaries understood. Record non-applicable checks with reasons and unknown settings as unknown. [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data) helps you interpret the findings.

## Before you run it: what you prepare

- **Write down the policy being checked.** Several checks ask whether sign-in, lockout, account recovery and sessions behave as _you decided_ they should. There is no single correct lockout threshold or session length; the right values depend on what the app protects and how people use it. Attach your written authentication policy — Step 8 of [Harden Your Authentication](contextqb://playbooks/harden-your-authentication) has a short template. The numbers in that playbook are illustrative starting points, not requirements. Also describe how a locked-out owner gets back in — your documented recovery flow. If you have not decided a value yet, say so: the agent will report it as "policy not set", an open decision for you, rather than passing or failing it. Your policy sets the values; it does not switch off security requirements that apply anyway, such as a recovery request never unlocking an account by itself.
- **Give the agent what it cannot see.** Export or screenshot your auth provider's security, session, password and MFA settings; the agent cannot read the dashboard. Never paste secret keys or session tokens.
- **Check cookies yourself, or accept UNKNOWN.** The cookie-flag checks need someone to look at the sign-in cookie in a browser's developer tools on the test target. Do that and attach what you saw, or the agent will mark those checks UNKNOWN.
- **Choose the test target and name it in your message.** Some checks send many requests, try passwords and change IDs in requests. Those run only against a local copy or a staging deployment with test accounts. Against production, the agent only reads code and configuration and makes ordinary single requests — never bursts, password guessing or ID tampering without separate authority from the system's owner. If you name no target, the agent writes the tests instead of running them.
- **Use an independent reviewer.** A session that did not build the auth code, given the code and the settings. A different model can add variety; it does not by itself make the audit independent.

## The agent instruction

Everything between the **START** and **END** lines below is the instruction for the agent: its role, limits, every phase and checklist, the report format and the auditor's rules. Copy all of it, including the START and END lines, into one message. Put the evidence you collected underneath, after the END line. The sections outside those two lines are for you, not the agent.

**START OF AGENT INSTRUCTION — Authentication & Authorization Audit.** Everything from this line to the END line is one instruction.

### Your role and limits

You are performing a professional security audit focused on authentication and authorization.

Your task is NOT to explain auth concepts. Your task is to:

1. Inventory all authentication surfaces and their configuration
2. Verify brute-force protection is active and effective
3. Test that authorization is enforced, not assumed
4. Identify bypass paths, misconfigurations, and missing checks

You must produce evidence-based findings, not generic advice.

Test target: run active tests (request bursts, password attempts, ID tampering, role changes in requests) only against the local or staging target I name, with test accounts. If I have not named one, do not run them: mark the check UNKNOWN and write the test you would run. Never include a password, secret key or session token in your report.

Policy first: several checks compare the application with the policy I chose — lockout threshold and duration, how a locked-out owner recovers, session lifetime and inactivity timeout. Read the authentication policy I attached before judging those checks. Where I have not set a value, report it as POLICY NOT SET (an open decision for me) instead of PASS or FAIL, and still report what the application currently does. Do not substitute numbers of your own or from any guide as if they were my policy.

My policy decides values and design choices; it does not make every choice adequate. Where a requirement from the guidance cited in this instruction applies — for example, a recovery request alone must never lift a lockout, or expired and signed-out sessions must be invalidated on the server — report a gap against it even if the setting matches my policy, and name the source. Do not invent requirements that no cited source states.

### Evidence you may use

Work only from the code and configuration in this repository and the evidence I attach to this message (my authentication policy, settings exports or screenshots, any browser checks I made, and the test target I named). You have no access to provider dashboards, accounts, browsers, monitoring tools or live systems unless I have given it to you explicitly in this session; do not try to obtain it. When a check depends on evidence you do not have, mark it UNKNOWN, say exactly what evidence would settle it and who can get it (usually me, from a dashboard or a browser), and move on. Never mark a check as passing without evidence. Do not send requests to any live system except as this instruction expressly allows. Where a table below already has example rows, they show the format only; they are not findings about this application. Replace them with what you find.

### Phase 1 — Authentication Surface Discovery

Identify every way users can authenticate.

#### Primary authentication

| Surface        | URL/Path         | Provider | Status        |
| -------------- | ---------------- | -------- | ------------- |
| Sign in        | /sign-in         | ?        | Audit pending |
| Sign up        | /sign-up         | ?        | Audit pending |
| Password reset | /forgot-password | ?        | Audit pending |
| Magic link     | (email)          | ?        | Audit pending |
| OAuth          | /sso/\*          | ?        | Audit pending |

#### Secondary authentication

- API key authentication (for machine access)
- Service account authentication
- Webhook authentication (signature verification)
- Admin/internal authentication

#### Provider configuration

Identify the auth provider (a hosted provider, a framework auth library, or custom) and verify its configuration from the settings exports or screenshots I attached, or from the dashboard only if I have explicitly given you access to it. Mark anything you could not see as UNKNOWN.

### Phase 2 — Brute-Force Protection

Check that authentication endpoints are protected from automated attacks.

#### Rate limiting

For each auth endpoint, verify:

- [ ] Rate limiting is enabled
- [ ] The limit is a deliberate number recorded in my policy and suited to this app's traffic (there is no single standard figure)
- [ ] Rate limiting applies per-IP AND per-account
- [ ] Rate limit responses are consistent (no enumeration via timing)

Test: "If I try 100 passwords in 1 minute, what happens?"

#### Account lockout

Verify:

- [ ] Account locks, or slows down, after the number of failed attempts set in my policy; the failed-attempt count is tied to the account, not only to the sender's IP address. For context, published standards and provider defaults are in the dated [security defaults reference](contextqb://references/pricing#security-defaults); they are not my policy.
- [ ] Lockout duration matches my policy, recorded with the threshold
- [ ] Lockout notification is sent to the account owner
- [ ] **A locked-out owner regains access only through the product's documented, verified recovery flow, and a recovery request alone lifts no protection.**
  - _Policy (mine to choose):_ how a locked-out owner gets back in — for example, waiting out the lockout, completing a recovery flow that proves control of the account, or contacting an administrator. A password-reset flow with a single-use, time-limited token or code followed by a new password is one common example, not a required design. Check that the implementation matches my documented flow and that the flow actually verifies the owner before restoring access. If my policy does not say how a locked-out owner regains access, report POLICY NOT SET.
  - _Requirement (applies whatever the policy):_ merely requesting recovery must not unlock the account, sign anyone in or clear the failed-attempt count — FAIL if it does. Recovery requests must not themselves lock the owner out, and must be protected against excessive automated submissions (per-account rate limiting is one way). Sources: OWASP Authentication Cheat Sheet, Account Lockout (lockout must not become a way to deny owners access; letting forgotten-password recovery work during a lockout is one option) and OWASP Forgot Password Cheat Sheet (in a token-based flow, no change to the account until a valid token is presented; accounts are not locked out in response to forgotten-password requests; protection against excessive automated submissions).

#### Credential stuffing protection

- [ ] Breached password detection is enabled
- [ ] Common passwords are rejected
- [ ] Password requirements enforce a minimum length that follows a published standard (current figures in the [security defaults reference](contextqb://references/pricing#security-defaults)); length matters more than composition rules

For each **FAIL**, document:

- Current configuration
- Attack scenario
- Recommended fix

### Phase 3 — Session Security

Audit how sessions are created, maintained, and terminated.

#### Session configuration

Compare each setting with my policy and with the applicable guidance, and report both:

- _Policy (mine to choose):_ the actual values — session lifetime, inactivity timeout, concurrent sessions and how sessions are revoked (for example sign-out, and "sign out everywhere" if I offer it). The right values depend on what the app protects and how long people use it at a time. Values such as a 7-day lifetime or a 30-minute inactivity timeout, and the starting points in Harden Your Authentication, are illustrations, not a standard; do not use them as my policy. If my policy has no value for a row, write POLICY NOT SET and record the current value; if you cannot see the current value, write UNKNOWN.
- _Applicable guidance:_ the OWASP Session Management Cheat Sheet (Session Expiration) says sessions need expiration timeouts set according to the application's purpose and sensitivity, and that when a session expires or the user signs out, the application must invalidate it on the server, not only in the browser. If the code or settings show a gap against that — for example, no expiry at all, or a server that still accepts a signed-out session — report it with the source, even where it matches my policy.

| Setting             | Current value | My policy        | Status                                       |
| ------------------- | ------------- | ---------------- | -------------------------------------------- |
| Session lifetime    | ?             | (from my policy) | Matches / Differs / Policy not set / Unknown |
| Inactivity timeout  | ?             | (from my policy) | Matches / Differs / Policy not set / Unknown |
| Concurrent sessions | ?             | (from my policy) | Matches / Differs / Policy not set / Unknown |
| Session revocation  | ?             | (from my policy) | Matches / Differs / Policy not set / Unknown |

List any gap against the cited guidance separately from these policy comparisons.

#### Cookie/token security

Check the session cookie settings in code and configuration, and use any browser check I attached. You cannot open a browser yourself unless I have given you one for the test target; mark a flag UNKNOWN if neither source shows it.

- [ ] `HttpOnly` flag set (prevents XSS cookie theft)
- [ ] `Secure` flag set (HTTPS only)
- [ ] `SameSite` attribute set (Lax or Strict)
- [ ] Cookie expiration is consistent with my session policy

#### Session lifecycle

- [ ] Sessions are invalidated on password change
- [ ] Sessions are invalidated on role change
- [ ] "Sign out everywhere" functionality exists
- [ ] Session tokens are not predictable

### Phase 4 — Multi-Factor Authentication

Verify MFA availability and enforcement.

#### MFA configuration

- [ ] MFA is available to all users
- [ ] TOTP (authenticator app) is supported
- [ ] Passkeys (WebAuthn) or another phishing-resistant method is available, if the provider offers one
- [ ] SMS MFA is available but not the only option
- [ ] MFA recovery process exists

#### MFA enforcement

- [ ] MFA is required for admin/privileged accounts
- [ ] MFA can be required by organization policy
- [ ] MFA bypass scenarios are documented and intentional

#### MFA implementation

- [ ] MFA challenge happens before session is granted
- [ ] MFA tokens have appropriate lifetime
- [ ] Backup codes are securely generated and stored

### Phase 5 — Authorization Model

Understand and verify the authorization structure.

#### Identify the model

What authorization model does this application use?

- **Role-based (RBAC):** Users have roles (admin, user, viewer)
- **Permission-based:** Users have specific permissions
- **Attribute-based (ABAC):** Access based on user/resource attributes
- **Row-level security (RLS):** Database enforces access
- **Custom:** Application-level checks

#### Document the roles/permissions

| Role/Permission | Description     | Who has it | How assigned |
| --------------- | --------------- | ---------- | ------------ |
| admin           | Full access     | ?          | ?            |
| user            | Standard access | ?          | ?            |
| ...             | ...             | ...        | ...          |

#### Verify role assignment

- [ ] Role assignment requires privileged access
- [ ] Role changes are logged
- [ ] Default role for new users is least-privilege

### Phase 6 — Route Protection

Verify that protected routes are actually protected.

#### Route inventory

List all routes and their protection status:

| Route         | Requires auth? | Requires role? | Actually enforced? |
| ------------- | -------------- | -------------- | ------------------ |
| /             | No             | No             | N/A                |
| /dashboard    | Yes            | No             | Verify             |
| /admin        | Yes            | admin          | Verify             |
| /api/users    | Yes            | No             | Verify             |
| /api/admin/\* | Yes            | admin          | Verify             |
| ...           | ...            | ...            | ...                |

#### Test route protection

For each protected route, on the local or staging target only:

1. **Unauthenticated access:** What happens if you access without a session?
2. **Wrong role access:** What happens if a regular user accesses admin routes?
3. **Direct API access:** Can you bypass UI protection by calling APIs directly?

#### Common bypass patterns

Check for:

- [ ] No middleware on new API routes
- [ ] Client-side only protection (server doesn't check)
- [ ] Inconsistent protection (some admin routes protected, others not)
- [ ] Parameter manipulation bypass (changing role in request)

### Phase 7 — Resource-Level Access Control

Route protection is not enough — verify access control on individual resources.

#### IDOR testing (Insecure Direct Object Reference)

Test, on the local or staging target with two test accounts: "If I change the ID in a request, can I access another user's data?"

| Resource     | Endpoint        | Access control | IDOR test result |
| ------------ | --------------- | -------------- | ---------------- |
| User profile | /api/users/:id  | ?              | Pass/Fail        |
| Orders       | /api/orders/:id | ?              | Pass/Fail        |
| Documents    | /api/docs/:id   | ?              | Pass/Fail        |

#### RLS verification (if using database RLS)

- [ ] RLS policies are enabled on sensitive tables
- [ ] RLS policies correctly filter by user ID
- [ ] Service role bypasses are intentional and limited

#### Data leakage

- [ ] API responses don't include data the user shouldn't see
- [ ] Error messages don't leak resource existence
- [ ] List endpoints are scoped appropriately

### Phase 8 — OAuth and SSO

If OAuth/SSO is used, verify secure configuration.

#### OAuth providers

| Provider | Enabled | Scopes requested | Account linking behavior |
| -------- | ------- | ---------------- | ------------------------ |
| Google   | ?       | email, profile   | ?                        |
| GitHub   | ?       | ?                | ?                        |
| ...      | ...     | ...              | ...                      |

#### OAuth security

- [ ] Only necessary scopes are requested
- [ ] OAuth state parameter is used (CSRF protection)
- [ ] Account linking is secure (can't hijack via OAuth)
- [ ] OAuth client secrets are rotated periodically

### Phase 9 — Severity Classification

#### Critical findings

- Authentication bypass (login without credentials)
- Authorization bypass (access admin as user)
- Session hijacking vulnerability
- Missing authentication on sensitive endpoints
- IDOR on sensitive data

#### High-risk findings

- No brute-force protection
- Session lifetime longer than my declared policy, or sessions with no expiry or no server-side invalidation contrary to the cited guidance
- MFA not available or not enforced for admins
- Inconsistent route protection

#### Medium-risk findings

- No inactivity timeout
- Missing security cookie flags
- OAuth scopes broader than necessary
- No session revocation capability

### Phase 10 — Output Format

Produce a Markdown document with:

1. **Executive Summary** — Key stats and critical issues
   - Auth provider: X
   - Brute-force protection: Enabled/Disabled
   - MFA status: Available/Required/Not available
   - Authorization model: RBAC/RLS/etc.
   - Critical gaps: X

2. **Authentication Surfaces** — Complete inventory

3. **Session Configuration** — Current values compared with my policy, any gap against the cited guidance with its source, and every POLICY NOT SET value listed as a decision for me

4. **Brute-Force Protection** — Status and gaps

5. **MFA Status** — Configuration and enforcement

6. **Authorization Model** — How access is controlled

7. **Route Protection** — What's protected and what's not

8. **Resource-Level Access** — IDOR and RLS findings

9. **Critical Findings** — Must fix immediately

10. **High-Risk Findings** — Must fix soon

11. **Remediation Roadmap** — Prioritised actions

### Important rules for the auditor

- Do NOT assume middleware is applied — verify each route
- Do NOT skip IDOR testing — it's the most common authz bug
- Do NOT trust UI-based protection — always test API directly
- Test with actual requests, not just code review — on the local or staging target only; if none is named, mark the check UNKNOWN and write the test
- Flag any "unclear" authorization as a finding
- Verify auth provider configuration from the export or screenshots I attached (or the dashboard only if I gave you access), not just code
- Never treat a number from a guide, a provider default or your own judgement as my policy; report missing policy as POLICY NOT SET
- Never treat my policy as overriding a requirement from the cited guidance; report the gap and its source
- Never include passwords, secret keys or session tokens in the report

**END OF AGENT INSTRUCTION — Authentication & Authorization Audit.** Evidence the person attached may follow below this line.

## After the run: reading the report

**Reading UNKNOWN.** UNKNOWN means the agent did not have the evidence to decide, not that the check passed. For each one, the report should say what evidence would settle it. Collect it — usually a dashboard export, a screenshot or a check in your own browser — and either decide the item yourself or give the evidence to a fresh session with the same instruction for that section. A "policy not set" result is different: it is a decision only you can make. Choose and record the value, then check the setting against it.

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
