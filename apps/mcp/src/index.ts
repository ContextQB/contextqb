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
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import contentBundle from "./generated/content-bundle.json";
import { validateToken, register, revoke, status } from "./membership";
import { handleCliTelemetry, recordMcpEvent } from "./telemetry";
import { runAggregation } from "./aggregation";

const SERVER_NAME = "contextqb";
const SERVER_VERSION = "0.1.0";
const URI_SCHEME = "contextqb";

interface Env {
  DB: D1Database;
}

type ContentKind = "principles" | "playbooks" | "audits" | "prompts" | "guides" | "briefings";

interface BundledDocument {
  id: string;
  title: string;
  summary: string;
  body: string;
  tags?: string[];
}

function getDocuments(kind: ContentKind): BundledDocument[] {
  return contentBundle[kind] as BundledDocument[];
}

function getById(kind: ContentKind, id: string): BundledDocument | undefined {
  return getDocuments(kind).find((doc) => doc.id === id);
}

function makeUri(kind: ContentKind, id: string): string {
  return `${URI_SCHEME}://${kind}/${id}`;
}

function renderSummaryList(kind: ContentKind, heading: string): string {
  const docs = getDocuments(kind);
  if (docs.length === 0) {
    return `# ${heading}\n\nNo ${kind} are currently available.\n`;
  }
  const lines = docs.map((d) => `- **${d.title}** (\`${makeUri(kind, d.id)}\`) — ${d.summary}`);
  return `# ${heading}\n\n${lines.join("\n")}\n`;
}

function renderFullDocument(kind: ContentKind, id: string): string {
  const doc = getById(kind, id);
  if (!doc) {
    return `# Not found\n\nNo ${kind.slice(0, -1)} with id \`${id}\` exists.\n\nList available ids by calling the corresponding \`list_*\` tool.\n`;
  }
  return `# ${doc.title}\n\n> ${doc.summary}\n\n_URI:_ \`${makeUri(kind, id)}\`\n\n---\n\n${doc.body}\n`;
}

function buildArchitecturePrinciplesBriefing(): string {
  const principles = getDocuments("principles");
  const sections = principles.map((p) => `## ${p.title}\n\n> ${p.summary}\n\n${p.body}\n`);
  return `# ContextQB — Architecture Principles Briefing\n\n_Use this document as a single, agent-ready briefing on every ContextQB architecture principle._\n\n${sections.join("\n---\n\n")}\n`;
}

function buildAuditInstruction(
  auditId: string,
  targetSystem: string,
  repoPath: string | undefined,
): string {
  const doc = getById("audits", auditId);
  if (!doc) {
    return `# Audit template not found\n\nNo audit template with id \`${auditId}\` exists. Call \`list_audits\` to see available templates.\n`;
  }
  const repoLine = repoPath ? `\nRepository path: ${repoPath}` : "";
  return [
    `# Generated Audit Instruction`,
    ``,
    `**Audit template:** ${doc.title}`,
    `**Target system:** ${targetSystem}${repoLine}`,
    ``,
    `---`,
    ``,
    `## Instruction for the agent`,
    ``,
    `You are performing the *${doc.title}* on the following system:`,
    ``,
    `> ${targetSystem}`,
    ``,
    doc.body,
    ``,
    `---`,
    ``,
    `Produce the document as specified above. Be specific. Quote code. Reference files. Do not write code in the deliverable. End with the implementation plan, not a summary.`,
    ``,
  ].join("\n");
}

function buildFeaturePlanningPrompt(featureDescription: string): string {
  const doc = getById("playbooks", "feature-planning");
  if (!doc) {
    return `# Feature planning playbook not found\n\nThe feature-planning playbook is missing from content packages.\n`;
  }
  return [
    `# Generated Feature Planning Prompt`,
    ``,
    `**Feature to plan:** ${featureDescription}`,
    ``,
    `---`,
    ``,
    `## Instruction for the agent`,
    ``,
    `You are planning the following feature:`,
    ``,
    `> ${featureDescription}`,
    ``,
    doc.body,
    ``,
    `---`,
    ``,
    `Produce the feature plan as specified above. Do not write code yet. Be concrete and reference existing file paths where possible.`,
    ``,
  ].join("\n");
}

