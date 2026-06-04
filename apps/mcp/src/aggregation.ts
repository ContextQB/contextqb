/**
 * Aggregation pipeline for telemetry insights (ADR-0018, ADR-0032, ADR-0033)
 *
 * Runs daily at 06:00 UTC via Cron Trigger. Aggregates cli_events into
 * the insights table with k-anonymity (n_users >= 30 distinct projects)
 * enforced at write time. Per ADR-0033, cooperative insights count projects
 * only; per-member counts are admin-only via dashboard direct-D1 queries.
 *
 * Topics:
 * - stack: distribution of lang, mono, deploy from stack_categories
 * - structure: bucketed counts of tree_entries, routes, decisions
 * - mistakes: validation_status (passed/failed)
 * - deploy: distribution of deploy platform
 * - adapters: v3 adapter_coverage fields
 * - usage: event_kind, subcommand
 *
 * Per INV-7, this is the only file that writes to the insights table.
 * Per ADR-0033, only v3 events with project_id contribute to insights.
 */

interface Env {
  DB: D1Database;
  TELEMETRY_RETENTION_DAYS?: string;
}

const K_ANONYMITY_THRESHOLD = 30;

function truncateError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  return message.slice(0, 2048);
}

export async function runAggregation(env: Env, cronSchedule = "0 6 * * *"): Promise<void> {
  const db = env.DB;
  const startedAt = Math.floor(Date.now() / 1000);
  let status: "ok" | "error" = "ok";
  let errorMessage: string | null = null;
  let cliRowsDeleted = 0;
  let mcpRowsDeleted = 0;

  try {
    // Per ADR-0033: count distinct projects only (v3 events with project_id)
    const totalResult = await db
      .prepare(
        "SELECT COUNT(DISTINCT project_id) as total FROM cli_events WHERE payload_schema_version = 3 AND project_id IS NOT NULL",
      )
      .first<{ total: number }>();
    const totalProjects = totalResult?.total ?? 0;

    console.info(`[aggregation] Starting aggregation for ${totalProjects} distinct projects`);

    if (totalProjects > 0) {
      await aggregateStack(db, totalProjects);
      await aggregateStructure(db, totalProjects);
      await aggregateMistakes(db, totalProjects);
      await aggregateDeploy(db, totalProjects);
      await aggregateAdapters(db, totalProjects);
      await aggregateUsage(db, totalProjects);
    } else {
      console.info("[aggregation] No v3 events with project_id to aggregate");
    }

    // C.1: Retention cleanup — delete events older than TELEMETRY_RETENTION_DAYS
    // Only runs after successful aggregation to ensure data is captured first.
    const retentionDays = parseInt(env.TELEMETRY_RETENTION_DAYS ?? "90", 10);
    const retentionThreshold = startedAt - retentionDays * 86400;

    const cliDeleteResult = await db
      .prepare("DELETE FROM cli_events WHERE ts < ?")
      .bind(retentionThreshold)
      .run();
    cliRowsDeleted = cliDeleteResult.meta?.changes ?? 0;

    const mcpDeleteResult = await db
      .prepare("DELETE FROM mcp_events WHERE ts < ?")
      .bind(retentionThreshold)
      .run();
    mcpRowsDeleted = mcpDeleteResult.meta?.changes ?? 0;

    if (cliRowsDeleted > 0 || mcpRowsDeleted > 0) {
      console.info(
        `[aggregation] Retention cleanup: deleted ${cliRowsDeleted} cli_events, ${mcpRowsDeleted} mcp_events older than ${retentionDays} days`,
      );
    }

    const elapsed = Math.floor(Date.now() / 1000) - startedAt;
    console.info(`[aggregation] Completed in ${elapsed}s`);
  } catch (err) {
    status = "error";
    errorMessage = truncateError(err);
    console.error("[aggregation] Failed:", err);
  } finally {
    const finishedAt = Math.floor(Date.now() / 1000);
    let rowsWritten = 0;
    try {
      rowsWritten =
        (await db.prepare("SELECT COUNT(*) as c FROM insights").first<{ c: number }>())?.c ?? 0;
      await db
        .prepare(
          `INSERT INTO cron_runs (started_at, finished_at, status, rows_written, error_message, cron_schedule, cli_rows_deleted, mcp_rows_deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          startedAt,
          finishedAt,
          status,
          rowsWritten,
          errorMessage,
          cronSchedule,
          cliRowsDeleted,
          mcpRowsDeleted,
        )
        .run();
    } catch (logErr) {
      console.error("[aggregation] Failed to write cron_runs:", logErr);
    }
  }
}

async function aggregateStack(db: D1Database, totalProjects: number): Promise<void> {
  await db.prepare("DELETE FROM insights WHERE topic = 'stack'").run();

  const langQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'stack',
      'lang',
      json_extract(payload_json, '$.stack_categories.lang'),
      COUNT(DISTINCT project_id),
      CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 3 AND project_id IS NOT NULL
      AND json_extract(payload_json, '$.stack_categories.lang') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.stack_categories.lang')
    HAVING COUNT(DISTINCT project_id) >= ?
  `;
  await db.prepare(langQuery).bind(totalProjects, K_ANONYMITY_THRESHOLD).run();

  const monoQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'stack',
      'mono',
      CASE WHEN json_extract(payload_json, '$.stack_categories.mono') = 1 THEN 'true' ELSE 'false' END,
      COUNT(DISTINCT project_id),
      CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 3 AND project_id IS NOT NULL
      AND json_extract(payload_json, '$.stack_categories.mono') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.stack_categories.mono')
    HAVING COUNT(DISTINCT project_id) >= ?
  `;
  await db.prepare(monoQuery).bind(totalProjects, K_ANONYMITY_THRESHOLD).run();

  console.info("[aggregation] stack topic completed");
}

async function aggregateStructure(db: D1Database, totalProjects: number): Promise<void> {
  await db.prepare("DELETE FROM insights WHERE topic = 'structure'").run();

  const treeQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'structure',
      'tree_entries',
      CASE
        WHEN json_extract(payload_json, '$.counts.tree_entries') = 0 THEN '0'
        WHEN json_extract(payload_json, '$.counts.tree_entries') BETWEEN 1 AND 10 THEN '1-10'
        WHEN json_extract(payload_json, '$.counts.tree_entries') BETWEEN 11 AND 50 THEN '11-50'
        WHEN json_extract(payload_json, '$.counts.tree_entries') BETWEEN 51 AND 100 THEN '51-100'
        ELSE '100+'
      END,
      COUNT(DISTINCT project_id),
      CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 3 AND project_id IS NOT NULL
      AND json_extract(payload_json, '$.counts.tree_entries') IS NOT NULL
    GROUP BY CASE
      WHEN json_extract(payload_json, '$.counts.tree_entries') = 0 THEN '0'
      WHEN json_extract(payload_json, '$.counts.tree_entries') BETWEEN 1 AND 10 THEN '1-10'
      WHEN json_extract(payload_json, '$.counts.tree_entries') BETWEEN 11 AND 50 THEN '11-50'
      WHEN json_extract(payload_json, '$.counts.tree_entries') BETWEEN 51 AND 100 THEN '51-100'
      ELSE '100+'
    END
    HAVING COUNT(DISTINCT project_id) >= ?
  `;
  await db.prepare(treeQuery).bind(totalProjects, K_ANONYMITY_THRESHOLD).run();

  const routesQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'structure',
      'routes',
      CASE
        WHEN json_extract(payload_json, '$.counts.routes') = 0 THEN '0'
        WHEN json_extract(payload_json, '$.counts.routes') BETWEEN 1 AND 10 THEN '1-10'
        WHEN json_extract(payload_json, '$.counts.routes') BETWEEN 11 AND 50 THEN '11-50'
        WHEN json_extract(payload_json, '$.counts.routes') BETWEEN 51 AND 100 THEN '51-100'
        ELSE '100+'
      END,
      COUNT(DISTINCT project_id),
      CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 3 AND project_id IS NOT NULL
      AND json_extract(payload_json, '$.counts.routes') IS NOT NULL
    GROUP BY CASE
      WHEN json_extract(payload_json, '$.counts.routes') = 0 THEN '0'
      WHEN json_extract(payload_json, '$.counts.routes') BETWEEN 1 AND 10 THEN '1-10'
      WHEN json_extract(payload_json, '$.counts.routes') BETWEEN 11 AND 50 THEN '11-50'
      WHEN json_extract(payload_json, '$.counts.routes') BETWEEN 51 AND 100 THEN '51-100'
      ELSE '100+'
    END
    HAVING COUNT(DISTINCT project_id) >= ?
  `;
  await db.prepare(routesQuery).bind(totalProjects, K_ANONYMITY_THRESHOLD).run();

  const decisionsQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'structure',
      'decisions',
      CASE
        WHEN json_extract(payload_json, '$.counts.decisions') = 0 THEN '0'
        WHEN json_extract(payload_json, '$.counts.decisions') BETWEEN 1 AND 10 THEN '1-10'
        WHEN json_extract(payload_json, '$.counts.decisions') BETWEEN 11 AND 50 THEN '11-50'
        WHEN json_extract(payload_json, '$.counts.decisions') BETWEEN 51 AND 100 THEN '51-100'
        ELSE '100+'
      END,
      COUNT(DISTINCT project_id),
      CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 3 AND project_id IS NOT NULL
      AND json_extract(payload_json, '$.counts.decisions') IS NOT NULL
    GROUP BY CASE
      WHEN json_extract(payload_json, '$.counts.decisions') = 0 THEN '0'
      WHEN json_extract(payload_json, '$.counts.decisions') BETWEEN 1 AND 10 THEN '1-10'
      WHEN json_extract(payload_json, '$.counts.decisions') BETWEEN 11 AND 50 THEN '11-50'
      WHEN json_extract(payload_json, '$.counts.decisions') BETWEEN 51 AND 100 THEN '51-100'
      ELSE '100+'
    END
    HAVING COUNT(DISTINCT project_id) >= ?
  `;
  await db.prepare(decisionsQuery).bind(totalProjects, K_ANONYMITY_THRESHOLD).run();

  console.info("[aggregation] structure topic completed");
}

async function aggregateMistakes(db: D1Database, totalProjects: number): Promise<void> {
  await db.prepare("DELETE FROM insights WHERE topic = 'mistakes'").run();

  const statusQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'mistakes',
      'validation_status',
      CASE WHEN json_extract(payload_json, '$.validation.passed') = 1 THEN 'passed' ELSE 'failed' END,
      COUNT(DISTINCT project_id),
      CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 3 AND project_id IS NOT NULL
      AND json_extract(payload_json, '$.validation.passed') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.validation.passed')
    HAVING COUNT(DISTINCT project_id) >= ?
  `;
  await db.prepare(statusQuery).bind(totalProjects, K_ANONYMITY_THRESHOLD).run();

  console.info("[aggregation] mistakes topic completed");
}

async function aggregateDeploy(db: D1Database, totalProjects: number): Promise<void> {
  await db.prepare("DELETE FROM insights WHERE topic = 'deploy'").run();

  const deployQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'deploy',
      'platform',
      json_extract(payload_json, '$.stack_categories.deploy'),
      COUNT(DISTINCT project_id),
      CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 3 AND project_id IS NOT NULL
      AND json_extract(payload_json, '$.stack_categories.deploy') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.stack_categories.deploy')
    HAVING COUNT(DISTINCT project_id) >= ?
  `;
  await db.prepare(deployQuery).bind(totalProjects, K_ANONYMITY_THRESHOLD).run();

  console.info("[aggregation] deploy topic completed");
}

async function aggregateAdapters(db: D1Database, totalProjects: number): Promise<void> {
  await db.prepare("DELETE FROM insights WHERE topic = 'adapters'").run();

  const adapterFields = [
    "workspaces_pnpm",
    "workspaces_npm",
    "routes_wrangler",
    "routes_vercel",
    "routes_netlify",
    "routes_fly",
    "decisions_md",
  ];

  for (const adapter of adapterFields) {
    const query = `
      INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
      SELECT
        'adapters',
        ?,
        CASE WHEN json_extract(payload_json, '$.adapter_coverage.${adapter}') = 1 THEN 'true' ELSE 'false' END,
        COUNT(DISTINCT project_id),
        CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
      FROM cli_events
      WHERE payload_schema_version = 3 AND project_id IS NOT NULL
        AND json_extract(payload_json, '$.adapter_coverage.${adapter}') IS NOT NULL
      GROUP BY json_extract(payload_json, '$.adapter_coverage.${adapter}')
      HAVING COUNT(DISTINCT project_id) >= ?
    `;
    await db.prepare(query).bind(adapter, totalProjects, K_ANONYMITY_THRESHOLD).run();
  }

  console.info("[aggregation] adapters topic completed");
}

async function aggregateUsage(db: D1Database, totalProjects: number): Promise<void> {
  await db.prepare("DELETE FROM insights WHERE topic = 'usage'").run();

  const kindQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'usage',
      'event_kind',
      json_extract(payload_json, '$.event_kind'),
      COUNT(DISTINCT project_id),
      CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 3 AND project_id IS NOT NULL
      AND json_extract(payload_json, '$.event_kind') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.event_kind')
    HAVING COUNT(DISTINCT project_id) >= ?
  `;
  await db.prepare(kindQuery).bind(totalProjects, K_ANONYMITY_THRESHOLD).run();

  const subQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'usage',
      'subcommand',
      json_extract(payload_json, '$.subcommand'),
      COUNT(DISTINCT project_id),
      CAST(COUNT(DISTINCT project_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 3 AND project_id IS NOT NULL
      AND json_extract(payload_json, '$.subcommand') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.subcommand')
    HAVING COUNT(DISTINCT project_id) >= ?
  `;
  await db.prepare(subQuery).bind(totalProjects, K_ANONYMITY_THRESHOLD).run();

  console.info("[aggregation] usage topic completed");
}
