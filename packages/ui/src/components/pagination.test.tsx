import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("marks the current page and navigates", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination page={5} pageCount={10} onPageChange={onPageChange} />,
    );

    expect(
      screen.getByRole("button", { name: "Página 5, actual" }),
    ).toHaveAttribute("aria-current", "page");

    await user.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it("disables previous on the first page", () => {
    render(<Pagination page={1} pageCount={3} />);

    expect(
      screen.getByRole("button", { name: "Página anterior" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Página siguiente" }),
    ).not.toBeDisabled();
  });
});
