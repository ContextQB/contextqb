# `context.qb` — Specification v1.0

**Status:** Stable, May 2026.
**Author:** ContextQB / Symbolscape Inc.
**License:** CC-BY-4.0.

## 1. Purpose

A `context.qb` file is a **boot manifest for AI coding agents** — a small, structured artifact at the root of a repository that gives an agent enough context to operate effectively from the first message of a session, without scanning the whole repo first.

In narrative terms, it is **the agent's play-sheet**: the field map and call-sheet, not the encyclopedia. The brand (ContextQB = Context Quarterback) leans on the metaphor; the engineering brief is the boot manifest.

The file is deliberately:

- An **index**, not documentation
- A **navigational manifest**, not a knowledge base
- A **machine-oriented architectural surface**, distinct from human-prose docs

It addresses what is increasingly the binding constraint for coding agents in 2026: **orientation cost**. Capable agents spend a meaningful fraction of every session discovering what a repo is, how it is structured, and where to begin. `context.qb` compresses that scan into one small file the agent loads first.

It complements two other formats in the agent-context family:

| File                   | Job                                                           | Format   |
| ---------------------- | ------------------------------------------------------------- | -------- |
| **`AGENTS.md`**        | Rules / commands / boundaries — _how_ the agent should behave | Markdown |
| **`context.qb`**       | Map / index — _what exists, where to look_                    | YAML     |
| **`docs/status/*.md`** | In-flight work state — _what's happening right now_           | Markdown |

`context.qb` and `AGENTS.md` answer different questions. Both should exist in a healthy repo. Neither replaces the other.

## 2. File location and discovery

