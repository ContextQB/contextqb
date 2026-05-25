-- Migration 0001 — initial telemetry schema
-- Tranche A of docs/punchlists/0018-data-cooperative.md v0.4
-- Owner: apps/mcp Worker (binding env.DB)

CREATE TABLE members (
  anonymous_id     TEXT PRIMARY KEY,
  membership_token TEXT NOT NULL UNIQUE,
  opted_in_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  revoked_at       INTEGER
);

CREATE TABLE cli_events (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  anonymous_id             TEXT NOT NULL,
  ts                       INTEGER NOT NULL DEFAULT (unixepoch()),
  payload_json             TEXT NOT NULL,
  payload_schema_version   INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX cli_events_anonymous_id_idx ON cli_events(anonymous_id);

CREATE TABLE mcp_events (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  anonymous_id             TEXT NOT NULL,
  ts                       INTEGER NOT NULL DEFAULT (unixepoch()),
  tool_name                TEXT NOT NULL,
  response_time_ms         INTEGER,
  country_code             TEXT,
  client_hint              TEXT,
  payload_schema_version   INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX mcp_events_anonymous_id_idx ON mcp_events(anonymous_id);
