---
eyebrow: "Install · VS Code"
headline: Connect ContextQB to VS Code.
subhead: >-
  VS Code can add ContextQB for you. Open the setup from this page, confirm it
  in VS Code, then check that the chat agent can use it.
meta_title: Install ContextQB in VS Code
meta_description: "Add the free ContextQB MCP library to Visual Studio Code with an install link or the MCP: Add Server command, then verify it in agent mode."
troubleshooting: |-
  - **A different editor opened.** The link went to whichever app your computer uses for VS Code links. Open VS Code, run **MCP: Add Server** from the Command Palette, and follow the "add it by hand" steps.
  - **It says "This MCP server is disabled".** ContextQB is installed but switched off. Choose **Enable**. Installing and switching on are separate steps in VS Code.
  - **VS Code asks whether to start or trust contextqb.** Allow it for contextqb only. Not every setup shows these questions.
  - **contextqb is running, but chat can't find `get_principle`.** VS Code chats run in one of two modes, chosen under **Session Target**: **Copilot** or **Local**. Each mode has its own list of tools, and the install link saves ContextQB where **Local** chats look. For a **Copilot** chat: if VS Code shows a **Migrations** notice, open it, tick only contextqb and choose **Migrate**. Migrate moves ContextQB into `~/.copilot/mcp-config.json`, a settings file that other Copilot tools on this computer also read. Leave other servers unticked unless you want them moved too. Don't choose **Migrate with Agent**; it isn't needed and uses Copilot credits.
  - **The tool still doesn't appear.** Open a new chat. A chat that was already open may keep the tool list it started with.
  - **VS Code asks permission to run a contextqb tool.** Allowing it for this session is enough. The free library needs no ContextQB account or token.
  - **VS Code asks whether to trust a folder.** That question is about your project's files, not ContextQB. Trust the folder only if you trust the project.
  - **Already had contextqb?** If it was in VS Code's MCP list before you started, close the install view without choosing Install; your existing setup stays exactly as it was. Choosing Install replaces the saved contextqb settings without another warning. That includes any membership key you added from the ContextQB command-line tool. Your other MCP services are kept.

---

VS Code can add ContextQB from a link on this page. The link opens VS Code and shows ContextQB's details for you to check. Nothing is added until you choose **Install** in VS Code. You also need to be signed in to GitHub Copilot, because Copilot's chat agent is what uses ContextQB.
