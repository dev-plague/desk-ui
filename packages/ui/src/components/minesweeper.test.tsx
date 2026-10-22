import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Minesweeper } from "./minesweeper";

describe("Minesweeper", () => {
  it("opens a safe cell and shows the adjacent count", async () => {
    const user = userEvent.setup();
    render(<Minesweeper layout={["..*", "...", "..."]} />);

    await user.click(
      screen.getByRole("button", { name: "Fila 1, columna 2, oculta" }),
    );

    expect(
      screen.getByRole("button", {
        name: "Fila 1, columna 2, 1 adyacentes",
      }),
    ).toBeVisible();
  });

  it("flags cells with right click and reset clears the board", async () => {
    const user = userEvent.setup();
    render(<Minesweeper layout={["..*", "...", "..."]} />);

    const cell = screen.getByRole("button", {
      name: "Fila 2, columna 2, oculta",
    });
    fireEvent.contextMenu(cell);
    expect(
      screen.getByRole("button", { name: "Fila 2, columna 2, bandera" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("0 minas restantes")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Nueva partida" }));
    expect(
      screen.getByRole("button", { name: "Fila 2, columna 2, oculta" }),
    ).toBeVisible();
    expect(screen.getByLabelText("1 mina restante")).toBeVisible();
  });

  it("loses when revealing a mine and wins when all safe cells open", async () => {
    const user = userEvent.setup();
    const onLose = vi.fn();
    const { unmount } = render(
      <Minesweeper layout={["..*", "...", "..."]} onLose={onLose} />,
    );

    await user.click(
      screen.getByRole("button", { name: "Fila 1, columna 3, oculta" }),
    );
    expect(onLose).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText("Has perdido").length).toBeGreaterThan(0);
    unmount();

    const onWin = vi.fn();
    render(<Minesweeper layout={["*.", ".."]} onWin={onWin} />);

    await user.click(
      screen.getByRole("button", { name: "Fila 1, columna 2, oculta" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Fila 2, columna 1, oculta" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Fila 2, columna 2, oculta" }),
    );

    expect(onWin).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText("¡Has ganado!").length).toBeGreaterThan(0);
  });

  it("marks flags with the F key", () => {
    render(<Minesweeper layout={["..*", "...", "..."]} />);

    const cell = screen.getByRole("button", {
      name: "Fila 3, columna 1, oculta",
    });
    fireEvent.keyDown(cell, { key: "f" });

    expect(
      screen.getByRole("button", { name: "Fila 3, columna 1, bandera" }),
    ).toBeVisible();
  });
});
