---
id: setting-up-git-and-github
title: Setting Up Git and GitHub
summary: Git is the time machine that makes agentic coding safe. Without it, every agent session is a roll of the dice. This guide walks first-time builders through installing git, choosing a remote, and using both day-to-day with an AI coding agent.
version: 0.1.0
audience:
  - novice-builder
  - founder
  - operator
journey_stage: 0
intro: |
  An AI agent will delete your work at some point. Not maliciously — agents are confident and helpful, which is exactly the combination that overwrites your good code with their new code. Git is the safety net that lets you undo that. This guide shows you how to set it up, what services to use, and how to make committing a reflex.
tags:
  - git
  - github
  - version-control
  - getting-started
related:
  - the-mental-model-of-your-app
  - documentation-as-architecture
  - machine-verifiable-substrate
  - state-ownership
next_steps:
  - Install git on your machine.
  - Pick a remote (GitHub, GitLab, Codeberg, or self-hosted Forgejo).
  - Create your first repo and make your first commit.
  - Adopt the commit-before-and-after-the-agent rhythm.
---

# Setting Up Git and GitHub

**Plain language:** Git is an "undo" button for your whole project. It also keeps a record of every change so you can see what happened and when. GitHub (and a handful of alternatives) is where you store a copy of that record online so you don't lose it, and so other people — or other agents — can read it. If you're building with an AI coding agent, you need both. This guide shows you how to set them up.

## You're in the right place

If you've never used git before — you are exactly the audience for this. Git looks intimidating from the outside. It has a lot of commands, a lot of jargon, and the internet is full of horror stories about people losing weeks of work to a wrong button-press. Most of that fear is overblown.

The reality: you'll use about five commands ninety-five percent of the time. The rest is recovery from situations you'll mostly avoid if you commit often and don't force things you don't understand. Git is not a hazing ritual. It's a safety net.

You don't need to learn git like a developer. You need to learn the seven or eight things that keep your work safe while an agent is in the room with you. That's what this guide teaches.

## Why agentic coding needs git

Here is what you have to understand before anything else. An AI agent does not work the way a human collaborator works. A human collaborator might pause, ask a question, or refuse to do something they don't understand. An agent will not. An agent will:

- **Rewrite a working file from scratch** because it believes the new version is cleaner.
- **Delete a function** it thinks is unused, when actually it's the function that ties the app together.
- **Refactor across twelve files** in a single response and never tell you which ones it touched.
- **Confidently break a feature** while fixing a different feature.
- **Lose track of where it was** mid-task and overwrite half-finished work with a different half-finished work.

These are not edge cases. They happen to every builder who works with agents, including expert developers. The Vibe Code Bible calls one of the most important commandments _"Refactor With Duplicates, Not Overwrites"_ — for exactly this reason.

Git turns the inevitable mistake into a non-event. Before letting an agent loose on a file, you commit. The agent makes a mess. You type one command. You're back where you started, with nothing lost. Without git, the same mistake costs you a day of work and your sanity.

There is a saying in the ebook this whole methodology grew out of:

> Commit early and often. Git discipline becomes creative discipline.

That's the entire pitch. Git is not paperwork. It's the thing that lets you take real risks with the agent — because you can always reset.

## What git actually is

Git is a program that runs on your computer. It watches a folder. Every time you say "save a snapshot," git remembers exactly what every file looked like at that moment. Each snapshot is called a **commit**.

A repository (or **repo**) is just a folder that git is watching. Inside that folder, git keeps a hidden directory called `.git/` that holds the entire history. The rest of the folder is your code, your docs, your everything — exactly as you see it in your editor.

The mental model:

