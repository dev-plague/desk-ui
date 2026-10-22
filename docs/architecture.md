# Arquitectura — Fases 1, 2 y 3

> Estado: catálogo base, Fase 2 y MVP de la Fase 3 completados. Incluye CLI
> `deskui`, registry offline, 47 componentes, shell de documentación en
> español, buscador, guías MDX, code-splitting, escritorio con ventanas,
> aplicaciones icónicas, dos showcases, Page Builder, i18n español/inglés, skills para agentes y 171 tests unitarios + 28
> E2E.

## 1. Principios que gobiernan las decisiones

1. **Copy & own.** La fuente de verdad son archivos TypeScript legibles que se
   copian al proyecto del usuario. El registry y el CLI son un medio de
   distribución, no una dependencia opaca.
2. **Un solo contrato visual.** Los componentes no conocen colores ni medidas
   decorativas: consumen tokens CSS. Cambiar un tema no requiere tocar
   componentes.
3. **Fidelidad con usabilidad moderna.** El bisel, la tipografía y las
   proporciones son retro; el foco, los roles ARIA, el contraste y los tamaños
   táctiles cumplen requisitos actuales.
4. **Composición antes que configuración.** `Window.TitleBar`, `Window.Body` y
   `Window.StatusBar` permiten construir variantes sin props gigantes.
5. **Cada componente declara sus dependencias.** Tanto npm como otros
   componentes del registry.

## 2. Estructura actual

```text
.
├── apps/
│   └── docs/                       # Documentación + laboratorio + builder (Vite + React)
│       ├── src/App.tsx             # Router por hash + lazy routes
│       ├── src/pages/
│       │   ├── docs.tsx            # Shell, sidebar, taskbar y rutas
│       │   ├── guide.tsx           # Guías MDX bajo demanda
│       │   ├── lab.tsx             # Laboratorio interactivo
│       │   └── builder.tsx         # Orquestación del Page Builder
│       ├── src/components/builder/ # Paleta, lienzo, capas, propiedades, diálogos
│       ├── src/lib/builder/        # Modelo JSON, catálogo, plantillas, export, storage
│       ├── src/content/
│       │   ├── components.tsx      # Previews, snippets y props (chunk aparte)
│       │   ├── manifest.ts         # Índice ligero para explorador/buscador
│       │   ├── pages.tsx           # Inicio, instalación, temas, acerca de
│       │   ├── guides/*.mdx        # Composición, changelog y contribución
│       │   └── showcases/          # Tienda retro y red social
│       ├── src/components/docs/    # Sidebar, buscador, preview/código, props
│       ├── src/components/         # Menú, taskbar, iconos, group box
│       ├── src/lib/                # router, tema, metadatos
│       └── src/index.css           # Tailwind + tokens
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── components/         # 47 componentes + tests
│   │   │   ├── lib/utils.ts        # cn()
│   │   │   ├── styles/
│   │   │   │   ├── tokens.css      # Contrato visual + temas
│   │   │   │   └── fonts/          # W95FA (SIL OFL)
│   │   │   └── index.ts
│   │   ├── scripts/build-registry.mjs
│   │   └── vitest.config.ts
│   └── cli/
│       ├── src/
│       │   ├── commands/           # init, add, list (+ tests)
│       │   ├── lib/                # config, registry, files, install, templates
│       │   └── index.ts            # Parseo de argv y salida de consola
│       ├── scripts/sync-templates.mjs
│       ├── templates/              # Generado: tokens, fuentes, utils
│       └── registry/               # Generado: copia del registry para el paquete
├── e2e/                            # Playwright: teclado, foco, axe, visual
├── docs/                           # Arquitectura, tokens, componentes, IA, roadmap
├── skills/                         # Skills canónicas para agentes
├── .opencode/skills/               # Generado: copia para OpenCode
├── .agents/skills/                 # Generado: copia para otros agentes
├── scripts/                        # sync-skills.mjs, build-llms.mjs
├── references/                     # Imágenes de referencia originales
├── AGENTS.md                       # Guía operativa para agentes
├── llms.txt / llms-full.txt        # Generado en apps/docs/public
├── playwright.config.ts
├── pnpm-workspace.yaml
└── package.json
```

