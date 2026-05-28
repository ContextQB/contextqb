-- Migration 0002: Insights table for aggregated telemetry (ADR-0018, Tranche E)
-- k-anonymity enforced at write time: n_users >= 30 constraint

CREATE TABLE insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT NOT NULL,                    -- 'stack' | 'structure' | 'mistakes' | 'deploy'
  dim1_key TEXT NOT NULL,                 -- e.g. 'lang', 'mono', 'tree_bucket'
  dim1_value TEXT NOT NULL,               -- e.g. 'typescript', 'true', '1-10'
  dim2_key TEXT,                          -- nullable; max 2 dimensions
  dim2_value TEXT,                        -- nullable
  n_users INTEGER NOT NULL CHECK(n_users >= 30),  -- k-anonymity: min 30 distinct users
  percentage REAL NOT NULL,               -- pre-computed for fast read
  computed_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(topic, dim1_key, dim1_value, dim2_key, dim2_value)
);

CREATE INDEX insights_topic_idx ON insights(topic);
