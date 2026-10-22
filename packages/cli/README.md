# DeskUI CLI

CLI para copiar los componentes de **DeskUI** a tu proyecto. Sigue el
modelo *copy & own*: los archivos quedan en tu repositorio y puedes editarlos.

## Uso

> La versión **0.2.0** está empaquetada y preparada para npm, pero todavía no
> está publicada. Para probarla desde el monorepo: `pnpm build:cli` y después
> `node packages/cli/dist/index.js init`, o empaquétala con `pnpm release:pack`
> e instala el tarball.

```bash
npx deskui init
npx deskui add button input label group-box checkbox textarea radio-group select switch slider form tabs scroll-area window dialog
npx deskui add alert toast progress-bar tooltip badge menu-bar dropdown-menu context-menu breadcrumb tree-view pagination
npx deskui add table list-box status-bar icon title-bar taskbar
npx deskui add panel card separator toolbar
npx deskui add desktop start-menu window-manager
npx deskui add file-explorer wizard properties-dialog notepad terminal blue-screen screensaver minesweeper
npx deskui list
```

`init`:

- Detecta `src/`, el alias de imports y el CSS de entrada.
- Copia `styles/deskui.css`, las fuentes W95FA y `lib/utils.ts`.
- Escribe `components.json`.
- Inserta `@import "./styles/deskui.css";` después de Tailwind.
- Copia las skills de DeskUI a `.agents/skills/` y `.opencode/skills/` y añade
  una sección a `AGENTS.md` para que los agentes del proyecto conozcan la
  librería. Usa `--no-agents` para omitirlo.

`add`:

- Resuelve `registryDependencies` en profundidad.
- Copia los archivos a `components/ui` y `lib`.
- Instala las dependencias npm con el gestor detectado.
- No sobrescribe archivos con contenido distinto sin `--overwrite`.

## Opciones

```text
--cwd <dir>            Directorio del proyecto
--registry <url|ruta>  Registry alternativo
--overwrite            Reemplaza archivos con otro contenido
--force                Igual que --overwrite, también para components.json
--no-install           No ejecuta el gestor de paquetes
--no-agents            init: no copia skills ni modifica AGENTS.md
--dry-run              Muestra lo que haría add sin escribir
--alias <prefijo>      Alias de imports (por defecto: @/)
--css <archivo>        CSS de entrada para init
--src-dir              Fuerza src/ como raíz
--no-src-dir           Fuerza la raíz sin src/
-h, --help             Ayuda
-v, --version          Versión
```

## Registry

El paquete incluye una copia del registry (`registry/*.json`) para funcionar sin
conexión. Puedes apuntar a otro registry con `--registry` o con la variable
`DESKUI_REGISTRY`.

Prioridad:

1. `--registry`
2. `DESKUI_REGISTRY`
3. `components.json` → `registry`
4. Registry local del monorepo (desarrollo)
5. Registry incluido en el paquete
6. `https://deskui.codehive.com.co/r`

## Requisitos

- Node.js 20.19+
- React 18+
- Tailwind CSS 4

## Publicación

El paquete declara `publishConfig.access = "public"`, incluye `dist`,
`templates`, `registry` y la licencia MIT. El flujo de release está en
`docs/releasing.md`: `pnpm release:verify`, `pnpm release:pack` y
`npm publish artifacts/deskui-x.y.z.tgz`.

## Licencia

MIT. La tipografía W95FA se distribuye bajo SIL OFL 1.1.
