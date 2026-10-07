---
id: pricing
title: Pricing, limits and defaults (synthetic fixture)
summary: Synthetic fixture group with units and conditions. Not real data.
version: 0.1.0
audience:
  - operator
maintainer: Fixture maintainer
entries:
  - id: synthetic-api-prices
    title: API prices (synthetic)
    role: Per-unit prices for an invented API.
    status: current
    owner: Fixture editorial
    review_by: "2026-10-31"
    limits: List prices only; excludes taxes.
    facts:
      - subject: Synthetic Model M
        value: FIXTURE-PRICE 1.00
        applies_to: standard tier (fixture)
        units: fixture currency per million fixture tokens
        conditions: list price
        evidence: [p1]
    evidence:
      - id: p1
        url: "https://m.example.invalid/pricing"
        checked_on: "2026-10-05"
        source_kind: vendor-pricing
        locator: "Pricing table"
---
