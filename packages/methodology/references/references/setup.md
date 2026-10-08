---
id: setup
title: Setup, compatibility and controls
summary: Neutral, dated facts about exact commands, file locations, configuration shapes and safety controls — which instruction files each agent reads, how permissions and planning work, MCP client configuration, CI and git setup, platform secrets and provider policies. No recommendation.
version: 0.1.1
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
maintainer: ContextQB editorial (Travis Simpson accountable)
tags:
  - agents
  - getting-started
  - security
entries:
  - id: agent-memory
    title: What agents keep between turns and sessions
    role: How named agents load persistent instructions, write their own notes and compact a long conversation when the context window fills.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A listed tool changes how it loads instruction files, stores memory or compacts context.
    limits: Covers the tools whose documentation was checked; other tools behave differently and some publish no equivalent detail. Version numbers are the minimum versions the documentation names. Does not measure how reliably a tool follows loaded instructions.
    facts:
      - subject: Claude Code — auto memory
        value: Claude writes its own notes to a per-repository directory, ~/.claude/projects/<project>/memory/, holding a MEMORY.md index and one file per memory. The notes are machine-local and shared by all worktrees of the repository; the first 200 lines or 25KB load into every session.
        applies_to: Claude Code (memory documentation)
        evidence: [claude-code-memory]
        note: Auto memory can be turned off per project with "autoMemoryEnabled" set to false, or with the environment variable CLAUDE_CODE_DISABLE_AUTO_MEMORY=1.
      - subject: Claude Code — compaction
        value: Claude Code compacts automatically as the context window fills, and instructions given early in a conversation can be lost. /compact accepts a focus, a "Compact Instructions" section in CLAUDE.md controls what is preserved, and /context shows what is using space.
        applies_to: Claude Code (how Claude Code works)
        evidence: [claude-code-how-it-works]
      - subject: Claude Code — instruction files after compaction
        value: The project-root CLAUDE.md is re-read from disk and re-injected after /compact; nested CLAUDE.md files and path-scoped rules load again on demand. Instructions given only in conversation do not persist.
        applies_to: Claude Code (memory documentation, troubleshooting)
        evidence: [claude-code-memory]
      - subject: Codex — compaction
        value: The /compact command summarizes the visible chat to free tokens.
        applies_to: Codex CLI (slash commands)
        evidence: [codex-commands]
      - subject: Cursor — rules as persistent context
        value: Cursor's documentation states that models do not retain memory between completions and that rules provide persistent, reusable context at the prompt level.
        applies_to: Cursor (rules documentation)
        evidence: [cursor-rules]
    evidence:
      - id: claude-code-how-it-works
        url: "https://code.claude.com/docs/en/how-claude-code-works"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "How Claude Code works > The context window"
      - id: claude-code-memory
        url: "https://code.claude.com/docs/en/memory"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "How Claude remembers your project > CLAUDE.md vs auto memory; Auto memory > Storage location; Instructions seem lost after /compact"
      - id: codex-commands
        url: "https://developers.openai.com/codex/cli/slash-commands"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Developer commands > Built-in slash commands (/compact)"
      - id: cursor-rules
        url: "https://cursor.com/docs/rules"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Rules > How rules work"
  - id: agent-permissions
    title: Agent permission, approval and sandbox controls
    role: What named agents do by default before editing files, running commands or reaching the network, and which modes change that.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A listed tool changes a default mode, approval rule or sandbox behaviour.
    limits: States each vendor's documented defaults on the check date. Defaults depend on version, plan, surface and settings, and an organization or project setting can override them; check the tool you actually run. Documented controls are not proof of enforcement, and a classifier or allow list is not a security boundary unless the vendor says so.
    facts:
      - subject: Claude Code — approvals in Manual (default) mode
        value: Read-only actions such as file reads and grep in the working directory need no approval. Shell commands need approval except a built-in set of read-only commands; file edits need approval; web fetches need approval except a built-in set of preapproved documentation domains.
        applies_to: Claude Code (permissions documentation)
        evidence: [claude-code-permissions]
      - subject: Claude Code — permission modes
        value: "Modes are default (labelled Manual: prompts on first use of each tool), acceptEdits (accepts file edits and common filesystem commands), plan (reads and explores without editing source files), auto (a background classifier reviews actions instead of prompting), dontAsk (denies anything that would prompt) and bypassPermissions (documented for isolated containers and VMs only)."
        applies_to: Claude Code (permission modes documentation)
        evidence: [claude-code-permission-modes]
      - subject: Claude Code — starting mode
        value: With Claude Code v2.1.283 or later, auto is the built-in starting permission mode for interactive terminal and VS Code sessions. The built-in auto default requires v2.1.228 or later (v2.1.233 on native Windows); on earlier versions the built-in default is Manual. A --permission-mode flag or a permissions.defaultMode setting replaces the built-in default.
        applies_to: Claude Code interactive terminal and VS Code sessions
        evidence: [claude-code-permission-modes]
        note: The documentation's table lists further cases, including plan-dependent behaviour between v2.1.228 and v2.1.283 and settings files where "auto" or "bypassPermissions" do not take effect.
      - subject: Codex CLI and IDE extension — sandbox defaults
        value: Network access is off by default. An OS-enforced sandbox limits writes to the active workspace, and an approval policy controls when Codex stops to ask. The Auto preset corresponds to --sandbox workspace-write --ask-for-approval on-request.
        applies_to: Codex CLI and IDE extension (agent approvals and security)
        evidence: [codex-security]
        note: Codex no longer supports approval_policy = "untrusted"; the retired setting can prevent the client from starting.
      - subject: Cursor — agent approvals
        value: By default, sensitive actions require manual approval. Reading files and searching code need none; agents can modify workspace files without approval except configuration files such as workspace settings; terminal commands need approval; every MCP connection and each MCP tool call needs approval unless pre-approved. Run Modes, from allow lists to an Auto-review classifier, are described as best-effort guardrails rather than a hard security boundary.
        applies_to: Cursor (agent security documentation)
        evidence: [cursor-security]
        note: A .cursorignore file blocks agent access to specific files.
      - subject: GitHub Copilot in VS Code — permission levels
        value: "Manual permissions is the default level: actions not auto-approved by the tool, URL and terminal approval settings require confirmation. Assisted permissions (experimental) uses an LLM judge; Allow all and Autopilot run tool calls without confirmation. Sandboxing of terminal commands is independent of the permission level."
        applies_to: VS Code agents (approvals and permissions); new sessions use the chat.permissions.default setting
        evidence: [vscode-approvals]
        note: The page states that, for the Copilot harness, worktree sessions always use Allow all.
    evidence:
      - id: claude-code-permission-modes
        url: "https://code.claude.com/docs/en/permission-modes"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Choose a permission mode > introduction, Available modes, Which mode a session starts in"
      - id: claude-code-permissions
        url: "https://code.claude.com/docs/en/permissions"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Permissions > Permission system (tool type / approval required table)"
      - id: codex-security
        url: "https://developers.openai.com/codex/agent-approvals-security"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Agent approvals & security > introduction; Codex CLI / IDE extension defaults; Migrate from the retired untrusted approval policy"
      - id: cursor-security
        url: "https://cursor.com/docs/agent/security"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Agent Security > First-party tool calls; Third-party tool calls"
      - id: vscode-approvals
        url: "https://code.visualstudio.com/docs/agents/run/approvals"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Manage approvals and permissions > Permission levels"
  - id: agents-md-support
    title: Project instruction files each agent reads
    role: Which agents read AGENTS.md, which tool-specific instruction files they read instead or as well, and in what order.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A listed tool changes the instruction files it reads or their precedence.
    limits: Covers the tools whose own documentation was checked; the agents.md compatibility list is the format site's claim, not each tool's. Devin Desktop and Antigravity were not checked. Reading a file is not the same as following it; tools give no guarantee about adherence.
    facts:
      - subject: AGENTS.md — format
        value: A plain Markdown file with no required fields. The closest AGENTS.md to an edited file takes precedence and explicit chat prompts override it. The format is stewarded by the Agentic AI Foundation under the Linux Foundation.
        applies_to: agents.md (format site)
        evidence: [agents-md]
      - subject: AGENTS.md — tools the format site lists as compatible
        value: The site lists, among others, Codex, Jules, Factory, Aider, goose, opencode, Zed, Warp, VS Code, Devin, Junie, Amp, Cursor, RooCode, Gemini CLI, Kilo Code, the GitHub Copilot coding agent, Windsurf and Augment Code.
        applies_to: agents.md (format site)
        evidence: [agents-md]
      - subject: Aider
        value: Loads a conventions file added with /read or --read, or listed under the read key in .aider.conf.yml; the agents.md site gives AGENTS.md as the value of that read key as the way to use AGENTS.md.
        applies_to: Aider (conventions documentation)
        evidence: [aider-conventions, agents-md]
      - subject: Claude Code
        value: Reads CLAUDE.md files. It reads AGENTS.md and .claude/AGENTS.md only when there is no CLAUDE.md, .claude/CLAUDE.md or CLAUDE.local.md in the working directory or any directory above it; reading AGENTS.md directly requires v2.1.277 or later.
        applies_to: Claude Code (memory documentation)
        evidence: [claude-code-memory]
      - subject: Codex
        value: Builds an instruction chain once per run from ~/.codex/AGENTS.override.md or AGENTS.md, then AGENTS.override.md or AGENTS.md in each directory from the project root down to the working directory, and stops adding files at project_doc_max_bytes (32 KiB by default).
        applies_to: Codex (AGENTS.md documentation)
        evidence: [codex-agents-md]
      - subject: Cursor
        value: Supports project rules in .cursor/rules as .mdc files (a plain .md file there is ignored), user rules, team rules on Team and Enterprise plans, and AGENTS.md as a simple alternative to .cursor/rules.
        applies_to: Cursor (rules documentation)
        evidence: [cursor-rules]
      - subject: GitHub Copilot in VS Code
        value: Recommended project instructions are .github/copilot-instructions.md or AGENTS.md; targeted instructions are .github/instructions/**/*.instructions.md. The Local agent also reads CLAUDE.md and Markdown files in .claude/rules for compatibility.
        applies_to: VS Code custom instructions documentation
        evidence: [vscode-instructions]
      - subject: Junie CLI (JetBrains)
        value: Looks for .junie/AGENTS.md, then AGENTS.md in the project root (combined with .junie/playbook.md and .junie/rules/*.md), then the legacy .junie/guidelines.md or .junie/guidelines/ folder; global guidelines live in ~/.junie/AGENTS.md.
        applies_to: Junie CLI (guidelines and memory documentation)
        evidence: [junie-guidelines]
      - subject: Zed
        value: Uses AGENTS.md as its primary instruction file (personal file ~/.config/zed/AGENTS.md). For project instructions it uses the first file found in this order — .rules, .cursorrules, .windsurfrules, .clinerules, .github/copilot-instructions.md, AGENT.md, AGENTS.md, CLAUDE.md, GEMINI.md.
        applies_to: Zed Agent (instructions documentation)
        evidence: [zed-instructions]
    evidence:
      - id: agents-md
        url: "https://agents.md/"
        checked_on: "2026-10-07"
        source_kind: specification
        locator: "One AGENTS.md works across many agents (compatibility list); About; FAQ (conflicts, Aider and Gemini CLI configuration)"
      - id: aider-conventions
        url: "https://aider.chat/docs/usage/conventions.html"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Specifying coding conventions > Always load conventions"
      - id: claude-code-memory
        url: "https://code.claude.com/docs/en/memory"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "AGENTS.md > When Claude Code reads AGENTS.md"
      - id: codex-agents-md
        url: "https://developers.openai.com/codex/guides/agents-md"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Custom instructions with AGENTS.md > How Codex discovers guidance"
      - id: cursor-rules
        url: "https://cursor.com/docs/rules"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Rules > rule types; Project rules"
      - id: junie-guidelines
        url: "https://junie.jetbrains.com/docs/guidelines-and-memory.html"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Guidelines and memory > How Junie CLI discovers guidelines; Global guidelines"
      - id: vscode-instructions
        url: "https://code.visualstudio.com/docs/copilot/customization/custom-instructions"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Use custom instructions in VS Code > Types of instruction files (harness table)"
      - id: zed-instructions
        url: "https://zed.dev/docs/ai/instructions.md"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Instructions > Personal instructions; Project Instructions (ordered list)"
  - id: auth-provider-settings
    title: Authentication provider dashboard settings
    role: Where the brute-force, lockout and session settings that lessons mention live in each authentication provider's signed-in dashboard.
    status: unverified
    owner: ContextQB editorial
    facts:
      - subject: Auth0 dashboard — attack protection and session settings
        note: Navigation labels need an operator-present check in a signed-in tenant. Documented defaults are in the pricing group (security defaults).
      - subject: Clerk Dashboard — attack protection and session settings
        note: Navigation labels need an operator-present check in a signed-in instance. Documented defaults are in the pricing group (security defaults).
      - subject: Supabase dashboard — Auth rate limits and session settings
        note: Navigation labels need an operator-present check in a signed-in project. Documented defaults are in the pricing group (security defaults).
    leads:
      - url: "https://auth0.com/docs/secure/attack-protection/brute-force-protection"
        note: Describes brute-force protection settings; navigation not observed.
      - url: "https://clerk.com/docs/guides/secure/user-lockout"
        note: Describes lockout customisation; navigation not observed.
      - url: "https://clerk.com/docs/guides/secure/session-options"
        note: Describes session lifetime settings; navigation not observed.
      - url: "https://supabase.com/docs/guides/auth/sessions"
        note: Describes session limits; navigation not observed.
  - id: browser-extension-platform
    title: Browser extension platform facts
    role: Chrome extension platform facts that browser-extension examples rely on — storage areas and their limits, and the Manifest V2 retirement.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: Chrome changes a storage quota or the extension manifest platform.
    limits: Chrome only; other browsers implement the extension APIs differently. Quotas are as documented for current Chrome versions.
    facts:
      - subject: Chrome — Manifest V2 status
        value: With Chrome 138 all users on all channels have Manifest V2 extensions disabled and cannot turn them back on (July 24, 2025). All remaining Manifest V2 extensions were removed from the Chrome Web Store on August 31, 2026; existing installs on Chrome 138 or earlier keep running but cannot be updated or reinstalled.
        applies_to: Google Chrome (Manifest V2 deprecation timeline, page last updated 2026-09-09)
        evidence: [chrome-mv2-timeline]
      - subject: chrome.storage.local
        value: Stored locally and cleared when the extension is removed; the limit is 10 MB (5 MB in Chrome 113 and earlier) and can be raised with the "unlimitedStorage" permission. Exposed to content scripts by default.
        applies_to: Chrome extensions storage API
        evidence: [chrome-storage]
      - subject: chrome.storage.session
        value: Held in memory while the extension is loaded and cleared when the extension is disabled, reloaded or updated and when the browser restarts; the limit is 10 MB (1 MB in Chrome 111 and earlier). Not exposed to content scripts by default.
        applies_to: Chrome extensions storage API
        evidence: [chrome-storage]
      - subject: chrome.storage.sync
        value: Syncs across Chrome browsers the user is signed into when sync is enabled, otherwise behaves like local storage; the quota is approximately 100 KB, 8 KB per item.
        applies_to: Chrome extensions storage API
        evidence: [chrome-storage]
    evidence:
      - id: chrome-mv2-timeline
        url: "https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Manifest V2 support timeline > Aug 31st 2026 and Jul 24th 2025 entries"
      - id: chrome-storage
        url: "https://developer.chrome.com/docs/extensions/reference/api/storage"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "chrome.storage > Storage areas (Local, Session, Sync)"
  - id: ci-recipes
    title: CI runtime and action versions
    role: The Node.js release lines, GitHub-hosted runner label and setup-action versions that a GitHub Actions CI recipe pins.
    status: current
    owner: ContextQB editorial
    review_by: "2026-10-29"
    review_trigger: A Node.js line changes phase, or a listed action publishes a new major version.
    limits: Release-table and release-page facts only. Does not test a recipe; whether a recipe works also depends on the project's package manager pin and lockfile. The Node.js schedule dates are the project's planned dates.
    facts:
      - subject: actions/checkout
        value: Latest release v7.0.1 (published 2026-07-20); the action runs on the node24 runtime.
        applies_to: GitHub Marketplace action actions/checkout
        evidence: [checkout-release, checkout-action-yml]
        snippet:
          language: yaml
          text: "- uses: actions/checkout@v7"
      - subject: actions/setup-node
        value: Latest release v7.0.0 (published 2026-07-14); the action runs on the node24 runtime.
        applies_to: GitHub Marketplace action actions/setup-node
        evidence: [setup-node-release, setup-node-action-yml]
      - subject: GitHub-hosted runner label ubuntu-latest
        value: ubuntu-latest currently selects the Ubuntu 24.04 image; Ubuntu 26.04 is available under its own label, ubuntu-26.04.
        applies_to: GitHub-hosted runners (actions/runner-images)
        evidence: [runner-images]
      - subject: Node.js 20 (Iron)
        value: End-of-life; the release schedule lists its end as 2026-04-30.
        applies_to: Node.js release schedule
        evidence: [node-releases, node-schedule]
      - subject: Node.js 22 (Jod)
        value: Long-term support line in maintenance since 2025-10-21; end of life planned for 2027-04-30.
        applies_to: Node.js release schedule
        evidence: [node-releases, node-schedule]
      - subject: Node.js 24 (Krypton)
        value: Long-term support line (latest LTS release v24.21.0); maintenance is scheduled from 2026-10-20 and end of life for 2028-04-30.
        applies_to: Node.js release schedule
        evidence: [node-releases, node-schedule]
        note: The Node.js releases page states that production applications should only use Active LTS or Maintenance LTS releases.
      - subject: Node.js 26
        value: Current release line (latest v26.11.0); scheduled to enter long-term support on 2026-10-28, with end of life planned for 2029-04-30.
        applies_to: Node.js release schedule
        evidence: [node-releases, node-schedule]
      - subject: pnpm/action-setup
        value: Latest release v6.1.0 (published 2026-09-05) adds pnpm v12 support; the action runs on the node24 runtime. Its README notes that pnpm/setup is also available for pnpm v11 and newer and that pnpm/action-setup continues to work with actions/setup-node.
        applies_to: GitHub Marketplace action pnpm/action-setup
        evidence: [pnpm-action-release, pnpm-action-readme]
    evidence:
      - id: checkout-action-yml
        url: "https://raw.githubusercontent.com/actions/checkout/v7.0.1/action.yml"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "action.yml > runs.using"
      - id: checkout-release
        url: "https://github.com/actions/checkout/releases/tag/v7.0.1"
        checked_on: "2026-10-07"
        source_kind: release-notes
        locator: "Latest release v7.0.1 (read through the GitHub releases API)"
      - id: node-releases
        url: "https://nodejs.org/en/about/previous-releases"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Node.js Releases > release table (Status column) and latest LTS / latest release headings"
      - id: node-schedule
        url: "https://raw.githubusercontent.com/nodejs/Release/main/schedule.json"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "schedule.json entries v20, v22, v24 and v26 (lts, maintenance, end)"
      - id: pnpm-action-readme
        url: "https://raw.githubusercontent.com/pnpm/action-setup/v6.1.0/README.md"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "README > opening notes and 'Using pnpm/setup instead'"
      - id: pnpm-action-release
        url: "https://github.com/pnpm/action-setup/releases/tag/v6.1.0"
        checked_on: "2026-10-07"
        source_kind: release-notes
        locator: "Release v6.1.0 notes (read through the GitHub releases API); action.yml runs.using at that tag"
      - id: runner-images
        url: "https://raw.githubusercontent.com/actions/runner-images/main/README.md"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Available Images table (YAML label column for Ubuntu 26.04 and 24.04)"
      - id: setup-node-action-yml
        url: "https://raw.githubusercontent.com/actions/setup-node/v7.0.0/action.yml"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "action.yml > runs.using"
      - id: setup-node-release
        url: "https://github.com/actions/setup-node/releases/tag/v7.0.0"
        checked_on: "2026-10-07"
        source_kind: release-notes
        locator: "Latest release v7.0.0 (read through the GitHub releases API)"
  - id: context-qb-validation
    title: Checking a context.qb.yaml with the published CLI
    role: Where the context.qb format and its drift detector are published, how the CLI is installed, and which deployment configurations it reads.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: "A new @context-qb/cli release or a change to the published SPEC or schema."
    limits: First-party facts pointed to, not copied; the CLI changelog and the published SPEC are the authority for behaviour and feature status. This entry does not describe the cooperative's data handling; read the privacy and telemetry page before running the CLI.
    facts:
      - subject: "@context-qb/cli — package and binary"
        value: The latest published version is 2.5.0 (released 2026-06-07); the package installs a binary named contextqb, whose default subcommand is check, the drift detector.
        applies_to: npm registry, dist-tag latest
        evidence: [qb-cli-registry]
        snippet:
          language: shell
          text: |-
            pnpm add -D @context-qb/cli
            # or
            npm install --save-dev @context-qb/cli
      - subject: "@context-qb/cli — membership and telemetry options"
        value: The README lists --no-telemetry (skip telemetry for this run) and --telemetry-preview (print the telemetry payload without sending it). Membership is auto-provisioned on the normal path; contextqb membership revoke revokes membership and deletes all server-side data as a sticky opt-out.
        applies_to: "@context-qb/cli 2.5.0 README"
        evidence: [qb-cli-registry]
      - subject: "@context-qb/cli — deployment configurations read by check"
        value: "The routes detector reads apps/*/wrangler.jsonc (Cloudflare Workers), apps/*/vercel.json (Vercel), apps/*/netlify.toml (Netlify) and apps/*/fly.toml (Fly.io)."
        applies_to: "@context-qb/cli 2.5.0 README, adapter matrix"
        evidence: [qb-cli-registry]
      - subject: context.qb format — published specification and schema
        value: The specification (SPEC.md), JSON Schema (schema.json) and roadmap (ROADMAP.md) are published in the public repository's format directory; the CLI changelog is published at cli/CHANGELOG.md.
        applies_to: ContextQB public repository, main branch
        evidence: [qb-spec, qb-changelog]
    evidence:
      - id: qb-changelog
        url: "https://github.com/ContextQB/contextqb/blob/main/cli/CHANGELOG.md"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "Changelog > [2.5.0] — 2026-06-07"
      - id: qb-cli-registry
        url: "https://registry.npmjs.org/@context-qb/cli"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "Registry document: dist-tags.latest, time, bin; readme sections Installation, All Subcommands, contextqb membership, Adapter matrix"
      - id: qb-spec
        url: "https://github.com/ContextQB/contextqb/tree/main/format"
        checked_on: "2026-10-07"
        source_kind: specification
        locator: "format directory listing: SPEC.md, schema.json, ROADMAP.md, examples"
  - id: deploy-commands
    title: Platform deploy commands
    role: The command each named hosting platform documents for deploying from the command line.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A platform renames its CLI or changes its deploy command.
    limits: Commands as documented; flags, authentication and project linking differ by platform and are not covered. A deploy command changes a live system, so whether an agent may run it is a permission decision, not a fact recorded here.
    facts:
      - subject: Cloudflare Workers (Wrangler)
        value: wrangler deploy deploys a Worker to Cloudflare. Run without a Wrangler configuration file, it detects the framework and prompts to confirm the detected settings.
        applies_to: Wrangler commands documentation
        evidence: [wrangler-deploy]
        snippet:
          language: shell
          text: npx wrangler deploy
      - subject: Fly.io (flyctl)
        value: flyctl is the command-line utility that provides the fly command; fly deploy deploys an application from source or an image using a local or remote builder.
        applies_to: flyctl documentation
        evidence: [fly-deploy, flyctl-install]
        snippet:
          language: shell
          text: fly deploy
      - subject: Vercel CLI
        value: vercel --prod creates a deployment for the project's production domain. The first deployment of a new project is always a production deployment, even without --prod.
        applies_to: Vercel CLI deploy documentation
        evidence: [vercel-deploy]
        snippet:
          language: shell
          text: vercel --prod
    evidence:
      - id: fly-deploy
        url: "https://fly.io/docs/flyctl/deploy/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "fly deploy > description and Usage"
      - id: flyctl-install
        url: "https://docs.fly.io/flyctl/install.md"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Install flyctl > introduction"
      - id: vercel-deploy
        url: "https://vercel.com/docs/cli/deploy"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "vercel deploy > Production (--prod)"
      - id: wrangler-deploy
        url: "https://developers.cloudflare.com/workers/wrangler/commands/workers/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Wrangler commands > deploy"
  - id: framework-route-discovery
    title: Where frameworks and platforms declare routes
    role: The files and configuration keys that define public routes in the frameworks and platforms lessons name, so an audit can inventory them.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: A framework renames a routing file convention or the platform changes its route configuration.
    limits: Covers Next.js (version 16.4 documentation) and Cloudflare Workers only. Lists where routes are declared, not whether a route is protected; other files (pages, rewrites, redirects, platform settings) can also expose paths.
    facts:
      - subject: Cloudflare Workers — routes
        value: Routes map a URL pattern to a Worker; they are declared as a routes array of pattern entries in the Wrangler configuration file, or added in the dashboard.
        applies_to: Cloudflare Workers routing documentation
        evidence: [cloudflare-routes]
      - subject: Next.js — proxy (formerly middleware)
        value: The middleware file convention is deprecated and renamed proxy (proxy.js or proxy.ts); it runs before requests reach the application.
        applies_to: Next.js 16.4 documentation (proxy.js, last updated 2026-09-04)
        evidence: [nextjs-proxy]
      - subject: Next.js App Router — route handlers
        value: A route.js or route.ts file in the app directory defines a Route Handler, a custom request handler for that route built on the Web Request and Response APIs.
        applies_to: Next.js 16.4 documentation (route.js)
        evidence: [nextjs-route]
      - subject: Next.js Pages Router — API routes
        value: Any file inside pages/api is mapped to /api/* and treated as an API endpoint instead of a page.
        applies_to: Next.js 16.4 documentation (Pages Router API routes)
        evidence: [nextjs-api-routes]
    evidence:
      - id: cloudflare-routes
        url: "https://developers.cloudflare.com/workers/configuration/routing/routes/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Routes > introduction and Wrangler configuration example (routes, pattern)"
      - id: nextjs-api-routes
        url: "https://nextjs.org/docs/pages/building-your-application/routing/api-routes"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "API Routes > introduction (read through the documentation's Markdown version)"
      - id: nextjs-proxy
        url: "https://nextjs.org/docs/app/api-reference/file-conventions/proxy"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "proxy.js > deprecation note and Migration to Proxy"
      - id: nextjs-route
        url: "https://nextjs.org/docs/app/api-reference/file-conventions/route"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "route.js > introduction"
  - id: git-hooks
    title: Git hook setup with Husky
    role: The documented commands for installing Husky and creating a pre-commit hook.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: A new Husky major release or a change to its getting-started commands.
    limits: Husky only; a plain Git hook needs no package. Commands as documented for each package manager.
    facts:
      - subject: Husky — init with pnpm
        value: Install Husky as a dev dependency, then run husky init through the package manager. husky init creates a pre-commit script in .husky/ and updates the prepare script in package.json.
        applies_to: Husky getting-started documentation; latest npm release 9.1.7
        evidence: [husky-get-started, husky-registry]
        snippet:
          language: shell
          text: |-
            pnpm add --save-dev husky
            pnpm exec husky init
      - subject: Husky — init with npm
        value: The documented npm commands are npm install --save-dev husky followed by npx husky init.
        applies_to: Husky getting-started documentation
        evidence: [husky-get-started]
        snippet:
          language: shell
          text: |-
            npm install --save-dev husky
            npx husky init
    evidence:
      - id: husky-get-started
        url: "https://typicode.github.io/husky/get-started.html"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Get started > Install; husky init (recommended)"
      - id: husky-registry
        url: "https://registry.npmjs.org/husky"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "dist-tags.latest (9.1.7) and its publish time"
  - id: git-install
    title: Installing Git
    role: The install commands and installers that git-scm.com documents for each operating system.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: git-scm.com changes its recommended install methods.
    limits: As documented by git-scm.com; non-source distributions are provided by third parties and may lag the latest source release (2.56.0 on the check date).
    facts:
      - subject: Linux (Debian, Ubuntu, Fedora)
        value: Debian and Ubuntu use apt-get install git; Fedora 22 and later use dnf install git.
        applies_to: git-scm.com Linux install page
        evidence: [git-linux]
      - subject: macOS
        value: "Two documented options: Homebrew (brew install git) or the Git that Apple ships with the Xcode Command Line Tools (xcode-select --install)."
        applies_to: git-scm.com macOS install page
        evidence: [git-mac]
        snippet:
          language: shell
          text: |-
            brew install git
            # or
            xcode-select --install
      - subject: Windows
        value: Git for Windows installers (x64 and ARM64; version 2.56.0(2), released 2026-10-05), or winget.
        applies_to: git-scm.com Windows install page
        evidence: [git-windows]
        snippet:
          language: shell
          text: winget install --id Git.Git -e --source winget
    evidence:
      - id: git-linux
        url: "https://git-scm.com/install/linux"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Download for Linux and Unix > Debian/Ubuntu; Fedora"
      - id: git-mac
        url: "https://git-scm.com/install/mac"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Download for macOS > Homebrew; Xcode Command Line Tools"
      - id: git-windows
        url: "https://git-scm.com/install/windows"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Download for Windows > latest version; Using winget tool"
  - id: github-ssh-keys
    title: Creating an SSH key for GitHub
    role: The commands GitHub documents for generating an SSH key, adding it to the agent and copying the public key.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: GitHub changes its SSH key documentation.
    limits: Command-line steps only. The signed-in GitHub settings path for adding the key is not recorded here; it needs an operator-present check. The email address in the example is a placeholder for your own.
    facts:
      - subject: Add the key to ssh-agent (macOS)
        value: Start the agent, then add the key with Apple's ssh-add and the --apple-use-keychain option, which stores the passphrase in the keychain.
        applies_to: GitHub Docs, macOS Monterey (12.0) and later
        evidence: [github-ssh-generate]
        snippet:
          language: shell
          text: |-
            eval "$(ssh-agent -s)"
            ssh-add --apple-use-keychain ~/.ssh/id_ed25519
      - subject: Copy the public key
        value: macOS uses pbcopy; Windows uses clip (clip.exe under WSL). Copy the .pub file without adding newlines or whitespace.
        applies_to: GitHub Docs (adding a new SSH key to your account)
        evidence: [github-ssh-add]
        snippet:
          language: shell
          text: |-
            pbcopy < ~/.ssh/id_ed25519.pub
            # Windows:
            clip < ~/.ssh/id_ed25519.pub
      - subject: Generate a key
        value: GitHub documents an Ed25519 key labelled with your email; systems without Ed25519 support use RSA with 4096 bits.
        applies_to: GitHub Docs (generating a new SSH key)
        evidence: [github-ssh-generate]
        snippet:
          language: shell
          text: |-
            ssh-keygen -t ed25519 -C "your_email@example.com"
            # legacy systems without Ed25519:
            ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
    evidence:
      - id: github-ssh-add
        url: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Adding a new SSH key to your account > copy the SSH public key (macOS and Windows tabs)"
      - id: github-ssh-generate
        url: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Generating a new SSH key; Adding your SSH key to the ssh-agent (macOS)"
  - id: local-models
    title: Running models locally
    role: How the local model runners that lessons name serve a model on your own machine — commands and default addresses.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A runner changes its default address, port or model-download command.
    limits: Defaults as documented; a running server's actual address depends on its configuration. Does not cover hardware requirements or model quality.
    facts:
      - subject: llama.cpp (llama-server)
        value: llama-server is an HTTP server built on llama.cpp; its --port option defaults to 8080.
        applies_to: llama.cpp server README (master branch)
        evidence: [llama-server-readme]
      - subject: LM Studio
        value: The local server is started from the app or with lms server start. It binds to 127.0.0.1 by default; without --port it uses the last used port, and the documentation's OpenAI-compatible examples assume port 1234.
        applies_to: LM Studio CLI (lms) and developer documentation
        evidence: [lmstudio-server-start, lmstudio-openai-compat]
        snippet:
          language: shell
          text: lms server start
      - subject: Ollama
        value: The local server's API is at http://localhost:11434/api, with an OpenAI-compatible base URL at http://localhost:11434/v1. Local requests need no API key. ollama pull downloads a model.
        applies_to: Ollama API and CLI documentation
        evidence: [ollama-api, ollama-cli]
        snippet:
          language: shell
          text: ollama pull <model>
    evidence:
      - id: llama-server-readme
        url: "https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "LLaMA.cpp HTTP Server > introduction; options table (--port)"
      - id: lmstudio-openai-compat
        url: "https://lmstudio.ai/docs/developer/openai-compat"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "OpenAI Compatibility endpoints > examples (base URL)"
      - id: lmstudio-server-start
        url: "https://lmstudio.ai/docs/cli/serve/server-start"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "lms server start > Flags (--port, --bind)"
      - id: ollama-api
        url: "https://docs.ollama.com/api/introduction"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "API introduction > Base URLs"
      - id: ollama-cli
        url: "https://docs.ollama.com/cli"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "CLI reference > Download a model"
  - id: mcp-clients
    title: MCP client configuration shapes
    role: The configuration shape each named client documents for adding a remote MCP server, shown with the ContextQB server address and no credentials.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A listed client changes its MCP configuration format or file location, or the ContextQB endpoint changes.
    limits: Anonymous configurations only; they give access to the public methodology tools. Token-bearing configurations come only from the contextqb mcp setup command. Shapes follow each client's documentation on the check date and were not run against the live clients; the one exception is the Cursor fact for ContextQB's own setup output, which records what ContextQB emits rather than a documented vendor shape. Antigravity and the Devin Local agent were not checked.
    facts:
      - subject: Claude Code
        value: Remote servers are added with claude mcp add --transport http; in .mcp.json and other JSON configuration the type field is http (streamable-http is accepted as an alias). The SSE transport is deprecated in favour of HTTP.
        applies_to: Claude Code MCP documentation
        evidence: [claude-code-mcp, contextqb-mcp-page]
        snippet:
          language: shell
          text: claude mcp add --transport http contextqb https://mcp.contextqb.com/mcp
      - subject: Claude Desktop — local configuration file
        value: Local (stdio) servers are configured in claude_desktop_config.json under mcpServers, at ~/Library/Application Support/Claude/ on macOS and %APPDATA%\Claude\ on Windows. Remote servers can be added natively as Custom Connectors in Claude's settings, or through the third-party mcp-remote bridge, which runs as a local stdio server.
        applies_to: MCP documentation (connect to local and remote servers); mcp-remote 0.14.3 README
        evidence: [mcp-local-servers, mcp-remote-servers, mcp-remote-readme, contextqb-mcp-page]
        snippet:
          language: json
          text: |-
            {
              "mcpServers": {
                "contextqb": {
                  "command": "npx",
                  "args": ["mcp-remote", "https://mcp.contextqb.com/mcp"]
                }
              }
            }
        note: mcp-remote is a community package (punkpeye/mcp-remote), not part of Claude Desktop; its README says it can be removed once a client supports remote, authorized servers directly.
      - subject: ContextQB remote MCP endpoint
        value: The hosted ContextQB MCP server is at https://mcp.contextqb.com/mcp; methodology tools work without a token, and the community_* tools need a membership token.
        applies_to: contextqb.com MCP page
        evidence: [contextqb-mcp-page]
      - subject: Cursor — documented remote shape
        value: Servers are configured in .cursor/mcp.json (project) or ~/.cursor/mcp.json (global) under mcpServers. The documented remote-server shape uses a url (optional headers); a type field is documented only for stdio servers, where "stdio" is required.
        applies_to: Cursor MCP documentation
        evidence: [cursor-mcp]
        snippet:
          language: json
          text: |-
            {
              "mcpServers": {
                "contextqb": {
                  "url": "https://mcp.contextqb.com/mcp"
                }
              }
            }
      - subject: Cursor — ContextQB setup output
        value: ContextQB's own Cursor configuration, printed by contextqb mcp setup --client cursor and given in the MCP page source, adds a type field set to http to the documented remote shape. Cursor's MCP documentation lists a type field only for stdio servers, so this field is ContextQB's choice, not a documented requirement. Whether Cursor accepts it has not been tested, and neither shape has been run against a live Cursor client.
        applies_to: "@context-qb/cli 2.5.0 generator (contextqb mcp setup --client cursor) and the MCP page source in this release"
        evidence: [contextqb-cursor-setup-output]
        snippet:
          language: json
          text: |-
            {
              "mcpServers": {
                "contextqb": {
                  "type": "http",
                  "url": "https://mcp.contextqb.com/mcp"
                }
              }
            }
      - subject: Devin Desktop — Cascade agent
        value: The legacy Cascade agent reads ~/.config/devin/mcp_config.json (macOS and Linux) or %APPDATA%\devin\mcp_config.json (Windows); remote HTTP servers need a serverUrl or url field. The default Devin Local agent configures MCP servers in the Devin CLI configuration files instead.
        applies_to: Devin Desktop Cascade MCP documentation
        evidence: [devin-cascade-mcp, contextqb-mcp-page]
        snippet:
          language: json
          text: |-
            {
              "mcpServers": {
                "contextqb": {
                  "serverUrl": "https://mcp.contextqb.com/mcp"
                }
              }
            }
      - subject: VS Code (GitHub Copilot)
        value: The workspace file .vscode/mcp.json defines servers in a top-level servers object, with type http and a url for remote servers. A portable .mcp.json at the workspace root uses a top-level mcpServers object; the Add Server flow lists .vscode/mcp.json as deprecated and prefers the portable destinations for new servers.
        applies_to: VS Code MCP servers documentation
        evidence: [vscode-mcp, contextqb-mcp-page]
        snippet:
          language: json
          text: |-
            {
              "servers": {
                "contextqb": {
                  "type": "http",
                  "url": "https://mcp.contextqb.com/mcp"
                }
              }
            }
    evidence:
      - id: claude-code-mcp
        url: "https://code.claude.com/docs/en/mcp"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Connect Claude Code to tools via MCP > Option 1 Add a remote HTTP server; Option 2 Add a remote SSE server (deprecated)"
      - id: contextqb-mcp-page
        url: "https://contextqb.com/mcp/"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "MCP page > Fastest setup; Community insight tools (token-gated)"
      - id: contextqb-cursor-setup-output
        url: "https://contextqb.com/mcp/"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "Cursor block in the MCP page source of this release (unreleased when checked), verified locally against generateCursorConfig in @context-qb/cli 2.5.0, the PC-1 fixture, cursor.json and its README; the live page was not checked"
      - id: cursor-mcp
        url: "https://cursor.com/docs/context/mcp"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Model Context Protocol > Using mcp.json (Remote Server); STDIO server configuration; Configuration locations"
      - id: devin-cascade-mcp
        url: "https://docs.devin.ai/desktop/cascade/mcp"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Cascade MCP Configuration > mcp_config.json; Remote HTTP MCPs"
      - id: mcp-local-servers
        url: "https://modelcontextprotocol.io/docs/develop/connect-local-servers"
        checked_on: "2026-10-07"
        source_kind: specification
        locator: "Connect to local MCP servers > configuration file location (macOS, Windows)"
      - id: mcp-remote-readme
        url: "https://registry.npmjs.org/mcp-remote"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "Registry document: dist-tags.latest (0.14.3), repository; readme > Usage"
      - id: mcp-remote-servers
        url: "https://modelcontextprotocol.io/docs/develop/connect-remote-servers"
        checked_on: "2026-10-07"
        source_kind: specification
        locator: "Connect to remote MCP Servers > What are Custom Connectors?; Connecting to a Remote MCP Server"
      - id: vscode-mcp
        url: "https://code.visualstudio.com/docs/copilot/customization/mcp-servers"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Add and manage MCP servers > Configure the mcp.json file (locations and example)"
  - id: mcp-transports-auth
    title: MCP transports and authorization
    role: Which transports the Model Context Protocol specification defines and how it scopes authorization.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A new MCP specification revision is published.
    limits: Summarises the specification revision dated 2026-07-28; clients and servers may implement older revisions or only part of the specification.
    facts:
      - subject: MCP authorization
        value: Authorization is optional for MCP implementations. When supported, HTTP-based transports should conform to the specification's OAuth 2.1-based flow, in which the MCP server acts as an OAuth 2.1 resource server; stdio implementations should not follow it and should retrieve credentials from the environment instead.
        applies_to: MCP specification revision 2026-07-28, Authorization
        evidence: [mcp-authorization]
      - subject: MCP standard transports
        value: "The specification defines two standard transports: stdio (newline-delimited messages over the standard streams of a client-launched subprocess) and Streamable HTTP (each message is an HTTP POST to a single MCP endpoint; replies arrive as a JSON object or a request-scoped SSE stream). Custom transports are also possible."
        applies_to: MCP specification revision 2026-07-28, Transports
        evidence: [mcp-transports]
    evidence:
      - id: mcp-authorization
        url: "https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization"
        checked_on: "2026-10-07"
        source_kind: specification
        locator: "Authorization > Protocol Requirements; Standards Compliance; Roles"
      - id: mcp-transports
        url: "https://modelcontextprotocol.io/specification/2026-07-28/basic/transports"
        checked_on: "2026-10-07"
        source_kind: specification
        locator: "Transports > Overview"
  - id: package-manager-commands
    title: Package manager maintenance commands
    role: The documented commands for checking dependencies for newer versions.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: npm or pnpm changes the documented behaviour of these commands.
    limits: Behaviour as documented for npm 12.2.0 and current pnpm; output columns and defaults can differ in other versions.
    facts:
      - subject: npm outdated
        value: Checks the registry for installed packages that are outdated; by default it shows the direct dependencies of the root project and of configured workspaces, and --all includes meta-dependencies. A package name limits the check to that package.
        applies_to: npm CLI 12.2.0 documentation
        evidence: [npm-outdated]
        snippet:
          language: shell
          text: npm outdated @context-qb/cli
      - subject: pnpm outdated
        value: Checks for outdated packages, optionally limited by name patterns; --recursive (-r) checks every workspace package.
        applies_to: pnpm CLI documentation
        evidence: [pnpm-outdated]
        snippet:
          language: shell
          text: pnpm outdated @context-qb/cli
    evidence:
      - id: npm-outdated
        url: "https://docs.npmjs.com/cli/v12/commands/npm-outdated/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "npm-outdated (Version 12.2.0) > Synopsis; Description"
      - id: pnpm-outdated
        url: "https://pnpm.io/cli/outdated"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "pnpm outdated > description and Options (--recursive)"
  - id: planning-modes
    title: Planning modes in agentic tools
    role: How named tools offer a step in which the agent researches and proposes a plan before it edits code.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A listed tool renames, removes or changes its planning mode.
    limits: Describes the documented feature; a planning mode does not by itself stop every action, and permission settings still apply. Devin Desktop and Antigravity were not checked.
    facts:
      - subject: Claude Code — plan mode
        value: In plan mode Claude reads files and runs read-only shell commands to explore but does not edit source files; with auto mode available, classifier-approved commands also run. Modes are switched with Shift+Tab in the CLI.
        applies_to: Claude Code (permission modes documentation)
        evidence: [claude-code-permission-modes]
      - subject: Codex — /plan
        value: The /plan command switches to plan mode and optionally sends a prompt, so that Codex proposes an execution plan before implementation starts.
        applies_to: Codex CLI (slash commands)
        evidence: [codex-commands]
      - subject: Cursor — Plan Mode
        value: Plan Mode creates an implementation plan before writing code; the agent asks clarifying questions, researches the codebase and produces a plan you can edit before building. Shift+Tab rotates to Plan Mode from the chat input.
        applies_to: Cursor (Plan Mode documentation)
        evidence: [cursor-plan-mode]
      - subject: GitHub Copilot in VS Code — Plan mode
        value: Plan mode in a Copilot session has the agent research the project, ask clarifying questions and create a plan, which you can refine and then implement or save.
        applies_to: VS Code planning documentation
        evidence: [vscode-planning]
    evidence:
      - id: claude-code-permission-modes
        url: "https://code.claude.com/docs/en/permission-modes"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Choose a permission mode > Available modes; Analyze before you edit with plan mode"
      - id: codex-commands
        url: "https://developers.openai.com/codex/cli/slash-commands"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Developer commands > Built-in slash commands (/plan)"
      - id: cursor-plan-mode
        url: "https://cursor.com/docs/agent/plan-mode"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Plan Mode > introduction and How it works"
      - id: vscode-planning
        url: "https://code.visualstudio.com/docs/agents/run/planning"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Plan work with agents in VS Code > introduction"
  - id: platform-secret-settings
    title: Setting secrets on hosting platforms
    role: The documented command-line ways to give a deployed application its secrets on the platforms lessons name, and what each platform says about visibility.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A platform changes its secrets commands or visibility rules.
    limits: Command-line and file conventions only. Signed-in dashboard navigation paths are not recorded; they need an operator-present check. Never paste a real secret into a command that is saved in shell history.
    facts:
      - subject: Cloudflare Workers
        value: wrangler secret put adds a secret and immediately deploys a new version of the Worker (wrangler versions secret put is used with gradual deployments). Local development reads secrets from .dev.vars or .env next to the Wrangler configuration file — one or the other, not both — and these files are not committed.
        applies_to: Cloudflare Workers secrets documentation
        evidence: [cloudflare-secrets]
        snippet:
          language: shell
          text: npx wrangler secret put <KEY>
      - subject: Supabase Edge Functions
        value: supabase secrets set sets secrets on the remote project, from a .env file or one NAME=value at a time, and supabase secrets list lists them; deployed functions read a new secret immediately. Locally, functions read supabase/functions/.env, which belongs in .gitignore.
        applies_to: Supabase Edge Functions secrets documentation
        evidence: [supabase-secrets]
        snippet:
          language: shell
          text: |-
            supabase secrets set --env-file .env
            supabase secrets list
      - subject: Vercel
        value: vercel env add adds an environment variable to a project. Each variable is either Config (stays readable to authorized members) or Secret (write-only after saving); values are encrypted at rest. The documentation warns that piping a value with echo saves it in shell history.
        applies_to: Vercel environment variables and CLI documentation
        evidence: [vercel-env, vercel-env-cli]
        snippet:
          language: shell
          text: vercel env add
    evidence:
      - id: cloudflare-secrets
        url: "https://developers.cloudflare.com/workers/configuration/secrets/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Secrets > Local development with secrets; Adding secrets to your project > Via Wrangler"
      - id: supabase-secrets
        url: "https://supabase.com/docs/guides/functions/secrets"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Environment variables > Local secrets; production secrets (supabase secrets set, list)"
      - id: vercel-env
        url: "https://vercel.com/docs/environment-variables"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Environment variables > introduction (Config and Secret values, encryption at rest)"
      - id: vercel-env-cli
        url: "https://vercel.com/docs/cli/env"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "vercel env > Usage and Extended Usage (warning about shell history)"
  - id: provider-console
    title: Model provider consoles, keys and spend limits
    role: Where the model providers that lessons name issue API keys and what spending controls they document.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A provider moves its console or changes its spend-limit controls.
    limits: Documented capabilities only; the signed-in navigation to these settings is not recorded. Limits and alerts act on the provider's tracked spend, which can lag actual usage.
    facts:
      - subject: Anthropic — Console and API keys
        value: The Claude Console is at platform.claude.com, where API keys are created; the getting-started guide lists a Console account and an API key as prerequisites.
        applies_to: Claude API documentation (get started)
        evidence: [anthropic-get-started]
      - subject: Anthropic — spend limits
        value: Spend limits set a maximum monthly cost an organization can incur for API usage. The API enforces service-configured limits at the organization level, and you can set user-configurable limits for your organization's workspaces.
        applies_to: Claude API rate limits documentation
        evidence: [anthropic-rate-limits]
      - subject: OpenAI — API keys
        value: The quickstart directs you to create an API key in the API dashboard before your first call.
        applies_to: OpenAI API quickstart
        evidence: [openai-quickstart]
      - subject: OpenAI — spend alerts and hard spend limits
        value: Spend alerts send a notification and let traffic continue; a hard spend limit for an organization or project makes affected API requests return a 429 error once tracked spend reaches it. Both are separate from the approved monthly usage limit OpenAI sets for each organization.
        applies_to: OpenAI API spend limits and rate limits documentation
        evidence: [openai-spend-limits, openai-rate-limits]
    evidence:
      - id: anthropic-get-started
        url: "https://platform.claude.com/docs/en/get-started"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Get started with Claude > Prerequisites (links to the Console and Get your API key)"
      - id: anthropic-rate-limits
        url: "https://platform.claude.com/docs/en/api/rate-limits"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Rate limits > introduction (two types of limits)"
      - id: openai-quickstart
        url: "https://developers.openai.com/api/docs/quickstart"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Quickstart > Create and export an API key"
      - id: openai-rate-limits
        url: "https://developers.openai.com/api/docs/guides/rate-limits"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Rate limits > usage tiers note on approved monthly usage limit; Spend limits table"
      - id: openai-spend-limits
        url: "https://developers.openai.com/api/docs/guides/spend-limits"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Spend limits > introduction and comparison of spend alerts and hard spend limits"
  - id: provider-data-use
    title: Whether providers train on what you send
    role: What each named model provider's own policy says about using API or plan inputs and outputs to train or improve its models.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A provider updates its data-use policy, privacy article or terms.
    limits: Summarises the providers' published policy statements on the check date; it is not legal advice and does not cover every product, region, enterprise agreement or retention detail. Policies for consumer plans and for APIs differ; check the one that matches how you use the service.
    facts:
      - subject: Anthropic — commercial products (API, Claude for Work)
        value: By default, inputs and outputs from commercial products are not used to train Anthropic's models. They may be used if you explicitly report feedback or otherwise choose to allow it.
        applies_to: Anthropic Privacy Center article dated August 18, 2026
        evidence: [anthropic-commercial-training]
      - subject: Anthropic — consumer plans (Claude Free, Pro, Max, including Claude Code on those plans)
        value: Chats and coding sessions are used to improve models if you allow it in your privacy settings or otherwise explicitly opt in. Conversations flagged for safety review may be used to improve Anthropic's detection and enforcement of its Usage Policy, including training models for its Safeguards team. Incognito chats are not used to improve Claude.
        applies_to: Anthropic Privacy Center article dated March 16, 2026
        evidence: [anthropic-consumer-training]
      - subject: Google — Gemini Developer API
        value: The pricing page marks content on the free tier as used to improve Google's products and content on the paid tier as not used.
        applies_to: Gemini Developer API pricing page (tier comparison and per-model 'Used to improve our products' rows)
        evidence: [gemini-pricing-data-use]
      - subject: OpenAI — API
        value: Since March 1, 2023, data sent to the OpenAI API is not used to train or improve OpenAI models unless you explicitly opt in. Abuse-monitoring logs are kept for up to 30 days by default.
        applies_to: OpenAI API data controls documentation
        evidence: [openai-your-data]
    evidence:
      - id: anthropic-commercial-training
        url: "https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Commercial Customers > Is my data used for model training? (first two paragraphs)"
      - id: anthropic-consumer-training
        url: "https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Consumers > Is my data used for model training? (conditions list; Incognito chats)"
      - id: gemini-pricing-data-use
        url: "https://ai.google.dev/gemini-api/docs/pricing?hl=en"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "Free and Paid plan cards ('Content used to improve our products' / 'Content not used to improve our products'); per-model 'Used to improve our products' rows"
      - id: openai-your-data
        url: "https://developers.openai.com/api/docs/guides/your-data"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Data controls in the OpenAI platform > introduction; Data retention controls for abuse monitoring"
  - id: reusable-instructions
    title: Reusable instructions — skills and prompt files
    role: How named tools store reusable, on-demand instructions that an agent or user can invoke, as distinct from always-loaded project instructions.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: The Agent Skills format or a listed tool's skills or prompt-file support changes.
    limits: Locations and loading behaviour as documented; tools add their own frontmatter fields and precedence rules not recorded here.
    facts:
      - subject: Agent Skills format
        value: An open format in which a skill is a folder containing a SKILL.md file with metadata (at minimum a name and description) and instructions, optionally with scripts, references and assets. Agents start with each skill's description and load the full instructions only when a task calls for them.
        applies_to: agentskills.io
        evidence: [agent-skills]
      - subject: Claude Code — skills
        value: A skill is a SKILL.md file, for example .claude/skills/deploy/SKILL.md, invoked as /deploy or used by Claude when relevant; its body loads only when used. Custom commands have been merged into skills, and existing .claude/commands/ files keep working. Claude Code skills follow the Agent Skills open standard.
        applies_to: Claude Code skills documentation
        evidence: [claude-code-skills]
      - subject: Codex — skills
        value: Skills build on the open agent skills standard. Codex scans .agents/skills in every directory from the current working directory up to the repository root, starts with each skill's name and description, and loads the full SKILL.md when it uses the skill.
        applies_to: Codex skills documentation
        evidence: [codex-skills]
      - subject: Cursor — skills
        value: Cursor supports Agent Skills as folders containing SKILL.md (for example under .agents/skills/) and, for compatibility, also loads skills from .claude/skills/, .codex/skills/, ~/.claude/skills/ and ~/.codex/skills/.
        applies_to: Cursor Agent Skills documentation
        evidence: [cursor-skills]
      - subject: VS Code (GitHub Copilot) — prompt files
        value: The Local agent's default location for workspace prompt files is the .github/prompts folder; user-level prompt files live in the VS Code profile.
        applies_to: VS Code prompt files documentation
        evidence: [vscode-prompt-files]
    evidence:
      - id: agent-skills
        url: "https://agentskills.io/home"
        checked_on: "2026-10-07"
        source_kind: specification
        locator: "What are Agent Skills?; How do Agent Skills work? (discovery, activation)"
      - id: claude-code-skills
        url: "https://code.claude.com/docs/en/skills"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Extend Claude with skills > introduction"
      - id: codex-skills
        url: "https://developers.openai.com/codex/skills"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Build skills > introduction; skill locations (REPO scope)"
      - id: cursor-skills
        url: "https://cursor.com/docs/context/skills"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Agent Skills > skill directories (compatibility note and folder structure)"
      - id: vscode-prompt-files
        url: "https://code.visualstudio.com/docs/copilot/customization/prompt-files"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Prompt files > default file locations table"
  - id: secret-patterns
    title: Recognisable API key formats
    role: The key prefixes that providers document, so a secrets inventory can recognise which service a credential belongs to and whether it is a test or live key.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A provider introduces, renames or retires a key type.
    limits: Only prefixes the provider itself documents are listed. The OpenAI, Anthropic and Resend pages checked do not state a key prefix, so none is recorded for them. A prefix identifies a key's type; it says nothing about whether the key is still valid. Never paste a real key into a document or chat.
    facts:
      - subject: Clerk
        value: Publishable keys start pk_test_ in development instances and pk_live_ in production; secret keys start sk_test_ in development and sk_live_ in production. The secret key must not be exposed on the frontend.
        applies_to: Clerk environment variables documentation
        evidence: [clerk-env]
      - subject: Stripe
        value: Sandbox keys start pk_test_ (publishable), rk_test_ (restricted) and sk_test_ (secret); live keys start pk_live_, rk_live_ and sk_live_. Organization API keys start sk_org_. Publishable keys can appear in front-end code; restricted, secret and organization keys cannot.
        applies_to: Stripe API keys documentation
        evidence: [stripe-keys]
      - subject: Supabase
        value: Publishable keys have the form sb_publishable_... and are safe to expose; secret keys have the form sb_secret_... and belong only in backend components. The older anon and service_role keys are being deprecated by the end of 2026.
        applies_to: Supabase API keys documentation
        evidence: [supabase-keys]
    evidence:
      - id: clerk-env
        url: "https://clerk.com/docs/guides/development/clerk-environment-variables"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Clerk environment variables > publishable and secret key variables"
      - id: stripe-keys
        url: "https://docs.stripe.com/keys"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "API keys > key types table and sandbox/live prefixes (read through the page's Markdown version)"
      - id: supabase-keys
        url: "https://supabase.com/docs/guides/api/api-keys"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Understanding API keys > key types table and deprecation note"
---

Rows hold exact commands, file names and configuration shapes because a working setup needs them. Where a row includes a snippet, copy the snippet rather than retyping it, and check the linked documentation first: these details change.

Rows are sorted by subject; their order is not a ranking or a recommendation. Commands that change a live system — deploying, setting a production secret — still need your decision about whether an agent may run them.