- The canonical file is **`context.qb.yaml`** at the **repo root**.
- Agents discover it via directory-tree traversal — the nearest `context.qb.yaml` relative to the files being worked on takes precedence. This matches the [AGENTS.md hierarchical-discovery pattern](https://agents.md/).
- A monorepo may have additional nested `context.qb.yaml` files in subtrees (`apps/some-app/context.qb.yaml`) that override or extend the root for that subtree.
- The file is **always committed** to the repo. It is not a generated artifact (though sections may be auto-generated from sources of truth — see §7).
- The format is referred to verbally as **"context.qb"**; the `.yaml` extension is a deliberate concession to tooling so generic YAML editors, syntax highlighters, and linters work without configuration. The brand is in the filename root, not the extension — same convention as `AGENTS.md`.
- Implementations MAY accept the bare `.qb` extension (without `.yaml`) as a deprecated legacy form for repos that adopted the format before v1.0 stabilised. New files SHOULD use `context.qb.yaml`.

## 3. File format

- Encoding: **UTF-8**, no BOM.
- Syntax: **YAML 1.2**. Because YAML 1.2 is a strict superset of JSON, JSON files are also valid `context.qb` files. Implementations MUST accept both.
- Extension: **`.yaml`**. Canonical filename: `context.qb.yaml`. The `.qb` segment is part of the filename, not a separate extension, so file pickers and editors see this as a `.yaml` file and apply standard YAML tooling automatically.
- Line length: no hard limit, but the file should be **scannable on a single screen** for a typical repo (~80–120 lines).
- Token budget: target **~500–2,000 tokens for typical repos**, up to ~5k for complex monorepos. If a file grows beyond ~5k tokens, that's a strong signal that some content should move to deeper docs and be referenced by URI.

## 4. Self-documenting header

Every `context.qb.yaml` SHOULD begin with a YAML comment header that names the sections of that file. This makes the format decodable by a model that has never seen a `context.qb.yaml` before:

```yaml
# context.qb 1.0 — <project name>
#
# This file is the agent's boot manifest. Read it first; drill into the
# referenced URIs only when the play calls for it.
#
# Sections: project, stack, tree, routes, decisions, status, entry_points

qb: "1.0"
project: ...
```

The exact wording is not normative. The intent — naming the sections in-band — is.

## 5. Required fields (v1.0)

A `context.qb.yaml` MUST contain:

| Field             | Type   | Notes                                                                                                                                   |
| ----------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `qb`              | string | Format version, e.g. `"1.0"`. Required for forward compatibility.                                                                       |
| `project.name`    | string | A short identifier for the project.                                                                                                     |
| `project.summary` | string | A one- or two-paragraph plain-language description of what the project is. Prose, not bullets.                                          |
| `tree`            | object | A map of paths (typically workspace packages or top-level directories) to either a short purpose string or a structured object. See §6. |

A minimal valid `context.qb.yaml`:

```yaml
# context.qb 1.0 — example
qb: 1.0
project:
  name: example
  summary: A small example application.
tree:
  src: source code
  tests: unit tests
```

## 6. Optional fields (v1.0)

Implementations MAY include any of these. They are conventions, not exhaustive — extending the file with custom sections is permitted but not portable.

### 6.1 `project.v`

A version string for the project itself (e.g. `"0.1.0"`). Free-form.

### 6.2 `stack`

A flat map of plain-language stack descriptors. Keys are conventional (`lang`, `mono`, `web`, `deploy`, `data`, `pay`, `mcp`, etc.) but not enumerated by the spec. Use whatever names are natural for the project.

```yaml
stack:
  lang: TypeScript
  mono: pnpm 10
  web: Next.js 15 + React 19 + Tailwind v4
  deploy: Cloudflare Workers
  data: Supabase (Postgres + RLS + Auth)
```

### 6.3 `tree`

(Required overall; this subsection documents structured forms.)

Each path entry is either:

- **A scalar string** — the path's one-line purpose, optionally with `kind` and `→ deploy-target` cues. The arrow `→` is conventional, not normative.
  ```yaml
  tree:
    apps/web: next-static → contextqb.com (live)
  ```
- **An object** with these optional fields:
  - `kind` — short identifier like `next-ssr`, `library`, `content`, `mcp-server`
  - `purpose` — the one-line purpose
  - `deps` — list of internal or external dependencies (string identifiers)
  - `deploy` — deploy target (URL or named environment)
  ```yaml
  tree:
    apps/courses:
      kind: next-ssr
      deploy: courses.contextqb.com
      deps: [supabase, lemonsqueezy, heroui-pro]
      purpose: paid course platform
  ```

### 6.4 `routes`

A map from hostname (or route pattern) to backend (path within the repo, or named external service).

```yaml
routes:
  contextqb.com: apps/web (live)
  courses.contextqb.com: apps/courses (built; not yet attached)
  members.contextqb.com: ghost-on-homeserver (separate repo)
```

### 6.5 `decisions`

A compact index of architectural decisions, expressed as either a map (preferred, denser) or an array.

```yaml
decisions:
  "0008": cloudflare-workers-static-assets (accepted)
  "0010": course-platform-supabase (superseded-by 0011)
  "0011": lemonsqueezy-free-core-pricing (accepted)
  → docs/architecture/decisions/
```

The trailing `→ <path>` cue is a convention for pointing at deeper docs.

### 6.6 `status`

A map of in-flight work items to short status strings. This section is meant to be edited frequently — by humans, mid-feature.

```yaml
status:
  lemonsqueezy: blocked-on stripe-support clearing account email
  course-content: pending next session
  context.qb-spec: in design (this file is the prototype)
```

### 6.7 `entry_points`

A map of named concerns to file or document paths. Helps the agent answer "where do I start?" for specific kinds of work.

```yaml
entry_points:
  rules: AGENTS.md
  map: this file (context.qb)
  decisions: docs/architecture/decisions/README.md
  api: packages/mcp-server/src/tools.ts
  operations: docs/operations/deployment-workflow.md
```

## 7. Authoring discipline

Sections fall into two maintenance categories:

| Category             | Sections                                                            | Update cadence                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auto-generatable** | `tree`, `routes`, `decisions`, `stack`                              | Should be derivable from sources of truth (`pnpm-workspace.yaml`, `wrangler.jsonc`, ADR README, `package.json`). Tooling SHOULD diff the generated form against the committed file and fail validation on drift. |
| **Hand-authored**    | `project.summary`, each entry's `purpose`, `status`, `entry_points` | Updated by humans deliberately. These carry meaning, not just enumeration.                                                                                                                                       |

The recommendation is to commit both auto-generated and hand-authored sections in the **same** `context.qb` file, with comments above auto-generated regions identifying them. Tooling will know which sections to regenerate and which to leave alone.

(v1.0 of the spec does not standardise the auto-generation tool. Implementations vary by ecosystem.)

## 8. Validation

A reference JSON Schema is published at [`schema.json`](./schema.json). Implementations MUST validate `.qb` files against it.

Minimal valid file:

```yaml
qb: 1.0
project:
  name: anything
  summary: short summary
tree:
  src: source
```

Validators SHOULD also enforce these soft rules with warnings (not errors):

- Total token count exceeds 5,000 (suggests splitting into nested files or moving content to docs)
- A `tree` entry references a path that does not exist on disk
- A `decisions` entry references an ADR ID that does not exist in `docs/architecture/decisions/`
- An `entry_points` value references a path that does not exist on disk
- A `status` entry is older than 30 days without modification (potential stale state)

These soft rules are not part of the schema itself.

## 9. Discovery and tooling expectations

An AI agent that supports `context.qb` SHOULD:

1. On session start (or when entering a new workspace), check for `context.qb` at the workspace root.
2. If present, load it before any other context-gathering step.
3. Cache the parsed file for the session; re-parse only if the file is modified.
4. Surface `context.qb` content to the model alongside `AGENTS.md` rather than instead of it.
5. Respect nested `context.qb` files in subtrees per §2.

An MCP server MAY expose `context.qb` as a queryable resource — e.g. addressable as `<scheme>://repo/map` for the full file, or `<scheme>://repo/decisions` for a named section. This pattern is encouraged but not required by the spec.

## 10. Forward compatibility / future sections (stubbed in v1.0)

The following section names are **reserved** for future versions of the spec. Implementations MAY include them in v1.0 files (they will be ignored by v1.0 validators, but won't be rejected). They will be standardised in v1.x or v2.0:

| Section            | Intended purpose                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flows`            | Multi-step user journeys mapped to the files they touch. Useful for "how does sign-up work?" tasks.                                                           |
| `boundaries`       | Hard "must not do" rules. Migrating these from `AGENTS.md` consolidates the rule surface.                                                                     |
| `tribal_knowledge` | Free-form prose for things only humans know — undocumented conventions, gotchas, historical context that would otherwise live as comments inside source code. |
| `surfaces`         | Synonym / extension of `routes` for non-HTTP surfaces (CLI commands, scheduled jobs, MCP tools).                                                              |
| `glossary`         | Project-specific vocabulary with definitions.                                                                                                                 |
| `excluded_paths`   | Globs the agent should ignore when reading the repo (large generated dirs, vendored code).                                                                    |

Authors of v1.0 files may use these section names experimentally; future versions of the spec will formalise them.

## 11. Relationship to other standards

| Standard                              | Relationship                                                                                                                                                                                                                                              |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`AGENTS.md`](https://agents.md/)     | Complementary. `AGENTS.md` is instructions + rules + commands; `context.qb` is the map. Both should exist.                                                                                                                                                |
| [`llms.txt`](https://llmstxt.org/)    | Different scope. `llms.txt` is for public-website AI consumption; `context.qb` is for in-repo agent consumption.                                                                                                                                          |
| [`SKILL.md`](https://agentskills.io/) | Complementary. `SKILL.md` files are task-level recipes; `context.qb` is project-level orientation.                                                                                                                                                        |
| Aider's repo-map                      | Complementary. Aider's repo-map is auto-generated from AST + PageRank, dynamic per-task; `context.qb` is human-curated and stable. The two address different layers (`context.qb` for "what is this repo", repo-map for "what does this code look like"). |

## 12. Versioning

- Current version: **1.0**.
- Files declare their version via the `qb` field at the top.
- Backward-incompatible schema changes increment the major version.
- Backward-compatible additions (new optional fields, new section types) increment the minor version.
- Validators MUST accept any minor version ≤ their supported major version.

## 13. Stability guarantee

The single biggest risk to a format like this is schema bloat — what starts as a minimal manifest accreting fields until it becomes another sprawling documentation surface. The following commitments resist that:

- **The required-fields set will not grow in v1.x.** Required fields in v1.0 are exactly `qb`, `project.name`, `project.summary`, and `tree`. These remain the only required fields through every v1.x release. Any addition that demands compliance from existing files requires a major-version bump (v2.0), accompanied by empirical evidence of value and a published migration path.
- **Optional sections defined in v1.0 will not be removed in v1.x.** `stack`, `routes`, `decisions`, `status`, and `entry_points` are stable. Removing or renaming any of them requires a major-version bump.
- **New optional sections may be added in v1.x minor releases only after demonstrated value across multiple production users.** The bar is "we have evidence this section helps real agents on real repos," not "this seems useful in theory."
- **Reserved-but-unspecified section names (§10) are reserved precisely so they can be added later without breaking existing files.** Files that already use them in v1.0 will not be rejected by future v1.x validators.
- **Spec changes require an ADR.** Changes to this document are governed by the same ADR discipline as the projects that use it. See `docs/architecture/decisions/` in the canonical repository.

## 14. Privacy and security

`context.qb.yaml` files should be treated as **public artifacts**, even when they live in a private repository. Every byte in the file becomes part of an agent's context window every session — and major AI provider terms of service allow training-data ingestion on session traffic by default. Beyond that, the file is normally committed to source control, where access controls (and account compromises) are not under the format's control.

The following content MUST NOT appear in `context.qb.yaml`:

- **Secrets:** API keys, database credentials, OAuth client secrets, signing keys, webhook secrets, JWT tokens. These belong in `.env.local`, secret managers, or environment variables — never in any file an agent will read on every session.
- **Customer data, PII, or content covered by data-protection regulation** (GDPR, CCPA, HIPAA, FERPA, etc.).
- **Internal-only hostnames or IP addresses** where exposure would matter. Production hostnames are fine; corporate-network endpoints, dev/staging URLs that require VPN access, and CIDR blocks for internal infrastructure are not.
- **Vulnerability details before disclosure**, or anything else covered by an NDA, embargo, or pre-disclosure agreement.

Authors SHOULD assume the file will be read by every person and agent who ever interacts with the repository — including agents running on third-party accounts that may not respect the same boundaries the original author assumes.

Validators MAY (but are not required to) emit soft warnings on common patterns that look like secrets:

- Strings beginning with `sk-`, `ghp_`, `gho_`, `glpat-`, `xoxb-`, `xoxp-`, `xapp-`, `AKIA`, `AIza`, `eyJ` (followed by base64), and similar recognised prefixes
- Long base64-encoded blobs (e.g. ≥40 characters with the base64 alphabet)
- URLs containing `:password@`, `:token@`, or query-string parameters named `api_key`, `secret`, `token`, etc.

These are soft checks. The schema does not enforce them. False positives are expected; the warning's purpose is to make authors pause, not to block.

## 15. Acknowledgements

`context.qb` draws on:

- **`AGENTS.md`** (OpenAI / Agentic AI Foundation) for the directory-traversal discovery pattern and instructions-vs-map separation.
- **`SKILL.md`** (Anthropic) for the mixed YAML-frontmatter + Markdown-body pattern that informed the structured-plus-prose hybrid in `context.qb`.
- **Aider's repo-map** for the AST + PageRank insight that "structured signatures in source-language syntax beat YAML/JSON for code-relationship questions" — which is why `context.qb` does _not_ try to encode code structure; that's repo-map's job.
- **`package.json`** for the long-standing convention that structured config files mix lookup-shaped fields with free-form prose strings.
- **External steelman review** (May 2026) for sharpening "boot manifest" as the technical framing, surfacing the privacy threat surface, and tightening the statistics precision around AGENTS.md study results.
