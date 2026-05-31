---
id: harden-your-authentication
title: Harden Your Authentication
summary: Walk through your login, signup, and session management and apply baseline security hardening — rate limiting, brute-force protection, session hygiene, and secure defaults.
version: 0.1.0
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
  - untrusted-by-default
  - trust-boundaries-are-architecture
tags:
  - security
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
2. **Configuration changes** applied to your auth provider (Clerk, Supabase Auth, Auth0, etc.)
3. **Documentation** of your session and access policies

## Before you start

You'll need:

- Admin access to your auth provider dashboard
- Access to your codebase (to check how auth is implemented)
- A test account to verify changes don't break legitimate login

Auth providers covered by this playbook: Clerk, Supabase Auth, Auth0, NextAuth, or custom implementations. The concepts apply universally; the specific settings vary.

## Steps

### Step 1 — Inventory your authentication surfaces

List everywhere users authenticate:

| Surface        | URL/Path         | Provider | Notes                 |
| -------------- | ---------------- | -------- | --------------------- |
| Web login      | /sign-in         | Clerk    | Primary user auth     |
| Web signup     | /sign-up         | Clerk    | New user registration |
| Password reset | /forgot-password | Clerk    | Recovery flow         |
| API key auth   | /api/\*          | Custom   | Machine access        |
| OAuth          | /sso/google      | Clerk    | Social login          |
| Magic link     | Email            | Clerk    | Passwordless option   |

Include any non-standard auth paths (admin login, API authentication, webhook auth).

### Step 2 — Check brute-force protection

**What to verify:**

- [ ] Login attempts are rate-limited
- [ ] Account lockout triggers after N failed attempts
- [ ] Lockout notification is sent to the account owner
- [ ] Rate limits apply per-IP and per-account

**Where to check:**

- **Clerk:** Session settings → Attack protection
- **Supabase Auth:** Project settings → Auth → Rate limits
- **Auth0:** Security → Attack protection
- **Custom:** Check your rate limiting middleware

**Recommended minimums:**

- Max 5-10 failed attempts before temporary lockout
- Lockout duration: 15-30 minutes (increasing on repeat offenses)
- Rate limit: 10-20 login requests per minute per IP

**What to do:**

1. Review current settings in your auth provider
2. Enable attack protection if it's off
3. Set reasonable lockout thresholds
4. Test by making failed login attempts (verify lockout triggers)

### Step 3 — Review session configuration

**What to verify:**

- [ ] Session timeout is appropriate for your use case
- [ ] Sessions expire on inactivity (not just absolute time)
- [ ] Session revocation is possible (logout everywhere)
- [ ] Sessions are bound to IP or device (if applicable)

**Where to check:**

- **Clerk:** Configure → Sessions → Session lifetime
- **Supabase Auth:** Project settings → Auth → JWT expiry
- **Auth0:** Applications → Your app → Settings → Rotation

**Recommended settings:**

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

**Where to check:**

- **Clerk:** Configure → Multi-factor → Enable options
- **Supabase Auth:** Project settings → Auth → MFA
- **Auth0:** Security → Multi-factor auth

**Recommended settings:**

- Enable TOTP (authenticator apps like 1Password, Google Authenticator)
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

- [ ] Minimum password length enforced (12+ characters)
- [ ] Weak/breached passwords rejected
- [ ] Password complexity is not overly restrictive (length > complexity)
- [ ] Password change requires current password

**Where to check:**

- **Clerk:** Configure → Passwords → Password settings
- **Supabase Auth:** Project settings → Auth → Password requirements
- **Auth0:** Authentication → Database → Password policy

**Recommended settings:**

- Minimum length: 12 characters (NIST recommends 8+, but 12 is better)
- Breached password detection: ON (check against known leaked passwords)
- Complexity rules: Allow any characters, don't require symbols (encourages longer passwords)
- Password hints: Disabled

**What to do:**

1. Set minimum length to 12 characters
2. Enable breached password detection if available
3. Remove arbitrary complexity rules (symbols, uppercase) that encourage shorter passwords
4. Test that weak passwords are rejected

### Step 6 — Review OAuth/social login

**What to verify:**

- [ ] Only needed OAuth providers are enabled
- [ ] OAuth scopes are minimal (email, profile only)
- [ ] Account linking is secure (cannot hijack via OAuth)
- [ ] OAuth secrets are rotated periodically

**Where to check:**

- **Clerk:** Configure → SSO connections
- **Supabase Auth:** Project settings → Auth → Providers
- **Auth0:** Authentication → Social

**What to do:**

1. Disable OAuth providers you don't use
2. Review requested scopes — request only what you need
3. Check account linking behavior (what happens if OAuth email matches existing account?)
4. Rotate OAuth client secrets annually

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
