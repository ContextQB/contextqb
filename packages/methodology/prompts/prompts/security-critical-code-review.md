---
id: security-critical-code-review
title: Security-Critical Code Review
summary: A code review prompt specifically for security-sensitive changes — authentication, authorization, secrets handling, input validation, and data access.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 5
journey_rank: 10
use_case: |
  When reviewing code that touches authentication, authorization, secrets, user input handling, data access, or any security-relevant area. Use before merging PRs that modify these critical paths.
variables:
  - SCOPE_PATH
  - CHANGE_DESCRIPTION
expected_output: |
  A structured security review of the code changes with pass/fail verdicts on critical checks, specific vulnerabilities identified, and a merge recommendation.
quality_standard: |
  Every finding must reference specific lines of code. Generic advice is not acceptable. The review must produce a clear merge/block recommendation with justification.
related:
  - untrusted-by-default
  - trust-boundaries-are-architecture
  - ai-output-is-untrusted-code
tags:
  - security
---

# Security-Critical Code Review

This prompt is for reviewing code that touches security-sensitive areas. It's more focused than [Think Like an Attacker](/prompts/think-like-an-attacker) — instead of broad adversarial thinking, it runs a specific checklist for common security mistakes in critical code paths.

Use it when reviewing changes to authentication, authorization, secrets handling, input validation, or data access.

## The prompt

```text
You are performing a security-focused code review of the following changes: {{SCOPE_PATH}}

{{#if CHANGE_DESCRIPTION}}
Change description: {{CHANGE_DESCRIPTION}}
{{/if}}

Your task is to review this code specifically for security implications. This is NOT a style review or a functional review — focus only on security.

## Checklist review

For each applicable category, mark PASS, FAIL, or N/A:

### Authentication (if login/session code is touched)
- [ ] **Brute-force protection** — Are failed attempts rate-limited?
- [ ] **Credential storage** — Are passwords hashed (not encrypted or plaintext)?
- [ ] **Session security** — Are tokens httpOnly, secure, appropriate lifetime?
- [ ] **Logout completeness** — Does logout actually invalidate the session?

### Authorization (if access control is touched)
- [ ] **Check is server-side** — Is authorization verified on the server, not just client?
- [ ] **Check is on the right object** — Does it verify THIS user can access THIS resource?
- [ ] **Check cannot be bypassed** — Is there no path around the authorization check?
- [ ] **Failure is handled** — Does authorization failure return appropriate error (not crash)?

### Input handling (if user input is processed)
- [ ] **Validation exists** — Is input validated before use?
- [ ] **Validation is server-side** — Not just client-side validation?
- [ ] **Type coercion is safe** — No unexpected type conversions?
- [ ] **Output is sanitised** — If input is rendered, is it escaped?

### Secrets (if credentials or keys are touched)
- [ ] **Not hardcoded** — Secrets come from environment, not code?
- [ ] **Not logged** — Secrets are not included in log output?
- [ ] **Scoped appropriately** — Minimal permissions for the use case?
- [ ] **Not exposed** — Secrets don't appear in responses or errors?

### Data access (if database or storage is touched)
- [ ] **Queries are parameterised** — No string concatenation with user input?
- [ ] **Access is scoped** — Only accessing data this user should see?
- [ ] **Deletion is intentional** — Delete operations have appropriate guards?
- [ ] **Sensitive data is protected** — PII/financial data has appropriate handling?

### Error handling (if errors are possible)
- [ ] **Errors don't leak info** — No stack traces, paths, or internal details in errors?
- [ ] **Errors are consistent** — No enumeration via different error responses?
- [ ] **Failures are logged** — Security-relevant failures are recorded?

## Specific vulnerability scan

Look for these specific issues:

1. **SQL/NoSQL injection** — User input in queries without parameterisation
2. **XSS (Cross-Site Scripting)** — User input rendered without escaping
3. **IDOR (Insecure Direct Object Reference)** — ID parameter not validated against user
4. **Path traversal** — File paths constructed from user input
5. **SSRF (Server-Side Request Forgery)** — URLs constructed from user input
6. **Secret exposure** — API keys, tokens, or passwords in code or logs
7. **Missing authentication** — Sensitive endpoint without auth check
8. **Missing authorization** — Auth present but no per-resource check
9. **Mass assignment** — Object properties set directly from user input
10. **Race conditions** — Time-of-check vs time-of-use vulnerabilities

For each vulnerability found:
- **Line reference** — Specific file and line
- **Issue** — What's wrong
- **Exploitation** — How it could be abused
- **Fix** — Specific remediation

## Merge decision

Based on your review, provide:

**Verdict:** APPROVE / REQUEST CHANGES / BLOCK

**Justification:**
- If APPROVE: Summarise why the code is secure
- If REQUEST CHANGES: List required changes before approval
- If BLOCK: Explain the critical issue that prevents merge

**Confidence:** High / Medium / Low (and why)
```

## When to use this

- Before merging any PR that modifies authentication or login code
- Before merging any PR that changes authorization or access control
- Before merging any PR that handles secrets or API keys
- Before merging any PR that processes user input (forms, APIs, file uploads)
- Before merging any PR that accesses sensitive data
- When agent-generated code touches any of the above

## What to do with the output

1. **BLOCK** — Do not merge. Fix the critical issue first.
2. **REQUEST CHANGES** — Address the listed issues, then re-review.
3. **APPROVE** — Safe to merge.

If confidence is "Low," consider requesting a second review or doing manual testing.

## Example output

```markdown
## Checklist Review

### Authorization

- [x] **Check is server-side** — PASS: Authorization in `api/orders/[id]/route.ts:15`
- [ ] **Check is on the right object** — FAIL: Line 18 checks if user is logged in, but doesn't verify they own this order
- [x] **Check cannot be bypassed** — PASS: Middleware applies to all routes
- [x] **Failure is handled** — PASS: Returns 403

### Input handling

- [x] **Validation exists** — PASS: Zod schema at line 8
- [x] **Validation is server-side** — PASS
- [x] **Type coercion is safe** — PASS
- [x] **Output is sanitised** — N/A: JSON response only

## Vulnerability Found

### IDOR in Order Access

**Line:** `api/orders/[id]/route.ts:18`  
**Issue:** Checks `if (!user)` but doesn't check `if (order.userId !== user.id)`  
**Exploitation:** Any authenticated user can access any order by changing the ID parameter  
**Fix:** Add ownership check: `if (order.userId !== session.user.id) return new Response('Forbidden', { status: 403 })`

## Merge Decision

**Verdict:** REQUEST CHANGES

**Justification:** The IDOR vulnerability allows any logged-in user to view any other user's orders. This is a high-severity authorization bypass.

**Required changes:**

1. Add ownership verification at line 18

**Confidence:** High — the vulnerability is clear and the fix is straightforward.
```

## See also

- [Prompt: Think Like an Attacker](contextqb://prompts/think-like-an-attacker) — broader adversarial analysis
- [Principle: Untrusted by Default](contextqb://principles/untrusted-by-default) — input handling mental model
- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code) — why agent code needs review
- [Playbook: Review a New Feature for Security Implications](contextqb://playbooks/review-a-new-feature-for-security-implications) — feature-level review
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — comprehensive security audit
