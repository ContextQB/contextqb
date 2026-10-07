---
id: tools
title: Tools and agent environments (synthetic fixture)
summary: Synthetic fixture group exercising every entry state. Not real data.
version: 0.1.0
audience:
  - operator
  - agent
maintainer: Fixture maintainer
review:
  status: draft
  last_reviewed: "2026-10-10"
  reviewer: "fixture review"
entries:
  - id: synthetic-coding-agents
    title: Coding agents (synthetic)
    role: Which synthetic tools ask before running shell commands.
    status: current
    owner: Fixture editorial
    review_by: "2026-11-08"
    limits: Does not compare quality or price.
    facts:
      - subject: Synthetic Tool B
        value: FIXTURE-VALUE-B asks before every shell command.
        applies_to: version 9 (fixture)
        evidence: [e1]
        note: Default setting in the fixture.
      - subject: Synthetic Tool A
        value: FIXTURE-VALUE-A offers an allow list.
        applies_to: all plans (fixture)
        evidence: [e2]
    evidence:
      - id: e1
        url: "https://b.example.invalid/docs/permissions"
        checked_on: "2026-10-08"
        source_kind: vendor-docs
        locator: "Permissions > Defaults"
      - id: e2
        url: "https://a.example.invalid/docs/allow-list"
        checked_on: "2026-10-09"
        source_kind: vendor-docs
        locator: "Allow lists"
  - id: synthetic-trigger-only
    title: Trigger-reviewed entry (synthetic)
    role: A current entry reviewed on a trigger instead of a date.
    status: current
    owner: Fixture editorial
    review_trigger: When the synthetic vendor publishes a new major version.
    limits: Fixture only.
    facts:
      - subject: Synthetic Tool A
        value: FIXTURE-VALUE-TRIGGER supports a read-only mode.
        applies_to: version 3 (fixture)
        evidence: [t1]
    evidence:
      - id: t1
        url: "https://a.example.invalid/docs/read-only"
        checked_on: "2026-10-01"
        source_kind: vendor-docs
        locator: "Modes"
  - id: synthetic-older-agents
    title: Older coding agents (synthetic)
    role: A legacy entry describing an older version.
    status: legacy
    owner: Fixture editorial
    limits: Describes version 8 only.
    replaced_by: tools#synthetic-coding-agents
    facts:
      - subject: Synthetic Tool B
        value: FIXTURE-VALUE-LEGACY asked only for destructive commands.
        applies_to: version 8 (fixture)
        evidence: [l1]
    evidence:
      - id: l1
        url: "https://b.example.invalid/docs/v8/permissions"
        checked_on: "2026-09-20"
        source_kind: release-notes
        locator: "Version 8 notes"
  - id: synthetic-unverified
    title: Unverified candidates (synthetic)
    role: Shows how an unchecked candidate renders.
    status: unverified
    owner: Fixture editorial
    facts:
      - subject: Synthetic Tool C
        note: Candidate identity only.
      - subject: Synthetic Tool D
    leads:
      - url: "https://lead-canary.example.invalid/docs"
        note: LEAD-CANARY not yet checked.
  - id: synthetic-retired
    title: Retired entry (synthetic)
    role: A tombstone with a replacement.
    status: withdrawn
    owner: Fixture editorial
    withdrawn_on: "2026-10-10"
    withdrawn_reason: Fixture tombstone with a replacement.
    replaced_by: tools#synthetic-coding-agents
  - id: synthetic-retired-alone
    title: Retired entry without replacement (synthetic)
    role: A tombstone with no replacement.
    status: withdrawn
    owner: Fixture editorial
    withdrawn_on: "2026-10-11"
    withdrawn_reason: Fixture tombstone with no successor.
---

This synthetic group exercises every entry state. It is test data, not a reference.
