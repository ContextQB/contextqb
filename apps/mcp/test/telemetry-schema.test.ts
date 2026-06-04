/**
 * Unit tests for the CLI telemetry schema (V#E2).
 *
 * Verifies:
 * - V1 payloads are accepted
 * - V2 payloads are accepted
 * - V3 payloads without project_id are accepted
 * - V3 payloads with valid v4 UUID project_id are accepted
 * - V3 payloads with v1 UUID (non-v4) are rejected
 * - Invalid version payloads are rejected
 *
 * Run via `pnpm tsx apps/mcp/test/telemetry-schema.test.ts`
 */

import { CliTelemetryPayloadSchema } from "../src/telemetry-schema.js";

function fail(message: string): never {
  console.error(`[telemetry-schema.test] FAIL: ${message}`);
  process.exit(1);
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) fail(message);
}

const VALID_ANONYMOUS_ID = "a".repeat(64);

const V1_PAYLOAD = {
  payload_schema_version: 1,
  cli_version: "1.0.0",
  os: "darwin",
  anonymous_id: VALID_ANONYMOUS_ID,
  sections: { has_tree: true, has_routes: false, has_decisions: false, has_status: false },
  counts: { tree_entries: 5, routes: 0, decisions: 0 },
  stack_categories: { lang: "typescript", mono: false, deploy: "cloudflare" },
  validation: { passed: true, error_count: 0, warning_count: 0, finding_codes: [] },
};

const V2_PAYLOAD = {
  payload_schema_version: 2,
  cli_version: "1.1.0",
  os: "linux",
  anonymous_id: VALID_ANONYMOUS_ID,
  event_kind: "check_first",
  subcommand: "check",
  is_first_run_locally: true,
  exit_code: 0,
  sections: { has_tree: true, has_routes: true, has_decisions: true, has_status: false },
  counts: { tree_entries: 10, routes: 2, decisions: 3 },
  stack_categories: { lang: "typescript", mono: true, deploy: "vercel" },
  validation: {
    passed: false,
    error_count: 1,
    warning_count: 2,
    info_count: 0,
    findings_total: 3,
    finding_codes: ["missing-entry", "stale-entry"],
  },
  adapter_coverage: {
    workspaces_pnpm: true,
    workspaces_npm: false,
    routes_wrangler: false,
    routes_vercel: true,
    routes_netlify: false,
    routes_fly: false,
    decisions_md: true,
  },
};

const V3_PAYLOAD_WITHOUT_PROJECT_ID = {
  payload_schema_version: 3,
  cli_version: "1.2.0",
  os: "darwin",
  anonymous_id: VALID_ANONYMOUS_ID,
  event_kind: "check_subsequent",
  subcommand: "check",
  is_first_run_locally: false,
  exit_code: 0,
  sections: { has_tree: true, has_routes: true, has_decisions: true, has_status: true },
  counts: { tree_entries: 15, routes: 3, decisions: 5 },
  stack_categories: { lang: "python", mono: false, deploy: "aws" },
  validation: {
    passed: true,
    error_count: 0,
    warning_count: 0,
    info_count: 1,
    findings_total: 1,
    finding_codes: ["info-code"],
  },
  adapter_coverage: {
    workspaces_pnpm: false,
    workspaces_npm: true,
    routes_wrangler: false,
    routes_vercel: false,
    routes_netlify: false,
    routes_fly: true,
    decisions_md: true,
  },
};

const VALID_V4_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const INVALID_V1_UUID = "a1b2c3d4-e5f6-1a7b-8c9d-0e1f2a3b4c5d"; // version nibble is 1, not 4

const V3_PAYLOAD_WITH_PROJECT_ID = {
  ...V3_PAYLOAD_WITHOUT_PROJECT_ID,
  project_id: VALID_V4_UUID,
};

const V3_PAYLOAD_WITH_INVALID_PROJECT_ID = {
  ...V3_PAYLOAD_WITHOUT_PROJECT_ID,
  project_id: INVALID_V1_UUID,
};

function testV1PayloadAccepted(): void {
  const result = CliTelemetryPayloadSchema.safeParse(V1_PAYLOAD);
  assert(result.success, "V1 payload should be accepted");
  console.info("  ✓ V1 payload accepted");
}

function testV2PayloadAccepted(): void {
  const result = CliTelemetryPayloadSchema.safeParse(V2_PAYLOAD);
  assert(result.success, "V2 payload should be accepted");
  console.info("  ✓ V2 payload accepted");
}

function testV3WithoutProjectIdAccepted(): void {
  const result = CliTelemetryPayloadSchema.safeParse(V3_PAYLOAD_WITHOUT_PROJECT_ID);
  assert(result.success, "V3 payload without project_id should be accepted");
  console.info("  ✓ V3 payload without project_id accepted");
}

function testV3WithValidProjectIdAccepted(): void {
  const result = CliTelemetryPayloadSchema.safeParse(V3_PAYLOAD_WITH_PROJECT_ID);
  assert(result.success, "V3 payload with valid v4 UUID project_id should be accepted");
  console.info("  ✓ V3 payload with valid v4 UUID project_id accepted");
}

function testV3WithInvalidProjectIdRejected(): void {
  const result = CliTelemetryPayloadSchema.safeParse(V3_PAYLOAD_WITH_INVALID_PROJECT_ID);
  assert(!result.success, "V3 payload with v1 UUID (non-v4) project_id should be rejected");
  console.info("  ✓ V3 payload with v1 UUID (non-v4) project_id rejected");
}

function testInvalidVersionRejected(): void {
  const invalidPayload = { ...V1_PAYLOAD, payload_schema_version: 99 };
  const result = CliTelemetryPayloadSchema.safeParse(invalidPayload);
  assert(!result.success, "Invalid version payload should be rejected");
  console.info("  ✓ Invalid version payload rejected");
}

console.info("\n[telemetry-schema.test] Running tests...\n");

testV1PayloadAccepted();
testV2PayloadAccepted();
testV3WithoutProjectIdAccepted();
testV3WithValidProjectIdAccepted();
testV3WithInvalidProjectIdRejected();
testInvalidVersionRejected();

console.info("\n[telemetry-schema.test] All tests passed.\n");
