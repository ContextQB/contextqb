---
id: documentation-file-naming
title: Documentation File Naming
summary: A documentation filename describes a responsibility. If you can only imagine one instance of the file ever existing, you have named a category, not a file. The same rule that governs code filenames governs doc filenames — with one small list of conventional exceptions.
version: 0.1.0
category: naming
audience:
  - novice-builder
  - founder
  - operator
  - developer
  - agent
journey_stage: 1
journey_rank: 40
tags:
  - naming
  - documentation
  - clarity
  - filenames
anti_patterns:
  - "`PUNCHLIST.md`, `HANDOFF.md`, `PROTOCOL.md`, `SETUP.md`, `NOTES.md`, `SPEC.md`, `ROADMAP.md`, `PLAN.md` — generic uppercase singletons that assume the file will be the only one of its kind."
  - "Disambiguating-by-ad-hoc-suffix (`HANDOFF-task-8.5.md`, `PUNCHLIST-v2.md`) instead of giving the file a real name."
  - "Filenames that describe the document's type instead of its subject — `notes.md`, `doc.md`, `info.md`."
  - "Documents named after their author's chat-export filename and never renamed (typically TitleCase with spaces, ampersands, or trailing version numbers)."
  - "Mixing kebab-case, snake_case, TitleCase, and ALL_CAPS in the same directory."
  - "Relying on the parent directory to disambiguate — agents see only filenames in many tool surfaces."
agent_instructions:
  - When asked to create a new document, propose a filename that describes the document's subject in kebab-case. Reject filenames that work only if the document is a singleton, unless the document is one of the recognised conventional UPPERCASE files.
  - When you encounter an existing UPPERCASE singleton filename outside the recognised convention list, flag it as a naming smell and propose a real name.
  - When a filename is disambiguated by an ad-hoc suffix (a date, a version, a task number stapled to a generic name), propose renaming the file so the disambiguation lives in the name itself.
  - When creating a directory of similar documents, propose a naming pattern at the same time and document it in the directory's `README.md`.
related:
  - naming-conventions
  - documentation-as-architecture
  - documentation-for-agent-alignment
---

# Documentation File Naming

The [`naming-conventions`](contextqb://principles/naming-conventions) principle says code files should be named for what they own, not for what type they are. The same rule applies to documentation files. It is easier to forget, because documentation feels less load-bearing than code, and because the consequences arrive later — usually when a second document of the same kind appears and the first one has to be retroactively renamed.

The cheapest time to give a document a real name is the moment it is created.

## The rule

**A documentation filename describes a responsibility.** If you can only imagine one instance of the file ever existing, you have named a category, not a file.

A `PUNCHLIST.md` is a category. `qb-cli-v1-scope.md` (or, in a scopes directory, `0014-qb-cli-v1.md` numbered to its ADR) is a name. The first will collide as soon as a second scope exists. The second tells the reader what the document is without needing the parent folder.

Note: `PUNCHLIST.md` is doubly wrong. It fails the singleton test (generic naming), _and_ it misuses the word "punchlist." In construction, a punchlist is a remediation list at the end of a build. A pre-build contract is called a _scope_. See [`append-dont-overwrite`](contextqb://principles/append-dont-overwrite) and ADR-0025 for the canonical vocabulary.

## Why this is harder for docs than for code

Code files almost always live inside a typed structure — a package, a module folder — that gives them implicit context. A file named `parse.ts` inside `csv/` is fine; a file named `parse.ts` at the project root is not. The folder rescues the filename.

Documentation files often live in flat directories — `docs/`, the repo root, a package root — where the folder offers no disambiguation. Worse, agent tooling frequently presents files by filename alone. A document named `PUNCHLIST.md` shown in a file list, a search result, or a context-window summary is **the** punchlist regardless of where it lives. The first time two PUNCHLISTs appear in the same listing the disambiguation has already failed.

## The conventional exceptions

A small set of UPPERCASE filenames earn singleton status because every tool in the ecosystem — version control hosts, package managers, agents, IDEs — recognises them. Keep these as-is:

| Filename                 | Why it earns the exception                                    |
| ------------------------ | ------------------------------------------------------------- |
| `README.md`              | The universal repository entry-point.                         |
| `LICENSE` / `LICENSE.md` | Required by hosts and package managers for legal recognition. |
| `CHANGELOG.md`           | Tool-recognised; one per package.                             |
| `CONTRIBUTING.md`        | Tool-recognised; one per repository.                          |
| `AGENTS.md`              | Emerging convention; agents look for it by name.              |
| `CODE_OF_CONDUCT.md`     | Tool-recognised; one per repository.                          |
| `SECURITY.md`            | Tool-recognised for vulnerability reporting.                  |

These earn the all-caps singleton treatment because they are universally one-per-repo and the ecosystem has agreed on the name. Outside this list, an UPPERCASE singleton is a smell.

## Patterns that scale

Use these instead of inventing a new generic name:

| Pattern                        | Use for                                           | Example                                            |
| ------------------------------ | ------------------------------------------------- | -------------------------------------------------- |
| `NNNN-<slug>.md`               | Sequentially-numbered append-only records         | `0014-drift-detector-v1.md` (an ADR)               |
| `<NNNN>-<slug>.md` under a dir | Records anchored to another numbered series       | `docs/scopes/0024-context-qb-adapter-expansion.md` |
| `YYYY-MM-<slug>/` (folder)     | Dated experiment, incident, or campaign artefacts | `experiments/2026-05-context-qb-efficiency/`       |
| `<verb-noun>.md`               | Actionable workflows (playbooks)                  | `write-an-adr.md`, `set-up-agents-md.md`           |
| descriptive kebab-case         | Everything else                                   | `external-accounts-setup.md`, `repo-structure.md`  |

The common thread: the filename answers "what specifically is this?" without the reader having to look at the parent folder.

## The smell tests

Three quick checks. If any of them flag the filename, it is probably a category dressed as a name:

1. **The "the" test.** Read the filename aloud with "the" in front. "The PUNCHLIST" sounds wrong because there is no specific punchlist being referenced — it is a kind of thing. "The qb-cli-v1 punchlist" sounds right.
2. **The collision test.** Imagine the second instance of this document arriving in six months. Does the name still work? If not, the first one is borrowing space the second one will need.
3. **The standalone-listing test.** Imagine the filename shown alone in an agent's search results, with no folder context. Is it clear what the document is? If not, the folder is doing work the filename should do.

## What to do when you find an offender

In a tier-1 / greenfield context, you almost never will — because you authored the name with this principle in front of you. The remediation lane (renaming generically-named files in an existing repository) is tier-2 work under ADR-0019; a future audit template and remediation playbook will cover it.

For greenfield work, the discipline is purely preventive:

1. Before saving the file, propose a name.
2. Apply the three smell tests.
3. If any test trips, propose two or three concrete alternatives and pick the one that survives all three.

This costs seconds at creation time and never has to be paid again.

## How to ask an agent to enforce this

> When proposing a filename for a new documentation file, first apply the three smell tests from `documentation-file-naming`: (1) the "the" test, (2) the collision test, (3) the standalone-listing test. Show your reasoning for each. Only suggest the filename if all three tests pass, or if the file is one of the recognised conventional UPPERCASE singletons (README, LICENSE, CHANGELOG, CONTRIBUTING, AGENTS, CODE_OF_CONDUCT, SECURITY).
