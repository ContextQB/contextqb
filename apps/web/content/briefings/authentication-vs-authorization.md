---
id: authentication-vs-authorization
title: Authentication vs. Authorization
summary: Distinguish proving identity from permission to act on a particular record, and test the boundary your product promises.
version: 0.3.0
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

Imagine a design studio that lets its customers sign in to download their invoices. Alice and Bob are both customers. Each should see only the invoices for their own work. The example is invented and you don't need to build it, but it separates two questions that a sign-in screen can make look like one.

Bob signs in successfully. The application now knows that this request comes from Bob's account. That is authentication. Bob then requests an invoice that belongs to Alice, perhaps by editing the invoice number in the page address. Before returning it, the application must check whether Bob may read that particular invoice. That is authorization. The correct answer is “no,” even though Bob's sign-in was entirely valid.

Removing Alice's invoice from Bob's menu helps him navigate, but it does not enforce the rule: a changed link can bypass what the screen hides. The trusted part of the system serving the invoice, or handling any change or deletion, must check the requesting account's permission. A server should not accept a claimed owner from an editable browser field as proof of identity. OWASP's [authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) recommends checking permissions on every request and applying enforcement in the right location.

## Check one boundary deliberately

On an explicitly authorized local or staging target, use synthetic accounts and records. Agree the rule first, stating both the permitted and the forbidden action: Alice may read her invoice; Bob may not. In this studio, customers can only read invoices; none of them may change one. Then ask the agent to check the allowed action and the denied action through the actual protected request path, using test accounts, not just by looking for a hidden button. Confirm that a denied attempt to change or delete an invoice leaves it unchanged. Also check the relevant unauthenticated case, where there is no signed-in identity at all. You are checking the rule about the information, not just whether the login page works.

For team records, membership and role may change the rule. Write that rule before the test instead of assuming every record belongs to exactly one person. These few cases are a teaching example, not complete security coverage.

## Accounts are conditional; boundaries are not

A personal local tool may rely on the device's access controls instead of its own accounts. A public read-only page can intentionally allow anonymous reads. Name what is allowed and why. Adding a sign-in form to either product is not automatically the right protection.

Use [Harden Your Authentication](contextqb://playbooks/harden-your-authentication) for identity setup and the [Authentication & Authorization Audit](contextqb://audits/authentication-and-authorization) for the applicable verification procedure. Before continuing, explain what successful sign-in proves, and what additional check prevents the wrong account from changing a record.
