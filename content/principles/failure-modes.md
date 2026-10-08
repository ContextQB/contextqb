---
id: failure-modes
title: Failure Modes
summary: Anticipate where and how systems fail. Design for graceful degradation, not just the happy path.
version: 0.2.0
category: diagnosis
audience:
  - novice-builder
  - agent
  - developer
journey_stage: 4
journey_rank: 10
tags:
  - reliability
  - error-handling
  - resilience
anti_patterns:
  - Code only handles the success case; errors crash the app or show a blank screen.
  - Network requests assume the server is always reachable and fast.
  - Race conditions are dismissed with "it probably won't happen."
  - Partial updates leave data in an inconsistent state after a failure mid-operation.
  - Error messages are logged but the user sees nothing useful.
agent_instructions:
  - Enumerate failure points before implementing (network, disk, permissions, user input, timing).
  - For each failure point, decide whether to retry, fallback, or surface an error.
  - Use timeouts on all external calls. "Wait forever" is not a strategy.
  - Prefer atomic operations; if you cannot, design explicit rollback or compensation.
  - Test failure paths, not just success paths.
related:
  - ai-output-is-untrusted-code
  - application-security-baseline
  - architectural-hardening-loop
  - feature-build-loop
  - launch-day-checklist
  - machine-verifiable-substrate
  - maintainability
  - map-your-attack-surface
  - operations-baseline
  - orchestration
  - programming-language-selection
  - public-endpoints-are-battlegrounds
  - refactor-with-duplicates
  - security-drift-is-the-real-threat
  - state-ownership
  - suspicious-behavior-investigation
  - the-plan-is-the-contract
  - think-like-an-attacker
  - untrusted-by-default
  - run-a-multi-agent-workflow
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.2 (agent)"
  reviewer_notes: "2026-10-07 renewal B5 (0.2.0; author self-checked; independent review pending; not operator-accepted): adds an external AI service row (rate limits, slow or failed responses, malformed or inconsistent structured output, outages, cost blow-ups from retries) with its strategy note — validate model output with a schema before trusting it, cap retries, degrade to a non-AI path; asks for a test per failure decision, and says injected failures need authorization and an isolated, safe target. Earlier notes (2026-09-09 epistemology review): R3–R7 pass. Failure-category table plus retry/fallback/surface/abort strategy frame is complete and compact. R8 pending P4."
---

# Failure Modes

Systems fail. Networks drop. Servers timeout. Users close the tab mid-operation. Disks fill. Permissions change. The question is not whether your code will encounter failure — it will — but whether you designed for it.

AI-generated code frequently ignores failure modes because the prompt describes what should happen, not what goes wrong. The agent optimistically generates a happy-path implementation, and the first real-world user discovers the edge case the hard way.

## Where systems fail

| Failure category        | Examples                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Network**             | Timeout, DNS failure, connection reset, slow response, partial payload                                              |
| **State**               | Stale cache, concurrent mutation, mid-write crash, schema mismatch                                                  |
| **Lifecycle**           | Component unmounts before async completes, worker killed mid-job                                                    |
| **Race conditions**     | Two users edit the same record, two requests arrive out of order                                                    |
| **Resource exhaustion** | Memory limit, disk full, rate limit, quota exceeded                                                                 |
| **Permissions**         | Token expired, scope changed, user revoked access                                                                   |
| **Input**               | Missing field, wrong type, unexpected null, injection attempt                                                       |
| **External AI service** | Rate limit, slow or failed response, malformed or inconsistent structured output, outage, cost blow-up from retries |

## Designing for failure

### 1. Enumerate failure points first

Before you write the happy path, list what can go wrong. For each external dependency, ask: what happens if it fails, is slow, or returns unexpected data?

### 2. Decide on a strategy

- **Retry** — transient failures (network blip, rate limit). Use exponential backoff.
- **Fallback** — return cached data, default value, or degraded UX.
- **Surface** — tell the user what happened and what they can do.
- **Abort** — cancel the operation cleanly and roll back any partial changes.

**When the dependency is an AI model.** A model can return a different answer each time, or output that does not match the shape you asked for. Validate model output with a schema before your code trusts it (see [Machine-Verifiable Substrate](contextqb://principles/machine-verifiable-substrate)); cap retries, because each retry costs money; and give the feature a non-AI path — a default, a cached result, or a clear "try again later" — for when the model is unavailable.

### 3. Use timeouts everywhere

An external call without a timeout is a promise to wait forever. Every fetch, every database query, every RPC should have an explicit timeout.

### 4. Prefer atomic operations

If you must touch multiple resources, design the sequence so a failure at any step either fully succeeds or fully fails. If atomicity is impossible, implement explicit compensation or rollback.

### 5. Fail visibly

Swallowing errors silently is worse than crashing. If something fails, the user or operator should know. Logging is not enough; surface the failure where it can be acted on.

## How to ask an agent to design for failure

> Before implementing this feature, enumerate the failure modes for each external call and state mutation. For each, decide whether to retry, fallback, surface an error, or abort. Document your decisions in a table. Then implement with those failure paths explicit, and add a test for each decision that simulates the failure (a timeout, an error response, malformed data) and checks that the chosen path happens.

Tests that simulate a failure are the safe default. An agent can also demonstrate a fallback by injecting a real failure — cutting a connection, stopping a service — but only with your explicit authorization, and only against an isolated target such as a local copy or a test environment, never a live service or real data.
