import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Desktop,
  DesktopIcon,
  DesktopIcons,
} from "./desktop";

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

describe("Desktop", () => {
  it("renders a labelled desktop and selects an icon", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Desktop aria-label="Escritorio de prueba">
        <DesktopIcons>
          <DesktopIcon
            label="Mi PC"
            icon={<span aria-hidden="true">PC</span>}
            onSelect={onSelect}
          />
        </DesktopIcons>
      </Desktop>,
    );

    expect(
      screen.getByRole("region", { name: "Escritorio de prueba" }),
    ).toBeVisible();

    const icon = screen.getByRole("button", { name: "Mi PC" });
    await user.click(icon);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(icon).not.toHaveAttribute("aria-current");
  });

  it("opens on double click and Enter", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(
      <Desktop aria-label="Escritorio">
        <DesktopIcons>
          <DesktopIcon
            label="Documentos"
            icon={<span aria-hidden="true">DOC</span>}
            onOpen={onOpen}
          />
        </DesktopIcons>
      </Desktop>,
    );

    const icon = screen.getByRole("button", { name: "Documentos" });
    await user.dblClick(icon);
    expect(onOpen).toHaveBeenCalledTimes(1);

    icon.focus();
    await user.keyboard("{Enter}");
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("marks the selected icon", () => {
    render(
      <Desktop aria-label="Escritorio">
        <DesktopIcons>
          <DesktopIcon
            label="Papelera"
            icon={<span aria-hidden="true">BIN</span>}
            selected
          />
        </DesktopIcons>
      </Desktop>,
    );

    expect(
      screen.getByRole("button", { name: "Papelera" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("moves a draggable icon with Ctrl+Arrow", () => {
    render(
      <Desktop aria-label="Escritorio" data-testid="desktop">
        <DesktopIcons>
          <DesktopIcon
            label="Acceso"
            icon={<span aria-hidden="true">LNK</span>}
            draggable
            defaultPosition={{ x: 8, y: 8 }}
          />
        </DesktopIcons>
      </Desktop>,
    );

    const desktop = screen.getByTestId("desktop");
    desktop.getBoundingClientRect = () => rect(400, 300);

    const icon = screen.getByRole("button", { name: "Acceso" });
    icon.focus();
    fireEvent.keyDown(icon, { key: "ArrowRight", ctrlKey: true });
    expect(icon.style.left).toBe("16px");
    expect(icon.style.top).toBe("8px");

    fireEvent.keyDown(icon, { key: "ArrowDown", ctrlKey: true });
    expect(icon.style.top).toBe("16px");
  });

  it("drags a positioned icon and clamps it to the desktop", () => {
    render(
      <Desktop aria-label="Escritorio" data-testid="desktop">
        <DesktopIcons>
          <DesktopIcon
            label="Arrastrable"
            icon={<span aria-hidden="true">DRAG</span>}
            draggable
            defaultPosition={{ x: 8, y: 8 }}
          />
        </DesktopIcons>
      </Desktop>,
    );

    screen.getByTestId("desktop").getBoundingClientRect = () => rect(400, 300);
    const icon = screen.getByRole("button", { name: "Arrastrable" });

    fireEvent.pointerDown(icon, {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 1,
    });
    fireEvent.pointerMove(icon, {
      clientX: 50,
      clientY: 40,
      pointerId: 1,
    });
    fireEvent.pointerUp(icon, { pointerId: 1 });

    expect(icon.style.left).toBe("48px");
    expect(icon.style.top).toBe("38px");

    fireEvent.pointerDown(icon, {
      button: 0,
      clientX: 100,
      clientY: 100,
      pointerId: 2,
    });
    fireEvent.pointerMove(icon, {
      clientX: 1000,
      clientY: 1000,
      pointerId: 2,
    });
    fireEvent.pointerUp(icon, { pointerId: 2 });

    expect(icon.style.left).toBe("328px");
    expect(icon.style.top).toBe("236px");
  });
});
