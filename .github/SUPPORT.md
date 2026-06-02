# Getting help and sharing feedback

ContextQB is methodology and tooling for AI-native builders. There are three things you might be here to do — this page is the routing table.

## I want to share what happened when I set this up

We treat adopter feedback as first-class evidence. **There is one structured channel and three ways to reach it**, listed in order of friction.

### 1. Call the `submit_feedback` MCP tool (lowest friction; for agents)

If you (or the AI agent you're working with) have the ContextQB methodology MCP loaded — i.e. you've connected `mcp.contextqb.com` to your Cursor / Claude Code / Codex / other MCP client — the agent can call the `submit_feedback` tool directly. The tool returns three submission paths and the agent picks whichever the user can act on most easily, without leaving the conversation.

The MCP is configured by running:

```bash
contextqb mcp setup --client cursor
```

…replacing `cursor` with your client. See [the MCP page](https://contextqb.com/mcp) for full setup.

### 2. Open the GitHub issue template

Open a new issue using the **"External adopter feedback"** template at [github.com/ContextQB/contextqb/issues/new/choose](https://github.com/ContextQB/contextqb/issues/new/choose). The form prompts for the structured fields a maintainer needs to triage.

### 3. File via `gh` directly

If you've already drafted feedback in a markdown file:

```bash
gh issue create --repo ContextQB/contextqb \
  --title "[feedback] <one-line summary>" \
  --body-file ./your-feedback.md \
  --label feedback,triage
```

### What happens after you submit

A maintainer files your submission verbatim into the project's `feedback/captures/` directory and triages it into a structured report (or several) over the following days. Synthesised insights graduate to public ADRs and content changes — never via direct republication of your words, unless you explicitly select `consent: public` in the form.

The full lifecycle is documented in [`feedback/README.md`](https://github.com/ContextQB/contextqb/blob/main/feedback/README.md) and the decision behind it is recorded in [ADR-0029](https://github.com/ContextQB/contextqb/blob/main/docs/architecture/decisions/0029-external-adopter-feedback-channel.md).

## I want to report a security issue

Do **not** open a public issue for security disclosures. Email the maintainer associated with the [`travis-symbolscape`](https://github.com/travis-symbolscape) GitHub account. A formal `SECURITY.md` will follow when ContextQB carries user data; until then, private email is the channel.

## I want to learn how to use ContextQB

- [contextqb.com](https://contextqb.com) — the methodology, principles, playbooks, and the `context.qb` format spec.
- The `set-up-drift-detection` and `write-a-context-qb` playbooks — the two canonical starting points for adopters.
- The MCP at `mcp.contextqb.com` — load it into your AI client for live methodology access.

## I want to contribute

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for what kinds of contributions are accepted and how to propose them.
