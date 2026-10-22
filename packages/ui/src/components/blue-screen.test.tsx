import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BlueScreen } from "./blue-screen";

describe("BlueScreen", () => {
  it("renders the error, code and restart action", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();

    render(<BlueScreen onRestart={onRestart} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeVisible();
    expect(alert).toHaveTextContent("Se ha producido un error fatal");
    expect(alert).toHaveTextContent("ERROR 0E : 016F : BFF9B3D4");

    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("accepts custom content and hides the action without handler", () => {
    render(
      <BlueScreen
        title="Error del sistema"
        message="Mensaje personalizado"
        code="STOP 0x000000"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Mensaje personalizado",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("STOP 0x000000");
    expect(
      screen.queryByRole("button", { name: "Reiniciar" }),
    ).not.toBeInTheDocument();
  });
});
