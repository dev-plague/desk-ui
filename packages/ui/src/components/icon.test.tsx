import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Icon } from "./icon";

describe("Icon", () => {
  it("renders a named image when a label is provided", () => {
    render(<Icon name="folder" label="Carpeta" />);

    const icon = screen.getByRole("img", { name: "Carpeta" });
    expect(icon.tagName.toLowerCase()).toBe("svg");
  });

  it("is decorative by default and supports 32px", () => {
    const { container } = render(<Icon name="info" size={32} data-testid="info" />);

    const icon = container.querySelector('[data-testid="info"]');
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("h-8", "w-8");
  });
});