`templates/` y `registry/` dentro de `packages/cli` son artefactos generados por
`pnpm build:cli`; no se editan a mano. El paquete publicado los incluye para
funcionar sin conexión.

## 3. Capas de la librería

### 3.1 Tokens (`packages/ui/src/styles/tokens.css`)

Una única hoja define:

- Paleta cruda (`--w95-gray-200`, `--w95-navy`, …).
- Tokens semánticos (`--w95-surface`, `--w95-text`, `--w95-accent`, …).
- Recetas de bisel completas (`--w95-bevel-raised`, `--w95-bevel-field`, …).
- Tipografía y geometría.
- Temas mediante `[data-theme="..."]`.
- Puente a Tailwind 4 con `@theme inline`.
- Utilidades estáticas con `@utility` (`bevel-raised`, `focus-dotted`,
  `text-engraved`, `titlebar-surface`).

Los componentes solo usan clases semánticas (`bg-surface`, `text-ink`,
`bevel-field`). Nunca incluyen un hexadecimal.

### 3.2 Componentes (`packages/ui/src/components`)

Cuarenta y siete componentes:

| Componente | Estado |
| --- | --- |
| `Button` | default, primary, icon, toggle |
| `Window` | TitleBar, Body, StatusBar |
| `Input` | nativo, read-only, disabled |
| `Label` | htmlFor/id |
| `GroupBox` | fieldset con leyenda enmascarada |
| `Checkbox` | input nativo + caja pixelada |
| `Textarea` | redimensionado vertical |
| `Dialog` | `<dialog>` nativo modal |
| `RadioGroup` | radios nativos + círculo pixelado |
| `Select` | select nativo + flecha elevada |
| `Switch` | botón role=switch |
| `Slider` | range nativo con pista hundida |
| `Form` | React Hook Form + Zod |
| `Tabs` | Radix Tabs tipo propiedades |
| `ScrollArea` | barra propia con flechas, pista tramada y thumb |
| `Alert` | aviso con franja semántica |
| `Toast` | notificaciones de bandeja |
| `ProgressBar` | bloques azules segmentados |
| `Tooltip` | tooltip amarillo sobre Radix |
| `Badge` | etiqueta con punto de estado |
| `MenuBar` | menús de ventana sobre Radix |
| `DropdownMenu` | menú desplegable sobre Radix |
| `ContextMenu` | menú contextual sobre Radix |
| `Breadcrumb` | migas de pan |
| `TreeView` | árbol de explorador |
| `Pagination` | páginas anterior/siguiente |
| `Table` | tabla con cabecera elevada |
| `ListBox` | select nativo con filas |
| `StatusBar` | barra de estado segmentada |
| `Icon` | set pixel-art 16/32 |
| `TitleBar` | barra de título reutilizable |
| `Taskbar` | barra de tareas |
| `Panel` | contenedor con bisel configurable |
| `Card` | tarjeta de catálogo con cabecera/pie |
| `Separator` | ranura horizontal o vertical |
| `Toolbar` | barra de herramientas accesible |
| `Desktop` | lienzo con iconos y drag |
| `StartMenu` | menú Inicio con submenús |
| `WindowManager` | arrastre, resize, foco y estados |
| `FileExplorer` | árbol, historial y vistas |
| `Wizard` | asistente por pasos |
| `PropertiesDialog` | diálogo con pestañas |
| `Notepad` | editor de texto |
| `Terminal` | terminal MS-DOS |
| `BlueScreen` | pantalla de error |
| `Screensaver` | salvapantallas |
| `Minesweeper` | buscaminas |

Contrato común:

- `React.forwardRef` y tipos estrictos.
- `className` siempre expuesto y fusionado con `cn`.
- `data-slot` para inspección y test.
- Sin estado visual propio salvo el derivado de atributos nativos
  (`:active`, `aria-pressed`, `:disabled`, `:focus-visible`).
- Sin animaciones con blur; `transition-none`.
- Los controles sin manejador se renderizan como decoración inerte, no como
  botones que no hacen nada.

