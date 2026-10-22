import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders semantic variants with a status dot", () => {
    render(
      <>
        <Badge>Nuevo</Badge>
        <Badge variant="success">Activo</Badge>
        <Badge variant="danger">Error</Badge>
      </>,
    );

    expect(screen.getByText("Nuevo").closest("[data-slot=badge]")).toHaveAttribute(
      "data-variant",
      "default",
    );
    expect(screen.getByText("Activo").closest("[data-slot=badge]")).toHaveAttribute(
      "data-variant",
      "success",
    );
    expect(screen.getByText("Error").closest("[data-slot=badge]")).toHaveAttribute(
      "data-variant",
      "danger",
    );
  });
});
