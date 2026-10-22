import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

describe("Table", () => {
  it("renders headers, cells and a selected row", () => {
    render(
      <Table aria-label="Archivos">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tamaño</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow selected>
            <TableCell>carta.txt</TableCell>
            <TableCell>2 KB</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table", { name: "Archivos" })).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Nombre" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "carta.txt" })).toBeVisible();
    expect(screen.getByRole("row", { name: /carta.txt/ })).toHaveAttribute(
      "data-selected",
      "true",
    );
  });
});
