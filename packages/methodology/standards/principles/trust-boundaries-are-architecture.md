---
id: trust-boundaries-are-architecture
title: Trust Boundaries Are Architecture
summary: Drawing trust boundaries is a design act, not a documentation act. "Public/authenticated", "owner/admin", "user/agent", "self/third-party" — each must be named and located in the code before they can be defended.
version: 0.1.0
category: security
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 5
journey_rank: 10
tags:
  - security
  - architecture
  - trust-boundaries
related:
  - modularity
  - separation-of-concerns
  - untrusted-by-default
anti_patterns:
  - Authentication checks scattered through business logic instead of at a single boundary.
  - '"Internal" services that anyone with the URL can reach.'
  - Input validation that happens deep in the call stack, after data has already been used.
  - The same data shape passed across user, admin, and agent boundaries with no transformation.
  - A new route added to an app inherits no protections because the boundary was never declared.
agent_instructions:
  - Before writing a new route or handler, name which trust boundary it sits on.
  - For each boundary, identify exactly where the check happens — and make sure the check is the door, not a guess.
  - When data crosses a boundary, transform it; do not just pass it through.
  - Refuse to write code that "is internal" without identifying who the internals are protected from.
  - When asked to add a feature, ask which boundary it sits on before generating the code.
---

# Trust Boundaries Are Architecture

**Plain language:** Every system has invisible lines that say "this side is trusted, that side is not." If those lines aren't drawn explicitly in the code, they aren't drawn at all.

## What it is

A trust boundary is the line in your system where data, requests, or actors stop being treated as "we know what this is" and start being treated as "we have to check what this is." Common boundaries:

| Boundary             | Trusted side       | Untrusted side                              |
| -------------------- | ------------------ | ------------------------------------------- |
| **Public / Authed**  | Authenticated user | Anyone on the internet                      |
| **User / Admin**     | Admin              | Regular user                                |
| **User / Owner**     | Resource owner     | Other users                                 |
| **Self / Agent**     | Human operator     | AI agent acting on behalf of operator       |
| **Self / 3rd-party** | Your services      | Clerk, Stripe, OpenAI, anything outside you |
| **Inside / Outside** | Internal service   | Public webhook, scraper, browser            |

Each of these is a real line. Each requires a real check — at a specific file, in a specific function, with a specific input contract. "It's internal" or "they're authenticated" is not a check; it's a hope. The check is the boundary.

Trust boundaries are architecture because they decide the shape of your code. Where you draw them determines what you can compose, what you can change safely, and what surfaces an attacker has to chew on.

## Why it matters in agentic dev specifically

Agents collapse boundaries by default. The model sees the codebase as one giant text blob, and it will happily move data from a public surface into an admin surface without noticing the move. Two failure patterns dominate:

1. **Inherited protections that don't actually carry over.** The agent adds a new route. The old routes had middleware. The agent doesn't add the middleware to the new route. Nothing breaks visibly; the new route is just quietly public.

2. **Cross-boundary copy-paste.** The agent generates a handler by copying a similar one from another part of the codebase. The original was on the `owner` side of a `user / owner` boundary; the new one is on the `user` side. The check the original relied on doesn't exist on the new side.

Both failures are silent. Tests pass. The site loads. The bug is "unauthorised actor can take authorised action" — and you find it months later, or never.

The fix is to make the boundary explicit before the agent writes code. If the boundary is named — in a file, in a check, in the type system — the agent has something to align with. If the boundary lives only in the operator's head, every prompt is a chance to forget it.

## Minimum acceptable posture

You can claim this principle if all of the following hold:

1. **Every public route is explicitly marked public.** Not "everything not in the admin folder is public." Public is a positive declaration, not the absence of a declaration.

2. **Authentication is a single boundary, not a sprinkle.** There is one place where "is this request authenticated?" is decided. Downstream code reads the answer; it does not re-derive it.

3. **Admin or owner checks happen at the boundary, not in the middle.** If `/admin/foo` requires admin, the check is at the route, not buried six function calls deep where someone could route around it.

4. **Data is transformed when it crosses a boundary.** A user-controlled value coming in becomes a typed, validated domain value before any business logic touches it. A trusted internal value becomes an explicit response shape before it goes out.

5. **The agent boundary is named.** Your AGENTS.md or `context.qb.yaml` has a section that says what the agent can do that a regular user cannot, and what it cannot do that a regular operator can.

## Signals you're getting this wrong

- **You can't answer "is this route public?" without reading the code.** If the answer requires inspection rather than a declaration, the boundary doesn't exist.

- **Auth checks are scattered.** `if (req.user.role !== "admin")` appears in twelve different files. Every new route is a chance to forget the check.

- **A typo in an env var disables auth.** If renaming a config key silently makes a protected route public, the boundary is fragile by construction.

- **Third-party data flows directly into your domain.** A Stripe webhook payload becomes a `Subscription` object with no transformation step in between.

- **"Internal" is doing too much work.** If the same word covers "behind a VPN", "on the intranet", "called by another service", and "I think no one knows the URL", you're using it as a substitute for an actual boundary.

## How it relates to other ContextQB principles

**Modularity** — Modularity draws responsibility boundaries: this module does X, that module does Y. Trust boundaries cut across the same code differently: this side is trusted, that side is not. Both decompositions matter; agents tend to honour the first and ignore the second.

**Separation of Concerns** — Trust is itself a concern. Mixing "is this request allowed?" with "what does this request do?" makes both harder to reason about. The boundary is where the separation lives.

**Untrusted by Default** — That principle tells you what to do at a boundary (validate). This principle tells you where the boundaries are. They're partners — neither works alone.

## See also

- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — inventory the boundaries you already have
- [Playbook: Review Your AI Integration](contextqb://playbooks/review-your-ai-integration) — document the user / agent boundary specifically
- [Playbook: Harden Your Authentication](contextqb://playbooks/harden-your-authentication) — secure the identity boundary
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — finds undeclared and unenforced boundaries
- [Audit: Public Endpoint Exposure](contextqb://audits/public-endpoint-exposure) — finds boundaries that should exist but don't
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
