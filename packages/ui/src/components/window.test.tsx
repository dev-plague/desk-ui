import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Window } from "./window";

describe("Window", () => {
  it("composes title bar, body and status bar", () => {
    render(
      <Window aria-label="Documento">
        <Window.TitleBar title="Bloc de notas" />
        <Window.Body>Hola, mundo</Window.Body>
        <Window.StatusBar>
          <Window.StatusField>Listo</Window.StatusField>
        </Window.StatusBar>
      </Window>,
    );

    expect(screen.getByRole("region", { name: "Documento" })).toBeVisible();
    expect(screen.getByText("Bloc de notas")).toBeVisible();
    expect(screen.getByText("Hola, mundo")).toBeVisible();
    expect(screen.getByText("Listo")).toBeVisible();
  });

  it("reflects the inactive state and calls window controls", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <Window active={false}>
        <Window.TitleBar title="Sin foco" onClose={onClose} />
      </Window>,
    );

    expect(container.querySelector('[data-slot="window"]')).toHaveAttribute(
      "data-active",
      "false",
    );
    expect(
      container.querySelector('[data-slot="window-titlebar"]'),
    ).toHaveAttribute("data-active", "false");

    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders decorative controls when no handlers are provided", () => {
    render(
      <Window>
        <Window.TitleBar title="Solo lectura" />
      </Window>,
    );

    expect(
      screen.queryByRole("button", { name: "Cerrar" }),
    ).not.toBeInTheDocument();
  });

  it("swaps the maximise control for restore when maximized", () => {
    render(
      <Window>
        <Window.TitleBar
          title="Maximizada"
          maximized
          onMaximize={() => undefined}
        />
      </Window>,
    );

    expect(
      screen.getByRole("button", { name: "Restaurar" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Maximizar" }),
    ).not.toBeInTheDocument();
  });
});
