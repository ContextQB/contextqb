# Contributing to ContextQB

Thanks for the interest. ContextQB is a methodology and a small set of tools — the contribution surface is intentionally narrow and clearly partitioned.

## What we welcome

| Contribution                                                                      | How                                                                                                                          |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Adoption feedback** — anything from your setup, daily use, or drift fix         | See [`SUPPORT.md`](./SUPPORT.md). Three channels; the lowest-friction is the `submit_feedback` MCP tool.                     |
| **Bug reports** against the CLI (`@context-qb/cli`) or MCP                        | Open a GitHub issue with a reproduction. Be specific; cite version + command + observed vs expected.                         |
| **Spec clarifications** for the `context.qb` format                               | Open an issue first; the spec (`packages/qb/spec/SPEC.md`) is CC BY 4.0 and changes are deliberately conservative.           |
| **Adapter contributions** for the drift detector                                  | New adapters (Vercel, Netlify, Fly, npm/yarn workspaces …) are welcome — see the existing adapters under `packages/qb/cli/`. |
| **Methodology atoms** (principles, playbooks, audits, prompts, guides, briefings) | These follow a strict authoring contract — open an issue first to align on scope before drafting.                            |
| **Translations** of existing content                                              | Open an issue with the target language and your relevant translation history; we will discuss the layout before you start.   |

## What we don't accept (without prior discussion)

- New top-level concepts ("a new kind of audit," "a new layer of the architecture") — these go through an ADR before any code or content lands. Open an issue describing the problem you're trying to solve, not the solution.
- Sweeping rewrites of existing methodology content. Methodology evolves additively; supersession happens through new atoms, not rewrites of old ones.
- Direct PRs to the public mirror's content (it's generated from a private upstream by `scripts/publish-to-public.sh`). Open an issue or PR proposing the change in concept; we'll author it upstream and the next publish picks it up.

## How structural decisions land

This project records every structural decision as an **Architectural Decision Record (ADR)**. If a contribution affects more than one file, more than one package, or any future contributor's mental model, an ADR comes first. The format is the lightweight Nygard one (Status / Date / Context / Decision / Consequences). For an example, see [ADR-0029](https://github.com/ContextQB/contextqb/blob/main/docs/architecture/decisions/0029-external-adopter-feedback-channel.md).

## Code-style and conventions

- **Naming conventions** — kebab-case files, verb+noun functions, positive-tense booleans, no `utils.ts` / `helpers.ts` / `manager.ts` / `misc.ts` / `common.ts` at unscoped paths. See the [`naming-conventions` principle](https://contextqb.com/principles/naming-conventions).
- **Single-responsibility files** — if a filename takes more than four words, the file probably has more than one responsibility. Split it.
- **State ownership** — every piece of state has exactly one owner; server state is borrowed, not copied. See the [`state-ownership` principle](https://contextqb.com/principles/state-ownership).
- **Markdown for content** — every content atom is markdown with YAML frontmatter validated against a schema. No exceptions.

## Licensing summary

| Scope                                   | License      |
| --------------------------------------- | ------------ |
| Repository umbrella                     | MIT          |
| `packages/qb/spec/` (the format spec)   | CC BY 4.0    |
| `packages/qb/cli/` (the drift detector) | MIT          |
| Methodology content                     | CC BY-SA 4.0 |
| Other application code                  | MIT          |

By submitting a contribution you license it under the corresponding license of the surface it touches.

## Code of conduct

Be specific, be honest, be kind. Disagreements about technical direction are welcome and expected; ad hominem and bad-faith argument are not.

## What this repo looks like from the outside

The public repository is a curated mirror of a larger private monorepo. The mirror contains the methodology content, the `context.qb` format spec, the MCP server source (`apps/mcp/`), and the website's markdown content (`apps/web/content/`). The drift-detector CLI (`@context-qb/cli`), the website's UI code, and the courses platform stay private. This is documented in detail in the GitHub Policy doc inside the project.

If a contribution proposal would require changes to a private surface, the maintainer will route it appropriately and respond on the public issue.
