/**
 * Tests for upgrade-advisory.ts — maybeAppendUpgradeAdvisory helper.
 *
 * Five branches per MA.1 spec:
 * 1. outdated, first time, eligible → returns body + footer, INSERT happens
 * 2. outdated, within dedupe → returns body unchanged, no INSERT
 * 3. current → returns body unchanged
 * 4. no cli_events for member → returns body unchanged
 * 5. CLI_VERSION_LATEST unset → returns body unchanged
 *
 * Design: the MCP CLI-freshness advisory scope, §10 (ADR-0036; kept in the
 * private upstream repository).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { maybeAppendUpgradeAdvisory } from "../src/upgrade-advisory.js";
import type { Member } from "../src/membership.js";

const TEST_MEMBER: Member = {
  anonymous_id: "a".repeat(64),
  membership_token_hash: "b".repeat(64),
  opted_in_at: 1700000000,
  revoked_at: null,
};

const TEST_BODY = "## stack insights\n\nSome content here.";

interface MockD1Result<T> {
  results?: T[];
  success: boolean;
  meta: { changes: number };
}

interface MockStatement {
  bind: (...args: unknown[]) => MockStatement;
  first: <T>() => Promise<T | null>;
  run: () => Promise<MockD1Result<unknown>>;
}

/**
 * Real column sets per migrations/. The mock enforces these the way SQLite
 * would — referencing a nonexistent bare column throws. This is the guard
 * that would have caught the `SELECT cli_version FROM cli_events` /
 * `ORDER BY event_ts` bug (feedback capture
 * 2026-07-14-autonomiam-community-tools-d1-error): cli_version lives inside
 * payload_json, and the timestamp column is `ts`, not `event_ts`.
 */
const CLI_EVENTS_COLUMNS = [
  "id",
  "anonymous_id",
  "ts",
  "payload_json",
  "payload_schema_version",
  "project_id",
];

function assertCliEventsColumnsExist(sql: string): void {
  // Strip json_extract(...) expressions, string literals, and AS aliases
  // (output names, not column references), then check that remaining bare
  // identifiers in SELECT/WHERE/ORDER BY are real columns.
  const stripped = sql
    .replace(/json_extract\([^)]*\)/g, "")
    .replace(/'[^']*'/g, "")
    .replace(/\bAS\s+[a-z_][a-z0-9_]*/gi, "");
  const knownKeywords = new Set([
    "select",
    "as",
    "from",
    "cli_events",
    "where",
    "order",
    "by",
    "desc",
    "asc",
    "limit",
    "and",
    "or",
    "is",
    "not",
    "null",
  ]);
  const identifiers = stripped.match(/[a-z_][a-z0-9_]*/gi) ?? [];
  for (const identifier of identifiers) {
    const lower = identifier.toLowerCase();
    if (knownKeywords.has(lower)) continue;
    if (/^\d+$/.test(lower)) continue;
    if (!CLI_EVENTS_COLUMNS.includes(lower)) {
      throw new Error(`D1_ERROR: no such column: ${identifier}: SQLITE_ERROR`);
    }
  }
}

function createMockDb(config: {
  cliVersion?: string | null;
  lastEmittedAt?: number | null;
}): D1Database {
  const mockStatement: MockStatement = {
    bind: vi.fn().mockReturnThis(),
    first: vi.fn().mockImplementation(async () => null),
    run: vi.fn().mockResolvedValue({ success: true, meta: { changes: 1 } }),
  };

  const prepare = vi.fn().mockImplementation((sql: string) => {
    if (sql.includes("FROM cli_events")) {
      assertCliEventsColumnsExist(sql);
      return {
        ...mockStatement,
        first: vi
          .fn()
          .mockResolvedValue(
            config.cliVersion !== undefined ? { cli_version: config.cliVersion } : null,
          ),
      };
    }
    if (sql.includes("FROM member_advisory_seen")) {
      return {
        ...mockStatement,
        first: vi
          .fn()
          .mockResolvedValue(
            config.lastEmittedAt !== undefined ? { last_emitted_at: config.lastEmittedAt } : null,
          ),
      };
    }
    if (sql.includes("INSERT INTO member_advisory_seen")) {
      return mockStatement;
    }
    return mockStatement;
  });

  return { prepare } as unknown as D1Database;
}

