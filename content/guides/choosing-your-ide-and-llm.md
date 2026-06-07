---
id: choosing-your-ide-and-llm
title: Choosing Your IDE and LLM
summary: Your IDE is the workshop. The LLM is the collaborator. This guide helps you pick both, wire them together, and understand what each costs — without getting locked into a choice you'll regret.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 0
journey_rank: 50
intro: |
  Agentic coding requires two pieces of software that don't come from the same vendor: an IDE (the editor where you and the agent work together) and an LLM (the model that actually does the reasoning). They're often bundled in marketing, but they're separable tools — and getting comfortable with that separation is the difference between feeling locked in and feeling in control.
tags:
  - ide
  - llm
  - tooling
  - getting-started
related:
  - choosing-your-application-channel
  - the-mental-model-of-your-app
  - setting-up-git-and-github
  - understanding-llms
next_steps:
  - Install one IDE (we recommend starting with Cursor or VS Code).
  - Sign up for one LLM provider (we recommend starting with Anthropic or OpenAI).
  - Connect the IDE to the LLM and run your first agentic prompt.
  - Plug the ContextQB MCP in so your agent has the methodology on day one.
---

# Choosing Your IDE and LLM

**Plain language:** You need two things to start coding with AI. The first is an IDE — basically a fancy text editor where you and the agent can both see and change files. The second is an LLM — the model that does the actual reasoning when the agent works. They're separate products, and learning that they're separate is the most important lesson in this guide. Once you know that, every other choice gets simpler.

## You're in the right place

If you've never picked an IDE before, or if the difference between "Cursor" and "GPT-5" is fuzzy, you're not behind. You're at the right step. This stuff is genuinely new — most of the tools in this guide didn't exist in their current form three years ago, and the marketing around them mixes the layers on purpose so each product can claim more credit.

By the end of this guide you'll know what you're choosing, why, and how to change your mind later without losing work. That's all you need.

## Your IDE is your workshop. Your LLM is your collaborator.

The mental model that makes everything else easy:

- The **IDE** is the room. It's where the files live in front of you, where the agent's changes appear, where the terminal opens, where you commit code, where you browse the codebase. It's a piece of software that runs on your computer.
- The **LLM** is the brain. It's a service that lives on a server somewhere — Anthropic's servers for Claude, OpenAI's for GPT, Google's for Gemini. When the agent in your IDE "thinks," it's sending a request to that service and getting back text.

The IDE talks to the LLM over the internet. You can swap one without swapping the other. Cursor with Claude. Cursor with GPT-5. VS Code with Claude. Zed with Gemini. All valid combinations. The skill is recognising which layer you're configuring at any given moment.

## The IDE landscape

These are the major options as of mid-2026. The list will look different in a year — that's fine. The framing below outlasts the products.

