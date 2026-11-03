---
id: making-your-app-usable
title: Making Your App Usable
summary: Sketch the task, handle the states around it and inspect whether the intended person can complete it, including with different access needs.
version: 0.2.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 3
journey_rank: 5
intro: A working function becomes a useful product when someone can find it, understand what happened and recover from a mistake.
related:
  - check-a-user-journey-with-a-person
  - directing-your-first-feature
  - how-to-use-contextqb
  - preparing-for-real-users
  - stored-data-derived-data-and-interface-state
  - testing-agent-built-software
  - ui-architecture
tags:
  - ui
  - getting-started

---

# Making Your App Usable

**Plain language:** A person should be able to tell where to start, what the app needs from them and whether their action worked. You can make those decisions before choosing colors or writing code. Start with one task and the situations around it.

## Sketch the useful path

This guide uses one invented example. Maya is a fictional first-time founder deciding which problem her business should solve for small independent bakeries. After each conversation with a bakery owner, she wants to save which conversation it was and her note about what she learned, so she can find that evidence when she decides. The tool she has in mind is a small personal research notebook. Its first feature is written up in [Directing Your First Feature](contextqb://guides/directing-your-first-feature). Use that brief or your own equivalent; you don't need to build the notebook.

Draw the few steps the person needs. For Maya: enter a source title and note, save, see the saved entry, return later. Paper is enough. Put the main task where someone can find it and name controls for their actions: “Save note” says more than “Submit.”

Ask what the person needs to know at each step. A note field can have a visible label and a short explanation such as “What do you want to remember about this source?” Decide which information is required and explain why when the reason is not obvious.

## Design the situations around success

List the interface states, the temporary conditions described in [Stored Data, Derived Data and Interface State](contextqb://briefings/stored-data-derived-data-and-interface-state):

- **Empty:** show how to create the first note, rather than leaving an unexplained blank area.
- **Loading:** explain that saved information is being retrieved. Do not present a failed read as an empty notebook.
- **Saving:** show that the action is in progress and handle a repeated press deliberately.
- **Success:** confirm the actual saved result after storage succeeds.
- **Invalid input:** say which field needs attention and how to correct it. Keep the person's other work.
- **Failed save:** say the note has not been saved, retain the draft and provide an appropriate next action.

These states may be brief in a local app. The underlying decisions still matter. Ask the agent to demonstrate the failure and recovery path as well as the attractive successful screen.

## Include different ways of using the interface

For a web app, start with these observable checks: complete the task using the keyboard; see which control has focus; read and operate the form when zoomed; check small-screen layout; inspect meaningful labels, text alternatives for informative images and adequate contrast. A screenshot cannot establish keyboard behavior. Automated tools help find some issues; human use supplies additional evidence.

W3C's [Easy Checks](https://www.w3.org/WAI/test-evaluate/preliminary/) is a practical starting point with explicit limits: these preliminary checks do not establish complete accessibility. Its [form-label guidance](https://www.w3.org/WAI/tutorials/forms/labels/) explains associating a label with its control. Ask the agent to use the established controls of your platform and show how the intended task works with relevant access needs.

Record what was tried, the device or browser, the result and what remains untested. A command-line or desktop tool needs its own interaction checks; do not force a web checklist onto a different channel.

## Judge one screen the way a person meets it

Here is a first version of Maya's notebook page, described as she would meet it rather than as code. It is deliberately imperfect so you can practise spotting problems.

- The page shows a “Source title” box with a visible label. Below it is a larger box showing only the grey word “Note” inside it. When she starts typing, that word disappears, and nothing on the screen says what the box is for any more.
- If she presses **Save note** with one box empty, the message reads “Add a title and note.” It doesn't say which box needs attention.
- After a successful save, the boxes clear, a message says “Saved.” and the entry appears in a list below the form.

Judge it as a person would. Would someone new know what to write in the second box? After an error, can they tell what to fix? Does “Saved.” match what they can see in the list? Placeholder text is not a dependable label: it disappears while someone types, and assistive technologies such as screen readers do not handle it consistently. A person who can't see the screen, or who looks away and back, may lose track of what the box is for. These are usability and accessibility judgements. You can make them without reading code, and the fixes are product decisions: a visible label for the note box, and an error message that names the box to correct.

Some questions can only be answered by watching. Ask someone to keep a made-up source and their thought about it for later, then observe without helping. Do they understand the note box? Do they recognize success? Can they find the entry after closing and reopening? [Check a User Journey With a Person](contextqb://playbooks/check-a-user-journey-with-a-person) explains how to run that session and contains a clearly labelled fictional observation record for practice. Replace it with your actual observations when you run your own session. Nothing on this page claims anyone has used this screen; keyboard operation, focus visibility, zoom and narrow-screen behavior still need running checks.

## Take the next step in your project

Leave with a task sketch, the states it must handle and a short list of observable checks. Use [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) to connect automated checks with human use. Before accepting a polished screen, choose one failure or access need and ask the agent to demonstrate what happens. That question keeps the design connected to the person who needs the result.

That completes the main lesson. The rest of this page is optional depth for when you want to know how the interface's code is organized.

## Optional depth: review how the interface code is organized

Usability asks whether a person can complete the task. A structural review asks a different question: is the code behind the screen organized so it can be trusted and changed? The [UI Architecture Audit](contextqb://audits/ui-architecture) is ContextQB's procedure for that review. It produces a report with ten sections, from a summary through to a now/next/later plan. It can reveal duplicated state or a workflow with no clear coordinator. It cannot tell you whether anyone understands the screen. [Check a User Journey With a Person](contextqb://playbooks/check-a-user-journey-with-a-person) answers that. Neither substitutes for the other.

Use this section once you have a first working screen and an agent has produced, or is about to produce, a structural review of it. You do not need to learn the code syntax: ask the reviewer to connect every finding to the task and show its evidence.

### The review target: the code behind that screen

The page described above can be built in many ways. This version keeps Maya's entries in the browser's own storage (`localStorage`) on one device. That is one possible design, chosen here because three short files can show it; the first-feature brief leaves the storage choice to the agent. In this design, entries exist only in that browser profile, for that site address, on that device. Clearing the browser's site data removes them. The page also has no export, so there is no copy anywhere else. That missing capability would need to be added before anyone relied on it for real notes.

These are the **complete illustrative files for this small review target**, not files in your application, and not a pattern to copy. They are deliberately flawed so the review has real findings, and they omit many capabilities a delivered product would need, including export or backup. If you choose to try them, ask the agent to propose a temporary local web server and its shutdown steps; module scripts need to be served through HTTP rather than opened directly from a file, as [MDN documents](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). The snippets provide evidence for a filled structural audit; no browser run or user session is claimed here.

`index.html` supplies the page and controls:

```html
<!doctype html>
<html lang="en">
  <meta charset="utf-8" />
  <title>Research notebook</title>
  <h1>Research notebook</h1>
  <form id="note-form">
    <label for="title">Source title</label>
    <input id="title" name="title" />
    <textarea name="note" placeholder="Note"></textarea>
    <button type="submit">Save note</button>
  </form>
  <p id="status" role="status"></p>
  <ul id="notes"></ul>
  <script type="module" src="notebook-page.js"></script>
</html>
```

`notebook-store.js` owns the browser storage calls:

```js
const key = "contextqb-practice-notes";
export function readNotes() {
  return JSON.parse(localStorage.getItem(key) ?? "[]");
}
export function writeNotes(notes) {
  localStorage.setItem(key, JSON.stringify(notes));
}
```

`notebook-page.js` coordinates the form and displayed list:

```js
import { readNotes, writeNotes } from "./notebook-store.js";
const form = document.querySelector("#note-form");
const status = document.querySelector("#status");
const list = document.querySelector("#notes");
let notes = readNotes();
function renderNotes() {
  list.replaceChildren(
    ...notes.map((note) => {
      const item = document.createElement("li");
      item.textContent = `${note.title}: ${note.note}`;
      return item;
    }),
  );
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = form.elements.namedItem("title").value.trim();
  const note = form.elements.namedItem("note").value.trim();
  if (!title || !note) {
    status.textContent = "Add a title and note.";
    return;
  }
  try {
    const next = [...notes, { id: crypto.randomUUID(), title, note }];
    writeNotes(next);
    notes = next;
    form.reset();
    renderNotes();
    status.textContent = "Saved.";
  } catch {
    status.textContent = "Could not finish saving. Check the list before retrying.";
  }
});
renderNotes();
```

The catch covers more than the storage call. If writing succeeds and a later step fails, the error cannot reliably say whether saving failed. That is one reason to inspect the sequence, not just the final message.

### Filled structural audit

This report follows the ten sections the UI Architecture Audit asks for. Every finding below is **read in code**, scoped only to these three snippets. In a real review, use actual project paths and inspect the complete target.

1. **Executive summary.**
   - The save path has one coordinator, `notebook-page.js`.
   - Storage calls have a named boundary, `notebook-store.js`.
   - Read failures and malformed stored records have no recovery path.
   - The broad save catch can confuse a storage failure with a later display failure.
2. **Current UI structure.** `index.html` is the single page; the module script attaches its form behavior. There is no route system, component framework, shared store or hook in this target. Those are optional mechanisms for organizing a larger interface.
3. **Component inventory by responsibility.** The HTML owns page structure and visible controls. `notebook-page.js` coordinates saving and renders the list. `notebook-store.js` reads and writes stored text. The page module combines validation, coordination and display; its small size makes a specific split a judgment call, not an automatic rewrite.
4. **State map.** The following table covers the target's shared values and draft. Here, “stored” means held as its own value rather than calculated; it does not mean durable. Only the browser-storage row is intended to survive reopening, subject to its storage limits:

   | Name             | Owner                                | Source                      | Duplicates                         | Derived or stored                                             |
   | ---------------- | ------------------------------------ | --------------------------- | ---------------------------------- | ------------------------------------------------------------- |
   | Saved notes      | `notebook-store.js` storage boundary | Durable browser storage     | Loaded into `notes`                | Stored                                                        |
   | `notes`          | `notebook-page.js`                   | Local copy of saved records | Storage and list                   | Held in memory, not durable; refreshed after this page writes |
   | Draft title/note | HTML form                            | Local unsaved input         | Trimmed local values during submit | Held in controls; interface state, not durable                |
   | Visible list     | `renderNotes`                        | Local `notes`               | Represents the same records        | Derived                                                       |
   | Status message   | Submit handler                       | Local operation result      | None shown                         | Held in the page; interface state, not durable                |

5. **Orchestration layer.** The submit handler coordinates validation → `writeNotes(next)` → update → reset → display. Initial loading is `let notes = readNotes()` followed by `renderNotes()`, with no error handling around either.
6. **Modularity findings.** No snippet exceeds 300 lines or five distinct responsibilities as grouped above. There is no second feature to inspect for cross-feature coupling. The page assumes specific HTML selectors; `form.elements.namedItem("note").value` depends on the matching field name. Keep that interface explicit when splitting the page.
7. **Extensibility findings.** `readNotes()` and `writeNotes(notes)` are named storage extension points. Their implicit contract is an array of objects containing `id`, `title` and `note`; `JSON.parse(...)` alone does not validate that contract. Browser storage is contained in one file. No component slots, theme tokens or settings extension points exist here; adding them is not required by the first brief.
8. **Anti-spaghetti scan.**
   - **Unclear data flow: absent within the target.** The import and submit sequence show the route.
   - **Repeated logic: absent within the target.** One validator and one renderer are shown.
   - **Mixed concerns: partly present.** Validation, sequencing and rendering share the page module; assess a split when those jobs grow.
   - **Unpredictable side effects: partly present.** The broad `try` includes both writing and display, so its catch obscures which effects completed.
   - **State updated from too many places: absent within the target.** One submit handler replaces `notes`; the renderer derives the list.
   - **Hidden dependencies: partly present.** The page relies on HTML names and the store assumes accessible, well-formed browser storage.
   - **Fragile lifecycle assumptions: present.** Startup assumes `readNotes()` succeeds, and another tab's writes do not refresh this page's in-memory copy. Saving from that stale copy overwrites the stored array and can erase notes saved by the other tab.
   - **Features bolted on rather than integrated: absent within the target.** Only one feature is shown; no conclusion about a larger product follows.
9. **Recommendations.** First, handle storage-read failure and validate loaded records so a broken load is visible (high impact, bounded change). Next, separate write failure from later rendering failure and confirm with a check that the draft survives a failed write (high impact, needs failure checks). Then define one-tab use or handle concurrent edits deliberately (scope decision; prevents lost notes). Defer framework or theme infrastructure without a demonstrated need.
10. **Now / next / later plan.** Now: agree loaded-data rules; add a read-failure path; check failed-save draft retention. Next: distinguish post-write display errors; test reopening; document the one-tab limitation or implement its agreed alternative. Later: revisit module boundaries as features grow; introduce extension points only for a concrete use; repeat structural review after that change.

### What the structural review did not tell you

None of the ten sections above mentions the problems you judged earlier. The code does confirm them: in `index.html` the note `<textarea>` has only a placeholder and no associated `<label>`, and the submit handler shows one generic message for either missing value. These are code-based findings about usability, not structural ones. Keyboard operation, focus visibility, zoom and narrow-screen behavior still need running checks, and whether a person understands the screen still needs observation. Record those results when you run the agreed test target.
