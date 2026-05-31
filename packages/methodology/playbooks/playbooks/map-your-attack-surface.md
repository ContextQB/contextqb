---
id: map-your-attack-surface
title: Map Your Attack Surface
summary: Walk through your application and produce a structured inventory of every public surface, every secret, every agent capability, and every third-party trust.
version: 0.1.0
problem: |
  You can't defend what you can't see. Most security failures happen on surfaces the builder didn't know existed — a public endpoint they forgot, a secret they didn't track, a third-party integration that silently gained access.
when_to_use: |
  At the start of any security effort, after major feature additions, or quarterly as a hygiene check.
expected_outputs:
  - An attack surface inventory document listing every public route, secret, agent capability, and third-party trust.
  - A prioritised list of surfaces by risk level.
  - A baseline you can compare future changes against.
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 5
journey_rank: 0
related_principles:
  - untrusted-by-default
  - failure-modes
  - state-ownership
tags:
  - security
---

# Map Your Attack Surface

**Plain language:** Before you can protect your application, you need to know what doors and windows it has. This playbook helps you walk through your project and write down every way someone (or something) could get in.

## When to use this

- You're starting to think about security for the first time
- You just finished a major feature or integration
- You haven't reviewed your attack surface in the last quarter
- You're preparing for a security audit
- Something feels "off" and you want to understand your exposure

## What you'll produce

An **attack surface inventory** — a document (Markdown works fine) that lists:

1. **Public surfaces** — everything reachable from the internet
2. **Authentication surfaces** — where users prove who they are
3. **Agent surfaces** — what your AI agents can do
4. **Secrets inventory** — every credential, API key, and token
5. **Third-party trust** — every external service you depend on
6. **Data surfaces** — where sensitive data lives

This document becomes your baseline. The next time you run this playbook, you'll compare against it and spot the drift.

## Before you start

You'll need:

- Access to your codebase (or your agent can read it for you)
- Access to your deployment environment (Cloudflare, Vercel, Supabase, Clerk, etc.)
- A blank document to write your inventory

If you have a `context.qb.yaml`, pull it up — it'll speed up the discovery.

## Steps

### Step 1 — List your public surfaces

Ask yourself (or your agent): **"What can someone on the internet reach?"**

Look for:

