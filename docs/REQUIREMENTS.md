# REQUIREMENTS — Alcance y trazabilidad

> Cada requisito tiene un ID estable. Los estados posibles son **Done**,
> **Partial**, **Pending**, **Superseded** y **Rejected**. Los requisitos nuevos
> se añaden al final con un ID `NR-*`; no se reescribe el histórico.
>
> Estado vivo: `PROGRESS.md` · Decisiones: `DECISIONS.md` · Plan: `roadmap.md`.

## 1. Fundaciones del producto

| ID | Requisito | Estado | Evidencia / notas |
| --- | --- | --- | --- |
| RQ-001 | Distribución *copy & own* mediante registry compatible con shadcn | Done | `packages/ui/scripts/build-registry.mjs`, `dist/registry` |
| RQ-002 | CLI que instala componentes individualmente y resuelve dependencias | Done | `deskui init/add/list`, 12 tests |
| RQ-003 | Monorepo pnpm con UI, CLI y docs | Done | `pnpm-workspace.yaml` |
| RQ-004 | React + TypeScript estricto + Tailwind 4 + primitivas accesibles | Done | React 19, TS 5.9, Tailwind 4, Radix selectivo |
| RQ-005 | Tematización solo con tokens CSS, sin colores hardcodeados | Done | `packages/ui/src/styles/tokens.css` |
| RQ-006 | Componentes responsive y usables en móvil | Done | Alturas táctiles de 24 px, layout móvil en docs |
| RQ-007 | Accesibilidad por defecto: teclado, roles, foco, contraste | Done | axe 0 violaciones en 27 rutas; Playwright cubre foco y teclado |
| RQ-008 | Los componentes copiados no dependen de una librería opaca | Done | CLI copia fuente + utils; dependencias declaradas |

## 2. Identidad visual

| ID | Requisito | Estado | Evidencia / notas |
| --- | --- | --- | --- |
| RQ-010 | Paleta clásica: gris, azul marino, teal, selección | Done | Tokens semánticos y 6 temas |
| RQ-011 | Biseles de 2 px, sin radios, foco punteado, sin blur | Done | Utilidades `bevel-*`, `focus-dotted` |
| RQ-012 | Tipografía pixelada libre, 11/12 px | Done | W95FA SIL OFL |
| RQ-013 | Iconos pixel-art originales 16/32 px | Done | Componente `Icon`, 7 iconos |
| RQ-014 | Estados hover, active, focus, disabled, pressed | Done | Componentes y tests |
| RQ-015 | Tema base clásico + temas alternativos | Done | `classic`, `gradient`, `high-contrast`, `desert`, `rose`, `storm` |
| RQ-016 | Cursores/sonidos opcionales y desactivados | Pending | No implementado; no bloquea el MVP |
| RQ-017 | Animaciones mínimas/instantáneas | Done | `transition-none`; sin blur |
| RQ-018 | Nombre propio DeskUI, sin marcas ni assets de terceros | Done | D-033; aviso de proyecto original |

## 3. Componentes de Fase 1

| ID | Requisito | Estado | Evidencia / notas |
| --- | --- | --- | --- |
| RQ-020 | Acciones: Button y variantes | Done | default, primary, icon, toggle |
| RQ-021 | Formularios: Input, Textarea, Checkbox, RadioGroup, Select, Switch, Slider, Label, Form | Done | Form con RHF + Zod |
| RQ-022 | Contenedores: Window, GroupBox, Panel, Card, Separator, Toolbar, ScrollArea, Tabs | Done | Panel, Card, Separator y Toolbar añadidos |
| RQ-023 | Navegación: MenuBar, DropdownMenu, ContextMenu, Breadcrumb, TreeView, Pagination | Done | Radix + TreeView propio |
| RQ-024 | Feedback: Dialog/MessageBox, Alert, Toast, ProgressBar, Tooltip, Badge | Done | Dialog nativo + feedback completo |
| RQ-025 | Datos: Table, ListBox, StatusBar | Done | Tabla, list box nativa y barra de estado |
| RQ-026 | Utilidades: Icon, TitleBar, Taskbar | Done | `TitleBar`/`StatusBar` compartidas con Window |
| RQ-027 | Cada componente: variantes, props, estados y notas a11y | Done | Páginas de los 47 componentes |
| RQ-028 | Registry individual por componente con dependencias | Done | 49 items (incluye `i18n`) |

## 4. Documentación

