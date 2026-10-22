import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  it("exposes an alert with title and description", () => {
    render(
      <Alert variant="warning">
        <AlertTitle>Atención</AlertTitle>
        <AlertDescription>El archivo ya existe.</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Atención");
    expect(alert).toHaveTextContent("El archivo ya existe.");
  });
});
