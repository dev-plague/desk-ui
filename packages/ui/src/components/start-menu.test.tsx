import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  StartMenu,
  StartMenuContent,
  StartMenuGroup,
  StartMenuItem,
  StartMenuSeparator,
  StartMenuShortcut,
  StartMenuSub,
  StartMenuSubContent,
  StartMenuSubTrigger,
  StartMenuTrigger,
} from "./start-menu";
import { Button } from "./button";

describe("StartMenu", () => {
  it("opens from its trigger and invokes an item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <StartMenu>
        <StartMenuTrigger asChild>
          <Button>Inicio</Button>
        </StartMenuTrigger>
        <StartMenuContent>
          <StartMenuItem onSelect={onSelect}>
            Programas
            <StartMenuShortcut>▸</StartMenuShortcut>
          </StartMenuItem>
          <StartMenuSeparator />
          <StartMenuItem onSelect={onSelect}>Apagar</StartMenuItem>
        </StartMenuContent>
      </StartMenu>,
    );

    await user.click(screen.getByRole("button", { name: "Inicio" }));
    await user.click(await screen.findByRole("menuitem", { name: /Programas/ }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("supports a cascading submenu", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <StartMenu defaultOpen>
        <StartMenuTrigger asChild>
          <Button>Inicio</Button>
        </StartMenuTrigger>
        <StartMenuContent>
          <StartMenuSub>
            <StartMenuSubTrigger>Programas</StartMenuSubTrigger>
            <StartMenuSubContent>
              <StartMenuItem onSelect={onSelect}>Bloc de notas</StartMenuItem>
            </StartMenuSubContent>
          </StartMenuSub>
        </StartMenuContent>
      </StartMenu>,
    );

    await user.click(await screen.findByRole("menuitem", { name: /Programas/ }));
    const subItem = await screen.findByRole("menuitem", {
      name: "Bloc de notas",
    });
    subItem.focus();
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("closes with Escape", async () => {
    const user = userEvent.setup();

    render(
      <StartMenu defaultOpen>
        <StartMenuTrigger asChild>
          <Button>Inicio</Button>
        </StartMenuTrigger>
        <StartMenuContent>
          <StartMenuGroup aria-label="Sistema">
            <StartMenuItem>Configuración</StartMenuItem>
          </StartMenuGroup>
        </StartMenuContent>
      </StartMenu>,
    );

    const menu = await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    expect(menu).not.toBeInTheDocument();
  });
});
