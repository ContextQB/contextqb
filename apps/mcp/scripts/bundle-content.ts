/**
 * Pre-build script: bundles all ContextQB content into a JSON file
 * that gets embedded into the Worker at deploy time.
 *
 * Run via: pnpm prebuild (happens automatically before build/dev/deploy)
 *
 * This script directly reads markdown files instead of going through
 * @contextqb/content because the content loader relies on import.meta.url
 * which doesn't work reliably when run via tsx from different directories.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";

interface BundledDocument {
  id: string;
  title: string;
  summary: string;
  body: string;
  tags?: string[];
}

interface ContentBundle {
  version: string;
  generatedAt: string;
  principles: BundledDocument[];
  playbooks: BundledDocument[];
  audits: BundledDocument[];
  prompts: BundledDocument[];
  guides: BundledDocument[];
  briefings: BundledDocument[];
}

// Resolve repo root from this script's location: apps/mcp/scripts -> repo root
const scriptDir = import.meta.dirname;
const repoRoot = path.resolve(scriptDir, "..", "..", "..");

const contentDirs = {
  principles: path.join(repoRoot, "packages", "methodology", "standards", "principles"),
  playbooks: path.join(repoRoot, "packages", "methodology", "playbooks", "playbooks"),
  audits: path.join(repoRoot, "packages", "methodology", "playbooks", "audits"),
  prompts: path.join(repoRoot, "packages", "methodology", "prompts", "prompts"),
  guides: path.join(repoRoot, "packages", "methodology", "guides", "guides"),
  briefings: path.join(repoRoot, "apps", "web", "content", "briefings"),
};

function loadDocuments(dir: string): BundledDocument[] {
  if (!fs.existsSync(dir)) {
    console.warn(`[bundle-content] Directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const docs: BundledDocument[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (!data.id || !data.title || !data.summary) {
      console.warn(`[bundle-content] Skipping ${file}: missing required frontmatter`);
      continue;
    }

    docs.push({
      id: data.id,
      title: data.title,
      summary: data.summary,
      body: content.trim(),
      tags: Array.isArray(data.tags) ? data.tags : undefined,
    });
  }

  return docs;
}

function bundle(): ContentBundle {
  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    principles: loadDocuments(contentDirs.principles),
    playbooks: loadDocuments(contentDirs.playbooks),
    audits: loadDocuments(contentDirs.audits),
    prompts: loadDocuments(contentDirs.prompts),
    guides: loadDocuments(contentDirs.guides),
    briefings: loadDocuments(contentDirs.briefings),
  };
}

const outDir = path.join(scriptDir, "..", "src", "generated");
fs.mkdirSync(outDir, { recursive: true });

const bundle_ = bundle();
const outPath = path.join(outDir, "content-bundle.json");
fs.writeFileSync(outPath, JSON.stringify(bundle_, null, 2));

console.log(
  `[bundle-content] Bundled ${bundle_.principles.length} principles, ` +
    `${bundle_.playbooks.length} playbooks, ${bundle_.audits.length} audits, ` +
    `${bundle_.prompts.length} prompts, ${bundle_.guides.length} guides, ` +
    `${bundle_.briefings.length} briefings → ${outPath}`,
);
