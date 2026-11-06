---
id: where-your-app-runs
title: Where Your App Runs
summary: Identify the version, settings, data and access in each place your app runs, then rehearse delivery to a controlled target.
version: 0.3.0
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

Take one invented example. A volunteer group runs a rota app: volunteers see which shifts they have and can swap them. The coordinator has asked the agent for a new screen for changing a shift. Before replacing the version volunteers use every week, the coordinator wants to try the new screen with made-up shifts. The test site must not edit the real rota, and it must not message real volunteers. Calling a site “preview” does not make that separation happen. Nothing here is built, and you don't need to build it; the example shows what delivery means in practice.

Describe three things separately for each place the app runs:

- **The application version.** The agent edits source files, and a build turns them into the code that actually runs. That built code is the artifact, identified here by the illustrative release name `rota-0.4`. Its **artifact identifier** is whatever lets you tell exactly which build you have: the release name, the source revision it was built from and, where the platform provides one, its deployment record or a fingerprint of the built files, a short code calculated from their contents that changes if any byte changes.
- **The settings.** These tell that code which storage and services to use. The same `rota-0.4` can read a disposable store or the real rota, depending only on its settings.
- **The saved records.** These are the actual shifts. The preview uses a disposable store containing made-up shifts such as “Test shift A”; the working site uses the real rota store. If the app sends shift reminders, the preview's notification service must use an agreed test arrangement, such as a test inbox, rather than messaging volunteers.

## Worked delivery map for the rota

The map below records that arrangement. The names are illustrative, not existing application paths:

```text
Development:
  artifact: unbuilt source files on the coordinator's computer
  settings: local storage; notifications switched off
  records:  practice shifts in a local disposable store
  audience: the coordinator and agent only
Preview:
  artifact: rota-0.4, built from source revision <recorded>
  settings: preview storage; test notification arrangement
  records:  disposable preview store ("Test shift A", "Test shift B")
  audience: the coordinator only; access restricted
Working:
  artifact: the same rota-0.4 once accepted (currently rota-0.3)
  settings: working storage; real notifications
  records:  the real rota store
  audience: the volunteers
Identity: release name + source revision + deployment record or fingerprint
          + description of settings (names only, never secret values)
Recovery: preview: redeploy the previous artifact; discard test shifts.
          Working: previous artifact for the code; shift records need
          their own rehearsed recovery.
```

Each entry answers a question you can check. Which code? `rota-0.4`, identified by its release name, revision and deployment record. Which settings and records? A separate store for each place, named so you can tell them apart. Who uses it? The coordinator in preview, then the volunteers. Ask the agent to show which version each place is running and which store each setup actually reads, without printing credentials.

In preview, change a test shift and confirm the change survives reopening. Then check that the real rota was not the target, for example by confirming its shifts are unchanged. When the coordinator accepts the release, deploy the identified artifact with the working settings and verify its identity there. The publication described here is an illustration, not an instruction to deploy anything.

The last recovery line is a later, conditional step. Rolling back the code does not bring back shift records. Once people rely on the records, you need to know you can recover them; [Rehearse Backup and Recovery](contextqb://playbooks/rehearse-backup-and-recovery) covers that.

The same three-part description applies even without a public web address. A personal desktop tool has a program version, its settings and the saved work it reads, and replacing the program does not necessarily replace or recover that saved work. A web page that keeps records in the browser's own storage is different again: the records don't travel with the page's files. They live in each person's browser, tied to the site address and browser profile, so record both, because changing either changes which storage is read.

This is why “it works on my computer” is incomplete evidence. You need to know which code, settings and records produced the result.

## Rehearse the delivery, then inspect the result

If you have no app yet, keep this as a checklist for later; nothing in this guide requires building the rota app. When you do have one, have the agent propose a bounded procedure for your actual app. It should name the source revision, any uncommitted changes, build command, artifact identifier, destination, settings, test data and cleanup. Confirm the destination before authorizing execution. For a hosted preview, include how access is restricted and how outgoing services stay in test mode.

After delivery, check which artifact is actually running or installed. A repository commit identifies source; the platform's deployment record or the installed package's identity ties that source to the target. If the target cannot identify its version, record that gap and agree a practical way to check it.

Try your product's main promised task there with made-up data, then check that its result persists. For the rota preview, that means changing a test shift, reopening the app against the same preview store and inspecting the result. For a booking tool, it would mean making a test booking and checking it is still listed after reopening. Record the command or manual steps, target and observed result. A successful build alone has not performed that task. Mark it “not run” until someone does.

The output is one short delivery record, reusable by [Release Readiness Audit](contextqb://audits/release-readiness). Explain which target you changed, how you know its version and why the exercise could not touch any real data you already keep. For your own app, name the code, settings and records for the test setup and for the setup people rely on. Then use [Deploying vs. Launching](contextqb://briefings/deploying-vs-launching) to decide whether anyone should depend on it yet.