function buildRefactorPlanPrompt(scope: string): string {
  const doc = getById("playbooks", "refactor-planning");
  if (!doc) {
    return `# Refactor planning playbook not found\n\nThe refactor-planning playbook is missing from content packages.\n`;
  }
  return [
    `# Generated Refactor Plan Prompt`,
    ``,
    `**Scope:** ${scope}`,
    ``,
    `---`,
    ``,
    `## Instruction for the agent`,
    ``,
    `You are planning a refactor with the following scope:`,
    ``,
    `> ${scope}`,
    ``,
    doc.body,
    ``,
    `---`,
    ``,
    `Produce the refactor plan as specified above. Break it into independently mergeable steps. Do not make sweeping changes.`,
    ``,
  ].join("\n");
}

function buildAntiSpaghettiChecklist(): string {
  const doc = getById("principles", "anti-spaghetti");
  return doc
    ? `# Anti-Spaghetti Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# Anti-Spaghetti Checklist\n\nNot available — principle missing from content packages.\n`;
}

function buildNamingChecklist(): string {
  const doc = getById("principles", "naming-conventions");
  return doc
    ? `# Naming Convention Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# Naming Convention Checklist\n\nNot available — principle missing from content packages.\n`;
}

function buildStateManagementChecklist(): string {
  const principle = getById("principles", "state-ownership");
  const audit = getById("audits", "state-management");
  const parts: string[] = ["# State Management Checklist"];
  if (principle) {
    parts.push("", "## Principle", "", `> ${principle.summary}`, "", principle.body);
  }
  if (audit) {
    parts.push("", "---", "", "## Audit template", "", `> ${audit.summary}`, "", audit.body);
  }
  if (parts.length === 1) {
    parts.push("", "Not available — principle and audit missing from content packages.");
  }
  return parts.join("\n") + "\n";
}

function buildSecurityAuditInstruction(
  auditId: string,
  targetSystem: string,
  repoPath: string | undefined,
): string {
  const doc = getById("audits", auditId);
  if (!doc) {
    return `# Audit template not found\n\nNo audit template with id \`${auditId}\` exists. Call \`list_audits\` to see available templates.\n`;
  }
  if (!doc.tags?.includes("security")) {
    return `# Not a security audit\n\nThe audit template \`${auditId}\` is not a security audit. Use \`generate_audit_instruction\` for non-security audits, or choose a security audit:\n\n- application-security-baseline\n- ai-integration-security\n- secrets-and-credentials\n- authentication-and-authorization\n- public-endpoint-exposure\n- security-regression\n- pre-launch-security\n`;
  }
  const repoLine = repoPath ? `\nRepository path: ${repoPath}` : "";
  return [
    `# Generated Security Audit Instruction`,
    ``,
    `**Audit template:** ${doc.title}`,
    `**Target system:** ${targetSystem}${repoLine}`,
    ``,
    `---`,
    ``,
    `## Instruction for the agent`,
    ``,
    `You are performing a security-focused audit (*${doc.title}*) on the following system:`,
    ``,
    `> ${targetSystem}`,
    ``,
    doc.body,
    ``,
    `---`,
    ``,
    `Produce the security audit document as specified above. Be specific. Reference files and line numbers. Prioritise findings by realistic exploitability, not theoretical severity. End with a prioritised remediation roadmap.`,
    ``,
  ].join("\n");
}

function buildAttackSurfaceChecklist(): string {
  const doc = getById("playbooks", "map-your-attack-surface");
  return doc
    ? `# Attack Surface Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# Attack Surface Checklist\n\nNot available — playbook missing from content packages.\n`;
}

function buildAiIntegrationChecklist(): string {
  const doc = getById("playbooks", "review-your-ai-integration");
  return doc
    ? `# AI Integration Security Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# AI Integration Security Checklist\n\nNot available — playbook missing from content packages.\n`;
}

function buildSecretsAuditChecklist(): string {
  const doc = getById("playbooks", "triage-your-secrets");
  return doc
    ? `# Secrets Audit Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# Secrets Audit Checklist\n\nNot available — playbook missing from content packages.\n`;
}

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);

