---
id: protecting-users-and-their-data
title: Protecting Users and Their Data
summary: Identify what needs protection, who should have access and which evidence you need before trusting the implementation.
version: 0.1.2
audience: [novice-builder, founder, operator]
journey_stage: 2
journey_rank: 40
intro: Protection starts with knowing what your application holds and what you are promising the people who use it.
related:
  - application-security-baseline
  - authentication-and-authorization
  - authentication-vs-authorization
  - building-for-yourself-vs-others
  - connecting-services-reliably
  - designing-your-apps-data
  - how-to-use-contextqb
  - map-your-attack-surface
  - plan-data-retention-and-deletion
  - preparing-for-real-users
  - secrets-and-credentials
  - set-security-guardrails-for-your-agent
  - where-your-data-lives
tags: [security, getting-started]

---

# Protecting Users and Their Data

**Plain language:** People may trust your application with work they cannot afford to lose or information they do not want others to see. Decide what needs protection and who should have access before asking the agent to build those boundaries. You can understand the decisions even when a specialist is needed to verify the implementation.

## Start with what you hold

Use [Building for Yourself vs. Building for Others](contextqb://guides/building-for-yourself-vs-others) to name the intended users, then [Where Your Data Lives](contextqb://guides/where-your-data-lives) to locate the information. A source title may be public while a note about it contains a customer's plans. Do not assume that every field in the same record has the same sensitivity.

An **asset** is something worth protecting: records, access credentials, availability or a person's work. An **actor** is a person or system interacting with it. A **trust boundary** is a point where information or an action crosses between different levels of trust. A browser request reaching a server is one example; an agent receiving access to local files is another.

Write three sentences for your feature: what someone could lose, who should be able to do what, and what must not happen. For a shared notebook, one may be “A member can read their team's notes but cannot retrieve another team's private notes.” That is specific enough to guide a check.

## Collect only information that serves the task

The local notebook can teach saving without collecting a phone number or uploading a contact list. Ask why every field and outside service is needed. Fewer unnecessary copies mean fewer places to secure, explain and eventually remove information.

Security concerns protection from unauthorized access, unwanted changes and disruption. Privacy also concerns why information is collected and how it is used or shared. An encrypted database can still contain information the product had no reason to collect. MDN's [security and privacy curriculum](https://developer.mozilla.org/en-US/curriculum/extensions/security-and-privacy/) treats both as part of responsible application design.

Use [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion) to decide how long information remains and what a deletion promise covers. Legal duties depend on your application and circumstances; this guide does not supply a universal policy or retention period.

## Separate identity from permission

A sign-in screen answers only part of the question. The app must also decide whether the signed-in person may read or change a particular record. [Authentication vs. Authorization](contextqb://briefings/authentication-vs-authorization) explains that distinction with a two-account example.

For a local single-user tool, accounts may be unnecessary, but the device, files, exports and backups still have access boundaries. If you later share it, revisit the model before sharing real information. If a browser can hide a button but the server still accepts the forbidden request, the boundary has not been enforced.

## Know what the agent can reach

A **secret** grants sensitive access, such as an API credential or signing key. An ordinary configuration value describes behavior, such as the number of rows on a page. Ask the agent to identify secret locations without printing their contents. Never paste credentials into a lesson exercise or a review report.

Apply [Set Security Guardrails for Your Agent](contextqb://playbooks/set-security-guardrails-for-your-agent) before giving the agent broad access. Written instructions and the tool's actual permission settings are different controls. Let it work with synthetic data and the capabilities needed for the task. The [Secrets & Credentials Audit](contextqb://audits/secrets-and-credentials) supplies the focused inspection when applicable.

## Read a finding as a claim that needs evidence

Imagine a report says, “Another member can read a private note.” Ask which target was inspected, which identities and records were used, what was observed, and what remains unknown. A code pattern can justify concern; a controlled test may establish a specific path. Neither justifies unapproved probing of a live service.

Keep the record identifier and expected permission in the report, using synthetic examples. Do not copy the sensitive note itself to prove exposure. Ask for a correction and a check demonstrating the intended boundary on the authorized test target.

## Leave with a protection plan you can explain

Have the agent draft a short addition to the existing feature brief: assets and locations, allowed actions, trust boundaries, required protections, verification evidence and unknowns. Use [Map Your Attack Surface](contextqb://playbooks/map-your-attack-surface) for the detailed inventory and the [Application Security Baseline Audit](contextqb://audits/application-security-baseline) for the applicable assessment; do not invent a second checklist.

If a failure could cause serious financial, health, legal or safety harm, or you cannot explain the proposed access boundary, identify the expertise needed before exposing that use. Getting qualified help is a product decision, not a failure to learn.

Before moving on, explain one protection your feature needs and one way a convincing screen could conceal its absence. Then identify the evidence that would resolve the uncertainty. “The agent says it is secure” is a starting claim, not the result.
