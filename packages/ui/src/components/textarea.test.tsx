import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Label } from "./label";
import { Textarea } from "./textarea";

describe("Label", () => {
  it("associates with a control through htmlFor", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Label htmlFor="comentario">Comentario</Label>
        <Textarea id="comentario" />
      </>,
    );

    const field = screen.getByRole("textbox", { name: "Comentario" });
    await user.type(field, "Hola");

    expect(field).toHaveValue("Hola");
  });
});

describe("Textarea", () => {
  it("forwards the ref and accepts multiple lines", async () => {
    const user = userEvent.setup();
    let ref: HTMLTextAreaElement | null = null;

    render(
      <Textarea
        aria-label="Mensaje"
        ref={(node) => {
          ref = node;
        }}
      />,
    );

    const field = screen.getByRole("textbox", { name: "Mensaje" });
    await user.type(field, "Primera línea{enter}Segunda línea");

    expect(field).toHaveValue("Primera línea\nSegunda línea");
    expect(ref).toBe(field);
  });

  it("renders disabled and read-only states", () => {
    render(
      <>
        <Textarea aria-label="Solo lectura" value="Texto" readOnly />
        <Textarea aria-label="Deshabilitado" disabled />
      </>,
    );

    expect(
      screen.getByRole("textbox", { name: "Solo lectura" }),
    ).toHaveAttribute("readonly");
    expect(
      screen.getByRole("textbox", { name: "Deshabilitado" }),
    ).toBeDisabled();
  });
});
