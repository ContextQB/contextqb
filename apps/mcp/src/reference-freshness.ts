// Reference freshness: derived, never stored (ADR-0039).
//
// This module is deliberately dependency-free so the remote MCP Worker can
// carry a byte-identical copy (apps/mcp/src/reference-freshness.ts) without
// importing the private content package. scripts/tests/reference-parity.test.ts
// fails if the two copies differ. Edit both together.
//
// Nothing here reads a clock. Callers pass the evaluation date: the website
// passes the reader's browser date at view time, the stdio MCP server the
// process date per call, the Worker one runtime-clock snapshot per request,
// and the validator the date of its run.

export type ReferenceEntryStatus = "current" | "legacy" | "unverified" | "withdrawn";

export type ReferenceFreshnessState = "current" | "overdue" | "legacy" | "unverified" | "withdrawn";

export interface ReferenceFreshness {
  state: ReferenceFreshnessState;
  reviewBy?: string;
}

export interface FreshnessInput {
  status: ReferenceEntryStatus;
  review_by?: string;
}

export interface VerifiedOnInput {
  status: ReferenceEntryStatus;
  facts?: ReadonlyArray<{ evidence?: ReadonlyArray<string> }>;
  evidence?: ReadonlyArray<{ id: string; checked_on: string }>;
}

// UTC calendar date ("YYYY-MM-DD") of an instant.
export function utcDate(instant: Date): string {
  return instant.toISOString().slice(0, 10);
}

// ISO calendar dates compare correctly as strings. An entry is overdue from
// the UTC day after `review_by`; on the `review_by` date itself it is not.
export function deriveFreshness(entry: FreshnessInput, evaluationDate: string): ReferenceFreshness {
  switch (entry.status) {
    case "withdrawn":
      return { state: "withdrawn" };
    case "unverified":
      return { state: "unverified" };
    case "legacy":
      return { state: "legacy" };
    case "current":
      if (entry.review_by !== undefined && evaluationDate > entry.review_by) {
        return { state: "overdue", reviewBy: entry.review_by };
      }
      return entry.review_by !== undefined
        ? { state: "current", reviewBy: entry.review_by }
        : { state: "current" };
  }
}

// "Verified on" is derived from the evidence the entry's rows cite: the
// earliest cited `checked_on`. Only current and legacy entries can have one.
export function deriveVerifiedOn(entry: VerifiedOnInput): string | undefined {
  if (entry.status !== "current" && entry.status !== "legacy") return undefined;
  const cited = new Set<string>();
  for (const fact of entry.facts ?? []) {
    for (const id of fact.evidence ?? []) cited.add(id);
  }
  let earliest: string | undefined;
  for (const item of entry.evidence ?? []) {
    if (!cited.has(item.id)) continue;
    if (earliest === undefined || item.checked_on < earliest) earliest = item.checked_on;
  }
  return earliest;
}

// The live label shown next to an entry. Returns null when the stored facts
// already say everything (no label beyond the static dates).
export function formatFreshnessLabel(freshness: ReferenceFreshness): string | null {
  if (freshness.state === "overdue" && freshness.reviewBy !== undefined) {
    return `Review overdue (was due by ${freshness.reviewBy})`;
  }
  return null;
}
