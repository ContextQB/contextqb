---
id: public-endpoint-exposure
title: Public Endpoint Exposure Audit
summary: A focused security audit of every URL reachable from the internet — routes, APIs, webhooks, and static assets. Verify each is intentionally public with appropriate protection.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 7
journey_rank: 0
objective: |
  Produce a complete inventory of every public endpoint in the application. For each, verify it is intentionally public and has appropriate protection (rate limiting, input validation, etc.).
scope: |
  All URLs reachable from the internet without authentication: public pages, public APIs, webhooks, health checks, static files, and any "accidentally public" endpoints.
required_sections:
  - Executive summary
  - Public route inventory
  - Webhook inventory
  - Static asset review
  - Rate limiting status
  - Input validation status
  - Information disclosure
  - Intentionality assessment
  - Critical findings
  - High-risk findings
  - Remediation roadmap
evaluation_criteria:
  - Every public endpoint is documented and intentionally public.
  - No authenticated endpoints are accidentally exposed.
  - Every public endpoint accepting input has server-side validation.
  - Every public endpoint has rate limiting.
  - No debug, test, or admin endpoints are publicly accessible.
deliverables:
  - A single Markdown document with all required sections.
  - A complete public endpoint inventory.
  - A prioritised remediation roadmap.
related:
  - public-endpoints-are-battlegrounds
  - untrusted-by-default
  - trust-boundaries-are-architecture
tags:
  - security
---

# Public Endpoint Exposure Audit

This audit inventories every URL reachable from the internet and verifies each is intentionally exposed with appropriate protection. It's designed for applications deployed to managed platforms where "public by default" is common.

## Use this as an agent instruction

> You are performing a professional security audit focused on public endpoint exposure.
>
> Your task is NOT to explain web security concepts. Your task is to:
>
> 1. Discover EVERY URL that is reachable without authentication
> 2. Verify each endpoint is intentionally public
> 3. Assess protection status (rate limiting, validation)
> 4. Identify debug, test, or admin endpoints that should not be public
>
> You must produce a complete inventory with evidence, not a checklist of best practices.

---

## Phase 1 — Public Endpoint Discovery

Find every URL reachable from the internet.

### Route scanning

Search the codebase for:

- All defined routes (pages, API routes, handlers)
- Routes without authentication middleware
- Wildcard routes that may expose unexpected paths

For each route, determine:

| Route          | Auth required? | Accepts input? | Purpose         |
| -------------- | -------------- | -------------- | --------------- |
| /              | No             | No             | Homepage        |
| /api/health    | No             | No             | Status check    |
| /api/contact   | No             | Yes            | Form submission |
| /api/users/:id | Yes            | Yes            | User data       |
| ...            | ...            | ...            | ...             |

Filter to public-only (Auth required = No).

### Framework-specific discovery

**Next.js:**

- `app/` directory routes without middleware
- `pages/api/` routes without auth checks
- Static exports in `public/`

**Cloudflare Workers:**

- Routes in `wrangler.jsonc`
- Routes without auth in handler code

### Subdomain discovery

Check for:

- Production domain (example.com)
- Staging/preview (staging.example.com, \*.vercel.app)
- API subdomain (api.example.com)
- Forgotten subdomains (old.example.com)

Tools: Check DNS records, certificate transparency logs, or simply try common subdomains.

---

## Phase 2 — Webhook Inventory

Webhooks are often overlooked public endpoints.

### Find all webhooks

Search for:

- Routes containing "webhook" or "hook"
- Routes that accept POST from third parties
- Stripe, Clerk, GitHub, or other provider webhooks

### Webhook audit

For each webhook:

| Webhook              | Provider | Signature verified? | Replay protected? |
| -------------------- | -------- | ------------------- | ----------------- |
| /api/webhooks/stripe | Stripe   | ?                   | ?                 |
| /api/webhooks/clerk  | Clerk    | ?                   | ?                 |
| /api/webhooks/github | GitHub   | ?                   | ?                 |

### Webhook verification checklist

- [ ] Signature is verified before processing
- [ ] Signature verification uses the correct secret
- [ ] Webhook responds correctly to verification challenges
- [ ] Replay attacks are prevented (timestamp checking)
- [ ] Failed verification is logged but not detailed to caller

---

## Phase 3 — Static Asset Review

Public files can leak information.

### Inventory public files

Check:

- `/public/` directory contents
- Bundled assets (`/_next/`, `/assets/`)
- Source maps (should not be public in production)
- Configuration files accidentally exposed

### Information disclosure

Look for:

- [ ] No source maps in production
- [ ] No `.env.example` with real values
- [ ] No `robots.txt` revealing private paths
- [ ] No `sitemap.xml` exposing internal routes
- [ ] No backup files (.bak, .old, .swp)
- [ ] No version control files (.git exposed)

---

## Phase 4 — Rate Limiting Assessment

Every public endpoint should have rate limiting.

### Rate limit inventory

For each public endpoint:

| Endpoint     | Rate limited? | Limit | Enforcement |
| ------------ | ------------- | ----- | ----------- |
| /api/contact | ?             | ?     | ?           |
| /api/search  | ?             | ?     | ?           |
| /api/health  | ?             | ?     | ?           |

