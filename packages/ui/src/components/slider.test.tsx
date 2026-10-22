import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Slider } from "./slider";

describe("Slider", () => {
  it("renders a native range input and updates its value", () => {
    render(<Slider aria-label="Volumen" defaultValue={50} />);

    const slider = screen.getByRole("slider", { name: "Volumen" });
    expect(slider).toHaveValue("50");

    fireEvent.change(slider, { target: { value: "80" } });
    expect(slider).toHaveValue("80");
  });

  it("renders the disabled state", () => {
    render(<Slider aria-label="Deshabilitado" disabled />);

    expect(screen.getByRole("slider", { name: "Deshabilitado" })).toBeDisabled();
  });
});
