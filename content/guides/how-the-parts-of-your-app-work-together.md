---
id: how-the-parts-of-your-app-work-together
title: How the Parts of Your App Work Together
summary: Follow one user action through your application so you can question an agent's design and decide where information belongs.
version: 0.3.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 2
journey_rank: 0
intro: You can understand the route through an application without knowing how to write every part of it. Start with one action and follow the information.
related:
  - choosing-your-application-channel
  - connecting-services-reliably
  - designing-your-apps-data
  - directing-your-first-feature
  - how-to-use-contextqb
  - modularity
  - new-project-foundation
  - orchestration
  - separation-of-concerns
  - state-ownership
  - the-mental-model-of-your-app
tags:
  - getting-started
  - state

---

# How the Parts of Your App Work Together

**Plain language:** An application has parts that do different jobs. You do not need to write each part yourself, but you need to understand how they work together well enough to question the agent's choices. Follow one useful action from what the person does to what the application remembers.

## Start with an action you understand

You want to build something useful for customers or your team. Before choosing a collection of technologies, describe one thing someone should be able to do. If that is still unclear, start with [The Mental Model of Your App](contextqb://guides/the-mental-model-of-your-app); if you have not chosen where people use it, read [Choosing Your Application Channel](contextqb://guides/choosing-your-application-channel).

This guide follows one invented example. Imagine a sports club whose front desk keeps a lost-property register. Volunteers take turns at the desk. There is no fixed desk computer: each volunteer opens the register on whatever device they have on shift, such as the club's tablet or their own phone. When someone hands in a blue water bottle, the volunteer on duty records "Blue water bottle" and the shelf where they put it, such as "Shelf B." The next morning a different volunteer is on duty when the owner comes asking. That volunteer must be able to find the entry and send the owner to the right shelf.

Nothing here has been built, and you don't need to build it. The example is small enough to follow from end to end, and it involves two people relying on the same information at different times. The same questions apply to a team's request tracker or a customer's booking.

Ask what has to happen between the first volunteer pressing Add and the second volunteer finding that entry the next morning. A button changing color cannot do that job by itself. Following that one action shows what each part of an app is responsible for.

## Name the jobs before naming the tools

You will encounter four useful terms:

- **Interface** — the part the person interacts with, such as a form, a screen or a command.
- **Application rules** — decisions the software must enforce, such as refusing a register entry that has no shelf.
- **Storage** — the place information is kept for later, such as a file or a database. A database organizes records so the application can retrieve and change them.
- **Coordinator** — the function or file that arranges the steps of one action and handles their results.

These jobs do not require four services or four separate products. A small app may keep them in a few files inside one project. [Separation of Concerns](contextqb://principles/separation-of-concerns) explains why the jobs should remain distinguishable; [Modularity](contextqb://principles/modularity) explains how to keep their boundaries understandable as the app grows.

The diagram below is an illustrative flow, not a prescribed folder structure:

```text
Volunteer enters a description and a shelf
  → interface submits the draft entry
  → coordinator checks the rules (both fields supplied)
  → storage records the accepted entry
  → coordinator returns the result
  → interface clears the form and shows the new entry,
    or keeps the draft and explains that the register was not updated

Next morning, another volunteer opens the register
  → interface asks storage for the saved entries
  → interface shows them, including the blue water bottle
```

Each job is distinct. The form collects the description and shelf. The application's rules check that both were supplied. The storage operation keeps the accepted record. The coordinator arranges those steps and reports what happened.

The return path matters. Only after storage confirms success should the interface clear the form and show the new entry. A failed write should not be presented as a successful save, and the volunteer needs the typed text still available to correct or retry. The second half of the diagram matters too. The next volunteer's screen must read the saved register. Yesterday's message saying "Added" is not the register itself.

## Find out where the work runs

In a hosted web version, the application runs on a server reached over a network. The browser is the **client**: the software the person uses to interact with the service. A **server** is a program that receives requests and does work in response. The browser may request that a register entry be saved; the server checks the request, uses storage and returns a response. MDN's [client-server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview) explains that exchange in more detail.

A local application can use a different arrangement. A command-line tool takes input through commands typed into a terminal, a window for interacting with programs through text, applies the rules and writes a local file. A desktop application might use a database on the same computer. Neither needs a network request just to have clear responsibilities.

A web app can also store information inside the browser on one device. Ask which site address, browser and profile hold the records, and what clears them. For example, browser `localStorage` survives ordinary sessions but private-session data is cleared when the last private tab closes, as [MDN explains](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Reopening tests need the same agreed storage context. Browser storage can also be removed by the user or by the browser itself; [MDN describes these storage policies](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria). Treat it as a single copy unless a separate, usable recovery copy has actually been made.

These are different choices, and each changes where records live and what could lose them. Your requirements narrow them. In the club example, the volunteer who records the bottle and the volunteer who looks for it the next morning may be using different devices, yet must reach the same stored register. A web page that keeps entries only in the browser on one device would give each device its own separate copy. That would not meet this club's need. If every volunteer always used one shared desk computer and browser profile, browser storage would at least keep a single copy, subject to the storage limits above; the requirement comes from how people actually reach the register, not from a preferred architecture. Whatever arrangement the agent proposes, ask how every volunteer reaches the same register and what could lose it.

For your own app, ask the agent to name where each job actually runs. If it proposes an outside service, ask what the service does, what information leaves your device and why this feature needs it. A diagram with five boxes is not evidence that you need five hosted services.

## Separate the draft from the saved record

Before Save, the text the person is typing is a draft. After a confirmed save, the stored record is the reference for what was saved. The interface can display that record without becoming a competing authority over it. On reopening, the application must read from storage rather than depend on yesterday's open screen.

This distinction is [State Ownership](contextqb://principles/state-ownership): deciding which part is responsible for each piece of information. At the club desk, the half-filled form and the saved register entry have different jobs. The form belongs to the volunteer typing it. The saved entry is what every volunteer relies on. A displayed count of items waiting on the shelves can be calculated from the saved entries; a separate manually updated total would need to be kept in agreement with them.

The coordinator owns the sequence, not every piece of data. It arranges validation, storage and the response. [Orchestration](contextqb://principles/orchestration) explains that responsibility. The diagram should let you point to both the owner of the saved information and the owner of the action that changes it.

## Compare two proposals

Imagine the agent offers these designs for the club's Add button:

- **Proposal A:** Add puts the entry straight into the visible list, clears the form and shows “Added.” The entry is saved to storage afterwards, in the background.
- **Proposal B:** Add sends the entry to storage. Only after storage confirms success does the interface clear the form and show the entry. If saving fails, the draft stays in the form with a message that the register was not updated. Any volunteer's screen loads the register from that storage.

Proposal A may look finished sooner. But suppose the background save fails. The first volunteer has seen “Added,” the form is empty and the water bottle is on Shelf B. The next morning the register has no entry, and the owner is told nothing was handed in. Showing a change before storage confirms it is not always wrong, but a design that does so must answer two questions. What keeps the draft available if the later save fails? How does the app tell the person that the register was not updated?

Proposal B names the needed path, but it still needs implementation and checks. Ask how the agent will demonstrate that a second person, on a later visit, reads back the stored entry. Repeating “the data is persistent” does not demonstrate it.

For your own application, answer this before asking the agent: which information must still exist on the next visit, who needs to read it, and what should the person see if saving fails? Your answer defines a requirement the design has to meet.

## Apply this to your project

Give the agent this bounded request:

> Take this user action: **[describe one action]**. Explain its path through our application in plain language. Name the interface, rules, storage and coordinator, and where each runs. For existing work, identify the actual files; label proposed files NEW. Show the success path and a failed-save path. Distinguish what exists from what you recommend. Do not change code.

Check the explanation against your intent. If you have no code yet, it is a proposed design, not an inspection. If code exists, ask the agent to show where the saved information is written and read back. You need enough detail to notice a missing job, not a tour of every file.

## What you should leave with

Save the flow in your existing project brief or architecture note. It should name the information that lasts, its owner, the coordinator and what the person sees when the action fails. Do not create a second record if that explanation already has a home.

Before asking the agent, trace one action in your own application yourself, from the person's input to the result a later visit must be able to retrieve. Name four things: the input, the rule, the saved information and the response, including the response when saving fails. Then name who makes that later visit. It might be you tomorrow, a colleague or a customer. In the club, it was another volunteer, which is why one shared register mattered more than any particular screen. When more than one person relies on the same records, you also need to decide who may add or change them. Adding a login screen alone does not answer that question.

That path explains the responsibilities your application needs before you choose software tools to implement them. Then continue to [Directing Your First Feature](contextqb://guides/directing-your-first-feature) to turn one agreed behavior into bounded work.
