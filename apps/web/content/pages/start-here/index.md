---
eyebrow: Start here
headline: The ContextQB worldview, in five minutes.
subhead: >-
  AI can write the code. Someone still has to think. ContextQB is that thinking
  — a methodology, a content corpus, an MCP, and a course platform for people
  building software with agents.

problem_heading: The shape of the problem
problem_cards:
  - label: 1. The bottleneck moved.
    body: >-
      You can now produce real software in hours. The hard part is no longer
      writing the code. The hard part is keeping the system coherent while the
      agent writes it.
  - label: 2. Agents make systems worse by default.
    body: >-
      Without explicit structure, every generation makes the codebase slightly
      more tangled. You don't notice until a small feature breaks three
      unrelated things.
  - label: 3. Coherence comes from architectural decisions.
    body: >-
      Where state lives. What coordinates what. What each module is responsible
      for. How things are named. The pattern of those small decisions _is_ your
      architecture.
  - label: 4. Prompts are not enough. Architecture is.
    body: >-
      A library of clever prompts solves yesterday's problem. An explicit
      architectural backbone solves tomorrow's problems before they happen.
      ContextQB is that backbone.

path_heading: Choose your path
path_lede: >-
  ContextQB is a few different things to different people. Pick the entry point
  that matches what you're actually trying to do right now.
path_cards:
  - eyebrow: If you have an idea
    title: Start thinking like a builder
    description: >-
      Before any code, you need a working mental model of your app. The
      mental-model guide shows you how to turn an idea into something an agent
      can actually build from.
    href: /guides/the-mental-model-of-your-app
    cta: Read the mental-model guide
    external: false
  - eyebrow: If you're new to all of this
    title: Set up the basics first
    description: >-
      Git is the safety net that makes agentic coding safe. The setup guide
      walks first-time builders through installing it, picking a remote, and
      using it day-to-day with an AI agent.
    href: /guides/setting-up-git-and-github
    cta: Read the git setup guide
    external: false
  - eyebrow: If you have an agent already
    title: Plug ContextQB into your agent
    description: >-
      The MCP server exposes every principle, playbook, audit, prompt, and
      guide over the Model Context Protocol. Five minutes to install; your
      agent gains the corpus on day one.
    href: /mcp
    cta: Install the MCP
    external: false
  - eyebrow: If you want the full curriculum
    title: Take a course
    description: >-
      Self-paced courses that teach the methodology by building a real
      application end to end with an AI coding agent. First course is in
      production.
    href: /courses
    cta: See the courses
    external: false
  - eyebrow: If you want to follow along
    title: Subscribe to the newsletter
    description: >-
      The members area publishes new lessons, methodology updates, and field
      notes from real builds. Subscribe at members.contextqb.com to get them
      as they land.
    href: https://members.contextqb.com
    cta: Visit the members area
    external: true

reads_heading: Recommended reading order
reads_lede: >-
  If you're not sure where to start in the corpus, this is the order we'd send
  a friend through.
reads_items:
  - href: /guides/the-mental-model-of-your-app
    title: The Mental Model of Your App
    blurb: How to turn an idea into something an agent can build from.
  - href: /guides/choosing-your-ide-and-llm
    title: Choosing Your IDE and LLM
    blurb: >-
      Pick the workshop and the collaborator. They're separate choices, and
      that's a good thing.
  - href: /guides/setting-up-git-and-github
    title: Setting Up Git and GitHub
    blurb: The safety net that makes agentic coding survivable.
  - href: /guides/understanding-llms
    title: Understanding LLMs
    blurb: Each model has a personality. This is the field guide to recognising it.
  - href: /guides/understanding-the-context-window
    title: Understanding the Context Window
    blurb: >-
      The single most important concept in agentic coding — the brand is
      literally named for it.
  - href: /principles/separation-of-concerns
    title: "Principle: Separation of Concerns"
    blurb: The foundation everything else depends on.
  - href: /principles/state-ownership
    title: "Principle: State Ownership"
    blurb: The most common failure mode in AI-generated apps.
  - href: /principles/documentation-as-architecture
    title: "Principle: Documentation as Architecture"
    blurb: Why writing things down is load-bearing, not optional.
  - href: /playbooks/new-project-foundation
    title: "Playbook: Prepare a new repo for AI-assisted development"
    blurb: The first practical thing to do once you have an idea and a repo.
  - href: /playbooks/feature-planning
    title: "Playbook: Plan a feature before letting the agent code"
    blurb: The single highest-leverage habit in agentic coding.

closer_eyebrow: Keep going
closer_heading: You don't need to have it all figured out to start.
closer_body: >-
  The mental model is a hypothesis you refine. The methodology gives you the
  substrate that lets you refine it without losing what you've built. Pick a
  card above and go.
closer_footer: AI can write code. Someone still has to think.
meta_title: Start here
meta_description: >-
  The ContextQB worldview in five minutes, plus the logical next step for
  whatever you're trying to do.

review:
  status: needs-polish
  last_reviewed: "2026-05-27"
  reviewer: "agent:pre-audit"
  reviewer_notes: |-
    Page is structurally strong. Two improvement vectors for the copywriter:

    (1) The 5 path cards mix "imperative" cadence ("Start thinking", "Set up", "Plug ContextQB", "Take a course", "Subscribe") with prefix-styled eyebrows ("If you have an idea", "If you're new", etc.). The eyebrow→title pairing varies in tightness — "If you have an agent already / Plug ContextQB into your agent" is clean; "If you have an idea / Start thinking like a builder" is looser. Tighten to consistent cadence.

    (2) The recommended-reading blurbs are good but mix self-deprecating tone ("The safety net that makes agentic coding survivable") with neutral description ("The most common failure mode in AI-generated apps") with brand-poetic ("the brand is literally named for it"). Choose a register.

    Minor: the "If you want to follow along" card sends users to an external members.contextqb.com — that's correct but reduces the "stay-on-site" path completion rate. Worth flagging whether to keep prominent or move below.
---
