/**
 * Zod schema for CLI telemetry payloads.
 *
 * MIRROR OF packages/qb/cli/src/telemetry.ts:CliTelemetryPayload
 *
 * This is the wire-format enforcement point. Payloads that don't match
 * are rejected with 400. Keep this in sync with the CLI type definition.
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

export const CliTelemetryPayloadSchema = z.object({
  payload_schema_version: z.literal(1),
  cli_version: z.string().min(1).max(20),
  os: OsCategory,
  anonymous_id: z.string().length(64), // SHA256 hex
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

export type CliTelemetryPayload = z.infer<typeof CliTelemetryPayloadSchema>;
