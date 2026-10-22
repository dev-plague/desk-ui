import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "./button";
import { ToastProvider, useToast } from "./toast";

function Demo() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: "Guardado",
          description: "La configuración se guardó.",
          duration: 0,
        })
      }
    >
      Mostrar
    </Button>
  );
}

describe("Toast", () => {
  it("shows and dismisses a notification", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Mostrar" }));

    expect(await screen.findByText("Guardado")).toBeVisible();
    expect(screen.getByRole("region", { name: "Notificaciones" })).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "Cerrar notificación" }),
    );
    expect(screen.queryByText("Guardado")).not.toBeInTheDocument();
  });
});