- Public routes (pages that don't require login)
- Public API endpoints
- Webhooks that accept external calls
- Publicly accessible files (images, downloads, etc.)
- Your domain's DNS records (any subdomains you forgot about?)

For each public surface, write down:

| Surface    | URL/Path             | What it does   | Protected by           | Notes                  |
| ---------- | -------------------- | -------------- | ---------------------- | ---------------------- |
| Homepage   | /                    | Marketing page | Nothing                | Public by design       |
| API health | /api/health          | Status check   | Nothing                | Should this be public? |
| Webhook    | /api/webhooks/stripe | Payment events | Signature verification | Check signature logic  |

**Tip for non-developers:** Ask your agent: "List every route in this project that doesn't require authentication. For each, tell me what it does and whether it accepts user input."

### Step 2 — List your authentication surfaces

Ask: **"Where do users prove who they are?"**

Look for:

- Sign-in pages
- Sign-up flows
- Password reset
- Magic links / OTP
- OAuth connections (Google, GitHub, etc.)
- Session cookies and JWTs
- API keys for machine access

For each, write down:

| Surface        | What it does   | Provider | Session duration | MFA?     | Notes                   |
| -------------- | -------------- | -------- | ---------------- | -------- | ----------------------- |
| Sign in        | User login     | Clerk    | 7 days           | Optional | Should MFA be required? |
| Password reset | Recovery flow  | Clerk    | 1 hour link      | N/A      | Link expiry is good     |
| API key        | Machine access | Custom   | Never expires    | N/A      | Should these rotate?    |

### Step 3 — List your agent capabilities

Ask: **"What can my AI agents do?"**

If you use Cursor, Claude, or any agent in development:

- What files can it read/write?
- Can it run shell commands?
- Can it make network requests?
- Can it access your database?
- Can it read your secrets?

If your application has AI features (chatbots, assistants, etc.):

- What data does the AI see?
- What actions can it take?
- Can user input influence its behaviour? (This is where prompt injection lives.)
- Does it execute code or call tools?

For each agent, write down:

| Agent       | Context         | Can read                      | Can write | Can execute           | Restrictions        |
| ----------- | --------------- | ----------------------------- | --------- | --------------------- | ------------------- |
| Cursor      | Dev environment | All files                     | All files | Shell (with approval) | None formal         |
| Support bot | Production      | User messages, knowledge base | Nothing   | N/A                   | Read-only by design |

**Tip:** If your agent has no documented restrictions, that's a finding. Write it down.

### Step 4 — Inventory your secrets

Ask: **"What credentials does this project use?"**

Look for:

- Environment variables (`.env`, `.env.local`, deployment settings)
- API keys (Stripe, Clerk, Supabase, OpenAI, etc.)
- Database connection strings
- OAuth client secrets
- Webhook signing secrets
- Service account credentials

For each secret, write down:

| Secret name       | Provider | Blast radius         | Rotation path      | Last rotated | Notes    |
| ----------------- | -------- | -------------------- | ------------------ | ------------ | -------- |
| CLERK_SECRET_KEY  | Clerk    | Full auth compromise | Clerk dashboard    | Unknown      | Critical |
| STRIPE_SECRET_KEY | Stripe   | Payment access       | Stripe dashboard   | Unknown      | Critical |
| DATABASE_URL      | Supabase | Full data access     | Supabase dashboard | Never        | Critical |
| OPENAI_API_KEY    | OpenAI   | Billing exposure     | OpenAI dashboard   | Unknown      | Medium   |

**Blast radius** = "If this leaks, what's the worst that happens?" Be honest.

**Rotation path** = "If I need to change this, where do I go and what breaks?"

### Step 5 — Map your third-party trust

Ask: **"What external services does this project depend on?"**

Look for:

- Auth providers (Clerk, Auth0, Supabase Auth)
- Payment processors (Stripe, LemonSqueezy)
- Databases and storage (Supabase, Cloudflare D1, R2)
- AI providers (OpenAI, Anthropic)
- Email services (Resend, SendGrid)
- Analytics (Posthog, Mixpanel)
- Monitoring (Sentry, Datadog)

For each, write down:

| Service | What it does   | What it can access    | What we trust it with | Fallback if compromised    |
| ------- | -------------- | --------------------- | --------------------- | -------------------------- |
| Clerk   | Authentication | User emails, sessions | User identity         | None — critical dependency |
| Stripe  | Payments       | Customer payment data | Billing               | None — critical dependency |
| OpenAI  | AI features    | User prompts          | Conversation content  | Could switch providers     |

### Step 6 — Identify data surfaces

Ask: **"Where does sensitive data live?"**

Look for:

- Database tables with user data
- File storage with uploaded content
- Logs that might contain PII
- Analytics that track user behaviour
- Browser storage (localStorage, cookies)
- Vector databases with embeddings

For each, write down:

| Data store       | What's in it     | Sensitivity | Encrypted?         | Access control | Backup?          |
| ---------------- | ---------------- | ----------- | ------------------ | -------------- | ---------------- |
| Users table      | Email, name, ID  | High        | At rest (Supabase) | RLS enabled    | Supabase auto    |
| Uploads bucket   | User files       | Medium      | At rest            | RLS enabled    | No               |
| Application logs | Requests, errors | Medium      | No                 | Admin only     | 30 day retention |

### Step 7 — Prioritise by risk

Now review your inventory and mark risk levels:

- **Critical** — If compromised, the business is in serious trouble (auth bypass, payment access, full data breach)
- **High** — Significant damage but recoverable (partial data exposure, service disruption)
- **Medium** — Inconvenient but manageable (spam abuse, minor data exposure)
- **Low** — Minimal impact (cosmetic issues, non-sensitive data)

Sort your findings. The critical and high items are where your security effort should focus first.

## Common mistakes

- **Forgetting subdomains.** That staging.example.com you set up six months ago? It's still public.
- **Missing webhooks.** Webhook endpoints often lack the same protections as your main API.
- **Underestimating agent capabilities.** "It's just a dev tool" — but it can read your .env file.
- **Not tracking secret rotation.** If you don't know when a secret was last rotated, assume it's been compromised.
- **Trusting "internal" services.** If it's on the internet, it's not internal.

## What "good enough" looks like

Your attack surface inventory is good enough when:

- [ ] Every public endpoint is listed with its protection status
- [ ] Every secret has a name, owner, blast radius, and rotation path
- [ ] Every third-party service has an entry explaining what you trust it with
- [ ] Every AI/agent capability is documented with its restrictions (or lack thereof)
- [ ] You've prioritised the list by risk
- [ ] Someone unfamiliar with the project could read it and understand your exposure

## When to do this again

- After any major feature ships
- After adding a new third-party integration
- After onboarding a new team member (they should review it)
- Quarterly, even if nothing changed — you'll be surprised what drifted

## See also

- [Principle: Untrusted by Default](contextqb://principles/untrusted-by-default) — the mental model this playbook operationalises
- [Principle: Trust Boundaries Are Architecture](contextqb://principles/trust-boundaries-are-architecture) — where the inventory's "auth" column comes from
- [Playbook: Review Your AI Integration](contextqb://playbooks/review-your-ai-integration) — sibling playbook for the AI surface specifically
- [Playbook: Triage Your Secrets](contextqb://playbooks/triage-your-secrets) — deep dive on secret management
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — have an agent run a full audit using your inventory
- [Audit: AI Integration Security](contextqb://audits/ai-integration-security) — focused audit of the AI surface
- [Audit: Security Regression](contextqb://audits/security-regression) — compare current state to your baseline