`Window` es presentacional. `WindowManager` añade encima el comportamiento de
ventanas: arrastre, redimensionado desde ocho bordes, z-index derivado del orden
de foco, minimizar, maximizar/restaurar y cerrar. Mantiene estado interno y
expone `onStateChange` + un ref imperativo para que la taskbar no dependa del DOM
de las ventanas.

`Desktop` aporta el lienzo y los iconos (selección, apertura y drag opcional).
`StartMenu` compone Radix DropdownMenu para submenús, teclado y cierre exterior;
el shell de documentación usa el componente real.

`Dialog` usa el elemento nativo `<dialog>` con `showModal()`. Se obtiene foco
atrapado, Escape, backdrop y restauración de foco sin añadir Radix Dialog. El
componente es controlado (`open`/`onOpenChange`) y no cierra al pulsar el fondo
por defecto, para respetar el comportamiento clásico.

### 3.3 Importaciones y copy & own

El código del monorepo usa imports relativos (`../lib/utils`) para que
TypeScript compile sin alias compartidos. El generador de registry reescribe
esa ruta a `@/lib/utils`, que es la convención de shadcn/ui en el proyecto del
usuario. El CLI hace la misma transformación al copiar y respeta el alias
detectado en el proyecto.

## 4. Registry y CLI

### 4.1 Registry

`packages/ui/scripts/build-registry.mjs` lee los componentes, los transforma y
genera 49 items:

```text
packages/ui/dist/registry/
├── registry.json
├── utils.json
├── button.json
├── checkbox.json
├── alert.json
├── badge.json
├── breadcrumb.json
├── blue-screen.json
├── card.json
├── context-menu.json
├── desktop.json
├── dialog.json
├── dropdown-menu.json
├── file-explorer.json
├── form.json
├── group-box.json
├── icon.json
├── input.json
├── label.json
├── list-box.json
├── menu-bar.json
├── minesweeper.json
├── notepad.json
├── pagination.json
├── panel.json
├── progress-bar.json
├── properties-dialog.json
├── radio-group.json
├── screensaver.json
├── scroll-area.json
├── select.json
├── separator.json
├── slider.json
├── start-menu.json
├── status-bar.json
├── switch.json
├── table.json
├── tabs.json
├── taskbar.json
├── terminal.json
├── title-bar.json
├── toast.json
├── toolbar.json
├── tooltip.json
├── tree-view.json
├── textarea.json
├── window.json
├── window-manager.json
└── wizard.json
```

Cada item sigue el esquema `registry-item.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "dependencies": ["@radix-ui/react-slot", "class-variance-authority"],
  "registryDependencies": ["utils"],
  "files": [
    {
      "path": "components/ui/button.tsx",
      "target": "components/ui/button.tsx",
      "type": "registry:ui",
      "content": "..."
    }
  ]
}
```

- `dependencies`: paquetes npm que el CLI instala.
- `registryDependencies`: items que deben copiarse antes. `dialog` depende de
  `window` y `utils`; `window` de `title-bar`, `status-bar` y `utils`; `form`
  de `label` y `utils`; `taskbar` de `button`; el resto depende de `utils`.
- `files[].content`: código final con imports reescritos.
- El contenido se genera; nunca se edita a mano.

### 4.2 CLI

Paquete `deskui`, binario `deskui`. No tiene dependencias de runtime: usa
`node:util`, `node:fs`, `node:child_process` y `fetch` nativo.

```bash
npx @deskui/cli init
npx @deskui/cli add button input label checkbox textarea window dialog
npx @deskui/cli list
```

`init`:

1. Exige `package.json` y detecta React/Tailwind.
2. Detecta `src/`, el alias de imports y el CSS de entrada.
3. Copia `styles/deskui.css`, fuentes W95FA y `lib/utils.ts`.
4. Inserta `@import "./styles/deskui.css";` después de Tailwind.
5. Escribe `components.json`.
6. Instala `clsx` y `tailwind-merge` si faltan y no se pasó `--no-install`.

`add`:

1. Lee `components.json` (o falla con una instrucción clara).
2. Resuelve `registryDependencies` en profundidad y en orden de dependencia.
3. Comprueba conflictos: un archivo existente con otro contenido exige
   `--overwrite`; las dependencias ya existentes se omiten.
