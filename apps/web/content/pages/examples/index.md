---
eyebrow: Examples
headline: What good agent work looks like.
subhead: >-
  Fictional but realistic examples of what an agent produced: audits, plans, a
  review and AGENTS.md templates. Use them to learn what useful evidence looks
  like, and how to ask for the same kind of evidence about your own project.
meta_title: "Worked Examples for AI Project Plans, Audits and Reviews"
meta_description: "See concrete examples of project plans, agent instructions and software audits. Learn what useful evidence and actionable AI output look like."

---

## How to read these examples

Each example shows what an agent produced for one invented person and product. A useful result is not the same as a long one. It makes specific claims about the project, supports each claim with evidence you could check (a file, a quoted line, a command and its result) and uses that evidence to justify a decision about what to do next. A short answer that does this is better than a long one that doesn't.

Every example starts with who it is for and why the work was needed. Read that first. Then try this reading task on any example. It takes about ten minutes:

1. **Find a claim.** Look for one sentence that says something specific about the project. In the [backend audit example](/examples/backend-ingestion-audit-example/): "If `IndexRepo.update` fails, the first two writes are committed."
2. **Find the evidence for it.** The report shows the four database writes running one after another with nothing tying them together, and a test run in which rows were left behind after a forced failure. That test run is labelled fictional: in an invented example, nothing was actually run.
3. **Find the decision it justifies.** "Wrap persistence in a transaction", meaning make the four writes succeed or fail together. It appears in the recommendations and in the "Now" part of the plan, because half-saved data needs manual cleanup.
4. **Find a detail not to copy.** The class names, line counts, the Express and Redis stack and the test output belong only to this invented project. The habit to keep is the chain from claim to evidence to decision.
5. **Transfer it to your own app.** Write one request that asks for the same kind of evidence. For an app that saves a booking and then sends a confirmation email: "Show me each place where saving one thing takes more than one step, quote the code, and tell me what would be left behind if a step failed halfway."

When your own agent's answer differs from an example, push back on a claim with no evidence you can check, or a recommendation that doesn't follow from any finding. Don't push back just because it is shorter. The full engineering sections in each example are optional depth: read them when you want to see what a complete report contains.
