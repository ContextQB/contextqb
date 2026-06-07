/**
 * Upgrade advisory module — appends a footer to community-tool responses when
 * the requesting member's CLI is outdated.
 *
 * INV-CLI-UPD-2: The MCP appends an upgrade advisory to community-tool responses
 * when the requesting member's most recent CLI version is older than
 * CLI_VERSION_LATEST, rate-limited to once per member per 24h.
 *
 * This is the ONLY module that writes to or reads from member_advisory_seen.
 * This is the ONLY module that computes the advisory footer.
 *
 * Ref: docs/architecture/decisions/0036-mcp-cli-freshness-advisory.md
 * Ref: docs/architecture/invariants.md (INV-CLI-UPD-2)
 */

import type { Member } from "./membership.js";

interface Env {
  DB: D1Database;
  CLI_VERSION_LATEST?: string;
}

const DEDUPE_WINDOW_SECONDS = 86400; // 24 hours

/**
 * Compare two semver-ish version strings (X.Y.Z format).
 * Returns true if `current` is strictly older than `latest`.
 * Falls back to string comparison if parsing fails.
 */
function isVersionOlder(current: string, latest: string): boolean {
  const parseSemver = (v: string): [number, number, number] | null => {
    const match = v.match(/^v?(\d+)\.(\d+)\.(\d+)/);
    if (!match || !match[1] || !match[2] || !match[3]) return null;
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
  };

  const currentParts = parseSemver(current);
  const latestParts = parseSemver(latest);

  if (!currentParts || !latestParts) {
    return current < latest;
  }

  const [curMajor, curMinor, curPatch] = currentParts;
  const [latMajor, latMinor, latPatch] = latestParts;

  if (curMajor !== latMajor) return curMajor < latMajor;
  if (curMinor !== latMinor) return curMinor < latMinor;
  return curPatch < latPatch;
}

/**
 * Format the advisory footer text per ADR-0036.
 * Mirrors INV-CLI-UPD-1 stderr notice phrasing.
 */
function formatAdvisoryFooter(currentVersion: string, latestVersion: string): string {
  return [
    "---",
    "",
    `_Advisory: this operator's CLI is on v${currentVersion}; latest is v${latestVersion}. ` +
      "If you're acting on their behalf, mention they may want to run `contextqb upgrade` " +
      "for the install command. (Cooperative aggregates require v2.3.0+; older versions " +
      "still work but are not counted.)_",
  ].join("\n");
}

/**
 * Conditionally append an upgrade advisory footer to a community-tool response body.
 *
 * Returns `body` unchanged when any of these conditions hold:
 * - env.CLI_VERSION_LATEST is unset (defensive — misconfiguration should not crash)
 * - No cli_events rows exist for the member (telemetry opt-out)
 * - Member's cli_version >= CLI_VERSION_LATEST (already current)
 * - Advisory was emitted to this member within the last 24 hours (dedupe)
 *
 * Otherwise, appends the advisory footer and records the emission timestamp.
 */
export async function maybeAppendUpgradeAdvisory(
  member: Member,
  env: Env,
  body: string,
): Promise<string> {
  // Step 1: Check CLI_VERSION_LATEST env var
  const latestVersion = env.CLI_VERSION_LATEST;
  if (!latestVersion) {
    return body;
  }

  // Step 2: Get most recent cli_version for this member
  const latestEvent = await env.DB.prepare(
    `SELECT cli_version FROM cli_events
     WHERE anonymous_id = ?
     ORDER BY event_ts DESC
     LIMIT 1`,
  )
    .bind(member.anonymous_id)
    .first<{ cli_version: string | null }>();

  if (!latestEvent?.cli_version) {
    return body;
  }

  const currentVersion = latestEvent.cli_version;

  // Step 3: Compare versions
  if (!isVersionOlder(currentVersion, latestVersion)) {
    return body;
  }

  // Step 4: Check dedupe window
  const now = Math.floor(Date.now() / 1000);
  const lastSeen = await env.DB.prepare(
    `SELECT last_emitted_at FROM member_advisory_seen WHERE anonymous_id = ?`,
  )
    .bind(member.anonymous_id)
    .first<{ last_emitted_at: number }>();

  if (lastSeen && now - lastSeen.last_emitted_at < DEDUPE_WINDOW_SECONDS) {
    return body;
  }

  // Step 5 & 6: Format footer and record emission
  const footer = formatAdvisoryFooter(currentVersion, latestVersion);

  await env.DB.prepare(
    `INSERT INTO member_advisory_seen (anonymous_id, last_emitted_at)
     VALUES (?, ?)
     ON CONFLICT (anonymous_id) DO UPDATE SET last_emitted_at = excluded.last_emitted_at`,
  )
    .bind(member.anonymous_id, now)
    .run();

  // Step 7: Return body with footer
  return body + "\n\n" + footer;
}
