/**
 * ContextQB MCP Server — Remote (Cloudflare Workers)
 *
 * A stateless MCP server that serves the ContextQB methodology content
 * (principles, playbooks, audits, prompts, guides, briefings) over HTTP
 * using the streamable HTTP transport.
 *
 * Endpoint: POST /mcp (or GET for SSE clients)
 * Deployed to: mcp.contextqb.com
 */

import { createMcpHandler } from "agents/mcp";
import generatedBundle from "./generated/content-bundle.json";
import { validateToken, register, revoke, status } from "./membership";
import { handleCliTelemetry, recordMcpEvent } from "./telemetry";
import { runAggregation } from "./aggregation";
import { handleInsights, corsHeaders } from "./insights";
import { validateIntegrity } from "./integrity";
import {
  SERVER_NAME,
  SERVER_VERSION,
  buildMcpServerForRequest,
  type ContentBundle,
  type Env,
} from "./create-server";

const contentBundle = generatedBundle as unknown as ContentBundle;

/**
 * Build a stable rate-limit key for a request.
 * Prefers an authenticated token when present (Authorization: Bearer),
 * falls back to CF-Connecting-IP. The "ip:" / "token:" prefix prevents collisions
 * between an attacker who knows a victim's IP and the victim's token bucket.
 *
 * Note: Workers Rate Limiting locality is per Cloudflare colo, not global —
 * so a determined attacker spread across regions can multiply this limit by
 * the number of colos they hit. For v1, this is acceptable (raises cost of
 * abuse without introducing global coordination overhead).
 *
 * INV-3: ?token= is read only by validateToken (SSE carve-out). This function
 * reads only Authorization: Bearer for token-based bucketing.
 */
function rateLimitKey(request: Request): string {
  const auth = request.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) {
    return `token:${auth.slice(7)}`;
  }
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  return `ip:${ip}`;
}

const RATE_LIMIT_BODY = JSON.stringify({
  error: "rate_limited",
  message: "Too many requests. Try again in a minute.",
});

/**
 * Apply a rate limit binding to the current request.
 * Returns null when the request is within budget, or a 429 Response when over.
 */
