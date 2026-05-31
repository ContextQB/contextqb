---
id: review-a-new-feature-for-security-implications
title: Review a New Feature for Security Implications
summary: Before shipping a feature, walk through a structured checklist to identify security implications — new attack surfaces, data exposure, authentication gaps, and agent risks.
version: 0.1.0
problem: |
  Features ship fast, security review happens slow (or never). By the time you realize a feature created a security gap, it's in production and customers are using it.
when_to_use: |
  Before merging or deploying any feature that touches data, auth, public endpoints, AI integrations, or third-party services.
expected_outputs:
  - A security implications checklist for the feature.
  - List of mitigations applied or needed.
  - Decision to ship, ship with caveats, or block.
audience:
  - novice-builder
  - founder
  - operator
  - developer
journey_stage: 5
journey_rank: 40
related_principles:
  - untrusted-by-default
  - trust-boundaries-are-architecture
  - public-endpoints-are-battlegrounds
tags:
  - security
---

# Review a New Feature for Security Implications

**Plain language:** Before you ship a new feature, take 15 minutes to think like an attacker. What new doors did you open? What data can be accessed? What happens if someone tries to abuse this? Catch the problems before they're in production.

## When to use this

- Before merging a PR that adds new functionality
- Before deploying a feature to production
- When reviewing someone else's feature (code review with security lens)
- After an agent implemented a feature (verify it didn't introduce risks)
- When you're not sure if a feature has security implications (it probably does)

## What you'll produce

1. A **security checklist** for the specific feature
2. **Mitigations applied** (what you already did)
3. **Mitigations needed** (what you should do before shipping)
4. **Ship decision** (go / go-with-caveats / block)

## Before you start

You'll need:

- The feature code or PR to review
- Understanding of what the feature does
- Access to test/preview the feature if possible

Time estimate: 15-30 minutes for typical features, longer for complex ones.

## Steps

### Step 1 — Understand the feature

Before looking for problems, understand what the feature does:

- **What's the user story?** Who uses this and why?
- **What data does it touch?** Read, write, delete?
- **What services does it call?** External APIs, databases, AI providers?
- **What's the happy path?** How is it supposed to work?

Write a one-sentence summary: "This feature lets [who] do [what] by [how]."

### Step 2 — Check for new attack surfaces

**Does this feature create new public endpoints?**

- [ ] New API routes — Are they authenticated?
- [ ] New pages — Do they require login?
- [ ] New webhooks — Do they verify sender?
- [ ] New file uploads — What's allowed?

For each new endpoint:

| Endpoint            | Requires auth? | Rate limited? | Input validated? |
| ------------------- | -------------- | ------------- | ---------------- |
| /api/feature/action | Yes            | No            | Partial          |

**If any answers are "No" or "Partial," that's a finding.**

### Step 3 — Check for data exposure

**What data does this feature access?**

- [ ] Does it read user data? Which fields?
- [ ] Does it expose data in responses? To whom?
- [ ] Does it write or modify data? Who can trigger writes?
- [ ] Does it delete data? Is deletion reversible?

**Data exposure questions:**

| Data           | Who can access?       | Should they?     | Oversharing?   |
| -------------- | --------------------- | ---------------- | -------------- |
| User emails    | Any logged-in user    | No — only admins | Yes — fix it   |
| Order history  | The order's owner     | Yes              | No             |
| All users list | API returns to anyone | No               | Yes — add auth |

**If data is accessible to anyone who shouldn't see it, that's a finding.**

### Step 4 — Check authentication and authorization

**Who should be able to use this feature?**

- [ ] Is authentication enforced?
- [ ] Is authorization checked? (Right user, right role, right resource?)
- [ ] Are there bypass paths? (Direct URL, API call, etc.)

**Common authorization gaps:**

- User A can access User B's data via predictable IDs
- Unauthenticated users can reach authenticated-only features via direct URL
- Users can perform admin actions without admin role

**Test:** "If I change the user ID in this request, do I get someone else's data?"

### Step 5 — Check input handling

**What user input does this feature accept?**

- [ ] Form fields — validated server-side?
- [ ] Query parameters — validated?
- [ ] File uploads — type/size restricted?
- [ ] Rich text / HTML — sanitized?

For each input:

| Input   | Type   | Validation         | Concerns               |
| ------- | ------ | ------------------ | ---------------------- |
| user_id | UUID   | Regex check        | Good                   |
| comment | Text   | None               | XSS risk if rendered   |
| file    | Upload | No extension check | Executable upload risk |

**If input is not validated server-side, that's a finding.**

### Step 6 — Check for AI/agent risks

**Does this feature involve AI?**

- [ ] Does user input go into prompts? (Prompt injection risk)
- [ ] Does AI output get rendered? (XSS via AI)
- [ ] Does AI output trigger actions? (Privilege escalation via AI)
- [ ] Does AI see sensitive data?

**Key questions:**

| AI interaction          | What could go wrong?     | Mitigation                   |
| ----------------------- | ------------------------ | ---------------------------- |
| User question → prompt  | Prompt injection         | Sanitize, use system prompts |
| AI response → displayed | XSS if HTML in output    | Escape output                |
| AI response → executed  | Arbitrary code execution | Review before execute        |

### Step 7 — Check for secrets and credentials

**Does this feature use or create secrets?**

- [ ] New API keys needed?
- [ ] Credentials stored or passed?
- [ ] Secrets exposed in logs or responses?
- [ ] New third-party integration with credentials?

**If secrets are involved, verify:**

- Stored in secrets manager (not code)
- Scoped appropriately
- Added to secrets inventory

### Step 8 — Think like an attacker

Spend 5 minutes asking: "How would I abuse this?"

**Common attack patterns:**

- **Enumeration:** Can I discover valid user IDs, emails, or resources?
- **IDOR:** Can I access resources I shouldn't by changing IDs?
- **Injection:** Can I put SQL, HTML, or commands in inputs?
- **Rate abuse:** Can I spam this endpoint?
- **Logic bypass:** Can I skip steps or checks?
- **Privilege escalation:** Can I do admin things as a regular user?

Write down anything that comes to mind, even if it seems unlikely.

### Step 9 — Document and decide

Compile your findings:

```markdown
## Security Review: [Feature Name]

**Date:** [Today]
**Reviewer:** [You]

### Summary

[One sentence feature description]

### New attack surfaces

- [Endpoint] — [Status]

### Data exposure

- [Finding or "None identified"]

### Auth/authz gaps

- [Finding or "None identified"]

### Input validation

- [Finding or "All inputs validated"]

### AI risks

- [Finding or "No AI involvement"]

### Secrets

- [Finding or "No new secrets"]

### Attacker perspective

- [Any attack scenarios identified]

### Mitigations applied

- [What was already done]

### Mitigations needed before ship

- [ ] [Action item]

### Ship decision

- [ ] Go — No blockers
- [ ] Go with caveats — [List caveats]
- [ ] Block — Must fix [blockers] first
```

### Step 10 — Apply mitigations or block

If mitigations are needed:

1. Fix them before shipping, OR
2. Document accepted risks with rationale and review date, OR
3. Block the feature until fixed

**Do not ship with "we'll fix it later" unless there's a concrete plan with a deadline.**

## Common mistakes

- **Skipping this for "small" features.** Small features often create the biggest gaps.
- **Only reviewing the happy path.** Attackers don't use the happy path.
- **Trusting the frontend.** All validation must be server-side.
- **Assuming auth middleware catches everything.** Check that it's actually applied to new routes.
- **Forgetting about logs.** Logs often leak sensitive data.

## What "good enough" looks like

Your security review is good enough when:

- [ ] You understand what the feature does
- [ ] You've checked all new endpoints for auth
- [ ] You've verified no data oversharing
- [ ] You've confirmed input validation exists
- [ ] You've considered AI risks (if applicable)
- [ ] You've thought like an attacker for 5 minutes
- [ ] You have a clear ship decision

## When to do this again

- Every feature, every time
- Re-review if feature scope changes
- Re-review after significant modifications to the feature

## See also

- [Principle: Untrusted by Default](contextqb://principles/untrusted-by-default) — the mindset for input handling
- [Principle: Trust Boundaries Are Architecture](contextqb://principles/trust-boundaries-are-architecture) — where to enforce security
- [Playbook: Review Your AI Integration](contextqb://playbooks/review-your-ai-integration) — deeper dive on AI risks
- [Prompt: Security-Critical Code Review](contextqb://prompts/security-critical-code-review) — review prompt for code changes
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — comprehensive security audit
