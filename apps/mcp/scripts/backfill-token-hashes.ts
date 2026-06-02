#!/usr/bin/env tsx
/**
 * One-shot backfill script for membership_token_hash column.
 *
 * Usage: pnpm --filter @contextqb/mcp-worker run backfill:token-hashes
 *
 * This script:
 * 1. Reads all members where membership_token_hash IS NULL
 * 2. Computes sha256(membership_token) for each
 * 3. Updates the membership_token_hash column
 *
 * Idempotent: safe to re-run (skips rows that already have a hash).
 */

import { execSync } from "node:child_process";
import { createHash } from "node:crypto";

const DB_NAME = "contextqb-telemetry";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

interface Member {
  anonymous_id: string;
  membership_token: string;
}

function runD1Query(sql: string): unknown {
  const escaped = sql.replace(/"/g, '\\"');
  const result = execSync(
    `pnpm exec wrangler d1 execute ${DB_NAME} --remote --json --command "${escaped}"`,
    { encoding: "utf-8", cwd: process.cwd() },
  );
  return JSON.parse(result);
}

async function main() {
  console.log("Fetching members with NULL membership_token_hash...");

  const selectResult = runD1Query(
    "SELECT anonymous_id, membership_token FROM members WHERE membership_token_hash IS NULL",
  ) as { results: Member[] }[];

  const members = selectResult[0]?.results ?? [];
  console.log(`Found ${members.length} member(s) to backfill.`);

  if (members.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  for (const member of members) {
    const hash = hashToken(member.membership_token);
    console.log(`Updating ${member.anonymous_id.slice(0, 8)}... → hash ${hash.slice(0, 16)}...`);

    runD1Query(
      `UPDATE members SET membership_token_hash = '${hash}' WHERE anonymous_id = '${member.anonymous_id}'`,
    );
  }

  console.log(`Backfilled ${members.length} member(s).`);

  const verifyResult = runD1Query(
    "SELECT COUNT(*) as count FROM members WHERE membership_token_hash IS NULL",
  ) as { results: { count: number }[] }[];

  const remaining = verifyResult[0]?.results[0]?.count ?? -1;
  if (remaining === 0) {
    console.log("✅ All members now have a hash.");
  } else {
    console.error(`❌ ${remaining} member(s) still have NULL hash.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
