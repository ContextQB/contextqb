-- Migration 0005_add_token_hash.sql
-- Adds nullable membership_token_hash column. Backfill happens out-of-band via
-- apps/mcp/scripts/backfill-token-hashes.ts after this migration applies and
-- after the worker deploys code that writes both columns on register.
-- The plaintext column is dropped by migration 0006 after a one-week observation window.

ALTER TABLE members ADD COLUMN membership_token_hash TEXT;
CREATE UNIQUE INDEX members_membership_token_hash_idx ON members(membership_token_hash);
