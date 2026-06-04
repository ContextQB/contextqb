/**
 * Membership module — single source of truth for token validation and member mutations.
 *
 * INV-3: This is the ONLY file that reads Authorization header or ?token= query param.
 * INV-5: This is the ONLY file that issues DELETE FROM cli_events or mcp_events.
 * INV-TOK-1: Tokens stored as sha256(token); plaintext only on client + wire.
 *
 * Ref: docs/archive/scopes/0018-data-cooperative.md (Tranche B)
 * Ref: docs/architecture/invariants.md (INV-3, INV-5)
 */

const ANONYMOUS_ID_RE = /^[0-9a-f]{64}$/;
const TOKEN_PREFIX = "mt_";

function generateToken(): string {
  return TOKEN_PREFIX + crypto.randomUUID();
}

/**
 * Hash a token using SHA-256. Output is lowercase hex (64 chars).
 * No salt — tokens are random UUIDs, so rainbow-table risk is nil.
 */
async function hashToken(token: string): Promise<string> {
  const encoded = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface Member {
  anonymous_id: string;
  membership_token_hash: string;
  opted_in_at: number;
  revoked_at: number | null;
}

interface Env {
  DB: D1Database;
  CLI_VERSION_LATEST?: string;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function errorResponse(
  error: string,
  message: string,
  status: number,
  extra?: Record<string, unknown>,
): Response {
  return jsonResponse({ error, message, ...extra }, status);
}

/**
 * Validate token from Authorization header or ?token= query param.
 * Returns Member on success, or a 401 Response on failure.
 *
 * INV-3: This is the ONLY function that reads Authorization or ?token=.
 * ?token= is accepted ONLY for SSE endpoints (pathname starts with /sse).
 * All other endpoints require Authorization: Bearer.
 */
export async function validateToken(request: Request, env: Env): Promise<Member | Response> {
  const authHeader = request.headers.get("Authorization");
  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token");
  const isSSE = url.pathname.startsWith("/sse");

  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else if (queryToken && isSSE) {
    token = queryToken;
  }

  if (!token) {
    const hint = isSSE
      ? "Authorization header or ?token= query param required"
      : "Authorization: Bearer <token> header required";
    return errorResponse("missing_token", hint, 401);
  }

  const tokenHash = await hashToken(token);
  const member = await env.DB.prepare(
    "SELECT anonymous_id, membership_token_hash, opted_in_at, revoked_at FROM members WHERE membership_token_hash = ? AND revoked_at IS NULL LIMIT 1",
  )
    .bind(tokenHash)
    .first<Member>();

  if (!member) {
    return errorResponse("invalid_token", "Token not found or revoked", 401);
  }

  return member;
}

/**
 * POST /membership/register
 * Accepts { anonymous_id }, generates token, returns { token }.
 *
 * Race-safe: uses INSERT ... ON CONFLICT DO NOTHING. If a concurrent request
 * wins the race, returns 409 with token_lost: true (the loser cannot recover
 * the winner's plaintext token because we only store hashes).
 */
export async function register(request: Request, env: Env, rawBody?: string): Promise<Response> {
  const contentType = request.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    return errorResponse("invalid_content_type", "Content-Type must be application/json", 415);
  }

  let body: unknown;
  try {
    body = rawBody !== undefined ? JSON.parse(rawBody) : await request.json();
  } catch {
    return errorResponse("invalid_json", "Request body must be valid JSON", 400);
  }

  if (typeof body !== "object" || body === null || !("anonymous_id" in body)) {
    return errorResponse("invalid_body", "Request body must contain anonymous_id", 400);
  }

  const { anonymous_id } = body as { anonymous_id: unknown };

  if (typeof anonymous_id !== "string" || !ANONYMOUS_ID_RE.test(anonymous_id)) {
    return errorResponse(
      "invalid_anonymous_id",
      "anonymous_id must be a 64-character lowercase hex string",
      400,
    );
  }

  const token = generateToken();
  const tokenHash = await hashToken(token);

  const inserted = await env.DB.prepare(
    "INSERT INTO members (anonymous_id, membership_token, membership_token_hash) VALUES (?, ?, ?) ON CONFLICT (anonymous_id) DO NOTHING RETURNING membership_token_hash",
  )
    .bind(anonymous_id, token, tokenHash)
    .first<{ membership_token_hash: string }>();

  if (inserted) {
    return jsonResponse({ token, cli_version_latest: env.CLI_VERSION_LATEST });
  }

  return errorResponse(
    "already_registered",
    "This anonymous_id is already registered. If you lost your token, re-register with a new anonymous_id.",
    409,
    { token_lost: true },
  );
}

/**
 * POST /membership/revoke
 * Requires valid token. Marks member as revoked and DELETES all their events.
 *
 * INV-5: This is the ONLY function that issues DELETE FROM cli_events or mcp_events.
 */
export async function revoke(_request: Request, env: Env, member: Member): Promise<Response> {
  const results = await env.DB.batch([
    env.DB.prepare("UPDATE members SET revoked_at = unixepoch() WHERE anonymous_id = ?").bind(
      member.anonymous_id,
    ),
    env.DB.prepare("DELETE FROM cli_events WHERE anonymous_id = ?").bind(member.anonymous_id),
    env.DB.prepare("DELETE FROM mcp_events WHERE anonymous_id = ?").bind(member.anonymous_id),
  ]);

  const cliDeleted = results[1]?.meta?.changes ?? 0;
  const mcpDeleted = results[2]?.meta?.changes ?? 0;

  return jsonResponse({
    ok: true,
    deleted: {
      cli_events: cliDeleted,
      mcp_events: mcpDeleted,
    },
    cli_version_latest: env.CLI_VERSION_LATEST,
  });
}

/**
 * GET /membership/status
 * Requires valid token. Returns member info and event counts.
 */
export async function status(_request: Request, env: Env, member: Member): Promise<Response> {
  const [cliCount, mcpCount] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) as count FROM cli_events WHERE anonymous_id = ?")
      .bind(member.anonymous_id)
      .first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) as count FROM mcp_events WHERE anonymous_id = ?")
      .bind(member.anonymous_id)
      .first<{ count: number }>(),
  ]);

  return jsonResponse({
    anonymous_id: member.anonymous_id,
    opted_in_at: member.opted_in_at,
    revoked_at: member.revoked_at,
    event_counts: {
      cli: cliCount?.count ?? 0,
      mcp: mcpCount?.count ?? 0,
    },
    cli_version_latest: env.CLI_VERSION_LATEST,
  });
}
