---
id: security-drift-is-the-real-threat
title: Security Drift Is the Real Threat
summary: Most breaches come from changes that bypassed earlier protections, not from never having protections. A passing audit on Tuesday is not a passing audit on Friday. Continuous drift detection beats one-time hardening.
version: 0.1.0
category: security
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 7
tags:
  - security
  - drift
  - continuous-verification
related:
  - documentation-as-architecture
  - machine-verifiable-substrate
  - failure-modes
anti_patterns:
  - A single security audit at launch, never repeated.
  - A new feature ships and inherits no security review because "the audit already passed."
  - Secrets are added to the codebase but never rotated; no record exists of when they were last rotated.
  - Auth middleware exists but no automated check confirms it wraps every new route.
  - The "security checklist" lives in someone's head and is consulted by memory.
agent_instructions:
  - After any non-trivial change, identify what about the security posture moved.
  - When adding a route, integration, or capability, record it in the project's declared security shape.
  - Refuse to weaken a protection without naming the trade-off explicitly.
  - Surface drift candidates proactively — new public endpoints, removed auth checks, new third-party calls.
  - Treat "we audited this last quarter" as background, not as evidence the change you just made is safe.
---

# Security Drift Is the Real Threat

**Plain language:** Security is not a checklist you complete. It's a state you maintain — and it drifts every time someone (or something) changes the code.

## What it is

Security drift is the gap between the protections you think your system has and the protections it actually has, right now. The gap opens slowly, one change at a time:

- A new route added without the middleware everything else uses
- An "internal" service that quietly became reachable from the internet
- A secret rotated everywhere except one forgotten config file
- A feature flag that disabled rate limiting "temporarily" and never got turned back on
- An agent capability added for one task and never revoked
- A third-party integration added without anyone updating the trust map

Each individual change looks safe. The drift is what they add up to.

Drift is the real threat because:

1. **Static audits go stale immediately.** The audit is a snapshot. The system mutates. By the time you act on the audit, you're acting on a description of the past.
2. **New code rarely inherits old protections automatically.** Unless the architecture makes inheritance mechanical (a single middleware, a declared shape, a type system check), every new feature is a chance to forget.
3. **The change pace is the threat.** Agentic dev makes change cheap. Cheap change without cheap verification produces fast drift.

So the centre of gravity for application security is not "do we have protections?" — it's "are our protections still in place against the system as it exists right now?"

## Why it matters in agentic dev specifically

Agentic systems amplify drift in three concrete ways:

1. **Iteration speed outruns review.** Agents can produce ten meaningful changes in the time it takes a human to read one. If your security review is linear in the human's reading speed, you've fallen behind by lunchtime.

2. **Inherited protections are the agent's blind spot.** When an agent generates a new route, it does not automatically apply the middleware that every other route uses. Unless the architecture makes the middleware load-bearing (it can't be skipped without a build error), the new route is silently weaker.

3. **The diff is not the right unit.** A diff that adds a public endpoint is small. A diff that removes an auth check is small. A diff that adds a third-party API key is small. None of these stand out next to a sea of trivial changes, but each is a posture change. The unit that matters is "what changed about our security shape" — not "what changed in the file system."

The discipline this principle requires is to **declare the security shape explicitly** and check the system against it on every change. Declared shape + automated diff is the only way to keep up.

## Minimum acceptable posture

You can claim this principle if all of the following hold:

1. **You have a declared security shape.** Somewhere — a Markdown checklist, a `security:` section in `context.qb.yaml` when that ships, an architecture doc — there is an explicit description of what's public, what's authed, what's privileged, and what the trust relationships are.

2. **You check that shape against reality periodically.** Quarterly at a minimum; per-release ideally; per-change in steady state. The check is something you actually do, not something on the roadmap.

3. **New attack surfaces are recorded as they ship.** When you add a public endpoint, you update the declared shape in the same change. The shape is not a separate task.

4. **You can answer "when did this last change?"** for the security-relevant parts of your system. New routes have a date. Secret rotations have a date. Trust relationships have a date.

5. **Refusals are recorded.** If a security check blocked something — a deploy, a PR, a CI job — that refusal lives somewhere reviewable, not just as a transient error.

## Signals you're getting this wrong

- **You audit once, then never again.** A launch audit exists; nothing since.
- **"We checked that already."** A protection assumed without re-verification against the current code.
- **No one knows when secrets were last rotated.** "I think Stripe was last year? Maybe?"
- **New features look the same as old features.** Public endpoint, no extra thought, no extra check.
- **Your auth middleware is opt-in.** Routes have to remember to apply it; nothing breaks if they don't.
- **Production incidents trace back to "small" changes.** The post-mortem says "this should have been caught." The next post-mortem will say the same thing.

## How it relates to other ContextQB principles

**Documentation as Architecture** — A declared security shape is documentation in the load-bearing sense: the doc and the system disagreeing is a bug. This principle says the disagreement is a security bug specifically.

**Machine-Verifiable Substrate** — The whole reason `context.qb.yaml` and the drift detector exist. This principle is the security generalisation of the drift detection thesis: declare shape, check mechanically, fail loudly. The eventual `security:` section in `context.qb.yaml` is exactly the substrate this principle calls for.

**Failure Modes** — Drift is a failure mode of the security posture itself. Naming it as one is what lets you design for it (continuous verification, declared shape) rather than hope it doesn't happen.

## See also

- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — produce the first declared shape
- [Playbook: Detect Security Drift](contextqb://playbooks/detect-security-drift) — operational workflow for catching drift
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — the static audit that the declared shape lets you re-run cheaply
- [Audit: Security Regression](contextqb://audits/security-regression) — change-focused audit comparing current state to baseline
- [`packages/qb/spec/ROADMAP.md`](../../../qb/spec/ROADMAP.md) — the planned `security:` section that operationalises this principle
- [Principle: Machine-Verifiable Substrate](contextqb://principles/machine-verifiable-substrate)
