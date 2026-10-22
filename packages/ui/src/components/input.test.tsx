import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("forwards the ref and accepts typing", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLInputElement>();

    render(<Input ref={ref} aria-label="Usuario" defaultValue="" />);

    const input = screen.getByRole("textbox", { name: "Usuario" });
    await user.type(input, "usuario95");

    expect(input).toHaveValue("usuario95");
    expect(ref.current).toBe(input);
  });

  it("supports disabled and read-only fields", () => {
    render(
      <>
        <Input aria-label="Dominio" value="TRABAJO" readOnly />
        <Input aria-label="Equipo" value="PC-01" disabled />
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Dominio" })).toHaveAttribute(
      "readonly",
    );
    expect(screen.getByRole("textbox", { name: "Equipo" })).toBeDisabled();
  });

  it("is named by an explicit label even when disabled", () => {
    render(
      <>
        <label htmlFor="comentario">Comentario</label>
        <Input
          id="comentario"
          placeholder="Este campo está deshabilitado"
          disabled
        />
      </>,
    );

    expect(
      screen.getByRole("textbox", { name: "Comentario" }),
    ).toBeDisabled();
  });
});
