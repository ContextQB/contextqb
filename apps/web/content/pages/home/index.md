---
eyebrow: ContextQB
headline: |
  AI can write code.
  Someone still has to think.
subhead: |
  ContextQB helps non-developers and AI-native builders use agentic IDEs, MCPs, and local LLMs to create software that is coherent, maintainable, and built on common-sense architecture.

primary_cta_label: Start here
primary_cta_href: /start-here
secondary_cta_label: Install the MCP
secondary_cta_href: /mcp

problem_heading: The hardest part of AI-assisted building is not the code.
problem_paragraphs:
  - >-
    Agentic IDEs and generative coding tools have collapsed the cost of writing
    code. They have not eliminated the need for architectural thinking — they
    have amplified its absence. Without explicit structure, AI-generated
    codebases collect spaghetti faster than human-authored ones.
  - >-
    ContextQB exists to teach the missing layer: the architectural discipline
    that turns "I can make the AI generate code" into "I can direct AI to build
    a coherent system."

how_it_works_heading: How it works
how_it_works_cards:
  - title: Read the principles
    body: >-
      Learn the foundational concepts — state ownership, separation of concerns,
      naming conventions — that every coherent codebase needs.
  - title: Adopt the patterns
    body: >-
      Set up an AGENTS.md file and an ADR system in your project so agents have
      explicit operating boundaries and decisions are recorded.
  - title: Apply the playbooks
    body: >-
      Use playbooks and audits when you build. Pull them into your agent via the
      MCP, or copy them directly into your prompts.

guides_section_heading: Start with a guide
guides_section_intro: >-
  Guides are longer-form teaching frames — the kind of thinking you do before
  code, when the idea is still forming.

principles_section_heading: Core principles

audience_heading: Who it is for
audience_cards:
  - title: Founders building with AI
    body: >-
      You're using Cursor or similar tools to ship quickly, but your codebase is
      becoming harder to maintain. ContextQB teaches you the minimum
      architectural discipline needed to keep AI-generated code coherent.
  - title: Operators supervising agents
    body: >-
      You review and approve AI-generated code but don't write it yourself.
      These principles and audits give you a framework for evaluating whether
      the code is sound.
  - title: Novice developers
    body: >-
      You can prompt an AI to generate code, but you don't know what good
      structure looks like. ContextQB fills the gap that tutorials skip.
  - title: Experienced developers with AI tools
    body: >-
      You know architecture but want a shared vocabulary to teach agents. Use
      the MCP to pull principles into your prompts; use the audits as quality
      gates.

playbooks_section_heading: Featured playbooks
audits_section_heading: Audit templates

mcp_cta_eyebrow: ContextQB MCP
mcp_cta_heading: Bring these resources into any agent.
mcp_cta_body: >-
  The ContextQB MCP server exposes every guide, principle, playbook, audit, and
  prompt through the Model Context Protocol. Drop it into Cursor, Claude
  Desktop, or any MCP-aware tool, and your agent can pull architectural
  standards in by URI.
mcp_cta_label: MCP setup →
mcp_cta_href: /mcp

meta_title: ""
meta_description: ""

review:
  status: needs-polish
  last_reviewed: "2026-05-27"
  reviewer: "agent:pre-audit"
  reviewer_notes: |-
    Hero copy is sharp and on-brand. Two areas the copywriter should focus on:

    (1) "How it works" cards skim past the value of each step — they describe what you do, not why it pays off. e.g., card 1 ("Read the principles") could go from "Learn the foundational concepts" to something that signals the payoff for the reader's actual goal.

    (2) "Who it is for" cards repeat similar structure ("You X, but Y, so ContextQB Z"). A copywriter might want to vary cadence and lead with stronger differentiation between the four audiences, especially "Novice developers" vs "Founders building with AI" which currently sound adjacent.

    Other notes: problem statement is fine; MCP CTA is fine; section headings under auto-generated grids ("Start with a guide", "Core principles", "Featured playbooks", "Audit templates") are functional but generic. Worth considering punchier alternatives.
---
