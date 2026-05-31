---
id: where-your-data-lives
title: Where Your Data Lives
summary: "Data is not abstract. It lives somewhere: in a file, in a browser, in a local database, in cloud storage, or in a managed database someone else operates."
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 1
journey_rank: 0
intro: |
  Before you choose a database, ask a simpler question: who needs this information, from which device, and how bad is it if the wrong person sees it or it disappears? This guide gives novice builders a practical map of where application data can live.
tags:
  - data
  - storage
  - getting-started
related:
  - building-for-yourself-vs-others
  - what-an-application-is
  - state-ownership
  - trust-boundaries-are-architecture
next_steps:
  - List the important information your app needs to remember.
  - Mark each item as just-me, trusted-group, or public.
  - Decide which information can live locally and which needs shared storage.
  - Do not pick a database vendor until you know who needs access and from where.
---

# Where Your Data Lives

**Plain language:** Data is the information your application remembers. It might live in a file on your laptop, inside the browser, in a small local database, in cloud storage, or in a managed database.

The beginner mistake is to ask, "Which database should I use?" too early.

The better first question is:

> Who needs this information, from which device, and what happens if it is lost or exposed?

That question tells you more than a database comparison chart.

## Data is remembered information

An application can do work without remembering anything. A calculator can take two numbers and return an answer. If you close it, nothing important disappears.

Most useful applications remember something:

- A note you wrote.
- A user profile.
- A payment record.
- A file upload.
- A Bible verse annotation.
- A transcript.
- A translation.
- A setting.
- A list of people allowed into a workspace.

Once the app remembers something, that information has to live somewhere.

"Somewhere" is not a metaphor. It is a real place: your laptop's disk, a phone, a browser storage area, a database server, an object storage bucket, or a service operated by another company.

The place matters because it changes who can access the data, who can lose it, who can back it up, and who is responsible when something goes wrong.

## The audience tier decides the storage pressure

Use the three tiers from the previous guide:

1. **Just me.**
2. **Trusted group.**
3. **Public.**

Each tier puts different pressure on the data.

For a just-me app, data can often live on your machine. You can inspect it. You can back it up manually. If something breaks, you are the only person blocked.

For a trusted-group app, data usually needs to be shared. More than one person may read or change it. Now the app needs identity, permissions, and a reliable source of truth.

For a public app, data has to be treated as a trust boundary. You may be storing information from strangers. You need stronger controls, backups, auditability, and a clear privacy posture.

That does not mean every public app needs the most complicated database on day one. It means public data is not casual.

## Files on disk

The simplest storage is a file.

Examples:

- A `.txt` file.
- A `.csv` spreadsheet export.
- A `.json` file.
- A folder of images or transcripts.
- A generated XML file for another application to import.

Files are excellent for just-me tools. A video transcription utility can produce a subtitle file, an accounting helper can produce a categorized CSV, and a cleanup script can produce a renamed folder of files. The output goes where the user needs it, often into another tool they already use.

Files are easy to inspect. You can open them. You can copy them. You can attach them to an email. You can put them in a folder.

Files become harder when other people need access. If two people edit the same file, whose version wins? If the file lives on your laptop, how does another person get it? If the file contains private information, who else can read it?

Good fit:

- Just-me tools.
- Imports and exports.
- Repeatable local workflows.
- Small datasets the operator can understand directly.

Poor fit:

- Many people editing at once.
- Public user accounts.
- Sensitive shared records.
- Anything that needs precise permissions.

## Browser storage

Web applications can store small pieces of data in the browser.

That can be useful for preferences, temporary drafts, recently viewed items, or local-only state. The data is close to the user and does not require a server round trip.

But browser storage is not the same as durable application truth.

It usually belongs to one browser on one device. If the user changes devices, clears browser data, or uses private browsing, it may disappear. It also does not naturally solve sharing.

Good fit:

- Theme preference.
- Temporary form drafts.
- Local UI settings.
- Data that can be recreated or resynced.

Poor fit:

- The only copy of important work.
- Shared group records.
- Payment history.
- Anything the user expects to survive across devices without explanation.

## Local databases

A local database stores structured data on one device.

Examples include SQLite in a desktop app, SQLite in a mobile app, or IndexedDB in a browser. You do not need to know the details yet. The important point is that a local database is more organized than a pile of files, but still close to one user or one device.

