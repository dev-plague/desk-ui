# DeskUI

Librería de componentes React con estética **clásica**, construida como un
design system moderno: tokens, accesibilidad, TypeScript estricto y distribución
*copy & own* al estilo shadcn/ui.

> Proyecto original e independiente. No usa fuentes, iconos, sonidos ni otros
> assets propietarios de terceros. La tipografía W95FA es una recreación libre
> bajo SIL OFL y los iconos son pixel art original.

![Documentación de DeskUI](docs/assets/docs-home.png)

## Estado

**Fase 4 en curso.** La versión **0.2.0** está preparada para publicarse; falta
desplegar en `deskui.codehive.com.co` y publicar el CLI en npm.

- CLI `deskui` con `init`, `add` y `list`.
- Registry compatible con shadcn: 49 items, resolución de dependencias,
  `--dry-run`, `--overwrite`, `--no-install` y copia offline incluida. El sitio
  sirve el registry en `/r`.
- Componentes: `Button`, `Window`, `Input`, `Label`, `GroupBox`, `Checkbox`,
  `Textarea`, `RadioGroup`, `Select`, `Switch`, `Slider`, `Form`, `Tabs`,
  `ScrollArea`, `Panel`, `Card`, `Separator`, `Toolbar`, `Alert`, `Toast`,
  `ProgressBar`, `Tooltip`, `Badge`, `MenuBar`, `DropdownMenu`, `ContextMenu`,
  `Breadcrumb`, `TreeView`, `Pagination`, `Table`, `ListBox`, `StatusBar`,
  `Icon`, `TitleBar`, `Taskbar`, `Dialog`, `Desktop`, `StartMenu`,
  `WindowManager`, `FileExplorer`, `Wizard`, `PropertiesDialog`, `Notepad`,
  `Terminal`, `BlueScreen`, `Screensaver` y `Minesweeper`.
- **Page Builder** en `#/constructor`: 20 bloques, árbol de capas, seis
  plantillas, tema en vivo, preview móvil/tablet/escritorio, exportación JSX/JSON
  y comandos `add`, guardado en `localStorage` e importación de JSON.
- Documentación bilingüe español/inglés con sidebar tipo explorador, buscador
  (`Ctrl+K`), vista previa/código, props, instalación, theming y guías MDX.
  El idioma se cambia desde la barra de tareas o con `?lang=en` y se conserva en
  `localStorage`.
- `DeskUILocaleProvider` en `@deskui/ui` para traducir los textos internos de
  los componentes (menús, botones, estados y etiquetas accesibles) entre
  español e inglés, con sobrescrituras parciales por sección.
- **Skills para agentes** en `skills/`: uso general, composición, Page Builder
  e i18n; `AGENTS.md`, `llms.txt`/`llms-full.txt` y copia automática en
  `deskui init` (`.agents/skills`, `.opencode/skills` y sección en `AGENTS.md`).
- Seis temas, tema de alto contraste, persistencia en `localStorage` y
  `prefers-color-scheme`.
- **Publicación preparada**: versionado 0.2.0, `release:check`,
  `licenses:check`, registry estático en `/r` y guías de release, despliegue y
  migración.
- 171 tests unitarios (118 UI + 12 CLI + 41 docs), 28 tests Playwright con
  axe y regresión visual, y validación end-to-end del flujo `pack` → `init` →
  `add` → build.

Consulta el [roadmap](docs/roadmap.md) para el siguiente corte, la
[guía de publicación](docs/releasing.md) y la
[guía del Page Builder](docs/page-builder.md) para el modelo y la exportación.

## Inicio rápido

```bash
npx deskui init
npx deskui add button input label group-box checkbox textarea radio-group select switch slider form tabs scroll-area window dialog
npx deskui add alert toast progress-bar tooltip badge menu-bar dropdown-menu context-menu breadcrumb tree-view pagination
npx deskui add table list-box status-bar icon title-bar taskbar
npx deskui add panel card separator toolbar
npx deskui add desktop start-menu window-manager file-explorer wizard properties-dialog
npx deskui add notepad terminal blue-screen screensaver minesweeper
npx deskui list
```

