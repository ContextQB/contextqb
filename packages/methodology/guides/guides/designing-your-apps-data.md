---
id: designing-your-apps-data
title: Designing Your App's Data
summary: Describe the records your product needs, the rules they follow and who may change them before the agent chooses a storage design.
version: 0.1.2
audience: [novice-builder, founder, operator]
journey_stage: 2
journey_rank: 10
intro: A data model is a description of the information your application keeps and how its pieces relate. Begin with examples you understand.
related:
  - backend-architecture
  - change-stored-data-safely
  - connecting-services-reliably
  - directing-your-first-feature
  - how-the-parts-of-your-app-work-together
  - how-to-use-contextqb
  - plan-data-retention-and-deletion
  - protecting-users-and-their-data
  - rehearse-backup-and-recovery
  - rollback-vs-restore
  - stored-data-derived-data-and-interface-state
  - where-your-data-lives
tags: [getting-started, state]

---

# Designing Your App's Data

**Plain language:** Before choosing a database, decide what your application needs to remember. Describe a few realistic records, the rules they must follow and who may change them. You can make those decisions without knowing database syntax; the agent can translate them into an implementation you can inspect.

## Begin with the useful behavior

Read [Where Your Data Lives](contextqb://guides/where-your-data-lives) and [How the Parts of Your App Work Together](contextqb://guides/how-the-parts-of-your-app-work-together) first. One explains storage choices; the other traces an action. This guide describes the information that travels along that path.

Use the research notebook's brief in [Directing Your First Feature](contextqb://guides/directing-your-first-feature). Its first version remembers a source title and a note for one person. Start with that requirement rather than adding fields because a future version might need them.

## Write a small data dictionary

An **entity** is a kind of thing your app handles, such as a saved reading item. A **record** is one instance of that thing. A **field** holds one part of the record. A **data dictionary** explains those fields and their rules.

Here is an illustrative dictionary for the notebook; it is a proposed teaching design, not a database already built:

- **`id`** — a stable identifier assigned when the item is created. It distinguishes records even when their titles match. Changing a title does not change this identifier.
- **`title`** — the source title supplied by the person. It must contain something besides whitespace: blank characters such as spaces, tabs and line breaks. Whitespace at the ends is removed; internal spacing is preserved.
- **`note`** — the person's explanation of why the source matters. It follows the same nonblank rule. This first version keeps one note per item.

This synthetic record follows that design:

```json
{ "id": "note-1", "title": "Interview notes", "note": "Ask how the team finds old decisions." }
```

Decide reasonable size limits with the agent and write them into the project brief; there is no universal length that fits every product. Ask it to show where the limits are enforced and what the person sees when input is rejected. Do not silently truncate someone's work to make it fit.

## Make relationships explicit when you need them

A **relationship** connects records. If a later version allows several notes for one source, each note can point to the source's identifier. Decide what should happen when a source is deleted: should its notes also be deleted, retained separately or prevent deletion until resolved? Those choices belong to the product, not to an accidental database default.

For a shared version, decide whether an item belongs to a person or a team, and who can read, change or delete it. Do not add an `owner_id` field and assume that merely having it enforces permission. [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data) explains how the data decision connects to protection.

The local notebook does not need accounts just to illustrate a data model. Record its current boundary and the event that would change it, such as sharing private records with another person.

## Write rules that remain true

A **constraint** is an enforced rule about valid data. An **invariant** is a condition the system must keep true through its operations. For this example, a saved item needs a stable identifier and nonblank title and note. Rejecting empty input in the form is useful feedback, but the part accepting the write must also enforce the rule; other entry paths may bypass the form.

Some changes require several writes to succeed together. A **transaction** groups supported database changes into an all-or-nothing operation. PostgreSQL's [transaction explanation](https://www.postgresql.org/docs/18/tutorial-transactions.html) shows this idea. Ask whether your chosen storage supports the operation you need, rather than assuming every sequence of saves is atomic. A database transaction does not automatically include an email already sent through another service.

## Keep temporary values out of the durable model

The selected tab, an unfinished form and the number of displayed notes have different purposes from the saved records. [Stored Data, Derived Data and Interface State](contextqb://briefings/stored-data-derived-data-and-interface-state) helps you classify them. A second stored total creates another value that must stay in agreement; calculate it when practical instead of making that extra responsibility by accident.

## Ask the agent to challenge the model

Use this request before implementation:

> Read our feature brief. Propose a small data dictionary and three synthetic records: ordinary, invalid and a boundary case. Explain identifiers, relationships, write rules and who may change each record. Mark decisions that need my answer. Show how the model supports the promised behavior without adding later features. Do not change code.

Inspect the examples in ordinary language. Can two items share a title without being confused? What happens to notes if the related source is removed? Which field would expose information unnecessarily? Correct the model before approving implementation.

Save the agreed dictionary alongside the existing brief. Your output is a set of examples and rules you can defend, not a diagram you cannot explain. When stored records already exist, use [Change Stored Data Safely](contextqb://playbooks/change-stored-data-safely) before changing their shape.
