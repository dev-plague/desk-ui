import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  it("selects a native radio by clicking its label", async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup aria-label="Plan" defaultValue="basico">
        <RadioGroupItem value="basico">Básico</RadioGroupItem>
        <RadioGroupItem value="pro">Pro</RadioGroupItem>
      </RadioGroup>,
    );

    const basico = screen.getByRole("radio", { name: "Básico" });
    const pro = screen.getByRole("radio", { name: "Pro" });

    expect(basico).toBeChecked();
    expect(pro).not.toBeChecked();

    await user.click(screen.getByText("Pro"));
    expect(pro).toBeChecked();
    expect(basico).not.toBeChecked();
  });

  it("supports controlled state", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        aria-label="Tamaño"
        value="chico"
        onValueChange={onValueChange}
      >
        <RadioGroupItem value="chico">Chico</RadioGroupItem>
        <RadioGroupItem value="grande">Grande</RadioGroupItem>
      </RadioGroup>,
    );

    await user.click(screen.getByRole("radio", { name: "Grande" }));

    expect(onValueChange).toHaveBeenCalledWith("grande");
    expect(screen.getByRole("radio", { name: "Chico" })).toBeChecked();
  });

  it("disables all items when the group is disabled", () => {
    render(
      <RadioGroup aria-label="Deshabilitado" disabled>
        <RadioGroupItem value="uno">Uno</RadioGroupItem>
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "Uno" })).toBeDisabled();
  });
});
