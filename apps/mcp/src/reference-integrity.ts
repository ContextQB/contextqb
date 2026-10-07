// Reference integrity: the cross-entry rules every consumer enforces (ADR-0039).
//
// Dependency-free on purpose. The content loader runs these rules on every
// load (website build, stdio MCP calls, validation), and the remote Worker's
// bundler runs a byte-identical copy (apps/mcp/src/reference-integrity.ts)
// before it bundles references, so neither ordinary consumption nor
// publication preparation can bypass them. The public Worker therefore needs
// no private package and no copy of the full schema. Parity tests fail if the
// two copies differ; edit both together.
//
// Inputs are raw group objects (envelope fields, `body`, `entries`). The rules
// read defensively because the bundler has no schema in front of them.
//
// Nothing here depends on a clock. Date-dependent rules (no `checked_on`
// after the validation date, overdue warnings) live in `validateReferenceGroups`,
// which takes the validation date explicitly.

export interface ReferenceIntegrityOptions {
  // Fixture-only: accept the reserved `.invalid` hostnames used by synthetic
  // test data. Canonical content never sets this.
  allowFixtureHosts?: boolean;
}

// Raw group: envelope fields plus `body` and `entries`. Every string field is
// scanned for private paths and secret-shaped values.
export interface ReferenceIntegrityGroup {
  id: string;
  body?: string;
  entries: readonly unknown[];
}

const PRIVATE_PATH_PATTERN = /(?:docs\/architecture|docs\/archive|strategy\/)/u;

// Secret-shaped strings (SPEC §14 prefixes plus bearer tokens). A documented
// placeholder such as "Bearer <token>" is allowed.
const SECRET_PATTERNS: readonly RegExp[] = [
  /(?<![A-Za-z0-9])sk-[A-Za-z0-9_-]{16,}/u,
  /(?<![A-Za-z0-9])gh[po]_[A-Za-z0-9]{20,}/u,
  /(?<![A-Za-z0-9])glpat-[A-Za-z0-9_-]{16,}/u,
  /(?<![A-Za-z0-9])xox[bpa]-[A-Za-z0-9-]{10,}/u,
  /(?<![A-Za-z0-9])AKIA[0-9A-Z]{16}/u,
  /(?<![A-Za-z0-9])AIza[0-9A-Za-z_-]{30,}/u,
  /(?<![A-Za-z0-9])eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+/u,
  /Bearer\s+(?!<)[A-Za-z0-9._~+/-]{16,}/u,
];

type Raw = Record<string, unknown>;

