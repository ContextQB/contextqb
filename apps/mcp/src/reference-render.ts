// Markdown rendering of reference groups for MCP responses (ADR-0039).
//
// Dependency-free on purpose: the remote MCP Worker carries a byte-identical
// copy (apps/mcp/src/reference-render.ts) because it cannot import the private
// content package. scripts/tests/reference-parity.test.ts fails if the copies
// or their outputs differ. Edit both together.
//
// Rendering rules by stored state:
//   current     facts, evidence, derived "Verified on", review date/trigger, live label
//   legacy      facts, evidence, derived "Verified on", "describes an older version"
//   unverified  "Not verified" notice and candidate subjects only — never values
//   withdrawn   tombstone: date, reason, replacement or "No replacement"
// Leads are never rendered.
//
// Response policy for prices: every group or entry response from a pricing
// group starts with PRICING_RESPONSE_NOTICE, before any value, whatever the
// entries' freshness. The notice is response text, not stored content, and it
// carries no date of its own: verification dates stay per entry ("Verified on",
// derived from cited evidence). The policy keys on the group, not on keyword
// detection; reference tests keep currency figures out of the other groups.

import {
  deriveFreshness,
  deriveVerifiedOn,
  formatFreshnessLabel,
  type ReferenceEntryStatus,
} from "./reference-freshness.js";

export interface RenderableFact {
  subject: string;
  value?: string;
  applies_to?: string;
  units?: string;
  conditions?: string;
  snippet?: { language: string; text: string };
  note?: string;
  evidence?: string[];
}

export interface RenderableEvidence {
  id: string;
  url: string;
  checked_on: string;
  source_kind: string;
  locator: string;
}

export interface RenderableEntry {
  id: string;
  title: string;
  role: string;
  owner: string;
  status: ReferenceEntryStatus;
  facts?: RenderableFact[];
  evidence?: RenderableEvidence[];
  limits?: string;
  review_by?: string;
  review_trigger?: string;
  replaced_by?: string;
  withdrawn_on?: string;
  withdrawn_reason?: string;
  further_reading?: { title: string; url: string; published_on: string }[];
}

export interface RenderableGroup {
  id: string;
  title: string;
  summary: string;
  version: string;
  maintainer: string;
  body: string;
  entries: RenderableEntry[];
}

export interface ReferenceRenderOptions {
  // UTC calendar date used for every freshness judgement in this response.
  evaluationDate: string;
  // Render only this entry when set.
  entryId?: string;
  // Extra provenance line (the Worker passes its bundle timestamp).
  provenanceNote?: string;
}

export const REFERENCE_SCOPE_NOTE =
  "Reference — factual, dated, outside the learning sequence. Neutral facts only; no recommendations.";

// Groups whose responses always carry the pricing notice (ADR-0039 "pricing,
// limits and defaults"). Approved October 7, 2026: prices stay available to
// agents, but never without this caveat.
export const PRICING_REFERENCE_GROUP_IDS: readonly string[] = ["pricing"];

export const PRICING_RESPONSE_NOTICE =
  "Pricing is a dated reference, not a live quote. Current prices, plans and billing conditions may differ. Check the provider's official pricing page before making a purchase or budget decision. When presenting these figures to a user, include this caveat and the recorded verification date; do not describe them as current unless you have checked the official source during this interaction.";

export const PRICING_DATE_NOTE =
  'Each verified entry\'s recorded verification date is its "Verified on" line. The evaluation date and review dates in this response are not verification dates.';

export function isPricingReferenceGroup(groupId: string): boolean {
  return PRICING_REFERENCE_GROUP_IDS.includes(groupId);
}

function cell(text: string | undefined): string {
  return (text ?? "").replace(/\|/gu, "\\|").replace(/\r?\n/gu, " ");
}

function sortedFacts(facts: RenderableFact[] | undefined): RenderableFact[] {
  return [...(facts ?? [])].sort((a, b) => a.subject.localeCompare(b.subject));
}

