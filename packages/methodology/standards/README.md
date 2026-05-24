# @contextqb/standards

The ContextQB architecture principles library. **Content only — no code.**

Each file in `principles/` is a single principle, written as Markdown with structured YAML frontmatter validated by `@contextqb/content`.

## Adding a principle

1. Create `principles/<slug>.md` where `<slug>` is the same as the frontmatter `id`.
2. Required frontmatter fields are listed in [`packages/content/src/schema.ts`](../content/src/schema.ts) (`principleFrontmatterSchema`).
3. Run `pnpm validate:content` from the repo root to confirm.

## Why no logic lives here

Logic in a content package creates an unclear dependency direction: the website and the MCP server would have to know how this package decides to format things. By keeping it strictly Markdown + metadata, every consumer reads the same source of truth and renders it themselves.
