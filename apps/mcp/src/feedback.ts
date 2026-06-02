/**
 * MCP submit_feedback tool — agent-native path for adopters (and their agents)
 * to share what happened during ContextQB setup or daily use.
 *
 * ADR-0029 — external adopter feedback channel (the receiving infrastructure).
 * ADR-0030 — auth strategy for server-side issue filing (deferred; this module
 *            currently returns a prefilled-URL response and does NOT file the
 *            issue itself; flip to server-side filing once 0030 is Accepted).
 *
 * Design notes
 * -------------
 * - This tool is open (no membership token required). Any agent that has the
 *   ContextQB MCP loaded can call it. The goal is **discovery and submission
 *   without leaving the conversation** — adopters often only realise they have
 *   feedback mid-workflow, and friction at intake is what kills capture
 *   systems (ADR-0029).
 *
 * - Until ADR-0030 lands, the handler does not file the GitHub issue itself.
 *   It returns three things to the calling agent:
 *     1. A prefilled GitHub issue-template URL (with title + a deliberately
 *        truncated body teaser — the full body goes via the issue template's
 *        form fields, not via a URL-encoded query param). This sidesteps the
 *        Claude Code #35246 failure mode (URL-encoded markdown exceeds browser
 *        URL limits and 400s).
 *     2. A `gh issue create` command the agent can execute if `gh` is
 *        available locally.
 *     3. The full structured payload as a Markdown block, suitable for
 *        copy-paste into the issue template form fields.
 *
 *   The agent surfaces one of these to the user. When ADR-0030 ships, the
 *   handler gains a fourth path — direct API filing — and returns the issue
 *   URL. The tool's public surface (the Zod schema below) does not change.
 *
 * - Rate-limited by FEEDBACK_LIMIT (low ceiling — abuse here would mean
 *   either spam of the issue tracker or a soft DoS on this endpoint).
 */

import { z } from "zod";

const FEEDBACK_REPO = "ContextQB/contextqb" as const;
const FEEDBACK_TEMPLATE_FILE = "external-adopter-feedback.yml" as const;

const ISSUE_URL_TITLE_MAX = 120;
const ISSUE_URL_BODY_TEASER_MAX = 800;

export const submitFeedbackInputShape = {
  one_line_summary: z
    .string()
    .min(8)
    .max(160)
    .describe("A short, specific summary of what happened. Becomes the issue title prefix."),
  surface: z
    .enum(["cli", "spec", "mcp", "methodology", "docs", "install", "website"])
    .describe(
      "Which ContextQB surface the feedback is about. Use 'install' for first-run friction across multiple surfaces.",
    ),
  adoption_stage: z
    .enum(["discovery", "install", "first-use", "daily-use", "drift-fix", "renewal"])
    .describe("Where in the adopter's journey this happened."),
  severity: z
    .enum(["blocker", "major", "minor", "nit", "praise"])
    .describe("Submitter's read of severity. Triage may adjust."),
  what_happened: z
    .string()
    .min(20)
    .describe(
      "The observation, verbatim where possible. Command output, doc URL, step number. Quote exact words.",
    ),
  what_was_confusing_or_wrong: z
    .string()
    .min(10)
    .describe(
      "The friction in the operator's framing first, ours second. Distinguish 'I expected X, got Y' from 'X seems wrong in general'.",
    ),
  suggested_fix: z
    .string()
    .optional()
    .describe(
      "Optional. If you (or the operator) have a proposal, name it in their words. Not binding on triage.",
    ),
  adopter_name: z
    .string()
    .min(1)
    .max(80)
    .describe(
      "How the adopter would like to be credited. A pseudonym is fine. Required even when anonymised.",
    ),
  agent_identity: z
    .string()
    .optional()
    .describe(
      "If you are an AI agent filing on behalf of an operator, your identity (e.g. 'cursor-claude-opus-4', 'claude-code-cli', 'codex-gpt-5'). Omit if a human is filing.",
    ),
  repo_language: z
    .string()
    .optional()
    .describe("Optional. Primary language of the host repo (e.g. 'TypeScript', 'Python')."),
  repo_framework: z
    .string()
    .optional()
    .describe("Optional. Primary framework/stack (e.g. 'Next.js 15', 'Django 5')."),
  repo_type: z
    .enum(["greenfield", "brownfield"])
    .optional()
    .describe(
      "Optional. Whether ContextQB landed on a new project (greenfield) or an existing one (brownfield).",
    ),
  consent: z
    .enum(["public", "synthesised-only", "private"])
    .default("synthesised-only")
    .describe(
      "What the adopter has agreed we may republish. 'public' allows direct quotes in ADRs/themes; 'synthesised-only' (default) allows pattern citation but no verbatim; 'private' keeps the report internal only.",
    ),
} as const;

