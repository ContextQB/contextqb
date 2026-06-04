/**
 * Zod schema for CLI telemetry payloads.
 *
 * MIRROR OF packages/qb/cli/src/telemetry.ts:CliTelemetryPayload
 * NOTE: The CLI type remains at v2 until Tranche E.2 ships — this one-tranche
 * skew is intentional so the server can accept project_id before the CLI sends it.
 *
 * This is the wire-format enforcement point. Payloads that don't match
 * are rejected with 400. Keep this in sync with the CLI type definition.
 *
 * Per INV-TEL-1, the server accepts v1, v2, and v3 payloads during the
 * 90-day deprecation window. v1/v2 clients continue to work; v3 clients
 * send the extended schema with optional project_id. Aggregation queries
 * filter by version.
 */

import { z } from "zod";

const LangCategory = z.enum([
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "java",
  "kotlin",
  "swift",
  "other",
]);

const DeployCategory = z.enum([
  "cloudflare",
  "vercel",
  "aws",
  "gcp",
  "azure",
  "railway",
  "fly",
  "other",
  "none",
]);

const OsCategory = z.enum(["darwin", "linux", "win32", "other"]);

const EventKind = z.enum([
  "check_first",
  "check_subsequent",
  "membership_register",
  "membership_revoke",
  "membership_status",
  "mcp_setup",
  "insights_query",
  "telemetry_preview",
]);

const Subcommand = z.enum(["check", "membership", "mcp", "insights"]);

const AdapterCoverage = z.object({
  workspaces_pnpm: z.boolean(),
  workspaces_npm: z.boolean(),
  routes_wrangler: z.boolean(),
  routes_vercel: z.boolean(),
  routes_netlify: z.boolean(),
  routes_fly: z.boolean(),
  decisions_md: z.boolean(),
});

const CliTelemetryPayloadSchemaV1 = z.object({
  payload_schema_version: z.literal(1),
  cli_version: z.string().min(1).max(20),
  os: OsCategory,
  anonymous_id: z.string().length(64),
  sections: z.object({
    has_tree: z.boolean(),
    has_routes: z.boolean(),
    has_decisions: z.boolean(),
    has_status: z.boolean(),
  }),
  counts: z.object({
    tree_entries: z.number().int().min(0),
    routes: z.number().int().min(0),
    decisions: z.number().int().min(0),
  }),
  stack_categories: z.object({
    lang: LangCategory,
    mono: z.boolean(),
    deploy: DeployCategory,
  }),
  validation: z.object({
    passed: z.boolean(),
    error_count: z.number().int().min(0),
    warning_count: z.number().int().min(0),
    finding_codes: z.array(z.string().max(50)).max(100),
  }),
});

const CliTelemetryPayloadSchemaV2 = z.object({
  payload_schema_version: z.literal(2),
  cli_version: z.string().min(1).max(20),
  os: OsCategory,
  anonymous_id: z.string().length(64),
  event_kind: EventKind,
  subcommand: Subcommand,
  is_first_run_locally: z.boolean(),
  exit_code: z.number().int().min(0).max(255),
  sections: z.object({
    has_tree: z.boolean(),
    has_routes: z.boolean(),
    has_decisions: z.boolean(),
    has_status: z.boolean(),
  }),
  counts: z.object({
    tree_entries: z.number().int().min(0),
    routes: z.number().int().min(0),
    decisions: z.number().int().min(0),
  }),
  stack_categories: z.object({
    lang: LangCategory,
    mono: z.boolean(),
    deploy: DeployCategory,
  }),
  validation: z.object({
    passed: z.boolean(),
    error_count: z.number().int().min(0),
    warning_count: z.number().int().min(0),
    info_count: z.number().int().min(0),
    findings_total: z.number().int().min(0),
    finding_codes: z.array(z.string().max(50)).max(100),
  }),
  adapter_coverage: AdapterCoverage,
});

const V4_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const CliTelemetryPayloadSchemaV3 = z.object({
  payload_schema_version: z.literal(3),
  project_id: z.string().regex(V4_UUID_REGEX).optional(),
  cli_version: z.string().min(1).max(20),
  os: OsCategory,
  anonymous_id: z.string().length(64),
  event_kind: EventKind,
  subcommand: Subcommand,
  is_first_run_locally: z.boolean(),
  exit_code: z.number().int().min(0).max(255),
  sections: z.object({
    has_tree: z.boolean(),
    has_routes: z.boolean(),
    has_decisions: z.boolean(),
    has_status: z.boolean(),
  }),
  counts: z.object({
    tree_entries: z.number().int().min(0),
    routes: z.number().int().min(0),
    decisions: z.number().int().min(0),
  }),
  stack_categories: z.object({
    lang: LangCategory,
    mono: z.boolean(),
    deploy: DeployCategory,
  }),
  validation: z.object({
    passed: z.boolean(),
    error_count: z.number().int().min(0),
    warning_count: z.number().int().min(0),
    info_count: z.number().int().min(0),
    findings_total: z.number().int().min(0),
    finding_codes: z.array(z.string().max(50)).max(100),
  }),
  adapter_coverage: AdapterCoverage,
});

export const CliTelemetryPayloadSchema = z.discriminatedUnion("payload_schema_version", [
  CliTelemetryPayloadSchemaV1,
  CliTelemetryPayloadSchemaV2,
  CliTelemetryPayloadSchemaV3,
]);

export type CliTelemetryPayload = z.infer<typeof CliTelemetryPayloadSchema>;
