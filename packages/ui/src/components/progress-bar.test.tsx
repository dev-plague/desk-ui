import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressBar } from "./progress-bar";

describe("ProgressBar", () => {
  it("exposes progress values and the visual width", () => {
    const { container } = render(<ProgressBar aria-label="Copia" value={35} />);

    const progress = screen.getByRole("progressbar", { name: "Copia" });
    expect(progress).toHaveAttribute("aria-valuenow", "35");

    const indicator = container.querySelector(
      '[data-slot="progress-bar-indicator"]',
    );
    expect(indicator).toHaveStyle({ width: "35%" });
  });

  it("clamps values to the range", () => {
    render(<ProgressBar aria-label="Copia" value={140} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });
});
