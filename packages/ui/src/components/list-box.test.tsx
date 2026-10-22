import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ListBox } from "./list-box";

describe("ListBox", () => {
  it("uses a native list box and changes selection", async () => {
    const user = userEvent.setup();

    render(
      <ListBox aria-label="Archivos" size={3} defaultValue="carta">
        <option value="carta">carta.txt</option>
        <option value="notas">notas.txt</option>
        <option value="informe">informe.txt</option>
      </ListBox>,
    );

    const list = screen.getByRole("listbox", { name: "Archivos" });
    expect(list).toHaveValue("carta");
    expect(list).toHaveAttribute("size", "3");

    await user.selectOptions(list, "informe");
    expect(list).toHaveValue("informe");
  });

  it("supports multiple selection", async () => {
    const user = userEvent.setup();

    render(
      <ListBox aria-label="Archivos" multiple defaultValue={["a", "b"]}>
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
      </ListBox>,
    );

    const list = screen.getByRole("listbox", { name: "Archivos" });
    await user.selectOptions(list, "c");

    expect(
      [...(list as HTMLSelectElement).selectedOptions].map((option) => option.value),
    ).toEqual(["a", "b", "c"]);
  });
});
