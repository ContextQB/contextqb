---
id: application-security-baseline
title: Application Security Baseline Audit
summary: A full security audit tailored for a non-developer-built managed-services application. Discovers architecture, enumerates surfaces, audits each, and produces prioritised findings.
version: 0.2.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 5
journey_rank: 0
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
  - ai-integration-security
  - authentication-and-authorization
  - detect-security-drift
  - failure-modes
  - map-your-attack-surface
  - pre-launch-security
  - public-endpoint-exposure
  - review-a-new-feature-for-security-implications
  - secrets-and-credentials
  - security-critical-code-review
  - security-drift-is-the-real-threat
  - security-regression
  - state-ownership
  - think-like-an-attacker
  - trust-boundaries-are-architecture
  - untrusted-by-default
tags:
  - security
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.4 (agent)"
  reviewer_notes: "2026-10-07 renewal B7 (0.2.0; author self-checked; independent review pending; not operator-accepted): adds a what-to-give-the-agent preamble (settings exports or screenshots and environment-variable names, never secret values) so the first run is not dominated by UNKNOWN; the agent reads the project instructions and configuration first, then runs the scanners it is permitted to run, treating their output as leads and evidence to check, never as verdicts; secret values are never written into the report; asks for a session that did not build the application; vendor examples in the intro and Phase 1 become provider categories with a link to the dated managed-services reference; active attack demonstrations are limited to authorized local or test targets. The FT closing-step repair is unchanged. 2026-10-06 renewal fast-track repair (0.1.2; author self-checked; independent review pending; not operator-accepted): the follow-up step no longer tells readers to record surfaces in context.qb.yaml for the drift detector (it has no field for security state); surfaces go in the AGENTS.md list, hostnames and deployed services in routes/tree. Wider rewrite remains for its later batch. Earlier notes describe 0.1.1: R3–R7 pass; the phased discover→inventory→audit→adversarial→classify structure is the security pillar's reference audit. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
---

# Application Security Baseline Audit

This is a comprehensive security audit for applications built with agentic systems and deployed to managed services — hosting, authentication, database, storage and other providers ([what common services do](contextqb://references/tools#managed-services)). It's designed to be run by an AI agent and produce a report a non-developer can understand and act on.

## Before you run it: what to give the agent

The agent can read your code, but not your providers' dashboards. Without help, many checks come back UNKNOWN. Before the run, collect:

- **Settings exports or screenshots** from your hosting, authentication, database and storage dashboards (security, session, access-rule and network settings).
- **The names of your environment variables** — names only, never their values.
- **Your attack-surface map** if you have one ([Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface)).

Run the audit in a session that did not build the application: a fresh session, a second agent, or a person, given the project instructions and the code. A different model can add variety; it does not by itself make the audit independent.

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
>
> Start by reading the project instructions (`AGENTS.md` and anything it points to) and the relevant configuration. Then run the dependency, secret and code-security scanners the project has and you are permitted to run ([kinds of scanner](contextqb://references/tools#security-scanners)). Treat their output as leads to verify against the code, never as verdicts. Never copy a secret value into your report or your messages: name the file, line and kind of secret instead.

---

## Phase 1 — Architecture Discovery

First, discover and document the actual architecture. Do NOT assume — infer from code and configuration.

Inspect:

- **Framework and language** — What's the tech stack?
- **Deployment** — Where is this deployed? (which hosting provider or platform)
- **Authentication** — How do users prove identity? (a hosted authentication provider, the database's built-in auth, or custom)
- **Database** — Where does data live? (which database or data service)
- **Storage** — Where do files live? (which object or file storage)
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
- Treat scanner and search matches as leads; confirm each in the code before it becomes a finding
- Never include a secret value in the report — identify it by location and kind
- Do not run attacks. If a finding needs demonstrating, propose the test; run it only with the operator's approval and only against a local or test copy, never production

You are performing a real security review, not writing a blog post.

---

## How to consume the output

After receiving the audit report:

1. **Read the executive summary.** Understand the overall posture.
2. **Address critical findings immediately.** These are blockers.
3. **Schedule high-risk findings for this week.** Don't let them age.
4. **Create tickets for medium findings.** Include them in regular work.
5. **Save the report as your baseline.** The next audit compares against it.

Keep what the audit found where future work will see it. Add new public endpoints and outside services to the "Public surfaces and outside services" list in your `AGENTS.md` (the `set-security-guardrails-for-your-agent` playbook has the template). If the audit found a new hostname or deployed service, add it to `routes` or `tree` in `context.qb.yaml`, so the `contextqb` drift detector can compare the map with your deploy configuration. The detector checks the map's structure, not security state; re-running this audit is what catches security drift.

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
