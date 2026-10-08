/**
 * Source-layout selection for the Worker's content bundle (PUB-1).
 *
 * The bundler must load the complete corpus from the private monorepo and from
 * the public mirror's flattened layout, pick exactly one layout, and refuse to
 * build when a required input is missing rather than emitting an empty bundle.
 *
 * These tests ship to the public mirror with the Worker, so they run from either
 * canonical layout: in the mirror the reference package's README and LICENSE sit
 * beside the group files, in the private monorepo one directory above them.
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildBundle,
  canonicalLayout,
  canonicalSources,
  layoutSources,
  resolveLayout,
} from "../scripts/bundle-content";

const GENERATED_AT = "2026-10-07T00:00:00.000Z";
const referenceMetadataDir =
  canonicalLayout.layout === "mirror"
    ? canonicalSources.references
    : path.dirname(canonicalSources.references);

const roots: string[] = [];
function tempRoot(): string {
  const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "cqb-layout-"));
  roots.push(root);
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

// Copies the real corpus into the mirror layout, as the publish script does.
function writeMirror(root: string): void {
  const target = layoutSources(root, "mirror");
  for (const [kind, dir] of Object.entries(canonicalSources)) {
    fs.cpSync(dir, target[kind as keyof typeof target], { recursive: true });
  }
  for (const file of ["README.md", "LICENSE"]) {
    fs.copyFileSync(path.join(referenceMetadataDir, file), path.join(target.references, file));
  }
}

describe("source layout", () => {
  it("reads this checkout as exactly one complete layout", () => {
    expect(["private", "mirror"]).toContain(canonicalLayout.layout);
    for (const file of ["README.md", "LICENSE"]) {
      expect(fs.existsSync(path.join(referenceMetadataDir, file))).toBe(true);
    }
  });

  it("builds the same bundle from the mirror layout, skipping only the package README", () => {
    const root = tempRoot();
    writeMirror(root);
    const mirror = resolveLayout(root);
    expect(mirror.layout).toBe("mirror");
    const fromMirror = buildBundle(mirror.sources, GENERATED_AT);
    const fromPrivate = buildBundle(canonicalSources, GENERATED_AT);
    expect(fromMirror).toEqual(fromPrivate);
    expect(fromMirror.references.map((g) => g.id)).toEqual(["tools", "models", "pricing", "setup"]);
    expect(fromMirror.briefings.length).toBeGreaterThan(0);
  });

  it("still rejects any other malformed Markdown file beside the groups", () => {
    const root = tempRoot();
    writeMirror(root);
    fs.writeFileSync(path.join(root, "content", "references", "notes.md"), "# Notes\n");
    expect(() => buildBundle(resolveLayout(root).sources, GENERATED_AT)).toThrow(
      /notes\.md: reference group is missing/u,
    );
  });

  it("refuses a root with both layout markers or neither", () => {
    const both = tempRoot();
    writeMirror(both);
    fs.mkdirSync(path.join(both, "packages", "methodology"), { recursive: true });
    expect(() => resolveLayout(both)).toThrow(/both packages\/methodology/u);
    expect(() => resolveLayout(tempRoot())).toThrow(/neither packages\/methodology/u);
  });

  it("refuses a mirror whose references hold only package metadata", () => {
    const root = tempRoot();
    writeMirror(root);
    for (const file of ["tools.md", "models.md", "pricing.md", "setup.md"]) {
      fs.rmSync(path.join(root, "content", "references", file));
    }
    expect(() => resolveLayout(root)).toThrow(
      /mirror layout .* missing required input: references \(content\/references\)/u,
    );
  });

  it("refuses a layout with a missing input directory instead of bundling it empty", () => {
    const root = tempRoot();
    writeMirror(root);
    fs.rmSync(path.join(root, "apps", "web", "content", "briefings"), { recursive: true });
    expect(() => resolveLayout(root)).toThrow(/missing required input: briefings/u);

    const privateRoot = tempRoot();
    const target = layoutSources(privateRoot, "private");
    fs.cpSync(canonicalSources.principles, target.principles, { recursive: true });
    expect(() => resolveLayout(privateRoot)).toThrow(
      /private layout .* missing required input: playbooks .*audits .*prompts .*guides .*briefings .*references/u,
    );
  });
});