describe("maybeAppendUpgradeAdvisory", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-07T12:00:00Z"));
  });

  it("appends footer when outdated, first time, eligible", async () => {
    const db = createMockDb({ cliVersion: "2.1.0", lastEmittedAt: undefined });
    const env = { DB: db, CLI_VERSION_LATEST: "2.4.1" };

    const result = await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(result).toContain(TEST_BODY);
    expect(result).toContain("---");
    expect(result).toContain("Advisory:");
    expect(result).toContain("v2.1.0");
    expect(result).toContain("v2.4.1");
    expect(result).toContain("contextqb upgrade");
    expect(result).toContain("v2.3.0+");
    expect(db.prepare).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO member_advisory_seen"),
    );
  });

  it("returns body unchanged when outdated but within dedupe window", async () => {
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;
    const db = createMockDb({ cliVersion: "2.1.0", lastEmittedAt: oneHourAgo });
    const env = { DB: db, CLI_VERSION_LATEST: "2.4.1" };

    const result = await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(result).toBe(TEST_BODY);
    expect(db.prepare).not.toHaveBeenCalledWith(expect.stringContaining("INSERT"));
  });

  it("returns body unchanged when cli_version is current", async () => {
    const db = createMockDb({ cliVersion: "2.4.1" });
    const env = { DB: db, CLI_VERSION_LATEST: "2.4.1" };

    const result = await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(result).toBe(TEST_BODY);
  });

  it("returns body unchanged when member has no cli_events (telemetry opt-out)", async () => {
    const db = createMockDb({ cliVersion: null });
    const env = { DB: db, CLI_VERSION_LATEST: "2.4.1" };

    const result = await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(result).toBe(TEST_BODY);
    expect(db.prepare).not.toHaveBeenCalledWith(expect.stringContaining("member_advisory_seen"));
  });

  it("returns body unchanged when CLI_VERSION_LATEST is unset", async () => {
    const db = createMockDb({ cliVersion: "2.1.0" });
    const env = { DB: db, CLI_VERSION_LATEST: undefined };

    const result = await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(result).toBe(TEST_BODY);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it("handles version comparison correctly for edge cases", async () => {
    const db = createMockDb({ cliVersion: "2.4.0", lastEmittedAt: undefined });
    const env = { DB: db, CLI_VERSION_LATEST: "2.4.1" };

    const result = await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(result).toContain("Advisory:");
    expect(result).toContain("v2.4.0");
  });

  it("correctly identifies major version differences", async () => {
    const db = createMockDb({ cliVersion: "1.9.9", lastEmittedAt: undefined });
    const env = { DB: db, CLI_VERSION_LATEST: "2.0.0" };

    const result = await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(result).toContain("Advisory:");
  });

  it("returns unchanged when newer version is installed", async () => {
    const db = createMockDb({ cliVersion: "2.5.0" });
    const env = { DB: db, CLI_VERSION_LATEST: "2.4.1" };

    const result = await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(result).toBe(TEST_BODY);
  });

  it("reads cli_version via json_extract and orders by ts (regression: capture 2026-07-14)", async () => {
    const db = createMockDb({ cliVersion: "2.1.0", lastEmittedAt: undefined });
    const env = { DB: db, CLI_VERSION_LATEST: "2.4.1" };

    await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(db.prepare).toHaveBeenCalledWith(
      expect.stringContaining("json_extract(payload_json, '$.cli_version')"),
    );
    expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining("ORDER BY ts DESC"));
  });

  it("returns body unchanged when the DB query throws (advisory is best-effort)", async () => {
    const throwingStatement = {
      bind: vi.fn().mockReturnThis(),
      first: vi
        .fn()
        .mockRejectedValue(new Error("D1_ERROR: no such column: cli_version: SQLITE_ERROR")),
      run: vi.fn(),
    };
    const db = {
      prepare: vi.fn().mockReturnValue(throwingStatement),
    } as unknown as D1Database;
    const env = { DB: db, CLI_VERSION_LATEST: "2.4.1" };
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await maybeAppendUpgradeAdvisory(TEST_MEMBER, env, TEST_BODY);

    expect(result).toBe(TEST_BODY);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