export type SubmitFeedbackInput = {
  [K in keyof typeof submitFeedbackInputShape]: z.infer<(typeof submitFeedbackInputShape)[K]>;
};

/**
 * Build the prefilled GitHub issue-template URL. We deliberately send only
 * `title` and a short `body` teaser as query params, because the full body
 * (with markdown tables and code blocks) routinely exceeds browser URL
 * length limits when URL-encoded. The full payload goes into the issue
 * template's structured form fields once the user lands on the form.
 */
function buildIssueUrl(input: SubmitFeedbackInput): string {
  const titleRaw = `[feedback] ${input.one_line_summary}`;
  const title =
    titleRaw.length <= ISSUE_URL_TITLE_MAX
      ? titleRaw
      : `${titleRaw.slice(0, ISSUE_URL_TITLE_MAX - 1)}…`;
  const bodyTeaserRaw = [
    `Surface: ${input.surface}`,
    `Adoption stage: ${input.adoption_stage}`,
    `Severity: ${input.severity}`,
    input.agent_identity ? `Filed by agent: ${input.agent_identity}` : null,
    "",
    "_(Full body follows in the template fields below — this teaser is here because the GitHub issue-URL query param does not safely carry long markdown bodies. Paste the full payload returned by the MCP submit_feedback tool into the form fields.)_",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
  const bodyTeaser =
    bodyTeaserRaw.length <= ISSUE_URL_BODY_TEASER_MAX
      ? bodyTeaserRaw
      : `${bodyTeaserRaw.slice(0, ISSUE_URL_BODY_TEASER_MAX - 1)}…`;
  const params = new URLSearchParams({
    template: FEEDBACK_TEMPLATE_FILE,
    title,
    body: bodyTeaser,
  });
  return `https://github.com/${FEEDBACK_REPO}/issues/new?${params.toString()}`;
}

/**
 * Build the structured payload as a Markdown block. This is what the user
 * (or the agent acting on their behalf) pastes into the issue template form
 * fields — the form has one textarea per field, so the agent can split this
 * block by section name.
 */
function buildStructuredPayload(input: SubmitFeedbackInput): string {
  const lines: string[] = [];
  lines.push("## Structured payload");
  lines.push("");
  lines.push("Paste the matching values into the issue-template fields:");
  lines.push("");
  lines.push("```yaml");
  lines.push(`surface: ${input.surface}`);
  lines.push(`adoption_stage: ${input.adoption_stage}`);
  lines.push(`severity: ${input.severity}`);
  lines.push(
    `submitted_by_agent: ${input.agent_identity ? "Yes" : "No — I am the human operator"}`,
  );
  if (input.agent_identity) {
    lines.push(`agent: ${input.agent_identity}`);
  }
  lines.push(`adopter_name: ${input.adopter_name}`);
  lines.push(`consent: ${input.consent}`);
  if (input.repo_language) lines.push(`language: ${input.repo_language}`);
  if (input.repo_framework) lines.push(`framework: ${input.repo_framework}`);
  if (input.repo_type) lines.push(`repo_type: ${input.repo_type}`);
  lines.push("```");
  lines.push("");
  lines.push("**What you were trying to do / What happened:**");
  lines.push("");
  lines.push(input.what_happened);
  lines.push("");
  lines.push("**What was confusing or wrong:**");
  lines.push("");
  lines.push(input.what_was_confusing_or_wrong);
  if (input.suggested_fix) {
    lines.push("");
    lines.push("**Suggested fix:**");
    lines.push("");
    lines.push(input.suggested_fix);
  }
  return lines.join("\n");
}

/**
 * Build a `gh issue create` shell command the agent can execute if `gh` is
 * available locally. Uses --body-file with a heredoc so long markdown
 * bodies survive shell escaping.
 */
function buildGhCommand(input: SubmitFeedbackInput): string {
  const titleRaw = `[feedback] ${input.one_line_summary}`;
  const title = titleRaw.replace(/"/g, '\\"');
  const labels = ["feedback", "triage", "via:mcp"];
  if (input.agent_identity) labels.push("filed-by-agent");
  const body = [
    `Surface: ${input.surface}`,
    `Adoption stage: ${input.adoption_stage}`,
    `Severity: ${input.severity}`,
    input.agent_identity ? `Filed by agent: ${input.agent_identity}` : "Filed by human",
    `Adopter: ${input.adopter_name}`,
    `Consent: ${input.consent}`,
    "",
    "## What happened",
    "",
    input.what_happened,
    "",
    "## What was confusing or wrong",
    "",
    input.what_was_confusing_or_wrong,
  ];
  if (input.suggested_fix) {
    body.push("");
    body.push("## Suggested fix");
    body.push("");
    body.push(input.suggested_fix);
  }
  body.push("");
  body.push("---");
  body.push("");
  body.push("_Filed via the ContextQB MCP `submit_feedback` tool._");
  const bodyHeredoc = `cat <<'BODY' > /tmp/contextqb-feedback-body.md\n${body.join("\n")}\nBODY`;
  const ghCmd = `gh issue create --repo ${FEEDBACK_REPO} --title "${title}" --body-file /tmp/contextqb-feedback-body.md --label ${labels.join(",")}`;
  return [bodyHeredoc, ghCmd].join("\n");
}

/**
 * Tool handler. Returns a Markdown response containing all three submission
 * paths, in order of decreasing friction. The calling agent picks one to
 * surface to its user.
 *
 * ADR-0030 flip-point: when accepted, this function gains a fourth branch
 * that POSTs to the GitHub Issues REST API and returns the resulting issue
 * URL. The branches above remain as fallbacks for environments where the
 * server-side filing path is unavailable or rate-limited.
 */
export function buildSubmitFeedbackResponse(input: SubmitFeedbackInput): string {
  const issueUrl = buildIssueUrl(input);
  const structuredPayload = buildStructuredPayload(input);
  const ghCommand = buildGhCommand(input);

  return [
    "# Feedback ready to submit",
    "",
    "Thanks for sharing — this MCP tool prepared three submission paths. Pick whichever the user can act on most easily. **The tool did not itself file the issue** (server-side filing is pending ADR-0030); the agent or the user completes the submission via one of the paths below.",
    "",
    "## Path 1 — Open the prefilled issue template in a browser",
    "",
    `[Click to open the issue template with title prefilled](${issueUrl})`,
    "",
    `Or copy the URL: \`${issueUrl}\``,
    "",
    "The URL prefills the title and a short teaser only. Paste the structured payload from Path 3 into the template form fields once the page loads — the full markdown body cannot safely travel via URL query params (see Claude Code issue #35246 for prior art on why).",
    "",
    "## Path 2 — File directly via the GitHub CLI (`gh`)",
    "",
    "If `gh` is installed and authenticated, run:",
    "",
    "```bash",
    ghCommand,
    "```",
    "",
    "This files the issue without leaving the terminal, preserves the full body verbatim, and applies the right labels.",
    "",
    "## Path 3 — Structured payload (for copy-paste into the form)",
    "",
    structuredPayload,
    "",
    "---",
    "",
    "_Filed feedback enters [`feedback/captures/`](https://github.com/ContextQB/contextqb/blob/main/feedback/captures/README.md) on triage. See [ADR-0029](https://github.com/ContextQB/contextqb/blob/main/docs/architecture/decisions/0029-external-adopter-feedback-channel.md) for the lifecycle._",
  ].join("\n");
}
