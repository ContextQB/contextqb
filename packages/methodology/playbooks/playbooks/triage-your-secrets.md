---
id: triage-your-secrets
title: Triage Your Secrets
summary: Walk through your project and produce a complete inventory of every secret — API keys, tokens, passwords, certificates — with owner, scope, rotation status, and risk level.
version: 0.2.0
problem: |
  Secrets drift. Keys get created and forgotten. Tokens never rotate. Production credentials end up in development. When a breach happens, you cannot revoke what you cannot find.
when_to_use: |
  At least quarterly, after any personnel change, after adding a new third-party integration, or whenever you suspect a secret may have leaked.
expected_outputs:
  - A secrets inventory document listing every credential in your system.
  - Owner assignment for each secret.
  - Rotation schedule and last-rotated date.
  - Risk assessment for each secret.
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 5
journey_rank: 20
related_principles:
  - least-privilege-for-agents
  - secrets-have-provenance
  - untrusted-by-default
tags:
  - security
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.3 (agent)"
  reviewer_notes: "2026-10-07 renewal B7 (0.2.0; author self-checked; independent review pending; not operator-accepted): this playbook now holds the one inventory schema that the secrets-and-credentials audit references; the work is split by role (the agent drafts references, storage and scope, using the audit's scanner; you supply owners, dates from dashboards and blast-radius judgments); the learner's agent tooling (MCP client configuration, agent memory and settings files) is in scope; secret values never go in the inventory; service and secrets-manager lists become categories with dated references; fixed 90-day thresholds become intervals you choose per secret, compared with the security-defaults reference; the worked example's names and 2024 dates are labelled fictional. Earlier notes (2026-09-09 epistemology review): R3–R7 pass; blast-radius discipline and worked tables land. R8 pending P4. F-06/F-15 resolved 2026-09-09 by R-02 lattice reconciliation (links now declared + reciprocal)."
related:
  - detect-security-drift
  - map-your-attack-surface
  - pre-launch-security
  - respond-to-a-suspected-compromise
  - secrets-and-credentials
---

# Triage Your Secrets

**Plain language:** This playbook helps you find every API key, password, and token in your project, write down who owns each one, check whether they've ever been rotated, and decide which ones are most dangerous if they leak.

## When to use this

