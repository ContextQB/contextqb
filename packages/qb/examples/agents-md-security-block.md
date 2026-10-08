# AGENTS.md security boundaries — paste-ready block

This is the canonical security-boundaries block to add to an `AGENTS.md` file. It is referenced by the methodology playbook [`set-security-guardrails-for-your-agent`](../../methodology/playbooks/playbooks/set-security-guardrails-for-your-agent.md) and lives here as a standalone artifact so it can be cited from documentation and copied without scraping the playbook page.

## How to use

1. Set your agent tool's permission, approval and sandbox settings first, so delete, deploy, charge, send and secret-reading actions are blocked or need your approval. The block below states intent; the settings enforce it. The playbook explains both layers.
2. Open the `AGENTS.md` at the root of your project. If you don't have one, run [`set-up-agents-md`](../../methodology/playbooks/playbooks/set-up-agents-md.md) first.
3. Paste the block below near the top of `AGENTS.md`, before task-specific instructions.
4. Adapt the rules to your project — replace generic patterns with the specific files, directories, and tools you actually have — and fill in the "Public surfaces and outside services" list ("none yet" is a valid starting entry).
5. Reference the block from your operating instructions: "Before acting on any task, confirm the action against the 'Security boundaries for this agent' section."
6. Verify with a harmless test: in a fresh session, ask the agent to delete a scratch file you created for the purpose. The _tool_ should block the action or ask for approval (decline it), and the agent should name the section. An agent's refusal on its own is not a boundary; if the tool let the action through, fix the settings.

## The block

```markdown
## Security boundaries for this agent

These rules state intent. My agent tool's permission, approval and sandbox
settings are what enforce them, and they are set to match this list.

- DO NOT read or write secrets (anything in .env, .env.local, or matching common
  secret patterns) without explicit permission per session.
- DO NOT run shell commands that delete files, modify git history, or change
  global configuration without explicit confirmation.
- DO NOT deploy to production without explicit confirmation.
- DO NOT add a new public endpoint or connect a new outside service without
  adding it to "Public surfaces and outside services" below and telling me.

If a task seems to require any of the above, ask first and explain why.

### Public surfaces and outside services

- Public endpoints: none yet. (One line each: method and path, who can call
  it, why it is public.)
- Outside services: none yet. (One line each: the service's role, what data
  it receives, which secret it uses.)
```

## Notes

- Keep public endpoints and outside services in the `AGENTS.md` list, not in `context.qb.yaml`. A structured [`security:`](../spec/ROADMAP.md) section for the manifest is planned but has not shipped; the published schema does not allow it, so do not add one yet. The manifest's `routes` field maps hostnames to the code that serves them; it is not a list of endpoints or their security state.
- Adapt the secret patterns to your stack: e.g., `apps/web/.env*`, `config/credentials.yml.enc`, `~/.aws/credentials`, etc.
- Adapt the deployment language to your platform (for example `npx wrangler deploy`, `vercel --prod` or `fly deploy` — check your platform's current documentation; command names change). The point is to name what "deploy" means in your project so the agent can recognise it.
- The block is intentionally short. Long policy documents are not read by agents; short and citable rules are.

## See also

- Playbook: [`set-security-guardrails-for-your-agent`](../../methodology/playbooks/playbooks/set-security-guardrails-for-your-agent.md)
- Principle: [`least-privilege-for-agents`](../../methodology/standards/principles/least-privilege-for-agents.md)
- Principle: [`ai-output-is-untrusted-code`](../../methodology/standards/principles/ai-output-is-untrusted-code.md)
