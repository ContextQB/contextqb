---
id: authentication-vs-authorization
title: Authentication vs. Authorization
summary: Distinguish proving identity from permission to act on a particular record, and test the boundary your product promises.
version: 0.2.0
audience: [novice-builder, founder, operator]
journey_stage: 2
journey_rank: 50
framing: If someone can sign in, does that mean they may read or change this record?
related:
  [protecting-users-and-their-data, authentication-and-authorization, harden-your-authentication]
tags: [security, authentication]

---

# Authentication vs. Authorization

**Authentication** establishes an identity, such as a signed-in account. **Authorization** decides whether that identity may perform an action on a particular resource. You need the second decision even when a trusted provider handles the first.

## A signed-in person can still be the wrong person

Start with a tool that has no accounts. Maya, a fictional first-time founder, keeps notes from conversations with bakery owners in a small personal research notebook on her own computer while she decides what her business should solve. Only she uses it. Signing in to her computer is the only identity check, and there are no other users' records for the notebook to keep apart.

Now imagine an illustrative later version, not something you need to build. The notebook becomes a hosted service, and several founders each use it for their own research. Their entries now sit together in one storage system on a server. That shared storage is why this example needs a second version: when different people's records live in the same place, the application itself must decide whose records each request may touch. [Protecting Users and Their Data](contextqb://guides/protecting-users-and-their-data) compares the two versions more fully.

Alice and Bob are two founders using that hosted version, each with private notes. Bob is a legitimate user, but that does not give him permission to read Alice's note.

Hiding Alice's note from Bob's screen is useful presentation. The trusted part of the system handling a read, change or deletion must also enforce permission. A server should not accept a claimed owner from an editable browser field as proof of identity. OWASP's [authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) recommends checking permissions on every request and applying enforcement in the right location.

## Check one boundary deliberately

On an explicitly authorized local or staging target, use synthetic accounts and records. Agree the rule first: Alice can read and change Alice's note; Bob cannot. Then ask the agent to check the allowed action and the denied action through the actual protected entry point, not just by looking for a hidden button. Confirm that a denied write leaves the record unchanged. Also check the relevant unauthenticated case, where there is no signed-in identity.

For team records, membership and role may change the rule. Write that rule before the test instead of assuming every record belongs to exactly one person. These few cases are a teaching example, not complete security coverage.

## Accounts are conditional; boundaries are not

A personal local tool may rely on the device's access controls instead of its own accounts. A public read-only page can intentionally allow anonymous reads. Name what is allowed and why. Adding a sign-in form to either product is not automatically the right protection.

Use [Harden Your Authentication](contextqb://playbooks/harden-your-authentication) for identity setup and the [Authentication & Authorization Audit](contextqb://audits/authentication-and-authorization) for the applicable verification procedure. Before continuing, explain what successful sign-in proves, and what additional check prevents the wrong account from changing a record.
