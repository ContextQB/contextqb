-- Migration 0003_normalize_event_ts.sql
-- Backfill ISO8601 TEXT ts values to INTEGER unix epoch.
-- Re-check row counts before applying if cli_events + mcp_events > ~1M rows.

UPDATE cli_events
SET ts = CAST(unixepoch(ts) AS INTEGER)
WHERE typeof(ts) = 'text';

UPDATE mcp_events
SET ts = CAST(unixepoch(ts) AS INTEGER)
WHERE typeof(ts) = 'text';
