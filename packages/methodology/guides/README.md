# @contextqb/guides

ContextQB operator guides. **Content only — no code.**

One subdirectory:

- `guides/` — Plain-language walkthroughs for operators (non-developers building with agents). Each guide names a single skill or mental model the operator needs to keep their agent on-architecture.

Validated by `@contextqb/content`. Schema lives in [`packages/methodology/content/src/schema.ts`](../content/src/schema.ts) (`guideFrontmatterSchema`).

## What goes here vs other surfaces

| Surface                | Audience             | Voice                           |
| ---------------------- | -------------------- | ------------------------------- |
| `guides/`              | Operator, founder    | Plain-language, conversational  |
| `@contextqb/standards` | All audiences        | Principle-level, prescriptive   |
| `@contextqb/playbooks` | Operator, agent      | Step-by-step, executable        |
| `@contextqb/prompts`   | Agent (via operator) | Copy-pasteable prompt templates |

If a piece of content is teaching the operator a concept they need to internalise, it belongs here. If it's an executable workflow, it belongs in `playbooks/`. If it's a universal architectural rule, it belongs in `standards/principles/`.

## License

The content in this package is licensed under **CC BY-SA 4.0** (Creative Commons Attribution-ShareAlike 4.0 International). You are free to share and adapt this content, but you must give appropriate credit and distribute any derivatives under the same license. See [`LICENSE`](./LICENSE) for full terms.
