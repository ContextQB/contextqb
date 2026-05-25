---
id: machine-verifiable-substrate
title: Machine-Verifiable Substrate
summary: Agents are generators; verifiers are what keep them honest. Every architectural choice that gives you a mechanical verifier tightens the feedback loop and reduces silent drift.
version: 0.1.0
category: structure
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 4
tags:
  - verifiability
  - types
  - schemas
  - agent-friendly
  - build-time
anti_patterns:
  - Accepting agent output without a mechanical check — reviewing generated code line by line instead of letting the compiler reject it.
  - Using a permissive runtime where a strict one exists (JavaScript when TypeScript is available, Python without type hints when Pyright/mypy is available).
  - Trusting string-typed data across boundaries instead of validating with a schema.
  - Disabling strict modes, suppressing lints, or skipping CI to "move fast."
  - Treating tests as the only verifier when compile-time checks are available.
agent_instructions:
  - Prefer languages and configurations with compile-time type checking over dynamic alternatives.
  - At every I/O boundary (API call, database query, file read, user input), validate with a schema; do not trust raw data.
  - Enable strict modes in compilers and linters; do not disable them to silence errors.
  - When generating code, ensure it passes all mechanical verifiers before presenting it as complete.
  - If the project has CI gates (typecheck, lint, test), treat a failing gate as a failing change.
related:
  - programming-language-selection
  - naming-conventions
  - maintainability
  - failure-modes
  - extensibility
---

# Machine-Verifiable Substrate

AI agents are generators. They produce code, configurations, and content at scale. The question is not whether they will produce mistakes — they will — but whether those mistakes are caught before they ship.

The answer is verifiers: compilers, type checkers, schema validators, linters, formatters, and tests. Each verifier is a mechanical gate that rejects invalid output without requiring human review. The more verifiers you have, and the earlier they run, the tighter the feedback loop.

**The principle: choose architectures, languages, and configurations that maximise the surface area of mechanical verification.**

## The verifier hierarchy

Not all verifiers are equal. They differ in when they run and what they catch.

| Level | Verifier                    | When it runs                          | What it catches                                                           |
| ----- | --------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| 1     | **Compiler / type checker** | Build time, before any execution      | Type mismatches, missing fields, unreachable code, invalid imports        |
| 2     | **Schema validator**        | Runtime, at I/O boundaries            | Malformed payloads, missing required fields, wrong types in external data |
| 3     | **Linter / formatter**      | Build time or pre-commit              | Style violations, common bugs, unused variables, complexity thresholds    |
| 4     | **Contract test**           | CI, against real or mock dependencies | Integration mismatches, broken API contracts                              |
| 5     | **Human review**            | Pull request, post-generation         | Logic errors, design mistakes, domain-specific correctness                |

Level 1 is the cheapest and fastest. Level 5 is the most expensive and slowest. Every error you can push to a lower level is a win.

## Why this matters for AI-assisted development

When a human writes code, they hold context in their head. They notice when something feels wrong. Agents do not have that intuition — they have what you give them: the codebase, the prompt, and the verifiers.

If the verifiers are weak, the agent's mistakes reach you. You become the verifier, reviewing every line. That does not scale.

If the verifiers are strong, the agent's mistakes are rejected before you see them. The agent iterates until the build passes. You review logic and design, not typos and type errors.

## Worked examples

### TypeScript over JavaScript

```js
// JavaScript — no verifier
function getUser(id) {
  return fetch(`/api/users/${id}`).then((r) => r.json());
}

const user = await getUser(123);
console.log(user.nmae); // typo — no error until runtime
```

```ts
// TypeScript — compile-time verifier
interface User {
  id: number;
  name: string;
}

async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json() as User;
}

const user = await getUser(123);
console.log(user.nmae); // TS2551: Property 'nmae' does not exist. Did you mean 'name'?
```

The TypeScript version catches the typo before execution. The agent gets immediate feedback; you never see the bug.

### Schema validation at boundaries

Even in TypeScript, `response.json()` returns `any` (or `unknown` in strict mode). The type assertion `as User` is a lie — it tells the compiler to trust you, not to verify.

```ts
// Unverified boundary — runtime surprises
const data = (await response.json()) as User; // hope the API is right

// Verified boundary — schema rejects invalid payloads
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const data = UserSchema.parse(await response.json()); // throws if invalid
```

The schema validator is a Level 2 verifier. It runs at runtime, but it runs at the boundary — before invalid data propagates through your system.

### Strict linter configurations

A linter can catch what the compiler cannot: unused variables, implicit `any`, missing return types, overly complex functions.

```json
// tsconfig.json — strict mode
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

Every flag you enable is a verifier you add. The agent's output must satisfy all of them.

## The cost of permissive substrates

A permissive substrate is one where invalid output can ship without mechanical rejection. Examples:

- **Plain JavaScript** — no types, no compile step, errors only at runtime.
- **Python without type hints** — the interpreter accepts anything.
- **YAML/JSON config files without schema** — typos become runtime surprises.
- **APIs without request/response validation** — malformed payloads propagate silently.

In a permissive substrate, you are the verifier. Every line the agent writes must be reviewed for correctness. That is a tax you pay on every generation, forever.

## When permissive substrates are acceptable

Not every context justifies a strict substrate:

- **Notebooks and exploratory analysis** — the goal is iteration speed, not production durability.
- **One-off scripts** — if it runs once and is discarded, verification overhead may exceed value.
- **ML training loops** — the model is the verifier; the code is scaffolding.

Even here, consider partial strictness: type hints in Python cost little and catch much.

## How to ask an agent to enforce this

> Before implementing this feature, list every I/O boundary (API calls, database queries, file reads, user inputs). For each, name the schema validator that will reject invalid data. If no validator exists, create one. Then implement, ensuring the code passes `pnpm typecheck` and `pnpm lint` with zero suppressions.
