---
id: plan-data-retention-and-deletion
title: Plan Data Retention and Deletion
summary: Decide why information is kept, where its copies go and how to test the promises you make about deletion and export.
version: 0.2.0
audience:
  - novice-builder
  - founder
  - operator
  - agent
journey_stage: 2
journey_rank: 60
problem: Information can remain in logs, backups and outside services long after a person thinks it has been deleted.
when_to_use: When deciding to retain user information, before making deletion or export promises, and when adding another copy or service.
expected_outputs:
  - A data inventory with purpose, locations, retention decisions and an owner.
  - Specific deletion and export behavior, including copies and unresolved questions.
  - A safe test plan and evidence for any behavior already implemented.
related:
  - application-security-baseline
  - check-a-user-journey-with-a-person
  - designing-your-apps-data
  - map-your-attack-surface
  - monitoring-vs-product-analytics
  - protecting-users-and-their-data
  - rehearse-backup-and-recovery
  - review-feedback-and-plan-the-next-change
  - set-up-useful-monitoring
  - turn-a-feature-brief-into-checks
tags:
  - data
  - security

---

# Plan Data Retention and Deletion

Keeping information is a product decision. Decide what the task needs, how long you need it and what “delete” will mean to the person using your app. The agent can trace the copies and implement the decision; it should not invent a retention policy for you.

Start with [Designing Your App's Data](contextqb://guides/designing-your-apps-data) and [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data). Use this procedure before real information accumulates, even if the first plan is short.

## The example on this page

The steps use one invented tool. Maya is a fictional first-time founder deciding which problem her business should solve for small independent bakeries. She keeps a personal research notebook on her own computer, used only by her: each entry holds one source, such as a conversation with a bakery owner, with her note about what it showed. Her notes name real people and businesses, so where copies of them end up matters. The notebook's first version only saves entries and shows them again. It has no delete button, attachments, accounts or remote copies; its data sits in local storage, plus any backup or export copies she makes. Nothing is built, and you do not need to build it.

Deletion and attachments appear below as proposed later capabilities, to show the decisions they would require before anyone promises them.

## Step 1 — Follow the information and its copies

List what you collect, its purpose and where it goes. Include the main storage, uploaded files, exports, logs, backups, analytics and any outside service receiving it. A log is a record of application events; it can accidentally become a second store of private input.

Ask the agent to distinguish locations found in code or service settings from locations it merely expects. Mark unknowns for investigation. Credentials belong in their protected store, not in this inventory's example values.

For Maya's single-user notebook, the first inventory might contain the local storage location, either a file or browser storage, and any export the owner downloads. Browser storage is not itself a backup; plan an export or another supported recovery copy before relying on the records, and include its retention in the inventory. Accounts, analytics and remote copies are conditional additions, not prerequisites for a serious application.

## Step 2 — Make one decision for each kind of information

Record these fields in the project's existing data or feature notes. If the project has none yet, create one short note where it keeps its documentation, for example `docs/data-retention.md`; no new documentation structure is needed:

```text
Information and purpose:
Locations and outside services:
Who may read, export or delete it:
How long to keep it, or which event ends retention:
Reason for that choice and person responsible:
What happens after deletion, including backups and logs:
Unanswered contractual or legal questions:
How the promised behavior will be checked:
```

**Retention** means how long information is kept. Choose a period or event you can justify and enforce. “Forever, just in case” is an unanswered decision. So is an arbitrary number of days copied from another product.

For Maya's first version, which has no delete action, the honest description is that entries stay in local storage, and in any backups and exports, until she removes them herself. If she adds deletion later, an illustrative decision is to keep an entry until she deletes it. She must still decide whether deletion is immediate, has an undo period or moves the entry into a visible trash area. State which behavior is implemented before describing it to users.

## Step 3 — Specify the complete promise

Describe what disappears from normal use, what remains elsewhere, who can access retained copies and when those copies expire. Hiding a record in the interface is different from removing it from storage. Overwriting a file also does not, by itself, prove every historical or device-level copy is erased.

Include linked records. If a future notebook has attachments, decide whether deleting a note deletes its attachments, leaves them available elsewhere or requires another choice. If you offer export, define which records and files it contains, a usable format and how access is checked. Test that another user's information is excluded when accounts exist.

Backups need an explicit rule. If old backups retain deleted records temporarily, document the access restriction and expiry. Plan how recovery will avoid quietly reintroducing information that should remain deleted. [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) must include that rule when it applies.

## Step 4 — Resolve questions the implementation cannot decide

The appropriate policy depends on the information, users, places served and commitments you make. Record any unanswered obligations and have the responsible person verify current requirements with qualified help where needed. This procedure supplies engineering questions, not a universal legal timetable or a ready-made privacy notice.

Keep unresolved promises out of release claims. You can continue building a disposable example while a decision is pending; collecting real information under an unverified promise is a separate decision.

## Step 5 — Check the behavior with made-up records

Use [Turn a Feature Brief Into Checks](contextqb://playbooks/turn-a-feature-brief-into-checks) to agree expected results before execution. In an isolated test target, create clearly marked records, export if applicable, delete and inspect the relevant stores. Test a failed deletion too: the interface should report what remains rather than announce completion.

Where accounts exist, use two controlled test accounts to check permission boundaries. For the no-account notebook, inspect the named local storage and exports instead. Do not manufacture an account system just to perform the exercise.

Record the tested revision, locations inspected, results and limits. “Deleted from the main database” supports that specific claim; a separate provider or backup needs its own evidence. Mark unimplemented retention jobs and untested copies as pending, with an owner and next action.

You are ready to proceed when you can explain where a record goes, why each copy exists and how you would verify the deletion promise you intend to make.
