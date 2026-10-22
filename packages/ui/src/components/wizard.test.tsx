import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Wizard, type WizardStep } from "./wizard";

const steps: WizardStep[] = [
  {
    id: "welcome",
    title: "Bienvenida",
    description: "Introduce los datos de la instalación.",
    content: <p>Paso uno</p>,
  },
  {
    id: "folder",
    title: "Carpeta",
    description: "Elige la carpeta de destino.",
    content: <p>Paso dos</p>,
  },
  {
    id: "finish",
    title: "Finalizar",
    content: <p>Paso tres</p>,
  },
];

describe("Wizard", () => {
  it("navigates forward and backward between steps", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    render(<Wizard steps={steps} onStepChange={onStepChange} />);

    expect(screen.getByText("Paso uno")).toBeVisible();
    const stepList = screen.getByRole("list", {
      name: "Pasos del asistente",
    });
    expect(
      within(stepList).getByText("Bienvenida").closest("li"),
    ).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: "Atrás" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByText("Paso dos")).toBeVisible();
    expect(onStepChange).toHaveBeenLastCalledWith(1, steps[1]);

    await user.click(screen.getByRole("button", { name: "Atrás" }));
    expect(screen.getByText("Paso uno")).toBeVisible();
  });

  it("completes on the last step", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <Wizard steps={steps.slice(0, 1)} onComplete={onComplete} />,
    );

    await user.click(screen.getByRole("button", { name: "Finalizar" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("cancels and can block the next step", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <Wizard
        steps={steps}
        canGoNext={(step) => step.id !== "welcome"}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("supports controlled steps", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    render(
      <Wizard steps={steps} step={2} onStepChange={onStepChange} />,
    );

    expect(screen.getByText("Paso tres")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Atrás" }));
    expect(onStepChange).toHaveBeenCalledWith(1, steps[1]);
    expect(screen.getByText("Paso tres")).toBeVisible();
  });
});
