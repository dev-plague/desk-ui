---
name: deskui
description: Guía de uso de DeskUI, la librería React con estética de escritorio clásico y distribución copy & own. Úsala cuando haya que instalar DeskUI, elegir componentes, componer pantallas, revisar accesibilidad o densidad visual, integrar el Page Builder o adaptar los textos internos con i18n.
---

# DeskUI

DeskUI es una librería de componentes React con estética clásica, tokens CSS,
accesibilidad y distribución **copy & own**: el CLI copia el código a
`components/ui`, no se importa una librería opaca desde `node_modules`.

## Cuándo usar esta skill

- Instalar DeskUI en un proyecto React + Tailwind 4.
- Elegir el componente adecuado para una pantalla.
- Componer ventanas, formularios, tablas, menús o una aplicación de escritorio.
- Revisar densidad, jerarquía visual, foco, teclado o contraste.
- Usar el Page Builder y exportar JSX/JSON.
- Traducir los textos internos de los componentes con `DeskUILocaleProvider`.

Si el trabajo es principalmente visual o de composición, carga también
`deskui-composition`. Si es del constructor, carga `deskui-page-builder`. Si es
de idioma, carga `deskui-i18n`.

## Primeros pasos

```bash
npx deskui init
npx deskui add button input label group-box checkbox textarea radio-group select switch slider form tabs scroll-area window dialog
npx deskui list
```

`init` copia tokens, fuentes W95FA, `lib/utils.ts`, escribe `components.json` y,
si no se pasa `--no-agents`, instala las skills de DeskUI y una sección en
`AGENTS.md` para que los agentes del proyecto conozcan la librería.

Requisitos: Node.js 20.19+, React 18+ y Tailwind CSS 4. El paquete todavía no
está publicado en npm; en el monorepo usa `node packages/cli/dist/index.js init`.

## Reglas duras

1. **No inventes imports de paquete** en un consumidor. Tras `init`, los
   componentes viven en `@/components/ui/<nombre>` y `cn` en `@/lib/utils`.
   En el monorepo, `@deskui/ui` es la fuente.
2. **No añadas colores, sombras ni radios a mano.** Usa tokens semánticos
   (`bg-surface`, `text-ink`, `bevel-raised`, `focus-dotted`, etc.).
3. **Una sola ventana principal por pantalla.** Los diálogos se reservan para
   decisiones que bloquean el flujo.
4. **Un solo `Button variant="primary"` por formulario.** Cancelar va a la
   izquierda del botón principal.
5. **Todo control necesita nombre accesible.** `Label` + `htmlFor/id`; si es
   solo icono, `aria-label`.
6. **Mantén la densidad clásica.** 21–23 px en escritorio y mínimo 24 px de
   área táctil en móvil. No metas padding extra.
7. **El teclado no es opcional.** Tab, Enter/Espacio, Escape, flechas, Home/End
   y foco visible en todos los temas.
8. **No uses `blur`, `rounded-*` ni animaciones modernas.** La estética es
   instantánea y de bordes rectos.

## Catálogo rápido

| Necesidad | Componentes |
| --- | --- |
| Acciones | `Button`, `Toolbar`, `ToolbarButton` |
| Formularios | `Input`, `Label`, `GroupBox`, `Checkbox`, `Textarea`, `RadioGroup`, `Select`, `Switch`, `Slider`, `Form` |
| Contenedores | `Window`, `Panel`, `Card`, `GroupBox`, `Tabs`, `ScrollArea`, `Separator`, `Toolbar` |
| Navegación | `MenuBar`, `DropdownMenu`, `ContextMenu`, `Breadcrumb`, `TreeView`, `Pagination`, `Tabs` |
| Feedback | `Alert`, `Toast`, `ProgressBar`, `Tooltip`, `Badge` |
| Datos | `Table`, `ListBox`, `StatusBar`, `TreeView` |
| Utilidades | `Icon`, `TitleBar`, `Taskbar`, `Separator`, `Toolbar` |
| Escritorio | `Desktop`, `StartMenu`, `WindowManager`, `FileExplorer`, `Wizard`, `PropertiesDialog`, `Notepad`, `Terminal`, `BlueScreen`, `Screensaver`, `Minesweeper` |

