---
id: making-your-app-usable
title: Making Your App Usable
summary: Sketch the task, handle the states around it and inspect whether the intended person can complete it, including with different access needs.
version: 0.3.0
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

This guide uses one invented example. Imagine someone preparing for a trip who wants a packing list grouped by bag. They need to add “Phone charger” to their carry-on bag so that, when they pack that bag, they can see everything that belongs in it. The app only keeps the list. It cannot know what is physically in a bag. You don't need to build this; it is here because the task is familiar enough to judge.

Draw the few steps the person needs. For the packing list: type an item, say which bag it goes in, add it, see it listed with that bag, and find it again when packing. Paper is enough. Put the main task where someone can find it and name controls for their actions: “Add to packing list” says more than “Submit.”

Ask what the person needs to know at each step. A field can have a visible label and a short example. Below a “Bag” field, the hint “For example: Carry-on” tells someone what kind of answer is wanted. Decide which information is required and explain why when the reason is not obvious.

## Design the situations around success

List the interface states, the temporary conditions described in [Stored Data, Derived Data and Interface State](contextqb://briefings/stored-data-derived-data-and-interface-state):

- **Empty:** show how to add the first item, rather than leaving an unexplained blank area.
- **Loading:** explain that saved information is being retrieved. Do not present a failed read as an empty packing list.
- **Saving:** show that the action is in progress and handle a repeated press deliberately.
- **Success:** confirm the actual saved result after storage succeeds, for example by showing the new item with its bag.
- **Invalid input:** say which field needs attention and how to correct it, such as “Choose or enter a bag” beside the bag field. Keep the person's other work, including the item they already typed.
- **Failed save:** say the item has not been added, keep what was typed in both fields and provide an appropriate next action.

These states may be brief in a local app. The underlying decisions still matter. Ask the agent to demonstrate the failure and recovery path as well as the attractive successful screen. Check the wording too: in this app, no message should suggest the person has physically packed something when they have only added it to the list.

## Include different ways of using the interface

For a web app, start with these observable checks: complete the task using the keyboard; see which control has focus; read and operate the form when zoomed; check small-screen layout; inspect meaningful labels, text alternatives for informative images and adequate contrast. A screenshot cannot establish keyboard behavior. Automated tools help find some issues; human use supplies additional evidence.

W3C's [Easy Checks](https://www.w3.org/WAI/test-evaluate/preliminary/) is a practical starting point with explicit limits: these preliminary checks do not establish complete accessibility. Its [form-label guidance](https://www.w3.org/WAI/tutorials/forms/labels/) explains associating a label with its control. Ask the agent to use the established controls of your platform and show how the intended task works with relevant access needs.

Record what was tried, the device or browser, the result and what remains untested. A command-line or desktop tool needs its own interaction checks; do not force a web checklist onto a different channel.

## Judge one screen the way a person meets it

Here is a first attempt at the packing-list screen, described as a person would meet it rather than as code. It is deliberately imperfect so you can practise spotting problems.

- One box has a visible label, “Item.” A second box has no label, only the faint grey word “Container” inside it. When the person starts typing, that word disappears, and nothing on the screen says what the box is for any more.
- The button says **Commit**.
- If they press it with the second box empty, the message reads “Fill in both fields.” It doesn't say which box needs attention.
- After a successful save, the boxes clear, a message says “Done.” and a line such as “Carry-on: Phone charger” appears in a list below the form.

Judge it as a person would. They can guess what to enter for the item. They may not know whether “Container” means a suitcase, a storage box or a category, and once they type, the hint is gone. “Commit” doesn't say whether the button adds the item to the list or marks it as packed, and “Done.” has the same problem. The code might save perfectly while the interface still leaves the person uncertain.

Placeholder text is not a dependable label: it disappears while someone types, and assistive technologies such as screen readers do not handle it consistently. A person who can't see the screen, or who looks away and back, may lose track of what the box is for. These are usability and accessibility judgements. You can make them without reading code, and the fixes are product decisions:

- visible labels “Item to pack” and “Bag,” with “For example: Carry-on” beneath the bag field;
- a button called “Add to packing list”;
- if the bag is missing, “Choose or enter a bag” beside that field, keeping the item text;
- after a successful save, the item shown with its bag; if saving fails, both typed values kept and a message saying it was not added.

Some questions can only be answered by watching. Ask someone new to add an item to a bag for a made-up trip, then observe without telling them which controls to use. Do they understand the bag box? Do they recognize that the item was added, and not marked as packed? Can they find it after closing and reopening? [Check a User Journey With a Person](contextqb://playbooks/check-a-user-journey-with-a-person) explains how to run that session and contains a clearly labelled fictional observation record for practice. Replace it with your actual observations when you run your own session. Nothing on this page claims anyone has used this screen; keyboard operation, focus visibility, zoom and larger text sizes still need running checks.

The decision is whether the interface communicates the task and its result, not whether its code looks tidy.

## Take the next step in your project

Leave with a task sketch, the states it must handle and a short list of observable checks. For your own screen, identify one label, state or message that could leave a person guessing, and decide what it should say. Use [Testing Agent-Built Software](contextqb://guides/testing-agent-built-software) to connect automated checks with human use. Before accepting a polished screen, choose one failure or access need and ask the agent to demonstrate what happens. That question keeps the design connected to the person who needs the result.

That completes the main lesson. The rest of this page is optional depth for when you want to know how the interface's code is organized.

## Optional depth: review how the interface code is organized

Usability asks whether a person can complete the task. A structural review asks a different question: is the code behind the screen organized so it can be trusted and changed? The [UI Architecture Audit](contextqb://audits/ui-architecture) is ContextQB's procedure for that review. It produces a report with ten sections, from a summary through to a now/next/later plan. It can reveal duplicated state or a workflow with no clear coordinator. It cannot tell you whether anyone understands the screen. [Check a User Journey With a Person](contextqb://playbooks/check-a-user-journey-with-a-person) answers that. Neither substitutes for the other.

Use this section once you have a first working screen and an agent has produced, or is about to produce, a structural review of it. You do not need to learn the code syntax: ask the reviewer to connect every finding to the task and show its evidence.

### The review target: the code behind that screen

The packing-list screen described above can be built in many ways. This version keeps the list in the browser's own storage (`localStorage`) on one device. That is one possible design, chosen here because three short files can show it. In this design, the list exists only in that browser profile, for that site address, on that device. Clearing the browser's site data removes it. The page also has no export, so there is no copy anywhere else, and the list cannot be opened from a second device such as a phone. For a personal packing list, the owner can judge whether those limits are acceptable or whether an export or shared access is worth adding.

These are the **complete illustrative files for this small review target**, not files in your application, and not a pattern to copy. They are deliberately flawed so the review has real findings, and they omit many capabilities a delivered product would need, including export or backup. Nothing here is installed or hosted. If you choose to try them, ask the agent to propose a temporary local web server and its shutdown steps; module scripts need to be served through HTTP rather than opened directly from a file, as [MDN documents](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). The snippets provide evidence for a filled structural audit; no browser run or user session is claimed here.

`index.html` supplies the page and controls:

```html
<!doctype html>
<html lang="en">
  <meta charset="utf-8" />
  <title>Packing list</title>
  <h1>Packing list</h1>
  <form id="packing-form">
    <label for="item">Item</label>
    <input id="item" name="item" />
    <input name="bag" placeholder="Container" />
    <button type="submit">Commit</button>
  </form>
  <p id="status" role="status"></p>
  <ul id="packing-list"></ul>
  <script type="module" src="packing-list-page.js"></script>
</html>
```

`packing-list-store.js` owns the browser storage calls:

```js
const key = "contextqb-practice-packing-list";
export function readPackingList() {
  return JSON.parse(localStorage.getItem(key) ?? "[]");
}
export function writePackingList(entries) {
  localStorage.setItem(key, JSON.stringify(entries));
}
```

`packing-list-page.js` coordinates the form and displayed list:

```js
import { readPackingList, writePackingList } from "./packing-list-store.js";
const form = document.querySelector("#packing-form");
const status = document.querySelector("#status");
const list = document.querySelector("#packing-list");
let entries = readPackingList();
function renderPackingList() {
  list.replaceChildren(
    ...entries.map((entry) => {
      const row = document.createElement("li");
      row.textContent = `${entry.bag}: ${entry.item}`;
      return row;
    }),
  );
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const item = form.elements.namedItem("item").value.trim();
  const bag = form.elements.namedItem("bag").value.trim();
  if (!item || !bag) {
    status.textContent = "Fill in both fields.";
    return;
  }
  try {
    const next = [...entries, { id: crypto.randomUUID(), item, bag }];
    writePackingList(next);
    entries = next;
    form.reset();
    renderPackingList();
    status.textContent = "Done.";
  } catch {
    status.textContent = "Could not finish adding. Check the list before retrying.";
  }
});
renderPackingList();
```

Each saved entry has three fields: `id`, a unique identifier created for it; `item`, what to pack; and `bag`, which bag it belongs in. The catch covers more than the storage call. If writing succeeds and a later step fails, the error cannot reliably say whether saving failed. That is one reason to inspect the sequence, not just the final message.

### Filled structural audit

This report follows the ten sections the UI Architecture Audit asks for. Every finding below is **read in code**, scoped only to these three snippets. In a real review, use actual project paths and inspect the complete target.

1. **Executive summary.**
   - The add path has one coordinator, `packing-list-page.js`.
   - Storage calls have a named boundary, `packing-list-store.js`.
   - Read failures and malformed stored records have no recovery path.
   - The broad save catch can confuse a storage failure with a later display failure.
2. **Current UI structure.** `index.html` is the single page; the module script attaches its form behavior. There is no route system, component framework, shared store or hook in this target. Those are optional mechanisms for organizing a larger interface.
3. **Component inventory by responsibility.** The HTML owns page structure and visible controls. `packing-list-page.js` coordinates saving and renders the list. `packing-list-store.js` reads and writes stored text. The page module combines validation, coordination and display; its small size makes a specific split a judgment call, not an automatic rewrite.
4. **State map.** The following table covers the target's shared values and draft. Here, “stored” means held as its own value rather than calculated; it does not mean durable. Only the browser-storage row is intended to survive reopening, subject to its storage limits:

   | Name               | Owner                                    | Source                      | Duplicates                         | Derived or stored                                             |
   | ------------------ | ---------------------------------------- | --------------------------- | ---------------------------------- | ------------------------------------------------------------- |
   | Saved packing list | `packing-list-store.js` storage boundary | Durable browser storage     | Loaded into `entries`              | Stored                                                        |
   | `entries`          | `packing-list-page.js`                   | Local copy of saved records | Storage and list                   | Held in memory, not durable; refreshed after this page writes |
   | Draft item/bag     | HTML form                                | Local unsaved input         | Trimmed local values during submit | Held in controls; interface state, not durable                |
   | Visible list       | `renderPackingList`                      | Local `entries`             | Represents the same records        | Derived                                                       |
   | Status message     | Submit handler                           | Local operation result      | None shown                         | Held in the page; interface state, not durable                |

5. **Orchestration layer.** The submit handler coordinates validation → `writePackingList(next)` → update → reset → display. Initial loading is `let entries = readPackingList()` followed by `renderPackingList()`, with no error handling around either.
6. **Modularity findings.** No snippet exceeds 300 lines or five distinct responsibilities as grouped above. There is no second feature to inspect for cross-feature coupling. The page assumes specific HTML selectors; `form.elements.namedItem("bag").value` depends on the matching field name. Keep that interface explicit when splitting the page.
7. **Extensibility findings.** `readPackingList()` and `writePackingList(entries)` are named storage extension points. Their implicit contract is an array of objects containing `id`, `item` and `bag`; `JSON.parse(...)` alone does not validate that contract. Browser storage is contained in one file. No component slots, theme tokens or settings extension points exist here; adding them is not required by the task.
8. **Anti-spaghetti scan.**
   - **Unclear data flow: absent within the target.** The import and submit sequence show the route.
   - **Repeated logic: absent within the target.** One validator and one renderer are shown.
   - **Mixed concerns: partly present.** Validation, sequencing and rendering share the page module; assess a split when those jobs grow.
   - **Unpredictable side effects: partly present.** The broad `try` includes both writing and display, so its catch obscures which effects completed.
   - **State updated from too many places: absent within the target.** One submit handler replaces `entries`; the renderer derives the list.
   - **Hidden dependencies: partly present.** The page relies on HTML names and the store assumes accessible, well-formed browser storage.
   - **Fragile lifecycle assumptions: present.** Startup assumes `readPackingList()` succeeds, and another tab's writes do not refresh this page's in-memory copy. Saving from that stale copy overwrites the stored array and can erase items added in the other tab.
   - **Features bolted on rather than integrated: absent within the target.** Only one feature is shown; no conclusion about a larger product follows.
9. **Recommendations.** First, handle storage-read failure and validate loaded records so a broken load is visible (high impact, bounded change). Next, separate write failure from later rendering failure and confirm with a check that the draft survives a failed write (high impact, needs failure checks). Then define one-tab use or handle concurrent edits deliberately (scope decision; prevents lost items). Defer framework or theme infrastructure without a demonstrated need.
10. **Now / next / later plan.** Now: agree loaded-data rules; add a read-failure path; check failed-save draft retention. Next: distinguish post-write display errors; test reopening; document the one-tab limitation or implement its agreed alternative. Later: revisit module boundaries as features grow; introduce extension points only for a concrete use; repeat structural review after that change.

### What the structural review did not tell you

None of the ten sections above mentions the problems you judged earlier. The code does confirm them: in `index.html` the bag `<input>` has only a placeholder and no associated `<label>`, and the button text is “Commit.” The submit handler shows one generic message, “Fill in both fields.”, for either missing value, and reports success as “Done.” without saying the item was added to the list. These are code-based findings about usability, not structural ones. Keyboard operation, focus visibility, zoom and narrow-screen behavior still need running checks, and whether a person understands the screen still needs observation. Record those results when you run the agreed test target.
