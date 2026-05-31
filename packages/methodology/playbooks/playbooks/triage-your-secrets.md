---
id: triage-your-secrets
title: Triage Your Secrets
summary: Walk through your project and produce a complete inventory of every secret — API keys, tokens, passwords, certificates — with owner, scope, rotation status, and risk level.
version: 0.1.0
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
  - secrets-have-provenance
  - untrusted-by-default
  - least-privilege-for-agents
tags:
  - security
---

# Triage Your Secrets

**Plain language:** This playbook helps you find every API key, password, and token in your project, write down who owns each one, check whether they've ever been rotated, and decide which ones are most dangerous if they leak.

## When to use this

- You're securing your application and need to know what credentials exist
- A team member left and you need to ensure access is revoked
- You added a new third-party service and want to track its credentials
- You suspect a secret may have been exposed (even if you're not sure)
- It's been more than 90 days since your last secrets review
- You're preparing for a security audit

## What you'll produce

A **secrets inventory** — a document (spreadsheet or Markdown table) containing:

1. Every secret in your system with its name and purpose
2. Where each secret is stored (env vars, secrets manager, etc.)
3. Who is responsible for each secret
4. What scope/permissions the secret grants
5. When it was created and last rotated
6. What damage a leak would cause (blast radius)
7. How to rotate each secret if needed

## Before you start

You'll need access to:

- Your codebase (to find secret references)
- Your deployment platforms (Cloudflare, Vercel, Supabase, etc.)
- Your third-party service dashboards (Stripe, Clerk, OpenAI, etc.)
- Any secrets managers you use (1Password, AWS Secrets Manager, Doppler)
- Your local environment files (.env.local, .env.development)

Have your `context.qb.yaml` open if you have one — it may list dependencies that have secrets.

## Steps

### Step 1 — Gather secret references from your codebase

Ask your agent or search manually: **"What environment variables does this project use?"**

Look in:

- `.env.example` or `.env.template` (list of expected variables)
- `wrangler.jsonc` or `wrangler.toml` (Cloudflare Workers secrets)
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

**If "last rotated" is "never" or "unknown" for any secret older than 90 days, that's a finding.**

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

- Every 90 days minimum
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
