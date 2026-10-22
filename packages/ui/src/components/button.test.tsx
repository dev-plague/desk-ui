import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders a real button and forwards clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Aceptar</Button>);

    const button = screen.getByRole("button", { name: "Aceptar" });
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("type", "button");
  });

  it("supports disabled and toggled states", () => {
    render(
      <>
        <Button disabled>Cancelar</Button>
        <Button aria-pressed="true">Negrita</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Negrita" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("can render as a link with asChild", () => {
    render(
      <Button asChild>
        <a href="/docs">Documentación</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Documentación" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