Local databases are useful when the app needs to remember many related things but does not need real-time sharing with other users.

Good fit:

- A personal notes app.
- A desktop utility.
- Offline-first work.
- A single-user app with more structure than files can comfortably hold.

Poor fit:

- Multiple people editing the same records.
- Public account systems.
- Admin dashboards for a team.
- Data that must be available instantly from any device unless sync is carefully designed.

The hidden word here is **sync**. Once local data has to move between devices or users, you are no longer just choosing storage. You are designing a synchronization system.

That is advanced. Do not stumble into it by accident.

## Managed cloud databases

A managed cloud database is usually what people mean when they say "the app has a database."

The database runs on someone else's infrastructure. Your application connects to it. Users can access the same source of truth from different devices. The service handles much of the hard operational work, but you still have to design the data model, permissions, and access paths correctly.

This is often the right category when:

- A trusted group needs shared data.
- Public users need accounts.
- More than one device needs the same current information.
- The app needs server-side rules about who can read or change what.

Managed databases are powerful, but they are not magic. If the app gives the wrong user access to the wrong row, that is still your design problem. If you copy data into client state and let it drift, that is still your architecture problem.

Good fit:

- Shared workspaces.
- Public user accounts.
- Team dashboards.
- Durable records with permissions.

Poor fit:

- A tiny personal utility where a file would do.
- One-off generated outputs.
- Data you do not actually need to remember.

## Object storage

Some data is too large or too file-like to belong in a database row.

Examples:

- Videos.
- Audio files.
- PDFs.
- Images.
- Zip archives.
- Large exports.

These often live in object storage. Think of it as durable cloud file storage that your application can control. The database may store the record: title, owner, upload date, permission, status. The object storage holds the actual file.

Good fit:

- User uploads.
- Course videos.
- Transcription audio.
- Generated downloads.

Poor fit:

- Small structured records you need to query often.
- Permissions logic by itself. The app still needs a database or server rules to decide who can access the object.

## Privacy starts with location

Privacy is not only about legal language. It starts with where the data lives and who can read it.

Ask these questions early:

- Is this data only on my machine?
- Is it stored by a third-party service?
- Can an administrator read it?
- Can another user read it?
- Can the app recover it if the user loses a device?
- Should this data ever leave the user's device?
- Does the user know where it is being stored?

For a just-me tool, these questions may be simple. For a trusted group, they become design decisions. For a public product, they become part of the trust contract.

If you collect user data, you have a responsibility to know where it goes.

## How to brief an agent about data

Do not tell the agent only, "Add a database."

Give it the data shape and the audience tier.

For example:

```text
This is a trusted-group app. It needs to remember projects, notes, and members.
Multiple people in the same workspace can read the same project.
Only the note author and workspace admins can edit a note.
The data should live in shared server storage, not only in the browser.
```

That is much better than naming a vendor first.

It tells the agent:

- What the important records are.
- Who can see them.
- Who can change them.
- Whether local storage is enough.
- Whether permissions matter.

Technology choices come after those answers.

## What good enough looks like

Before you choose a database vendor, write a small data map:

| Information       | Who needs it?           | Where can it live first?         | What is the risk?                                                   |
| ----------------- | ----------------------- | -------------------------------- | ------------------------------------------------------------------- |
| Transcript export | Just me                 | File on disk                     | Losing the file means rerunning the job                             |
| Team notes        | Trusted group           | Managed database                 | Wrong user could see private notes                                  |
| Public profile    | Public                  | Managed database                 | Strangers can view it, so the public/private boundary must be clear |
| Uploaded video    | Trusted group or public | Object storage + database record | Large file plus access control                                      |

You do not have to get this perfect. You do have to make it explicit.

The place where data lives is an architectural decision. Make it visible before the agent starts building around a guess.

## See also

- [Guide: Building for Yourself vs. Building for Others](contextqb://guides/building-for-yourself-vs-others) - the audience tiers that shape storage pressure.
- [Guide: What an Application Is](contextqb://guides/what-an-application-is) - the basic model of files, runtimes, and information flow.
- [Principle: State Ownership](contextqb://principles/state-ownership) - why every piece of state needs one owner.
- [Principle: Trust Boundaries Are Architecture](contextqb://principles/trust-boundaries-are-architecture) - why data access is a structural concern.
