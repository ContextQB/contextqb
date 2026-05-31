---
id: public-endpoints-are-battlegrounds
title: Public Endpoints Are Battlegrounds
summary: Every URL, API route, and webhook exposed to the internet is under constant attack. Assume they are being scanned, probed, and abused within hours of going live.
version: 0.1.0
category: security
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 7
journey_rank: 0
tags:
  - security
  - endpoints
  - api-security
related:
  - failure-modes
  - anti-spaghetti
  - untrusted-by-default
anti_patterns:
  - Admin endpoints protected only by an obscure URL.
  - API routes with no rate limiting.
  - Debug endpoints left enabled in production.
  - Webhooks that accept requests without verifying the sender.
  - Form handlers that process unlimited file uploads.
  - Authentication endpoints with no brute-force protection.
agent_instructions:
  - Every public endpoint must have explicit authentication or a documented reason for being unauthenticated.
  - Apply rate limiting to all endpoints, especially authentication and form submission.
  - Never rely on URL obscurity for security.
  - Remove or gate all debug, admin, and test endpoints before production deployment.
  - When adding a new endpoint, document its purpose, authentication requirements, and abuse potential.
---

# Public Endpoints Are Battlegrounds

**Plain language:** The moment you expose a URL to the internet, bots will find it and try to break it. Every API route, every form handler, every webhook you deploy is actively being probed for vulnerabilities. Design accordingly.

## What it is

A public endpoint is any URL that accepts requests from the internet — your marketing page, your login form, your API, your webhooks, your file upload handler. The moment that URL goes live, it enters a battlefield.

Automated scanners continuously sweep the internet looking for vulnerable endpoints. Common attack patterns include:

- **Credential stuffing** — trying leaked username/password combinations from other breaches
- **Brute force** — systematically guessing passwords on login endpoints
- **Injection probing** — sending SQL, shell commands, and path traversals to see what breaks
- **Enumeration** — discovering valid usernames, emails, or resource IDs through timing or error differences
- **Denial of service** — overwhelming endpoints with requests to exhaust resources
- **Webhook forgery** — sending fake webhook payloads to trigger actions in your system

This is not theoretical. Any endpoint exposed to the internet will receive automated attack traffic within hours. The question is not whether you will be attacked, but whether your endpoints are ready.

## Why it matters in agentic dev specifically

When you build with an AI agent, public endpoints become more dangerous in several ways:

1. **Agents ship faster than you can review.** An agent can generate and deploy an API route in minutes. If that route lacks authentication, rate limiting, or input validation, it is vulnerable before you notice.

2. **Agents copy patterns blindly.** If an agent sees one unauthenticated endpoint in your codebase, it may assume that is the pattern and create more. A single missing auth check becomes a template for future vulnerabilities.

3. **Agents do not understand exposure.** An agent does not inherently know that `/api/admin/users` is more sensitive than `/api/public/feed`. Without explicit instructions, it may apply the same (minimal) protections to both.

4. **Agents generate debug endpoints.** When troubleshooting, an agent might create a `/debug` or `/test` endpoint to inspect state. If that endpoint is not removed before deployment, it becomes an information disclosure vulnerability.

5. **Agents optimise for function, not defense.** The default AI implementation makes the feature work. It does not add rate limiting, CORS policies, or abuse detection unless you ask.

## Minimum acceptable posture

You can claim this principle if you meet all of the following:

1. **Every endpoint has explicit authentication or a documented exception.** Unauthenticated endpoints (public marketing pages, health checks, public APIs) are explicitly listed and justified. There are no "accidentally public" endpoints.

2. **Rate limiting is applied to all endpoints.** At minimum: authentication endpoints (login, password reset), form submissions, file uploads, and any endpoint that writes data. Use stricter limits on sensitive operations.

3. **No debug or admin endpoints in production.** Test routes, debug inspectors, and admin backdoors are either removed or gated behind production flags and strong authentication.

4. **Webhooks verify sender identity.** Every webhook endpoint validates signatures or uses secret tokens. Endpoints that cannot verify senders reject by default.

5. **Input validation happens at the boundary.** Every parameter — query strings, path params, request bodies — is validated before processing. Invalid input returns early with a generic error, not a stack trace.

6. **Error messages are opaque to attackers.** Failed authentication returns "invalid credentials," not "user not found" or "wrong password." Errors do not leak internal structure.

## Signals you're getting this wrong

- **You have URLs you do not remember creating.** If you cannot list every public endpoint in your system, some of them are unmonitored.

- **Your auth endpoints have no lockout.** If someone can try passwords indefinitely, your login form is a brute-force target.

- **Your error pages show stack traces.** If production errors display file paths, database schemas, or internal state, attackers are mapping your system.

- **Your webhooks process any request.** If your Stripe or GitHub webhook handler does not verify signatures, anyone can forge events.

- **You have `/test`, `/debug`, or `/admin` routes.** If these exist in production without strong gating, they are being scanned.

- **Your file upload accepts anything.** If users can upload executables, HTML files, or arbitrarily large files without restriction, your upload endpoint is an attack vector.

## How it relates to other ContextQB principles

**Failure Modes** — Attacks are failure modes. "Public Endpoints Are Battlegrounds" tells you to anticipate the attack; "Failure Modes" tells you to design what happens when the attack arrives — rate limit exceeded, account locked, request rejected.

**Anti-Spaghetti** — Spaghetti codebases make security harder. When endpoints are scattered across the codebase with inconsistent patterns, some will have auth and some will not. Clean architecture makes consistent security achievable.

**Untrusted by Default** — Public endpoints receive untrusted input by definition. Every request to a public endpoint should be treated as potentially hostile.

## See also

- [Playbook: Harden Your Authentication](contextqb://playbooks/harden-your-authentication) — operational steps to secure login and identity
- [Audit: Public Endpoint Exposure](contextqb://audits/public-endpoint-exposure) — structured review of your exposed attack surface
- [Audit: Authentication & Authorization](contextqb://audits/authentication-and-authorization) — systematic review of access controls
- [Principle: Trust Boundaries Are Architecture](contextqb://principles/trust-boundaries-are-architecture) — where you enforce security in code
- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — identifying all your exposure points
- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
