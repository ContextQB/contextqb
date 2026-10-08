---
id: tools
title: Tools and agent environments
summary: Neutral, dated facts about the tools that lessons name as examples of a role — agentic coding tools, code search, verifiers, scanners, secrets managers, managed services, SDKs and git hosting and clients. Each row says what the tool is according to its own documentation. No ranking and no recommendation.
version: 0.1.0
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
entries:
  - id: agentic-ides
    title: Agentic coding tools
    role: What each agentic coding tool that lessons name is, where it runs, and the parallel-work features its documentation describes.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A listed tool is renamed, acquired, retired or changes its surfaces or agent features.
    limits: Describes each tool in its vendor's own terms on the check date; inclusion is not an endorsement, the list is not exhaustive, and nothing here compares quality, price or safety. Prices are in the pricing group, instruction files and permissions in the setup group.
    facts:
      - subject: Aider
        value: A terminal tool for AI pair programming.
        applies_to: aider.chat
        evidence: [aider-home]
      - subject: Antigravity (Google)
        value: Google describes Antigravity as an agent platform; its product list names Antigravity 2.0, Antigravity CLI, Antigravity Extensions, Antigravity IDE and Antigravity SDK.
        applies_to: antigravity.google
        evidence: [antigravity-home]
      - subject: Claude Code (Anthropic)
        value: An agentic coding tool that reads a codebase, edits files, runs commands and integrates with development tools; available in the terminal, IDEs, a desktop app and the browser.
        applies_to: Claude Code documentation
        evidence: [claude-code-overview]
      - subject: Claude Code — subagents and agent view
        value: Subagents run in their own context window with their own system prompt, tool access and permissions, and return a summary. Agent view, opened with claude agents, is one screen for dispatching and watching background sessions.
        applies_to: Claude Code documentation (subagents; agent view)
        evidence: [claude-code-subagents, claude-code-agent-view]
      - subject: Codex (OpenAI)
        value: Offered as the Codex CLI (inspect, edit and run code from the terminal), an IDE extension and Codex Cloud. ChatGPT Work and Codex can run subagent workflows that spawn specialized agents in parallel and collect their results.
        applies_to: Codex documentation
        evidence: [codex-cli, codex-subagents]
      - subject: Continue
        value: The continue.dev site states that Continue has been acquired by Cursor.
        applies_to: continue.dev
        evidence: [continue-home]
      - subject: Cursor
        value: An AI coding agent; its documentation covers the desktop app, a CLI and cloud agents, which run in isolated cloud virtual machines with full development environments instead of on your machine.
        applies_to: Cursor site and Cloud Agents documentation
        evidence: [cursor-home, cursor-cloud-agents]
      - subject: Devin Desktop (Cognition; formerly Windsurf)
        value: Manages local and cloud agents from one surface. Spaces group agent sessions, pull requests, files and shared context for a task in the Agent Command Center. windsurf.com addresses now redirect to devin.ai.
        applies_to: Devin Desktop site and documentation
        evidence: [devin-desktop, devin-spaces, windsurf-redirect]
      - subject: GitHub Copilot
        value: Works in the editor, the terminal, on the desktop and on GitHub, from an open issue to reviewing and merging a pull request; the plans page lists agent mode, code review, the Copilot cloud agent and Copilot CLI among the features that use AI credits.
        applies_to: GitHub Copilot feature and plans pages
        evidence: [copilot-home, copilot-plans]
      - subject: Junie (JetBrains)
        value: A coding agent from JetBrains, offered as Junie Local and Junie CLI.
        applies_to: junie.jetbrains.com
        evidence: [junie-home]
      - subject: VS Code (Microsoft)
        value: A code editor whose agent sessions run through selectable harnesses; its instructions documentation lists Copilot, Anthropic Claude, OpenAI Codex and Local harnesses.
        applies_to: VS Code custom instructions documentation
        evidence: [vscode-instructions]
      - subject: Zed
        value: A code editor with a native agent, Zed Agent, and support for External Agents — such as Claude, Codex, OpenCode, Copilot and Cursor — integrated through the Agent Client Protocol (ACP).
        applies_to: Zed documentation index
        evidence: [zed-docs-index]
    evidence:
      - id: aider-home
        url: "https://aider.chat/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title ('AI Pair Programming in Your Terminal')"
      - id: antigravity-home
        url: "https://antigravity.google/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description and Products menu"
      - id: claude-code-agent-view
        url: "https://code.claude.com/docs/en/agent-view"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Manage multiple agents with agent view > introduction"
      - id: claude-code-overview
        url: "https://code.claude.com/docs/en/overview"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Overview > page description"
      - id: claude-code-subagents
        url: "https://code.claude.com/docs/en/sub-agents"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Create custom subagents > introduction"
      - id: codex-cli
        url: "https://developers.openai.com/codex/cli"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Codex CLI > introduction; 'Available on' list (Codex CLI, Codex IDE extension, Codex Cloud)"
      - id: codex-subagents
        url: "https://developers.openai.com/codex/subagents"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Subagents > introduction"
      - id: continue-home
        url: "https://www.continue.dev/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title and description ('Continue has been acquired by Cursor')"
      - id: copilot-home
        url: "https://github.com/features/copilot"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "GitHub Copilot feature page description"
      - id: copilot-plans
        url: "https://github.com/features/copilot/plans"
        checked_on: "2026-10-07"
        source_kind: vendor-pricing
        locator: "GitHub AI Credits description (features that consume credits)"
      - id: cursor-cloud-agents
        url: "https://cursor.com/docs/cloud-agent"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Cloud Agents > introduction"
      - id: cursor-home
        url: "https://cursor.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title and description"
      - id: devin-desktop
        url: "https://devin.ai/desktop"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Devin Desktop page description"
      - id: devin-spaces
        url: "https://docs.devin.ai/desktop/spaces"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Spaces > introduction and What lives in a Space"
      - id: junie-home
        url: "https://junie.jetbrains.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title and product menu (Junie Local, Junie CLI)"
      - id: vscode-instructions
        url: "https://code.visualstudio.com/docs/copilot/customization/custom-instructions"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Use custom instructions in VS Code > harness table"
      - id: windsurf-redirect
        url: "https://windsurf.com/pricing"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "HTTP redirect from windsurf.com/pricing to devin.ai/pricing, observed on the check date"
      - id: zed-docs-index
        url: "https://zed.dev/docs/llms.txt"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Documentation index, AI section (Zed Agent; External Agents)"
  - id: ai-sdks
    title: AI SDK packages
    role: The package names under which the AI SDKs that lessons mention are published, so an audit can recognise AI integrations in a project's dependencies.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A listed SDK changes its package name or a new major version is released.
    limits: JavaScript and TypeScript packages on the npm registry only; Python and other languages publish under different names. Versions are the latest published on the check date. Finding a package shows that a project can call a model; it does not show how.
    facts:
      - subject: AI SDK (Vercel)
        value: npm package ai (latest 7.0.130), described as the AI SDK by Vercel, a single interface for many model providers.
        applies_to: npm registry
        evidence: [npm-ai]
      - subject: Anthropic TypeScript SDK
        value: npm package @anthropic-ai/sdk (latest 0.132.0), described as the official TypeScript library for the Anthropic API.
        applies_to: npm registry
        evidence: [npm-anthropic]
      - subject: LangChain.js
        value: npm packages langchain (latest 1.5.15) and @langchain/core (latest 1.2.17), from the langchain-ai/langchainjs repository.
        applies_to: npm registry
        evidence: [npm-langchain, npm-langchain-core]
      - subject: LlamaIndex.TS
        value: npm package llamaindex (latest 0.12.1), from the run-llama/LlamaIndexTS repository.
        applies_to: npm registry
        evidence: [npm-llamaindex]
      - subject: OpenAI TypeScript SDK
        value: npm package openai (latest 7.30.0), described as the official TypeScript library for the OpenAI API.
        applies_to: npm registry
        evidence: [npm-openai]
      - subject: Transformers.js (Hugging Face)
        value: npm package @huggingface/transformers (latest 4.3.1), which runs models directly in the browser.
        applies_to: npm registry
        evidence: [npm-transformers]
      - subject: WebLLM
        value: npm package @mlc-ai/web-llm (latest 0.2.85), described as hardware-accelerated language model chats in browsers.
        applies_to: npm registry
        evidence: [npm-web-llm]
    evidence:
      - id: npm-ai
        url: "https://registry.npmjs.org/ai/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description, repository"
      - id: npm-anthropic
        url: "https://registry.npmjs.org/@anthropic-ai/sdk/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description, repository"
      - id: npm-langchain
        url: "https://registry.npmjs.org/langchain/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description, repository"
      - id: npm-langchain-core
        url: "https://registry.npmjs.org/@langchain/core/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description, repository"
      - id: npm-llamaindex
        url: "https://registry.npmjs.org/llamaindex/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, repository"
      - id: npm-openai
        url: "https://registry.npmjs.org/openai/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description, repository"
      - id: npm-transformers
        url: "https://registry.npmjs.org/@huggingface/transformers/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description, repository"
      - id: npm-web-llm
        url: "https://registry.npmjs.org/@mlc-ai/web-llm/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description, repository"
  - id: codebase-retrieval
    title: How agentic tools search a codebase
    role: How named tools find relevant code in a repository — maps, indexes and search tools — as their documentation describes it.
    status: current
    owner: ContextQB editorial
    review_by: "2026-11-07"
    review_trigger: A listed tool changes its search, indexing or repository-map behaviour.
    limits: Documented mechanisms only; nothing here measures retrieval quality. Index storage and privacy details are as the vendor states them.
    facts:
      - subject: Aider — repository map
        value: Aider sends a concise map of the whole git repository, with the most important classes and functions and their signatures, to the model along with each change request.
        applies_to: Aider repository map documentation
        evidence: [aider-repomap]
      - subject: Cursor — search
        value: Agent uses Instant Grep, an exact-match and regex search that builds and queries its index on your machine; Cursor states it does not upload file paths or code to build a search index and does not store embeddings of your codebase for search. Agent can also spawn an Explore subagent in its own context window.
        applies_to: Cursor search documentation
        evidence: [cursor-search]
      - subject: GitHub Copilot in VS Code — #codebase
        value: The semantic search tool, referenced as #codebase, finds code by meaning and requires a workspace index that Copilot maintains automatically; text search, grep and file search work alongside it, and grep works without an index.
        applies_to: VS Code workspace context documentation
        evidence: [vscode-workspace-context]
    evidence:
      - id: aider-repomap
        url: "https://aider.chat/docs/repomap.html"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Repository map > introduction"
      - id: cursor-search
        url: "https://cursor.com/docs/context/semantic-search"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Search > Instant Grep; Privacy and security; Explore subagent"
      - id: vscode-workspace-context
        url: "https://code.visualstudio.com/docs/copilot/reference/workspace-context"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Search and read tools table; Semantic search"
  - id: data-fetching
    title: Data-fetching and server-state libraries
    role: What the data-fetching tools that lessons and examples name are, so that a lesson can speak of the role while a project uses a specific library.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: A listed library is renamed or changes its package name.
    limits: React ecosystem only; package versions are the latest published on the check date. Nothing here says which approach suits a project.
    facts:
      - subject: React Server Components
        value: Server Components are a type of React component that renders ahead of time, before bundling, in an environment separate from the client app or SSR server — once at build time or for each request.
        applies_to: React 19.3 documentation
        evidence: [react-server-components]
      - subject: SWR
        value: npm package swr (latest 2.5.1), a React Hooks library for remote data fetching named after the stale-while-revalidate HTTP cache strategy.
        applies_to: SWR documentation and npm registry
        evidence: [swr-home, npm-swr]
      - subject: TanStack Query (formerly React Query)
        value: npm package @tanstack/react-query (latest 5.104.1), for fetching, caching, synchronizing and updating server state.
        applies_to: TanStack Query React documentation and npm registry
        evidence: [tanstack-query-overview, npm-tanstack-query]
    evidence:
      - id: npm-swr
        url: "https://registry.npmjs.org/swr/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description"
      - id: npm-tanstack-query
        url: "https://registry.npmjs.org/@tanstack/react-query/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description"
      - id: react-server-components
        url: "https://react.dev/reference/rsc/server-components"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Server Components > introduction"
      - id: swr-home
        url: "https://swr.vercel.app/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page > 'Fetch, then revalidate'"
      - id: tanstack-query-overview
        url: "https://tanstack.com/query/latest/docs/framework/react/overview"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Overview > introduction"
  - id: git-clients
    title: Git clients
    role: The ways of working with Git outside the bare command line that lessons name — desktop apps, terminal interfaces and editors with built-in Git.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: A listed client is renamed, retired or changes how it is installed.
    limits: Identity and form only; not a comparison. Every option still uses Git underneath.
    facts:
      - subject: GitHub CLI (gh)
        value: GitHub's official command-line tool, which brings pull requests, issues and other GitHub concepts to the terminal; the site lists brew install gh among its install options.
        applies_to: cli.github.com
        evidence: [github-cli]
        snippet:
          language: shell
          text: brew install gh
      - subject: GitHub Desktop
        value: A graphical (GUI) Git client from GitHub.
        applies_to: GitHub Desktop page
        evidence: [github-desktop]
      - subject: lazygit
        value: A terminal user interface for git commands.
        applies_to: jesseduffield/lazygit repository
        evidence: [lazygit]
      - subject: VS Code — built-in Git
        value: Visual Studio Code has built-in Git support for reviewing changes, creating commits and collaborating; pull requests and issues need the GitHub Pull Requests and Issues extension.
        applies_to: VS Code source control documentation
        evidence: [vscode-source-control]
      - subject: Zed — built-in Git
        value: Zed has built-in Git support, including a Git Panel, for managing version control inside the editor.
        applies_to: Zed Git documentation
        evidence: [zed-git]
    evidence:
      - id: github-cli
        url: "https://cli.github.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page > description and install options"
      - id: github-desktop
        url: "https://desktop.github.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "GitHub Desktop page (redirects to github.com/apps/desktop) > introduction"
      - id: lazygit
        url: "https://github.com/jesseduffield/lazygit"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "Repository description"
      - id: vscode-source-control
        url: "https://code.visualstudio.com/docs/sourcecontrol/overview"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Source control > introduction; Working with GitHub pull requests and issues"
      - id: zed-git
        url: "https://zed.dev/docs/git"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Git > introduction"
  - id: git-hosting
    title: Git hosting services and forges
    role: Which Git hosting options lessons name are hosted services and which are software you install and run yourself.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: A listed service changes its hosting model or ownership.
    limits: Hosting model and self-description only; features, pricing and limits are not compared. A forge you host yourself is your responsibility to secure and back up.
    facts:
      - subject: Bitbucket (Atlassian)
        value: Code hosting and CI/CD as part of the Atlassian Cloud platform, integrated with Jira; the product page states no infrastructure is required.
        applies_to: Bitbucket Cloud product page
        evidence: [bitbucket]
      - subject: Codeberg
        value: A non-profit, community-led organization that hosts free and open source projects.
        applies_to: codeberg.org
        evidence: [codeberg]
      - subject: Forgejo
        value: Self-hosted, lightweight software forge.
        applies_to: forgejo.org
        evidence: [forgejo]
      - subject: Gitea
        value: Self-hosted, all-in-one software development service including Git hosting, code review, team collaboration, a package registry and CI/CD.
        applies_to: about.gitea.com
        evidence: [gitea]
      - subject: GitHub
        value: Describes itself as where people build software and discover, fork and contribute to projects; Microsoft's VS Code documentation describes GitHub as a service that hosts Git repositories.
        applies_to: github.com/about; VS Code source control documentation
        evidence: [github-about, vscode-source-control]
      - subject: GitLab
        value: A software development platform available as a hosted service, which can also be installed on most GNU/Linux distributions, on several cloud providers and in Kubernetes clusters.
        applies_to: GitLab site and installation documentation
        evidence: [gitlab-home, gitlab-install]
    evidence:
      - id: bitbucket
        url: "https://bitbucket.org/product/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Bitbucket Cloud product page > introduction"
      - id: codeberg
        url: "https://codeberg.org/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description"
      - id: forgejo
        url: "https://forgejo.org/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description"
      - id: gitea
        url: "https://about.gitea.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description"
      - id: github-about
        url: "https://github.com/about"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "About GitHub page description"
      - id: gitlab-home
        url: "https://about.gitlab.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description"
      - id: gitlab-install
        url: "https://docs.gitlab.com/install/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Install GitLab > introduction"
      - id: vscode-source-control
        url: "https://code.visualstudio.com/docs/sourcecontrol/overview"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Source control > introduction ('GitHub is a service that hosts Git repositories')"
  - id: managed-services
    title: Managed services by role
    role: What role each managed service that lessons name plays in an application, in its vendor's own description, so an inventory can classify a dependency it finds.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A listed service is renamed, acquired, retired or changes its core role.
    limits: Role and self-description only — taken from each vendor's own site on the check date. Not a comparison, an endorsement or a security assessment; many services span several roles, and a service's security depends on how you configure it.
    facts:
      - subject: Anthropic API
        value: Model provider API; requests are authenticated with an Authorization Bearer header (x-api-key is a supported legacy fallback).
        applies_to: Claude API reference overview
        evidence: [anthropic-api]
      - subject: Auth.js (formerly NextAuth.js)
        value: Open-source authentication library for web frameworks; its documentation covers next-auth 5 (beta) and later and the @auth/* packages, with next-auth 4 documented separately.
        applies_to: authjs.dev
        evidence: [authjs]
      - subject: Auth0
        value: Authentication and authorization platform for users and AI agents.
        applies_to: auth0.com
        evidence: [auth0]
      - subject: Clerk
        value: User management and authentication service ("add complete user management to your application").
        applies_to: Clerk documentation
        evidence: [clerk]
      - subject: Cloudflare D1
        value: Serverless SQL database on Cloudflare.
        applies_to: Cloudflare D1 documentation
        evidence: [cloudflare-d1]
      - subject: Cloudflare R2
        value: Object storage with no egress fees.
        applies_to: Cloudflare R2 documentation
        evidence: [cloudflare-r2]
      - subject: Cloudflare Workers
        value: Platform for building and deploying serverless applications across Cloudflare.
        applies_to: Cloudflare Workers documentation
        evidence: [cloudflare-workers]
      - subject: Datadog
        value: Cloud monitoring as a service.
        applies_to: datadoghq.com
        evidence: [datadog]
      - subject: Lemon Squeezy
        value: Payments, tax and subscriptions for software companies, acting as merchant of record.
        applies_to: lemonsqueezy.com
        evidence: [lemonsqueezy]
      - subject: LogRocket
        value: Session replay, product analytics and error tracking.
        applies_to: logrocket.com
        evidence: [logrocket]
      - subject: Mixpanel
        value: Product analytics platform combining analytics, session replay, experiments and feature flags.
        applies_to: mixpanel.com
        evidence: [mixpanel]
      - subject: OpenAI API
        value: Model provider API; requests are authenticated with an Authorization Bearer header carrying an API key or access token.
        applies_to: OpenAI API reference overview
        evidence: [openai-api]
      - subject: PagerDuty
        value: Operations platform for automating, resolving and preventing critical issues, from detection to resolution.
        applies_to: pagerduty.com
        evidence: [pagerduty]
      - subject: PostHog
        value: Product platform that describes itself as your product's context layer, diagnosing problems and generating pull requests.
        applies_to: posthog.com
        evidence: [posthog]
      - subject: Resend
        value: Email-sending service for developers, for transactional and marketing email.
        applies_to: resend.com
        evidence: [resend]
      - subject: SendGrid (Twilio)
        value: Email API and email marketing platform, now offered through Twilio.com.
        applies_to: Twilio SendGrid page (sendgrid.com redirects there)
        evidence: [sendgrid]
      - subject: Sentry
        value: Application performance monitoring and error tracking.
        applies_to: sentry.io
        evidence: [sentry]
      - subject: Slack
        value: Work platform for connecting teams, managing projects and automating workflows.
        applies_to: slack.com
        evidence: [slack]
      - subject: Stripe
        value: Financial services platform for accepting payments, billing and money movement.
        applies_to: stripe.com
        evidence: [stripe]
      - subject: Supabase
        value: Postgres development platform providing backend features for building a product.
        applies_to: Supabase documentation
        evidence: [supabase]
      - subject: Vercel
        value: Platform for building, deploying and managing applications, with a CLI, SDKs and APIs.
        applies_to: Vercel documentation
        evidence: [vercel]
    evidence:
      - id: anthropic-api
        url: "https://platform.claude.com/docs/en/api/overview"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "API overview > request headers table (Authorization, x-api-key; read through the Markdown version)"
      - id: auth0
        url: "https://auth0.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description"
      - id: authjs
        url: "https://authjs.dev/getting-started"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Getting Started > introduction (versions covered)"
      - id: clerk
        url: "https://clerk.com/docs"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Docs home description ('Add complete user management to your application')"
      - id: cloudflare-d1
        url: "https://developers.cloudflare.com/d1/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "D1 overview description"
      - id: cloudflare-r2
        url: "https://developers.cloudflare.com/r2/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "R2 overview description"
      - id: cloudflare-workers
        url: "https://developers.cloudflare.com/workers/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Workers overview description"
      - id: datadog
        url: "https://www.datadoghq.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title"
      - id: lemonsqueezy
        url: "https://www.lemonsqueezy.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title and description"
      - id: logrocket
        url: "https://logrocket.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title"
      - id: mixpanel
        url: "https://mixpanel.com/home/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description"
      - id: openai-api
        url: "https://developers.openai.com/api/reference/overview"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "API reference overview > Authentication (read through the Markdown version)"
      - id: pagerduty
        url: "https://www.pagerduty.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description"
      - id: posthog
        url: "https://posthog.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title and description"
      - id: resend
        url: "https://resend.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title and description"
      - id: sendgrid
        url: "https://www.twilio.com/en-us/sendgrid"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "SendGrid page title and description"
      - id: sentry
        url: "https://sentry.io/welcome/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title"
      - id: slack
        url: "https://slack.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page title and description"
      - id: stripe
        url: "https://stripe.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description"
      - id: supabase
        url: "https://supabase.com/docs"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Docs home description"
      - id: vercel
        url: "https://vercel.com/docs"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Docs home description"
  - id: mcp-sdks
    title: Model Context Protocol SDKs
    role: The official SDKs for building MCP servers and clients, and the package names of the two most common ones.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: The MCP project changes its SDK list or tiers, or a listed package publishes a new major version.
    limits: The list and tier labels are the MCP project's own classification of feature completeness, protocol support and maintenance commitment, not a ContextQB assessment. Package versions are the latest published on the check date.
    facts:
      - subject: MCP official SDKs
        value: "The MCP project lists official SDKs with tiers: Tier 1 — TypeScript, Python, C#, Go, Rust and Ruby; Tier 2 — Java; Tier 3 — Swift, PHP and Kotlin. All SDKs support creating servers that expose tools, resources and prompts, and building clients."
        applies_to: modelcontextprotocol.io SDK page
        evidence: [mcp-sdk-page]
      - subject: Python SDK package
        value: PyPI package mcp (latest 2.3.0), from the modelcontextprotocol/python-sdk repository.
        applies_to: PyPI
        evidence: [pypi-mcp]
      - subject: TypeScript SDK package
        value: npm package @modelcontextprotocol/sdk (latest 1.32.1), from the modelcontextprotocol/typescript-sdk repository.
        applies_to: npm registry
        evidence: [npm-mcp-sdk]
    evidence:
      - id: mcp-sdk-page
        url: "https://modelcontextprotocol.io/docs/sdk"
        checked_on: "2026-10-07"
        source_kind: specification
        locator: "SDKs > Available SDKs table; Getting Started"
      - id: npm-mcp-sdk
        url: "https://registry.npmjs.org/@modelcontextprotocol/sdk/latest"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "Registry document: version, description, repository"
      - id: pypi-mcp
        url: "https://pypi.org/pypi/mcp/json"
        checked_on: "2026-10-07"
        source_kind: release-table
        locator: "PyPI JSON: info.name, info.version, project_urls"
  - id: secrets-managers
    title: Secrets managers
    role: What the dedicated secrets-management tools that lessons name are, as distinct from a hosting platform's own environment-variable settings.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: A listed product is renamed, retired or changes its core role.
    limits: Self-descriptions only; no comparison of features, price or security. Platform-native secret settings are in the setup group.
    facts:
      - subject: 1Password CLI
        value: Brings 1Password to the terminal, with sign-in by fingerprint, and can load environment variables from 1Password Environments into applications.
        applies_to: 1Password developer documentation
        evidence: [onepassword-cli]
      - subject: AWS Secrets Manager
        value: A web service for centrally managing the lifecycle of secrets.
        applies_to: AWS Secrets Manager user guide
        evidence: [aws-secrets-manager]
      - subject: Doppler
        value: A secrets management platform for securing, syncing and automating secrets across cloud and on-premises environments.
        applies_to: doppler.com
        evidence: [doppler]
    evidence:
      - id: aws-secrets-manager
        url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "What is AWS Secrets Manager? > page description"
      - id: doppler
        url: "https://www.doppler.com/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page description"
      - id: onepassword-cli
        url: "https://developer.1password.com/docs/cli/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "1Password CLI > introduction; Provision secrets"
  - id: security-scanners
    title: Dependency security scanners
    role: What the dependency-scanning commands that lessons name do.
    status: current
    owner: ContextQB editorial
    review_by: "2027-01-07"
    review_trigger: A listed scanner changes its command or advisory source.
    limits: Known-vulnerability checks of dependencies only; none of these reviews your own code's logic. Results depend on the advisory database at the time of the run.
    facts:
      - subject: npm audit
        value: Submits a description of the project's dependencies to the default registry and asks for a report of known vulnerabilities; npm audit fix applies remediations.
        applies_to: npm CLI 12.2.0 documentation
        evidence: [npm-audit]
        snippet:
          language: shell
          text: npm audit
      - subject: pnpm audit
        value: Checks installed packages for known security issues; since pnpm 11 it queries the registry's bulk advisories endpoint and identifies advisories by GitHub advisory ID (GHSA) rather than CVE.
        applies_to: pnpm CLI documentation
        evidence: [pnpm-audit]
        snippet:
          language: shell
          text: pnpm audit
      - subject: Snyk CLI — snyk test
        value: Checks projects for open-source vulnerabilities and license issues, auto-detecting supported manifest files; separate commands cover code, container and infrastructure-as-code scanning.
        applies_to: Snyk CLI documentation
        evidence: [snyk-test]
        snippet:
          language: shell
          text: snyk test
    evidence:
      - id: npm-audit
        url: "https://docs.npmjs.com/cli/v12/commands/npm-audit/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "npm-audit (Version 12.2.0) > Synopsis; Description"
      - id: pnpm-audit
        url: "https://pnpm.io/cli/audit"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "pnpm audit > description"
      - id: snyk-test
        url: "https://docs.snyk.io/developer-tools/snyk-cli/commands/test"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Test > Usage and Description"
  - id: verifiers-by-language
    title: Type checkers, linters, formatters and language servers by language
    role: What the verification tools that lessons name do and which language each serves, so an agent's output can be checked mechanically.
    status: current
    owner: ContextQB editorial
    review_by: "2027-04-07"
    review_trigger: A listed tool changes its role, configuration format or ownership.
    limits: Role and language only; configuration and versions vary by project. Inclusion is not a recommendation, and the list is not exhaustive.
    facts:
      - subject: Black (Python)
        value: Code formatter for Python, described as "the uncompromising code formatter".
        applies_to: Black 26.10.0 documentation
        evidence: [black]
      - subject: ESLint (JavaScript and TypeScript)
        value: Pluggable linter for JavaScript. Its configuration file is eslint.config.js, .mjs or .cjs (TypeScript variants need additional setup), placed in the project root and exporting an array of configuration objects.
        applies_to: ESLint documentation (latest)
        evidence: [eslint-config]
      - subject: gofmt (Go)
        value: Formats Go programs, using tabs for indentation and blanks for alignment.
        applies_to: Go command documentation
        evidence: [gofmt]
      - subject: gopls (Go)
        value: The official language server for Go, developed by the Go team; it provides IDE features to any LSP-compatible editor.
        applies_to: gopls documentation
        evidence: [gopls]
      - subject: mypy (Python)
        value: Static type checker for Python that checks code against type hints (PEP 484).
        applies_to: mypy 2.4.0 documentation
        evidence: [mypy]
      - subject: Prettier (many languages)
        value: Opinionated code formatter supporting JavaScript, TypeScript, JSX, CSS, HTML, JSON, GraphQL, Markdown and YAML, among others.
        applies_to: Prettier documentation
        evidence: [prettier]
      - subject: Pylance (Python in VS Code)
        value: A VS Code extension providing a language server for Python.
        applies_to: Visual Studio Marketplace listing
        evidence: [pylance]
      - subject: Pyright (Python)
        value: A full-featured, standards-based static type checker for Python.
        applies_to: Pyright README
        evidence: [pyright]
      - subject: rust-analyzer (Rust)
        value: An implementation of the Language Server Protocol for Rust, providing completion and go-to-definition in many editors.
        applies_to: rust-analyzer site
        evidence: [rust-analyzer]
      - subject: rustfmt (Rust)
        value: A tool for formatting Rust code according to style guidelines.
        applies_to: rustfmt README
        evidence: [rustfmt]
      - subject: tsc and tsserver (TypeScript)
        value: tsc compiles the project defined by the nearest tsconfig.json (or files passed on the command line) and reports type errors; tsserver wraps the TypeScript compiler and language services behind a JSON protocol for editors.
        applies_to: TypeScript documentation and wiki
        evidence: [tsc-cli, tsserver]
      - subject: Zod (TypeScript)
        value: A TypeScript-first validation library for defining schemas that validate data at runtime, with static type inference; Zod 4 is stable.
        applies_to: Zod documentation
        evidence: [zod]
    evidence:
      - id: black
        url: "https://black.readthedocs.io/en/stable/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Black 26.10.0 documentation > introduction"
      - id: eslint-config
        url: "https://eslint.org/docs/latest/use/configure/configuration-files"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Configuration Files > Configuration File"
      - id: gofmt
        url: "https://pkg.go.dev/cmd/gofmt"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "gofmt > Overview"
      - id: gopls
        url: "https://go.dev/gopls/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Gopls: The language server for Go > introduction"
      - id: mypy
        url: "https://mypy.readthedocs.io/en/stable/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Welcome to mypy documentation > introduction"
      - id: prettier
        url: "https://prettier.io/docs/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "What is Prettier? > supported languages list"
      - id: pylance
        url: "https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Marketplace listing description"
      - id: pyright
        url: "https://raw.githubusercontent.com/microsoft/pyright/main/README.md"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "README > introduction"
      - id: rust-analyzer
        url: "https://rust-analyzer.github.io/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Home page > About"
      - id: rustfmt
        url: "https://raw.githubusercontent.com/rust-lang/rustfmt/main/README.md"
        checked_on: "2026-10-07"
        source_kind: first-party-source
        locator: "README > first line"
      - id: tsc-cli
        url: "https://www.typescriptlang.org/docs/handbook/compiler-options.html"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "tsc CLI Options > Using the CLI"
      - id: tsserver
        url: "https://github.com/microsoft/TypeScript/wiki/Standalone-Server-%28tsserver%29"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Standalone Server (tsserver) > introduction"
      - id: zod
        url: "https://zod.dev/"
        checked_on: "2026-10-07"
        source_kind: vendor-docs
        locator: "Intro > introduction and stability note"
---

Each row names a tool that a lesson uses as an example of a role, and says what that tool is in its own vendor's words on the check date. The lessons teach the role — what a verifier, a secrets manager or an agentic coding tool is for — and how to judge one; this table only tells you what the named examples are.

Rows are sorted by subject; their order is not a ranking, and being listed is not an endorsement. Lessons that need exact commands or configuration link the setup group instead.
