import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Select } from "./select";

describe("Select", () => {
  it("uses a native select and changes value", async () => {
    const user = userEvent.setup();

    render(
      <Select aria-label="Dominio" defaultValue="trabajo">
        <option value="trabajo">TRABAJO</option>
        <option value="casa">CASA</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "Dominio" });
    expect(select).toHaveValue("trabajo");

    await user.selectOptions(select, "casa");
    expect(select).toHaveValue("casa");
  });

  it("renders the disabled state", () => {
    render(
      <Select aria-label="Deshabilitado" disabled>
        <option value="uno">Uno</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "Deshabilitado" })).toBeDisabled();
  });
});