async function enforceRateLimit(
  limiter: RateLimit,
  request: Request,
  extraHeaders: HeadersInit = {},
): Promise<Response | null> {
  const { success } = await limiter.limit({ key: rateLimitKey(request) });
  if (success) return null;
  return new Response(RATE_LIMIT_BODY, {
    status: 429,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Admin: manual aggregation trigger (operator-only, protected by secret header)
    if (url.pathname === "/admin/run-aggregation" && request.method === "POST") {
      const secret = request.headers.get("X-Admin-Secret");
      if (secret !== "contextqb-admin-2026") {
        return Response.json({ error: "unauthorized" }, { status: 401 });
      }
      try {
        await runAggregation(env as Parameters<typeof runAggregation>[0], "manual");
        const lastRun = await env.DB.prepare(
          "SELECT * FROM cron_runs ORDER BY started_at DESC LIMIT 1",
        ).first();
        return Response.json({ ok: true, last_run: lastRun });
      } catch (err) {
        return Response.json(
          { ok: false, error: err instanceof Error ? err.message : String(err) },
          { status: 500 },
        );
      }
    }

    // Health check
    if (url.pathname === "/" || url.pathname === "/health") {
      let d1Status: "ok" | "missing" = "missing";
      try {
        const probe = await env.DB.prepare("SELECT 1 AS ok").first<{ ok: number }>();
        d1Status = probe?.ok === 1 ? "ok" : "missing";
      } catch {
        d1Status = "missing";
      }

      let aggregation: {
        last_run_at: number;
        last_status: string;
        last_rows_written: number;
      } | null = null;
      try {
        const lastRun = await env.DB.prepare(
          "SELECT finished_at, status, rows_written FROM cron_runs ORDER BY started_at DESC LIMIT 1",
        ).first<{ finished_at: number; status: string; rows_written: number }>();
        if (lastRun) {
          aggregation = {
            last_run_at: lastRun.finished_at,
            last_status: lastRun.status,
            last_rows_written: lastRun.rows_written,
          };
        }
      } catch {
        aggregation = null;
      }

      return new Response(
        JSON.stringify({
          name: SERVER_NAME,
          version: SERVER_VERSION,
          status: "ok",
          mcp: "/mcp",
          d1: d1Status,
          aggregation,
          content: {
            principles: contentBundle.principles.length,
            playbooks: contentBundle.playbooks.length,
            audits: contentBundle.audits.length,
            prompts: contentBundle.prompts.length,
            guides: contentBundle.guides.length,
            briefings: contentBundle.briefings.length,
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // MCP endpoint with telemetry middleware
    if (url.pathname === "/mcp" || url.pathname === "/sse" || url.pathname === "/sse/message") {
      const startTime = Date.now();

      // Validate token upfront (for community_* tools and telemetry)
      // Don't return 401 — tools are available without token, community_* just returns a message.
      // buildMcpServerForRequest also reads the runtime clock once for this
      // request's reference freshness labels (ADR-0039).
      const { server, member } = await buildMcpServerForRequest(request, env, {
        bundle: contentBundle,
      });
      const mcpHandler = createMcpHandler(server);

      // Clone request to read body for telemetry (original is consumed by handler)
      // and for the submit_feedback abuse guard (ADR-0029).
      let toolName: string | null = null;
      if (request.method === "POST") {
        try {
          const clonedRequest = request.clone();
          const body = (await clonedRequest.json()) as {
            method?: string;
            params?: { name?: string };
          };
          if (body.method === "tools/call" && body.params?.name) {
            toolName = body.params.name;
          }
        } catch {
          // Body parsing failed; skip telemetry for this request
        }
      }

      // Tool-level rate limit: submit_feedback is open (no membership token)
      // and writes outward to the issue tracker; throttle aggressively per key.
      if (toolName === "submit_feedback") {
        const limited = await enforceRateLimit(env.FEEDBACK_LIMIT, request);
        if (limited) return limited;
      }

      // Call the actual MCP handler
      const response = await mcpHandler(request, env, ctx);

      // If this was a tools/call with a valid token, log telemetry asynchronously
      if (toolName && member) {
        const responseTimeMs = Date.now() - startTime;
        const countryCode = (request.cf?.country as string) ?? null;
        const clientHint = request.headers.get("X-MCP-Client");
        // Fire and forget - don't block the response
        ctx.waitUntil(
          recordMcpEvent(
            env.DB,
            member.anonymous_id,
            toolName,
            responseTimeMs,
            countryCode,
            clientHint,
          ),
        );
      }

      return response;
    }

    // Membership endpoints
    if (url.pathname === "/membership/register") {
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({ error: "method_not_allowed", message: "POST required" }),
          {
            status: 405,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      const limited = await enforceRateLimit(env.MEMBERSHIP_REGISTER_LIMIT, request);
      if (limited) return limited;

      // INV-INT-1: Validate integrity before processing registration
      const rawBody = await request.text();
      const integrityResult = await validateIntegrity(request, rawBody, env);
      if (!integrityResult.valid) {
        return Response.json(
          { error: "integrity_check_failed", reason: integrityResult.reason },
          { status: 403 },
        );
      }

      return register(request, env, rawBody);
    }

    if (url.pathname === "/membership/revoke") {
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({ error: "method_not_allowed", message: "POST required" }),
          {
            status: 405,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      const limited = await enforceRateLimit(env.MEMBERSHIP_REVOKE_LIMIT, request);
      if (limited) return limited;
      const member = await validateToken(request, env);
      if (member instanceof Response) return member;
      return revoke(request, env, member);
    }

    if (url.pathname === "/membership/status") {
      if (request.method !== "GET") {
        return new Response(
          JSON.stringify({ error: "method_not_allowed", message: "GET required" }),
          {
            status: 405,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      const member = await validateToken(request, env);
      if (member instanceof Response) return member;
      return status(request, env, member);
    }

    // Telemetry endpoint
    if (url.pathname === "/telemetry/cli") {
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({ error: "method_not_allowed", message: "POST required" }),
          {
            status: 405,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      const limited = await enforceRateLimit(env.TELEMETRY_CLI_LIMIT, request);
      if (limited) return limited;

      // INV-INT-1: Validate integrity before processing telemetry
      const rawBody = await request.text();
      const integrityResult = await validateIntegrity(request, rawBody, env);
      if (!integrityResult.valid) {
        return Response.json(
          { error: "integrity_check_failed", reason: integrityResult.reason },
          { status: 403 },
        );
      }

      const member = await validateToken(request, env);
      if (member instanceof Response) return member;
      return handleCliTelemetry(request, env, member, rawBody);
    }

    // Insights endpoint (token-gated, CORS-enabled)
    if (url.pathname === "/insights") {
      // Handle CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(request),
        });
      }
      if (request.method !== "GET") {
        return new Response(
          JSON.stringify({ error: "method_not_allowed", message: "GET or OPTIONS required" }),
          {
            status: 405,
            headers: { "Content-Type": "application/json", ...corsHeaders(request) },
          },
        );
      }
      const limited = await enforceRateLimit(env.INSIGHTS_LIMIT, request, corsHeaders(request));
      if (limited) return limited;
      const member = await validateToken(request, env);
      if (member instanceof Response) {
        // Add CORS headers to 401 response so browser can read the error
        return new Response(member.body, {
          status: member.status,
          headers: { ...Object.fromEntries(member.headers.entries()), ...corsHeaders(request) },
        });
      }
      return handleInsights(request, env, member);
    }

    return new Response("Not found", { status: 404 });
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    console.info(
      `[cron] Aggregation triggered at ${new Date().toISOString()}, cron: ${controller.cron}`,
    );
    ctx.waitUntil(runAggregation(env, controller.cron));
  },
} satisfies ExportedHandler<Env>;
