/**
 * The submit_feedback response is shown to users and ships with the public
 * mirror, so it must not link to private repository paths (H-07). Built from
 * a fixture input; nothing is submitted.
 */

import { describe, expect, it } from "vitest";
import { buildSubmitFeedbackResponse, type SubmitFeedbackInput } from "../src/feedback.js";

const FIXTURE: SubmitFeedbackInput = {
  one_line_summary: "Fixture summary for a response wording test",
  surface: "mcp",
  adoption_stage: "first-use",
  severity: "nit",
  what_happened: "Fixture observation used only to render the response text.",
  what_was_confusing_or_wrong: "Fixture friction text.",
  adopter_name: "fixture",
  consent: "synthesised-only",
} as SubmitFeedbackInput;

const PRIVATE_PATH =
  /(?:docs\/(?:architecture|archive|scopes|pedagogy|operations|punchlists|agent-operations|handoffs)|strategy\/|feedback\/(?:captures|reports|themes|README))/u;

describe("submit_feedback response", () => {
  const body = buildSubmitFeedbackResponse(FIXTURE);

  it("links no private repository path", () => {
    expect(body).not.toMatch(PRIVATE_PATH);
  });

  it("explains what happens next with the published support page", () => {
    expect(body).toContain(
      "[how adopter feedback is handled](https://github.com/ContextQB/contextqb/blob/main/.github/SUPPORT.md)",
    );
    expect(body).toContain("private feedback records");
  });
});
