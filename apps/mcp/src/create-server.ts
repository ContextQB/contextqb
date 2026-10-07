/**
 * MCP server construction for the remote Worker.
 *
 * Extracted from index.ts so tests can build the real server (tools and
 * resources) without importing `agents/mcp`, which needs the Workers runtime.
 * index.ts keeps the fetch handler, authentication endpoints, telemetry,
 * rate limits and the scheduled aggregation; behaviour there is unchanged.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { validateToken } from "./membership";
import type { Member } from "./membership";
import { callInsightsApi, formatInsightsAsMarkdown } from "./insights";
import {
  buildSubmitFeedbackResponse,
  submitFeedbackInputShape,
  type SubmitFeedbackInput,
} from "./feedback";
import { maybeAppendUpgradeAdvisory } from "./upgrade-advisory";
import { utcDate } from "./reference-freshness.js";
import {
  renderEditorialStatusLine,
  renderReferenceGroupMarkdown,
  renderReferenceListMarkdown,
  type RenderableGroup,
} from "./reference-render.js";

export const SERVER_NAME = "contextqb";
export const SERVER_VERSION = "0.1.0";
const URI_SCHEME = "contextqb";

export interface Env {
  DB: D1Database;
  // Rate Limiting bindings (ADR-0018, Tranche G).
  // Configured in wrangler.jsonc under "ratelimits".
  MEMBERSHIP_REGISTER_LIMIT: RateLimit;
  MEMBERSHIP_REVOKE_LIMIT: RateLimit;
  TELEMETRY_CLI_LIMIT: RateLimit;
  INSIGHTS_LIMIT: RateLimit;
  // submit_feedback tool throttle (ADR-0029); low ceiling — abuse here would
  // mean spam of the issue tracker or a soft DoS on the MCP endpoint.
  FEEDBACK_LIMIT: RateLimit;
  // Integrity secrets for telemetry ingestion (ADR-0028, Tranche D).
  // JSON array of {v: string, s: string, revoked_at: number | null}.
  // Set via `wrangler secret put INTEGRITY_SECRETS`.
  INTEGRITY_SECRETS?: string;
}

type ContentKind = "principles" | "playbooks" | "audits" | "prompts" | "guides" | "briefings";

export interface BundledDocument {
  id: string;
  title: string;
  summary: string;
  body: string;
  tags?: string[];
  // Editorial state from the atom's `review` frontmatter (raw), so MCP users
  // can see when an atom is still a draft.
  review?: { status: string; last_reviewed?: string };
}

export interface BundledReferenceGroup extends RenderableGroup {
  review?: { status: string; last_reviewed?: string; reviewer?: string; reviewer_notes?: string };
}

export interface ContentBundle {
  version: string;
  generatedAt: string;
  principles: BundledDocument[];
  playbooks: BundledDocument[];
  audits: BundledDocument[];
  prompts: BundledDocument[];
  guides: BundledDocument[];
  briefings: BundledDocument[];
  references: BundledReferenceGroup[];
}

function withEditorialStatus(doc: BundledDocument): string {
  const line = renderEditorialStatusLine(doc.review);
  return line ? `${line}\n\n` : "";
}

function getDocuments(bundle: ContentBundle, kind: ContentKind): BundledDocument[] {
  return bundle[kind];
}

function getById(
  bundle: ContentBundle,
  kind: ContentKind,
  id: string,
): BundledDocument | undefined {
  return getDocuments(bundle, kind).find((doc) => doc.id === id);
}

function makeUri(kind: ContentKind, id: string): string {
  return `${URI_SCHEME}://${kind}/${id}`;
}

function renderSummaryList(bundle: ContentBundle, kind: ContentKind, heading: string): string {
  const docs = getDocuments(bundle, kind);
  if (docs.length === 0) {
    return `# ${heading}\n\nNo ${kind} are currently available.\n`;
  }
  const lines = docs.map((d) => `- **${d.title}** (\`${makeUri(kind, d.id)}\`) — ${d.summary}`);
  return `# ${heading}\n\n${lines.join("\n")}\n`;
}

function renderFullDocument(bundle: ContentBundle, kind: ContentKind, id: string): string {
  const doc = getById(bundle, kind, id);
  if (!doc) {
    return `# Not found\n\nNo ${kind.slice(0, -1)} with id \`${id}\` exists.\n\nList available ids by calling the corresponding \`list_*\` tool.\n`;
  }
  return `# ${doc.title}\n\n> ${doc.summary}\n\n_URI:_ \`${makeUri(kind, id)}\`\n\n${withEditorialStatus(doc)}---\n\n${doc.body}\n`;
}

function buildArchitecturePrinciplesBriefing(bundle: ContentBundle): string {
  const principles = getDocuments(bundle, "principles");
  const sections = principles.map((p) => `## ${p.title}\n\n> ${p.summary}\n\n${p.body}\n`);
  return `# ContextQB — Architecture Principles Briefing\n\n_Use this document as a single, agent-ready briefing on every ContextQB architecture principle._\n\n${sections.join("\n---\n\n")}\n`;
}

function buildAuditInstruction(
  bundle: ContentBundle,
  auditId: string,
  targetSystem: string,
  repoPath: string | undefined,
): string {
  const doc = getById(bundle, "audits", auditId);
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

function buildFeaturePlanningPrompt(bundle: ContentBundle, featureDescription: string): string {
  const doc = getById(bundle, "playbooks", "feature-planning");
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

function buildRefactorPlanPrompt(bundle: ContentBundle, scope: string): string {
  const doc = getById(bundle, "playbooks", "refactor-planning");
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

function buildAntiSpaghettiChecklist(bundle: ContentBundle): string {
  const doc = getById(bundle, "principles", "anti-spaghetti");
  return doc
    ? `# Anti-Spaghetti Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# Anti-Spaghetti Checklist\n\nNot available — principle missing from content packages.\n`;
}

function buildNamingChecklist(bundle: ContentBundle): string {
  const doc = getById(bundle, "principles", "naming-conventions");
  return doc
    ? `# Naming Convention Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# Naming Convention Checklist\n\nNot available — principle missing from content packages.\n`;
}

function buildStateManagementChecklist(bundle: ContentBundle): string {
  const principle = getById(bundle, "principles", "state-ownership");
  const audit = getById(bundle, "audits", "state-management");
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
  bundle: ContentBundle,
  auditId: string,
  targetSystem: string,
  repoPath: string | undefined,
): string {
  const doc = getById(bundle, "audits", auditId);
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

function buildAttackSurfaceChecklist(bundle: ContentBundle): string {
  const doc = getById(bundle, "playbooks", "map-your-attack-surface");
  return doc
    ? `# Attack Surface Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# Attack Surface Checklist\n\nNot available — playbook missing from content packages.\n`;
}

function buildAiIntegrationChecklist(bundle: ContentBundle): string {
  const doc = getById(bundle, "playbooks", "review-your-ai-integration");
  return doc
    ? `# AI Integration Security Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# AI Integration Security Checklist\n\nNot available — playbook missing from content packages.\n`;
}

function buildSecretsAuditChecklist(bundle: ContentBundle): string {
  const doc = getById(bundle, "playbooks", "triage-your-secrets");
  return doc
    ? `# Secrets Audit Checklist\n\n> ${doc.summary}\n\n${doc.body}\n`
    : `# Secrets Audit Checklist\n\nNot available — playbook missing from content packages.\n`;
}

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);

export interface ServerContext {
  env: Env;
  member: Member | null;
  // The content served by this server (the generated bundle in production,
  // a synthetic fixture bundle in tests).
  bundle: ContentBundle;
  // One UTC calendar date per request, used for every reference freshness
  // judgement in the response (ADR-0039). Never a build or bundle date.
  evaluationDate: string;
}

export function createServer(ctx: ServerContext): McpServer {
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
      content: [
        { type: "text", text: renderSummaryList(ctx.bundle, "principles", "ContextQB Principles") },
      ],
    }),
  );

  server.tool(
    "get_principle",
    "Get the full Markdown content of a ContextQB principle by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument(ctx.bundle, "principles", id) }],
    }),
  );

  server.tool(
    "list_playbooks",
    "List every ContextQB playbook with its URI, title, and summary.",
    {},
    async () => ({
      content: [
        { type: "text", text: renderSummaryList(ctx.bundle, "playbooks", "ContextQB Playbooks") },
      ],
    }),
  );

  server.tool(
    "get_playbook",
    "Get the full Markdown content of a ContextQB playbook by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument(ctx.bundle, "playbooks", id) }],
    }),
  );

  server.tool(
    "list_audits",
    "List every ContextQB audit template with its URI, title, and summary.",
    {},
    async () => ({
      content: [
        {
          type: "text",
          text: renderSummaryList(ctx.bundle, "audits", "ContextQB Audit Templates"),
        },
      ],
    }),
  );

  server.tool(
    "get_audit_prompt",
    "Get the full Markdown content of a ContextQB audit template by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument(ctx.bundle, "audits", id) }],
    }),
  );

  server.tool(
    "list_prompts",
    "List every ContextQB reusable agent prompt with its URI, title, and summary.",
    {},
    async () => ({
      content: [
        { type: "text", text: renderSummaryList(ctx.bundle, "prompts", "ContextQB Prompts") },
      ],
    }),
  );

  server.tool(
    "get_prompt",
    "Get the full Markdown content of a ContextQB prompt by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument(ctx.bundle, "prompts", id) }],
    }),
  );

  server.tool(
    "list_guides",
    "List every ContextQB guide with its URI, title, and summary. Guides are longer-form teaching frames that sit above principles and playbooks — they help builders think about a problem before solving it.",
    {},
    async () => ({
      content: [
        { type: "text", text: renderSummaryList(ctx.bundle, "guides", "ContextQB Guides") },
      ],
    }),
  );

  server.tool(
    "get_guide",
    "Get the full Markdown content of a ContextQB guide by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument(ctx.bundle, "guides", id) }],
    }),
  );

  server.tool(
    "list_briefings",
    "List every ContextQB briefing with its URI, title, and summary. Briefings are short, focused pieces — comparisons, conceptual clarifications, 'X vs Y' distinctions. Each one is framed by a specific question or idea.",
    {},
    async () => ({
      content: [
        { type: "text", text: renderSummaryList(ctx.bundle, "briefings", "ContextQB Briefings") },
      ],
    }),
  );

  server.tool(
    "get_briefing",
    "Get the full Markdown content of a ContextQB briefing by id.",
    { id: idSchema },
    async ({ id }) => ({
      content: [{ type: "text", text: renderFullDocument(ctx.bundle, "briefings", id) }],
    }),
  );

  server.tool(
    "get_architecture_principles",
    "Get a single Markdown briefing document containing every ContextQB architecture principle. Use this to give an agent a full architectural context in one shot.",
    {},
    async () => ({
      content: [{ type: "text", text: buildArchitecturePrinciplesBriefing(ctx.bundle) }],
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
      content: [
        {
          type: "text",
          text: buildAuditInstruction(ctx.bundle, audit_id, target_system, repo_path),
        },
      ],
    }),
  );

  server.tool(
    "generate_feature_planning_prompt",
    "Generate a feature planning prompt by combining the feature-planning playbook with a feature description.",
    {
      feature_description: z.string().min(1).describe("A description of the feature to plan."),
    },
    async ({ feature_description }) => ({
      content: [
        { type: "text", text: buildFeaturePlanningPrompt(ctx.bundle, feature_description) },
      ],
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
      content: [{ type: "text", text: buildRefactorPlanPrompt(ctx.bundle, scope) }],
    }),
  );

  server.tool(
    "get_anti_spaghetti_checklist",
    "Get the ContextQB anti-spaghetti checklist as a Markdown document.",
    {},
    async () => ({
      content: [{ type: "text", text: buildAntiSpaghettiChecklist(ctx.bundle) }],
    }),
  );

  server.tool(
    "get_naming_convention_checklist",
    "Get the ContextQB naming convention checklist as a Markdown document.",
    {},
    async () => ({
      content: [{ type: "text", text: buildNamingChecklist(ctx.bundle) }],
    }),
  );

  server.tool(
    "get_state_management_checklist",
    "Get the ContextQB state management checklist, combining the underlying principle and the audit template.",
    {},
    async () => ({
      content: [{ type: "text", text: buildStateManagementChecklist(ctx.bundle) }],
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
        {
          type: "text",
          text: buildSecurityAuditInstruction(ctx.bundle, audit_id, target_system, repo_path),
        },
      ],
    }),
  );

  server.tool(
    "get_attack_surface_checklist",
    "Get the ContextQB attack surface mapping checklist. Use this to inventory all public endpoints, secrets, agent capabilities, and third-party trusts in a system.",
    {},
    async () => ({
      content: [{ type: "text", text: buildAttackSurfaceChecklist(ctx.bundle) }],
    }),
  );

  server.tool(
    "get_ai_integration_checklist",
    "Get the ContextQB AI integration security checklist. Use this to review what an AI integration reads, writes, executes, and what data it sees.",
    {},
    async () => ({
      content: [{ type: "text", text: buildAiIntegrationChecklist(ctx.bundle) }],
    }),
  );

  server.tool(
    "get_secrets_audit_checklist",
    "Get the ContextQB secrets audit checklist. Use this to inventory all credentials, assess blast radius, check rotation status, and identify exposure risks.",
    {},
    async () => ({
      content: [{ type: "text", text: buildSecretsAuditChecklist(ctx.bundle) }],
    }),
  );

  // Community insight tools (token-gated per D10)
  const tokenRequiredMessage =
    "Community insights require a membership token. Run `contextqb membership register` to get one, then configure your MCP client with the token.";

  const insightsUnavailableMessage =
    "Community insights are temporarily unavailable due to a server-side issue on our end — your token and configuration are fine. Please try again later; if this persists, let us know via the submit_feedback tool.";

  // Single guarded pipeline for all community_* tools. Query failures return a
  // clean unavailable message instead of leaking raw D1 errors to MCP clients
  // (feedback capture 2026-07-14-autonomiam-community-tools-d1-error).
  const respondWithCommunityInsights = async (
    topic: string,
    dim1: string | null,
  ): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
    if (!ctx.member) {
      return { content: [{ type: "text", text: tokenRequiredMessage }] };
    }
    try {
      const result = await callInsightsApi(ctx.env, topic, dim1);
      const body = formatInsightsAsMarkdown(result);
      const withAdvisory = await maybeAppendUpgradeAdvisory(ctx.member, ctx.env, body);
      return { content: [{ type: "text", text: withAdvisory }] };
    } catch (err) {
      console.error(`[insights] community tool query failed (topic=${topic}):`, err);
      return { content: [{ type: "text", text: insightsUnavailableMessage }] };
    }
  };

  server.tool(
    "community_stack_trends",
    "Get community-wide stack trends (language distribution, monorepo usage). Counts distinct projects (k≥30). Requires membership token.",
    {
      dim1: z
        .enum(["lang", "mono"])
        .optional()
        .describe(
          "Optional dimension: 'lang' for language distribution, 'mono' for monorepo usage.",
        ),
    },
    async ({ dim1 }) => respondWithCommunityInsights("stack", dim1 ?? null),
  );

  server.tool(
    "community_structure_patterns",
    "Get community-wide project structure patterns (tree entries, routes, decisions). Counts distinct projects (k≥30). Requires membership token.",
    {
      dim1: z
        .enum(["tree_entries", "routes", "decisions"])
        .optional()
        .describe("Optional dimension: 'tree_entries', 'routes', or 'decisions'."),
    },
    async ({ dim1 }) => respondWithCommunityInsights("structure", dim1 ?? null),
  );

  server.tool(
    "community_common_mistakes",
    "Get community-wide common mistakes (validation status distribution). Counts distinct projects (k≥30). Requires membership token.",
    {
      dim1: z
        .enum(["validation_status"])
        .optional()
        .describe("Optional dimension: 'validation_status' for passed/failed distribution."),
    },
    async ({ dim1 }) => respondWithCommunityInsights("mistakes", dim1 ?? null),
  );

  server.tool(
    "community_deploy_distribution",
    "Get community-wide deployment platform distribution. Counts distinct projects (k≥30). Requires membership token.",
    {},
    async () => respondWithCommunityInsights("deploy", null),
  );

  // Adopter feedback channel (ADR-0029). Open tool — no membership token
  // required. Returns three submission paths; does not file the issue itself
  // until ADR-0030 (server-side auth strategy) is Accepted.
  server.tool(
    "submit_feedback",
    "Share field feedback from setting up or using any ContextQB surface (CLI, MCP, methodology, spec, docs). Open to humans and to AI agents acting on behalf of operators. Returns three submission paths (prefilled GitHub issue URL, `gh issue create` command, structured payload for copy-paste) — the agent picks whichever the user can act on. See ADR-0029 for the receiving lifecycle. Use this proactively after a meaningful adoption moment (first successful check, a friction point, a confusing error, or something that worked unusually well).",
    submitFeedbackInputShape,
    async (rawInput) => {
      const input = rawInput as SubmitFeedbackInput;
      return {
        content: [{ type: "text", text: buildSubmitFeedbackResponse(input) }],
      };
    },
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
    for (const doc of getDocuments(ctx.bundle, kind)) {
      const uri = makeUri(kind, doc.id);
      server.resource(uri, uri, { mimeType: "text/markdown" }, async () => ({
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: `# ${doc.title}\n\n> ${doc.summary}\n\n${withEditorialStatus(doc)}${doc.body}\n`,
          },
        ],
      }));
    }
  }

  // Reference tables (ADR-0039): public, no membership token. Freshness uses
  // the request's single evaluation date; the bundle carries raw fields only.
  server.tool(
    "list_references",
    "List the ContextQB reference groups (neutral, dated facts outside the learning sequence).",
    {},
    async () => ({
      content: [{ type: "text", text: renderReferenceListMarkdown(ctx.bundle.references) }],
    }),
  );

  server.tool(
    "get_reference",
    "Get a ContextQB reference group by id (tools, models, pricing, setup), or one entry of it.",
    { id: idSchema, entry: idSchema.optional() },
    async ({ id, entry }) => ({
      content: [{ type: "text", text: renderReference(ctx, id, entry) }],
    }),
  );

  for (const group of ctx.bundle.references) {
    const uri = `${URI_SCHEME}://references/${group.id}`;
    server.resource(uri, uri, { mimeType: "text/markdown" }, async () => ({
      contents: [{ uri, mimeType: "text/markdown", text: renderReference(ctx, group.id) }],
    }));
  }

  return server;
}

function renderReference(ctx: ServerContext, id: string, entryId?: string): string {
  const group = ctx.bundle.references.find((g) => g.id === id);
  if (!group) {
    return `# Not found\n\nNo reference group with id \`${id}\` exists.\n\nList available groups by calling \`list_references\`.\n`;
  }
  return renderReferenceGroupMarkdown(group, {
    evaluationDate: ctx.evaluationDate,
    entryId,
    provenanceNote: `Content bundled ${ctx.bundle.generatedAt}.`,
  });
}

export interface McpRequestDeps {
  bundle: ContentBundle;
  // Defaults to the runtime clock. Injected in tests to prove the read-once
  // wiring; injection says nothing about the deployed clock's behaviour.
  clock?: () => Date;
}

// The per-request entry point used by the Worker's fetch handler for /mcp and
// /sse. Reads the clock exactly once, validates the token exactly once (as
// before), and builds the server for this request. Token gating is unchanged:
// a missing or invalid token yields member = null, and community_* tools then
// return the token-required message.
export async function buildMcpServerForRequest(
  request: Request,
  env: Env,
  deps: McpRequestDeps,
): Promise<{ server: McpServer; member: Member | null; evaluationDate: string }> {
  const evaluationDate = utcDate((deps.clock ?? (() => new Date()))());
  const memberResult = await validateToken(request, env);
  const member = memberResult instanceof Response ? null : memberResult;
  const server = createServer({ env, member, bundle: deps.bundle, evaluationDate });
  return { server, member, evaluationDate };
}