4. Copia con `target` relativos a `src/` (o a la raíz).
5. Instala las dependencias npm de todos los items.
6. Soporta `--dry-run`, `--overwrite` y `--no-install`.

### 4.3 Fuente del registry

Prioridad:

1. `--registry`
2. `DESKUI_REGISTRY`
3. `components.json` → `registry`
4. `packages/ui/dist/registry` (monorepo)
5. `packages/cli/registry` (incluido en el paquete)
6. `https://deskui.codehive.com.co/r`

La copia incluida permite `npx @deskui/cli add …` sin conexión y hace que la
versión del CLI y la del registry sean reproducibles. Para consumir un registry
remoto se pasa `--registry`.

### 4.4 Distribución

`pnpm build:cli` ejecuta `sync-templates.mjs`, `copy-license.mjs` y `tsup`:

- Copia tokens, fuentes y `utils.ts` a `templates/`.
- Copia el registry compilado a `registry/`.
- Copia la licencia MIT dentro del paquete (npm solo incluye `LICENSE` si vive
  en el directorio del paquete).
- Empaqueta el CLI en `dist/index.js` con shebang.

`pnpm release:pack` produce un tarball en `artifacts/` con `dist`, `templates`,
`registry`, README y licencia. El flujo completo se prueba instalando el tarball
en un proyecto temporal, ejecutando `init` y `add dialog`, y compilando un
consumidor con Vite.

El sitio también publica el registry: `pnpm registry:site` copia
`packages/ui/dist/registry` a `apps/docs/public/r`, de modo que el build de Vite
genera `dist/r` y el CLI puede usar `https://deskui.codehive.com.co/r` como URL
por defecto. `pnpm release:check` verifica que las tres copias (UI, CLI y sitio)
coinciden en número de items.

## 5. Sitio de documentación

Decisión confirmada: **Vite + React**, no Next.js por ahora. La documentación
usa un router por hash (`#/...`), por lo que funciona como SPA estática sin
configuración de servidor.

Estructura:

- Shell tipo escritorio: ventana, menú, sidebar tipo explorador, status bar y
  taskbar.
- Páginas: Inicio, Instalación, Componentes, una página por componente,
  Theming, Acerca de, Guía de composición, Changelog, Contribuir y Constructor.
- Cada página de componente incluye vista previa, código copiable, comando de
  instalación, tabla de props y notas de accesibilidad.
- El explorador y el buscador consumen `content/manifest.ts`; las previews y el
  código se cargan bajo demanda. El explorador muestra los componentes en una
  lista alfabética con scroll propio y buscador fijo.
- El laboratorio usa una ventana de altura de viewport y dos columnas
  equilibradas para aprovechar el ancho en escritorio.
- Las guías largas se escriben en MDX y se cargan como chunks independientes.
- Los showcases de tienda y red social son rutas lazy con datos mock y
  componentes reales.
- Metadatos por ruta: título, descripción, robots, canonical y Open Graph.
- El laboratorio sigue disponible en `#/laboratorio`; el Page Builder en
  `#/constructor`.
- El tema se sincroniza con `?theme=` y se persiste en `localStorage`; si no
  hay preferencia, se usa `classic`. El alto contraste es una elección explícita
  y no depende de `prefers-color-scheme` (D-039).
- `Ctrl/Cmd+K` abre el buscador de componentes desde cualquier ruta.

La separación contenido/página permite migrar a Next.js o a un generador
estático sin tocar los componentes.

### 5.1 Page Builder

El Page Builder es una herramienta del sitio, no un item del registry (D-029).
Se carga con `React.lazy` en `#/constructor` y el shell oculta el sidebar para
dar más espacio al lienzo.

Capas:

- **Modelo puro** (`apps/docs/src/lib/builder`): tipos, catálogo de 20 bloques,
  operaciones inmutables del árbol, plantillas, exportación y almacenamiento.
  No importa React ni toca el DOM.
- **Renderer** (`components/builder/blocks.tsx`): traduce el árbol a componentes
  reales de la librería y envuelve cada bloque con una capa seleccionable.