Requisitos: Node.js 20.19+, React 18+ y Tailwind CSS 4.

> El CLI **0.2.0** está empaquetado y listo, pero todavía no está publicado en
> npm. Para probarlo desde el monorepo: `pnpm build:cli` y después
> `node packages/cli/dist/index.js init`. También puedes empaquetarlo con
> `pnpm release:pack` e instalarlo con `npm install -g artifacts/deskui-0.2.0.tgz`.
> El registry remoto de referencia es `https://deskui.codehive.com.co/r`.

`init` copia los tokens, las fuentes W95FA, `lib/utils.ts` y escribe
`components.json`. `add` copia el código de los componentes y resuelve sus
dependencias. No hay una librería opaca en `node_modules`.

Para el monorepo:

```bash
pnpm install
pnpm dev
```

Abre `http://127.0.0.1:5173`. El laboratorio está en `#/laboratorio` y el
Page Builder en `#/constructor`.

```bash
pnpm build          # registry + registry del sitio + CLI + llms + documentación
pnpm typecheck      # TypeScript estricto en todo el workspace
pnpm test           # UI + CLI + docs
pnpm test:e2e       # Playwright (requiere chromium)
pnpm registry:build
pnpm registry:site  # copia el registry a apps/docs/public/r
pnpm build:cli
pnpm release:verify # typecheck + tests + build de release + release:check
pnpm release:pack   # tarball del CLI en artifacts/
pnpm release:bundle # tarball del sitio + SHA-256
pnpm licenses:check # auditoría de licencias
```

## Uso de los componentes

```tsx
import {
  Button,
  Checkbox,
  Input,
  Label,
  Window,
} from "@deskui/ui";

export function Demo() {
  return (
    <Window aria-label="Iniciar sesión">
      <Window.TitleBar title="Iniciar sesión" />
      <Window.Body>
        <Label htmlFor="user">Usuario</Label>
        <Input id="user" placeholder="usuario95" />
        <Checkbox>Recordar contraseña</Checkbox>
        <Button variant="primary">Aceptar</Button>
      </Window.Body>
    </Window>
  );
}
```

Para cambiar los textos internos de los componentes (menús, botones, estados y
etiquetas accesibles), envuelve la aplicación con el proveedor de idioma:

```tsx
import { DeskUILocaleProvider } from "@deskui/ui";

export function Root() {
  return (
    <DeskUILocaleProvider locale="en">
      <App />
    </DeskUILocaleProvider>
  );
}
```

Con el CLI, el proveedor se importa desde el archivo copiado
(`@/lib/i18n`) y el registry lo añade como dependencia automáticamente.

El idioma por defecto es `es`; `locale="en"` traduce `Pagination`, `Wizard`,
`PropertiesDialog`, `Notepad`, `FileExplorer`, `Minesweeper`, `Terminal`,
`BlueScreen`, `Screensaver`, `TitleBar`, `Toast`, `ScrollArea` y `Desktop`.
También puedes
sobrescribir etiquetas concretas con `messages={{ pagination: { next: "Forward" } }}`.

En un proyecto consumidor, los imports apuntan a los archivos copiados:

```tsx
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
```

API y props: [docs/components.md](docs/components.md) y las páginas de la
documentación.

## IA y agentes

El repositorio incluye material para que agentes y asistentes usen DeskUI sin
inventar APIs ni estilos:

- `AGENTS.md`: mapa del monorepo, comandos, convenciones y routing de skills.
- `skills/`: fuente canónica de las skills `deskui`, `deskui-composition`,
  `deskui-page-builder` y `deskui-i18n`.
- `skills/deskui/references/`: API de componentes, composición, patrones, i18n,
  CLI, checklist, tokens y Page Builder.