function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // List tools
  server.tool(
    "list_principles",
    "List every ContextQB architecture principle with its URI, title, and summary.",
    {},
    async () => ({
      content: [{ type: "text", text: renderSummaryList("principles", "ContextQB Principles") }],
    }),
  );

  server.tool(
    "get_principle",
    "Get the full Markdown content of a ContextQB principle by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument("principles", id) }],
    }),
  );

  server.tool(
    "list_playbooks",
    "List every ContextQB playbook with its URI, title, and summary.",
    {},
    async () => ({
      content: [{ type: "text", text: renderSummaryList("playbooks", "ContextQB Playbooks") }],
    }),
  );

  server.tool(
    "get_playbook",
    "Get the full Markdown content of a ContextQB playbook by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument("playbooks", id) }],
    }),
  );

  server.tool(
    "list_audits",
    "List every ContextQB audit template with its URI, title, and summary.",
    {},
    async () => ({
      content: [{ type: "text", text: renderSummaryList("audits", "ContextQB Audit Templates") }],
    }),
  );

  server.tool(
    "get_audit_prompt",
    "Get the full Markdown content of a ContextQB audit template by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument("audits", id) }],
    }),
  );

  server.tool(
    "list_prompts",
    "List every ContextQB reusable agent prompt with its URI, title, and summary.",
    {},
    async () => ({
      content: [{ type: "text", text: renderSummaryList("prompts", "ContextQB Prompts") }],
    }),
  );

  server.tool(
    "get_prompt",
    "Get the full Markdown content of a ContextQB prompt by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument("prompts", id) }],
    }),
  );

  server.tool(
    "list_guides",
    "List every ContextQB guide with its URI, title, and summary. Guides are longer-form teaching frames that sit above principles and playbooks — they help builders think about a problem before solving it.",
    {},
    async () => ({
      content: [{ type: "text", text: renderSummaryList("guides", "ContextQB Guides") }],
    }),
  );

  server.tool(
    "get_guide",
    "Get the full Markdown content of a ContextQB guide by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument("guides", id) }],
    }),
  );

  server.tool(
    "list_briefings",
    "List every ContextQB briefing with its URI, title, and summary. Briefings are short, focused pieces — comparisons, conceptual clarifications, 'X vs Y' distinctions. Each one is framed by a specific question or idea.",
    {},
    async () => ({
      content: [{ type: "text", text: renderSummaryList("briefings", "ContextQB Briefings") }],
    }),
  );

  server.tool(
    "get_briefing",
    "Get the full Markdown content of a ContextQB briefing by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument("briefings", id) }],
    }),
  );

  server.tool(
    "get_architecture_principles",
    "Get a single Markdown briefing document containing every ContextQB architecture principle. Use this to give an agent a full architectural context in one shot.",
    {},
    async () => ({
      content: [{ type: "text", text: buildArchitecturePrinciplesBriefing() }],
    }),
  );

  server.tool(
    "generate_audit_instruction",
    "Generate a complete agent instruction document by combining an audit template with a target system description.",
    {
      audit_id: z.string().describe("The id of the audit template (see list_audits)."),
      target_system: z.string().min(1).describe("A one-line description of the system to audit."),
      repo_path: z
        .string()
        .optional()
        .describe("Optional path to the repo or directory being audited."),
    },
    async ({ audit_id, target_system, repo_path }) => ({
      content: [{ type: "text", text: buildAuditInstruction(audit_id, target_system, repo_path) }],
    }),
  );

  server.tool(
    "generate_feature_planning_prompt",
    "Generate a feature planning prompt by combining the feature-planning playbook with a feature description.",
    {
      feature_description: z.string().min(1).describe("A description of the feature to plan."),
    },
    async ({ feature_description }) => ({
      content: [{ type: "text", text: buildFeaturePlanningPrompt(feature_description) }],
    }),
  );

  server.tool(
    "generate_refactor_plan_prompt",
    "Generate a refactor plan prompt by combining the refactor-planning playbook with a scope description.",
    {
      scope: z
        .string()
        .min(1)
        .describe("The scope of the refactor (e.g. module, feature, or system area)."),
    },
    async ({ scope }) => ({
      content: [{ type: "text", text: buildRefactorPlanPrompt(scope) }],
    }),
  );

  server.tool(
    "get_anti_spaghetti_checklist",
    "Get the ContextQB anti-spaghetti checklist as a Markdown document.",
    {},
    async () => ({
      content: [{ type: "text", text: buildAntiSpaghettiChecklist() }],
    }),
  );

  server.tool(
    "get_naming_convention_checklist",
    "Get the ContextQB naming convention checklist as a Markdown document.",
    {},
    async () => ({
      content: [{ type: "text", text: buildNamingChecklist() }],
    }),
  );

  server.tool(
    "get_state_management_checklist",
    "Get the ContextQB state management checklist, combining the underlying principle and the audit template.",
    {},
    async () => ({
      content: [{ type: "text", text: buildStateManagementChecklist() }],
    }),
  );

  server.tool(
    "generate_security_audit_instruction",
    "Generate a security-focused audit instruction by combining a security audit template with a target system description. Only works with security-tagged audits.",
    {
      audit_id: z.string().describe("The id of the security audit template (see list_audits)."),
      target_system: z.string().min(1).describe("A one-line description of the system to audit."),
      repo_path: z
        .string()
        .optional()
        .describe("Optional path to the repo or directory being audited."),
    },
    async ({ audit_id, target_system, repo_path }) => ({
      content: [
        { type: "text", text: buildSecurityAuditInstruction(audit_id, target_system, repo_path) },
      ],
    }),
  );

  server.tool(
    "get_attack_surface_checklist",
    "Get the ContextQB attack surface mapping checklist. Use this to inventory all public endpoints, secrets, agent capabilities, and third-party trusts in a system.",
    {},
    async () => ({
      content: [{ type: "text", text: buildAttackSurfaceChecklist() }],
    }),
  );

  server.tool(
    "get_ai_integration_checklist",
    "Get the ContextQB AI integration security checklist. Use this to review what an AI integration reads, writes, executes, and what data it sees.",
    {},
    async () => ({
      content: [{ type: "text", text: buildAiIntegrationChecklist() }],
    }),
  );

  server.tool(
    "get_secrets_audit_checklist",
    "Get the ContextQB secrets audit checklist. Use this to inventory all credentials, assess blast radius, check rotation status, and identify exposure risks.",
    {},
    async () => ({
      content: [{ type: "text", text: buildSecretsAuditChecklist() }],
    }),
  );

  // Register resources
  for (const kind of [
    "principles",
    "playbooks",
    "audits",
    "prompts",
    "guides",
    "briefings",
  ] as const) {
    for (const doc of getDocuments(kind)) {
      const uri = makeUri(kind, doc.id);
      server.resource(uri, uri, { mimeType: "text/markdown" }, async () => ({
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: `# ${doc.title}\n\n> ${doc.summary}\n\n${doc.body}\n`,
          },
        ],
      }));
    }
  }

  return server;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/" || url.pathname === "/health") {
      let d1Status: "ok" | "missing" = "missing";
      try {
        const probe = await env.DB.prepare("SELECT 1 AS ok").first<{ ok: number }>();
        d1Status = probe?.ok === 1 ? "ok" : "missing";
      } catch {
        d1Status = "missing";
      }

      return new Response(
        JSON.stringify({
          name: SERVER_NAME,
          version: SERVER_VERSION,
          status: "ok",
          mcp: "/mcp",
          d1: d1Status,
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
      const server = createServer();
      const mcpHandler = createMcpHandler(server);

      // Clone request to read body for telemetry (original is consumed by handler)
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

      // Call the actual MCP handler
      const response = await mcpHandler(request, env, ctx);

      // If this was a tools/call with a valid token, log telemetry asynchronously
      if (toolName) {
        const member = await validateToken(request, env);
        if (!(member instanceof Response)) {
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
      return register(request, env);
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
      const member = await validateToken(request, env);
      if (member instanceof Response) return member;
      return handleCliTelemetry(request, env, member);
    }

    return new Response("Not found", { status: 404 });
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    console.info(
      `[cron] Aggregation triggered at ${new Date().toISOString()}, cron: ${controller.cron}`,
    );
    ctx.waitUntil(runAggregation(env));
  },
} satisfies ExportedHandler<Env>;
