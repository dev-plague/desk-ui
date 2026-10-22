# Changelog

Todas las versiones relevantes se documentan aquí. El proyecto sigue
[Semantic Versioning](https://semver.org/).

## [0.2.0] — 2026-10-22

### Añadido

- **Publicación y despliegue público**: sitio y registry en
  <https://deskui.codehive.com.co>, README orientado a consumidores y página
  «Acerca de» con enlaces a GitHub y npm. El CLI `@deskui/cli@0.2.0` queda empaquetado
  para publicarse en npm.
- **Pipeline de publicación**: registry estático servido por el sitio en `/r`,
  script `registry:site`, comprobación de release (`release:check`), auditoría de
  licencias (`licenses:check`) y comandos `release:build`, `release:pack`,
  `release:bundle` y `release:verify`.
- **Imagen Docker** para Dokploy (`Dockerfile`, `.dockerignore` y
  `deploy/nginx.conf`) con sitio y registry en el mismo contenedor.
- Guía de migración entre versiones en `#/migracion`, `docs/migration.md` y
  `docs/releasing.md`; guía de despliegue en `docs/deployment.md`.
- **i18n español/inglés**: sitio de documentación bilingüe con selector en la
  barra de tareas, `?lang=en`, persistencia en `localStorage`, `<html lang>`,
  metadatos localizados, guías MDX en ambos idiomas y fichas de los 47
  componentes traducidas.
- `DeskUILocaleProvider` y `useDeskUILocale` en `@deskui/ui` para los textos
  internos de los componentes, con diccionarios `es`/`en` y sobrescrituras
  parciales. El registry incluye `i18n` como dependencia de los componentes que
  lo usan (49 items).
- **Skills para agentes**: `deskui`, `deskui-composition`, `deskui-page-builder`
  y `deskui-i18n`, con referencias de API, composición, patrones, i18n, CLI,
  checklist, tokens y Page Builder.
- `AGENTS.md` en la raíz, `docs/ai.md`, `llms.txt` y `llms-full.txt`.
- `deskui init` copia las skills a `.agents/skills/` y `.opencode/skills/` y
  añade una sección de DeskUI a `AGENTS.md`; `--no-agents` lo omite.
- Contenedores `Panel`, `Card`, `Separator` y `Toolbar`, con tests, registry y
  páginas de documentación.
- **Fase 2**: `Desktop` con iconos seleccionables/arrastrables, `StartMenu` con
  submenús en cascada y `WindowManager` con arrastre, resize, foco, z-index y
  estados de ventana.
- Aplicaciones icónicas: `FileExplorer`, `Wizard`, `PropertiesDialog`,
  `Notepad`, `Terminal`, `BlueScreen`, `Screensaver` y `Minesweeper`.
- Showcases de tienda retro (catálogo, carrito, checkout) y red social (feed,
  perfil, comentarios).
- **Fase 3**: Page Builder en `#/constructor` con 20 bloques, paleta, lienzo,
  propiedades, árbol de capas y DnD.
- Plantillas de escritorio, formulario, tienda, red social y página personal,
  además de lienzo vacío.
- Selector de tema en vivo y preview responsive móvil (390 px), tablet (768 px) y
  escritorio (100 %).
- Exportación JSX con imports por archivo, JSON y comandos `npx @deskui/cli add`.
- Guardado automático en `localStorage`, importación/exportación de JSON y
  atajos de teclado básicos.
- 39 tests unitarios del Page Builder y 7 tests E2E nuevos (6 funcionales +
  captura visual, incluido axe con plantilla).
- Integración `WindowManager` + `Taskbar` mediante snapshot y ref imperativo.
- El shell de documentación usa el `StartMenu` real.
- Buscador de componentes (`Ctrl/Cmd+K`) con navegación por teclado.
- Guías en MDX: `#/guia`, `#/cambios` y `#/contribuir`.
- Metadatos por ruta: título, descripción, robots, canonical y Open Graph.
- Persistencia de tema en `localStorage` y soporte de `prefers-color-scheme`.
- Suite Playwright: teclado, foco, diálogos, axe en 27 rutas y 6 capturas de
  regresión visual.
- Scripts `pnpm test:e2e` y `pnpm test:e2e:update`.

### Cambiado

- Versión **0.2.0** en el workspace, los paquetes y la documentación. El CLI
  declara `publishConfig`, metadatos npm y licencia dentro del paquete.
- El registry remoto por defecto pasa a `https://deskui.codehive.com.co/r`; el
  build copia el registry compilado a `apps/docs/public/r`.
- **Rebranding a DeskUI**: textos, metadatos, CLI `deskui`, paquetes
  `@deskui/*`, template `deskui.css`, claves locales y tema base `classic`; el
  tema con degradado pasa a `gradient`.
- El constructor de páginas ocupa toda la altura disponible: la paleta usa dos
  columnas sin scroll permanente y el lienzo y el inspector aprovechan el alto
  de la ventana.
- `ScrollArea` usa una barra clásica dibujada por el componente: flechas
  elevadas, pista con trama de 50 %, thumb cuadrado y arrastre, con la misma
  geometría en Chrome y Firefox.
- El sidebar de documentación muestra los 47 componentes en una lista única
  ordenada alfabéticamente, con buscador fijo y scroll independiente.
- El laboratorio usa una ventana más ancha, altura de viewport y dos columnas
  equilibradas para aprovechar el espacio horizontal.
- El sitio carga docs, laboratorio, contenido de componentes y guías por rutas
  separadas (code-splitting); el Page Builder tiene su propio chunk.
- El shell oculta el sidebar en `#/constructor` y añade Constructor al sidebar,
  menú Inicio y menús Archivo/Ver.
- La portada y las páginas de estado reflejan la Fase 3.
- El explorador y el buscador usan un manifiesto ligero del catálogo.
- El diálogo refuerza el foco atrapado con un ciclo de Tab propio, además del
  comportamiento nativo.
- `pnpm test` cubre UI + CLI + tests del Page Builder; la validación de navegador
  se ejecuta con `pnpm test:e2e`.

### Corregido

- Escape cierra el buscador aunque el campo de búsqueda tenga texto.
- El foco no escapa al documento al final del ciclo de Tab dentro de un
  diálogo.
- Las guías MDX ya no anidan párrafos dentro de `AlertDescription`.
- Las tablas Markdown de las guías se renderizan como tablas reales
  (`remark-gfm`).
- El `ProgressBar` del Page Builder recibe un nombre accesible y las plantillas
  incluyen un `h2` antes de las tarjetas `h3` para no saltar niveles de
  encabezado.

## [0.1.0] — 2026-10-21

### Añadido

- CLI `deskui` con `init`, `add` y `list`, sin dependencias de runtime.
- Registry compatible con shadcn con 33 items y copia offline incluida en el
  paquete del CLI.
- Detección de alias, `src/`, CSS de entrada, gestor de paquetes y Tailwind 4.
- Resolución de `registryDependencies`, conflictos de archivos, `--dry-run`,
  `--overwrite` y `--no-install`.
- Componentes `Label`, `GroupBox`, `Checkbox`, `Textarea`, `RadioGroup`,
  `Select`, `Switch`, `Slider`, `Form`, `Tabs`, `ScrollArea`, `Alert`,
  `Toast`, `ProgressBar`, `Tooltip`, `Badge`, `MenuBar`, `DropdownMenu`,
  `ContextMenu`, `Breadcrumb`, `TreeView`, `Pagination`, `Table`, `ListBox`,
  `StatusBar`, `Icon`, `TitleBar`, `Taskbar` y `Dialog` (basado en
  `<dialog>` nativo).
- Documentación en español con shell tipo escritorio, sidebar explorador,
  páginas por componente, vista previa/código, props y theming.
- Página de instalación, temas, acerca de, changelog y guía de contribución.
- 60 tests de UI y 10 tests de CLI.
- Validación end-to-end del flujo `pack` → instalación → `init` → `add dialog`
  → build de un consumidor con Vite.
- Capturas de documentación, temas y móvil en `docs/assets`.
- Documentación viva de trazabilidad: `docs/PROGRESS.md`,
  `docs/REQUIREMENTS.md`, `docs/DECISIONS.md` y el índice `docs/README.md`.

### Cambiado

- Versión del workspace a `0.1.0`.
- La documentación mantiene Vite + router por hash; se descarta Next.js por
  ahora.
- El título de ventana inactiva se oscureció para mantener contraste AA.
- El área táctil de los controles sube a 24 px en móvil.

### Corregido

- `GroupBox` usa la leyenda clásica sobre el borde: su fondo enmascara la
  línea superior y crea la muesca tradicional.
- Alineación vertical del texto en `Input` y `Textarea`.
- Etiquetas explícitas para campos deshabilitados.
- El estado maximizado ya no deja scroll residual en el escritorio.
- El sidebar móvil se cierra al navegar.

## [0.0.0] — 2026-10-21

### Añadido

- Monorepo pnpm con `packages/ui` y `apps/docs`.
- Design tokens completos: color, tipografía, geometría, biseles y foco.
- Temas `classic`, `gradient`, `high-contrast`, `desert`, `rose` y `storm`.
- Componentes `Button` (default, primary, icon, toggle), `Window`
  (TitleBar/Body/StatusBar) e `Input`.
- Tipografía W95FA con licencia SIL OFL y archivo de licencia.
- Set inicial de iconos pixel art originales.
- Laboratorio visual responsive con escritorio, taskbar, menú Inicio y
  selector de tema.
- Generador de registry compatible con shadcn en `packages/ui/dist/registry`.
- Tests de Vitest + Testing Library + axe (11 tests).
- Documentación de arquitectura, tokens, componentes, referencias y roadmap.
- Licencia MIT para el código.

### Decisiones

- Tema clásico plano por defecto; degradado del tema Gradiente como alternativa.
- Controles de 24 px en móvil y densidad de 21/23 px en escritorio.
- Texto secundario `#404040` y barra inactiva más oscura para cumplir AA.
- Iconos y fuentes sin assets propietarios de terceros.

### Pendiente

- CLI `init`/`add`, catálogo de Fase 1, sitio de documentación completo,
  Showcase, Window Manager y Page Builder.
