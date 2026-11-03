---
id: how-the-parts-of-your-app-work-together
title: How the Parts of Your App Work Together
summary: Follow one user action through your application so you can question an agent's design and decide where information belongs.
version: 0.1.5
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

For this guide, use the small research notebook described in [Directing Your First Feature](contextqb://guides/directing-your-first-feature). A person enters a source title and a note, saves them and comes back later to read them. The example is deliberately small enough to follow; the same questions apply to a team's request tracker or a customer's booking.

Ask what has to happen between pressing Save and seeing the saved note tomorrow. A button changing color cannot do that job by itself.

## Name the jobs before naming the tools

You will encounter four useful terms:

- **Interface** — the part the person interacts with, such as a form, a screen or a command.
- **Application rules** — decisions the software must enforce, such as refusing a note that contains only spaces.
- **Storage** — the place information is kept for later, such as a file or a database. A database organizes records so the application can retrieve and change them.
- **Coordinator** — the function or file that arranges the steps of one action and handles their results.

These jobs do not require four services or four separate products. A small app may keep them in a few files inside one project. [Separation of Concerns](contextqb://principles/separation-of-concerns) explains why the jobs should remain distinguishable; [Modularity](contextqb://principles/modularity) explains how to keep their boundaries understandable as the app grows.

The diagram below is an illustrative flow, not a prescribed folder structure:

```text
Person enters a title and note
  → interface submits the draft
  → save coordinator checks the rules
  → storage records the accepted values
  → coordinator returns the result
  → interface shows saved content or explains the failure
```

The return path matters. A failed write should not be presented as a successful save. The person also needs their unsaved text available to correct or retry the action.

## Find out where the work runs

In a hosted web version, the application runs on a server reached over a network. The browser is the **client**: the software the person uses to interact with the service. A **server** is a program that receives requests and does work in response. The browser may request that a note be saved; the server checks the request, uses storage and returns a response. MDN's [client-server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview) explains that exchange in more detail.

A local application can use a different arrangement. A command-line tool takes input through commands typed into a terminal, a window for interacting with programs through text, applies the rules and writes a local file. A desktop application might use a database on the same computer. Neither needs a network request just to have clear responsibilities.

A web app can also store information inside the browser on one device. Ask which site address, browser and profile hold the records, and what clears them. For example, browser `localStorage` survives ordinary sessions but private-session data is cleared when the last private tab closes, as [MDN explains](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Reopening tests need the same agreed storage context. Browser storage can also be removed by the user or by the browser itself; [MDN describes these storage policies](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria). Treat it as a single copy unless a separate, usable recovery copy has actually been made.

Ask the agent to name where each job actually runs. If it proposes an outside service, ask what the service does, what information leaves your device and why this feature needs it. A diagram with five boxes is not evidence that you need five hosted services.

## Separate the draft from the saved record

Before Save, the text the person is typing is a draft. After a confirmed save, the stored record is the reference for what was saved. The interface can display that record without becoming a competing authority over it. On reopening, the application must read from storage rather than depend on yesterday's open screen.

This distinction is [State Ownership](contextqb://principles/state-ownership): deciding which part is responsible for each piece of information. In the notebook, the unsaved form and the saved record have different jobs. A displayed note count can be calculated from the records; a separate manually updated total would need to be kept in agreement with them.

The save coordinator owns the sequence, not every piece of data. It arranges validation, storage and the response. [Orchestration](contextqb://principles/orchestration) explains that responsibility. The diagram should let you point to both the owner of the saved information and the owner of the action that changes it.

## Compare two proposals

Imagine the agent offers these designs:

- **Proposal A:** Save adds the note to the screen's current list and shows “Saved.” Closing the app discards the list.
- **Proposal B:** Save writes the note to the chosen storage and reports success after that operation succeeds. Reopening loads the saved records; a failed save leaves the draft available.

For the notebook's promise, Proposal A is incomplete even if the screen looks right. Proposal B names the needed path, but it still needs implementation and checks. Ask how the agent will demonstrate that the stored values are read back after reopening; repeating “the data is persistent” does not demonstrate it.

For your own application, answer this before asking the agent: which information must still exist tomorrow, and what should the person see if saving fails? Your answer defines a requirement the design has to meet.

## Apply this to your project

Give the agent this bounded request:

> Take this user action: **[describe one action]**. Explain its path through our application in plain language. Name the interface, rules, storage and coordinator, and where each runs. For existing work, identify the actual files; label proposed files NEW. Show the success path and a failed-save path. Distinguish what exists from what you recommend. Do not change code.

Check the explanation against your intent. If you have no code yet, it is a proposed design, not an inspection. If code exists, ask the agent to show where the saved information is written and read back. You need enough detail to notice a missing job, not a tour of every file.

## What you should leave with

Save the flow in your existing project brief or architecture note. It should name the information that lasts, its owner, the coordinator and what the person sees when the action fails. Do not create a second record if that explanation already has a home.

Without asking the agent to answer first, explain what changes if your notebook becomes a tool for a team. Shared records and who may change them now need decisions; adding a login screen alone does not answer those questions. Then continue to [Directing Your First Feature](contextqb://guides/directing-your-first-feature) to turn one agreed behavior into bounded work.
