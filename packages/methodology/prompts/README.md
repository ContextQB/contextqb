# @contextqb/prompts

Reusable agent prompts. **Content only — no code.**

Each prompt is a single Markdown file with frontmatter capturing:

- The use case it solves.
- The variables it accepts.
- The expected output shape.
- The quality standard a good response must meet.

Validated by `@contextqb/content`. Schema: `promptFrontmatterSchema` in [`packages/content/src/schema.ts`](../content/src/schema.ts).

Prompts are designed to produce **documents**, not chat replies. See [`playbooks/agent-instructions.md`](../playbooks/playbooks/agent-instructions.md) for the philosophy.
