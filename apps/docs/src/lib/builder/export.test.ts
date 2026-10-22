import { describe, expect, it } from "vitest";
import * as ts from "typescript";

import {
  collectRegistryItems,
  generateAddCommands,
  generateExportBundle,
  generateJsx,
  generateJson,
} from "./export";
import {
  createBlankDocument,
  createBlock,
  insertBlock,
  parseBuilderDocument,
} from "./model";

function sampleDocument() {
  const card = createBlock("card", {
    title: "Proyectos",
    description: "Trabajo reciente",
  });
  const input = createBlock("input", {
    label: "Nombre",
    placeholder: "usuario95",
    required: true,
  });
  const heading = createBlock("heading", {
    text: "Hola <mundo> & compañía",
    level: "h1",
  });

  let blocks = insertBlock([], heading, null, "after");
  blocks = insertBlock(blocks, card, heading.id, "after");
  blocks = insertBlock(blocks, input, card.id, "inside");

  return {
    ...createBlankDocument(),
    title: "Mi página",
    theme: "desert" as const,
    background: "desktop" as const,
    blocks,
  };
}

describe("exportación del Page Builder", () => {
  it("genera JSX con los imports usados y el tema del documento", () => {
    const jsx = generateJsx(sampleDocument());

    expect(jsx).toContain(
      'import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";',
    );
    expect(jsx).toContain('import { Input } from "@/components/ui/input";');
    expect(jsx).toContain('import { Label } from "@/components/ui/label";');
    expect(jsx).not.toContain("@/components/ui/badge");
    expect(jsx).toContain('data-theme="desert"');
    expect(jsx).toContain("bg-desktop");
    expect(jsx).toContain("export function PaginaGenerada()");
  });

  it("escapa texto y atributos para que el JSX sea seguro", () => {
    const jsx = generateJsx(sampleDocument());

    expect(jsx).toContain("Hola &lt;mundo&gt; &amp; compañía");
    expect(jsx).not.toContain("<mundo>");
  });

  it("renderiza contenedores anidados y sus propiedades", () => {
    const jsx = generateJsx(sampleDocument());

    expect(jsx).toContain("<Card>");
    expect(jsx).toContain("<CardTitle>Proyectos</CardTitle>");
    expect(jsx).toContain("<CardDescription>Trabajo reciente</CardDescription>");
    expect(jsx).toContain('placeholder="usuario95"');
    expect(jsx).toContain("required");
  });

  it("deduplica y ordena los items del registry para el CLI", () => {
    const document = sampleDocument();
    expect(collectRegistryItems(document.blocks)).toEqual([
      "card",
      "input",
      "label",
    ]);

    const commands = generateAddCommands(document);
    expect(commands).toContain("npx @deskui/cli init");
    expect(commands).toContain("npx @deskui/cli add card input label");
  });

  it("no añade comandos de componentes cuando la página solo usa HTML", () => {
    const document = {
      ...createBlankDocument(),
      blocks: [createBlock("heading", { text: "Solo texto" })],
    };
    expect(collectRegistryItems(document.blocks)).toEqual([]);
    expect(generateAddCommands(document)).toBe("npx @deskui/cli init");
  });

  it("exporta JSON que se puede volver a importar", () => {
    const document = sampleDocument();
    const json = generateJson(document);
    const parsed = parseBuilderDocument(json);

    expect(parsed.title).toBe("Mi página");
    expect(parsed.theme).toBe("desert");
    expect(parsed.blocks).toHaveLength(2);
  });

  it("genera el bundle completo de exportación", () => {
    const bundle = generateExportBundle(sampleDocument());
    expect(bundle.jsx).toContain("PaginaGenerada");
    expect(bundle.json).toContain('"version": 1');
    expect(bundle.commands).toContain("npx @deskui/cli add");
  });

  it("importa CardHeader cuando la tarjeta solo tiene descripción", () => {
    const document = {
      ...createBlankDocument(),
      blocks: [
        createBlock("card", { title: "", description: "Solo descripción" }),
      ],
    };
    const jsx = generateJsx(document);
    expect(jsx).toContain("CardHeader");
    expect(jsx).toContain("CardDescription");
    expect(jsx).not.toContain("CardTitle");
  });

  it("incluye un nombre accesible en la barra de progreso", () => {
    const document = {
      ...createBlankDocument(),
      blocks: [createBlock("progress", { label: "Carga", value: 40 })],
    };
    const jsx = generateJsx(document);
    expect(jsx).toContain('<ProgressBar aria-label="Carga" value={40} />');
  });

  it("genera TSX sintácticamente válido", () => {
    const jsx = generateJsx(sampleDocument());
    const result = ts.transpileModule(jsx, {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
      reportDiagnostics: true,
    });

    expect(result.diagnostics ?? []).toEqual([]);
  });

  it("exporta una página vacía sin imports", () => {
    const jsx = generateJsx(createBlankDocument());
    expect(jsx).toContain("export function PaginaGenerada()");
    expect(jsx).not.toContain("@/components/ui/");
  });
});
