---
id: harden-your-authentication
title: Harden Your Authentication
summary: Walk through your login, signup, and session management and apply baseline security hardening — rate limiting, brute-force protection, session hygiene, and secure defaults.
version: 0.2.0
problem: |
  Authentication is the front door to your application. If it's weak, nothing else matters. Most applications ship with default settings that are functional but not secure.
when_to_use: |
  Before launch, after adding authentication to a new feature, or when you haven't reviewed auth security in the last quarter.
expected_outputs:
  - A checklist of authentication hardening measures with current status.
  - Configuration changes applied to your auth provider.
  - Documentation of your session policy.
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 5
journey_rank: 10
related_principles:
  - public-endpoints-are-battlegrounds
  - trust-boundaries-are-architecture
  - untrusted-by-default
tags:
  - security
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-07 renewal B7 (0.2.0; author self-checked; independent review pending; not operator-accepted): the nine vendor dashboard paths are removed from the body; each step names the kind of setting to look for and points to the provider's own documentation, and the auth-provider-settings reference is described as unverified (candidate settings only), so no path is presented as checked; numeric values are labelled tier-dependent starting points to choose and record, compared with the dated security-defaults reference; the incorrect 'NIST recommends 8+' line is replaced with a pointer to that reference, which records NIST's current distinction between passwords used alone and with MFA; passkeys (WebAuthn) are added as the phishing-resistant MFA option; authenticator apps are labelled examples; failed-login tests run on a staging copy with a test account; provider names become categories. Earlier notes (2026-09-09 epistemology review): R3, R4, R6, R7 pass; R8 pending P4. The F-06 and F-09 items once listed as open are closed by this revision (links declared; dashboard paths removed from the lesson)."
related:
  - authentication-and-authorization
  - map-your-attack-surface
  - detect-security-drift
  - pre-launch-security
---

# Harden Your Authentication

**Plain language:** Your login page is under constant attack. This playbook helps you check that you have the basics in place — rate limiting so attackers can't guess passwords forever, session timeouts so stolen cookies expire, and secure defaults so common attacks don't work.

## When to use this

- You're preparing to launch and want to verify auth is secure
- You added authentication to a new feature or service
- You haven't reviewed your auth configuration in the last quarter
- You just migrated to a new auth provider
- You've had suspicious login activity (failed attempts, unusual patterns)
- A security audit is coming up

## What you'll produce

1. A **hardening checklist** showing what's configured and what's missing
2. **Configuration changes** applied to your auth provider
3. **Documentation** of your session and access policies

## Before you start

You'll need:

- Admin access to your auth provider dashboard
- Access to your codebase (to check how auth is implemented)
- A test account to verify changes don't break legitimate login

