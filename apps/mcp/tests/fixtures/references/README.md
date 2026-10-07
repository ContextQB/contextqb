# Synthetic reference fixtures

Public-safe test data for the reference layer (ADR-0039). **Nothing here is a
fact.** Every product name is invented and every URL uses the reserved
`.invalid` top-level domain. The canonical references directory never
contains these files.

- `valid/` — groups that pass validation (with fixture hosts allowed and the
  validation date `2026-10-15`). Shared by the root reference tests, the stdio
  MCP routing tests, the website rendering tests and the Worker tests.

Negative cases are written inline in `scripts/tests/reference-schema.test.ts`
so each one isolates a single defect.
