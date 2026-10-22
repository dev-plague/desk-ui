import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TreeItem, TreeView } from "./tree-view";

function Demo() {
  return (
    <TreeView aria-label="Archivos" defaultExpanded={["c"]}>
      <TreeItem value="c" label="C:">
        <TreeItem value="docs" label="Documentos">
          <TreeItem value="file" label="carta.txt" />
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
}

describe("TreeView", () => {
  it("selects an item and toggles branches with the keyboard", async () => {
    const user = userEvent.setup();
    render(<Demo />);

    const root = screen.getByRole("treeitem", { name: "C:" });
    const docs = screen.getByRole("treeitem", { name: "Documentos" });

    expect(root).toHaveAttribute("aria-expanded", "true");
    await user.click(docs);
    expect(docs).toHaveAttribute("aria-selected", "true");

    root.focus();
    await user.keyboard("{ArrowLeft}");
    expect(root).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("treeitem", { name: "Documentos" }),
    ).not.toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(root).toHaveAttribute("aria-expanded", "true");
  });

  it("exposes levels and selection state", () => {
    render(<Demo />);

    expect(screen.getByRole("tree", { name: "Archivos" })).toBeVisible();
    expect(screen.getByRole("treeitem", { name: "Documentos" })).toHaveAttribute(
      "aria-level",
      "2",
    );
  });
});
