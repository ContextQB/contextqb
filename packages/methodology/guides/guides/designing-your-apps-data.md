---
id: designing-your-apps-data
title: Designing Your App's Data
summary: Describe the records your product needs, the rules they follow and who may change them before the agent chooses a storage design.
version: 0.3.0
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
  - the-mental-model-of-your-app
  - where-your-data-lives
tags: [getting-started, state]

---

# Designing Your App's Data

**Plain language:** Before choosing a database, decide what your application needs to remember. Describe a few realistic records, the rules they must follow and who may change them. You can make those decisions without knowing database syntax; the agent can translate them into an implementation you can inspect.

## Begin with the useful behavior

Read [Where Your Data Lives](contextqb://guides/where-your-data-lives) and [How the Parts of Your App Work Together](contextqb://guides/how-the-parts-of-your-app-work-together) first. One explains storage choices; the other traces an action. This guide describes the information that travels along that path.

This guide uses one invented example. Imagine a community workshop that lends tools to its members. It owns two identical-looking cordless drills, along with saws, sanders and ladders. The staff at the lending desk need to know which physical drill went out, who borrowed it and when it is due back. When a drill comes back with a cracked battery, they want to know who borrowed that particular drill most recently. “A list of drills” is not enough to describe that information.

Nothing here is built, and you don't need to build it. The example shows how to work out what an application must remember from what its users need to know. Start with that requirement rather than adding fields because a future version might need them.

## Write a small data dictionary

An **entity** is a kind of thing your app handles. A **record** is one instance of that thing. A **field** holds one part of the record. A **data dictionary** explains those fields and their rules.

The workshop's lending needs two kinds of record. Ask what one record represents in each case before listing fields.

A **tool** record represents one physical object on the shelf. The two drills are two tool records, even though they look the same. A **loan** record represents one occasion on which a member borrows one tool. The same drill borrowed in March and again in May produces two loan records.

Here is an illustrative dictionary. It is a proposed teaching design, not a database already built.

**Tool**

- **`id`** — a stable identifier assigned when the tool is added, such as `tool-17`. In practice it might also be printed on a label stuck to the drill. It distinguishes the two drills, and it does not change if the display name is edited.
- **`name`** — the display name staff and members see, such as “Cordless drill.” It must contain something besides whitespace: blank characters such as spaces, tabs and line breaks. Two tools may share a name.

**Loan**

- **`id`** — the loan's own stable identifier, such as `loan-204`.
- **`tool_id`** — the identifier of the borrowed tool. This is how a loan points to one exact drill.
- **`member_id`** — a reference to the borrower in the workshop's existing membership register. The loan stores the member's identifier rather than a copy of their name, so the loan is not identified by a name that might be misspelled or later changed. This guide does not design a sign-in system; the register already exists.
- **`due_on`** — the date the tool should come back, written as year-month-day.
- **`returned_on`** — the date the tool actually came back. It is empty (`null`, meaning “no value yet”) until the tool is returned.

These synthetic records follow that design:

```json
{
  "tools": [
    { "id": "tool-17", "name": "Cordless drill" },
    { "id": "tool-18", "name": "Cordless drill" }
  ],
  "loans": [
    {
      "id": "loan-198",
      "tool_id": "tool-17",
      "member_id": "member-0042",
      "due_on": "2026-10-24",
      "returned_on": "2026-10-23"
    },
    {
      "id": "loan-204",
      "tool_id": "tool-17",
      "member_id": "member-0031",
      "due_on": "2026-11-14",
      "returned_on": null
    }
  ]
}
```

Read it in ordinary language. The workshop has two drills with the same name. Drill `tool-17` was borrowed by one member and returned a day early. It is now out with another member and due back on 14 November. Drill `tool-18` has no loan recorded. That is all the records say: they do not prove where the drill physically is, which only someone looking at the shelf can confirm.

Suppose a drill comes back with a cracked battery. Staff identify which physical drill it is from the `tool-17` label on it, then use the loan history to see who borrowed that exact drill and when. The records do not mention damage, and they do not show who caused it. They give staff an accurate starting point for that conversation.

The identifiers are only labels. `tool-17` could just as well be `k7f3`, and nothing in the app should read meaning into its wording or prefix. What matters is that each is unique and does not change.

Decide reasonable size limits with the agent and write them into the project brief; there is no universal length that fits every product. Ask it to show where the limits are enforced and what the person sees when input is rejected. Do not silently truncate someone's work to make it fit.

## Make relationships explicit when you need them

A **relationship** connects records. Here, each loan belongs to one tool, and one tool can have many loans over time. That is called a one-to-many relationship.

Consider the simpler design an agent might propose: put a “current borrower” field on each tool and overwrite it at every checkout. The desk could still see who has a drill now, but each new loan would erase the last one. The question “who borrowed this drill before it came back damaged?” could no longer be answered. Linking each loan to its tool keeps that history, because returning a tool fills in a date instead of deleting anything.

Now ask what retiring a tool means. Suppose `tool-17` is beyond repair. Deleting its record would leave `loan-198` and `loan-204` pointing at a tool that no longer exists, or a database default might quietly delete those loans too. Removing a broken drill from the available list should not erase who borrowed it. One option is to mark the tool as retired and keep its record. Whichever you choose, it is a product decision your data design must support, not an accidental database default.

Write down who may change each record, too. In this example only desk staff record checkouts and returns; members do not edit loans. Do not add a field such as `member_id` or `owner_id` and assume that merely having it enforces permission. [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data) explains how the data decision connects to protection.

For your own app, answer three questions. What does one record represent? How will you tell similar records apart? Which relationships must survive a later change, such as an edit, a deletion or a retirement?

## Write rules that remain true

A **constraint** is an enforced rule about valid data. An **invariant** is a condition the system must keep true through its operations. For the workshop, every loan must name a tool that exists, and the rule that matters most is this: **a tool cannot have two open loans at once.** “Open” means no return date has been recorded.

Writing that rule in the dictionary does not make it true. Showing only available drills on the checkout screen is useful feedback, but it does not enforce the rule either. Two staff members at two desks could each see `tool-18` as available and press Check Out at the same moment. The part of the application that accepts a checkout must enforce the rule, including when two requests arrive together; other paths into the data may bypass the screen entirely. Ask the agent how that part will refuse the second checkout, and how it will be tested.

Some changes require several writes to succeed together. A **transaction** groups supported database changes into an all-or-nothing operation. PostgreSQL's [transaction explanation](https://www.postgresql.org/docs/18/tutorial-transactions.html) shows this idea. Ask whether your chosen storage supports the operation you need, rather than assuming every sequence of saves is atomic. For the simultaneous checkout, checking “is there an open loan?” and then creating a loan as two unconnected steps leaves a gap between them. The storage must be able to make the check and the write hold together, for example with an enforced rule in the database or a suitably protected transaction. The agent should explain which mechanism your storage actually provides. A database transaction does not automatically include an email already sent through another service.

## Keep temporary values out of the durable model

The selected tab, an unfinished checkout form and the number of tools shown on screen have different purposes from the saved records. [Stored Data, Derived Data and Interface State](contextqb://briefings/stored-data-derived-data-and-interface-state) helps you classify them.

Whether a tool is available is a good example. It can be calculated: a tool is available when it is not retired and has no open loan. A separately stored “available” flag on each tool creates another value that must stay in agreement with the loans. If a return is recorded but the flag update fails, the app keeps showing the drill as “out” even though its loan has been closed. Calculate such values when practical instead of creating that extra responsibility by accident.

## Ask the agent to challenge the model

Use this request before implementation:

> Read our feature brief. Propose a small data dictionary and three synthetic records: ordinary, invalid and a boundary case. Explain identifiers, relationships, write rules and who may change each record. Mark decisions that need my answer. Show how the model supports the promised behavior without adding later features. Do not change code.

Inspect the examples in ordinary language. Can two records share a name without being confused? If a record is removed or retired, what happens to the records that point to it? Which rule must hold even when two requests arrive at once? Which field would expose information unnecessarily? Correct the model before approving implementation.

Save the agreed dictionary alongside the existing brief. Your output is a set of examples and rules you can defend, not a diagram you cannot explain. When stored records already exist, use [Change Stored Data Safely](contextqb://playbooks/change-stored-data-safely) before changing their shape.
