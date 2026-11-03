# ContextQB Methodology

Architectural thinking for AI-native builders.

## What's here

Principles, playbooks, audits, prompts and guides that teach systems thinking for AI-assisted software development; dated reference tables of the facts that change; the `context.qb` format spec; the MCP Worker that backs `mcp.contextqb.com`; and the website's markdown copy.

```
content/
  principles/    ← Core architecture principles                    (CC BY-SA 4.0)
  playbooks/     ← Step-by-step workflows                          (CC BY-SA 4.0)
  audits/        ← Agent audit templates                           (CC BY-SA 4.0)
  prompts/       ← Reusable agent prompts                          (CC BY-SA 4.0)
  guides/        ← Operator guides                                 (CC BY-SA 4.0)
  references/    ← Dated reference tables (tools, models, pricing, setup) (CC BY-SA 4.0)
format/
  SPEC.md        ← The context.qb file format specification        (CC BY 4.0)
  examples/      ← Example context.qb files                        (CC BY 4.0)
cli/
  CHANGELOG.md   ← @context-qb/cli release notes
apps/
  mcp/           ← MCP Worker source (Cloudflare Workers + D1)     (MIT)
  web/
    content/     ← Website page copy + briefings                   (CC BY-SA 4.0)
docs/
  mcp-setup.md   ← Where to find the current MCP setup instructions
```

Anything not listed here (application UI source, course platform, strategy, internal docs) lives in the private upstream and is not published.

## How to use it

### Read on the web

Browse the full methodology at **[contextqb.com](https://contextqb.com)**.

### Connect your AI agent

Give your AI agent direct access to all methodology content via MCP. See [docs/mcp-setup.md](docs/mcp-setup.md).

### Use the content directly

All methodology content is licensed **CC BY-SA 4.0**. You can read, copy, share, and adapt it with attribution. Derivatives must use the same license.

The `context.qb` format specification is **CC BY 4.0**.

## Curriculum, practice and Coach

Follow the free [guides from your first idea through launch and operations](https://contextqb.com/guides/), or [try the working browser notebook exercise](https://contextqb.com/practice/). Use made-up notes; the notebook stores data in your current browser and supports downloaded backups.

[ContextQB Coach](https://contextqb.com/coach/) is a planned subscription for applying this curriculum inside your development environment. It is not available yet. Courses may be included for subscribers; packaging, pricing and timing remain undecided. See the [current course direction](https://contextqb.com/courses/).

## License

See [LICENSE](LICENSE) for details.

---

_AI can write code. Someone still has to think._
