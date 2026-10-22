import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders a semantic card composition", () => {
    render(
      <Card aria-label="Producto">
        <CardHeader>
          <CardTitle>Disquete de 3,5</CardTitle>
          <CardDescription>Almacenamiento extraíble</CardDescription>
        </CardHeader>
        <CardContent>1,44 MB de capacidad.</CardContent>
        <CardFooter>
          <span>2,50 €</span>
        </CardFooter>
      </Card>,
    );

    const card = screen.getByLabelText("Producto");
    expect(card.tagName).toBe("ARTICLE");
    expect(card).toHaveAttribute("data-slot", "card");
    expect(
      screen.getByRole("heading", { level: 3, name: "Disquete de 3,5" }),
    ).toBeVisible();
    expect(screen.getByText("Almacenamiento extraíble")).toBeVisible();
    expect(screen.getByText("1,44 MB de capacidad.")).toBeVisible();
    expect(screen.getByText("2,50 €")).toBeVisible();
  });

  it("forwards the ref and custom classes", () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <Card ref={ref} className="custom-card">
        <CardContent>Contenido</CardContent>
      </Card>,
    );

    expect(ref.current).toBe(screen.getByText("Contenido").parentElement);
    expect(ref.current).toHaveClass("custom-card");
  });
});
