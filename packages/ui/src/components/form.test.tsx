import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";

const schema = z.object({
  usuario: z.string().min(3, "Mínimo 3 caracteres"),
});

type Values = z.infer<typeof schema>;

function Demo({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { usuario: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input placeholder="usuario95" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Entrar</button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("shows a Zod validation message and prevents submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<Demo onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Mínimo 3 caracteres")).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Usuario" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<Demo onSubmit={onSubmit} />);
    await user.type(screen.getByRole("textbox", { name: "Usuario" }), "ana");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ usuario: "ana" }, expect.anything());
    });
  });
});
