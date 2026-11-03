---
id: monitoring-vs-product-analytics
title: Monitoring vs. Product Analytics
summary: Separate evidence that an application is working from evidence that people find it useful, and check whether either signal can be trusted.
version: 0.2.0
audience: [novice-builder, founder, operator]
journey_stage: 7
journey_rank: 20
framing: Does a successful request mean the product helped someone, and does an empty chart mean nothing happened?
related:
  - preparing-for-real-users
  - set-up-useful-monitoring
  - check-a-user-journey-with-a-person
  - plan-data-retention-and-deletion
  - operating-a-small-app
tags: [monitoring, operations]

---

# Monitoring vs. Product Analytics

**Monitoring** helps you answer whether the system is working and whether a failure needs attention. **Product analytics** helps you understand patterns of use. Neither, by itself, establishes that the product solves an important problem.

Take one invented example. Maya is a fictional first-time founder. She uses a small research notebook to save notes from conversations with bakery owners, so she can find that evidence again when she decides which problem her business should solve. The notebook is useful only if entries are saved reliably and if finding them actually helps that decision. Suppose, as an illustration, that a hosted version is also used by a few other founders.

A save failure, whether someone reports it or an error log records it, is an operational signal: the notebook broke its basic promise. A pattern of people returning to find earlier notes just before a decision may inform a product question: is finding evidence the part they value? A count of button clicks cannot establish either that the notes were saved or that finding them helped someone.

## Choose the question before the measurement

A **log** records events; a **metric** summarizes a measurement over time; a **probe** deliberately checks a behavior. An **alert** calls attention to a condition someone should act on. Google SRE's [monitoring chapter](https://sre.google/workbook/monitoring/) describes operational uses such as detecting and diagnosing problems and comparing behavior after changes.

Start with the task: could a person save and reopen a note? A healthy server process leaves that question partly unanswered. [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) connects a task failure to a signal and a response.

For usefulness, combine usage evidence with an actual task observation or conversation. [Check a User Journey With a Person](contextqb://playbooks/check-a-user-journey-with-a-person) gives you a way to investigate why a pattern occurs. A personal tool can begin with your own honest use record without adding remote tracking. If Maya were the only user, a note each time she looked something up, and whether it helped, would tell her more than a chart.

## Treat missing data as a question

An empty chart could mean no one attempted the task, everyone succeeded, collection stopped, events were filtered out or a reporting delay has not cleared. Check the measurement path and its latest observation before concluding that the app is healthy or unused.

Likewise, an event called `note_saved` only supports that claim if the app emits it after confirmed saving. Ask the agent to show what triggers the event and which failures it cannot see. Test activity should be distinguishable from actual use.

Keep measurements proportionate. Prefer a result category and technical context over copying note contents into logs. Apply [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion) to event data too.

Before moving on, name one signal that would reveal a broken task and a different observation that would help you judge its usefulness. State a way each could mislead you. [Operating a Small App](contextqb://guides/operating-a-small-app) brings both into a routine.
