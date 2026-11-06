---
id: monitoring-vs-product-analytics
title: Monitoring vs. Product Analytics
summary: Separate evidence that an application is working from evidence that people find it useful, and check whether either signal can be trusted.
version: 0.3.0
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

Take one invented example. A neighbourhood exchange app lets people list items they no longer need and arrange for someone nearby to collect them. Its builder has two different questions: “Can people successfully post a listing?” and “Does using the app help people exchange useful items?”

If saving a listing fails, that is evidence of a broken task: an operational signal. A monitor can detect the failure and bring it to someone who can fix it. A count of people opening the listing form does not establish that saving worked.

Now suppose listings save reliably, but few people ever contact an owner. Usage patterns may help locate the problem: perhaps people browse but rarely open a listing, or open one but stop before contacting the owner. Those patterns suggest questions; they do not prove the reason. People may be seeing irrelevant items, unclear collection arrangements or something else entirely. Observe an actual attempt or talk to people before deciding what change would help. And a contact message sent through the app does not prove that an exchange happened.

## Choose the question before the measurement

A **log** records events; a **metric** summarizes a measurement over time; a **probe** deliberately checks a behavior. An **alert** calls attention to a condition someone should act on. Google SRE's [monitoring chapter](https://sre.google/workbook/monitoring/) describes operational uses such as detecting and diagnosing problems and comparing behavior after changes.

Start with the task: could a person post a listing that others can then see? A healthy server process leaves that question partly unanswered. [Set Up Useful Monitoring](contextqb://playbooks/set-up-useful-monitoring) connects a task failure to a signal and a response.

For usefulness, combine usage evidence with an actual task observation or conversation. [Check a User Journey With a Person](contextqb://playbooks/check-a-user-journey-with-a-person) gives you a way to investigate why a pattern occurs. A personal tool can begin with your own honest use record without adding remote tracking: a short note each time you used it, and whether it helped, can tell you more than a chart.

## Treat missing data as a question

An empty chart could mean no one attempted the task, everyone succeeded, collection stopped, events were filtered out or a reporting delay has not cleared. Check the measurement path and its latest observation before concluding that the app is healthy or unused.

Likewise, an event called `listing_saved` only supports that claim if the app emits it after the listing has actually been stored. Ask the agent to show what triggers the event and which failures it cannot see. Test activity should be distinguishable from actual use.

Keep measurements proportionate. Prefer a result category and technical context over copying listing descriptions, addresses or messages into logs. Apply [Plan Data Retention and Deletion](contextqb://playbooks/plan-data-retention-and-deletion) to event data too.

Before moving on, separate one question about a working task from one about a useful outcome in your product. Choose evidence for each, and state a way each could mislead you. A quiet error chart is not evidence of usefulness, and lots of clicks are not evidence of reliability. [Operating a Small App](contextqb://guides/operating-a-small-app) brings both into a routine.