Detalle de props, variantes y notas de accesibilidad:
[references/components.md](references/components.md).

## Patrón mínimo de pantalla

```tsx
import { Button, GroupBox, Input, Label, Window } from "@deskui/ui";

export function SettingsScreen() {
  return (
    <Window aria-label="Preferencias">
      <Window.TitleBar title="Preferencias" />
      <Window.Body className="grid gap-3">
        <GroupBox legend="Red">
          <div className="grid gap-1">
            <Label htmlFor="host">Nombre del equipo</Label>
            <Input id="host" defaultValue="PC-01" />
          </div>
        </GroupBox>
        <div className="flex justify-end gap-2">
          <Button>Cancelar</Button>
          <Button variant="primary">Aceptar</Button>
        </div>
      </Window.Body>
      <Window.StatusBar>
        <Window.StatusField>Listo</Window.StatusField>
      </Window.StatusBar>
    </Window>
  );
}
```

En un consumidor, cambia el import por
`import { ... } from "@/components/ui/..."` para cada archivo copiado.

## Formularios

- `Form` integra React Hook Form + Zod. Usa `FormField`, `FormItem`,
  `FormLabel`, `FormControl`, `FormDescription` y `FormMessage`.
- Agrupa más de cuatro controles relacionados con `GroupBox`.
- El texto de ayuda va en `FormDescription`; los errores en `FormMessage`.
- `Checkbox`, `RadioGroup`, `Select`, `Switch` y `Slider` conservan el
  comportamiento nativo y el teclado.

## Escritorio y ventanas

- `Window` es presentacional: `TitleBar`, `Body` y `StatusBar` se componen.
- Para una aplicación con varias ventanas usa `WindowManager` y sincroniza la
  `Taskbar` con su snapshot/ref imperativo.
- `Desktop` coloca iconos seleccionables; la apertura por doble clic/Enter la
  decide el consumidor.
- `FileExplorer`, `Wizard`, `PropertiesDialog`, `Notepad`, `Terminal`,
  `BlueScreen`, `Screensaver` y `Minesweeper` son aplicaciones completas de
  ejemplo, no piezas obligatorias del layout.

## i18n

Los textos internos de los componentes se traducen con el proveedor:

```tsx
import { DeskUILocaleProvider } from "@deskui/ui";

<DeskUILocaleProvider locale="en">
  <App />
</DeskUILocaleProvider>
```

En un consumidor el archivo copiado es `@/lib/i18n`. El idioma por defecto es
`es`; `messages` permite sobrescribir secciones concretas. Más detalle:
[references/i18n.md](references/i18n.md).

## Page Builder

El constructor vive en la documentación (`#/constructor`) y no es un item del
registry. Modelo JSON versionado, 20 bloques, 6 plantillas, exportación JSX/JSON
y comandos `add`. Si vas a tocar el modelo, el renderer o el exportador, carga
`deskui-page-builder` y lee
[references/page-builder.md](references/page-builder.md).

## Referencias

- [components.md](references/components.md): API de los 47 componentes.
- [composition.md](references/composition.md): jerarquía, densidad, formularios,
  toolbars y do & don't.
- [patterns.md](references/patterns.md): recetas de pantalla completa.
- [i18n.md](references/i18n.md): proveedor, diccionarios y textos internos.
- [cli.md](references/cli.md): `init`, `add`, `list`, registry y copy & own.
- [checklist.md](references/checklist.md): revisión antes de dar una pantalla por
  terminada.
- [design-tokens.md](references/design-tokens.md): contrato visual y temas.

## Verificación

En el monorepo:

```bash
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

En un consumidor, como mínimo: `tsc --noEmit` y una prueba de teclado/axe de la
pantalla tocada.
