---
id: secrets-and-credentials
title: Secrets & Credentials Audit
summary: A focused security audit of secrets management — inventory all credentials, assess blast radius, check rotation status, and identify exposure risks.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 5
objective: |
  Produce a complete inventory of all secrets in the application, assess each for exposure risk, verify rotation status, and identify immediate remediation priorities.
scope: |
  All credentials, API keys, tokens, certificates, and connection strings used by the application. Covers environment variables, secrets managers, hardcoded values, and third-party integrations.
required_sections:
  - Executive summary
  - Secrets inventory
  - Environment analysis
  - Exposure assessment
  - Rotation status
  - Storage security
  - Critical findings
  - High-risk findings
  - Remediation roadmap
evaluation_criteria:
  - Every secret has a documented owner.
  - Every secret has a documented blast radius.
  - Every secret has a documented rotation path.
  - No secrets are hardcoded in source code.
  - No secrets appear in version control history.
  - Secrets are appropriately scoped (dev vs prod, read vs write).
deliverables:
  - A single Markdown document with all required sections.
  - A complete secrets inventory table.
  - A prioritised remediation roadmap.
related:
  - secrets-have-provenance
  - least-privilege-for-agents
  - untrusted-by-default
tags:
  - security
---

# Secrets & Credentials Audit

This audit produces a complete inventory of all secrets in your application and assesses them for exposure risk, rotation status, and proper management. It's designed for applications built with managed services (Supabase, Clerk, Cloudflare, etc.) where secrets often accumulate without formal tracking.

## Use this as an agent instruction

> You are performing a professional security audit focused on secrets and credentials.
>
> Your task is NOT to give generic advice about secrets. Your task is to:
>
> 1. Discover ALL secrets this application uses
> 2. Assess each secret's blast radius (what happens if it leaks)
> 3. Verify rotation status and ownership
> 4. Identify hardcoded secrets, exposed secrets, and management gaps
>
> You must produce an actionable inventory, not a lecture on best practices.

---

## Phase 1 — Secrets Discovery

Find every secret in the system. Be thorough — secrets hide in unexpected places.

### Source code scan

Search for:

- Environment variable references (`process.env.*`, `env.*`)
- Hardcoded strings that look like secrets (API keys, tokens, connection strings)
- Configuration files with credentials
- Docker/container configs with secrets
- CI/CD workflow files with secrets

Common patterns to search:

```
sk_live_ / sk_test_    (Stripe)
pk_live_ / pk_test_    (Stripe)
CLERK_SECRET_KEY       (Clerk)
DATABASE_URL           (Database)
OPENAI_API_KEY         (OpenAI)
SUPABASE_SERVICE_ROLE  (Supabase)
RESEND_API_KEY         (Resend)
Bearer / Authorization  (API tokens)
-----BEGIN             (Certificates/keys)
```

### Configuration files

Check:

- `.env` / `.env.local` / `.env.production` (should NOT be in repo)
- `.env.example` (should have placeholders, not real values)
- `wrangler.toml` / `wrangler.jsonc` (Cloudflare Workers secrets)
- `vercel.json` (Vercel configuration)
- Database config files
- CI/CD configs (GitHub Actions, etc.)

### Deployment platforms

Check dashboard settings for:

- Vercel: Project Settings → Environment Variables
- Cloudflare: Workers → Settings → Variables
- Supabase: Project Settings → API
- Clerk: Configure → API keys
- Any other deployed service

### Third-party integrations

For each external service the app uses, identify:

- What credentials does it require?
- Where are those credentials stored?
- What permissions does each credential grant?

---

## Phase 2 — Inventory Documentation

For each secret discovered, document:

| Field             | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| **Name**          | Variable/key name (e.g., `STRIPE_SECRET_KEY`)                       |
| **Provider**      | Who issued this secret (Stripe, Clerk, etc.)                        |
| **Type**          | API key, token, password, connection string, certificate            |
| **Scope**         | What can this secret access? (read-only? full access?)              |
| **Environment**   | Which environments use this? (dev, staging, prod)                   |
| **Stored in**     | Where is this secret stored? (env vars, secrets manager, hardcoded) |
| **Owner**         | Who is responsible for this secret?                                 |
| **Created**       | When was this secret created?                                       |
| **Last rotated**  | When was this secret last rotated?                                  |
| **Rotation path** | How do you rotate this secret?                                      |

Produce a complete inventory table.

---

## Phase 3 — Blast Radius Assessment

For each secret, assess the impact of exposure:

### Blast radius categories

**Critical** — Full compromise

- Full database access
- Payment processing (charges, refunds)
- User authentication bypass
- Admin-level access to any service

**High** — Significant damage

- Partial data access
- Service abuse (billing to your account)
- User PII exposure
- Ability to send emails/messages as you

**Medium** — Limited impact

- Read-only access to non-sensitive data
- Rate limit abuse
- Service impersonation (low privilege)

