/**
 * Aggregation pipeline for telemetry insights (ADR-0018, Tranche E)
 *
 * Runs daily at 06:00 UTC via Cron Trigger. Aggregates cli_events into
 * the insights table with k-anonymity (n_users >= 30) enforced at write time.
 *
 * Topics:
 * - stack: distribution of lang, mono, deploy from stack_categories
 * - structure: bucketed counts of tree_entries, routes, decisions
 * - mistakes: validation_status (passed/failed)
 * - deploy: distribution of deploy platform
 *
 * Per INV-7, this is the only file that writes to the insights table.
 */

interface Env {
  DB: D1Database;
}

const K_ANONYMITY_THRESHOLD = 30;

export async function runAggregation(env: Env): Promise<void> {
  const db = env.DB;
  const startTime = Date.now();

  const totalResult = await db
    .prepare(
      "SELECT COUNT(DISTINCT anonymous_id) as total FROM cli_events WHERE payload_schema_version = 1",
    )
    .first<{ total: number }>();
  const totalUsers = totalResult?.total ?? 0;

  console.info(`[aggregation] Starting aggregation for ${totalUsers} distinct users`);

  if (totalUsers === 0) {
    console.info("[aggregation] No events to aggregate");
    return;
  }

  await aggregateStack(db, totalUsers);
  await aggregateStructure(db, totalUsers);
  await aggregateMistakes(db, totalUsers);
  await aggregateDeploy(db, totalUsers);

  const elapsed = Date.now() - startTime;
  console.info(`[aggregation] Completed in ${elapsed}ms`);
}

async function aggregateStack(db: D1Database, totalUsers: number): Promise<void> {
  await db.prepare("DELETE FROM insights WHERE topic = 'stack'").run();

  const langQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'stack',
      'lang',
      json_extract(payload_json, '$.stack_categories.lang'),
      COUNT(DISTINCT anonymous_id),
      CAST(COUNT(DISTINCT anonymous_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 1
      AND json_extract(payload_json, '$.stack_categories.lang') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.stack_categories.lang')
    HAVING COUNT(DISTINCT anonymous_id) >= ?
  `;
  await db.prepare(langQuery).bind(totalUsers, K_ANONYMITY_THRESHOLD).run();

  const monoQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'stack',
      'mono',
      CASE WHEN json_extract(payload_json, '$.stack_categories.mono') = 1 THEN 'true' ELSE 'false' END,
      COUNT(DISTINCT anonymous_id),
      CAST(COUNT(DISTINCT anonymous_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 1
      AND json_extract(payload_json, '$.stack_categories.mono') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.stack_categories.mono')
    HAVING COUNT(DISTINCT anonymous_id) >= ?
  `;
  await db.prepare(monoQuery).bind(totalUsers, K_ANONYMITY_THRESHOLD).run();

  console.info("[aggregation] stack topic completed");
}

async function aggregateStructure(db: D1Database, totalUsers: number): Promise<void> {
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
      COUNT(DISTINCT anonymous_id),
      CAST(COUNT(DISTINCT anonymous_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 1
      AND json_extract(payload_json, '$.counts.tree_entries') IS NOT NULL
    GROUP BY CASE
      WHEN json_extract(payload_json, '$.counts.tree_entries') = 0 THEN '0'
      WHEN json_extract(payload_json, '$.counts.tree_entries') BETWEEN 1 AND 10 THEN '1-10'
      WHEN json_extract(payload_json, '$.counts.tree_entries') BETWEEN 11 AND 50 THEN '11-50'
      WHEN json_extract(payload_json, '$.counts.tree_entries') BETWEEN 51 AND 100 THEN '51-100'
      ELSE '100+'
    END
    HAVING COUNT(DISTINCT anonymous_id) >= ?
  `;
  await db.prepare(treeQuery).bind(totalUsers, K_ANONYMITY_THRESHOLD).run();

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
      COUNT(DISTINCT anonymous_id),
      CAST(COUNT(DISTINCT anonymous_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 1
      AND json_extract(payload_json, '$.counts.routes') IS NOT NULL
    GROUP BY CASE
      WHEN json_extract(payload_json, '$.counts.routes') = 0 THEN '0'
      WHEN json_extract(payload_json, '$.counts.routes') BETWEEN 1 AND 10 THEN '1-10'
      WHEN json_extract(payload_json, '$.counts.routes') BETWEEN 11 AND 50 THEN '11-50'
      WHEN json_extract(payload_json, '$.counts.routes') BETWEEN 51 AND 100 THEN '51-100'
      ELSE '100+'
    END
    HAVING COUNT(DISTINCT anonymous_id) >= ?
  `;
  await db.prepare(routesQuery).bind(totalUsers, K_ANONYMITY_THRESHOLD).run();

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
      COUNT(DISTINCT anonymous_id),
      CAST(COUNT(DISTINCT anonymous_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 1
      AND json_extract(payload_json, '$.counts.decisions') IS NOT NULL
    GROUP BY CASE
      WHEN json_extract(payload_json, '$.counts.decisions') = 0 THEN '0'
      WHEN json_extract(payload_json, '$.counts.decisions') BETWEEN 1 AND 10 THEN '1-10'
      WHEN json_extract(payload_json, '$.counts.decisions') BETWEEN 11 AND 50 THEN '11-50'
      WHEN json_extract(payload_json, '$.counts.decisions') BETWEEN 51 AND 100 THEN '51-100'
      ELSE '100+'
    END
    HAVING COUNT(DISTINCT anonymous_id) >= ?
  `;
  await db.prepare(decisionsQuery).bind(totalUsers, K_ANONYMITY_THRESHOLD).run();

  console.info("[aggregation] structure topic completed");
}

async function aggregateMistakes(db: D1Database, totalUsers: number): Promise<void> {
  await db.prepare("DELETE FROM insights WHERE topic = 'mistakes'").run();

  const statusQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'mistakes',
      'validation_status',
      CASE WHEN json_extract(payload_json, '$.validation.passed') = 1 THEN 'passed' ELSE 'failed' END,
      COUNT(DISTINCT anonymous_id),
      CAST(COUNT(DISTINCT anonymous_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 1
      AND json_extract(payload_json, '$.validation.passed') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.validation.passed')
    HAVING COUNT(DISTINCT anonymous_id) >= ?
  `;
  await db.prepare(statusQuery).bind(totalUsers, K_ANONYMITY_THRESHOLD).run();

  console.info("[aggregation] mistakes topic completed");
}

async function aggregateDeploy(db: D1Database, totalUsers: number): Promise<void> {
  await db.prepare("DELETE FROM insights WHERE topic = 'deploy'").run();

  const deployQuery = `
    INSERT INTO insights (topic, dim1_key, dim1_value, n_users, percentage)
    SELECT
      'deploy',
      'platform',
      json_extract(payload_json, '$.stack_categories.deploy'),
      COUNT(DISTINCT anonymous_id),
      CAST(COUNT(DISTINCT anonymous_id) AS REAL) / ? * 100
    FROM cli_events
    WHERE payload_schema_version = 1
      AND json_extract(payload_json, '$.stack_categories.deploy') IS NOT NULL
    GROUP BY json_extract(payload_json, '$.stack_categories.deploy')
    HAVING COUNT(DISTINCT anonymous_id) >= ?
  `;
  await db.prepare(deployQuery).bind(totalUsers, K_ANONYMITY_THRESHOLD).run();

  console.info("[aggregation] deploy topic completed");
}
