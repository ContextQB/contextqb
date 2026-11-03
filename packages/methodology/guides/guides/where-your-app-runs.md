---
id: where-your-app-runs
title: Where Your App Runs
summary: Identify the version, settings, data and access in each place your app runs, then rehearse delivery to a controlled target.
version: 0.2.0
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

## What delivering one small app involves

Take one invented example. Maya is a fictional first-time founder deciding which problem her business should solve for small independent bakeries. She wants a small personal research notebook on her own computer. In it she saves which conversation she learned from and her note about it, so she can find that evidence when she decides. Its first feature is described in [Directing Your First Feature](contextqb://guides/directing-your-first-feature). Nothing here is built, and you don't need to build it; the example shows what delivery means in practice.

Suppose the agent builds the notebook as a small program that runs on Maya's computer and keeps her entries in one file. It has no accounts, cloud database or outgoing services. Delivering it then involves three concrete things:

- **The program.** The agent edits the project's source files. A build turns them into a self-contained package that runs without the development setup: for example, a folder or archive named `notebook-0.1.0`. That package is the build artifact. Its **artifact identifier** is whatever lets you tell exactly which package you have. Here, that could be the version `0.1.0` the program reports when asked, plus the source revision it was built from. Where you can, add a fingerprint of the archive file, a short code your computer calculates from the file's contents that changes if any byte changes.
- **The data.** The file of saved entries is kept outside the package, so replacing the program does not replace or erase the entries.
- **Who runs what, where.** In a rehearsal, the agent (or Maya, following its steps) copies the candidate package into a separate rehearsal folder and runs it against a disposable data file of made-up entries. Only the tester uses it. When Maya accepts that package, the same package is copied to the folder she actually uses and pointed at her own, separate data file. Running the program and asking for its version in each place shows whether both are the same build.

## Worked delivery map for the notebook

The map below records that arrangement. The names are illustrative, not existing application paths:

```text
Development: project source files; disposable practice-data/notebook.json
Rehearsal: candidate package notebook-0.1.0 copied to rehearsal/app;
           separate rehearsal/data/notebook.json of made-up entries; tester only
Intended use: the accepted package (same notebook-0.1.0) copied to installed/app;
              Maya's separate data/notebook.json; Maya only
Identity: source revision + package version and fingerprint + settings description
Recovery for disposable rehearsal: return to the earlier compatible package.
Later, before Maya relies on it for real notes: separately rehearsed data recovery.
```

Each line answers a question you can check. Which program? The package, identified by its version and fingerprint. Which data? A separate file for each place. Who uses it? The tester in rehearsal, then Maya. Keeping data outside the application package makes its separate ownership visible; verify that an installer or update actually preserves it. Use any made-up entries for this first rehearsal.

The last line is a later, conditional step. Once the notebook holds entries Maya would be harmed to lose, she needs to know she can recover them, not only roll back the program. [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) covers that, with a ready two-record practice file. You do not need it before this disposable rehearsal.

The same notebook could instead be a web page that keeps entries in the browser's own storage. Delivering that version means publishing the page's files to a web address. The entries don't travel with those files: they live in each person's browser, tied to the site address and browser profile. Record both, because changing either changes which storage is read. Replacing the page files neither replaces nor recovers the entries.

## Rehearse the delivery, then inspect the result

If you have no app yet, keep this as a checklist for later; nothing in this guide requires building the notebook. When you do have one, have the agent propose a bounded procedure for your actual app. It should name the source revision, any uncommitted changes, build command, artifact identifier, destination, settings, test data and cleanup. Confirm the destination before authorizing execution. For a hosted preview, include how access is restricted and how outgoing services stay in test mode.

After delivery, check which artifact is actually running or installed. A repository commit identifies source; the platform's deployment record or the installed package's identity ties that source to the target. If the target cannot identify its version, record that gap and agree a practical way to check it.

Try your product's main promised task there with made-up data, then check that its result persists. For Maya's notebook, that means saving an entry, closing and reopening in the same storage context, and inspecting the values. For a booking tool, it would mean making a test booking and checking it is still listed after reopening. Record the command or manual steps, target and observed result. A successful build alone has not performed that task. Mark it “not run” until someone does.

The output is one short delivery record, reusable by [Release Readiness Audit](contextqb://audits/release-readiness). Explain which target you changed, how you know its version and why the exercise could not touch any real data you already keep. Then use [Deploying vs. Launching](contextqb://briefings/deploying-vs-launching) to decide whether anyone should depend on it yet.
