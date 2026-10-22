import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import {
  WindowManager,
  type WindowManagerHandle,
  type WindowManagerSnapshot,
} from "./window-manager";

const windows = [
  {
    id: "notas",
    title: "Bloc de notas",
    content: <p>Contenido del bloc</p>,
  },
  {
    id: "ayuda",
    title: "Ayuda",
    content: <p>Contenido de ayuda</p>,
  },
];

function rect(width: number, height: number): DOMRect {
  return {
    x: 0,
    y: 0,
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    toJSON: () => ({}),
  } as DOMRect;
}

function setupBounds(manager: HTMLElement) {
  manager.getBoundingClientRect = () => rect(800, 600);
  fireEvent(window, new Event("resize"));
}

describe("WindowManager", () => {
  it("renders windows focused on the last one and raises on click", async () => {
    const user = userEvent.setup();

    render(
      <WindowManager
        aria-label="Gestor de ventanas"
        data-testid="manager"
        windows={windows}
      />,
    );

    const notes = screen.getByRole("region", { name: "Bloc de notas" });
    const help = screen.getByRole("region", { name: "Ayuda" });
    expect(notes).toBeVisible();
    expect(help).toBeVisible();
    expect(Number(help.style.zIndex)).toBeGreaterThan(
      Number(notes.style.zIndex),
    );

    await user.click(
      within(notes).getByRole("group", {
        name: "Mover ventana Bloc de notas",
      }),
    );

    expect(Number(notes.style.zIndex)).toBeGreaterThan(
      Number(help.style.zIndex),
    );
    expect(notes).toHaveAttribute("data-active", "true");
  });

  it("minimizes, restores and closes through the title bar", async () => {
    const user = userEvent.setup();
    const onWindowClose = vi.fn();
    const ref = React.createRef<WindowManagerHandle>();

    render(
      <WindowManager
        ref={ref}
        aria-label="Gestor de ventanas"
        windows={windows}
        onWindowClose={onWindowClose}
      />,
    );

    const notes = screen.getByRole("region", { name: "Bloc de notas" });

    React.act(() => ref.current?.minimize("notas"));
    expect(notes).not.toBeVisible();

    React.act(() => ref.current?.restore("notas"));
    expect(notes).toBeVisible();

    await user.click(within(notes).getByRole("button", { name: "Cerrar" }));
    expect(
      screen.queryByRole("region", { name: "Bloc de notas" }),
    ).not.toBeInTheDocument();
    expect(onWindowClose).toHaveBeenCalledWith("notas");
  });

  it("maximizes and restores a window", async () => {
    const user = userEvent.setup();

    render(
      <WindowManager
        aria-label="Gestor de ventanas"
        data-testid="manager"
        windows={windows}
      />,
    );

    const notes = screen.getByRole("region", { name: "Bloc de notas" });
    setupBounds(screen.getByTestId("manager"));

    await user.click(within(notes).getByRole("button", { name: "Maximizar" }));
    expect(notes.style.width).toBe("100%");
    expect(notes.style.left).toBe("0px");

    await user.click(within(notes).getByRole("button", { name: "Restaurar" }));
    expect(notes.style.width).toBe("420px");
  });

  it("exposes imperative controls and reports snapshots", async () => {
    const ref = React.createRef<WindowManagerHandle>();
    const onStateChange = vi.fn();

    render(
      <WindowManager
        ref={ref}
        aria-label="Gestor de ventanas"
        windows={windows}
        onStateChange={onStateChange}
      />,
    );

    await waitFor(() => expect(onStateChange).toHaveBeenCalled());
    const snapshots = onStateChange.mock.calls.at(-1)?.[0] as
      | WindowManagerSnapshot[]
      | undefined;
    expect(snapshots?.find((item) => item.id === "ayuda")?.focused).toBe(true);

    React.act(() => ref.current?.minimize("notas"));
    expect(ref.current?.getSnapshot().find((item) => item.id === "notas")).toMatchObject({
      minimized: true,
      open: true,
    });

    React.act(() => ref.current?.restore("notas"));
    expect(ref.current?.getSnapshot().find((item) => item.id === "notas")).toMatchObject({
      minimized: false,
    });

    React.act(() => ref.current?.close("notas"));
    expect(ref.current?.getSnapshot().find((item) => item.id === "notas")?.open).toBe(
      false,
    );

    React.act(() => ref.current?.open("notas"));
    expect(screen.getByRole("region", { name: "Bloc de notas" })).toBeVisible();
  });

  it("drags and resizes with the pointer", () => {
    render(
      <WindowManager
        aria-label="Gestor de ventanas"
        data-testid="manager"
        windows={windows}
      />,
    );

    const manager = screen.getByTestId("manager");
    setupBounds(manager);
    const notes = screen.getByRole("region", { name: "Bloc de notas" });
    const title = within(notes).getByRole("group", {
      name: "Mover ventana Bloc de notas",
    });

    fireEvent.pointerDown(title, {
      button: 0,
      clientX: 100,
      clientY: 100,
      pointerId: 1,
    });
    fireEvent.pointerMove(window, {
      clientX: 160,
      clientY: 140,
      pointerId: 1,
    });
    fireEvent.pointerUp(window, { pointerId: 1 });

    expect(notes.style.left).toBe("76px");
    expect(notes.style.top).toBe("56px");

    const handle = notes.querySelector('[data-resize-direction="se"]');
    expect(handle).not.toBeNull();

    fireEvent.pointerDown(handle as Element, {
      button: 0,
      clientX: 400,
      clientY: 300,
      pointerId: 2,
    });
    fireEvent.pointerMove(window, {
      clientX: 450,
      clientY: 330,
      pointerId: 2,
    });
    fireEvent.pointerUp(window, { pointerId: 2 });

    expect(notes.style.width).toBe("470px");
    expect(notes.style.height).toBe("310px");
  });

  it("moves and resizes with the keyboard", () => {
    render(
      <WindowManager
        aria-label="Gestor de ventanas"
        data-testid="manager"
        windows={windows}
      />,
    );

    setupBounds(screen.getByTestId("manager"));
    const notes = screen.getByRole("region", { name: "Bloc de notas" });
    const title = within(notes).getByRole("group", {
      name: "Mover ventana Bloc de notas",
    });

    fireEvent.keyDown(title, { key: "ArrowRight" });
    expect(notes.style.left).toBe("24px");

    fireEvent.keyDown(title, { key: "ArrowDown", shiftKey: true });
    expect(notes.style.height).toBe("288px");
  });
});
