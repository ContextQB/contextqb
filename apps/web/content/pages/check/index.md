---
eyebrow: contextqb check
headline: |
  An agent with a stale map
  is worse than an agent with no map.
subhead: >-
  Your `context.qb.yaml` is the file your AI agent reads first. It is the
  project's map, written for an assistant that has not seen this repo before.
  **contextqb check** keeps that map honest. Run it locally, wire it into your
  build, and your agent stops starting from stale instructions.
hero_banner_label: Supported stacks
hero_banner_body: >-
  Works with pnpm, npm, or yarn workspaces. Reads routes from Cloudflare
  Workers, Vercel, Netlify, or Fly. Finds your ADRs wherever they live — the
  default path or a custom one you specify.
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
    A confused agent is a manageable problem. A confident agent reading the
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
      truth is `pnpm-workspace.yaml`, or `package.json#workspaces` for npm and
      yarn.
    postscript: >-
      Add a package, forget to declare it, and your agent thinks the package
      doesn't exist. The detector catches this.
  - token: "routes:"
    title: Your domains and apps
    body: >-
      The `routes:` section maps each public domain to the app that owns it.
      The source of truth is your deploy config — `wrangler.jsonc` for
      Cloudflare, `vercel.json`, `netlify.toml`, or `fly.toml`.
    postscript: >-
      Move a route from one app to another, forget to update the map, and
      your agent proposes changes to the wrong codebase. The detector catches
      this.
  - token: "decisions:"
    title: Your architectural decisions
    body: >-
      The `decisions:` section indexes your ADRs by id and status. The source
      of truth is the ADR files themselves — at `docs/architecture/decisions/`
      by default, or the path you set via `paths.decisions:` in your
      `context.qb.yaml`.
    postscript: >-
      Mark an ADR as superseded, forget to update the map, and your agent
      treats a retired decision as live. The detector catches this.

scope_eyebrow: Fit
scope_heading: Adapters for the ecosystems you actually use.
scope_intro: >-
  The drift detector reads from the files that already define your project.
  No extra config — it looks in the right places automatically:
scope_bullets:
  - "`pnpm-workspace.yaml` **or** `package.json#workspaces` (npm / yarn classic / yarn berry)"
  - "`wrangler.jsonc` (Cloudflare) **or** `vercel.json` **or** `netlify.toml` **or** `fly.toml`"
  - "`docs/architecture/decisions/0NNN-*.md` by default **or** the path you set via `paths.decisions:`"
scope_right_paragraphs:
  - >-
    Any of these configurations work out of the box. If your ADRs live
    somewhere other than `docs/architecture/decisions/`, add
    `paths.decisions: docs/adr/` (or whatever your path is) to your
    `context.qb.yaml` and the detector will look there instead.
  - >-
    See the
    [@context-qb/cli on npm](https://www.npmjs.com/package/@context-qb/cli)
    for the full adapter matrix and the
    [ROADMAP](https://github.com/ContextQB/contextqb/blob/main/format/ROADMAP.md)
    for what's coming next.

fits_eyebrow: Where it lives
fits_heading: Where the check belongs.
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
      When your agent reads `context.qb.yaml` at the start of a session, it is
      reading a file that passed the check. Its mental model is true.
      Sessions stop opening with a stale snapshot.

install_eyebrow: Get started
install_heading: Run it in your ContextQB-shaped repo.
install_lede: >-
  The detector runs from this repository today. Use it in a ContextQB-shaped
  checkout to keep the map honest while you build.
install_steps:
  - title: Make sure your repo has a `context.qb.yaml`
    body: >-
      No file yet? Follow the
      [write a context.qb playbook](/playbooks/write-a-context-qb) — it walks
      you through every section. The
      [worked examples](https://github.com/ContextQB/contextqb/tree/main/format/examples)
      cover monorepos, Next.js apps, MCP servers, CLIs, and Python pipelines —
      copy the closest one. Most repos need fewer than 100 lines.
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
      runs on every pull request.

firstrun_eyebrow: Membership
firstrun_heading: What happens on first run.
firstrun_paragraphs:
  - >-
    The first time you run any `contextqb` subcommand, a membership token is
    silently provisioned and stored locally. There is no prompt, no
    interruption — you see the normal output of whatever you ran.
  - >-
    The token unlocks two things: community insights at [/insights](/insights)
    and the token-gated MCP tools that summarise aggregate trends. Telemetry
    is on by default and three opt-out paths are documented in
    [Privacy & Telemetry](/privacy/telemetry).
firstrun_verify_label: Confirm the token landed
firstrun_verify_command: contextqb membership status
firstrun_setup_label: Hand the token to your agent
firstrun_setup_command: "contextqb mcp setup --client cursor   # or --client claude"
firstrun_postscript: >-
  Both commands are documented in detail on [the MCP page](/mcp).

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
closer_cta_examples_label: Write your context.qb.yaml →
closer_cta_examples_href: /playbooks/write-a-context-qb
closer_cta_mcp_label: Pair with the MCP →
closer_cta_mcp_href: /mcp

meta_title: Check — keep your context.qb.yaml honest
meta_description: >-
  contextqb check is the drift detector for your project's context.qb.yaml.
  It catches the moment your map stops matching your territory, so your AI
  agent never reads a stale file.

review:
  status: final
  last_reviewed: "2026-05-31"
  reviewer: "agent:tranche-6-public-mirror-link-fix"
  reviewer_notes: |-
    v2 supported-adapter copy refresh (T5) + public-mirror link fix (T6 follow-up):
    replaced "Best fit" hero with "Supported stacks"; updated watches_cards to
    mention all workspace managers and deploy platforms; rewrote scope section
    to list pnpm/npm/yarn + all four route adapters + configurable ADR path.
    Repointed three external links from the (private) Industrial-Semiotics paths
    to public destinations: CLI README → npm, ROADMAP → format/ROADMAP.md on
    the ContextQB public mirror, repo qb sample → format/examples/.
---
