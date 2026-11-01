---
eyebrow: Install
headline: Connect ContextQB to your AI app.
subhead: >-
  Choose the app you build with. ContextQB adds its free library of guides,
  principles, playbooks and audits to the agent you already use.
meta_title: "Install ContextQB: Connect the Free MCP Library to Your AI App"
meta_description: "Connect the free ContextQB MCP library to Cursor, VS Code, Claude Code, Codex, OpenCode, Antigravity, Zed or another AI app. No ContextQB account required."
dialog_label: Install ContextQB
dialog_close_label: Close
picker_question: Which app do you use?
picker_intro: >-
  Connect the free ContextQB library to your AI development app. No ContextQB
  account is required.
view_instructions_label: View instructions
follow_up_fallback: If your app did not open, use these instructions.
retry_label: Try opening it again
choose_another_label: Choose another app
share_label: Link to these instructions
desktop_note: >-
  Setup happens in the app on your computer. If you are on a phone or tablet,
  open these instructions on the computer where your AI app is installed.
server_heading: The ContextQB server
server_body: >-
  The public library needs no token, account or email address. Your agent gets
  read access to ContextQB's published methodology. The server receives only
  what your agent sends in a tool request; it cannot open your project files.
existing_config_note: >-
  Already have a server named contextqb? Keep it: it may carry a membership token
  from the contextqb mcp setup command, and it already gives your agent the public
  library. In ContextQB's tests, choosing Install in Cursor or in VS Code replaced an
  existing contextqb entry and removed its headers, including any token, without a
  warning; other servers were kept. If you already have that entry, cancel the
  install. For other apps, check your existing servers before adding one with the
  same name.
method_heading: Set it up
manual_heading: Set it up by hand
inspect_heading: Check that your app sees it
verify_heading: Ask your agent to use it
verify_body: >-
  Paste this into your agent. A working connection returns the document titled
  **State Ownership** with the address
  `contextqb://principles/state-ownership`. If your agent answers from memory
  without calling the tool, the connection is not working yet.
feedback_heading: Did it work?
feedback_works_label: It works
feedback_works_message: You marked this connection as working.
feedback_failed_label: Couldn't connect
feedback_unclear_label: Instructions unclear
failed_help: |-
  - Check the server address is exactly `https://mcp.contextqb.com/mcp` and the transport is HTTP (Streamable HTTP).
  - Restart your app, then check its MCP server list again.
  - Make sure the ContextQB tools are enabled or allowed in your app.
  - Still stuck? [Report what you saw](https://github.com/ContextQB/contextqb/issues/new?template=external-adopter-feedback.yml) with your app name and version. Do not include tokens or private project details.
unclear_help: |-
  Tell us which step was unclear so we can fix it: [open a feedback report](https://github.com/ContextQB/contextqb/issues/new?template=external-adopter-feedback.yml). Include your app name and version, and leave out tokens and private project details.

  The [MCP page](/mcp/) also has advanced setup notes and other configuration formats.
next_steps_heading: What to try next
next_steps: |-
  Before you plan your next feature, ask your agent: "Use the ContextQB MCP to find the playbook for planning a feature, then help me follow it." To learn the ideas behind the library, follow the [Start here path](/start-here/).
advanced_label: Advanced setup and other formats
sources_heading: App documentation
copy_label: Copy
copied_label: Copied
copy_failed_label: Copy didn't work. Select the text and copy it yourself.
evidence_heading: How we know

---
