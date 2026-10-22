import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "./panel";

describe("Panel", () => {
  it("renders a composable raised panel", () => {
    render(
      <Panel aria-label="Resumen" padding="lg">
        <PanelHeader>
          <PanelTitle>Resumen</PanelTitle>
        </PanelHeader>
        <PanelBody>Contenido</PanelBody>
        <PanelFooter>
          <span>Pie</span>
        </PanelFooter>
      </Panel>,
    );

    const panel = screen.getByLabelText("Resumen");
    expect(panel).toBeVisible();
    expect(panel).toHaveAttribute("data-slot", "panel");
    expect(panel).toHaveAttribute("data-variant", "raised");
    expect(screen.getByRole("heading", { name: "Resumen" })).toBeVisible();
    expect(screen.getByText("Contenido")).toBeVisible();
    expect(screen.getByText("Pie")).toBeVisible();
  });

  it("supports sunken and flat variants and forwards the ref", () => {
    const ref = React.createRef<HTMLDivElement>();

    const { rerender } = render(
      <Panel ref={ref} variant="sunken" className="custom-panel">
        Hundido
      </Panel>,
    );

    expect(ref.current).toBe(screen.getByText("Hundido"));
    expect(ref.current).toHaveClass("custom-panel");
    expect(ref.current).toHaveAttribute("data-variant", "sunken");

    rerender(
      <Panel variant="flat" data-testid="flat">
        Plano
      </Panel>,
    );
    expect(screen.getByTestId("flat")).toHaveAttribute("data-variant", "flat");
  });
});
