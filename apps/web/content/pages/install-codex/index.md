---
eyebrow: "Install · Codex"
headline: Connect ContextQB to Codex.
subhead: >-
  Paste one command into your terminal to add ContextQB to Codex, then check
  that it works.
meta_title: Install ContextQB in Codex
meta_description: "Add the free ContextQB MCP library to OpenAI Codex with one codex mcp add command, then verify that the agent can call it."
troubleshooting: |-
  - **The terminal says `codex: command not found`.** The Codex command-line tool isn't installed yet, or your terminal can't find it. Install it first, then run the command again.
  - **Codex says contextqb already exists.** You're probably already connected. Keep the existing entry. To see what it contains, run `codex mcp get contextqb`.
  - **Codex can't see the tools.** Start a new Codex session after adding ContextQB, so Codex loads the new tools.

---

A terminal is the text window where you type commands (Terminal on a Mac, PowerShell on Windows). Copy the command below, paste it into your terminal and press Enter. Codex saves ContextQB in your Codex settings, which its command-line tool, editor extension and desktop app all share. The website doesn't run anything on your computer.
