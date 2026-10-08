---
id: secrets-and-credentials
title: Secrets & Credentials Audit
summary: A focused security audit of secrets management — inventory all credentials, assess blast radius, check rotation status, and identify exposure risks.
version: 0.2.1
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 5
journey_rank: 20
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
  - application-security-baseline
  - least-privilege-for-agents
  - respond-to-a-suspected-compromise
  - secrets-have-provenance
  - triage-your-secrets
  - untrusted-by-default
tags:
  - security
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.4 (agent)"
  reviewer_notes: "2026-10-07 renewal B7 review correction (0.2.1; author self-checked; independent review pending; not operator-accepted): redaction now starts before output reaches the agent: scanners run in a mode that redacts or masks matched values, the last-resort history search prints only metadata and locations with matches masked, and raw secret-bearing diffs are never printed into the transcript, because a tool transcript is itself a place a secret can leak. Discovery coverage and role boundaries are unchanged. 2026-10-07 renewal B7 (0.2.0; author self-checked; independent review pending; not operator-accepted): the agent reads instructions and configuration first, then runs a dedicated secret scanner over the working tree and full history where permitted, treating matches as leads (the plain git-log search is kept only as a last resort); secret values are never copied into the report; provider key prefixes move to the dated secret-patterns reference, with generic anchors kept in the body; platform configuration files and dashboard paths move to the platform-secret-settings reference; the learner's agent tooling (MCP client configuration, agent memory and settings files) is a secret location; the inventory fields are defined once in triage-your-secrets and referenced here; fixed 180/90/30-day thresholds become rotation intervals chosen per secret and compared with the dated security-defaults reference; provider names become categories; the audit discovers and reports, it rotates nothing. Earlier notes (2026-09-09 epistemology review): R3–R7 pass. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
---

# Secrets & Credentials Audit

This audit produces a complete inventory of all secrets in your application and assesses them for exposure risk, rotation status, and proper management. It's designed for applications built with managed services — hosting, authentication, database, payment, AI and email providers — where secrets often accumulate without formal tracking.

**Before you run it.** Give the agent the names of the environment variables set in each dashboard (names only, never values) and tell it which scanners it may run. The audit discovers and reports; it does not rotate, revoke or delete anything. Run it in a session that did not set the secrets up.

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
>
> Start by reading the project instructions and configuration. Then, if you are permitted, run a dedicated secret scanner over the working tree and the full git history ([kinds of scanner](contextqb://references/tools#security-scanners)); its output is your discovery baseline, and every match is a lead to confirm, not a finding by itself. Never copy a secret value into your report or messages — identify each secret by name, file and line, and kind. Do not rotate, revoke or delete anything.
>
> Keep secret values out of your own transcript too: anything a command prints becomes part of this session's context and logs. Run the scanner in a mode that redacts or masks matched values, and read its findings as locations and kinds, not values. If you have to fall back to searching the history yourself, print only metadata — commit, file and line — with any matched text masked, and never print raw diffs that may contain secrets. To confirm a match, check its shape and location without displaying the full value.

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

Search for your providers' key patterns. Recognisable prefixes that vendors document are listed in the dated [secret patterns reference](contextqb://references/setup#secret-patterns); a scanner knows many more. Some patterns apply to every project:

```
*_SECRET*, *_KEY, *_TOKEN   (environment variable names)
DATABASE_URL                (connection strings with passwords inside)
Bearer / Authorization      (API tokens in code or fixtures)
-----BEGIN                  (private keys and certificates)
```

### Configuration files

Check:

- `.env` / `.env.local` / `.env.production` (should NOT be in repo)
- `.env.example` (should have placeholders, not real values)
- Your hosting platform's configuration files (which files, and how each platform stores secrets, are in the [platform secret settings reference](contextqb://references/setup#platform-secret-settings))
- Database config files
- CI/CD configs (GitHub Actions, etc.)

### Deployment platforms

Each hosting platform and service keeps its own environment-variable or secret settings. You cannot see dashboards: list the names the operator gave you, and mark any service whose list you do not have as UNKNOWN.

### Agent tooling

The operator's own agent tools hold secrets too. Check, by file name and location only:

- MCP client configuration files that contain tokens or API keys
- Agent memory or notes files that may have captured a key from a past session
- Agent tool settings and local credential files the agent can read

### Third-party integrations

For each external service the app uses, identify:

- What credentials does it require?
- Where are those credentials stored?
- What permissions does each credential grant?

---

## Phase 2 — Inventory Documentation

Record every secret you discovered in the inventory schema defined once in [Triage Your Secrets](contextqb://playbooks/triage-your-secrets) ("The inventory schema"): name, purpose, provider, type, scope, environment, where it is stored, owner, created, last rotated, rotation path, and blast radius. Never record the secret's value — only its name and where it lives. Where a field cannot be determined from what you can see (for example a creation date that only a dashboard shows), write UNKNOWN and list it for the operator.

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
- [ ] No secrets in git history (the secret scanner's history scan, with redacted output; as a last resort only, a search of `git log -p` that prints commit, file and line with matches masked — never the raw diff — and misses most key formats)
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

Flag, against the rotation interval chosen for each kind of secret (standards set no single interval — lifetimes depend on the secret's function; see the [security defaults reference](contextqb://references/pricing#security-defaults)):

- **Critical:** never rotated, long-lived, and high blast radius
- **High:** never rotated, or past its chosen interval
- **Medium:** no rotation interval chosen at all

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

- Secrets past their chosen rotation interval, or never rotated
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
- Treat scanner and search matches as leads; confirm each before it becomes a finding
- Never include a secret value in the report or in your messages, and never let one reach your transcript: use redacted scanner output and masked searches
- For every "unknown" (owner, rotation date, etc.), flag it as a finding
- Prioritise by blast radius first, then exposure risk

---

## How to consume the output

After receiving the audit report:

1. **Rotate any exposed secrets immediately.** Don't wait.
2. **Assign owners to orphan secrets.** Someone must be responsible.
3. **Remove any hardcoded secrets.** Move to environment variables.
4. **Establish rotation schedules.** Choose an interval for each kind of secret and record it in the inventory — the [security defaults reference](contextqb://references/pricing#security-defaults) lists what standards say.
5. **Save the inventory.** This becomes your baseline for future audits.

Use [Triage Your Secrets](contextqb://playbooks/triage-your-secrets) to maintain the inventory going forward.

---

## See also

- [Playbook: Triage Your Secrets](contextqb://playbooks/triage-your-secrets) — manual process for secrets inventory
- [Principle: Secrets Have Provenance](contextqb://principles/secrets-have-provenance) — the ownership model this audit checks
- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents) — why scope matters
- [Playbook: Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise) — what to do if you find exposure
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — comprehensive audit that includes secrets