| IDE                                                                | What it is                                                                                           | Best for                                                             | Free?                                            |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| **[Cursor](https://cursor.com)**                                   | A fork of VS Code rebuilt around agentic coding. Native agent mode, MCP support, multi-model picker. | Most builders most of the time. The default we'd recommend.          | Free tier with limits; paid plans for heavy use. |
| **[VS Code](https://code.visualstudio.com) + GitHub Copilot**      | Microsoft's editor with GitHub's AI extensions. Huge ecosystem, deep enterprise support.             | Anyone already in the Microsoft / GitHub world.                      | Editor is free; Copilot is paid.                 |
| **[Windsurf](https://windsurf.com)**                               | Built specifically for AI-assisted development with strong agent mode. Earlier known as Codeium.     | If Cursor's UX doesn't click for you — Windsurf is the closest peer. | Free tier; paid tiers for serious use.           |
| **[Zed](https://zed.dev)**                                         | A newer, very fast editor with AI integration built in. Mac-first; Linux supported.                  | Performance-sensitive users; people who liked Sublime Text.          | Free; AI features bring-your-own-key.            |
| **JetBrains IDEs + AI Assistant**                                  | IntelliJ, WebStorm, PyCharm, etc., with the JetBrains AI extension.                                  | Existing JetBrains users; teams already on those tools.              | IDE has free and paid tiers; AI is paid.         |
| **[Claude Code](https://docs.claude.com/en/docs/claude-code)**     | Anthropic's terminal-based agent. Not technically an IDE, but covers most of the same workflow.      | Terminal-native developers; people who don't want a heavy editor.    | Bundled with Claude subscription.                |
| **[OpenAI Codex CLI](https://openai.com/index/openai-codex/)**     | OpenAI's coding agent. Similar shape to Claude Code.                                                 | Same as above; comes from the OpenAI side.                           | Bundled with OpenAI subscription.                |
| **[Aider](https://aider.chat) / [Continue](https://continue.dev)** | Open-source CLI / VS Code extension that talk to whichever LLM you point them at.                    | Hobbyists; privacy-conscious builders running local LLMs.            | Free, MIT-licensed.                              |

## What to look for in an IDE

A few criteria worth applying when you choose:

1. **MCP support.** The Model Context Protocol is how agents pull in external context — like the ContextQB methodology. If you want your agent to read principles and playbooks by URI, you want an IDE that speaks MCP. Cursor, Claude Desktop, VS Code (with extensions), Windsurf, and Zed all support it as of 2026.
2. **Agent mode quality.** "Chat with the editor" is table stakes. The differentiator is the agent mode — can the AI loop on a task, run shell commands, edit multiple files, and report back? Cursor and Windsurf lead here; Claude Code and Codex CLI are the terminal equivalents.
3. **Model picker.** Are you locked into one LLM, or can you swap (Claude for hard reasoning, GPT for fast edits, Gemini for big context)? Most modern IDEs let you choose.
4. **Bring-your-own-key.** Can you plug in your own API key to bypass the IDE's subscription? Useful if you already have credits with a provider, or if you want to run a local model.
5. **Privacy posture.** Does the IDE send your code to its servers? Does it train on your data by default? Most vendors offer enterprise tiers that turn these off — read the privacy page before pasting in secrets. (Spoiler: even with privacy mode on, don't paste secrets. See [Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github) for why.)
6. **Cost predictability.** Subscriptions are simpler to budget than per-token usage. Pay-per-token gives you finer control but can surprise you when you run a long agent session.

## The LLM landscape, briefly

The deeper version of this section is in [Understanding LLMs](contextqb://guides/understanding-llms). The short version:

| Family                                           | Who makes it        | Where it shines                                                                                                      |
| ------------------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Claude** (Opus, Sonnet, Haiku)                 | Anthropic           | Long reasoning chains, code review, careful refactoring, agentic loops. The default many builders reach for in 2026. |
| **GPT** (5, 5.1)                                 | OpenAI              | Fast iteration, broad capability, strong "instruction following." Big ecosystem of tools and integrations.           |
| **Gemini** (3.x)                                 | Google              | Massive context windows, multimodal (handles images well), competitive on reasoning.                                 |
| **Grok**                                         | xAI                 | Less common for serious coding work; tied to X's data.                                                               |
| **Open-source** (Llama, Qwen, DeepSeek, Mistral) | Various / community | Free if you run them locally; lower-quality than frontier closed models but usable for many tasks.                   |

You don't need to understand every model. Pick one provider to start, do real work with it for a couple of weeks, and you'll develop intuition about when to reach for something else. Most builders end up using 2–3 models regularly.

## How to wire them together

Three patterns. Pick whichever your chosen IDE supports:

### Pattern A — IDE-bundled subscription (simplest)

You pay the IDE vendor a flat monthly fee. They include access to the LLMs they've negotiated with. Cursor's Pro plan, GitHub Copilot, Windsurf's plans all work this way.

- **Pros:** One bill. No API keys to manage. The IDE picks sensible defaults.
- **Cons:** You're at the IDE vendor's mercy on which models they offer and at what daily limits. Heavy users can hit caps.
- **Setup:** Sign up, pay, log in. The IDE handles the rest.

### Pattern B — Bring your own API key (most flexible)

You sign up directly with an LLM provider (Anthropic, OpenAI, Google), get an API key, and paste it into your IDE's settings.

- **Pros:** Pay per token used, full model picker, no IDE-imposed limits. Switch providers without changing IDEs.
- **Cons:** You manage the keys. Cost is harder to predict (a runaway agent loop can be expensive). You'll want billing alerts.
- **Setup:**
  1. Create an account with the provider (e.g., [console.anthropic.com](https://console.anthropic.com)).
  2. Generate an API key. Treat it like a secret — see [Secrets Have Provenance](contextqb://principles/secrets-have-provenance).
  3. In your IDE's settings, find the "model providers" or "AI settings" pane. Paste the key.
  4. Set a billing limit / spend alert on the provider's dashboard. Do this _before_ your first heavy session.

### Pattern C — Local LLM (no internet required)

You run an LLM on your own machine using something like [Ollama](https://ollama.com), [LM Studio](https://lmstudio.ai), or [llama.cpp](https://github.com/ggml-org/llama.cpp). Your IDE talks to that local server instead of a cloud API.

- **Pros:** Free. Private. Works offline. Useful for prototyping or for situations where you can't send code to a third party.
- **Cons:** The open-source models you can run on a laptop are still meaningfully behind frontier closed models for coding. Setup is real work. Not the right starting point for first-time builders.
- **Setup:** Install Ollama, pull a model (e.g., `ollama pull qwen2.5-coder`), point your IDE at `localhost:11434`. Most IDEs that support BYOK also support this.

Most builders start with Pattern A, graduate to Pattern B once they have a model preference, and only touch Pattern C for specific privacy or experimental reasons.

## A recommended starter setup

If you want a single, opinionated answer:

1. **IDE:** [Cursor](https://cursor.com). Free tier is generous; Pro is $20/month if you want more. Excellent agent mode. Strong MCP support.
2. **LLM:** [Claude](https://claude.com) via Anthropic. Sonnet 4.x for most tasks; Opus for hard reasoning. (Both are available inside Cursor on its subscription.)
3. **Integration:** Stay on Cursor's bundled subscription for the first month. You'll develop a feel for whether you need more control.
4. **MCP:** Install the [ContextQB MCP](https://contextqb.com/mcp) — five minutes — and your agent has the methodology corpus from session one.

This is the setup most ContextQB writing is tested against. It's not the only right answer. It's the one we'd send a friend through.

## What it costs

Rough numbers as of mid-2026 (these change; check current pricing before deciding):

- **Bundled IDE plans:** $10–30/month, sometimes with a free tier. Cursor Pro, GitHub Copilot, Windsurf Pro all sit in this range. Heavy use can require higher tiers ($40–100/month) for unlimited fast requests.
- **Pay-per-token, frontier models:** Roughly $3–15 per million input tokens, $15–75 per million output tokens. A typical day of agentic coding (asking lots of questions, having the agent edit files) might run $1–10 in usage. A single agent loop that re-reads a large codebase several times can easily hit $5–20 by itself if you're not paying attention.
- **Pay-per-token, smaller/faster models:** Often 10x cheaper. Useful for routine tasks where reasoning depth doesn't matter.
- **Local LLMs:** Free in API cost. You pay in setup time, hardware (a recent Apple Silicon Mac or a machine with a decent GPU helps), and lower quality.

Two practical habits worth adopting:

- **Set a hard monthly cap** at the provider dashboard before you start any pay-per-token plan. $50 is a reasonable first ceiling for solo builders.
- **Watch the agent's behavior** when you give it a big task. If it reads the whole repo three times and edits eight files, that's a $2 prompt. That's fine — but be aware.

## You can change your mind later

The single most important property of this whole space: **nothing you choose here is permanent**. Your code lives in git, not in the IDE. Your prompts and principles live in Markdown, not in any one vendor's system. If Cursor changes its pricing in a way you don't like, you can be on Windsurf in twenty minutes with the same project. If Claude's reasoning ability stops feeling right, you can be on GPT in one settings change.

Resist the urge to research every option to perfection before starting. Pick something plausible, work in it for two weeks, then evaluate. You'll learn more by using one tool than by reading reviews of all five.

## Common pitfalls

- **Pasting secrets into chat.** Your `.env` file is _not_ documentation. See the [git setup guide](contextqb://guides/setting-up-git-and-github) for what to do instead.
- **Letting agent mode loose on an uncommitted repo.** Always commit before running a big agent task. Always. See [Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github) for the rhythm.
- **Ignoring billing alerts.** Pay-per-token plans can rack up faster than you'd expect if an agent goes into a loop. Set a hard cap.
- **Choosing based on benchmarks instead of feel.** Public LLM benchmarks measure things that aren't your work. The model that "wins" on a benchmark may feel worse for your actual codebase. Use the model for a week before deciding.
- **Conflating the IDE and the LLM.** "Cursor is bad at refactoring" usually means "the LLM Cursor was using was bad at refactoring." Switch the model first.

## What "good enough" looks like at this stage

You've picked the right setup if:

- [ ] You have one IDE installed and you've opened a real project in it.
- [ ] You have one LLM provider set up (bundled or BYOK).
- [ ] You've done at least one productive agent session — even if small.
- [ ] You know how to switch models inside your IDE.
- [ ] You know roughly what a day of usage costs you (check the dashboard).
- [ ] The [ContextQB MCP](https://contextqb.com/mcp) is installed so your agent has methodology context.

That's enough. The deeper questions — when to use which model, how to optimise prompts, how to stretch a free tier — those come with use.

## See also

- [Guide: Understanding LLMs](contextqb://guides/understanding-llms) — the longer, model-by-model treatment.
- [Guide: The Mental Model of Your App](contextqb://guides/the-mental-model-of-your-app) — what you think about before you open the IDE.
- [Guide: Setting Up Git and GitHub](contextqb://guides/setting-up-git-and-github) — the safety net that makes agentic coding survivable.
- [Playbook: Set Up AGENTS.md for Your Project](contextqb://playbooks/set-up-agents-md) — operating instructions for whatever agent you choose.
- [Playbook: Set Security Guardrails for Your Agent](contextqb://playbooks/set-security-guardrails-for-your-agent) — what to bound your agent's capabilities to.
- [Principle: AI Output Is Untrusted Code](contextqb://principles/ai-output-is-untrusted-code) — the mental model for what the LLM produces.
- [Principle: Least Privilege for Agents](contextqb://principles/least-privilege-for-agents) — what to give the IDE/agent access to.
- [Cursor docs](https://docs.cursor.com)
- [Anthropic API docs](https://docs.claude.com)
- [OpenAI API docs](https://platform.openai.com/docs)
