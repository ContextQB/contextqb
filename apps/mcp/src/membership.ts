/**
 * Membership module — single source of truth for token validation and member mutations.
 *
 * INV-3: This is the ONLY file that reads Authorization header or ?token= query param.
 * INV-5: This is the ONLY file that issues DELETE FROM cli_events or mcp_events.
 *
 * Ref: docs/archive/scopes/0018-data-cooperative.md (Tranche B)
 * Ref: docs/architecture/invariants.md (INV-3, INV-5)
 */

const ANONYMOUS_ID_RE = /^[0-9a-f]{64}$/;
const TOKEN_PREFIX = "mt_";

function generateToken(): string {
  return TOKEN_PREFIX + crypto.randomUUID();
}

export interface Member {
  anonymous_id: string;
  membership_token: string;
  opted_in_at: number;
  revoked_at: number | null;
}

interface Env {
  DB: D1Database;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function errorResponse(error: string, message: string, status: number): Response {
  return jsonResponse({ error, message }, status);
}

/**
 * Validate token from Authorization header or ?token= query param.
 * Returns Member on success, or a 401 Response on failure.
 *
 * INV-3: This is the ONLY function that reads Authorization or ?token=.
 */
export async function validateToken(request: Request, env: Env): Promise<Member | Response> {
  const authHeader = request.headers.get("Authorization");
  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token");

  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else if (queryToken) {
    token = queryToken;
  }

  if (!token) {
    return errorResponse(
      "missing_token",
      "Authorization header or ?token= query param required",
      401,
    );
  }

  const member = await env.DB.prepare(
    "SELECT anonymous_id, membership_token, opted_in_at, revoked_at FROM members WHERE membership_token = ? AND revoked_at IS NULL LIMIT 1",
  )
    .bind(token)
    .first<Member>();

  if (!member) {
    return errorResponse("invalid_token", "Token not found or revoked", 401);
  }

  return member;
}

/**
 * POST /membership/register
 * Accepts { anonymous_id }, generates token, returns { token }.
 * Idempotent: re-registering same anonymous_id returns existing token.
 */
export async function register(request: Request, env: Env): Promise<Response> {
  const contentType = request.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    return errorResponse("invalid_content_type", "Content-Type must be application/json", 415);
  }

  let body: unknown;
  try {
    body = await request.json();
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

  const existing = await env.DB.prepare(
    "SELECT membership_token FROM members WHERE anonymous_id = ? LIMIT 1",
  )
    .bind(anonymous_id)
    .first<{ membership_token: string }>();

  if (existing) {
    return jsonResponse({ token: existing.membership_token });
  }

  const token = generateToken();

  await env.DB.prepare("INSERT INTO members (anonymous_id, membership_token) VALUES (?, ?)")
    .bind(anonymous_id, token)
    .run();

  return jsonResponse({ token });
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
  });
}
