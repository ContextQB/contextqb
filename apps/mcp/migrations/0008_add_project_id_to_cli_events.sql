-- Migration 0008_add_project_id_to_cli_events.sql
-- Adds nullable project_id column for per-project identity (ADR-0032).
-- Existing rows store NULL (no backfill — per-project insights start from
-- this migration's date; ADR-0032 §Consequences).

ALTER TABLE cli_events ADD COLUMN project_id TEXT;
CREATE INDEX cli_events_project_id_idx ON cli_events(project_id) WHERE project_id IS NOT NULL;
