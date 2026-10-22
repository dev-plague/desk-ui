import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { ScrollArea } from "./scroll-area";

describe("ScrollArea", () => {
  it("renders a focusable scroll viewport", () => {
    const ref = React.createRef<HTMLDivElement>();

    const { container } = render(
      <ScrollArea
        ref={ref}
        className="max-h-24"
        viewportClassName="test-view"
        aria-label="Archivos"
      >
        <p>Contenido desplazable</p>
      </ScrollArea>,
    );

    expect(ref.current).toHaveClass("max-h-24");
    expect(screen.getByText("Contenido desplazable")).toBeVisible();
    expect(screen.getByRole("region", { name: "Archivos" })).toBeVisible();

    const viewport = container.querySelector(
      '[data-slot="scroll-area-viewport"]',
    );
    expect(viewport).toHaveClass("test-view");
    expect(viewport).toHaveAttribute("tabindex", "0");
    expect(viewport).toHaveClass("overflow-y-auto");
    expect(viewport).toHaveClass("w95-scrollbar-hidden");
  });

  it("renders the classic vertical scrollbar with arrow buttons", () => {
    const { container } = render(
      <ScrollArea aria-label="Archivos">Contenido</ScrollArea>,
    );

    expect(
      screen.getByRole("button", { name: "Desplazar hacia arriba" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Desplazar hacia abajo" }),
    ).toBeInTheDocument();

    const bars = container.querySelectorAll(
      '[data-slot="scroll-area-scrollbar"]',
    );
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute("data-orientation", "vertical");
    expect(
      container.querySelector('[data-slot="scroll-area-thumb"]'),
    ).toBeInTheDocument();
  });

  it("supports horizontal orientation", () => {
    const { container } = render(
      <ScrollArea orientation="horizontal">Contenido</ScrollArea>,
    );

    const viewport = container.querySelector(
      '[data-slot="scroll-area-viewport"]',
    );
    expect(viewport).toHaveClass("overflow-x-auto");

    const bars = container.querySelectorAll(
      '[data-slot="scroll-area-scrollbar"]',
    );
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute("data-orientation", "horizontal");
    expect(
      screen.getByRole("button", { name: "Desplazar a la izquierda" }),
    ).toBeInTheDocument();
  });

  it("renders both bars and the corner for bidirectional scroll", () => {
    const { container } = render(
      <ScrollArea orientation="both">Contenido</ScrollArea>,
    );

    expect(
      container.querySelectorAll('[data-slot="scroll-area-scrollbar"]'),
    ).toHaveLength(2);
    expect(
      container.querySelector('[data-slot="scroll-area-corner"]'),
    ).toBeInTheDocument();
    expect(viewportOf(container)).toHaveClass("overflow-auto");
  });
});

function viewportOf(container: HTMLElement) {
  return container.querySelector('[data-slot="scroll-area-viewport"]');
}
