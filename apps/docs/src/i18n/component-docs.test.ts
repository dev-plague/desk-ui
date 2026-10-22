import { describe, expect, it } from "vitest";

import { COMPONENT_DOCS } from "../content/components";
import { COMPONENT_DOCS_EN } from "./component-docs.en";

describe("English component docs overlay", () => {
  it("covers every component and preserves the structure", () => {
    expect(COMPONENT_DOCS).toHaveLength(47);

    for (const doc of COMPONENT_DOCS) {
      const translation = COMPONENT_DOCS_EN[doc.slug as keyof typeof COMPONENT_DOCS_EN];

      expect(translation, `missing translation for ${doc.slug}`).toBeDefined();
      expect(translation.description).not.toBe(doc.description);
      expect(translation.props).toHaveLength(doc.props.length);
      expect(translation.notes).toHaveLength(doc.notes.length);
      expect(translation.code.length).toBeGreaterThan(0);
    }
  });
});
