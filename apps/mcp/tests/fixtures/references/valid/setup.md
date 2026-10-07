---
id: setup
title: Setup, compatibility and controls (synthetic fixture)
summary: Synthetic fixture group with a configuration snippet. Not real data.
version: 0.1.0
audience:
  - operator
  - agent
maintainer: Fixture maintainer
entries:
  - id: synthetic-client-config
    title: Client configuration (synthetic)
    role: The anonymous configuration shape for an invented client.
    status: current
    owner: Fixture editorial
    review_by: "2026-12-01"
    limits: Anonymous configuration only; token-bearing output comes from the CLI.
    facts:
      - subject: Synthetic Client S
        value: FIXTURE-VALUE-SNIPPET accepts a remote server URL.
        applies_to: version 2 (fixture)
        evidence: [s1]
        snippet:
          language: json
          text: '{ "servers": { "example": { "url": "https://server.example.invalid/mcp" } } }'
    evidence:
      - id: s1
        url: "https://s.example.invalid/docs/remote-servers"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Remote servers"
    further_reading:
      - title: Synthetic external analysis
        url: "https://articles.example.invalid/analysis"
        published_on: "2026-10-02"
        kind: external-analysis
---
