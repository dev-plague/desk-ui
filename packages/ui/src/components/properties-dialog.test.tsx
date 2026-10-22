import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PropertiesDialog } from "./properties-dialog";

const tabs = [
  { id: "general", label: "General", content: <p>Datos generales</p> },
  { id: "detalles", label: "Detalles", content: <p>Más detalles</p> },
];

describe("PropertiesDialog", () => {
  it("shows tabs and switches content", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    render(
      <PropertiesDialog
        open
        onOpenChange={() => undefined}
        title="Propiedades de Mi PC"
        tabs={tabs}
        onTabChange={onTabChange}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Propiedades de Mi PC" }),
    ).toBeVisible();
    expect(screen.getByText("Datos generales")).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Detalles" }));
    expect(screen.getByText("Más detalles")).toBeVisible();
    expect(onTabChange).toHaveBeenCalledWith("detalles");
  });

  it("applies, cancels and accepts", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    const onOk = vi.fn();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <PropertiesDialog
        open
        onOpenChange={onOpenChange}
        title="Propiedades"
        tabs={tabs}
        onApply={onApply}
        onOk={onOk}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    expect(onApply).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    await user.click(screen.getByRole("button", { name: "Aceptar" }));
    expect(onApply).toHaveBeenCalledTimes(2);
    expect(onOk).toHaveBeenCalledTimes(1);
  });

  it("disables Aplicar when there is no handler", () => {
    render(
      <PropertiesDialog
        open
        onOpenChange={() => undefined}
        title="Propiedades"
        tabs={tabs}
      />,
    );

    expect(screen.getByRole("button", { name: "Aplicar" })).toBeDisabled();
  });
});