| ID | Requisito | Estado | Evidencia / notas |
| --- | --- | --- | --- |
| RQ-030 | Home/landing con propuesta y demo | Done | `#/` |
| RQ-031 | Getting Started: install, Tailwind, CLI | Done | Página Instalación |
| RQ-032 | Theming y creación de temas | Done | Página Temas + `design-tokens.md` |
| RQ-033 | Página por componente con Preview/Code, copiar, `add`, props y a11y | Done | 47 páginas |
| RQ-034 | Buscador de componentes | Done | Diálogo con Ctrl+K, filtros y teclado |
| RQ-035 | Navegación lateral tipo explorador | Done | Sidebar + versión móvil |
| RQ-036 | Sitio con estética de escritorio sin perder legibilidad | Done | Shell de ventana, menú, taskbar |
| RQ-037 | Changelog y guía de contribución | Done | Páginas MDX `#/cambios` y `#/contribuir` |
| RQ-038 | Dogfooding de la librería en la documentación | Done | Shell usa Window, MenuBar, Taskbar, ToastProvider, Icon |
| RQ-039 | Contenido MDX y metadatos por ruta | Done | Guías MDX, título/descripción/robots/canonical |

## 5. Showcase

| ID | Requisito | Estado | Evidencia / notas |
| --- | --- | --- | --- |
| RQ-040 | Tienda online retro navegable con mock data | Done | `#/showcase/tienda` |
| RQ-041 | Red social retro con feed, perfil, mensajería | Done | `#/showcase/red-social` |
| RQ-042 | Dashboard/blog/portafolio opcional | Partial | Plantilla «Página personal» del Page Builder; no hay showcase dedicado |
| RQ-043 | Código fuente visible, responsive y accesible | Pending | Se validará con Playwright/axe |

## 6. Page Builder

| ID | Requisito | Estado | Evidencia / notas |
| --- | --- | --- | --- |
| RQ-050 | Editor con paleta, lienzo, propiedades y capas | Done | `#/constructor`; `apps/docs/src/pages/builder.tsx` y `components/builder/` |
| RQ-051 | Drag & drop, reordenar, duplicar y eliminar | Done | DnD nativo + Capas; Subir/Bajar y Alt+flechas como alternativa |
| RQ-052 | Plantillas iniciales | Done | Escritorio, formulario, tienda, red social, página personal y lienzo vacío |
| RQ-053 | Selector de tema en vivo | Done | `data-theme` en el preview; el tema forma parte del JSON y del JSX |
| RQ-054 | Exportar JSX/JSON + comandos `add` | Done | `lib/builder/export.ts`; imports por archivo y comandos del CLI |
| RQ-055 | Guardado local y compartir JSON | Done | Autoguardado en `localStorage` + exportar/importar JSON |
| RQ-056 | Preview responsive móvil/tablet/escritorio | Done | 390 px, 768 px y 100 %; probado con Playwright |

## 7. Calidad, rendimiento y licencias

| ID | Requisito | Estado | Evidencia / notas |
| --- | --- | --- | --- |
| RQ-060 | Espaciado y jerarquía consistentes | Done | Tokens + guía de composición parcial |
| RQ-061 | Guías de composición de ventanas y diálogos | Done | `#/guia` en MDX con Do & Don't |
| RQ-062 | Paleta restringida y uso semántico del color | Done | Tokens semánticos |
| RQ-063 | Contraste AA y tema de alto contraste | Done | `#404040`, barra inactiva ajustada, HC |
| RQ-064 | Bundle ligero y assets optimizados | Done | Code-splitting; entry ~253 KB, componentes ~257 KB |
| RQ-065 | Tests de componentes, accesibilidad y regresión visual | Done | 171 unitarios (118 UI + 12 CLI + 41 docs) + 28 E2E + axe |
| RQ-066 | Sección Do & Don't | Done | Home de docs |
| RQ-067 | Sin assets propietarios de terceros; licencias indicadas | Done | MIT + W95FA OFL + iconos originales |
| RQ-068 | Compatibilidad con navegadores modernos | Done | React 19, Tailwind 4, `<dialog>` nativo |
| RQ-069 | README, contribución y roadmap | Done | Raíz + `docs/` |

## 8. Requisitos nuevos (cambios de alcance)

