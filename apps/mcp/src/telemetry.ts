/**
 * Telemetry event recording for the MCP server.
 *
 * This module is the SOLE INSERT SITE for cli_events and mcp_events tables.
 * Per INV-7, no other code should insert into these tables.
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
 * Record a telemetry event to D1.
 * This is the sole INSERT site for both cli_events and mcp_events.
 */
export async function recordEvent(
  db: D1Database,
  table: "cli_events" | "mcp_events",
  row: Record<string, unknown>,
): Promise<void> {
  const columns = Object.keys(row);
  const placeholders = columns.map(() => "?").join(", ");
  const values = Object.values(row);

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
    ts: new Date().toISOString(),
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
    ts: new Date().toISOString(),
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
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
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
