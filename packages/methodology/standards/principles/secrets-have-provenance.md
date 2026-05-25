---
id: secrets-have-provenance
title: Secrets Have Provenance
summary: Every secret in your system — API key, token, password, certificate — has an origin, an owner, a scope, and an expiry. If you cannot name all four, the secret is unmanaged, and unmanaged secrets leak.
version: 0.1.0
category: security
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 5
tags:
  - security
  - secrets
  - credentials
related:
  - state-ownership
  - documentation-as-architecture
  - untrusted-by-default
anti_patterns:
  - API keys pasted directly into source code.
  - A single "admin" API key used for all environments.
  - Secrets shared in Slack, email, or chat logs.
  - No record of who created a key or when.
  - Keys that never rotate and never expire.
  - Environment variables set manually on production servers with no audit trail.
agent_instructions:
  - Never write secrets directly into code, config files, or documentation.
  - When you encounter a secret in code, flag it immediately and propose moving it to environment variables or a secrets manager.
  - When creating infrastructure that requires secrets, specify where the secret will come from and who will provision it.
  - Before using a third-party API, confirm the authentication approach and document the key's scope.
  - Treat secret exposure as a security incident, not a minor bug.
---

# Secrets Have Provenance

**Plain language:** Every API key, password, and token in your system should have a paper trail — who created it, why, what it can access, and when it should be replaced. If you cannot answer those questions, the secret is out of control.

## What it is

A secret is any credential that grants access: API keys, database passwords, JWT signing keys, OAuth tokens, certificates, encryption keys. Secrets are the keys to your kingdom. An attacker with your secrets has everything you have.

Provenance means you can trace a secret from creation to use:

- **Origin:** Where did this secret come from? Who created it and when?
- **Owner:** Who is responsible for this secret today? Who rotates it?
- **Scope:** What does this secret grant access to? Which environments, which resources?
- **Expiry:** When does this secret expire? When was it last rotated?

If you cannot answer these four questions for every secret in your system, you have unmanaged secrets. Unmanaged secrets are the most common cause of security incidents in production systems.

## Why it matters in agentic dev specifically

When you build with an AI agent, secrets become more dangerous in several ways:

1. **Agents copy-paste secrets.** If you tell an agent "use the Stripe API," it might helpfully paste your API key into the code to "make it work." Now your key is in version control, readable by anyone with repo access, and one `git push` away from GitHub's secret scanning alert — or worse, no alert at all.

2. **Agents don't distinguish environments.** An agent does not know the difference between your development key and your production key unless you tell it. If you pass it a production key during development, it will use it.

3. **Agents persist context.** If you paste a secret into a chat, that secret may be stored in the conversation history, logged by the provider, or visible in session playback. The context window is not a vault.

4. **Agents create infrastructure.** When an agent provisions a database, sets up a CI workflow, or configures a deployment, it may generate new secrets. If those secrets are not documented, you have no idea what access exists.

5. **Agents work fast.** The speed that makes agents useful also means a secret leak can propagate to production in minutes. There is no human in the loop to notice that a hardcoded key is about to ship.

## Minimum acceptable posture

You can claim this principle if you meet all of the following:

1. **Secrets never appear in code or version control.** Use environment variables, secrets managers (like AWS Secrets Manager, Doppler, or 1Password for teams), or encrypted config files. A secret in a Git commit is a secret forever — even deleted commits can be recovered.

2. **Each secret has a documented owner.** Someone knows this secret exists, knows what it accesses, and knows they are responsible for rotating it. This can be a spreadsheet, a secrets manager with metadata, or a section in your architecture docs — but it must exist.

3. **Secrets are scoped to their use.** A production database password is not used in development. A read-only analytics key does not have write access. When a third party offers fine-grained permissions, you use them.

4. **Secrets rotate on a schedule.** If a secret has never been rotated, it has been exposed for its entire lifetime. Annual rotation is a minimum; high-value secrets rotate more frequently. You know when each secret was last rotated.

5. **Secret exposure is an incident.** If a secret appears in logs, chat, a public repo, or anywhere it should not be, you treat it as a security incident: revoke immediately, rotate, and audit what happened.

## Signals you're getting this wrong

- **You don't know how many API keys you have.** If someone asks "which third-party services have credentials in production?", you have to grep the codebase or check each service manually.

- **You cannot revoke a key without breaking production.** If rotating a key requires a deployment, you have a secret management problem.

- **Keys are "shared" in DMs.** If onboarding a new teammate involves sending them a Slack message with passwords, those passwords are now in Slack's logs forever.

- **A single key works everywhere.** If your Stripe key works in development, staging, and production, you have no isolation. A dev mistake can charge real customers.

- **You have "legacy" keys no one understands.** If a key exists but no one knows what it does, it is either unnecessary (delete it) or critical (document it).

## How it relates to other ContextQB principles

**State Ownership** — A secret is a piece of state. Like all state, it must have a single owner. The principle of state ownership says "name the owner"; secrets provenance says "name the owner, origin, scope, and expiry."

**Documentation as Architecture** — Secret provenance is documentation. If it is not written down, it does not exist. Your secrets inventory is an architectural document, not a nice-to-have.

**Untrusted by Default** — Secrets are trust. A secret proves identity or grants access. The "untrusted by default" principle says "validate at the boundary." Secrets provenance says "ensure the boundary has valid credentials to validate."

## See also

- [Playbook: Triage Your Secrets](contextqb://playbooks/triage-your-secrets) — operational workflow to inventory and audit your secrets
- [Audit: Secrets & Credentials](contextqb://audits/secrets-and-credentials) — structured agent review of your secrets posture
- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents) — why agents should have minimal scoped keys
- [Principle: Security Drift Is the Real Threat](contextqb://principles/security-drift-is-the-real-threat) — why rotation and auditing matter
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
