import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBar, StatusBarField } from "./status-bar";

describe("StatusBar", () => {
  it("renders segmented fields", () => {
    render(
      <StatusBar aria-label="Estado">
        <StatusBarField>Listo</StatusBarField>
        <StatusBarField>3 objetos</StatusBarField>
      </StatusBar>,
    );

    expect(screen.getByLabelText("Estado")).toBeVisible();
    expect(screen.getByText("Listo")).toBeVisible();
    expect(screen.getByText("3 objetos")).toBeVisible();
  });
});
