import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MenuBar, MenuBarItem, MenuBarMenu } from "./menu-bar";

describe("MenuBar", () => {
  it("opens a menu and invokes an item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <MenuBar aria-label="Aplicación">
        <MenuBarMenu label="Archivo">
          <MenuBarItem onSelect={onSelect}>Nuevo</MenuBarItem>
        </MenuBarMenu>
      </MenuBar>,
    );

    await user.click(screen.getByText("Archivo"));
    await user.click(await screen.findByRole("menuitem", { name: "Nuevo" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