This playbook covers hosted authentication providers, framework auth libraries and custom implementations ([what common providers do](contextqb://references/tools#managed-services)). The concepts apply universally; the names and locations of settings vary by provider and change often, so each step names the kind of setting to look for — search your provider's documentation for it. ContextQB's [auth provider settings reference](contextqb://references/setup#auth-provider-settings) is marked unverified: it lists candidate settings only, and none of its dashboard paths has been checked. Published provider defaults and standards are in the dated [security defaults reference](contextqb://references/pricing#security-defaults).

**Test on a copy.** Steps 2, 4 and 5 suggest testing failed logins and weak passwords. Do that on a staging or local copy with a test account, not on production, where lockouts and alerts affect real users.

## Steps

### Step 1 — Inventory your authentication surfaces

List everywhere users authenticate:

| Surface        | URL/Path         | Provider        | Notes                 |
| -------------- | ---------------- | --------------- | --------------------- |
| Web login      | /sign-in         | Hosted provider | Primary user auth     |
| Web signup     | /sign-up         | Hosted provider | New user registration |
| Password reset | /forgot-password | Hosted provider | Recovery flow         |
| API key auth   | /api/\*          | Custom          | Machine access        |
| OAuth          | /sso/google      | Hosted provider | Social login          |
| Magic link     | Email            | Hosted provider | Passwordless option   |

Include any non-standard auth paths (admin login, API authentication, webhook auth).

### Step 2 — Check brute-force protection

**What to verify:**

- [ ] Login attempts are rate-limited
- [ ] Account lockout triggers after N failed attempts
- [ ] Lockout notification is sent to the account owner
- [ ] Rate limits apply per-IP and per-account

**Where to check:** your provider's attack-protection, brute-force or rate-limit settings; for a custom implementation, your rate-limiting middleware.

**Starting points, not rules.** Choose a lockout threshold, a lockout duration (increasing on repeat offenses is common) and a per-IP rate limit, and write them down. Compare them with the published standards and provider defaults in the [security defaults reference](contextqb://references/pricing#security-defaults) — for example, some providers lock after around ten failures by default, and standards bodies cap the number rather than prescribing one.

**What to do:**

1. Review current settings in your auth provider
2. Enable attack protection if it's off
3. Set reasonable lockout thresholds
4. On a staging or local copy, test by making failed login attempts with a test account (verify lockout triggers)

### Step 3 — Review session configuration

**What to verify:**

- [ ] Session timeout is appropriate for your use case
- [ ] Sessions expire on inactivity (not just absolute time)
- [ ] Session revocation is possible (logout everywhere)
- [ ] Sessions are bound to IP or device (if applicable)

**Where to check:** your provider's session settings (session lifetime, inactivity timeout, token expiry and rotation). Some providers' defaults keep sessions open until sign-out, and some session limits depend on the plan — see the [security defaults reference](contextqb://references/pricing#security-defaults).

**Illustrative starting points by tier** (ContextQB's suggestions, not a standard — adjust to your users and record what you choose):

| Use case        | Session lifetime | Inactivity timeout |
| --------------- | ---------------- | ------------------ |
| Public app      | 7 days           | 30 minutes         |
| Sensitive data  | 24 hours         | 15 minutes         |
| Admin dashboard | 4 hours          | 10 minutes         |
| Financial app   | 1 hour           | 5 minutes          |

**What to do:**

1. Match session lifetime to your security requirements
2. Enable inactivity timeout if available
3. Verify users can "sign out everywhere"
4. Test session expiry works as expected

### Step 4 — Enable multi-factor authentication

**What to verify:**

- [ ] MFA is available to users
- [ ] MFA is required for admin/privileged accounts
- [ ] MFA recovery process exists and is documented
- [ ] MFA options include TOTP (authenticator app), not just SMS

**Where to check:** your provider's multi-factor settings.

**Recommended settings:**

- Offer passkeys (WebAuthn) if your provider supports them — they resist phishing, because they only work on the real site
- Enable TOTP (authenticator apps — for example 1Password or Google Authenticator)
- Require MFA for admin accounts
- Make MFA optional but encouraged for regular users (consider requiring after X days)
- SMS MFA: available but not as the only option (SIM swapping risk)

**What to do:**

1. Enable MFA options in your provider
2. Require MFA for admin/privileged roles
3. Document the MFA recovery process
4. Test MFA setup and recovery flow

### Step 5 — Secure password policies

**What to verify:**

- [ ] Minimum password length enforced, following a published standard
- [ ] Weak/breached passwords rejected
- [ ] Password complexity is not overly restrictive (length > complexity)
- [ ] Password change requires current password

**Where to check:** your provider's password policy settings.

**Recommended settings:**

- Minimum length: follow a published standard. NIST's current guidance sets a higher minimum for a password used on its own than for one used with MFA — the current figures are in the [security defaults reference](contextqb://references/pricing#security-defaults).
- Breached password detection: ON (check against known leaked passwords)
- Complexity rules: Allow any characters, don't require symbols (encourages longer passwords)
- Password hints: Disabled

**What to do:**

1. Set the minimum length you chose from the standard, and record it in your auth policy
2. Enable breached password detection if available
3. Remove arbitrary complexity rules (symbols, uppercase) that encourage shorter passwords
4. On a staging or local copy, test that weak passwords are rejected

### Step 6 — Review OAuth/social login

**What to verify:**

- [ ] Only needed OAuth providers are enabled
- [ ] OAuth scopes are minimal (email, profile only)
- [ ] Account linking is secure (cannot hijack via OAuth)
- [ ] OAuth secrets are rotated periodically

**Where to check:** your provider's social login or SSO connection settings.

**What to do:**

1. Disable OAuth providers you don't use
2. Review requested scopes — request only what you need
3. Check account linking behavior (what happens if OAuth email matches existing account?)
4. Rotate OAuth client secrets on a schedule you choose and record (standards give no single interval — see the [security defaults reference](contextqb://references/pricing#security-defaults))

### Step 7 — Check secure cookie/token configuration

**What to verify:**

- [ ] Cookies are HttpOnly (not accessible via JavaScript)
- [ ] Cookies are Secure (HTTPS only)
- [ ] Cookies have SameSite attribute set appropriately
- [ ] JWTs expire appropriately and can be revoked

**Where to check:**

- Browser DevTools → Application → Cookies
- Your auth middleware configuration
- Auth provider documentation for token format

**Recommended settings:**

| Cookie attribute | Setting       | Why                                   |
| ---------------- | ------------- | ------------------------------------- |
| HttpOnly         | true          | Prevents XSS from stealing cookies    |
| Secure           | true          | Cookies only sent over HTTPS          |
| SameSite         | Lax or Strict | Prevents CSRF attacks                 |
| Domain           | Minimal scope | Limit which subdomains see the cookie |

**What to do:**

1. Inspect auth cookies in browser DevTools
2. Verify all three security attributes are present
3. If using JWTs, confirm they expire and document revocation process

### Step 8 — Document your auth policy

Create a short document covering:

```markdown
## Authentication Policy

### Session Configuration

- Session lifetime: [X days/hours]
- Inactivity timeout: [X minutes]
- Session revocation: [How users sign out everywhere]

### Password Policy

- Minimum length: [X characters]
- Breached password check: [Yes/No]
- Complexity requirements: [Describe]

### MFA Policy

- MFA available: [Yes/No]
- MFA required for: [Roles/conditions]
- MFA options: [TOTP, SMS, etc.]

### Lockout Policy

- Failed attempts before lockout: [N]
- Lockout duration: [X minutes]
- Lockout notification: [Yes/No]

### OAuth Configuration

- Enabled providers: [List]
- Account linking: [Describe behavior]
```

Store this in your architecture docs or alongside `AGENTS.md`.

## Common mistakes

- **Relying on provider defaults.** Most auth providers ship "functional" defaults, not "secure" defaults. Review everything.
- **No rate limiting on password reset.** Attackers enumerate valid emails via reset requests.
- **Session lifetime too long.** A stolen cookie from a coffee shop computer shouldn't work for 30 days.
- **SMS-only MFA.** SIM swapping is real. Offer TOTP as the primary option.
- **Not testing lockout.** You need to know lockout works before attackers find out it doesn't.
- **Forgetting API auth.** User auth is hardened, but API keys have no rate limits or expiry.

## What "good enough" looks like

Your authentication is hardened when:

- [ ] Brute-force protection is enabled and tested
- [ ] Session lifetime is appropriate for your data sensitivity
- [ ] MFA is available (required for admins)
- [ ] Password policy enforces minimum length and checks breached passwords
- [ ] Cookies have HttpOnly, Secure, and SameSite attributes
- [ ] OAuth scopes are minimal
- [ ] Auth policy is documented

## When to do this again

- After migrating auth providers
- After adding new auth features (new OAuth provider, API keys, etc.)
- Quarterly review of auth settings
- After any suspicious activity report
- Before security audits or compliance reviews

## See also

- [Principle: Public Endpoints Are Battlegrounds](contextqb://principles/public-endpoints-are-battlegrounds) — why auth pages are attacked
- [Principle: Trust Boundaries Are Architecture](contextqb://principles/trust-boundaries-are-architecture) — where auth fits in your security model
- [Audit: Authentication & Authorization](contextqb://audits/authentication-and-authorization) — have an agent review your auth implementation
- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — includes auth surface identification
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
