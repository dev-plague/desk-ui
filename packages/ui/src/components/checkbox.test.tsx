import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("uses a native checkbox with a visible label", async () => {
    const user = userEvent.setup();

    render(<Checkbox>Recordar contraseña</Checkbox>);

    const checkbox = screen.getByRole("checkbox", {
      name: "Recordar contraseña",
    });
    expect(checkbox).not.toBeChecked();

    await user.click(screen.getByText("Recordar contraseña"));
    expect(checkbox).toBeChecked();
  });

  it("forwards the ref and supports controlled state", () => {
    const ref = React.createRef<HTMLInputElement>();

    render(
      <Checkbox ref={ref} checked readOnly>
        Aceptar términos
      </Checkbox>,
    );

    expect(ref.current).toBe(
      screen.getByRole("checkbox", { name: "Aceptar términos" }),
    );
    expect(ref.current).toBeChecked();
  });

  it("renders the disabled state", () => {
    render(<Checkbox disabled>No disponible</Checkbox>);

    expect(
      screen.getByRole("checkbox", { name: "No disponible" }),
    ).toBeDisabled();
  });
});