### Rate limit testing

For each endpoint accepting input:

1. Send 100 requests in 10 seconds
2. Check if any limiting occurs
3. Check response behavior (429? Degraded? Nothing?)

### Priority endpoints

These MUST have rate limiting:

- Form submission endpoints
- Search/query endpoints
- Any endpoint that triggers email/SMS
- Any endpoint that writes to database
- File upload endpoints

---

## Phase 5 — Input Validation Assessment

Every public endpoint accepting input must validate it.

### Input inventory

For each endpoint that accepts user input:

| Endpoint     | Input type   | Validation   | Server-side? |
| ------------ | ------------ | ------------ | ------------ |
| /api/contact | JSON body    | Email format | ?            |
| /api/search  | Query params | Length limit | ?            |
| /api/upload  | File         | Type + size  | ?            |

### Validation testing

For each input:

- [ ] Empty input is handled gracefully
- [ ] Malformed input is rejected
- [ ] Oversized input is rejected
- [ ] Type mismatches are handled
- [ ] Validation happens server-side (not just client)

### Injection testing

Test for basic injection on text inputs:

- SQL injection: `' OR '1'='1`
- XSS: `<script>alert(1)</script>`
- Path traversal: `../../../etc/passwd`

Document any that pass through without validation.

---

## Phase 6 — Intentionality Assessment

Determine if each public endpoint is intentionally public.

### Intentionality matrix

| Endpoint    | Appears intentional? | Evidence             | Risk if wrong |
| ----------- | -------------------- | -------------------- | ------------- |
| /           | Yes                  | Homepage             | Low           |
| /api/health | Maybe                | No auth              | Low           |
| /api/users  | No                   | Should be protected  | High          |
| /debug      | No                   | Development artifact | Critical      |

### Suspect endpoints

Flag these as likely unintentional:

- `/debug`, `/test`, `/dev`
- `/admin` (without auth)
- `/api/internal/*`
- Any endpoint returning detailed errors
- Any endpoint exposing environment variables

### Verification

For each suspect endpoint:

1. Check if it appears in documentation
2. Check if it has any protection
3. Ask: "Would we be okay if anyone used this?"

---

## Phase 7 — Information Disclosure Assessment

Public endpoints should not leak internal information.

### Error message review

- [ ] Errors return generic messages, not stack traces
- [ ] Errors don't reveal internal paths
- [ ] Errors don't reveal database structure
- [ ] 404s don't leak existence of private routes

### Response header review

- [ ] Server version headers are suppressed
- [ ] Framework-identifying headers are suppressed
- [ ] No unnecessary headers leaking tech stack

### Content review

- [ ] Public pages don't include internal URLs
- [ ] Public APIs don't include internal fields
- [ ] No internal user IDs or system IDs exposed

---

## Phase 8 — Severity Classification

### Critical findings

- Admin or debug endpoints publicly accessible
- Authenticated endpoints with missing middleware
- Webhooks without signature verification
- Endpoints leaking secrets or credentials

### High-risk findings

- No rate limiting on form/query endpoints
- Missing input validation on public inputs
- Predictable patterns exposing internal routes
- Source maps in production

### Medium-risk findings

- Information disclosure via error messages
- Missing rate limiting on health checks
- Verbose headers revealing tech stack
- Backup files accessible

---

## Phase 9 — Output Format

Produce a Markdown document with:

1. **Executive Summary**
   - Total public endpoints: X
   - Unintentionally public: X
   - Missing rate limiting: X
   - Missing validation: X

2. **Public Route Inventory** — Complete table

3. **Webhook Inventory** — All webhooks with verification status

4. **Static Asset Review** — Public files and concerns

5. **Rate Limiting Status** — Coverage and gaps

6. **Input Validation Status** — Coverage and gaps

7. **Information Disclosure** — What's leaking

8. **Intentionality Assessment** — What shouldn't be public

9. **Critical Findings** — Must fix now

10. **High-Risk Findings** — Must fix soon

11. **Remediation Roadmap** — Prioritised actions

---

## Important rules for the auditor

- Do NOT assume an endpoint is protected — verify it
- Do NOT skip subdomains — they often have weaker protection
- Do NOT ignore static assets — information leaks there
- Test actual requests, not just code paths
- Treat every unprotected endpoint as a finding until confirmed intentional
- Document what information each public endpoint exposes

---

## How to consume the output

1. **Remove or protect any unintentionally public endpoints.** These are critical.
2. **Add rate limiting** to all endpoints accepting input.
3. **Add validation** to all inputs.
4. **Enable webhook signature verification** where missing.
5. **Remove source maps and debug endpoints** from production.
6. **Update your attack surface inventory** with the findings.

---

## See also

- [Principle: Public Endpoints Are Battlegrounds](contextqb://principles/public-endpoints-are-battlegrounds) — the threat model
- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — broader inventory process
- [Audit: Authentication & Authorization](contextqb://audits/authentication-and-authorization) — companion audit for protected endpoints
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — comprehensive audit
