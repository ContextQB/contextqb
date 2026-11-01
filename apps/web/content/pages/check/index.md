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
      Run `contextqb check` before every commit. It takes under three seconds.
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
install_heading: Install the command-line tool in your project.
install_lede: >-
  This is an optional extra for people who keep their project in a code folder
  and are comfortable typing commands in a terminal. You don't need it to
  [connect ContextQB to your AI app](/install/). The tool is published on npm as
  [@context-qb/cli](https://www.npmjs.com/package/@context-qb/cli), and these
  steps work in any JavaScript project; nothing from the ContextQB repository is
  required.
install_steps:
  - title: Check that Node.js 20 or newer is installed
    command: node --version
    body: >-
      The tool needs Node.js 20 or newer. Run the command in a terminal (the
      text window where you type commands). If it prints a lower number, or an
      error, install a current Node.js release first.
  - title: Give your project a `context.qb.yaml`
    body: >-
      This short file describes your project for AI agents: its parts, where it
      runs and the decisions you've made. The check compares it with your
      project folder, so it needs one. No file yet? Follow the
      [write a context.qb playbook](/playbooks/write-a-context-qb) — it walks
      you through every section, and the
      [worked examples](https://github.com/ContextQB/contextqb/tree/main/format/examples)
      cover monorepos, Next.js apps, MCP servers, CLIs, and Python pipelines.
      There is no generator command; you write the file once and the check
      keeps it honest. Already have a stale one? Follow
      [retrofit drift detection](/playbooks/retrofit-drift-detection).
  - title: Know what the first run does
    command: |-
      # macOS / Linux (bash, zsh)
      export CONTEXTQB_NO_PROVISION=true

      # Windows PowerShell
      $env:CONTEXTQB_NO_PROVISION = "true"
    body: >-
      Outside CI, the first `contextqb` command you run on a computer
      automatically registers a free membership and stores its token on that
      computer, and `contextqb check` sends a telemetry event by default.
      `--no-telemetry` skips the check event for that run but does **not**
      skip registration. To skip registration, set `CONTEXTQB_NO_PROVISION=true`
      in your shell before running the CLI, as shown above. Details and the
      other opt-outs are on [Privacy and telemetry](/privacy/telemetry/).
  - title: Install the package
    command: |-
      # npm
      npm install --save-dev @context-qb/cli

      # pnpm
      pnpm add -D @context-qb/cli
    body: >-
      Run this from your project's root. Installing the package does not run
      anything; registration happens only when you first run a `contextqb`
      command.
  - title: Run the check
    command: |-
      # npm
      npx contextqb check

      # pnpm
      pnpm exec contextqb check

      # skip the telemetry event for this run
      npx contextqb check --no-telemetry
    body: >-
      The check looks for `context.qb.yaml` in the current folder or its
      parents (or use `--file <path>`). Exit code 0 means clean; 1 means drift;
      2 means the file is missing or malformed.
  - title: Wire it into your workflow
    command: |-
      # package.json
      "scripts": { "check:qb": "contextqb check" }
    body: >-
      Add a script like this, then run it before commits or in a CI job on
      every pull request. CI environments are detected automatically and do
      not register a membership. For the full greenfield walkthrough, follow
      [set up drift detection on day one](/playbooks/set-up-drift-detection).

firstrun_eyebrow: Membership
firstrun_heading: After the first run.
firstrun_paragraphs:
  - >-
    The first time you run a `contextqb` command on your machine (outside CI,
    and unless you have opted out), the CLI registers and stores a membership
    token locally. There is no prompt — you see the normal output of whatever
    you ran.
  - >-
    The token unlocks two things: community insights at [/insights](/insights)
    and the token-gated MCP tools that summarise aggregate trends. Telemetry
    is on by default and three opt-out paths are documented in
    [Privacy & Telemetry](/privacy/telemetry).
firstrun_verify_label: Confirm the token landed
firstrun_verify_command: contextqb membership status
firstrun_setup_label: "Advanced: print an MCP config that includes your token"
firstrun_setup_command: "contextqb mcp setup --client cursor   # or --client claude (Claude Desktop)"
firstrun_postscript: >-
  `contextqb mcp setup` only prints a configuration snippet with your
  membership token for the community insight tools; it does not install
  anything, and like any `contextqb` command it can register a membership on
  first use. The public library needs no token: use
  [Install ContextQB](/install/) instead. Both commands are covered on
  [the MCP page](/mcp/).

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

meta_title: "ContextQB Drift Detection for AI Project Context"
meta_description: "Keep your AI agent’s project map accurate. ContextQB checks context.qb.yaml against your repository and flags drift in structure, stack and routes."


---
