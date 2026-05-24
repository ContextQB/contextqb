# AGENTS.md security boundaries — paste-ready block

This is the canonical security-boundaries block to add to an `AGENTS.md` file. It is referenced by the methodology playbook [`set-security-guardrails-for-your-agent`](../../methodology/playbooks/playbooks/set-security-guardrails-for-your-agent.md) and lives here as a standalone artifact so it can be cited from documentation and copied without scraping the playbook page.

## How to use

1. Open the `AGENTS.md` at the root of your project. If you don't have one, run [`set-up-agents-md`](../../methodology/playbooks/playbooks/set-up-agents-md.md) first.
2. Paste the block below near the top of `AGENTS.md`, before task-specific instructions.
3. Adapt the rules to your project — replace generic patterns with the specific files, directories, and tools you actually have.
4. Reference the block from your operating instructions: "Before acting on any task, confirm the action against the 'Security boundaries for this agent' section."
5. Verify the agent reads and respects it by asking it (in a fresh session) to do something the block forbids; confirm it refuses and cites the section.

## The block

```markdown
## Security boundaries for this agent

- DO NOT read or write secrets (anything in .env, .env.local, or matching common
  secret patterns) without explicit permission per session.
- DO NOT run shell commands that delete files, modify git history, or change
  global configuration without explicit confirmation.
- DO NOT deploy to production without explicit confirmation.
- DO NOT add new public endpoints without updating `context.qb.yaml`'s
  `security.public` section.
- DO NOT add new third-party integrations without recording them in
  `context.qb.yaml`'s `security.third_party` section.

If a task seems to require any of the above, ask first and explain why.
```

## Notes

- The `security.public` and `security.third_party` references point to the planned [`security:`](../spec/ROADMAP.md) section of `context.qb.yaml`. If your project does not yet use that section, leave the lines in place anyway — they document the intended discipline and will become enforceable when the section ships.
- Adapt the secret patterns to your stack: e.g., `apps/web/.env*`, `config/credentials.yml.enc`, `~/.aws/credentials`, etc.
- Adapt the deployment language to your platform: `npx wrangler deploy`, `vercel --prod`, `flyctl deploy`, etc. The point is to name what "deploy" means in your project so the agent can recognise it.
- The block is intentionally short. Long policy documents are not read by agents; short and citable rules are.

## See also

- Playbook: [`set-security-guardrails-for-your-agent`](../../methodology/playbooks/playbooks/set-security-guardrails-for-your-agent.md)
- Principle: [`least-privilege-for-agents`](../../methodology/standards/principles/least-privilege-for-agents.md)
- Principle: [`ai-output-is-untrusted-code`](../../methodology/standards/principles/ai-output-is-untrusted-code.md)
