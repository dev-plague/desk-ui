import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./switch";

describe("Switch", () => {
  it("toggles with click and keyboard", async () => {
    const user = userEvent.setup();

    render(<Switch>Modo seguro</Switch>);

    const control = screen.getByRole("switch", { name: "Modo seguro" });
    expect(control).toHaveAttribute("aria-checked", "false");

    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");

    control.focus();
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("supports controlled state and disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    const { rerender } = render(
      <Switch checked={false} onCheckedChange={onCheckedChange}>
        Controlado
      </Switch>,
    );

    const control = screen.getByRole("switch", { name: "Controlado" });
    await user.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toHaveAttribute("aria-checked", "false");

    rerender(
      <Switch disabled onCheckedChange={onCheckedChange}>
        Controlado
      </Switch>,
    );
    expect(control).toBeDisabled();
  });
});