function renderVerifiedBody(entry: RenderableEntry, lines: string[]): void {
  const facts = sortedFacts(entry.facts);
  const withUnits = facts.some((f) => f.units !== undefined || f.conditions !== undefined);
  if (withUnits) {
    lines.push("| Subject | Value | Applies to | Units | Conditions | Evidence |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
  } else {
    lines.push("| Subject | Value | Applies to | Evidence |");
    lines.push("| --- | --- | --- | --- |");
  }
  for (const fact of facts) {
    const evidence = (fact.evidence ?? []).join(", ");
    lines.push(
      withUnits
        ? `| ${cell(fact.subject)} | ${cell(fact.value)} | ${cell(fact.applies_to)} | ${cell(fact.units)} | ${cell(fact.conditions)} | ${cell(evidence)} |`
        : `| ${cell(fact.subject)} | ${cell(fact.value)} | ${cell(fact.applies_to)} | ${cell(evidence)} |`,
    );
  }
  lines.push("");
  const notes = facts.filter((fact) => fact.note);
  for (const fact of notes) lines.push(`- _${fact.subject}:_ ${fact.note}`);
  if (notes.length > 0) lines.push("");
  for (const fact of facts) {
    if (fact.snippet) {
      lines.push(`**${fact.subject}** (${fact.snippet.language}):`, "");
      lines.push("```" + fact.snippet.language, fact.snippet.text, "```", "");
    }
  }
  lines.push("**Evidence:**", "");
  for (const item of entry.evidence ?? []) {
    lines.push(
      `- [${item.id}] ${item.url} — checked ${item.checked_on}; ${item.source_kind}; ${item.locator}`,
    );
  }
  lines.push("");
  if (entry.limits) lines.push(`**Limits:** ${entry.limits}`, "");
  if (entry.further_reading && entry.further_reading.length > 0) {
    lines.push("**External analysis (dated, editorial; not part of this factual table):**", "");
    for (const item of entry.further_reading) {
      lines.push(`- ${item.title} — ${item.url} (published ${item.published_on})`);
    }
    lines.push("");
  }
}

export function renderReferenceEntryMarkdown(
  entry: RenderableEntry,
  evaluationDate: string,
): string {
  const lines: string[] = [`## ${entry.id} — ${entry.title}`, "", entry.role, ""];
  const freshness = deriveFreshness(entry, evaluationDate);

  switch (entry.status) {
    case "current": {
      const label = formatFreshnessLabel(freshness);
      const review = entry.review_by
        ? `review by ${entry.review_by}`
        : `review when: ${entry.review_trigger ?? "unspecified"}`;
      lines.push(`**Status:** current — ${review}${label ? ` — **${label}**` : ""}`, "");
      const verifiedOn = deriveVerifiedOn(entry);
      if (verifiedOn) lines.push(`**Verified on:** ${verifiedOn}`);
      lines.push("");
      renderVerifiedBody(entry, lines);
      break;
    }
    case "legacy": {
      lines.push("**Status:** legacy — describes an older version", "");
      const verifiedOn = deriveVerifiedOn(entry);
      if (verifiedOn) lines.push(`**Verified on:** ${verifiedOn}`, "");
      if (entry.replaced_by) {
        lines.push(`**Replaced by:** \`contextqb://references/${entry.replaced_by}\``);
      }
      lines.push("");
      renderVerifiedBody(entry, lines);
      break;
    }
    case "unverified": {
      lines.push("**Status:** Not verified — do not rely on this entry.", "");
      for (const fact of sortedFacts(entry.facts)) {
        lines.push(fact.note ? `- ${fact.subject} — ${fact.note}` : `- ${fact.subject}`);
      }
      lines.push("");
      break;
    }
    case "withdrawn": {
      lines.push(
        `**Status:** Withdrawn on ${entry.withdrawn_on ?? "unknown date"}: ${entry.withdrawn_reason ?? ""}`,
        "",
      );
      lines.push(
        entry.replaced_by
          ? `**Replaced by:** \`contextqb://references/${entry.replaced_by}\``
          : "No replacement.",
      );
      lines.push("");
      break;
    }
  }
  lines.push(`_Owner:_ ${entry.owner}`, "");
  return lines.join("\n");
}

export function renderReferenceGroupMarkdown(
  group: RenderableGroup,
  options: ReferenceRenderOptions,
): string {
  const entries = options.entryId
    ? group.entries.filter((entry) => entry.id === options.entryId)
    : group.entries;
  if (options.entryId && entries.length === 0) {
    return `# Not found\n\nNo entry \`${options.entryId}\` in reference group \`${group.id}\`.\n`;
  }
  const lines: string[] = [
    `# ${group.title}`,
    "",
    `> ${group.summary}`,
    "",
    `_URI:_ \`contextqb://references/${group.id}\` · _version_ ${group.version} · _maintainer_ ${group.maintainer}`,
    "",
    `_${REFERENCE_SCOPE_NOTE}_`,
    "",
  ];
  if (isPricingReferenceGroup(group.id)) {
    lines.push(
      `> **Pricing notice:** ${PRICING_RESPONSE_NOTICE}`,
      ">",
      `> ${PRICING_DATE_NOTE}`,
      "",
    );
  }
  lines.push(
    `_Evaluated on ${options.evaluationDate} (UTC)._${options.provenanceNote ? ` ${options.provenanceNote}` : ""}`,
    "",
  );
  if (!options.entryId && group.body.trim().length > 0) lines.push(group.body.trim(), "");
  lines.push("---", "");
  for (const entry of entries)
    lines.push(renderReferenceEntryMarkdown(entry, options.evaluationDate));
  return lines.join("\n").trimEnd() + "\n";
}

export function renderReferenceListMarkdown(groups: readonly RenderableGroup[]): string {
  if (groups.length === 0) {
    return `# References\n\n_${REFERENCE_SCOPE_NOTE}_\n\nNo reference groups are published yet. Entries are added only after primary-source verification.\n`;
  }
  const lines = groups.map(
    (group) =>
      `- **${group.title}** (\`contextqb://references/${group.id}\`) — ${group.summary} (${group.entries.length} entries)`,
  );
  return `# References\n\n_${REFERENCE_SCOPE_NOTE}_\n\n${lines.join("\n")}\n`;
}

// Editorial status line for atom responses (both MCP servers), so a draft
// atom is visibly a draft. Lives here so the Worker copy stays identical.
export function renderEditorialStatusLine(
  review: { status: string; last_reviewed?: string } | undefined,
): string | null {
  if (!review) return null;
  const reviewed =
    review.last_reviewed && review.last_reviewed.length > 0
      ? ` (last reviewed ${review.last_reviewed})`
      : "";
  return `_Editorial status:_ ${review.status}${reviewed}`;
}