| Concept      | What it actually is                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| Repo         | A folder git is watching.                                                                                     |
| Commit       | A named snapshot of every file in the repo, with a short message describing what changed.                     |
| Branch       | A parallel timeline. You can experiment on a branch without affecting the main one.                           |
| Remote       | A copy of the repo that lives somewhere else (usually a service on the internet).                             |
| Push         | Send your commits to the remote.                                                                              |
| Pull         | Bring down commits the remote has that you don't.                                                             |
| Clone        | Download a remote repo to your machine for the first time.                                                    |
| `.gitignore` | A file that lists patterns git should ignore (logs, secrets, build outputs, anything you don't want tracked). |

That vocabulary is the whole thing. Everything else is variations on those.

## What GitHub is (and what its alternatives are)

GitHub is a website. You can think of it as Dropbox for git repos, plus a layer of social and collaboration tools on top — pull requests, issues, discussions, releases. It's owned by Microsoft and is the most common place to host a repo. If you don't know which service to use, use GitHub.

But it's not the only choice. A few alternatives, in rough order of how often you'll see them:

- **GitHub** — `github.com`. Owned by Microsoft. Free for public _and_ private repos, with generous limits. Default choice. Best agentic ecosystem (Copilot, Codespaces, Actions). Recommended unless you have a specific reason otherwise.
- **GitLab** — `gitlab.com`. Free tier comparable to GitHub. Strong CI/CD. Also offers a self-hosted version. Used a lot in companies that want everything in one platform.
- **Bitbucket** — `bitbucket.org`. Atlassian's offering. Integrates tightly with Jira. Less common for solo builders.
- **Codeberg** — `codeberg.org`. Community-run, non-profit, hosts open-source projects for free. Built on Forgejo.
- **Forgejo (self-hosted)** — `forgejo.org`. A community fork of Gitea. This is what people mean when they talk about "running their own GitHub" on a home server or a cheap VPS. Lightweight, easy to install, no vendor lock-in. Probably the alternative you were trying to remember.
- **Gitea (self-hosted)** — `gitea.com`. The original self-hosted option that Forgejo forked from. Still actively maintained.
- **Local-only** — git works fine without any remote at all. Your history lives in `.git/`. But your laptop is one spilled coffee away from being your only copy. Not recommended.

For a first-time builder, the call is simple: **start with GitHub**. You can always migrate later. The rest of this guide uses GitHub in examples, but every step works on the others — the commands are identical; only the URLs change.

## Get set up

This section is the practical part. Estimated time: 15–30 minutes.

### Step 1 — Install git

**On macOS:**

```bash
# If you have Homebrew (recommended)
brew install git

# Otherwise, install Xcode Command Line Tools
xcode-select --install
```

**On Windows:** Download the installer from [git-scm.com/download/win](https://git-scm.com/download/win). Accept the defaults; the installer is sensible.

**On Linux:** Use your package manager — `sudo apt install git` (Debian/Ubuntu), `sudo dnf install git` (Fedora), etc.

Verify the install:

```bash
git --version
```

You should see something like `git version 2.45.0` (or newer).

### Step 2 — Tell git who you are

Every commit is signed with a name and email. Set these once, globally:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Use the same email you'll use on GitHub. (You don't have to expose your real email publicly — GitHub gives you a `<id>+<username>@users.noreply.github.com` address you can use here for privacy.)

While you're at it, set your default branch name to `main`:

```bash
git config --global init.defaultBranch main
```

(Many repos still default to `master`. `main` is the modern convention.)

### Step 3 — Create a GitHub account

Go to [github.com](https://github.com) and sign up. The free tier is plenty for everything in this guide.

Enable two-factor authentication on your account immediately. Use an authenticator app (1Password, Google Authenticator, Authy) — not SMS. This is non-negotiable. Your GitHub account holds your code; treat it like a bank account.

### Step 4 — Set up SSH keys (recommended)

SSH keys let your machine prove its identity to GitHub without typing a password every time. Set them up once and you're done forever.

Generate a key:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

Accept the default file location. Set a passphrase if you want extra security (you'll be prompted for it occasionally).

Copy the public key to your clipboard:

```bash
# macOS
pbcopy < ~/.ssh/id_ed25519.pub

# Linux
cat ~/.ssh/id_ed25519.pub
# Then copy the output manually

# Windows (PowerShell)
Get-Content ~\.ssh\id_ed25519.pub | clip
```

In GitHub, click your avatar → Settings → SSH and GPG keys → "New SSH key." Paste the key, give it a name like "MacBook Pro 2024," save.

Test it:

```bash
ssh -T git@github.com
```

You should see something like `Hi <your-username>! You've successfully authenticated...`

(You can skip SSH and use HTTPS + Personal Access Tokens instead, but SSH is less painful long-term. If you do choose HTTPS, GitHub has clear docs on PATs.)

### Step 5 — Create your first repo

Two paths. Pick one based on where you are right now.

**Path A — You already have a project folder on your machine.**

```bash
cd /path/to/your/project
git init
git add .
git commit -m "Initial commit"
```

Then create an empty repo on GitHub (click "+ New repository," give it a name, don't initialise it with anything), and connect them:

```bash
git remote add origin git@github.com:your-username/your-repo.git
git branch -M main
git push -u origin main
```

**Path B — You want to start fresh.**

Create the repo on GitHub first (with a README and a `.gitignore` template — Node, Python, whatever you're using). Then clone it to your machine:

```bash
git clone git@github.com:your-username/your-repo.git
cd your-repo
```

That's it. You have a repo. Local and remote are linked. You're ready to commit.

## The five commands you'll use 95% of the time

You can get extremely far in agentic coding with just these:

```bash
git status                      # What's changed? What's staged? What branch am I on?
git add .                       # Stage every change in the current folder for commit
git commit -m "message here"    # Save a snapshot with a description
git push                        # Send your commits to GitHub
git pull                        # Fetch and merge any commits the remote has
```

The flow is always: **change files → status → add → commit → push**. That sequence becomes muscle memory in about a day.

A sixth command worth knowing — the panic button:

```bash
git reset --hard HEAD           # Undo every uncommitted change in the working folder
```

That single line undoes everything the agent has done since your last commit. It is the reason you commit before letting the agent run.

## The agentic coding workflow

This is the rhythm that makes git earn its keep when you're working with an agent. Memorise this pattern; everything else is detail.

1. **Commit before you give the agent a task.** Even if the task is small. The commit is your save point.
2. **Let the agent do the work.** Watch what it does, but don't fight every detail.
3. **Read the diff.** Use your editor's git pane or `git diff` to see exactly what changed. Don't trust the agent's summary of what it did; look at the actual changes.
4. **Either commit or reset.**
   - If it looks good: `git add .` then `git commit -m "describe what shipped"`. New save point.
   - If it broke something or went off the rails: `git reset --hard HEAD` and try again with a clearer prompt.
5. **Push when you've got something stable.** `git push`. Now it exists somewhere other than your laptop.

That's the loop. It feels slow at first. Within a week it's invisible.

A few refinements:

- **For risky changes, use a branch.** More on this below.
- **For experimental ideas, also use a branch.** You can always throw the branch away.
- **For sessions that span multiple commits, push at the end.** No reason to push after every tiny commit unless you're collaborating.
- **Don't commit broken code to `main` if other people are working on the repo.** Use a branch.

## Branches: the safety valve for big changes

The Vibe Code Bible calls one of its commandments _"Refactor With Duplicates, Not Overwrites"_ — duplicate the file before refactoring it, so the original is preserved. In git, you don't duplicate files. You duplicate _the whole project_, for free, with a branch.

A branch is a parallel timeline. You make a branch, you mess around on it, the agent rewrites half the app, and your `main` branch is completely untouched the whole time. If the experiment works, you merge the branch back. If it doesn't, you delete the branch and forget it ever existed.

The minimum branching workflow:

```bash
git checkout -b experiment-name    # Create and switch to a new branch
# ... make changes, commit, repeat ...
git push -u origin experiment-name # Push the branch to GitHub (optional)
git checkout main                  # Go back to the main timeline (your changes are safe)
git merge experiment-name          # If you want to keep the work, merge it in
git branch -d experiment-name      # Delete the branch when done
```

When to use a branch:

- "Refactor this whole module."
- "Switch the auth library."
- "Try a completely different layout."
- Any prompt that contains the words "rewrite," "restructure," or "redesign."
- Any time the agent says "I'm going to make a lot of changes."

## Things to never commit

The single most expensive git mistake a first-time builder makes is committing a secret. Once a secret is in git history, it's there forever — even if you delete the file in a later commit. Anyone who clones the repo (or anyone scraping public repos for leaked keys, which they do constantly) has it.

**Never commit:**

- `.env`, `.env.local`, `.env.production`, or any file containing API keys, passwords, tokens.
- Database dumps with real user data.
- Private keys (`*.pem`, `*.key`, `id_rsa`, etc.).
- Anything in a `secrets/` folder.
- Large binary files (videos, datasets, gigabyte-scale assets) — git is bad at those; use external storage.
- `node_modules/`, `dist/`, `build/`, `__pycache__/` and other generated files.

The way you prevent this is a `.gitignore` file at the root of your repo. A reasonable starting point for a TypeScript/Node project:

```
# Dependencies
node_modules/

# Build outputs
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.*.local

# OS / Editor
.DS_Store
*.swp
.vscode/
.idea/

# Logs
*.log
npm-debug.log*
```

When you create a new repo on GitHub, GitHub will offer to add a `.gitignore` template for your language. Accept it. It's better than starting blank.

If you do accidentally commit a secret: **rotate the secret immediately** (in whichever service issued it), then worry about cleaning the git history. The secret being _out_ matters more than the git mess. See the [Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise) playbook for the incident response.

## Tooling that makes this easier

You don't have to do everything in the terminal. A few options:

- **Your editor's built-in git pane.** Cursor, VS Code, and Zed all have a git tab that shows the diff, lets you stage and commit, and handles branches. For 90% of daily work, this is enough.
- **GitHub Desktop** — a free GUI from GitHub. Polished, friendly, opinionated. A good fit for someone uncomfortable with the terminal.
- **`gh` CLI** — GitHub's official command-line tool. Lets you create repos, open PRs, view issues without leaving the terminal. Install with `brew install gh` (macOS) or from [cli.github.com](https://cli.github.com).
- **`lazygit`** — terminal UI for git that's much friendlier than raw commands. Niche but loved by people who try it.

Use whatever feels least painful. The discipline matters more than the tool.

## Common first-time mistakes

- **Not committing often enough.** Aim for "every time you'd be sad to lose the last bit of work." That's usually every 15–30 minutes when you're actively building, not once a day.
- **Committing without a message** (`git commit -m ""` or `-m "stuff"`). Future you will not know what "stuff" was. Be specific: `"add user list endpoint"`, `"fix verse-tag join query"`.
- **Force-pushing to a shared branch.** `git push --force` overwrites the remote history. If anyone else (or any deployed system) was using that history, it's gone. Don't force-push to `main` ever, and only force-push your own branches when you understand what you're doing.
- **Not pulling before pushing.** If the remote has changes you don't, your push will fail. Pull, then push.
- **Panicking on a merge conflict.** Conflicts are normal. Your editor will mark the conflicting sections. Pick what you want, save, commit. Ask the agent if you're not sure — agents are good at resolving conflicts when you show them the conflict markers.
- **Committing secrets** (see above). The worst one. Always check `git status` before `git commit -a` to see what you're about to commit.

## What "good enough" looks like at this stage

You have set up git correctly enough if:

- [ ] `git --version` works in your terminal.
- [ ] Your name and email are configured (`git config --global --list` shows them).
- [ ] You have a GitHub account with 2FA on.
- [ ] Your machine can talk to GitHub (you tested `ssh -T git@github.com` or pushed once with HTTPS).
- [ ] Your project is a repo (`git status` works inside it and doesn't say "not a git repository").
- [ ] You have a remote configured (`git remote -v` shows a GitHub URL).
- [ ] Your repo has a `.gitignore` that excludes `.env` files at minimum.
- [ ] You've made at least three commits and pushed at least once.
- [ ] You know the panic button: `git reset --hard HEAD`.

If those are all true, you have everything you need. Everything else — branching strategies, pull requests, rebasing, hooks, CI — is a question for when you actually need it. Don't pre-learn.

## When you're ready for more

Once the basics feel natural, the next things worth learning, roughly in order:

1. **Pull requests** — the GitHub workflow for proposing changes. Useful even when you're solo, as a structured review step before merging.
2. **`git log` and `git diff` flags** — searching history and viewing changes in different ways.
3. **`git stash`** — temporarily set aside uncommitted changes so you can switch branches.
4. **`.gitattributes`** — for projects with binary files or specific line-ending requirements.
5. **GitHub Actions / GitLab CI** — automate tests, linting, deployments on every push.
6. **Git worktrees** — work on multiple branches simultaneously in separate folders. Very useful for parallel agent attempts.

You don't need any of these on day one. You'll know when you need them because something will be annoying enough that you'll ask "isn't there a better way?" — and the answer will be on the list above.

## See also

- [Guide: The Mental Model of Your App](contextqb://guides/the-mental-model-of-your-app) — the thinking step that comes before any of this.
- [Playbook: Prepare a New Repo for AI-Assisted Development](contextqb://playbooks/new-project-foundation) — what to do _inside_ the repo once git is set up.
- [Playbook: Write a context.qb for Your Repository](contextqb://playbooks/write-a-context-qb) — the boot manifest that lives in the repo.
- [Playbook: Write an Architectural Decision Record](contextqb://playbooks/write-an-adr) — commits capture _what_; ADRs capture _why_.
- [Playbook: Respond to a Suspected Compromise](contextqb://playbooks/respond-to-a-suspected-compromise) — if a secret slips into git, this is the response.
- [Principle: Documentation as Architecture](contextqb://principles/documentation-as-architecture) — git history is documentation; treat it that way.
- [Principle: Machine-Verifiable Substrate](contextqb://principles/machine-verifiable-substrate) — git is the most basic verifier you have.
- [GitHub Docs: Quickstart](https://docs.github.com/en/get-started/quickstart) — the official version of step 1.
- [Pro Git book](https://git-scm.com/book/en/v2) — free, comprehensive, the canonical reference for when you need to go deeper.
