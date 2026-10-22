import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FileExplorer, type FileExplorerItem } from "./file-explorer";

const root: FileExplorerItem = {
  id: "root",
  name: "C:",
  kind: "folder",
  children: [
    {
      id: "docs",
      name: "Documentos",
      kind: "folder",
      modified: "21/10/1995 09:00",
      children: [
        {
          id: "carta",
          name: "carta.txt",
          kind: "file",
          size: "1 KB",
          type: "Texto",
          modified: "21/10/1995 09:10",
        },
      ],
    },
    {
      id: "readme",
      name: "LEEME.TXT",
      kind: "file",
      size: "2 KB",
      type: "Texto",
      modified: "21/10/1995 09:00",
    },
  ],
};

describe("FileExplorer", () => {
  it("renders the tree, address and icon view", () => {
    render(<FileExplorer root={root} />);

    expect(screen.getByRole("tree", { name: "Carpetas" })).toBeVisible();
    expect(screen.getByLabelText("Ruta actual")).toHaveValue("C:");
    expect(screen.getByRole("button", { name: "Documentos" })).toBeVisible();
    expect(screen.getByRole("button", { name: "LEEME.TXT" })).toBeVisible();
    expect(screen.getByText("2 objetos")).toBeVisible();
  });

  it("switches between icons, list and details", async () => {
    const user = userEvent.setup();
    render(<FileExplorer root={root} />);

    await user.click(screen.getByRole("button", { name: "Lista" }));
    expect(screen.getByRole("button", { name: "Lista" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Detalles" }));
    expect(
      screen.getByRole("columnheader", { name: "Modificado" }),
    ).toBeVisible();
    expect(screen.getByRole("cell", { name: "2 KB" })).toBeVisible();
  });

  it("navigates into a folder, selects items and goes back", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onFolderChange = vi.fn();

    render(
      <FileExplorer
        root={root}
        onSelect={onSelect}
        onFolderChange={onFolderChange}
      />,
    );

    await user.dblClick(screen.getByRole("button", { name: "Documentos" }));
    expect(screen.getByLabelText("Ruta actual")).toHaveValue(
      "C:\\Documentos",
    );
    expect(onFolderChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: "docs" }),
    );

    await user.click(screen.getByRole("button", { name: "carta.txt" }));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "carta" }),
    );
    expect(screen.getAllByText("carta.txt").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Atrás" }));
    expect(screen.getByLabelText("Ruta actual")).toHaveValue("C:");
  });

  it("opens a folder with the keyboard", async () => {
    const user = userEvent.setup();
    render(<FileExplorer root={root} />);

    const folder = screen.getByRole("button", { name: "Documentos" });
    folder.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByLabelText("Ruta actual")).toHaveValue(
      "C:\\Documentos",
    );
  });

  it("renders details and selects a row from its name button", async () => {
    const user = userEvent.setup();
    render(<FileExplorer root={root} defaultView="details" />);

    const table = screen.getByRole("table");
    await user.click(
      within(table).getByRole("button", { name: "LEEME.TXT" }),
    );

    expect(screen.getAllByText("LEEME.TXT").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("row", { name: /LEEME.TXT/ }),
    ).toHaveAttribute("data-selected", "true");
  });

  it("ignores an empty folder", () => {
    render(
      <FileExplorer
        root={{
          id: "empty",
          name: "C:",
          kind: "folder",
          children: [],
        }}
      />,
    );

    expect(screen.getByText("Esta carpeta está vacía.")).toBeVisible();
  });

  it("handles context clicks without breaking selection", () => {
    render(<FileExplorer root={root} />);
    fireEvent.contextMenu(screen.getByRole("button", { name: "LEEME.TXT" }));
    expect(screen.getByRole("button", { name: "LEEME.TXT" })).toBeVisible();
  });
});
