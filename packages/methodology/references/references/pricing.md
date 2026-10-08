---
id: pricing
title: Pricing, limits and defaults
summary: Neutral, dated list prices for model APIs and agentic coding plans, and the numeric security defaults published by standards bodies and authentication providers. Every row carries its units and conditions. No recommendation.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
maintainer: ContextQB editorial (Travis Simpson accountable)
tags:
  - llm
  - security
entries:
  - id: model-api
    title: Model API list prices, including prompt caching
    role: Per-token list prices that providers publish for their current API models, including cached-input and cache-write prices where the provider lists them.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A provider changes a price, ends a promotional price or releases a new model generation.
    limits: Standard list prices in US dollars before tax, as shown on each provider's own pricing documentation on the check date. Excludes batch, flex, fast or priority tiers, regional or data-residency uplifts, tool and search charges, volume discounts and enterprise agreements unless a row says otherwise. Prices are not a measure of what a task costs; that depends on how many tokens the task uses.
    facts:
      - subject: Anthropic — Claude Fable 5.1
        value: Input $10; output $50; prompt-cache hits $0.25; 5-minute cache writes $12.50; 1-hour cache writes $20.
        applies_to: Claude API, standard (base) pricing
        units: USD per million tokens (MTok)
        conditions: List price. Batch API requests are 50% off; fast-mode and data-residency modifiers are not included.
        evidence: [anthropic-pricing]
      - subject: Anthropic — Claude Haiku 5.5
        value: "Prompts up to 100,000 tokens: input $0.10, output $0.50, cache hits $0.01, 5-minute cache writes $0.125, 1-hour cache writes $0.20. Prompts over 100,000 tokens: input $0.50, output $2.50, cache hits $0.05, 5-minute cache writes $0.625, 1-hour cache writes $1."
        applies_to: Claude API, standard (base) pricing
        units: USD per million tokens (MTok)
        conditions: List price; priced by prompt length. Batch API requests are 50% off.
        evidence: [anthropic-pricing]
      - subject: Anthropic — Claude Opus 5.5
        value: Input $4; output $20; prompt-cache hits $0.20; 5-minute cache writes $5; 1-hour cache writes $8.
        applies_to: Claude API, standard (base) pricing
        units: USD per million tokens (MTok)
        conditions: List price. Batch API requests are 50% off; fast mode is priced separately ($8 input, $40 output).
        evidence: [anthropic-pricing]
      - subject: Anthropic — Claude Sonnet 5.5
        value: Input $2; output $10; prompt-cache hits $0.20; 5-minute cache writes $2.50; 1-hour cache writes $4.
        applies_to: Claude API, standard (base) pricing
        units: USD per million tokens (MTok)
        conditions: List price. Batch API requests are 50% off.
        evidence: [anthropic-pricing]
      - subject: Google — Gemini 3.1 Pro Preview
        value: "Prompts up to 200k tokens: input $2.00, output $12.00 (including thinking tokens), context caching $0.20. Prompts over 200k tokens: input $4.00, output $18.00, context caching $0.40. Cache storage $4.50 per million tokens per hour."
        applies_to: Gemini Developer API, paid tier, standard pricing (not available on the free tier)
        units: USD per million tokens (storage per million tokens per hour)
        conditions: List price for a preview model. Batch prices are lower and listed separately.
        evidence: [gemini-pricing]
      - subject: Google — Gemini 3.8 Flash
        value: Input $0.75, output $3.75 (including thinking tokens) and context caching $0.075 through December 31, 2026; from January 1, 2027, input $1.50, output $7.50 and context caching $0.15. Cache storage $0.50 per million tokens per hour through December 31, 2026, then $1.00.
        applies_to: Gemini Developer API, paid tier, standard pricing; the free tier is free of charge with limited access
        units: USD per million tokens (storage per million tokens per hour)
        conditions: List price with a dated price change. Batch API is 50% cheaper on the paid tier.
        evidence: [gemini-pricing]
      - subject: OpenAI — gpt-6-astra
        value: "Short context (up to 272K input tokens): input $10.00, cached input $1.00, cache writes $12.50, output $50.00. Long context (over 272K input tokens): input $20.00, cached input $2.00, cache writes $25.00, output $75.00."
        applies_to: OpenAI API, Standard processing
        units: USD per million tokens
        conditions: List price. Regional processing endpoints add 10% for models released on or after March 5, 2026; Batch, Flex, Fast and Ultrafast are priced separately.
        evidence: [openai-pricing]
      - subject: OpenAI — gpt-6-luna
        value: "Short context (up to 272K input tokens): input $0.10, cached input $0.01, cache writes $0.125, output $0.50. Long context (over 272K input tokens): input $0.20, cached input $0.02, cache writes $0.25, output $0.75."
        applies_to: OpenAI API, Standard processing
        units: USD per million tokens
        conditions: List price. Regional processing endpoints add 10% for models released on or after March 5, 2026; Batch, Flex and Fast are priced separately.
        evidence: [openai-pricing]
      - subject: OpenAI — gpt-6.1-sol
        value: "Short context (up to 272K input tokens): input $2.00, cached input $0.10, cache writes $2.50, output $10.00. Long context (over 272K input tokens): input $4.00, cached input $0.20, cache writes $5.00, output $15.00."
        applies_to: OpenAI API, Standard processing
        units: USD per million tokens
        conditions: List price. Regional processing endpoints add 10% for models released on or after March 5, 2026; Batch, Flex and Fast are priced separately.
        evidence: [openai-pricing]
      - subject: xAI — grok-4.7
        value: Input $2.00; output $6.00.
        applies_to: xAI API (models page)
        units: USD per million tokens
        conditions: List price shown on the models page; cached-input and other modifiers not recorded here.
        evidence: [xai-models]
    evidence:
      - id: anthropic-pricing
        url: "https://platform.claude.com/docs/en/about-claude/pricing"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "Pricing > Model pricing table (Base tokens and Prompt caching columns); Fast mode pricing; Batch processing"
      - id: gemini-pricing
        url: "https://ai.google.dev/gemini-api/docs/pricing?hl=en"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "Gemini Developer API pricing > Gemini 3.8 Flash and Gemini 3.1 Pro Preview, Standard tables (Free Tier and Paid Tier columns)"
      - id: openai-pricing
        url: "https://developers.openai.com/api/docs/pricing"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "Pricing > Flagship models > Standard table; note 'Short context ≤272K input tokens. Long context >272K input tokens'; regional processing note"
      - id: xai-models
        url: "https://docs.x.ai/developers/models"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "Models > grok-4.7 card (Input, Output)"
  - id: ide-plans
    title: Agentic coding plan prices
    role: The published monthly prices of individual and team plans for agentic coding tools that lessons name.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A vendor changes its plans, prices or included usage.
    limits: Headline list prices from each vendor's pricing page on the check date. Included usage, quotas and overage rules differ between vendors and change often; they are not compared here. Annual-billing discounts, taxes and enterprise pricing are excluded.
    facts:
      - subject: Antigravity (Google)
        value: Individual plan $0 per month. Higher rate limits come with the Google AI Pro and Google AI Ultra subscriptions, whose prices are not shown on this page. Gemini Enterprise Standard and Plus plans start at $30 per seat per month for eligible customers.
        applies_to: Antigravity pricing page
        units: USD per month (per seat for Gemini Enterprise)
        conditions: List prices; rate limits apply to every plan.
        evidence: [antigravity-pricing]
      - subject: Cursor
        value: Hobby free; Pro $20 per month; Teams $40 per user per month; Enterprise custom. The page's structured offer data also lists Pro+ at $60 and Ultra at $200.
        applies_to: Cursor pricing page, monthly view
        units: USD per month (per user for Teams)
        conditions: Prices exclude taxes. Every plan includes a set amount of model usage; on-demand usage beyond it is billed in arrears.
        evidence: [cursor-pricing]
        note: The Pro+ and Ultra amounts come from the page's machine-readable offer list, which does not state a billing period; the visible card shows only the default Pro tab.
      - subject: Devin (Devin Desktop and Devin Cloud)
        value: Free $0; Pro $20 per month; Max $200 per month; Teams $80 per month for the team plan plus $40 per month per full developer seat; Enterprise by quote.
        applies_to: Devin plans and pricing page
        units: USD per month
        conditions: List prices; extra usage can be purchased at API pricing on Pro.
        evidence: [devin-pricing]
      - subject: GitHub Copilot
        value: Free $0; Pro $10 per month; Pro+ $39 per month; Max $100 per month. The page lists total monthly GitHub AI Credits of $15 (Pro), $70 (Pro+) and $200 (Max), with base credits equal to the plan price plus a variable flex allotment.
        applies_to: GitHub Copilot plans page (individual plans)
        units: USD per month
        conditions: List prices. Chat, agent mode, code review, the Copilot cloud agent and Copilot CLI consume GitHub AI Credits.
        evidence: [copilot-plans]
    evidence:
      - id: antigravity-pricing
        url: "https://antigravity.google/pricing"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "Pricing > For Individuals; Google AI Pro; Google AI Ultra; Start now via API (Gemini Enterprise)"
      - id: cursor-pricing
        url: "https://cursor.com/pricing"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "Pricing cards (Hobby, Individual, Teams, Enterprise); FAQ on usage and taxes; schema.org offers list in the page source"
      - id: devin-pricing
        url: "https://devin.ai/pricing"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "Plans and Pricing > Individual plans, Team plans and Compare Plans table"
      - id: copilot-plans
        url: "https://github.com/features/copilot/plans"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "Plans & Pricing > Pricing plans; GitHub AI Credits table (Total, Base credits, Flex allotment)"
  - id: security-defaults
    title: Numeric security defaults from standards and providers
    role: The numbers that standards bodies and authentication providers publish for password length, failed-attempt limits, session timeouts and secret rotation.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: NIST revises SP 800-63B, OWASP updates the cited cheat sheets, or a listed provider changes a default.
    limits: Quotes requirements and defaults as their publishers state them. NIST SP 800-63B-4 is written for US federal systems; OWASP cheat sheets are guidance; provider defaults apply to newly created tenants or instances and can be changed by an administrator. The right setting for an application depends on its risk; this table does not choose one.
    facts:
      - subject: Auth0 — brute-force protection default
        value: Enabled by default when a tenant is created. The default threshold is 10 incorrect login attempts from one IP address to one user identifier; a custom threshold can be set between 1 and 100.
        applies_to: Auth0 tenants (Attack Protection > Brute-force protection)
        units: failed login attempts
        conditions: Provider default; an administrator can change or disable it.
        evidence: [auth0-brute-force]
      - subject: Clerk — account lockout default
        value: New instances lock an account after 10 failed sign-in attempts and require a one-hour cooldown. The default attempt limit changed from 100 to 10 on July 6, 2026; existing instances kept their limit.
        applies_to: Clerk instances created on or after July 6, 2026
        units: failed sign-in attempts; hours
        conditions: Provider default; the attempt limit and lockout duration can be customised.
        evidence: [clerk-lockout]
      - subject: Clerk — session maximum lifetime default
        value: Maximum lifetime is enabled with a default of 7 days on newly created instances. A custom maximum lifetime and the inactivity timeout require a paid plan for production use.
        applies_to: Clerk instances (session options)
        units: days
        conditions: Provider default; either the inactivity timeout or the maximum lifetime must stay enabled.
        evidence: [clerk-sessions]
      - subject: NIST SP 800-63B-4 — failed attempts
        value: Verifiers limit consecutive failed authentication attempts on a single subscriber account to no more than 100.
        applies_to: NIST SP 800-63B-4, Rate limiting (throttling)
        units: consecutive failed attempts per account
        conditions: Normative (SHALL) where the authenticator type requires rate limiting; US federal guideline.
        evidence: [nist-800-63b-4]
      - subject: NIST SP 800-63B-4 — password composition and changes
        value: Verifiers do not impose composition rules such as required mixtures of character types, and do not require periodic password changes; a change is forced when there is evidence of compromise.
        applies_to: NIST SP 800-63B-4, Password verifiers
        units: not applicable (policy rule)
        conditions: Normative (SHALL NOT / SHALL); US federal guideline.
        evidence: [nist-800-63b-4]
      - subject: NIST SP 800-63B-4 — password length
        value: Passwords used as a single-factor authentication mechanism are at least 15 characters; passwords used only as part of multi-factor authentication are at least 8 characters; verifiers should permit a maximum length of at least 64 characters.
        applies_to: NIST SP 800-63B-4, Password verifiers
        units: characters
        conditions: Minimums are normative (SHALL); the 64-character maximum is a recommendation (SHOULD); US federal guideline.
        evidence: [nist-800-63b-4]
      - subject: NIST SP 800-63B-4 — reauthentication timeouts
        value: AAL1 overall timeout no more than 30 days, inactivity timeout optional. AAL2 overall timeout no more than 24 hours and inactivity timeout no more than 1 hour. AAL3 overall timeout no more than 12 hours and inactivity timeout no more than 15 minutes.
        applies_to: NIST SP 800-63B-4, Session management by authentication assurance level (AAL)
        units: days, hours and minutes
        conditions: AAL1 and AAL2 values are recommendations (SHOULD); the AAL3 overall limit is a requirement (SHALL) and its inactivity limit a recommendation; US federal guideline.
        evidence: [nist-800-63b-4]
      - subject: OWASP Authentication Cheat Sheet — account lockout
        value: Names three settings to balance — the lockout threshold, the observation window and the lockout duration — without prescribing numbers, and describes exponential lockout as an alternative to a fixed duration.
        applies_to: OWASP Cheat Sheet Series, Authentication Cheat Sheet
        units: not applicable (no number given)
        conditions: Guidance, not a requirement.
        evidence: [owasp-authentication]
      - subject: OWASP Secrets Management Cheat Sheet — rotation
        value: Secrets should be rotated regularly, with a lifetime from minutes to years depending on the secret's function. User credentials are excluded from regular rotation and are rotated only on suspicion or evidence of compromise.
        applies_to: OWASP Cheat Sheet Series, Secrets Management Cheat Sheet, section 2.7.2
        units: not applicable (no fixed interval)
        conditions: Guidance, not a requirement.
        evidence: [owasp-secrets]
      - subject: OWASP Session Management Cheat Sheet — idle timeouts
        value: Common idle-timeout ranges are 2–5 minutes for high-value applications and 15–30 minutes for low-risk applications; absolute timeouts depend on how long users usually use the application.
        applies_to: OWASP Cheat Sheet Series, Session Management Cheat Sheet
        units: minutes
        conditions: Guidance describing common ranges, not a requirement.
        evidence: [owasp-sessions]
      - subject: Supabase Auth — session lifetime default
        value: By default a session lasts until the user signs out or another terminating action occurs, and a user can hold unlimited sessions. Limiting session lifetime (time-boxed sessions, inactivity timeout, single session per user) is available on Pro plans and up.
        applies_to: Supabase Auth (User sessions)
        units: not applicable (no expiry by default)
        conditions: Provider default; the limits are plan-dependent.
        evidence: [supabase-sessions]
    evidence:
      - id: auth0-brute-force
        url: "https://auth0.com/docs/secure/attack-protection/brute-force-protection"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Brute-Force Protection > introduction ('By default, brute-force protection is enabled') and Brute force threshold"
      - id: clerk-lockout
        url: "https://clerk.com/docs/guides/secure/user-lockout"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Brute force attacks and locking user accounts > How account lockout works"
      - id: clerk-sessions
        url: "https://clerk.com/docs/guides/secure/session-options"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Session options > Session lifetime > Inactivity timeout and Maximum lifetime"
      - id: nist-800-63b-4
        url: "https://pages.nist.gov/800-63-4/sp800-63b.html"
        checked_on: "2026-10-07"
        source_kind: standard
        locator: "SP 800-63B-4 (page dated 26 Aug 2025): Password Verifiers; Rate Limiting (Throttling); Reauthentication requirements by AAL and the AAL summary table"
      - id: owasp-authentication
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
        checked_on: "2026-10-07"
        source_kind: standard
        locator: "Authentication Cheat Sheet > Account Lockout"
      - id: owasp-secrets
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
        checked_on: "2026-10-07"
        source_kind: standard
        locator: "Secrets Management Cheat Sheet > 2.7.2 Rotation"
      - id: owasp-sessions
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
        checked_on: "2026-10-07"
        source_kind: standard
        locator: "Session Management Cheat Sheet > Session Expiration (idle timeout ranges)"
      - id: supabase-sessions
        url: "https://supabase.com/docs/guides/auth/sessions"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "User sessions > What is a session? and Limiting session lifetime and number of allowed sessions per user"
---

Every row in this group states its units and the conditions under which the number holds. Prices are list prices in the currency shown, before tax; security numbers are quoted as their publisher states them, including whether the publisher makes them a requirement or guidance.

Rows are sorted by subject; their order is not a ranking. A lesson tells you how to decide what fits your project — this table tells you what the published numbers are on the check date.