function isRecord(value: unknown): value is Raw {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function records(value: unknown): Raw[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function collectStrings(value: unknown, path: string, out: { path: string; text: string }[]): void {
  if (typeof value === "string") {
    out.push({ path, text: value });
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${path}[${index}]`, out));
  } else if (isRecord(value)) {
    for (const [key, item] of Object.entries(value)) collectStrings(item, `${path}.${key}`, out);
  }
}

function urlsOf(entry: Raw): string[] {
  const urls: string[] = [];
  for (const list of [entry.evidence, entry.further_reading, entry.leads]) {
    for (const item of records(list)) {
      const url = text(item.url);
      if (url) urls.push(url);
    }
  }
  return urls;
}

function hostOf(url: string): string | undefined {
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

// Returns every integrity error; an empty list means the groups may be served.
export function checkReferenceIntegrity(
  groups: readonly ReferenceIntegrityGroup[],
  options: ReferenceIntegrityOptions = {},
): string[] {
  const errors: string[] = [];
  const groupIds = new Set<string>();
  const entryIndex = new Map<string, { group: string; status: string }>();

  for (const group of groups) {
    if (groupIds.has(group.id)) errors.push(`${group.id}: duplicate reference group id`);
    groupIds.add(group.id);
    for (const entry of records(group.entries)) {
      const id = text(entry.id) ?? "<missing id>";
      const prior = entryIndex.get(id);
      if (prior) {
        errors.push(
          `${group.id}#${id}: entry id already used in ${prior.group} (entry ids are unique across all groups)`,
        );
      } else {
        entryIndex.set(id, { group: group.id, status: text(entry.status) ?? "" });
      }
    }
  }

  for (const group of groups) {
    const gid = group.id;

    // Private documentation paths and secret-shaped strings anywhere.
    const strings: { path: string; text: string }[] = [];
    const { body, ...envelope } = group;
    collectStrings(envelope, gid, strings);
    if (typeof body === "string") strings.push({ path: `${gid}.body`, text: body });
    for (const item of strings) {
      if (PRIVATE_PATH_PATTERN.test(item.text)) {
        errors.push(`${item.path}: private documentation path in published reference content`);
      }
      if (SECRET_PATTERNS.some((pattern) => pattern.test(item.text))) {
        errors.push(`${item.path}: secret-shaped value in reference content`);
      }
    }

    for (const entry of records(group.entries)) {
      const id = text(entry.id) ?? "<missing id>";
      const where = `${gid}#${id}`;
      const status = text(entry.status) ?? "";

      for (const url of urlsOf(entry)) {
        const host = hostOf(url);
        if (host === undefined) {
          errors.push(`${where}: invalid URL ${url}`);
        } else if (host.endsWith(".invalid") && !options.allowFixtureHosts) {
          errors.push(`${where}: fixture hostname ${host} in canonical reference content`);
        }
      }

      if (status === "current" || status === "legacy") {
        if (status === "current" && !text(entry.review_by) && !text(entry.review_trigger)) {
          errors.push(`${where}: a current entry needs review_by or review_trigger`);
        }
        const evidenceIds = new Set<string>();
        for (const item of records(entry.evidence)) {
          const evidenceId = text(item.id) ?? "<missing id>";
          if (evidenceIds.has(evidenceId)) {
            errors.push(`${where}: duplicate evidence id "${evidenceId}"`);
          }
          evidenceIds.add(evidenceId);
        }
        const facts = records(entry.facts);
        if (facts.length === 0) errors.push(`${where}: a ${status} entry needs facts`);
        if (evidenceIds.size === 0) errors.push(`${where}: a ${status} entry needs evidence`);
        const cited = new Set<string>();
        facts.forEach((fact, index) => {
          const citations = Array.isArray(fact.evidence) ? fact.evidence : [];
          if (citations.length === 0) {
            errors.push(`${where}: facts[${index}] cites no evidence`);
          }
          for (const citation of citations) {
            const citedId = String(citation);
            cited.add(citedId);
            if (!evidenceIds.has(citedId)) {
              errors.push(`${where}: facts[${index}] cites unknown evidence id "${citedId}"`);
            }
          }
          if (gid === "pricing" && (!text(fact.units) || !text(fact.conditions))) {
            errors.push(
              `${where}: facts[${index}] in the pricing group needs units and conditions`,
            );
          }
        });
        for (const evidenceId of evidenceIds) {
          if (!cited.has(evidenceId)) {
            errors.push(`${where}: evidence "${evidenceId}" is not cited by any row`);
          }
        }
      }

      const replacedBy = text(entry.replaced_by);
      if ((status === "withdrawn" || status === "legacy") && replacedBy) {
        const [targetGroup, targetId] = replacedBy.split("#");
        const target = targetId === undefined ? undefined : entryIndex.get(targetId);
        if (!target || target.group !== targetGroup) {
          errors.push(`${where}: replaced_by ${replacedBy} does not resolve`);
        } else if (targetId === id && targetGroup === gid) {
          errors.push(`${where}: replaced_by points at itself`);
        } else if (target.status !== "current" && target.status !== "legacy") {
          errors.push(
            `${where}: replaced_by ${replacedBy} must be a current or legacy entry, not ${target.status}`,
          );
        }
      }
    }
  }

  return errors;
}
