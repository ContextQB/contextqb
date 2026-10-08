# @contextqb/references

ContextQB reference tables. **Content only — no code.**

References hold the facts that change — tool capabilities, model limits, prices, setup syntax — so lessons can teach roles, criteria and methods without going stale. They are **external knowledge**: neutral, dated and outside the curriculum sequence. They carry no recommendations; reviews, comparisons and editorial analysis belong in separate, dated articles.

## Layout

- `references/` — exactly four group files: `tools.md`, `models.md`, `pricing.md` (pricing, limits and defaults) and `setup.md` (setup, compatibility and controls). The filename equals the group `id`.

Each entry is added only after its facts are checked against primary sources — the vendor's, standard body's or project's own documentation, pricing page, release record or source; each evidence item records the URL, the date it was checked and where on the page the fact appears. A fact that cannot be checked — for example a navigation path inside a signed-in dashboard — stays out of the values, and an entry with no checkable facts is marked `unverified`. Every current entry carries a review date or trigger; the website and MCP servers flag entries whose review date has passed.

## Entry rules (summary)

Each group file is Markdown with YAML frontmatter: an envelope (`id`, `title`, `summary`, `version`, `audience`, `maintainer`, optional `tags` and `review`) and a list of `entries`. Every object is strict — unknown keys are errors.

| Entry status | Holds                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `current`    | facts with a value, applicability and cited primary evidence; limits; owner; `review_by` and/or `review_trigger`           |
| `legacy`     | as current, describing an older version; never overdue                                                                     |
| `unverified` | candidate subjects and notes only — no values, snippets or evidence; optional unchecked `leads`, which are never displayed |
| `withdrawn`  | a tombstone: `withdrawn_on`, `withdrawn_reason`, optional `replaced_by` pointing at a current or legacy entry; no facts    |

Dates are quoted `"YYYY-MM-DD"` strings and must be real calendar dates. Entry IDs are permanent and unique across all four groups. "Verified on" and "review overdue" are derived when a page or tool response is produced; they are never stored.

Lessons link entries as `contextqb://references/<group>#<entry-id>`. The website shows them at `/references/<group>/#<entry-id>`; the MCP servers expose `list_references`, `get_reference` and `contextqb://references/<group>` resources.

Validated by `@contextqb/content` (`pnpm validate:content`). Licensed CC BY-SA 4.0 (see `LICENSE`).