**Low** — Minimal impact

- Public API access
- Usage tracking only
- No data access

For each secret, document:

- Blast radius category
- Specific worst-case scenario if leaked
- Whether existing access controls limit the damage

---

## Phase 4 — Exposure Assessment

Check for active exposure risks:

### Hardcoded secrets

- [ ] No secrets appear literally in source code
- [ ] No secrets appear in comments
- [ ] No secrets appear in example files
- [ ] No secrets appear in test fixtures

### Version control exposure

- [ ] No secrets in current repo files
- [ ] No secrets in git history (check with `git log -p | grep -i "secret\|key\|password"`)
- [ ] `.env` files are in `.gitignore`
- [ ] No committed `.env.local` or similar

### Log exposure

- [ ] Secrets are not logged by the application
- [ ] Error messages don't include credentials
- [ ] Debug endpoints don't expose environment variables

### Third-party exposure

- [ ] Secrets are not shared in Slack/Discord/email
- [ ] Secrets are not in shared documents
- [ ] No screenshots or recordings include secrets

For each exposure found, document:

- What was exposed
- Where it was exposed
- Time window of exposure
- Remediation status (rotated? removed?)

---

## Phase 5 — Rotation Status Assessment

Check rotation hygiene:

| Secret | Created | Last rotated | Days since rotation | Rotation scheduled? |
| ------ | ------- | ------------ | ------------------- | ------------------- |
| ...    | ...     | ...          | ...                 | ...                 |

Flag:

- **Critical:** Never rotated, > 180 days old
- **High:** Never rotated, > 90 days old
- **Medium:** No rotation schedule, > 30 days old

For each secret that needs rotation:

- Can it be rotated without downtime?
- What's the rotation procedure?
- Who can perform the rotation?

---

## Phase 6 — Storage Security Assessment

Check how secrets are stored:

### Environment variables

- [ ] Secrets are in deployment platform settings (not code)
- [ ] Development secrets are separate from production
- [ ] Secrets are not echoed in build logs

### Secrets managers (if used)

- [ ] Access is restricted by role
- [ ] Audit logging is enabled
- [ ] Secrets are encrypted at rest

### Application access

- [ ] Application uses least-privilege credentials
- [ ] Different secrets for different environments
- [ ] Service account keys are scoped appropriately

---

## Phase 7 — Severity Classification

### Critical findings

Immediate action required:

- Secrets hardcoded in source code
- Secrets in version control history
- Secrets in public locations (logs, screenshots, docs)
- Production secrets used in development
- Orphan secrets with no known owner

### High-risk findings

Action this week:

- Secrets > 90 days old, never rotated
- Over-scoped secrets (admin where read-only would work)
- Single secret shared across environments
- No documented rotation path

### Medium-risk findings

Action this month:

- Missing owner documentation
- No rotation schedule
- Incomplete inventory
- Manual rotation only (no automation path)

---

## Phase 8 — Output Format

Produce a Markdown document with:

1. **Executive Summary** — Critical stats a founder can read in 1 minute
   - Total secrets: X
   - Secrets with no owner: X
   - Secrets never rotated: X
   - Critical exposures: X

2. **Secrets Inventory** — Complete table with all fields

3. **Environment Analysis** — How secrets are distributed across environments

4. **Exposure Assessment** — Any active exposure risks

5. **Rotation Status** — Status and recommendations

6. **Storage Security** — How secrets are stored and accessed

7. **Critical Findings** — Must fix now

8. **High-Risk Findings** — Must fix soon

9. **Remediation Roadmap** — Prioritised action list

---

## Important rules for the auditor

- Do NOT assume secrets are managed just because a secrets manager exists
- Do NOT skip version control history scanning
- Do NOT trust `.env.example` files — verify they don't contain real values
- Be thorough — missing secrets are worse than documenting false positives
- For every "unknown" (owner, rotation date, etc.), flag it as a finding
- Prioritise by blast radius first, then exposure risk

---

## How to consume the output

After receiving the audit report:

1. **Rotate any exposed secrets immediately.** Don't wait.
2. **Assign owners to orphan secrets.** Someone must be responsible.
3. **Remove any hardcoded secrets.** Move to environment variables.
4. **Establish rotation schedules.** At minimum, annual for all, quarterly for critical.
5. **Save the inventory.** This becomes your baseline for future audits.

Use [Triage Your Secrets](contextqb://playbooks/triage-your-secrets) to maintain the inventory going forward.

---

## See also

- [Playbook: Triage Your Secrets](contextqb://playbooks/triage-your-secrets) — manual process for secrets inventory
- [Principle: Secrets Have Provenance](contextqb://principles/secrets-have-provenance) — the ownership model this audit checks
- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents) — why scope matters
- [Playbook: Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise) — what to do if you find exposure
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — comprehensive audit that includes secrets
