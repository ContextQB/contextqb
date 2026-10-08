---
id: machine-verifiable-substrate
title: Machine-Verifiable Substrate
summary: Agents are generators; verifiers are what keep them honest. Every architectural choice that gives you a mechanical verifier tightens the feedback loop and reduces silent drift.
version: 0.2.2
category: structure
audience:
  - novice-builder
  - founder
  - developer
  - agent
journey_stage: 1
journey_rank: 55
tags:
  - verifiability
  - types
  - schemas
  - agent-friendly
  - build-time
anti_patterns:
  - Accepting agent output without a mechanical check — reviewing generated code line by line instead of letting the compiler reject it.
  - Using a permissive runtime where a strict one exists (JavaScript when TypeScript is available, Python without type hints when a Python type checker is available).
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
  - agent-substrate
  - choose-a-language-stack
  - extensibility
  - failure-modes
  - maintainability
  - naming-conventions
  - new-project-foundation
  - programming-language-selection
  - retrofit-drift-detection
  - review-an-agent-workstream
  - security-drift-is-the-real-threat
  - set-up-drift-detection
  - setting-up-git-and-github
  - refactor-with-duplicates
  - untrusted-by-default
review:
  status: final
  last_reviewed: "2026-09-09"
  reviewer: "epistemology-review P2.2 (agent)"
  reviewer_notes: "2026-10-07 renewal B7 reciprocal link (0.2.2; author self-checked; independent review pending; not operator-accepted): related adds untrusted-by-default, whose schema-validation posture item now links here; body unchanged. 2026-10-07 renewal B4 reciprocal link (0.2.1; author self-checked; independent review pending; not operator-accepted): the level-5 review paragraph now links the review-an-agent-workstream prompt, closing the B3 deferral; related adds it. 2026-10-07 renewal B3 (0.2.0; author self-checked; independent review pending; not operator-accepted): the hierarchy adds automated tests (often agent-written) as a level, with the caveat that tests can encode the agent's misunderstanding, and re-assigns the last level to an independent review plus your own check of the behaviour, not line-by-line code reading; gives you one rule (not green with output shown means not done); corrects two technical slips — response.json() returns any regardless of strict mode, and the typed example now awaits before asserting — and relabels the strictness example as compiler settings, with linter rules described separately; the enforcement prompt names your project's own commands; the ML-training exception is removed; tool names point to the dated verifiers reference. Earlier notes (2026-09-09 epistemology review): R3–R7 pass on content; R8 pending P4. F-12 was resolved on 2026-09-09 (staged down to stage 1, rank 55) and is not open."
---

# Machine-Verifiable Substrate

AI agents are generators. They produce code, configurations, and content at scale. The question is not whether they will produce mistakes — they will — but whether those mistakes are caught before they ship.

The answer is verifiers: compilers, type checkers, schema validators, linters, formatters, and tests. Each verifier is a mechanical gate that rejects invalid output without requiring human review. The more verifiers you have, and the earlier they run, the tighter the feedback loop.

**The principle: choose architectures, languages, and configurations that maximise the surface area of mechanical verification.**

## The verifier hierarchy

Not all verifiers are equal. They differ in when they run and what they catch.

| Level | Verifier                                          | When it runs                           | What it catches                                                           |
| ----- | ------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| 1     | **Compiler / type checker**                       | Build time, before any execution       | Type mismatches, missing fields, unreachable code, invalid imports        |
| 2     | **Schema validator**                              | Runtime, at I/O boundaries             | Malformed payloads, missing required fields, wrong types in external data |
| 3     | **Linter / formatter**                            | Build time or pre-commit               | Style violations, common bugs, unused variables, complexity thresholds    |
| 4     | **Automated tests** (unit, integration, contract) | Before commit and in CI                | Wrong behaviour in specific cases, broken integrations and API contracts  |
| 5     | **Review**                                        | After the change, before you accept it | Logic errors, design mistakes, "it works but does the wrong thing"        |

Level 1 is the cheapest and fastest. Level 5 is the most expensive and slowest. Every error you can push to a lower level is a win.

Which tool fills each role depends on your language; the dated [verifiers reference](contextqb://references/tools#verifiers-by-language) lists the current options.

**Tests are often written by the agent too.** That makes them cheap, and it also means a test can encode the agent's misunderstanding: code and test agree with each other and are both wrong. Two habits help. Read the test _names_ as a plain-language specification ("rejects an order with no items", "refunds only the paying user") and ask about anything that doesn't match what you meant. And when you find a bug, ask the agent for a test that reproduces it _before_ the fix, so you see it fail and then pass.

**Review, for you, is not reading every line.** Level 5 is two things: an independent review (a second agent session, or another person, checking the change against the plan) and your own check of the behaviour: use the feature the way a user would and see whether it does what you asked. The [review prompt](contextqb://prompts/review-an-agent-workstream) is a ready-made instruction for the independent half.

**The one rule.** If the build, the type check, the linter and the tests have not all passed — with their output shown to you, not just reported — the work is not done.

## Why this matters for AI-assisted development

When a human writes code, they hold context in their head. They notice when something feels wrong. Agents do not have that intuition — they have what you give them: the codebase, the prompt, and the verifiers.

If the verifiers are weak, the agent's mistakes reach you. You become the verifier, reviewing every line. That does not scale.

If the verifiers are strong, the agent's mistakes are rejected before you see them. Current agents read a failing check and fix it in a loop, quickly — so every mistake a verifier can catch costs you nothing. You review logic, design and behaviour, not typos and type errors.

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
  return (await response.json()) as User;
}

const user = await getUser(123);
console.log(user.nmae); // TS2551: Property 'nmae' does not exist. Did you mean 'name'?
```

The TypeScript version catches the typo before execution. The agent gets immediate feedback; you never see the bug.

### Schema validation at boundaries

Even in TypeScript, `response.json()` returns `any` — strict mode does not change that. The type assertion `as User` is a lie — it tells the compiler to trust you, not to verify.

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

### Strict compiler and linter settings

Default settings let a lot through. The compiler's strict settings — shown below for TypeScript — reject implicit `any`, unused variables and parameters, and other loose code. A linter adds rules the compiler doesn't have, such as risky patterns and overly complex functions; those rules live in the linter's own configuration file.

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

Even here, consider partial strictness: type hints in Python cost little and catch much.

## How to ask an agent to enforce this

> Before implementing this feature, list every I/O boundary (API calls, database queries, file reads, user inputs). For each, name the schema validator that will reject invalid data. If no validator exists, create one. Then implement, ensuring the code passes this project's typecheck, lint and test commands with zero suppressions. Show me the commands you ran and their output.
