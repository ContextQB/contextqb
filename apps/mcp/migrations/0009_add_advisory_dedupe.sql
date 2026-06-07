-- Migration 0009: Add member_advisory_seen table for upgrade-advisory dedupe
-- ADR-0036: MCP CLI-freshness advisory deduplication
-- INV-CLI-UPD-2: Advisory fires at most once per member per 24h window

CREATE TABLE IF NOT EXISTS member_advisory_seen (
  anonymous_id TEXT PRIMARY KEY,
  last_emitted_at INTEGER NOT NULL
);
