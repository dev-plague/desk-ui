# Roadmap

> El estado vivo (qué está hecho, qué falta y riesgos) está en
> [`PROGRESS.md`](PROGRESS.md). Este documento describe la secuencia planificada.

## Fase 0 — Validación (completada)

- [x] Monorepo pnpm con `packages/ui` y `apps/docs`.
- [x] Tokens completos: color, biseles, tipografía, geometría, seis temas.
- [x] `Button`, `Window` e `Input` con tipos y composición.
- [x] Laboratorio visual responsive con escritorio, taskbar, menú Inicio y
  selector de tema.
- [x] Tests de comportamiento (11) y axe.
- [x] Registry compatible con shadcn generado desde el código fuente.
- [x] Documentación de arquitectura, tokens, referencias y roadmap.

**Criterio de salida:** el estilo se valida en escritorio y móvil, los tres
componentes se sienten parte del mismo sistema y el registry puede copiarlos
sin dependencias ocultas.

## Fase 1 — Componentes base + documentación

### Primer corte (completado)

- [x] CLI `deskui` con `init`, `add` y `list`.
- [x] Registry compatible con shadcn (49 items), resolución de dependencias,
  conflicto de archivos, `--dry-run`, `--overwrite` y `--no-install`.
- [x] Registry incluido en el paquete para funcionar sin conexión.
- [x] `Label`, `GroupBox`, `Checkbox`, `Textarea`, `RadioGroup`, `Select`,
  `Switch`, `Slider`, `Form`, `Tabs`, `ScrollArea`, `Alert`, `Toast`,
  `ProgressBar`, `Tooltip`, `Badge`, `MenuBar`, `DropdownMenu`,
  `ContextMenu`, `Breadcrumb`, `TreeView`, `Pagination`, `Table`, `ListBox`,
  `StatusBar`, `Icon`, `TitleBar` y `Taskbar`.
- [x] `Dialog` modal sobre `<dialog>` nativo (Escape, foco atrapado y backdrop).
- [x] Shell de documentación en Vite, navegación tipo explorador, búsqueda
  pendiente.
- [x] Páginas de Inicio, Instalación, Theming y Acerca de.
- [x] Páginas de los 47 componentes con vista previa, código, props y notas de
  accesibilidad.
- [x] Documentación en español (ampliada a inglés en D-034) y decisión de
  mantener Vite.
- [x] 123 tests (113 UI + 10 CLI) y 20 tests Playwright.
- [x] Prueba end-to-end del flujo: `pack` → instalar CLI → `init` → `add dialog`
  → build de un consumidor con Vite.

### Fase 1 completada

- [x] Contenedores restantes: `Panel`, `Card`, `Separator`, `Toolbar`.
- [x] Buscador de componentes (`Ctrl+K`) y contenido MDX para guías.
- [x] Metadatos por ruta y code-splitting del sitio.
- [x] Playwright para teclado, foco, diálogos, axe y regresión visual.
- [x] Persistencia de tema y `prefers-color-scheme`.
- [x] Guía de composición y Do & Don't ampliados.
- [x] Páginas de Changelog y Contribuir en el sitio.
- [ ] Publicación del CLI en npm (Fase 4).

**Criterio de salida:** un consumidor puede ejecutar `init`, añadir cualquier
componente del MVP y construir una pantalla coherente sin tocar CSS.

## Fase 2 — Componentes icónicos + Showcase (completada)

### Primer corte (completado)

- [x] `Desktop` con iconos seleccionables y arrastrables.
- [x] `StartMenu` con submenús en cascada y barra lateral.
- [x] `WindowManager`: arrastre, resize, foco, z-index,
  minimizar/maximizar/restaurar.
- [x] Integración con `Taskbar` mediante snapshot + ref imperativo.

### Segundo corte (completado)

- [x] `FileExplorer` en vistas de iconos, lista y detalles.
- [x] `Wizard` con pasos Atrás/Siguiente/Cancelar.
- [x] `PropertiesDialog` con pestañas.
- [x] `Notepad`, `Terminal` MS-DOS, `BlueScreen`, `Screensaver`.
- [x] `Minesweeper` como prueba de interactividad.
- [x] Showcase de tienda retro y red social.

**Criterio de salida:** dos aplicaciones completas, navegables, responsive y
accesibles, construidas solo con la librería.

## Fase 3 — Page Builder (MVP completado)

### MVP

- [x] Paleta de componentes, lienzo, panel de propiedades y árbol de capas.
- [x] Añadir, seleccionar, mover, reordenar, duplicar y eliminar.
- [x] Plantillas: escritorio, formulario, tienda, red social, página personal.
- [x] Selector de tema en vivo.
- [x] Exportar JSX y JSON, con la lista de comandos `add`.
- [x] Guardado en `localStorage` y compartir por JSON.
- [x] Preview responsive móvil/tablet/escritorio.

### Después del MVP

- [x] i18n español/inglés del sitio y de los textos internos de la librería
  (D-034).
- [x] Skills para agentes, `AGENTS.md`, `llms.txt` y copia desde el CLI
  (D-035).
- [ ] Undo/redo y multiselección.
- [x] Atajos de teclado básicos (duplicar, eliminar, mover, guardar, Escape).
- [ ] Persistencia en backend y enlaces compartibles.
- [ ] Exportación a Next.js, Astro y HTML estático.
- [ ] Sistema de plugins o bloques de usuario.

**Criterio de salida:** una persona puede componer una página, previsualizarla
en tres tamaños, exportarla y reproducirla en un proyecto nuevo.

## Fase 4 — Publicación

- [x] Build de paquetes, versionado 0.2.0 y changelog.
- [x] Registry estático servido por el sitio en `https://deskui.codehive.com.co/r`.
- [x] Guía de despliegue en el VPC con nginx, TLS, caché y rollback.
- [x] Guía de migración entre versiones (`#/migracion`).
- [x] Revisión de licencias de fuentes, iconos y dependencias.
- [x] Empaquetado del CLI con licencia y metadatos npm.
- [x] Deploy del sitio y del registry en `deskui.codehive.com.co`.
- [ ] Publicación en npm del CLI y verificación con `npx deskui`.
- [ ] Decisión sobre publicar `@deskui/ui`.

## Fuera de alcance por ahora

- Motor de temas con editor visual de variables.
- Soporte de otros frameworks (Vue, Svelte, Web Components).
- Sonidos de sistema y cursores personalizados (opcionales, desactivados por
  defecto).
- Backend del builder y colaboración en tiempo real.
