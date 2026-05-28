---
eyebrow: contextqb check
headline: |
  An agent with a stale map
  is worse than an agent with no map.
subhead: >-
  Your `context.qb.yaml` is the file your AI agent reads first. It is the
  play-sheet — the project's map, written for an assistant that hasn't seen
  this repo before. **contextqb check** is the watchdog that keeps it true.
  Run it locally, wire it into your build, and your agent will never read a
  file that disagrees with reality.
hero_banner_label: This is an early version.
hero_banner_body: >-
  The drift detector is designed for builders who are _starting a new project_
  with the ContextQB conventions in place. It assumes a specific layout (see
  below). If you have an existing project that's laid out differently, the
  tool won't work out of the box yet — we plan to make it adaptable in a
  future release.
hero_cta_install_label: Install in 30 seconds
hero_cta_install_href: "#install"
hero_cta_watches_label: See what it watches
hero_cta_watches_href: "#what-it-watches"

problem_eyebrow: The problem it solves
problem_heading: Maps don't update themselves.
problem_paragraphs:
  - >-
    You add a package. You move a route. You record an architectural decision.
    Your project keeps changing — but the file your agent reads at the start
    of every session is the one you wrote three weeks ago. The map drifts away
    from the territory.
  - >-
    A confused agent is a manageable problem. A confident agent reading a
    wrong map is the failure mode that wastes hours and lands bad code.
    _contextqb check_ exists so that drift becomes a build-time error instead
    of a runtime surprise.

demo_eyebrow: In your terminal
demo_heading: Three seconds to know whether your map is honest.
demo_ok_label: When everything matches
demo_drift_label: When something drifted
demo_postscript: >-
  Every finding points at a specific line, names the exact key, and explains
  what to fix. No grep. No guesswork.

watches_eyebrow: What it watches
watches_heading: Three things, three sources of truth.
watches_lede: >-
  The detector doesn't guess. For each of the three sections it watches,
  there is exactly one canonical source in your repo that owns the answer.
  The detector compares the two and reports the difference.
watches_cards:
  - token: "tree:"
    title: Your project structure
    body: >-
      The `tree:` section names every workspace in your project. The source of
      truth is your `pnpm-workspace.yaml` (or equivalent).
    postscript: >-
      Add a package, forget to declare it, and your agent thinks the package
      doesn't exist. The detector catches this.
  - token: "routes:"
    title: Your domains and apps
    body: >-
      The `routes:` section maps each public domain to the app that owns it.
      The source of truth is your `wrangler.jsonc` (or equivalent deploy
      config).
    postscript: >-
      Move a route from one app to another, forget to update the map, and
      your agent proposes changes to the wrong codebase. The detector catches
      this.
  - token: "decisions:"
    title: Your architectural decisions
    body: >-
      The `decisions:` section indexes your ADRs by id and status. The source
      of truth is the ADR files themselves in
      `docs/architecture/decisions/`.
    postscript: >-
      Mark an ADR as superseded, forget to update the map, and your agent
      treats a retired decision as live. The detector catches this.

scope_eyebrow: Today, this is for new projects
scope_heading: The current version is for builders starting from scratch.
scope_intro: >-
  ContextQB is opinionated about how a project is laid out. The drift
  detector enforces those opinions by looking in three specific places:
scope_bullets:
  - "`pnpm-workspace.yaml` at the repo root"
  - "`apps/*/wrangler.jsonc` for Cloudflare Workers deployments"
  - "`docs/architecture/decisions/0NNN-*.md` for ADRs"
scope_right_paragraphs:
  - >-
    These conventions are part of the ContextQB methodology. If you're
    starting a new project and adopt them, the detector works the moment you
    install it. **No configuration needed.**
  - >-
    If you have an existing repo with a different layout — yarn workspaces,
    Vercel deploys, ADRs in `docs/adr/`, anything else — the tool won't see
    your sources of truth yet. Making it adaptable to existing repos is on
    the roadmap once we've validated the conventions in the field. For now,
    this is for greenfield work.

