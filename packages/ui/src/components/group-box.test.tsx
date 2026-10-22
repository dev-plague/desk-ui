import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { GroupBox } from "./group-box";

describe("GroupBox", () => {
  it("renders a named fieldset with a tab legend", () => {
    render(
      <GroupBox legend="Sistema">
        <p>Contenido del grupo</p>
      </GroupBox>,
    );

    const group = screen.getByRole("group", { name: "Sistema" });
    expect(group).toBeVisible();
    expect(screen.getByText("Contenido del grupo")).toBeVisible();
    expect(group.tagName).toBe("FIELDSET");
  });

  it("forwards the ref and custom classes", () => {
    const ref = React.createRef<HTMLFieldSetElement>();

    render(
      <GroupBox ref={ref} legend="Avanzado" className="custom-group">
        <span>Opciones</span>
      </GroupBox>,
    );

    expect(ref.current).toBe(screen.getByRole("group", { name: "Avanzado" }));
    expect(ref.current).toHaveClass("custom-group");
  });
});
