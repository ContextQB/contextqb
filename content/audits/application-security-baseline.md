---
id: application-security-baseline
title: Application Security Baseline Audit
summary: A full security audit tailored for a non-developer-built managed-services application. Discovers architecture, enumerates surfaces, audits each, and produces prioritised findings.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 5
objective: |
  Identify realistic security risks in an application built with agentic systems and deployed to managed services. Produce an actionable report the builder can act on without deep security expertise.
scope: |
  The entire application: public endpoints, authentication, agent capabilities, secrets, third-party integrations, and data handling. Infrastructure audits (containers, networks, self-hosting) are out of scope — this audit is for managed-services deployments.
required_sections:
  - Executive summary
  - Architecture overview
  - Attack surface inventory
  - Authentication and authorization
  - Secrets and credentials
  - Third-party integrations
  - AI and agent security
  - Data handling
  - Critical findings
  - High-risk findings
  - Medium-risk findings
  - Unknowns and assumptions
  - What I would attack first
  - Remediation roadmap
evaluation_criteria:
  - Every public endpoint has a documented protection status.
  - Every secret has a documented blast radius and rotation path.
  - Every third-party integration has a documented trust relationship.
  - Every AI/agent capability has documented boundaries.
  - Findings are prioritised by realistic exploitability, not theoretical severity.
  - Remediation steps are actionable by a non-developer.
deliverables:
  - A single Markdown document with all required sections.
  - A prioritised list of findings with severity ratings.
  - A remediation roadmap with clear next actions.
related:
  - untrusted-by-default
  - failure-modes
  - state-ownership
tags:
  - security
---

# Application Security Baseline Audit

This is a comprehensive security audit for applications built with agentic systems and deployed to managed services (Cloudflare, Vercel, Supabase, Clerk, etc.). It's designed to be run by an AI agent and produce a report a non-developer can understand and act on.

## Use this as an agent instruction

> You are performing a professional security audit of this application.
>
> Your task is NOT to provide generic security advice. Your task is to:
>
> 1. Discover the actual architecture by inspecting code and configuration
> 2. Identify all realistic attack surfaces specific to THIS application
> 3. Audit each surface systematically
> 4. Produce prioritised, actionable findings
>
> You must operate like a security engineer conducting a real audit — skeptical, evidence-based, and focused on realistic exploitability.

---

## Phase 1 — Architecture Discovery

First, discover and document the actual architecture. Do NOT assume — infer from code and configuration.

Inspect:

- **Framework and language** — What's the tech stack?
- **Deployment** — Where is this deployed? (Cloudflare Workers, Vercel, etc.)
- **Authentication** — How do users prove identity? (Clerk, Supabase Auth, custom)
- **Database** — Where does data live? (Supabase, Cloudflare D1, etc.)
- **Storage** — Where do files live? (R2, Supabase Storage, etc.)
- **Third-party services** — What external APIs does this call?
- **AI integrations** — Are there LLM calls, agents, or AI features?
- **Public endpoints** — What's reachable from the internet?
- **Background jobs** — Are there cron jobs, queues, or scheduled tasks?

Document the trust boundaries:

- What's public vs. authenticated vs. admin-only?
- What crosses from untrusted (user input) to trusted (database, internal APIs)?
- Where does AI-generated content enter the system?

Produce a **Threat Model Summary** before proceeding.

---

## Phase 2 — Attack Surface Inventory

Generate a tailored attack surface inventory for THIS application. Do NOT just copy OWASP — adapt to what actually exists here.

### Authentication surfaces

- Sign-in and sign-up flows
- Password reset and account recovery
- OAuth providers and scopes
- Session handling (duration, invalidation, cookie flags)
- API keys and service tokens
- Admin access paths

### Public endpoints

- Every route that doesn't require authentication
- Every route that accepts untrusted input
- Webhooks that receive external calls
- File upload endpoints
- Search and query endpoints

### AI and agent surfaces

- Every LLM or AI API call
- What data does the AI see?
- What can the AI do? (read-only? tool execution?)
- Where can user input influence AI behaviour?
- Does AI output get executed, rendered, or stored?

### Data surfaces

- Database tables with sensitive data
- File storage with user content
- Logs that might contain PII
- Analytics and telemetry

### Third-party surfaces

- Every external API this application calls
- What credentials does each require?
- What does the application trust each service with?

For each surface, document:

- What it is
- Why it exists
- How it could realistically be attacked
- Current protections (if any)

---

## Phase 3 — Systematic Audit

Now audit each surface. For each, determine:

- **PASS** — Evidence confirms this is secure
- **FAIL** — Evidence shows a vulnerability
- **PARTIAL** — Some protections exist but incomplete
- **UNKNOWN** — Cannot verify without more information

### Authentication checklist

- [ ] Password reset links expire appropriately
- [ ] Session tokens are httpOnly, secure, sameSite
- [ ] Sessions can be invalidated on password change
- [ ] MFA is available (and enforced for admin)
- [ ] OAuth scopes are minimal
- [ ] API keys have appropriate expiration

### Input validation checklist