fits_eyebrow: Where it lives
fits_heading: Three places, one truth.
fits_cards:
  - title: On your laptop
    body: >-
      Run `pnpm check:qb` before every commit. It takes under three seconds.
      If your map is honest, you commit. If it's not, you know exactly what
      to fix.
  - title: In your CI
    body: >-
      The detector exits non-zero on drift, so adding it to your pipeline is
      a one-line change. Pull requests that ship code without updating the
      map don't merge.
  - title: In your agent
    body: >-
      When your agent reads `context.qb.yaml` at the start of a session, it's
      reading a file that passed the check. Its mental model is true.
      Sessions stop opening with a stale snapshot.

install_eyebrow: Get started
install_heading: Run it in your ContextQB-shaped repo.
install_lede: >-
  The detector lives in the ContextQB monorepo today. The standalone
  `@context-qb/cli` npm package is on the roadmap; until then, the workflow
  below works from inside a checkout of the ContextQB repo.
install_steps:
  - title: Make sure your repo has a `context.qb.yaml`
    body: >-
      No file yet? Start from one of the [worked examples](/examples) and
      adapt it to your project. Most repos need fewer than 100 lines.
  - title: Run the check
    body: >-
      `pnpm check:qb` runs in under three seconds. Exit code 0 means clean;
      exit code 1 means drift; exit code 2 means the file is missing or
      malformed.
  - title: Wire it into your pipeline
    body: >-
      The repo already chains `check:qb` into `pnpm validate`, which runs
      `validate:content`, `validate:qb`, and `check:qb` together. Run
      `pnpm validate` before every commit, or wire it into a CI job that
      runs on every pull request. A GitHub Action template that does the CI
      side in one file is on the roadmap.

json_eyebrow: For your CI scripts
json_heading: A stable JSON contract for the pipeline.
json_paragraphs:
  - >-
    Add `--json` and the detector emits a deterministic
    `{ findings, summary }` shape. Sorted by line. Stable across versions.
    `jq`-friendly. Built so a CI script or an IDE extension can parse it
    without scraping terminal output.
  - >-
    The contract is exercised by a regression test that lives in the
    repository, so the shape can't drift accidentally.

closer_eyebrow: Why this matters
closer_heading: The detector is what makes the map worth writing.
closer_paragraphs:
  - >-
    Writing a good `context.qb.yaml` takes twenty minutes. Keeping it current
    as your project changes takes attention you don't have. Without a
    watchdog, every map becomes a stale map within a month, and every stale
    map becomes a confidently-wrong AI agent.
  - >-
    **contextqb check** turns staleness from "something I'll notice
    eventually" into "the build is red until you fix it." That single shift
    is the difference between a map that decays and a map your agent can
    actually trust.
closer_cta_examples_label: See example context.qb.yaml files →
closer_cta_examples_href: /examples
closer_cta_mcp_label: Pair with the MCP →
closer_cta_mcp_href: /mcp

meta_title: Check — keep your context.qb.yaml honest
meta_description: >-
  contextqb check is the drift detector for your project's context.qb.yaml.
  It catches the moment your map stops matching your territory, so your AI
  agent never reads a stale file.

review:
  status: draft
  last_reviewed: "2026-05-27"
  reviewer: "agent:pre-audit"
  reviewer_notes: |-
    This is the most densely-written marketing page on the site and the most fully formed. Specific items the copywriter should consider:

    (1) The two-line hero ("An agent with a stale map / is worse than an agent with no map.") is excellent — punchy, asymmetric, memorable. Keep.

    (2) "The detector is what makes the map worth writing." (closer heading) is also strong. The closer overall is the page's best section — the build is red until you fix it framing earns the reader's attention.

    (3) The "Honest scope" / Option B in practice section reads as defensive ("we only handle X, not Y"). The defensiveness is honest but takes a lot of real estate. Consider whether it's better placed as a sidebar/callout rather than a full section, or whether the same information could be a sentence in the install section.

    (4) "Three things, three sources of truth" and "Three places, one truth" both use "three" in their headings, separated by only one section. The rhyme is intentional but reads as a tic on a second pass.

    (5) "Add — json and the detector emits a deterministic { findings, summary } shape" — the JSON-contract section is technical and probably outside the copywriter's wheelhouse. Mark as final-from-copywriter-perspective; ENG owns this section.

    (6) The hero status banner explaining "this is an early version, designed for greenfield work" is structurally important but slightly stops the page's momentum right after the hero. Consider moving it to just above the install section instead — readers who are decided don't need to be told it's early; readers who are evaluating already learned the constraint from the (separate, fuller) "Honest scope" section.
---
