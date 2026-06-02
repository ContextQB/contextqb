-- Migration 0006_drop_plaintext_token.sql
-- DO NOT APPLY until one week after 0005 + worker deploy + backfill script complete.
-- Pre-flight check: `SELECT COUNT(*) FROM members WHERE membership_token_hash IS NULL`
-- must return 0 before this migration runs.

CREATE TABLE members_new (
  anonymous_id           TEXT PRIMARY KEY,
  membership_token_hash  TEXT NOT NULL UNIQUE,
  opted_in_at            INTEGER NOT NULL DEFAULT (unixepoch()),
  revoked_at             INTEGER
);

INSERT INTO members_new (anonymous_id, membership_token_hash, opted_in_at, revoked_at)
SELECT anonymous_id, membership_token_hash, opted_in_at, revoked_at FROM members;

DROP TABLE members;
ALTER TABLE members_new RENAME TO members;
