import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TitleBar } from "./title-bar";

describe("TitleBar", () => {
  it("renders active/inactive states and controls", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = render(
      <TitleBar title="Documento" onClose={onClose} />,
    );

    expect(screen.getByText("Documento")).toBeVisible();
    expect(screen.getByText("Documento").closest("[data-slot=title-bar]")).toHaveAttribute(
      "data-active",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<TitleBar title="Documento" active={false} />);
    expect(screen.getByText("Documento").closest("[data-slot=title-bar]")).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  it("renders decorative controls when no handlers exist", () => {
    render(<TitleBar title="Sin acciones" />);

    expect(
      screen.queryByRole("button", { name: "Cerrar" }),
    ).not.toBeInTheDocument();
  });
});
