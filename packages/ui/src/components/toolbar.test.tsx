import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "./toolbar";

describe("Toolbar", () => {
  it("renders a labelled toolbar with grouped buttons", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Toolbar ref={ref} aria-label="Formato" className="custom-toolbar">
        <ToolbarGroup aria-label="Texto">
          <ToolbarButton pressed>Negrita</ToolbarButton>
          <ToolbarButton>Cursiva</ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarButton aria-label="Abrir" variant="icon" size="icon">
          A
        </ToolbarButton>
      </Toolbar>,
    );

    const toolbar = screen.getByRole("toolbar", { name: "Formato" });
    expect(toolbar).toBe(ref.current);
    expect(toolbar).toHaveClass("custom-toolbar");
    expect(screen.getByRole("group", { name: "Texto" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Negrita" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Cursiva" }),
    ).not.toHaveAttribute("aria-pressed");
  });

  it("moves focus with arrow, Home and End keys", async () => {
    const user = userEvent.setup();

    render(
      <Toolbar aria-label="Edición">
        <ToolbarButton>Uno</ToolbarButton>
        <ToolbarButton>Dos</ToolbarButton>
        <ToolbarButton>Tres</ToolbarButton>
      </Toolbar>,
    );

    const first = screen.getByRole("button", { name: "Uno" });
    const second = screen.getByRole("button", { name: "Dos" });
    const third = screen.getByRole("button", { name: "Tres" });

    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(second).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(first).toHaveFocus();

    await user.keyboard("{End}");
    expect(third).toHaveFocus();

    await user.keyboard("{Home}");
    expect(first).toHaveFocus();
  });

  it("supports a vertical orientation", () => {
    render(
      <Toolbar aria-label="Herramientas" orientation="vertical">
        <ToolbarButton>A</ToolbarButton>
        <ToolbarButton>B</ToolbarButton>
      </Toolbar>,
    );

    expect(
      screen.getByRole("toolbar", { name: "Herramientas" }),
    ).toHaveAttribute("aria-orientation", "vertical");
  });
});
