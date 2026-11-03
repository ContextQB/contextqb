---
id: where-your-app-runs
title: Where Your App Runs
summary: Identify the version, settings, data and access in each place your app runs, then rehearse delivery to a controlled target.
version: 0.1.2
audience: [novice-builder, founder, operator]
journey_stage: 3
journey_rank: 70
intro: The same application files can behave differently when their settings, services or saved information change. Name the complete target before asking an agent to run or deliver anything.
related:
  - choosing-your-application-channel
  - deploying-vs-launching
  - directing-your-first-feature
  - how-to-use-contextqb
  - preparing-for-real-users
  - rehearse-backup-and-recovery
  - release-readiness
  - rollback-vs-restore
  - set-up-useful-monitoring
  - where-your-data-lives
tags: [getting-started, deploy]

---

# Where Your App Runs

**Plain language:** “It works on my computer” describes one place and one setup. Before someone else depends on your app, identify which version they will use, which information it will read and who can reach it. Your agent can prepare that setup; you need to understand the target it is changing.

## Name the environment

An **environment** is a particular running setup: application version, settings, storage and connected services. These common names describe its purpose:

- **Local development** — the copy used while making changes, usually on your computer.
- **Test** — a controlled setup for checking behavior with disposable data.
- **Preview or staging** — a place to inspect a candidate version before intended users rely on it.
- **Production** — the setup people actually depend on for their work.

The names alone provide no protection. A preview that uses the production database can change real records. An unlisted web address can still be publicly accessible. Ask the agent to show the actual storage connection and access controls, using names and locations rather than secret values.

A personal desktop tool can have a production installation on your own computer. It does not need a public website to deserve care. [Choosing Your Application Channel](contextqb://guides/choosing-your-application-channel) explains the alternatives.

## Separate files, settings and saved information

A **build** prepares source files into something the target can run. The resulting package or collection of files is a **build artifact**. A **release** identifies the chosen artifact together with the settings needed to run it. The [Twelve-Factor build/release/run distinction](https://12factor.net/build-release-run) explains why those are separate steps for a hosted application.

Configuration means settings: a data location, service address or feature switch. Some settings are secrets that grant access; others are ordinary values. Information included in code sent to a browser or distributed application may be readable by its users. Ask where each secret is used and kept, rather than assuming an environment-variable name makes its value private.

Saved records have their own life. Replacing program files does not necessarily replace or recover the data. Use [Where Your Data Lives](contextqb://guides/where-your-data-lives) to locate it and [Rollback vs. Restore](contextqb://briefings/rollback-vs-restore) to separate recovery choices.

## Reduce differences you do not intend

A test using one storage system may miss behavior specific to the production system. The [Twelve-Factor environment guidance](https://12factor.net/dev-prod-parity) explains the risk of those differences. Match relevant versions and behavior where practical; keep test credentials and data separate. Record remaining differences so passing a rehearsal does not quietly become a claim about an untested target.

For a hosted web app, also identify its **domain**, the readable name in its address; **DNS**, the system that helps locate the service behind that name; and **HTTPS**, which protects the browser's connection to the server. MDN's [web overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) explains that route. A working HTTPS connection does not decide who may read a private record.

## Worked delivery map for the notebook

This is a proposed local-file version of the notebook from [Directing Your First Feature](contextqb://guides/directing-your-first-feature). The names below are illustrative, not existing application paths. It has no accounts, cloud database or outgoing services:

```text
Development: project files; disposable practice-data/notebook.json
Rehearsal: candidate package in rehearsal/app;
           separate rehearsal/data/notebook.json; only the tester
Intended use: accepted package in installed/app;
              owner's separate data/notebook.json; owner only
Identity: source revision + artifact identifier + settings description
Recovery for disposable rehearsal: return to the earlier compatible package.
Later, before real use: separately rehearsed data recovery (Stage 4).
```

Keeping data outside the application package makes its separate ownership visible; verify that an installer or update actually preserves it. Use any made-up notes for this first rehearsal. Later, the two-record file in [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) can supply the data for the Stage 4 recovery exercise; you do not need to complete that lesson before this disposable preview. A browser-only version instead needs the site address and browser profile recorded, because changing those can change which storage is read.

## Rehearse the delivery, then inspect the result

Have the agent propose a bounded procedure for your actual app. It should name the source revision, any uncommitted changes, build command, artifact identifier, destination, settings, test data and cleanup. Confirm the destination before authorizing execution. For a hosted preview, include how access is restricted and how outgoing services stay in test mode.

After delivery, check which artifact is actually running or installed. A repository commit identifies source; the platform's deployment record or the installed package's identity ties that source to the target. If the target cannot identify its version, record that gap and agree a practical way to check it.

Try the promised task there: save a made-up note, close and reopen in the same storage context, and inspect the values. Record the command or manual steps, target and observed result. A successful build alone has not performed that task. Mark it “not run” until someone does.

The output is one short delivery record, reusable by [Release Readiness Audit](contextqb://audits/release-readiness). Explain which target you changed, how you know its version and why the exercise could not touch any real data you already keep. Then use [Deploying vs. Launching](contextqb://briefings/deploying-vs-launching) to decide whether anyone should depend on it yet.