- [ ] All user input is validated server-side
- [ ] File uploads are validated (type, size, content)
- [ ] Query parameters are sanitised before database use
- [ ] No raw user input is rendered in HTML
- [ ] Webhook payloads are signature-verified

### AI security checklist

- [ ] AI does not have access to secrets
- [ ] AI output is validated before execution
- [ ] User input is isolated from system prompts
- [ ] AI cannot access other users' data
- [ ] Logging does not capture sensitive prompts

### Data handling checklist

- [ ] Sensitive data is encrypted at rest
- [ ] Database access uses least-privilege credentials
- [ ] RLS (Row Level Security) is enabled where appropriate
- [ ] Logs do not contain PII, secrets, or tokens
- [ ] Backups are encrypted

For every **FAIL** or **PARTIAL**:

- Explain the vulnerability
- Describe the attack path
- Estimate realistic risk
- Recommend remediation
- Estimate remediation complexity

For every **UNKNOWN**:

- Explain what information is missing
- Suggest how to verify

---

## Phase 4 — Adversarial Review

Now think like an attacker. Ask:

- If I were targeting this application, where would I start?
- What's the most valuable data here and how would I get to it?
- Which component is most overtrusted?
- Which service would leak secrets first?
- What would a simple automated attack find?
- What would a sophisticated attacker focus on?

Document:

- **Most likely attack paths** — What's probably exploitable today
- **Highest-impact attack paths** — What causes the most damage if exploited
- **What I would attack first** — The single most promising target

---

## Phase 5 — Severity Classification

Classify each finding:

### Critical

- Authentication bypass
- Full database access
- Secret exposure
- Remote code execution
- Payment system compromise

Action: Fix immediately. Do not deploy new features until resolved.

### High

- Partial data exposure
- Privilege escalation (user → admin)
- Session hijacking
- Significant secret exposure

Action: Fix this week. Prioritise over feature work.

### Medium

- Information disclosure (non-sensitive)
- Rate limiting gaps
- Missing security headers
- Partial input validation gaps

Action: Fix this month. Include in regular maintenance.

### Low

- Cosmetic security issues
- Best-practice violations with low impact
- Hardening opportunities

Action: Track and fix opportunistically.

---

## Phase 6 — Output Format

Produce a single Markdown document with these sections:

1. **Executive Summary** — 5–7 bullets a founder can read in 2 minutes
2. **Architecture Overview** — What was discovered about the system
3. **Attack Surface Inventory** — Full inventory by category
4. **Authentication and Authorization** — Findings and status
5. **Secrets and Credentials** — Inventory and risk assessment
6. **Third-Party Integrations** — Trust relationships and risks
7. **AI and Agent Security** — Capabilities, boundaries, and risks
8. **Data Handling** — Storage, access, and protection status
9. **Critical Findings** — Must fix immediately
10. **High-Risk Findings** — Must fix soon
11. **Medium-Risk Findings** — Should fix
12. **Unknowns and Assumptions** — What couldn't be verified
13. **What I Would Attack First** — Honest adversarial perspective
14. **Remediation Roadmap** — Prioritised action list

---

## Important rules for the auditor

- Do NOT provide shallow generic security advice
- Do NOT assume protections exist without evidence
- Do NOT mark items PASS without evidence
- Be skeptical of implicit trust assumptions
- Treat comments and documentation as untrusted unless verified in code
- Prefer evidence from runtime configuration over README claims
- Explicitly identify security theatre or incomplete mitigations
- Prioritise realistic exploitability over theoretical CVEs
- Focus especially on authentication boundaries, secrets exposure, and AI trust

You are performing a real security review, not writing a blog post.

---

## How to consume the output

After receiving the audit report:

1. **Read the executive summary.** Understand the overall posture.
2. **Address critical findings immediately.** These are blockers.
3. **Schedule high-risk findings for this week.** Don't let them age.
4. **Create tickets for medium findings.** Include them in regular work.
5. **Save the report as your baseline.** The next audit compares against it.

If you use the `contextqb check` drift detector, update your `context.qb.yaml` with any new surfaces discovered. This turns a one-time audit into ongoing protection.

---

## See also

- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — manual version of the inventory step
- [Principle: Untrusted by Default](contextqb://principles/untrusted-by-default) — the mental model this audit enforces
- [Principle: Trust Boundaries Are Architecture](contextqb://principles/trust-boundaries-are-architecture) — boundary discipline this audit checks
- [Principle: Security Drift Is the Real Threat](contextqb://principles/security-drift-is-the-real-threat) — why this audit must be re-run
- [Audit: AI Integration Security](contextqb://audits/ai-integration-security) — companion audit focused on the AI surface
- [Audit: Security Regression](contextqb://audits/security-regression) — follow-on audit after changes
- [Audit: Pre-Launch Security](contextqb://audits/pre-launch-security) — condensed launch-day verification
- [Audit: Secrets & Credentials](contextqb://audits/secrets-and-credentials) — focused secrets audit
- [Audit: Authentication & Authorization](contextqb://audits/authentication-and-authorization) — focused auth audit
