import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Taskbar,
  TaskbarDivider,
  TaskbarItem,
  TaskbarStart,
  TaskbarTray,
} from "./taskbar";

describe("Taskbar", () => {
  it("renders start, task and tray controls", () => {
    const onTask = vi.fn();

    render(
      <Taskbar aria-label="Barra de tareas">
        <TaskbarStart>Inicio</TaskbarStart>
        <TaskbarDivider />
        <TaskbarItem active onClick={onTask}>
          Documento
        </TaskbarItem>
        <TaskbarTray>12:00</TaskbarTray>
      </Taskbar>,
    );

    expect(screen.getByLabelText("Barra de tareas")).toBeVisible();
    expect(screen.getByRole("button", { name: "Inicio" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Documento" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("12:00")).toBeVisible();
  });

  it("fires task actions", async () => {
    const user = userEvent.setup();
    const onTask = vi.fn();

    render(
      <Taskbar>
        <TaskbarItem onClick={onTask}>Tarea</TaskbarItem>
      </Taskbar>,
    );

    await user.click(screen.getByRole("button", { name: "Tarea" }));
    expect(onTask).toHaveBeenCalledTimes(1);
  });
});