- `apps/docs/public/llms.txt` y `llms-full.txt`: índice y referencia consolidada
  para agentes que consulten el sitio.
- `docs/ai.md`: explicación y flujo recomendado.

```bash
pnpm skills:sync    # .opencode/skills y .agents/skills
pnpm skills:check   # detecta copias desincronizadas
pnpm llms:build     # regenera llms.txt y llms-full.txt
```

`npx deskui init` copia las skills al proyecto consumidor y añade una sección
a su `AGENTS.md`. Usa `--no-agents` si no las quieres.

## Page Builder

El constructor visual vive en `#/constructor`. Compón una página con 20 bloques,
elige una de las seis plantillas, cambia el tema y previsualiza en móvil, tablet
y escritorio. Exporta JSX con imports por archivo, JSON o los comandos del CLI:

```bash
npx deskui add alert badge button card status-bar
```

El documento se guarda automáticamente en `localStorage` y se puede compartir
exportando/importando el JSON. Guía técnica: [docs/page-builder.md](docs/page-builder.md).

## Estructura

```text
apps/docs                 Documentación + laboratorio + Page Builder (Vite + React + Tailwind 4)
packages/ui               Componentes, tokens, fuentes, tests y registry
packages/cli              CLI init/add/list, templates y registry empaquetado
docs/                     Arquitectura, tokens, componentes, Page Builder, IA, roadmap
skills/                   Skills para agentes (fuente canónica)
references/               Imágenes de referencia del estilo
```

### Trazabilidad

- [Estado y progreso](docs/PROGRESS.md) — qué está hecho, qué falta y riesgos.
- [Requisitos](docs/REQUIREMENTS.md) — alcance y trazabilidad con IDs.
- [Decisiones](docs/DECISIONS.md) — registro ADR de por qué se eligió cada camino.
- [Índice de documentación](docs/README.md) — orden de lectura y fuentes de verdad.

### Documentos clave

- [Arquitectura](docs/architecture.md)
- [Page Builder](docs/page-builder.md)
- [Publicación y versionado](docs/releasing.md)
- [Despliegue](docs/deployment.md)
- [Migración](docs/migration.md)
- [Licencias](docs/licenses.md)
- [IA y agentes](docs/ai.md)
- [Skill principal](skills/deskui/SKILL.md)
- [Design tokens](docs/design-tokens.md)
- [Componentes](docs/components.md)
- [Análisis de referencias](docs/reference-analysis.md)
- [Roadmap](docs/roadmap.md)
- [Changelog](CHANGELOG.md)
- [Guía de contribución](CONTRIBUTING.md)
- [README del CLI](packages/cli/README.md)

## Registry

```bash
pnpm registry:build
```

Genera `packages/ui/dist/registry/*.json` con el contenido de los componentes,
sus dependencias npm y sus `registryDependencies`. El formato sigue el esquema
`registry-item.json` de shadcn/ui. Los imports relativos se reescriben a
`@/lib/utils` para que el código copiado sea idiomático.

`pnpm registry:site` copia ese registry a `apps/docs/public/r`, de modo que el
build del sitio lo publica en `https://deskui.codehive.com.co/r`. Ese es el
registry remoto por defecto del CLI.

`pnpm build:cli` copia el registry y los templates al paquete `deskui`, de
modo que el CLI puede añadir componentes sin conexión. También se puede usar un
registry alternativo con `--registry <url-o-ruta>`.

## Licencias

- Código: [MIT](LICENSE).
- W95FA: SIL Open Font License 1.1. Ver
  `packages/ui/src/styles/fonts/W95FA-OFL.txt`.
- Iconos: pixel art original del proyecto, bajo MIT.
- Marcas: DeskUI es un nombre original del proyecto. No utiliza marcas ni
  assets propietarios de terceros.

Inventario completo y política: [docs/licenses.md](docs/licenses.md).
