---
id: the-mental-model-of-your-app
title: The Mental Model of Your App
summary: Before you write a line of code or prompt a single agent, you have to know — in plain words — what your app is actually for. This guide follows one small example from first idea to a first feature, then helps you do the same with yours.
version: 0.4.1
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 0
journey_rank: 20
intro: |
  Every app begins as a feeling: "I wish there was a thing that did this." This guide is for that moment — before the code, before the screens, before you know whether it's a website or an app or a script. You'll watch one invented founder turn a small idea into five plain answers, a promise and a first feature, then see how her model changes once she uses it. Then you do the same for your idea.
tags:
  - mental-model
  - getting-started
related:
  - building-for-yourself-vs-others
  - choosing-your-ide-and-llm
  - context-quarterback-the-onboarding-map
  - designing-your-apps-data
  - directing-your-first-feature
  - documentation-as-architecture
  - documenting-for-your-agent
  - feature-planning
  - how-the-parts-of-your-app-work-together
  - new-project-foundation
  - product-engineering-alignment
  - set-up-agents-md
  - setting-up-git-and-github
  - understanding-the-context-window
  - what-an-application-is
  - write-a-context-qb
  - write-an-adr
next_steps:
  - Write one sentence for each of the five questions about your own idea.
  - Turn those answers into a one-paragraph working brief and a one-sentence promise.
  - List the buckets of information your first version needs, and park the rest as later ideas.
  - Open a repo and add an AGENTS.md with the brief.
  - Run the new-project-foundation playbook.

---

# The Mental Model of Your App

**Plain language:** You have an idea. You think it might be an app. You don't know how to code, or maybe you do but you've never built something from nothing. This guide is your starting point. By the end you'll have a mental model clear enough that an AI agent can build the first version with you.

## You're in the right place

If you're reading this because you have an idea and aren't sure how to start — you're not behind. You're at the right step, doing the right kind of thinking.

Most people who imagine an app never begin, not because the idea is bad, but because they think the next move is "learn to code." That's no longer true. Today the next move is "describe what you want clearly enough that an agent can build it." The bottleneck has shifted from syntax to clarity.

What you have right now — an idea that something _could_ exist — is the part the agent cannot do for you. Everything downstream depends on it being expressed clearly.

## The example this guide follows

It is easier to learn this by watching it done once, so this guide follows one invented person from start to finish.

Maya is a first-time founder. She wants to start a business that serves small independent bakeries, but she hasn't yet decided which of their problems to solve. For a month she has been talking to bakery owners and reading what they post online. Each conversation teaches her something: one owner re-types every weekend order into a stock spreadsheet; another throws away unsold bread because she has to guess tomorrow's quantities.

Her notes are scattered across her phone, her email and a document. Last Thursday, preparing to choose which problem to pursue, she spent twenty minutes looking for the owner who described the spreadsheet problem and couldn't tell whether one owner had mentioned it or three. Her idea is a small tool for herself: a **research notebook** where she saves each source she learns from — usually a customer conversation, sometimes an article — together with her own note about what it showed, so she can find that evidence when it is time to decide.

The notebook is not Maya's business. It's a personal tool she wants while she works out what her business should be. Maya, the bakeries and the notebook are all made up, and you don't need to build the notebook or use her research method. The example is here because it is small enough to follow from first idea to first feature. Watch the steps, then repeat them with your own idea.

## What an app actually is

At the highest level, every application does one thing:

> It moves information from one place to another.

That's it. That's the whole surface.

Apps capture information from somewhere (a person typing, a device sensing, another service sending). They store it. They organise it. They show it back to someone in a useful form. They trigger something to happen based on it. Sometimes they send it somewhere else.

Everything else — the buttons, the colours, the animations, the auth screens, the dark mode — is _how_ the app does that. The mental model lives one level above the _how_. It lives at the _what_: what information, from where, to where, for whom, and why.

