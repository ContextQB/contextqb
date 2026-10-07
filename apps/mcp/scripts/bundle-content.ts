/**
 * Pre-build script: bundles all ContextQB content into a JSON file
 * that gets embedded into the Worker at deploy time.
 *
 * Run via: pnpm prebuild (happens automatically before build/dev/deploy)
 *
 * This script directly reads markdown files instead of going through
 * @contextqb/content because the content loader relies on import.meta.url
 * which doesn't work reliably when run via tsx from different directories,
 * and because the Worker is published to the public mirror without the
 * private content package.
 *
 * Bundle 2.0.0 (ADR-0039) adds:
 *   - `review` (raw editorial state) on every atom that has one, so MCP
 *     users can see drafts;
 *   - `references`: reference groups with their raw entry fields. No
 *     freshness text or rendered tables are bundled — the Worker derives
 *     freshness per request. Full schema validation happens in the private
 *     repository (`pnpm validate:content`). This script refuses unquoted YAML
 *     dates and runs the shared clock-free integrity rules
 *     (`src/reference-integrity.ts`, a byte-identical copy of the content
 *     package's module): existing and cited evidence, current review policy,
 *     pricing units/conditions, unique ids, live replacements, private-path,
 *     secret and fixture-host guards. A group that breaks them stops the
 *     bundle, in the private repository and in the public mirror alike.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  checkReferenceIntegrity,
  type ReferenceIntegrityOptions,
} from "../src/reference-integrity.js";

interface BundledDocument {
  id: string;
  title: string;
  summary: string;
  body: string;
  tags?: string[];
  review?: { status: string; last_reviewed?: string };
}

interface BundledReferenceGroup {
  id: string;
  title: string;
  summary: string;
  version: string;
  maintainer: string;
  review?: Record<string, unknown>;
  body: string;
  entries: unknown[];
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

export interface BundleSources {
  principles: string;
  playbooks: string;
  audits: string;
  prompts: string;
  guides: string;
  briefings: string;
  references: string;
}

// Resolve repo root from this script's location: apps/mcp/scripts -> repo root
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..");

export const canonicalSources: BundleSources = {
  principles: path.join(repoRoot, "packages", "methodology", "standards", "principles"),
  playbooks: path.join(repoRoot, "packages", "methodology", "playbooks", "playbooks"),
  audits: path.join(repoRoot, "packages", "methodology", "playbooks", "audits"),
  prompts: path.join(repoRoot, "packages", "methodology", "prompts", "prompts"),
  guides: path.join(repoRoot, "packages", "methodology", "guides", "guides"),
  briefings: path.join(repoRoot, "apps", "web", "content", "briefings"),
  references: path.join(repoRoot, "packages", "methodology", "references", "references"),
};

function markdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function loadDocuments(dir: string): BundledDocument[] {
  if (!fs.existsSync(dir)) {
    console.warn(`[bundle-content] Directory not found: ${dir}`);
    return [];
  }

  const docs: BundledDocument[] = [];

  for (const file of markdownFiles(dir)) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (!data.id || !data.title || !data.summary) {
      console.warn(`[bundle-content] Skipping ${file}: missing required frontmatter`);
      continue;
    }

    const doc: BundledDocument = {
      id: data.id,
      title: data.title,
      summary: data.summary,
      body: content.trim(),
      tags: Array.isArray(data.tags) ? data.tags : undefined,
    };
    if (data.review && typeof data.review.status === "string") {
      doc.review = { status: data.review.status };
      if (typeof data.review.last_reviewed === "string" && data.review.last_reviewed.length > 0) {
        doc.review.last_reviewed = data.review.last_reviewed;
      }
    }
    docs.push(doc);
  }

  return docs;
}

function assertNoParsedDates(value: unknown, where: string): void {
  if (value instanceof Date) {
    throw new Error(
      `[bundle-content] ${where}: unquoted YAML date; reference dates must be quoted "YYYY-MM-DD" strings`,
    );
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoParsedDates(item, `${where}[${index}]`));
  } else if (value !== null && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) assertNoParsedDates(item, `${where}.${key}`);
  }
}

const GROUP_ORDER = ["tools", "models", "pricing", "setup"];

function loadReferenceGroups(dir: string): BundledReferenceGroup[] {
  const groups: BundledReferenceGroup[] = [];
  for (const file of markdownFiles(dir)) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    assertNoParsedDates(data, file);
    if (!data.id || !data.title || !data.summary || !Array.isArray(data.entries)) {
      throw new Error(
        `[bundle-content] ${file}: reference group is missing id, title, summary or entries`,
      );
    }
    const group: BundledReferenceGroup = {
      id: data.id,
      title: data.title,
      summary: data.summary,
      version: data.version,
      maintainer: data.maintainer,
      body: content.trim(),
      entries: data.entries,
    };
    if (data.review) group.review = data.review;
    groups.push(group);
  }
  return groups.sort((a, b) => GROUP_ORDER.indexOf(a.id) - GROUP_ORDER.indexOf(b.id));
}

// `options.allowFixtureHosts` is for tests that bundle the synthetic
// fixtures; the canonical build never sets it.
export function buildBundle(
  sources: BundleSources = canonicalSources,
  generatedAt: string = new Date().toISOString(),
  options: ReferenceIntegrityOptions = {},
): ContentBundle {
  const references = loadReferenceGroups(sources.references);
  const integrityErrors = checkReferenceIntegrity(references, options);
  if (integrityErrors.length > 0) {
    throw new Error(
      `[bundle-content] reference integrity check failed:\n  - ${integrityErrors.join("\n  - ")}`,
    );
  }
  return {
    version: "2.0.0",
    generatedAt,
    principles: loadDocuments(sources.principles),
    playbooks: loadDocuments(sources.playbooks),
    audits: loadDocuments(sources.audits),
    prompts: loadDocuments(sources.prompts),
    guides: loadDocuments(sources.guides),
    briefings: loadDocuments(sources.briefings),
    references,
  };
}

function main(): void {
  const outDir = path.join(scriptDir, "..", "src", "generated");
  fs.mkdirSync(outDir, { recursive: true });

  const bundle = buildBundle();
  const outPath = path.join(outDir, "content-bundle.json");
  fs.writeFileSync(outPath, JSON.stringify(bundle, null, 2));

  console.log(
    `[bundle-content] Bundled ${bundle.principles.length} principles, ` +
      `${bundle.playbooks.length} playbooks, ${bundle.audits.length} audits, ` +
      `${bundle.prompts.length} prompts, ${bundle.guides.length} guides, ` +
      `${bundle.briefings.length} briefings, ${bundle.references.length} reference groups → ${outPath}`,
  );
}

const isEntryPoint =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntryPoint) main();
