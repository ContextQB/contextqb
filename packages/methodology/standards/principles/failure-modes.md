---
id: failure-modes
title: Failure Modes
summary: Anticipate where and how systems fail. Design for graceful degradation, not just the happy path.
version: 0.1.0
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
  - state-ownership
  - orchestration
  - maintainability
---

# Failure Modes

Systems fail. Networks drop. Servers timeout. Users close the tab mid-operation. Disks fill. Permissions change. The question is not whether your code will encounter failure — it will — but whether you designed for it.

AI-generated code frequently ignores failure modes because the prompt describes what should happen, not what goes wrong. The agent optimistically generates a happy-path implementation, and the first real-world user discovers the edge case the hard way.

## Where systems fail

| Failure category        | Examples                                                               |
| ----------------------- | ---------------------------------------------------------------------- |
| **Network**             | Timeout, DNS failure, connection reset, slow response, partial payload |
| **State**               | Stale cache, concurrent mutation, mid-write crash, schema mismatch     |
| **Lifecycle**           | Component unmounts before async completes, worker killed mid-job       |
| **Race conditions**     | Two users edit the same record, two requests arrive out of order       |
| **Resource exhaustion** | Memory limit, disk full, rate limit, quota exceeded                    |
| **Permissions**         | Token expired, scope changed, user revoked access                      |
| **Input**               | Missing field, wrong type, unexpected null, injection attempt          |

## Designing for failure

### 1. Enumerate failure points first

Before you write the happy path, list what can go wrong. For each external dependency, ask: what happens if it fails, is slow, or returns unexpected data?

### 2. Decide on a strategy

- **Retry** — transient failures (network blip, rate limit). Use exponential backoff.
- **Fallback** — return cached data, default value, or degraded UX.
- **Surface** — tell the user what happened and what they can do.
- **Abort** — cancel the operation cleanly and roll back any partial changes.

### 3. Use timeouts everywhere

An external call without a timeout is a promise to wait forever. Every fetch, every database query, every RPC should have an explicit timeout.

### 4. Prefer atomic operations

If you must touch multiple resources, design the sequence so a failure at any step either fully succeeds or fully fails. If atomicity is impossible, implement explicit compensation or rollback.

### 5. Fail visibly

Swallowing errors silently is worse than crashing. If something fails, the user or operator should know. Logging is not enough; surface the failure where it can be acted on.

## How to ask an agent to design for failure

> Before implementing this feature, enumerate the failure modes for each external call and state mutation. For each, decide whether to retry, fallback, surface an error, or abort. Document your decisions in a table. Then implement with those failure paths explicit.
