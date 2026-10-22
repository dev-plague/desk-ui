import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "./pagination";
import { TitleBar } from "./title-bar";
import { DeskUILocaleProvider } from "../lib/i18n";

describe("DeskUILocaleProvider", () => {
  it("keeps Spanish as the default locale", () => {
    render(<Pagination page={2} pageCount={5} />);

    expect(
      screen.getByRole("button", { name: "Página 2, actual" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Página siguiente" }),
    ).toBeVisible();
  });

  it("translates built-in labels into English", () => {
    render(
      <DeskUILocaleProvider locale="en">
        <Pagination page={2} pageCount={5} />
        <TitleBar title="Document" onClose={() => {}} />
      </DeskUILocaleProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Page 2, current" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Next page" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Close" })).toBeVisible();
  });

  it("accepts partial message overrides", () => {
    render(
      <DeskUILocaleProvider
        locale="en"
        messages={{ pagination: { next: "Forward" } }}
      >
        <Pagination page={1} pageCount={5} />
      </DeskUILocaleProvider>,
    );

    expect(
      screen.getByRole("button", { name: "Next page" }),
    ).toHaveTextContent("Forward");
    expect(
      screen.getByRole("button", { name: "Page 1, current" }),
    ).toBeVisible();
  });
});
