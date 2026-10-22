import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Notepad } from "./notepad";

describe("Notepad", () => {
  it("edits text, counts characters and saves with Ctrl+S", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSave = vi.fn();

    render(
      <Notepad
        defaultValue="Hola"
        onValueChange={onValueChange}
        onSave={onSave}
      />,
    );

    const editor = screen.getByLabelText("Editor de texto de Sin título");
    expect(editor).toHaveValue("Hola");
    expect(screen.getByText(/Líneas: 1/)).toBeVisible();

    await user.type(editor, " mundo");
    expect(editor).toHaveValue("Hola mundo");
    expect(onValueChange).toHaveBeenLastCalledWith("Hola mundo");
    expect(screen.getByText(/Caracteres: 10/)).toBeVisible();

    fireEvent.keyDown(editor, { key: "s", ctrlKey: true });
    expect(onSave).toHaveBeenCalledWith("Hola mundo");
  });

  it("creates a new empty document with Ctrl+N", () => {
    const onNew = vi.fn();
    render(<Notepad defaultValue="Contenido" onNew={onNew} />);

    const editor = screen.getByLabelText("Editor de texto de Sin título");
    fireEvent.keyDown(editor, { key: "n", ctrlKey: true });

    expect(editor).toHaveValue("");
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it("can hide the menu bar and use a custom file name", () => {
    render(
      <Notepad
        showMenuBar={false}
        fileName="carta.txt"
        defaultValue={"Hola\nmundo"}
      />,
    );

    expect(
      screen.queryByRole("menubar", { name: "Menú del bloc de notas" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText("Editor de texto de carta.txt"),
    ).toBeVisible();
    expect(screen.getByText("carta.txt")).toBeVisible();
    expect(screen.getByText(/Líneas: 2/)).toBeVisible();
  });
});
