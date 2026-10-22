import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Terminal } from "./terminal";

describe("Terminal", () => {
  it("runs built-in commands and clears the screen", async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();

    render(<Terminal onCommand={onCommand} />);
    const input = screen.getByLabelText("Entrada de comandos");

    await user.type(input, "echo hola{Enter}");
    expect(screen.getByText("hola")).toBeVisible();
    expect(onCommand).toHaveBeenCalledWith("echo hola");
    expect(input).toHaveValue("");

    await user.type(input, "ver{Enter}");
    expect(screen.getByText("DeskUI Terminal 1.0")).toBeVisible();

    await user.type(input, "cls{Enter}");
    expect(
      screen.queryByText("DeskUI Terminal 1.0"),
    ).not.toBeInTheDocument();
  });

  it("supports custom commands and reports unknown commands", async () => {
    const user = userEvent.setup();
    const saludo = vi.fn(() => "Hola desde el comando");

    render(
      <Terminal
        commands={{
          saludo,
        }}
      />,
    );
    const input = screen.getByLabelText("Entrada de comandos");

    await user.type(input, "saludo{Enter}");
    expect(saludo).toHaveBeenCalled();
    expect(screen.getByText("Hola desde el comando")).toBeVisible();

    await user.type(input, "desconocido{Enter}");
    expect(
      screen.getByText("Comando no reconocido: desconocido"),
    ).toBeVisible();
  });

  it("shows help and the prompt", async () => {
    const user = userEvent.setup();
    render(<Terminal prompt={"A:\\>"} />);
    const input = screen.getByLabelText("Entrada de comandos");

    expect(screen.getByText("A:\\>")).toBeVisible();
    await user.type(input, "help{Enter}");
    expect(screen.getByText(/Comandos disponibles:/)).toBeVisible();
    expect(screen.getByText(/help\s+Muestra esta ayuda/)).toBeVisible();
  });
});
