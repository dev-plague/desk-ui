import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";
import { Dialog } from "./dialog";

describe("Dialog", () => {
  it("opens as a modal and closes from the title bar", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog
        open
        onOpenChange={onOpenChange}
        title="Mensaje"
        footer={<Button>Aceptar</Button>}
      >
        <p>Contenido del diálogo</p>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog", { name: "Mensaje" });
    expect(dialog).toBeVisible();
    expect(screen.getByText("Contenido del diálogo")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("supports a footer and optional close control", () => {
    render(
      <Dialog
        open
        onOpenChange={() => undefined}
        title="Sin cerrar"
        showClose={false}
        footer={<Button>Vale</Button>}
      >
        <p>Sin botón de cierre en la barra.</p>
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "Vale" })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Cerrar" }),
    ).not.toBeInTheDocument();
  });
});
