---
id: map-your-attack-surface
title: Map Your Attack Surface
summary: Walk through your application and produce a structured inventory of every public surface, every secret, every agent capability, and every third-party trust.
version: 0.4.0
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
  - failure-modes
  - public-endpoints-are-battlegrounds
  - security-drift-is-the-real-threat
  - state-ownership
  - trust-boundaries-are-architecture
  - untrusted-by-default
tags:
  - security
related:
  - ai-integration-security
  - application-security-baseline
  - connecting-services-reliably
  - detect-security-drift
  - harden-your-authentication
  - plan-data-retention-and-deletion
  - protecting-users-and-their-data
  - public-endpoint-exposure
  - review-your-ai-integration
  - security-regression
  - set-security-guardrails-for-your-agent
  - think-like-an-attacker
  - triage-your-secrets
---

# Map Your Attack Surface

**Plain language:** Before you can protect your application, you need to know what doors and windows it has. This playbook helps you walk through your project and write down every way someone (or something) could get in.

For the underlying decisions, start with [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data). Include retained copies and outside data recipients from [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion). Mark absent surfaces as not applicable with a reason, and distinguish inspected locations from unknown provider settings; the inventory should describe this product rather than create unnecessary services.

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

This document becomes your baseline. Save it with a date — for example `docs/security/attack-surface.md`, with the date and the commit or release it describes at the top — and the next time you run this playbook, or the [drift](contextqb://playbooks/detect-security-drift) and [regression](contextqb://audits/security-regression) checks, you compare against it. Its public-surface and outside-service tables are also where the "Public surfaces and outside services" list in your `AGENTS.md` comes from ([Set Security Guardrails for Your Agent](contextqb://playbooks/set-security-guardrails-for-your-agent)).

**Who does what.** Ask the agent to draft all six tables from the repository: routes, auth code, agent configuration, environment-variable names, service integrations and data stores. Then fill in what the repository cannot show: subdomains and DNS records, dashboard settings, what you trust each service with, and the blast-radius judgments. Never put a secret's value in the inventory — names, owners and locations only.

## Before you start

You'll need:

- Access to your codebase (or your agent can read it for you)
- Access to your providers' dashboards — hosting, authentication, database, storage — or exports and screenshots of their settings
- A blank document to write your inventory

If you have a `context.qb.yaml`, pull it up — it'll speed up the discovery.

## The example in the tables

Each step below shows a short filled-in table so you can see what a finished entry looks like. The rows describe **QuoteKit**, an invented app. They are not findings about your app, and they are not a list of services or features you need.

Dana runs QuoteKit, with help from Bob, a part-time contractor who set up billing. It is a small paid web app that helps freelance designers turn a client's brief into a priced quote. Its features explain the rows you will see:

- Customers create an account and sign in with an email and password, with their Google account, or with a sign-in link sent by email. Dana uses a hosted sign-in service (Clerk) rather than building login herself.
- Customers pay a monthly subscription. A payment processor (Stripe) handles the cards and calls QuoteKit's webhook address (a URL it calls to report events) when a payment succeeds or fails.
- Accounts, quotes and uploaded brief files live in a hosted database with file storage (Supabase).
- An AI quote drafter writes quote text by sending the customer's brief to an AI model provider (OpenAI). A separate support bot answers questions from QuoteKit's help articles.
- A few partner tools fetch finished quotes through a small API, using API keys that QuoteKit issues to them.
- The app runs on a hosting platform (Vercel), whose settings hold the production secret keys.

Clerk, Stripe, Supabase, OpenAI and Vercel are real services used as recognizable examples, not recommendations. What each kind of service does is in the dated [managed services reference](contextqb://references/tools#managed-services). In your own inventory, list the features and services your app actually has, and mark a surface not applicable, with a reason, when your app doesn't have it. [Triage Your Secrets](contextqb://playbooks/triage-your-secrets) and [Harden Your Authentication](contextqb://playbooks/harden-your-authentication) continue with the same invented app.

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

| Surface     | URL/Path             | What it does          | Protected by           | Notes                  |
| ----------- | -------------------- | --------------------- | ---------------------- | ---------------------- |
| Homepage    | /                    | Marketing page        | Nothing                | Public by design       |
| API health  | /api/health          | Status check          | Nothing                | Should this be public? |
| Webhook     | /api/webhooks/stripe | Payment events        | Signature verification | Check signature logic  |
| Partner API | /api/v1/quotes       | Partners fetch quotes | Partner API key        | Should keys expire?    |

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

A few of these terms decide what you write down. A **magic link** is a sign-in link sent by email; an **OTP** (one-time passcode) is a short code sent by email or text, or shown in an app, that works once. **OAuth** lets people sign in with an account they already have elsewhere, such as Google. After sign-in, the app remembers the person with a **session cookie** or a **JWT** (JSON Web Token): a signed token the browser sends with each request. Anyone who holds a valid one is treated as that person until it expires or is revoked, which is why its duration matters. **MFA** (multi-factor authentication) asks for a second proof, such as a code from an authenticator app, in addition to the password, so a stolen password alone is not enough.

For each, write down:

| Surface         | What it does     | Provider | Session duration | MFA?      | Notes                   |
| --------------- | ---------------- | -------- | ---------------- | --------- | ----------------------- |
| Sign in         | User login       | Clerk    | 7 days           | Optional  | Should MFA be required? |
| Google sign-in  | Login via Google | Clerk    | 7 days           | At Google | Scopes: email, profile  |
| Magic link      | Emailed sign-in  | Clerk    | 10 minute link   | N/A       | Single use              |
| Password reset  | Recovery flow    | Clerk    | 1 hour link      | N/A       | Link expiry is good     |
| Partner API key | Machine access   | Custom   | Never expires    | N/A       | Should these rotate?    |

### Step 3 — List your agent capabilities

Ask: **"What can my AI agents do?"**

If you use an agentic coding tool in development:

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

| Agent               | Context         | Can read                      | Can write                    | Can execute           | Restrictions               |
| ------------------- | --------------- | ----------------------------- | ---------------------------- | --------------------- | -------------------------- |
| Dana's coding agent | Dev environment | All files                     | All files                    | Shell (with approval) | None formal                |
| Quote drafter       | Production      | The brief a customer submits  | Draft text shown to customer | N/A                   | Cannot save or send quotes |
| Support bot         | Production      | User messages, knowledge base | Nothing                      | N/A                   | Read-only by design        |

**Tip:** If your agent has no documented restrictions, that's a finding. Write it down. The fix has two layers: the tool's own permission, approval and sandbox settings, which enforce limits ([what each tool offers](contextqb://references/setup#agent-permissions)), and the security block in your `AGENTS.md`, which explains your intent ([Set Security Guardrails for Your Agent](contextqb://playbooks/set-security-guardrails-for-your-agent)).

### Step 4 — Inventory your secrets

Ask: **"What credentials does this project use?"**

Look for:

- Environment variables (`.env`, `.env.local`, deployment settings)
- API keys for your payment, authentication, database, AI and other providers
- Database connection strings
- OAuth client secrets
- Webhook signing secrets
- Service account credentials

For each secret, write down the summary below. This is a first pass; [Triage Your Secrets](contextqb://playbooks/triage-your-secrets) holds the full inventory schema and works through these same QuoteKit keys in detail.

| Secret name       | Provider | Owner      | Blast radius         | Rotation path      | Last rotated | Notes    |
| ----------------- | -------- | ---------- | -------------------- | ------------------ | ------------ | -------- |
| CLERK_SECRET_KEY  | Clerk    | Dana       | Full auth compromise | Clerk dashboard    | Never        | Critical |
| STRIPE_SECRET_KEY | Stripe   | Bob        | Payment access       | Stripe dashboard   | Never        | Critical |
| DATABASE_URL      | Supabase | None named | Full data access     | Supabase dashboard | Never        | Critical |
| OPENAI_API_KEY    | OpenAI   | Unknown    | Billing abuse        | OpenAI dashboard   | Unknown      | High     |

**Blast radius** = "If this leaks, what's the worst that happens?" Be honest.

**Rotation path** = "If I need to change this, where do I go and what breaks?"

### Step 5 — Map your third-party trust

Ask: **"What external services does this project depend on?"**

Look for:

- Authentication providers
- Payment processors
- Databases and storage
- AI model providers
- Email services
- Analytics
- Monitoring and error tracking

For each, write down:

| Service  | What it does              | What it can access                   | What we trust it with         | Fallback if compromised         |
| -------- | ------------------------- | ------------------------------------ | ----------------------------- | ------------------------------- |
| Clerk    | Authentication            | User emails, sessions                | User identity                 | None — critical dependency      |
| Stripe   | Payments                  | Customer payment data                | Billing                       | None — critical dependency      |
| Supabase | Database and file storage | Accounts, quotes, uploaded briefs    | All stored customer data      | None — critical dependency      |
| OpenAI   | AI features               | Briefs and drafts sent to it         | Brief content                 | Could switch providers          |
| Vercel   | Hosting                   | Running app code, production secrets | Serving the app, holding keys | Redeploy elsewhere, rotate keys |

### Step 6 — Identify data surfaces

Ask: **"Where does sensitive data live?"**

Look for:

- Database tables with user data
- File storage with uploaded content
- Logs that might contain PII
- Analytics that track user behaviour
- Browser storage (localStorage, cookies)
- Vector databases with embeddings
- What you send to AI providers: prompts and outputs may be retained, and training and retention defaults differ by provider and plan ([provider data use](contextqb://references/setup#provider-data-use))

For each, write down:

| Data store       | What's in it         | Sensitivity | Encrypted?         | Access control | Backup?          |
| ---------------- | -------------------- | ----------- | ------------------ | -------------- | ---------------- |
| Users table      | Email, name, ID      | High        | At rest (Supabase) | RLS enabled    | Supabase auto    |
| Uploads bucket   | Uploaded brief files | Medium      | At rest            | RLS enabled    | No               |
| Application logs | Requests, errors     | Medium      | No                 | Admin only     | 30 day retention |

**RLS** (row-level security) is a database rule that limits which rows, or stored files, each signed-in user can read or change. In QuoteKit it is what stops one customer from reading another customer's quotes, even if a page's code forgets to check. "RLS enabled" alone is not proof: the rules themselves have to say the right thing. Your agent can read them if they are kept in the project's files; otherwise you copy them from the database dashboard for the agent to review.

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
- **Not tracking secret rotation.** If you don't know when a secret was last rotated, assume it needs rotation.
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
