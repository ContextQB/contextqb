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
 * Ref: docs/scopes/mcp-cli-freshness-advisory.md §10
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
});
