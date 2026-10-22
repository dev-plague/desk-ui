import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Demo() {
  return (
    <Tabs defaultValue="general">
      <TabsList aria-label="Propiedades">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="avanzado">Avanzado</TabsTrigger>
      </TabsList>
      <TabsContent value="general">Contenido general</TabsContent>
      <TabsContent value="avanzado">Contenido avanzado</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the active panel and switches on click", async () => {
    const user = userEvent.setup();
    render(<Demo />);

    const general = screen.getByRole("tab", { name: "General" });
    const avanzado = screen.getByRole("tab", { name: "Avanzado" });

    expect(general).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Contenido general")).toBeVisible();
    expect(screen.queryByText("Contenido avanzado")).not.toBeInTheDocument();

    await user.click(avanzado);
    expect(avanzado).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Contenido avanzado")).toBeVisible();
  });

  it("supports arrow-key navigation between tabs", async () => {
    const user = userEvent.setup();
    render(<Demo />);

    screen.getByRole("tab", { name: "General" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Avanzado" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