| ID | Fecha | Requisito | Estado | Decisión / evidencia |
| --- | --- | --- | --- | --- |
| NR-001 | 2026-10-21 | GroupBox con pestaña tipo carpeta | Superseded | Reemplazado por NR-002 |
| NR-002 | 2026-10-21 | GroupBox simple y fiel: leyenda sobre el borde con muesca, sin pestaña elevada | Done | D-010; `group-box.tsx` |
| NR-003 | 2026-10-21 | Continuar con feedback + navegación | Done | Alert, Toast, ProgressBar, Tooltip, Badge, menús, Breadcrumb, TreeView, Pagination |
| NR-004 | 2026-10-21 | Continuar con datos + utilidades | Done | Table, ListBox, StatusBar, Icon, TitleBar, Taskbar |
| NR-005 | 2026-10-21 | Documentación viva de progreso, requisitos y decisiones | Done | `PROGRESS.md`, `REQUIREMENTS.md`, `DECISIONS.md` |
| NR-006 | 2026-10-21 | Mantener Vite, documentación en español y nombre `deskui` / `@deskui/*` | Superseded | D-001, D-009; el idioma se amplía en NR-013 |
| NR-007 | 2026-10-21 | Evitar margen izquierdo en la pestaña del GroupBox (primera iteración) | Superseded | La solución final fue la leyenda clásica (NR-002) |
| NR-008 | 2026-10-21 | Cerrar contenedores restantes y la infraestructura de documentación | Done | Panel, Card, Separator, Toolbar, buscador, MDX, metadatos, Playwright, code-splitting y temas persistentes |
| NR-009 | 2026-10-21 | Primer corte de Fase 2: escritorio, menú Inicio y gestor de ventanas | Done | Desktop, StartMenu y WindowManager con docs, tests y registry |
| NR-010 | 2026-10-21 | Cerrar la Fase 2: aplicaciones icónicas y showcases | Done | FileExplorer, Wizard, PropertiesDialog, Notepad, Terminal, BlueScreen, Screensaver, Minesweeper, tienda y red social |
| NR-011 | 2026-10-21 | Cerrar el MVP de la Fase 3: Page Builder | Done | Constructor en `#/constructor`, 20 bloques, 6 plantillas, exportación JSX/JSON, guardado local y preview responsive |
| NR-012 | 2026-10-22 | Rebranding a DeskUI y layout del constructor a altura completa | Done | D-033; paleta de dos columnas sin scroll permanente |
| NR-013 | 2026-10-22 | i18n español/inglés en la documentación y en los textos internos de los componentes | Done | D-034; `apps/docs/src/i18n/`, `DeskUILocaleProvider`, selector ES/EN y `?lang=en` |
| NR-014 | 2026-10-22 | Material para agentes IA: skills, `AGENTS.md`, `llms.txt` y copia desde el CLI | Done | D-035; `skills/`, `docs/ai.md`, `deskui init` y `--no-agents` |
| NR-015 | 2026-10-22 | Preparar la publicación 0.2.0: versionado, registry estático en `/r`, auditoría de licencias y guías de release, despliegue y migración | Partial | D-036, D-037 y D-038; sitio y registry en producción; `deskui@0.2.0` empaquetado, publicación npm pendiente de OTP |
| NR-016 | 2026-10-22 | Hacer pública la información del proyecto: página «Acerca de» sin estado interno, botón a GitHub y README orientado a consumidores | Done | `#/acerca`, `README.md`, `packages/cli/README.md` y enlaces a `https://github.com/dev-plague/desk-ui` |

## 9. Definición de “Done” por componente

Un componente solo se considera terminado cuando cumple:

- [x] Fuente tipada en `packages/ui/src/components`.
- [x] Export en `src/index.ts`, `package.json` y registry.
- [x] `forwardRef`, `className`, `data-slot` cuando aplica.
- [x] Estados hover/active/focus/disabled/pressed cuando aplican.
- [x] 24 px de área táctil en móvil.
- [x] Test de comportamiento.
- [x] Entrada en axe (composición o página de docs).
- [x] Página de documentación con preview, código, props y notas.
- [x] Dependencias del registry declaradas.
- [x] Revisión en tema `classic`, `gradient` y `high-contrast`.

## 10. Convenciones

- No cambiar IDs existentes; si un requisito cambia, marcarlo `Superseded` y
  crear un `NR-*`.
- Toda decisión que afecte arquitectura, alcance o experiencia debe tener una
  entrada en `DECISIONS.md` y, si cambia el alcance, un `NR-*` aquí.
- Toda ruta o componente nuevo se refleja en `PROGRESS.md` y `roadmap.md`.
- Los requisitos visuales se validan contra `references/` y `DECISIONS.md`.
