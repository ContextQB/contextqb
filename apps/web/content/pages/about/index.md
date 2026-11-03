---
meta_description: "Learn about ContextQB, a practical field guide for non-developers learning to direct AI agents, organize project context, and build working software."
eyebrow: About
headline: A practical school for building with AI agents.
meta_title: "About ContextQB: Practical AI Building for Everyone"

---

## What ContextQB is

ContextQB is a field guide for AI-assisted software building. It teaches everyday builders how to brief agents, organize project context, inspect the work, and make the small architectural decisions that keep software coherent.

You do not need to become a traditional software engineer before you start. You do need a way to think clearly, test what the agent gives you, and keep the project from drifting into a pile of one-off fixes.

## What it is not

- Not a traditional coding bootcamp.
- Not a syntax tutorial site.
- Not a generic prompt library.
- Not an enterprise software architecture consultancy.

## The thesis

Agentic IDEs reduce the cost of implementation. They do not remove the need for judgment.

Here is the kind of failure we mean. You ask the agent for a small addition, such as letting people correct an entry they saved. It works. A week later, something that used to work goes wrong. The list still shows the old version of an edited entry until you reload. Or pressing Save sometimes says "Saved" when nothing was kept. You ask the agent to fix it, and the fix breaks something else.

The cause is rarely a typo. More often, nobody decided which part of the app is responsible for that information, or which part decides what happens, and in what order, when someone presses Save. Each new change guesses, and the guesses collide. The project slowly becomes hard to understand.

Engineers have names for these problems: unclear state ownership, hidden coupling, ad hoc orchestration, and features patched on instead of integrated. You don't need the names to start. ContextQB teaches you to notice the symptoms early, ask your agent where each responsibility lives, and decide before the agent builds around a guess. That is the missing layer.

## What you can use

- **The free curriculum** — guides, principles, playbooks, audits and prompts you can read, share and use with your project. [Find your starting point](/start-here/).
- **The ContextQB MCP** — the same library inside your AI app. [Connect the library](/install/).
- **contextqb check** — an optional command-line tool that checks whether your project's `context.qb.yaml` still matches its files and configuration. [Learn about the check](/check/).

## Who it's for

People building their first serious application with AI, including those returning after early experiments, who want to stay in charge of what gets built.

_You bring the vision. Learn to call the plays._