- You're securing your application and need to know what credentials exist
- A team member left and you need to ensure access is revoked
- You added a new third-party service and want to track its credentials
- You suspect a secret may have been exposed (even if you're not sure)
- It's been longer than your chosen review interval since your last secrets review
- You're preparing for a security audit

## What you'll produce

A **secrets inventory** — a document (spreadsheet or Markdown table) in the schema below.

### The inventory schema

This is the one definition of the inventory; the [Secrets & Credentials audit](contextqb://audits/secrets-and-credentials) fills the same fields.

| Field             | What to record                                                                 |
| ----------------- | ------------------------------------------------------------------------------ |
| **Name**          | The variable or key name (for example `PAYMENTS_SECRET_KEY`) — never its value |
| **Purpose**       | What the application uses it for                                               |
| **Provider**      | Who issued it                                                                  |
| **Type**          | API key, token, password, connection string, certificate                       |
| **Scope**         | What it can access (read-only? full access? which environment?)                |
| **Environment**   | Development, staging, production                                               |
| **Stored in**     | Where the value lives (platform settings, secrets manager, local file)         |
| **Owner**         | Who created it, who manages it, and who to contact at 2am                      |
| **Created**       | When it was issued                                                             |
| **Last rotated**  | When it was last replaced                                                      |
| **Rotation path** | Where you go to replace it, and what must be updated afterwards                |
| **Blast radius**  | What a leak would allow, and its severity                                      |

**Who does what.** Ask the agent to draft Steps 1, 2 and 4 — the references in code, where each value is stored, and what each key can reach — using the scanner from the [Secrets & Credentials audit](contextqb://audits/secrets-and-credentials). You supply what only you can see or judge: owners, created and rotated dates from the dashboards, and the blast-radius calls. Never paste a secret's value into the conversation or the inventory.

## Before you start

You'll need access to:

- Your codebase (to find secret references)
- Your hosting and deployment platforms
- The dashboards of the services you use — authentication, payments, database, AI, email ([what common services do](contextqb://references/tools#managed-services))
- Any secrets manager you use ([examples](contextqb://references/tools#secrets-managers))
- Your local environment files (.env.local, .env.development)
- Your agent tools' configuration: MCP client configuration files, agent memory or notes files, and tool settings, which can hold API keys or tokens

Have your `context.qb.yaml` open if you have one — it may list dependencies that have secrets.

## Steps

### Step 1 — Gather secret references from your codebase

Ask your agent or search manually: **"What environment variables does this project use?"**

Look in:

- `.env.example` or `.env.template` (list of expected variables)
- Your hosting platform's configuration file ([how platforms store secrets](contextqb://references/setup#platform-secret-settings))
- `next.config.js` or similar framework configs
- Code that reads `process.env.*`
- CI/CD workflows (GitHub Actions secrets, Vercel env vars)

Create a raw list:

| Variable name     | Where referenced | Appears to be       |
| ----------------- | ---------------- | ------------------- |
| CLERK_SECRET_KEY  | auth.ts          | Auth provider key   |
| DATABASE_URL      | prisma.schema    | Database connection |
| STRIPE_SECRET_KEY | billing.ts       | Payment key         |
| OPENAI_API_KEY    | chat.ts          | AI provider key     |
| ...               | ...              | ...                 |

**Tip for non-developers:** Ask your agent: "Search this codebase for all uses of `process.env` or environment variables. List each variable name and where it's used."

### Step 2 — Match references to actual secrets

For each variable you found, determine where the actual secret is stored.

Check:

- Local `.env` files (should NOT be in version control)
- Agent tooling: MCP client configuration and agent memory files on your machine
- Deployment platform environment settings
- Secrets managers
- CI/CD secret stores

Record:

| Variable name     | Stored in           | Actual secret exists? |
| ----------------- | ------------------- | --------------------- |
| CLERK_SECRET_KEY  | Cloudflare + Vercel | Yes                   |
| DATABASE_URL      | Supabase dashboard  | Yes                   |
| STRIPE_SECRET_KEY | Cloudflare + Vercel | Yes                   |
| OLD_API_KEY       | Referenced in code  | No — dead reference   |

If you find references to secrets that don't exist, that's a finding. If you find secrets that have no references, that's also a finding.

### Step 3 — Identify the owner of each secret

For each secret, name who is responsible:

- **Created by:** Who generated this secret?
- **Managed by:** Who rotates it or revokes it?
- **Contact:** If this breaks at 2am, who do we call?

The tables in Steps 1–7 are a worked example for a fictional project; the people, dates and service names are illustrative.

| Secret            | Created by      | Managed by     | Contact           |
| ----------------- | --------------- | -------------- | ----------------- |
| CLERK_SECRET_KEY  | Clerk dashboard | Alice (ops)    | alice@company.com |
| DATABASE_URL      | Supabase        | Auto-generated | Supabase support  |
| STRIPE_SECRET_KEY | Bob (finance)   | Bob            | bob@company.com   |
| OPENAI_API_KEY    | Unknown         | Unknown        | ???               |

**If you cannot identify an owner, that's a critical finding.** Orphan secrets are the most dangerous kind.

### Step 4 — Document scope and permissions

For each secret, understand what it grants access to:

| Secret            | Provider | Scope                | Permissions                 |
| ----------------- | -------- | -------------------- | --------------------------- |
| CLERK_SECRET_KEY  | Clerk    | All auth operations  | Full (read/write users)     |
| DATABASE_URL      | Supabase | Production database  | Full database access        |
| STRIPE_SECRET_KEY | Stripe   | Live mode            | Charges, refunds, customers |
| OPENAI_API_KEY    | OpenAI   | Organisation account | All models, billing         |

Check if the scope is too broad:

- Is a production key used in development?
- Does the key have admin access when read-only would suffice?
- Are there separate keys for different environments?

### Step 5 — Check rotation status

For each secret, determine:

- When was it created?
- When was it last rotated?
- Is there a rotation schedule?
- How would you rotate it if needed?

| Secret            | Created  | Last rotated            | Schedule | Rotation steps                           |
| ----------------- | -------- | ----------------------- | -------- | ---------------------------------------- |
| CLERK_SECRET_KEY  | Jan 2024 | Never                   | None     | Roll in Clerk dashboard, update all envs |
| DATABASE_URL      | Mar 2024 | N/A (connection pooler) | N/A      | Change password in Supabase, update envs |
| STRIPE_SECRET_KEY | Feb 2024 | Never                   | None     | Roll in Stripe, update all envs          |
| OPENAI_API_KEY    | Unknown  | Unknown                 | None     | Create new key, update envs, delete old  |

**If "last rotated" is "never" or "unknown" for a long-lived secret, or it is past the interval you chose for it, that's a finding.** Standards set no single interval — a secret's lifetime depends on what it does (see the [security defaults reference](contextqb://references/pricing#security-defaults)).

### Step 6 — Assess blast radius

For each secret, describe what happens if it leaks:

| Secret            | Blast radius                                                                  | Severity |
| ----------------- | ----------------------------------------------------------------------------- | -------- |
| CLERK_SECRET_KEY  | Full auth compromise — attacker can impersonate any user, access all accounts | Critical |
| DATABASE_URL      | Full data breach — all user data, orders, everything                          | Critical |
| STRIPE_SECRET_KEY | Financial damage — attacker can issue refunds, read customer data             | Critical |
| OPENAI_API_KEY    | Billing abuse — attacker runs up charges, potentially accesses usage history  | High     |

Severity levels:

- **Critical** — Business-ending if leaked (auth compromise, full data breach, financial access)
- **High** — Serious damage, recoverable with effort (partial data exposure, billing abuse)
- **Medium** — Inconvenient but manageable (service disruption, spam potential)
- **Low** — Minimal impact (read-only access to non-sensitive data)

### Step 7 — Compile the inventory

Bring it all together in a single document:

| Secret            | Stored in  | Owner   | Scope         | Created  | Last rotated | Blast radius          | Severity |
| ----------------- | ---------- | ------- | ------------- | -------- | ------------ | --------------------- | -------- |
| CLERK_SECRET_KEY  | Cloudflare | Alice   | Full auth     | Jan 2024 | Never        | Full account takeover | Critical |
| DATABASE_URL      | Supabase   | (auto)  | Production DB | Mar 2024 | N/A          | Full data breach      | Critical |
| STRIPE_SECRET_KEY | Cloudflare | Bob     | Live payments | Feb 2024 | Never        | Financial access      | Critical |
| OPENAI_API_KEY    | Vercel     | Unknown | Org account   | Unknown  | Unknown      | Billing abuse         | High     |

### Step 8 — Generate action items

For each finding, create an action:

1. **Orphan secret (no owner):** Assign an owner immediately
2. **Never rotated:** Schedule rotation this week
3. **Unknown age:** Rotate now as a precaution
4. **Over-scoped:** Create a more restricted key
5. **In wrong environment:** Create separate dev/prod keys
6. **Dead reference:** Remove from codebase

Prioritise by severity. Critical secrets with no owner or unknown age are your top priority.

## Common mistakes

- **Searching only `.env`** — Secrets live in CI/CD, deployment platforms, and secrets managers too
- **Trusting "it's in the dashboard"** — Dashboards don't show when secrets were created or last rotated
- **Assuming auto-generated is fine** — Even auto-generated secrets (like database URLs) can be over-scoped
- **Stopping at "we use a secrets manager"** — Secrets managers help, but you still need to track what's in them
- **Not testing rotation** — Know HOW to rotate before you NEED to rotate

## What "good enough" looks like

Your secrets inventory is good enough when:

- [ ] Every environment variable reference has a corresponding actual secret
- [ ] Every secret has a named owner
- [ ] Every secret has a documented scope
- [ ] You know when each secret was created and last rotated
- [ ] You have documented rotation steps for each secret
- [ ] Critical secrets are flagged and have rotation scheduled
- [ ] No secrets are orphaned or unknown

## When to do this again

- On a regular schedule you choose and record (quarterly is a common starting point — a suggestion, not a standard)
- After any personnel change (hire, departure, role change)
- After adding a new third-party service
- After any suspected exposure or security incident
- Before any audit or compliance review

## See also

- [Principle: Secrets Have Provenance](contextqb://principles/secrets-have-provenance) — the mental model this playbook operationalises
- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents) — why agents need scoped credentials
- [Audit: Secrets & Credentials](contextqb://audits/secrets-and-credentials) — have an agent run a structured review
- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — broader inventory that includes secrets
- [Playbook: Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise) — what to do if a secret leaks
