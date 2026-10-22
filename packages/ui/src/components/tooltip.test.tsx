import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

describe("Tooltip", () => {
  it("shows the tooltip on keyboard focus", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button>Ayuda</Button>
        </TooltipTrigger>
        <TooltipContent>Guardar cambios</TooltipContent>
      </Tooltip>,
    );

    await user.tab();

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Guardar cambios");
  });
});
