---
name: deskui-page-builder
description: Trabaja con el Page Builder de DeskUI: modelo JSON versionado, 20 bloques, 6 plantillas, árbol de capas, propiedades, exportación JSX/JSON y comandos del CLI. Úsala al modificar el constructor, añadir bloques, cambiar el exportador o depurar la persistencia y el DnD.
---

# Page Builder de DeskUI

El Page Builder es una herramienta de la documentación (`#/constructor`), no un
item del registry. Vive en `apps/docs/src/lib/builder` (modelo puro) y
`apps/docs/src/components/builder` (UI).

## Modelo

```ts
interface BuilderDocument {
  version: 1;
  title: string;
  theme: ThemeId;
  background: "surface" | "sunken" | "desktop";
  blocks: BuilderBlock[];
}

interface BuilderBlock {
  id: string;
  type: BuilderBlockType;
  props: Record<string, string | number | boolean>;
  children?: BuilderBlock[];
}
```

- El documento es JSON puro: no contiene React ni DOM.
- `normalizeDocument` valida versión, tipos, props, profundidad (8), número de
  bloques (200) y longitudes de texto.
- Las props desconocidas se descartan y los ids duplicados se regeneran.
- El tema y el fondo forman parte del documento exportado.

## Capas

| Capa | Ubicación | Responsabilidad |
| --- | --- | --- |
| Modelo | `lib/builder/model.ts` | Operaciones inmutables del árbol |
| Catálogo | `lib/builder/catalog.ts` | 20 bloques, defaults y campos |
| Plantillas | `lib/builder/templates.ts` | 6 documentos de ejemplo |
| Exportador | `lib/builder/export.ts` | JSX, JSON y comandos `add` |
| Renderer | `components/builder/blocks.tsx` | Árbol → componentes reales |
| Editor | `components/builder/` | Paleta, lienzo, capas, propiedades, diálogos |
| Página | `pages/builder.tsx` | Estado, atajos, autoguardado y exportación |

## Reglas

- No importes React en el modelo ni toques el DOM.
- Un bloque nuevo exige catálogo, renderer, exportador y tests de exportación.
- Mantén la validación de JSON, los límites y las alternativas de teclado al DnD.
- El DnD es HTML5 nativo con `application/x-deskui-builder`.
- El teclado es la alternativa principal: Subir/Bajar, `Alt + ↑/↓` y el árbol
  de capas con flechas.
- La persistencia es `localStorage`; compartir es exportar/importar JSON.

## Exportación

- JSX con imports por archivo (`@/components/ui/...`).
- JSON del documento completo.
- Comandos `npx @deskui/cli add ...` a partir de los tipos usados.
- El tema se aplica con `data-theme` en el preview y se reproduce al exportar.

## Pruebas

```bash
pnpm --filter @deskui/docs test
pnpm test:e2e
```

Los tests cubren modelo, plantillas, exportación, persistencia, DnD y axe.

## Referencias

- [page-builder.md](../deskui/references/page-builder.md): guía técnica completa.
- [components.md](../deskui/references/components.md): API de los componentes
  que renderiza el constructor.
