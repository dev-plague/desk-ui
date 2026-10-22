import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Screensaver } from "./screensaver";

describe("Screensaver", () => {
  it("dismisses with a click", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(<Screensaver onDismiss={onDismiss} />);

    const saver = screen.getByRole("button", {
      name: /DeskUI/,
    });
    await user.click(saver);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("dismisses with Escape and Enter", () => {
    const onDismiss = vi.fn();
    render(<Screensaver onDismiss={onDismiss} />);

    const saver = screen.getByRole("button", { name: /DeskUI/ });
    fireEvent.keyDown(saver, { key: "Escape" });
    fireEvent.keyDown(saver, { key: "Enter" });
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("accepts a custom title and hint", () => {
    render(
      <Screensaver title="Salvapantallas" hint="Pulsa para volver" />,
    );

    expect(screen.getByText("Salvapantallas")).toBeVisible();
    expect(screen.getByText("Pulsa para volver")).toBeVisible();
  });
});
