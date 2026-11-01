---
eyebrow: "Install · VS Code"
headline: Connect ContextQB to VS Code.
subhead: >-
  Open VS Code's install prompt for the free ContextQB library, then check that
  Copilot's agent can use it.
meta_title: Install ContextQB in VS Code
meta_description: "Add the free ContextQB MCP library to Visual Studio Code with an install link or the MCP: Add Server command, then verify it in agent mode."
troubleshooting: |-
  - If a different editor opened, the link went to whichever app your computer has registered for VS Code links. Run **MCP: Add Server** in VS Code instead.
  - **Installed but disabled.** If the install view shows **Uninstall** and "This MCP server is disabled", the server is installed but switched off. Choose **Enable**; installing and enabling are separate steps.
  - If VS Code asks whether to start or trust the `contextqb` server, allow it for `contextqb` only. These prompts may not appear on every setup.
  - Already have a server named `contextqb`? Close the install view without choosing Install, and your configuration stays unchanged. Choosing Install replaces the existing entry and removes its headers, including any token, without a warning; other servers are kept.
  - **The server shows as Running with 30 tools, but chat can't find `get_principle`.** VS Code chat runs in one of two harnesses, chosen under **Session Target**. Installing from the link saves the server in your VS Code user profile, which Local sessions read. In a Copilot session, **Chat: Open Customizations > Tools** may then show no connected sources for it. If VS Code shows a **Migrations** notice, open it, select only `contextqb` and choose **Migrate**. This moves the entry out of your profile's `mcp.json` into `~/.copilot/mcp-config.json`, which other Copilot tools on this computer also read. Leave other servers unselected unless you want them moved too. **Migrate with Agent** is not needed and uses Copilot credits.
  - Start a new chat after installing or migrating. If an existing chat still cannot find the tool, a new chat can retry discovery.
  - When the agent asks to run `contextqb`'s `get_principle`, allowing it for this session is enough. The public library needs no ContextQB account or token.
  - If VS Code asks whether to trust the folder, that is about your project files, not ContextQB. Trust it only if you trust the project.

---

VS Code can add an MCP server from a link. Choose **Open VS Code setup** and VS Code shows the ContextQB server for you to review and install. Nothing is added until you confirm in VS Code.
