import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Separator } from "./separator";

describe("Separator", () => {
  it("exposes a horizontal separator role by default", () => {
    render(<Separator data-testid="line" />);

    const separator = screen.getByRole("separator");
    expect(separator).toBe(screen.getByTestId("line"));
    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("supports vertical orientation and forwards the ref", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<Separator ref={ref} orientation="vertical" data-testid="vline" />);

    expect(ref.current).toBe(screen.getByTestId("vline"));
    expect(ref.current).toHaveAttribute("aria-orientation", "vertical");
    expect(ref.current).toHaveAttribute("data-orientation", "vertical");
  });

  it("hides decorative separators from assistive technology", () => {
    render(<Separator decorative data-testid="decorative" />);

    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(screen.getByTestId("decorative")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
