import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";

import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Textarea } from "../components/textarea";
import { Window } from "../components/window";

function Demo() {
  return (
    <Window aria-label="Diálogo de ejemplo" role="dialog">
      <Window.TitleBar title="Iniciar sesión" />
      <Window.Body>
        <Label htmlFor="user">Usuario</Label>
        <Input id="user" />
        <Label htmlFor="notes">Notas</Label>
        <Textarea id="notes" />
        <Checkbox>Recordar contraseña</Checkbox>
        <Button>Aceptar</Button>
        <Button variant="primary">Cancelar</Button>
      </Window.Body>
    </Window>
  );
}

describe("accessibility", () => {
  it("has no detectable axe violations in the base composition", async () => {
    const { container } = render(<Demo />);

    const results = await axe.run(container, {
      rules: {
        // jsdom does not resolve Tailwind colours, so contrast is checked in
        // the browser suite instead.
        "color-contrast": { enabled: false },
      },
    });

    expect(results.violations).toEqual([]);
  });
});
