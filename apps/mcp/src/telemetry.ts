/**
 * Telemetry event recording for the MCP server.
 *
 * This module is the SOLE INSERT SITE for cli_events and mcp_events tables.
 * Per INV-7, no other code should insert into these tables.
 * Per INV-TEL-2, columns are validated against a hardcoded allow-list.
 *
 * Handles:
 * - Recording CLI telemetry events (POST /telemetry/cli)
 * - Recording MCP tool call events (middleware)
 */

import { CliTelemetryPayloadSchema, type CliTelemetryPayload } from "./telemetry-schema.js";
import type { Member } from "./membership.js";

interface Env {
  DB: D1Database;
}

/**
 * INV-TEL-2: Per-table column allow-list derived from 0001_initial.sql.
 * recordEvent throws synchronously on any non-allow-listed key.
 */
const TABLE_COLUMNS = {
  cli_events: ["anonymous_id", "ts", "payload_json", "payload_schema_version"],
  mcp_events: [
    "anonymous_id",
    "ts",
    "tool_name",
    "response_time_ms",
    "country_code",
    "client_hint",
    "payload_schema_version",
  ],
} as const satisfies Record<"cli_events" | "mcp_events", readonly string[]>;

/**
 * Record a telemetry event to D1.
 * This is the sole INSERT site for both cli_events and mcp_events.
 *
 * INV-TEL-2: Validates that all row keys are in the table's allow-list.
 * Throws synchronously if a non-allowed key is present.
 */
export async function recordEvent(
  db: D1Database,
  table: "cli_events" | "mcp_events",
  row: Record<string, unknown>,
): Promise<void> {
  const allowList = TABLE_COLUMNS[table];
  const rowKeys = Object.keys(row);

  for (const key of rowKeys) {
    if (!(allowList as readonly string[]).includes(key)) {
      throw new Error(`recordEvent: column ${key} not in allow-list for ${table}`);
    }
  }

  const columns = allowList.filter((c) => c in row) as string[];
  const placeholders = columns.map(() => "?").join(", ");
  const values = columns.map((c) => row[c]);

  await db
    .prepare(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`)
    .bind(...values)
    .run();
}

/**
 * Record a CLI telemetry event.
 * Validates payload, extracts member info, writes to cli_events.
 */
export async function recordCliEvent(
  db: D1Database,
  member: Member,
  payload: CliTelemetryPayload,
): Promise<void> {
  await recordEvent(db, "cli_events", {
    anonymous_id: member.anonymous_id,
    ts: Math.floor(Date.now() / 1000),
    payload_json: JSON.stringify(payload),
    payload_schema_version: payload.payload_schema_version,
  });
}

/**
 * Record an MCP tool call event.
 */
export async function recordMcpEvent(
  db: D1Database,
  anonymousId: string,
  toolName: string,
  responseTimeMs: number,
  countryCode: string | null,
  clientHint: string | null,
): Promise<void> {
  await recordEvent(db, "mcp_events", {
    anonymous_id: anonymousId,
    ts: Math.floor(Date.now() / 1000),
    tool_name: toolName,
    response_time_ms: responseTimeMs,
    country_code: countryCode,
    client_hint: clientHint,
    payload_schema_version: 1,
  });
}

/**
 * Handle POST /telemetry/cli request.
 * Validates the payload and records the event.
 */
export async function handleCliTelemetry(
  request: Request,
  env: Env,
  member: Member,
  rawBody?: string,
): Promise<Response> {
  let body: unknown;
  try {
    body = rawBody !== undefined ? JSON.parse(rawBody) : await request.json();
  } catch {
    return Response.json(
      { error: "invalid_payload", message: "Request body is not valid JSON" },
      { status: 400 },
    );
  }

  const result = CliTelemetryPayloadSchema.safeParse(body);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    return Response.json(
      { error: "invalid_payload", message: `Schema validation failed: ${issues.join("; ")}` },
      { status: 400 },
    );
  }

  try {
    await recordCliEvent(env.DB, member, result.data);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Failed to record CLI telemetry:", err);
    return Response.json(
      { error: "internal_error", message: "Failed to record telemetry" },
      { status: 500 },
    );
  }
}