The reason this framing matters: once you can describe your idea in those terms, the agent has something concrete to build from. "Make me a research app" is too vague. Maya's version is buildable: "A place where I save each customer conversation with what I learned from it, and find it again when I'm deciding what to build."

## Separate the need from your assumptions

Write down one situation in which someone needs your product. If you have observed it, record what happened. Maya can write: "On Thursday I spent twenty minutes searching three places for one owner's comment, and still wasn't sure how many owners had said it." She saw that happen to herself.

If you are guessing, say so. Maya might also think: "I suspect other founders lose their interview notes too." That's a guess. It only matters if she later wants other founders to use her notebook, and it should stay labelled as a guess until someone checks it. An agent can help organize either statement, but it can't turn a guess into evidence just by restating it confidently.

Choose a small useful result and one way to check it. For Maya: save one source with her note, close the app, reopen it and find the same entry. She leaves sharing with a future cofounder out of that first feature because she is testing it alone. She keeps sharing on a list of later ideas, not in the first build. Her real notes name real people and businesses, so she practises with made-up entries while learning. Do the same if your product will hold private or sensitive information.

This gives the mental model a practical test. [Directing Your First Feature](contextqb://guides/directing-your-first-feature) turns Maya's small promise into a brief an agent can plan from, while [How the Parts of Your App Work Together](contextqb://guides/how-the-parts-of-your-app-work-together) explains the path the information takes.

## The parameters of your mental model

Inside that one-sentence frame ("moves information from one place to another"), there are five questions you have to answer for the agent to do anything useful. You don't have to answer them perfectly — just plausibly:

1. **What information is the app about?** What are the _things_ — recipes, customers, photos, lessons, runs? In ContextQB terms these are your **entities**. The names of these things become the vocabulary of your whole project.
2. **Where does the information come from?** You typing it? Other people typing it? A spreadsheet you'll upload? A third-party API? An AI generating it?
3. **Where does it live?** A database? A document store? A file on disk? You don't need to pick a technology — just answer "is this information remembered, or does it disappear when I close the app?"
4. **Who interacts with it, and how?** Just you? You plus a few friends? Anyone on the internet? Read-only, or do they change things?
5. **What happens when the information changes?** Nothing? A notification? A re-rendering of a list? A bill goes out? An email gets sent?

### Maya's five answers

Here is how Maya answers them for her notebook. Each answer is one or two plain sentences.

1. **Information:** sources (a conversation or article she learned from) and her notes on them. In the first version she saves them together: each saved entry pairs one source with one note.
2. **Where it comes from:** Maya types each entry herself, usually right after a conversation. Nothing is imported from her calendar, email or recordings.
3. **Where it lives:** entries must still be there after she closes the app. That is the whole point. For now they only need to live on her own computer, and she doesn't have to choose a technology to say so.
4. **Who uses it:** only Maya, adding and reading entries. A future cofounder might want to read them; she writes that down as a later idea instead of building it now.
5. **What happens when it changes:** the new entry appears in her list. Nothing else happens. Nothing is sent anywhere and nobody is notified.

If you can write a sentence answering each of those, you have a mental model. It will be wrong in places. That's fine — it gets revised. What matters is that it exists.

## You don't have to have it all figured out

This is the part that stops most people: the assumption that you have to fully understand the app before you can start. You don't. You can't, actually. The app teaches you what it wants to be as you build it.

What you need is a **core concept**: a single sentence that captures the promise of the app. Writing it means resisting the urge to add features. Maya's promise is:

> "After a customer conversation, I can save what I learned with where I learned it, and find it again when I'm deciding what to build."

That's enough. From that promise, Maya's first feature is the smallest version that keeps it: enter a source title and a note, save them, close the app, reopen it and see the same entry. Search, tags and sharing could all be useful later. With a handful of entries she can read the whole list. Without saving and reopening, though, the promise fails completely, so that comes first. [Directing Your First Feature](contextqb://guides/directing-your-first-feature) writes that feature up as a brief.

From there, the agent can build a prototype. From the prototype, you learn what works and what doesn't. From what works and what doesn't, you refine the mental model. The cycle continues forever.

Builders who insist on a complete blueprint before starting almost never start. Builders who insist on a complete blueprint before writing a line of code end up rebuilding from scratch when reality intrudes. The most durable approach is: hold the mental model lightly, ship something small, and let what you learn refine the model.

## Why ContextQB fits this stage

If you're new to building applications, ContextQB is built for exactly the moment you're in. Two reasons:

**It makes your mental model durable.** Agent memory is partial and belongs to the tool: some tools keep notes between sessions ([what agents keep](contextqb://references/setup#agent-memory)), but you can't see or rely on what each new session actually knows. Without a system, you spend half your time re-explaining your app to the agent. ContextQB's whole point is that the things you've decided — your entities, your architecture, your conventions, your security posture — get written down once and live in places agents and humans can both read. Your mental model stops being a thing in your head and starts being a thing in your repo.

**It gives you the right shape to start.** When you don't know where to start, "open an editor and write code" is not actionable. "Write an `AGENTS.md`, declare your boot manifest in `context.qb.yaml`, list your entities, run the `feature-planning` playbook" _is_ actionable. ContextQB provides the scaffolding so you can focus on the only part nobody can do for you — the mental model itself.

## Get organised and start building

You don't need to know how to code to start. You do need to do these things, in roughly this order:

1. **Write a working brief.** A paragraph in your own words: who it's for, what it does, what experience it creates, what it deliberately doesn't do. Write it like you're describing the app to a close friend over coffee. Your five answers and your promise are most of it already.
2. **Have an agent restate your brief back to you.** Ask: "Restate this idea as a clear app concept with: who it's for, what problem it solves, what the core experience should feel like, what the must-have features are for V1." If the agent misunderstands your intent here, it will build the wrong thing later. Read the restatement against what you meant, not for how polished it sounds. A fluent restatement can still be wrong. For example, someone else writes "a reading tracker for my book club", and the agent restates it as "a social reading platform where users discover books and follow friends". It sounds good, but it quietly turned a trusted group into the public and added features nobody asked for. Correct it in plain words and ask for the restatement again.
3. **List your entities.** What buckets of information does the app need? Don't worry about how they're stored. Just name them. Maya's list is short. The information she handles is sources and her notes about them, but her first version always saves one source with one note, so it has a single entity: "Entries: one source with my note about it." She is tempted to add "Tags" and "Users", but nothing in her first promise needs them, so they go on her later-ideas list. That list is the first draft of your schema.
4. **Open a repo.** Even an empty folder counts. Initialise it with `git`. This is where your mental model becomes a durable artefact.
5. **Set up the project foundation.** Use the [`new-project-foundation`](contextqb://playbooks/new-project-foundation) playbook to give the repo the boundaries, naming, and orchestration story it needs before the first feature ships. Use the [`set-up-agents-md`](contextqb://playbooks/set-up-agents-md) playbook to author the single most leverage-positive file in an agentic codebase.
6. **Write a `context.qb.yaml`.** This is the boot manifest agents read first. The [`write-a-context-qb`](contextqb://playbooks/write-a-context-qb) playbook walks you through it. It captures the mental model in machine-readable form.
7. **Plan the first feature, don't code it yet.** Use the [`feature-planning`](contextqb://playbooks/feature-planning) playbook to produce a feature brief, surface map, state plan, and risk list before any code is written. Now you let the agent build.

You don't have to write steps 4–6 yourself. Ask the agent to draft the repository setup, `AGENTS.md` and `context.qb.yaml`; your job is to check each draft against your five answers above and correct what doesn't match.

At step 7, you've turned an idea into a structured project an agent can extend. That's the whole on-ramp.

## Track your mental model as it evolves

The reason ContextQB exists is that mental models drift. Here's how that happens to Maya.

She starts with one note per source. Three weeks in, she notices two things while actually using the notebook. A single long conversation produced four separate observations: the spreadsheet problem, a pricing complaint, a staffing issue and a supplier delay. And when she sits down to decide, she wants every note about the spreadsheet problem across all her conversations, not one conversation at a time. Her model was wrong in a useful way. A note is really its own thing, attached to a source, and one source can have many notes. Her single entity, the entry, becomes two: sources and notes.

That is a different shape, and her own use of the tool showed it. It wasn't just a feature she thought of. If the change lives only in Maya's head, the agent will keep building one note per source. If it lives in her repo — in `AGENTS.md`, in `context.qb.yaml`, in an ADR that records why notes became separate — every future session builds from the current model. [Designing Your App's Data](contextqb://guides/designing-your-apps-data) shows how to make that kind of change to the data deliberately.

Here's how each piece of ContextQB holds part of the evolving model:

- **`AGENTS.md`** — the operating instructions for any agent touching the repo. Update this whenever a decision changes how the agent should behave.
- **`context.qb.yaml`** — the boot manifest: the map of what exists and where. It holds the project summary, the main folders and packages (`tree`), where the app is deployed (`routes`), the decisions on record (`decisions`) and what is in flight (`status`). Updated when the structure of the project changes. It does not hold security rules or the principles you follow — those go in `AGENTS.md`, which also tells the agent to read this file.
- **ADRs (Architecture Decision Records)** — the durable record of _why_ you made a particular structural choice. Written when you decide something that future-you (or a future agent) will need to defend. Use [`write-an-adr`](contextqb://playbooks/write-an-adr) for the format.
- **Status documents per feature** — small living docs that track purpose, scope, progress, and blockers for an in-flight feature. Surface area for what the agent should be doing right now.
- **The schema** — once your entities solidify, the schema becomes the spine of the app. It's the most opinionated document in the repo.

Each refinement is a permanent gain. You're not losing context every session — the system holds it for you. Three months from now, an agent can read your repo and know what you intended without you re-explaining anything.

## What "good enough" looks like at this stage

You don't need a fully formed mental model to start. You need:

- A sentence for each of the five questions, and a one-sentence promise.
- A short working brief in your own words.
- A list of the buckets of information your app handles.
- A first guess at where information enters the app and where it leaves.
- A repo set up to capture what you learn next.

That's the whole bar. Maya reached it with one entity, five short answers and one promise. Her model changed within weeks, when entries split into sources and notes, and that was expected. The mental model evolves from there, and ContextQB gives you the structure to keep that evolution coherent.

You are doing the right kind of thinking. Keep going.

## See also

- [Guide: What an Application Is](contextqb://guides/what-an-application-is) - the substrate: files, runtimes, channels, and information flow.
- [Guide: Building for Yourself vs. Building for Others](contextqb://guides/building-for-yourself-vs-others) - decide who the first real user is before the plan hardens.
- [Guide: Directing Your First Feature](contextqb://guides/directing-your-first-feature) — Maya's first feature written up as a brief, and how to write yours.
- [Playbook: Prepare a New Repo for AI-Assisted Development](contextqb://playbooks/new-project-foundation) — the practical sequence after this guide.
- [Playbook: Set Up AGENTS.md for Your Project](contextqb://playbooks/set-up-agents-md) — author the single most leverage-positive file.
- [Playbook: Write a context.qb for Your Repository](contextqb://playbooks/write-a-context-qb) — encode the mental model machine-readably.
- [Playbook: Plan a Feature Before Letting the Agent Code](contextqb://playbooks/feature-planning) — when you're ready to start building.
- [Principle: The Context Quarterback — Every Repo Has a Boot Manifest](contextqb://principles/context-quarterback-the-onboarding-map) — why the mental model has to live in the repo.
- [Principle: Documentation as Architecture](contextqb://principles/documentation-as-architecture) — why writing it down is the architecture, not a byproduct.
- [Principle: Product-to-Engineering Alignment](contextqb://principles/product-engineering-alignment) — why the words in your mental model become the vocabulary of your code.