- **Editor** (`components/builder/`): paleta, lienzo con DnD, árbol de capas
  accesible, propiedades y diálogos.
- **Orquestación** (`pages/builder.tsx`): estado del documento, selección,
  acciones, atajos, autoguardado y exportación.

El documento es JSON versionado (D-030). `normalizeDocument` valida versión,
tipos, props, profundidad (8), número de bloques (200) y longitudes de texto.
Las props desconocidas se descartan y los ids duplicados se regeneran. El tema y
el fondo forman parte del documento y se aplican con `data-theme` en el preview.

La exportación genera JSX con imports por archivo (`@/components/ui/...`), JSON y
los comandos `npx @deskui/cli add`. El catálogo es la fuente única de defaults y
campos; el renderer y el exportador se mantienen en paralelo y se cubren con
tests de exportación.

El DnD usa HTML5 nativo (D-032). La alternativa de teclado es Subir/Bajar,
`Alt + ↑/↓` y el árbol de capas con flechas. La persistencia es local
(`localStorage`, D-031); compartir consiste en exportar e importar JSON.

### 5.2 i18n español/inglés

La documentación y los textos internos de la librería se separan en dos capas:

- **Sitio** (`apps/docs/src/i18n/`): `messages.ts` es la fuente de verdad de la
  forma; `en` se tipa contra `typeof es` para que TypeScript detecte claves
  faltantes. `provider.tsx` resuelve `t("clave", { vars })`, elige el idioma por
  `?lang=en` o `localStorage`, actualiza `<html lang>` y la URL, y expone
  `messages` para arrays. Las fichas de componentes viven en
  `component-docs.en.ts` (descripción, props, notas y código) y las previews en
  `component-copy.ts`; un test verifica que el overlay conserva la estructura.
  Las guías tienen versiones `*.en.mdx`.
- **Librería** (`packages/ui/src/lib/i18n.tsx`): `DeskUILocaleProvider` y
  `useDeskUILocale` con diccionarios `es`/`en`. Los componentes usan etiquetas
  del diccionario como valores por defecto y siguen aceptando props explícitas.
  El item `i18n` del registry se añade automáticamente como dependencia cuando
  el código copiado importa `@/lib/i18n`.

El idioma por defecto es español para conservar el comportamiento previo; el
inglés se activa explícitamente. El selector ES/EN vive en la bandeja de la
barra de tareas y no requiere recargar.

### 5.3 IA y agentes

El material para agentes se trata como documentación de primera clase:

- `AGENTS.md` en la raíz: mapa, comandos, convenciones, routing de skills y
  reglas de cambio.
- `skills/`: fuente canónica de cuatro skills (`deskui`, `deskui-composition`,
  `deskui-page-builder`, `deskui-i18n`) y referencias compartidas.
- `scripts/sync-skills.mjs`: copia `skills/` a `.opencode/skills/` y
  `.agents/skills/`; `--check` falla si hay deriva.
- `scripts/build-llms.mjs`: genera `llms.txt` y `llms-full.txt` desde las
  skills y sus referencias.
- `deskui init`: copia las skills al proyecto consumidor y actualiza una sección
  gestionada de `AGENTS.md` entre `<!-- deskui:start -->` y
  `<!-- deskui:end -->`. `--no-agents` lo omite.

Las skills no duplican la API completa: la skill principal enlaza a
`references/components.md`, `composition.md`, `patterns.md`, `i18n.md`,
`cli.md`, `checklist.md`, `design-tokens.md` y `page-builder.md`.

## 6. Testing

- **Vitest + Testing Library**: 118 tests de comportamiento de los 47
  componentes.
- **Vitest del Page Builder**: 41 tests de modelo, plantillas, exportación,
  almacenamiento y payload de DnD, en entorno Node.
- **axe-core**: composición base sin violaciones detectables. El contraste se
  revisa en navegador, no en jsdom.
- **CLI**: 12 tests de init, add, conflictos, dry-run, path traversal, alias, skills y
  list.
- **Playwright**: 28 tests E2E con Chromium; buscador, toolbar, diálogo, tema, idioma,
  metadatos, escritorio, menú Inicio, gestor de ventanas, aplicaciones icónicas,
  showcases, Page Builder, axe en 27 rutas y 6 capturas de regresión visual.
