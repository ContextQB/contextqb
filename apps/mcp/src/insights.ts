/**
 * Insights API module — single read site for the insights table (INV-9).
 *
 * This module is the ONLY file that reads FROM the insights table.
 * Aggregation.ts writes to the table; this module serves reads.
 *
 * Public responses expose n_bucket only, never n_users (INV-10).
 * The bucketise() function is the boundary — exact counts are internal only.
 *
 * Ref: docs/archive/scopes/0018-data-cooperative.md (Tranche F)
 * Ref: docs/architecture/invariants.md (INV-9, INV-10)
 */

import type { Member } from "./membership.js";

interface Env {
  DB: D1Database;
}

const VALID_TOPICS = ["stack", "structure", "mistakes", "deploy"] as const;
type Topic = (typeof VALID_TOPICS)[number];

const VALID_DIMS: Record<Topic, string[]> = {
  stack: ["lang", "mono"],
  structure: ["tree_entries", "routes", "decisions"],
  mistakes: ["validation_status"],
  deploy: ["platform"],
};

interface InsightRow {
  topic: string;
  dim1_key: string;
  dim1_value: string;
  dim2_key: string | null;
  dim2_value: string | null;
  n_users: number;
  percentage: number;
}

interface InsightResponse {
  topic: string;
  dim1: string;
  dim2?: string;
  n_bucket: string;
  percentages: Array<{ value: string; pct: number }>;
}

interface InsufficientDataResponse {
  topic: string;
  insufficient_data: true;
  threshold: 30;
  explanation: string;
  privacy_policy_url: string;
}

type ApiResponse = InsightResponse | InsufficientDataResponse;

/**
 * Convert exact n_users to a coarse bucket string.
 * This is the INV-10 boundary — n_users never leaves this function as a number.
 */
export function bucketise(n: number): string {
  if (n < 30) {
    throw new Error("n_users below k-anonymity threshold should not be served");
  }
  if (n < 100) return "n>30";
  if (n < 1000) return "n>100";
  return "n>1000";
}

/**
 * Validate topic and dimensions.
 * Returns an error string if invalid, null if valid.
 */
export function validateDimensions(
  topic: string | null,
  dim1: string | null,
  dim2: string | null,
  dim3: string | null,
): string | null {
  if (!topic) {
    return "missing_topic";
  }
  if (!VALID_TOPICS.includes(topic as Topic)) {
    return "unknown_topic";
  }
  if (dim3) {
    return "too_many_dimensions";
  }
  const validDims = VALID_DIMS[topic as Topic];
  if (dim1 && !validDims.includes(dim1)) {
    return `invalid_dim1: must be one of ${validDims.join(", ")}`;
  }
  if (dim2 && !validDims.includes(dim2)) {
    return `invalid_dim2: must be one of ${validDims.join(", ")}`;
  }
  return null;
}

/**
 * Origins permitted to call the insights endpoint cross-origin.
 * Includes the canonical apex, the www alias, the workers.dev mirror, and
 * the local Next dev server. Anything else falls back to the canonical apex.
 */
const ALLOWED_ORIGINS = new Set([
  "https://contextqb.com",
  "https://www.contextqb.com",
  "https://contextqb-web.symbolscape-inc.workers.dev",
  "http://localhost:3000",
]);

/**
 * CORS headers that echo the request's Origin when it is on the allowlist.
 * Vary: Origin keeps shared caches from serving the wrong allow-origin for a
 * different requester.
 */
export function corsHeaders(request?: Request): HeadersInit {
  const origin = request?.headers.get("Origin");
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://contextqb.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/**
 * Query the insights table and return API-ready response.
 * This is the only function that SELECTs from insights (INV-9).
 */
export async function callInsightsApi(
  env: Env,
  topic: string,
  dim1: string | null,
): Promise<ApiResponse> {
  let sql =
    "SELECT dim1_key, dim1_value, dim2_key, dim2_value, n_users, percentage FROM insights WHERE topic = ?";
  const bindings: (string | null)[] = [topic];

  if (dim1) {
    sql += " AND dim1_key = ?";
    bindings.push(dim1);
  }

  sql += " ORDER BY percentage DESC";

  const rows = await env.DB.prepare(sql)
    .bind(...bindings)
    .all<InsightRow>();

  if (!rows.results || rows.results.length === 0) {
    return {
      topic,
      insufficient_data: true,
      threshold: 30,
      explanation:
        "This topic needs at least 30 unique contributors before aggregate insights are shown. This k-anonymity threshold protects individual privacy.",
      privacy_policy_url: "https://contextqb.com/privacy/telemetry",
    };
  }

  // Use the smallest n_users in the result set for conservative bucketing
  const minUsers = Math.min(...rows.results.map((r) => r.n_users));
  const nBucket = bucketise(minUsers);

  // Group by dim1_value to build percentages array
  const percentages = rows.results.map((r) => ({
    value: r.dim1_value,
    pct: Math.round(r.percentage * 100) / 100,
  }));

  return {
    topic,
    dim1: dim1 ?? rows.results[0]?.dim1_key ?? "unknown",
    n_bucket: nBucket,
    percentages,
  };
}

/**
 * Handle GET /insights and OPTIONS /insights.
 * Member is required — caller must validate token before calling.
 */
export async function handleInsights(
  request: Request,
  env: Env,
  _member: Member,
): Promise<Response> {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }

  if (request.method !== "GET") {
    return Response.json(
      { error: "method_not_allowed", message: "GET or OPTIONS required" },
      { status: 405, headers: corsHeaders(request) },
    );
  }

  const url = new URL(request.url);
  const topic = url.searchParams.get("topic");
  const dim1 = url.searchParams.get("dim1");
  const dim2 = url.searchParams.get("dim2");
  const dim3 = url.searchParams.get("dim3");

  // Validate
  const validationError = validateDimensions(topic, dim1, dim2, dim3);
  if (validationError) {
    return Response.json(
      { error: validationError, message: `Invalid request: ${validationError}` },
      { status: 400, headers: corsHeaders(request) },
    );
  }

  try {
    const result = await callInsightsApi(env, topic!, dim1);
    return Response.json(result, { headers: corsHeaders(request) });
  } catch (err) {
    console.error("[insights] Query failed:", err);
    return Response.json(
      { error: "internal_error", message: "Failed to query insights" },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}

/**
 * Format insights as a Markdown table for MCP tool responses.
 */
export function formatInsightsAsMarkdown(result: ApiResponse): string {
  if ("insufficient_data" in result) {
    return [
      `## ${result.topic} insights`,
      "",
      "**Insufficient data**",
      "",
      `This topic doesn't have enough community participation yet. To protect individual privacy, ContextQB only shows aggregate insights when at least **${result.threshold} unique users** have contributed data for a given category.`,
      "",
      "This threshold (called k-anonymity) ensures that no individual's usage patterns can be inferred from the aggregate statistics.",
      "",
      "As more people use ContextQB and opt in to the data cooperative, more insights will become available. You can help by running `contextqb check` on your projects!",
      "",
      "Learn more: [Privacy Policy — Telemetry](https://contextqb.com/privacy/telemetry)",
    ].join("\n");
  }

  const lines = [
    `## ${result.topic} insights`,
    "",
    `**Dimension:** ${result.dim1}`,
    `**Community size:** ${result.n_bucket}`,
    "",
    "| Value | Percentage |",
    "|-------|------------|",
    ...result.percentages.map((p) => `| ${p.value} | ${p.pct.toFixed(1)}% |`),
  ];

  return lines.join("\n");
}
