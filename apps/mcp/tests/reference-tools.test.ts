/**
 * Worker reference routing (ADR-0039; B0R-02, B0R-03).
 *
 * Uses the real per-request entry point the fetch handler calls
 * (`buildMcpServerForRequest`) and a real MCP client over the SDK's in-memory
 * transport. References come from the shared synthetic fixtures through the
 * real bundler. The clock is injected: these tests prove that one clock
 * reading is taken per request and used for every reference response, and
 * that token gating is unchanged. They say nothing about Cloudflare's
 * deployed clock behaviour.
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { buildBundle, canonicalSources } from "../scripts/bundle-content";
import {
  buildMcpServerForRequest,
  createServer,
  type ContentBundle,
  type Env,
} from "../src/create-server";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureReferences = path.join(here, "fixtures", "references", "valid");
const emptyDir = path.join(here, "fixtures", "references", "no-such-directory");

// Atoms are synthetic too, so these tests do not depend on the private corpus.
const bundle = {
  ...buildBundle(
    {
      principles: emptyDir,
      playbooks: emptyDir,
      audits: emptyDir,
      prompts: emptyDir,
      guides: emptyDir,
      briefings: emptyDir,
      references: fixtureReferences,
    },
    "2026-10-15T00:00:00.000Z",
    // Synthetic fixtures use reserved `.invalid` hosts; the canonical build never opts in.
    { allowFixtureHosts: true },
  ),
  playbooks: [
    {
      id: "synthetic-draft-playbook",
      title: "Synthetic draft playbook",
      summary: "Fixture atom in draft.",
      body: "Body.",
      review: { status: "draft", last_reviewed: "2026-10-01" },
    },
  ],
} as unknown as ContentBundle;

// D1 stub: no member rows exist, so any presented token is invalid.
const env = {
  DB: {
    prepare: () => ({ bind: () => ({ first: async () => null }) }),
  },
} as unknown as Env;

async function connect(server: McpServer): Promise<Client> {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: "worker-reference-test", version: "0.0.0" });
  await client.connect(clientTransport);
  return client;
}

async function callText(client: Client, name: string, args: Record<string, unknown> = {}) {
  const result = (await client.callTool({ name, arguments: args })) as {
    content: { type: string; text: string }[];
  };
  return result.content.map((c) => c.text).join("\n");
}

function sections(markdown: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const part of markdown.split("\n## ").slice(1)) map.set(part.split(" — ")[0]!.trim(), part);
  return map;
}

function mcpRequest(headers: Record<string, string> = {}): Request {
  return new Request("https://mcp.example.invalid/mcp", { method: "POST", headers });
}

describe("buildMcpServerForRequest — one clock reading per request", () => {
  it("reads the clock exactly once and uses that date for every reference response", async () => {
    const readings = [new Date("2026-11-09T00:00:01Z"), new Date("2026-11-07T00:00:00Z")];
    let clockCalls = 0;
    const clock = () => readings[Math.min(clockCalls++, readings.length - 1)]!;

    const { server, member, evaluationDate } = await buildMcpServerForRequest(mcpRequest(), env, {
      bundle,
      clock,
    });
    expect(clockCalls).toBe(1);
    expect(evaluationDate).toBe("2026-11-09");
    expect(member).toBeNull();

    const client = await connect(server);
    const first = await callText(client, "get_reference", { id: "tools" });
    const second = await callText(client, "get_reference", {
      id: "tools",
      entry: "synthetic-coding-agents",
    });
    const resource = await client.readResource({ uri: "contextqb://references/tools" });

    expect(clockCalls).toBe(1);
    for (const text of [first, second, (resource.contents[0] as { text: string }).text]) {
      expect(text).toContain("_Evaluated on 2026-11-09 (UTC)._");
      expect(text).toContain("Content bundled 2026-10-15T00:00:00.000Z.");
      expect(text).toContain("Review overdue (was due by 2026-11-08)");
    }
  });

  it("a later request takes its own reading", async () => {
    const early = await buildMcpServerForRequest(mcpRequest(), env, {
      bundle,
      clock: () => new Date("2026-11-08T23:59:59Z"),
    });
    const late = await buildMcpServerForRequest(mcpRequest(), env, {
      bundle,
      clock: () => new Date("2026-11-09T00:00:00Z"),
    });
    const earlyText = await callText(await connect(early.server), "get_reference", { id: "tools" });
    const lateText = await callText(await connect(late.server), "get_reference", { id: "tools" });
    expect(earlyText).not.toContain("Review overdue");
    expect(lateText).toContain("Review overdue (was due by 2026-11-08)");
  });
});

describe("token gating is unchanged", () => {
  it("serves reference tools without a token while community tools still require one", async () => {
    const { server } = await buildMcpServerForRequest(mcpRequest(), env, { bundle });
    const client = await connect(server);
    expect(await callText(client, "list_references")).toContain("contextqb://references/tools");
    expect(await callText(client, "community_stack_trends")).toContain(
      "Community insights require a membership token",
    );
  });

  it("treats an unknown token as no member", async () => {
    const { server, member } = await buildMcpServerForRequest(
      mcpRequest({ Authorization: "Bearer not-a-real-token" }),
      env,
      { bundle },
    );
    expect(member).toBeNull();
    const client = await connect(server);
    expect(await callText(client, "community_deploy_distribution")).toContain(
      "Community insights require a membership token",
    );
  });
});

describe("rendering rules on the Worker surface", () => {
  // A fresh server per test: an MCP server accepts one transport connection.
  const freshServer = () =>
    createServer({ env, member: null, bundle, evaluationDate: "2026-11-09" });

  it("never exposes unchecked values, leads or tombstone payloads", async () => {
    const client = await connect(freshServer());
    const text = await callText(client, "get_reference", { id: "tools" });
    const s = sections(text);
    expect(s.get("synthetic-unverified")).toContain("Not verified — do not rely on this entry.");
    expect(s.get("synthetic-unverified")).not.toContain("Verified on");
    expect(s.get("synthetic-retired")).toContain("Withdrawn on 2026-10-10");
    expect(s.get("synthetic-retired-alone")).toContain("No replacement.");
    for (const id of ["synthetic-retired", "synthetic-retired-alone"]) {
      expect(s.get(id)).not.toMatch(/Verified on|\| Subject \|/u);
    }
    expect(text).not.toMatch(/lead-canary\.example\.invalid|LEAD-CANARY/u);
  });

  it("lists reference resources and reports unknown groups", async () => {
    const client = await connect(freshServer());
    const uris = (await client.listResources()).resources.map((r) => r.uri);
    expect(uris).toEqual(
      expect.arrayContaining([
        "contextqb://references/tools",
        "contextqb://references/pricing",
        "contextqb://references/setup",
      ]),
    );
    expect(await callText(client, "get_reference", { id: "models" })).toContain(
      "No reference group with id `models`",
    );
  });

  it("shows an atom's editorial status in tool and resource responses", async () => {
    const client = await connect(freshServer());
    expect(await callText(client, "get_playbook", { id: "synthetic-draft-playbook" })).toContain(
      "_Editorial status:_ draft (last reviewed 2026-10-01)",
    );
    const read = await client.readResource({
      uri: "contextqb://playbooks/synthetic-draft-playbook",
    });
    expect((read.contents[0] as { text: string }).text).toContain("_Editorial status:_ draft");
  });

  it("builds an empty reference list from the canonical (empty) directory", () => {
    const canonical = buildBundle({ ...canonicalSources, references: emptyDir });
    expect(canonical.references).toEqual([]);
  });
});

describe("the bundler enforces the shared integrity rules (B0I-01)", () => {
  function withEditedTools<T>(find: string, replace: string, fn: (dir: string) => T): T {
    const dir = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "cqb-worker-refs-"));
    try {
      for (const file of fs.readdirSync(fixtureReferences)) {
        fs.copyFileSync(path.join(fixtureReferences, file), path.join(dir, file));
      }
      const tools = path.join(dir, "tools.md");
      const before = fs.readFileSync(tools, "utf8");
      expect(before).toContain(find);
      fs.writeFileSync(tools, before.replace(find, replace));
      return fn(dir);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  it("refuses a row that cites missing evidence", () => {
    withEditedTools("evidence: [e1]", "evidence: [missing-proof]", (dir) => {
      expect(() =>
        buildBundle({ ...canonicalSources, references: dir }, undefined, {
          allowFixtureHosts: true,
        }),
      ).toThrow(/cites unknown evidence id "missing-proof"/u);
    });
  });

  it("refuses a replacement that points at a withdrawn entry", () => {
    withEditedTools(
      "withdrawn_reason: Fixture tombstone with a replacement.\n    replaced_by: tools#synthetic-coding-agents",
      "withdrawn_reason: Fixture tombstone with a replacement.\n    replaced_by: tools#synthetic-retired-alone",
      (dir) => {
        expect(() =>
          buildBundle({ ...canonicalSources, references: dir }, undefined, {
            allowFixtureHosts: true,
          }),
        ).toThrow(/must be a current or legacy entry, not withdrawn/u);
      },
    );
  });

  it("refuses fixture hostnames unless explicitly allowed", () => {
    expect(() => buildBundle({ ...canonicalSources, references: fixtureReferences })).toThrow(
      /fixture hostname [a-z.-]+\.invalid in canonical reference content/u,
    );
  });
});