- **Validación end-to-end**: tarball del CLI → proyecto temporal → `init` →
  `add` → build de Vite.

## 7. Decisiones y compromisos

| Decisión | Motivo | Compromiso |
| --- | --- | --- |
| React 19 + TypeScript estricto | API moderna, composición y tipos | Requiere React 18+ en consumidores |
| Tailwind 4 con `@theme inline` | Tokens nativos y CSS pequeño | El consumidor debe usar Tailwind 4 |
| Radix Slot, Tabs, Tooltip y menús + `<dialog>` nativo | Accesibilidad de primitivas sin escribirla desde cero | Más dependencias para Tabs, Tooltip, MenuBar, Dropdown y ContextMenu |
| CLI sin dependencias de runtime | Instalación rápida y superficie mínima | Parseo de argv y prompts manuales |
| Registry incluido en el CLI | Funciona offline y versiona el contrato | Para actualizar componentes hay que actualizar el CLI o usar `--registry` |
| Vite + router por hash | Laboratorio y docs en un solo build estático | SEO y metadata por ruta requieren trabajo extra |
| W95FA (SIL OFL) | Recreación libre y métricamente cercana | El bold es sintético |
| Iconos SVG propios 16×16 | Evitar assets con copyright y controlar el trazo | El catálogo crece de forma incremental |
| Bisel con `box-shadow` inset | 4 capas exactas sin imágenes | No se puede combinar con `box-shadow` libre sin perder el bisel |
| Alturas 21/23 px en escritorio | Fidelidad de los controles originales | En móvil suben a 24 px |
| Texto secundario `#404040` | Contraste AA sobre `#C0C0C0` | Se aleja del gris `#808080` de la referencia |
| Tema clásico plano por defecto | estilo clásico original | El tema Gradiente queda como alternativa |
| El fondo no cierra el Dialog | Comportamiento clásico | Se puede activar con `dismissOnBackdrop` |
| Form sobre React Hook Form + Zod | Validación tipada y errores accesibles | Añade tres dependencias al instalar Form |
| Page Builder fuera del registry | Herramienta del sitio y dogfooding | No se copia con el CLI; el modelo se puede extraer |
| JSON versionado + export JSX | Formato legible y reproducible | Renderer y exportador son dos implementaciones |
| `localStorage` + JSON | Sin backend en el MVP | Sin enlaces compartibles ni colaboración |
| DnD nativo + teclado | Sin dependencia extra | El E2E simula `DragEvent` para validar los handlers |

## 8. Riesgos abiertos

- **Escritura no transaccional del CLI**: si la instalación npm falla después
  de copiar archivos, los archivos quedan. Un `--dry-run` previo ayuda; se
  podría añadir rollback en una fase posterior.
- **Registry versionado con el CLI**: el usuario puede quedar en una versión
  antigua de un componente hasta actualizar el CLI. El flag `--registry`
  mitiga el problema.
- **Scrollbars nativas**: el estilo de 16 px funciona, pero Chrome/Firefox no
  permiten botones de flecha con CSS. `ScrollArea` resuelve la fidelidad con
  flechas, pista y thumb propios; los contenedores que siguen usando scroll
  nativo conservan el estilo de 16 px sin flechas.
- **Fuente bold sintética** puede engrosar de forma irregular en algunos
  sistemas; evaluar una versión bold libre.
- **Renderer y exportador del Page Builder** son dos implementaciones; un bloque
  nuevo debe añadirse a ambos. El catálogo y los tests de exportación reducen la
  deriva, pero no la eliminan.
- **Esquema del Page Builder**: un cambio incompatible exige subir `version` y
  añadir migración en `normalizeDocument`; hoy no hay migraciones.
- **DnD nativo en CI**: Chromium sin interfaz no siempre emite `drop` con
  `dragTo`; el E2E despacha `DragEvent` con `DataTransfer`. La alternativa de
  teclado cubre el flujo sin puntero.
- **Persistencia del Page Builder**: `localStorage` es por navegador y puede
  estar bloqueado o lleno; el JSON exportado es el respaldo.
