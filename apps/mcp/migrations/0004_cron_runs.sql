-- Migration 0004_cron_runs.sql
-- Persistent record of aggregation cron runs for observability.

CREATE TABLE cron_runs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at      INTEGER NOT NULL,
  finished_at     INTEGER NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('ok', 'error')),
  rows_written    INTEGER NOT NULL DEFAULT 0,
  error_message   TEXT,
  cron_schedule   TEXT NOT NULL DEFAULT '0 6 * * *'
);

CREATE INDEX cron_runs_started_at_idx ON cron_runs(started_at);
