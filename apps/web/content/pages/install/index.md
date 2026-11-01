---
eyebrow: Install
headline: Connect ContextQB to your AI app.
subhead: >-
  Pick the app you build with and follow a few short steps. Once it's connected,
  the AI agent in that app can look up ContextQB's free guides, principles,
  playbooks and checklists while it helps you.
meta_title: "Install ContextQB: Connect the Free MCP Library to Your AI App"
meta_description: "Connect the free ContextQB MCP library to Cursor, VS Code, Claude Code, Codex, OpenCode, Antigravity, Zed or another AI app. No ContextQB account required."
dialog_label: Install ContextQB
dialog_close_label: Close
picker_question: Which app do you use?
picker_intro: >-
  Connect the free ContextQB library to your AI development app. No ContextQB
  account is required. Your app connects through MCP (Model Context Protocol), a
  standard way for AI apps to use outside tools and information.
view_instructions_label: View instructions
follow_up_fallback: If your app did not open, use these instructions.
retry_label: Try opening it again
choose_another_label: Choose another app
share_label: Link to these instructions
desktop_note: >-
  You'll need the computer where your AI app is installed. On a phone or tablet,
  save this page's link and open it on that computer.
server_heading: What you're connecting to
server_body: >-
  ContextQB is a free, read-only library. Your app reaches it at the address
  above using MCP (Model Context Protocol), a standard way for AI apps to use
  outside services. You don't need a ContextQB account, password or token.
  ContextQB only sees the requests your agent sends it; it can't open the files
  on your computer.
existing_config_heading: Connected ContextQB before?
existing_config_note: >-
  Look in your app's MCP list, which is the list of outside services your AI
  agent can use. If contextqb is already there, keep that connection and skip
  this setup. In Cursor and VS Code, setting it up again replaces your saved
  ContextQB connection settings without another warning. If you're connecting
  for the first time, carry on.
method_heading: "Step 1: Add ContextQB to your app"
manual_heading: Or add it by hand
inspect_heading: "Step 2: Check that your app sees it"
verify_heading: "Step 3: Ask your agent to use it"
verify_body: >-
  Seeing contextqb in your app's list means it's installed. It doesn't yet prove
  your agent can use it. To check, copy the request above into your agent's chat.
  Your app may ask whether the agent can use a ContextQB tool; allow it. A
  working connection replies with a document called **State Ownership** (it may
  also show its library address, `contextqb://principles/state-ownership`). If
  your agent answers without using the tool, or says the tool isn't available,
  you haven't verified the connection yet. Try the troubleshooting steps below.
feedback_heading: Did it work?
feedback_works_label: It works
feedback_works_message: You marked this connection as working.
feedback_failed_label: Couldn't connect
feedback_unclear_label: Instructions unclear
failed_help: |-
  - Check that the server address is exactly `https://mcp.contextqb.com/mcp`. If your app asks for a connection type, choose HTTP (some apps call it Streamable HTTP).
  - Quit and reopen your app, then look for contextqb in its MCP list again.
  - Make sure ContextQB's tools are switched on, and allow them when your app asks.
  - Start a new chat and try the request again. A chat that was already open may not see a newly added service.
  - Still stuck? [Tell us what you saw](https://github.com/ContextQB/contextqb/issues/new?template=external-adopter-feedback.yml), including your app's name and version. Leave out passwords, tokens and private project details.
unclear_help: |-
  Tell us which step was unclear so we can fix it: [send feedback](https://github.com/ContextQB/contextqb/issues/new?template=external-adopter-feedback.yml). Include your app's name and version, and leave out passwords, tokens and private project details.

  Experienced users can also find other setup formats on the [MCP page](/mcp/).
next_steps_heading: What to try next
next_steps: |-
  Before you plan your next feature, ask your agent: "Use the ContextQB MCP to find the playbook for planning a feature, then help me follow it." To learn the ideas behind the library, follow the [Start here path](/start-here/).
advanced_label: More setup options (for experienced users)
sources_heading: Your app's own instructions
copy_label: Copy
copied_label: Copied
copy_failed_label: Copy didn't work. Select the text and copy it yourself.
evidence_heading: Keeping this guide up to date
maintenance_note: >-
  Apps change, and we review these instructions periodically. If a step doesn't
  work or looks out of date, [let us know](https://github.com/ContextQB/contextqb/issues/new?template=external-adopter-feedback.yml)
  so we can help and update the guide.

---
