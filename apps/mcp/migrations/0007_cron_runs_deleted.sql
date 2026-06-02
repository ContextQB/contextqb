-- Migration 0007_cron_runs_deleted.sql
-- Add columns to track deleted rows during retention cleanup.

ALTER TABLE cron_runs ADD COLUMN cli_rows_deleted INTEGER NOT NULL DEFAULT 0;
ALTER TABLE cron_runs ADD COLUMN mcp_rows_deleted INTEGER NOT NULL DEFAULT 0;
