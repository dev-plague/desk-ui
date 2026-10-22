# DECISIONS — Registro de decisiones

> **Por qué el proyecto es como es.** Cada decisión tiene un ID estable,
> contexto, alternativas y consecuencias. Las decisiones aceptadas no se borran:
> si cambian, se marcan `Superseded` y se crea una nueva.
>
> Estado vivo: `PROGRESS.md` · Requisitos: `REQUIREMENTS.md` · Plan: `roadmap.md`.

## Estados

- **Accepted** — vigente.
- **Superseded** — reemplazada por otra decisión; se conserva el histórico.
- **Proposed** — en evaluación; no bloquea el trabajo actual.
- **Rejected** — considerada y descartada.

## Índice

| ID | Decisión | Estado | Fecha |
| --- | --- | --- | --- |
| D-001 | React + TypeScript + Tailwind 4 + Vite | Accepted | 2026-10-21 |
| D-002 | Copy & own con registry y CLI | Accepted | 2026-10-21 |
| D-003 | Lenguaje visual clásico | Accepted | 2026-10-21 |
| D-004 | Concesiones de accesibilidad sobre fidelidad | Accepted | 2026-10-21 |
| D-005 | Window presentacional; TitleBar/StatusBar extraídas | Accepted | 2026-10-21 |
| D-006 | Dialog sobre `<dialog>` nativo | Accepted | 2026-10-21 |
| D-007 | Controles nativos frente a Radix | Accepted | 2026-10-21 |
| D-008 | Registry offline incluido en el CLI | Accepted | 2026-10-21 |
| D-009 | Docs en Vite, español y router por hash | Accepted | 2026-10-21 |
| D-010 | GroupBox con leyenda clásica y muesca simple | Accepted | 2026-10-21 |
| D-011 | Estrategia de tests | Accepted | 2026-10-21 |
| D-012 | Temas por tokens y `data-theme` | Accepted | 2026-10-21 |
| D-013 | Iconos centralizados en `Icon` | Accepted | 2026-10-21 |
| D-014 | Documentación viva de trazabilidad | Accepted | 2026-10-21 |
| D-015 | Sin assets propietarios de terceros | Accepted | 2026-10-21 |
| D-016 | Densidad 95 en escritorio, 24 px en móvil | Accepted | 2026-10-21 |
| D-017 | Publicación npm del CLI diferida | Superseded | 2026-10-21 |
| D-018 | Code-splitting del sitio de docs | Accepted | 2026-10-21 |
| D-019 | ScrollArea con flechas propias | Accepted | 2026-10-21 |
| D-020 | Persistencia de tema local | Accepted | 2026-10-21 |
| D-021 | Buscador de componentes con Ctrl+K | Accepted | 2026-10-21 |
| D-022 | MDX para guías y metadatos por ruta | Accepted | 2026-10-21 |
| D-023 | Playwright para teclado, foco, axe y regresión visual | Accepted | 2026-10-21 |
| D-024 | Desktop con drag opcional y límites del lienzo | Accepted | 2026-10-21 |
| D-025 | StartMenu sobre Radix DropdownMenu | Accepted | 2026-10-21 |
| D-026 | WindowManager con estado interno y ref imperativo | Accepted | 2026-10-21 |
| D-027 | Aplicaciones icónicas como contenido de ventana | Accepted | 2026-10-21 |
| D-028 | Showcases como rutas lazy dentro de docs | Accepted | 2026-10-21 |
| D-029 | Page Builder como herramienta del sitio, no del registry | Accepted | 2026-10-21 |
| D-030 | Documento JSON versionado y árbol de bloques | Accepted | 2026-10-21 |
| D-031 | Persistencia local y JSON como formato de intercambio | Accepted | 2026-10-21 |
| D-032 | DnD nativo con alternativas de teclado | Accepted | 2026-10-21 |
| D-033 | Rebranding del producto a DeskUI | Accepted | 2026-10-22 |
| D-034 | i18n español/inglés en docs y componentes | Accepted | 2026-10-22 |
| D-035 | Skills y documentación para agentes IA | Accepted | 2026-10-22 |
| D-036 | Publicar `deskui` 0.2.0 y mantener `@deskui/ui` privado | Accepted | 2026-10-22 |
| D-037 | Registry servido por el sitio en `/r` | Accepted | 2026-10-22 |
| D-038 | Despliegue estático en el VPC con nginx | Accepted | 2026-10-22 |

---

## D-001 — React 19 + TypeScript estricto + Tailwind 4 + Vite

**Estado:** Accepted · **Contexto:** la librería se distribuye como código fuente
que el consumidor copia y edita.

**Decisión:** React 19, TypeScript 5.9 en modo estricto, Tailwind 4 (`@theme
inline`, `@utility`) y Vite 8 para el laboratorio y la documentación.

**Consecuencias:**

- Componentes con tipos modernos y `forwardRef`.
- Los tokens se integran de forma nativa con Tailwind.
- El consumidor necesita Tailwind 4.
- La documentación es una SPA estática; los metadatos por ruta se actualizan en
  el cliente, pero el SEO completo requiere SSR o prerender.

**Alternativas:** Next.js (diferido), Tailwind 3 con preset (no se implementó),
CSS Modules o vanilla-extract (descartados para mantener el modelo shadcn).

**Enlaces:** `packages/ui/package.json`, `apps/docs/vite.config.ts`.

---

## D-002 — Copy & own con registry y CLI

**Estado:** Accepted · **Contexto:** se quiere control total del código instalado
y una experiencia similar a shadcn/ui.

**Decisión:** cada componente vive como archivo TypeScript en `packages/ui` y se
publica como item de registry. El CLI copia archivos, resuelve dependencias y
respeta el alias del proyecto; no se instala una librería opaca como runtime.

**Consecuencias:**

- El consumidor puede editar cualquier componente.
- El registry debe versionarse y mantenerse sincronizado con el código.
- Las dependencias npm se declaran por item.
- Añadir un componente exige registry, tests y docs.

**Alternativas:** paquete npm monolítico (rechazado); copiar manualmente
(rechazado por ergonomía); usar el registry de shadcn tal cual (no aplica a un
lenguaje visual propio).

**Enlaces:** `packages/cli/`, `packages/ui/scripts/build-registry.mjs`.

---

## D-003 — Lenguaje visual clásico

**Estado:** Accepted · **Contexto:** las referencias mezclan el estilo
plano y el degradado.

**Decisión:** base clásica con barra de título plana, superficie `#C0C0C0`,
teal `#008080`, biseles de 2 px, sin radios y foco punteado. El degradado
azul del tema Gradiente es una variante (`data-theme="gradient"`), no el
valor por defecto.

**Consecuencias:**

- Fidelidad al sistema original en el tema base.
- Los detalles del tema Gradiente quedan disponibles sin contaminar el
  valor por defecto.
- Los tokens permiten temas alternativos sin tocar componentes.

**Alternativas:** degradado por defecto (descartado); copiar CSS de terceros
(rechazado); usar sombras difusas modernas (rechazado).

**Enlaces:** `docs/design-tokens.md`, `docs/reference-analysis.md`,
`packages/ui/src/styles/tokens.css`.

---

## D-004 — Concesiones de accesibilidad sobre fidelidad

**Estado:** Accepted · **Contexto:** la estética de 1995 usa textos pequeños y
grises de bajo contraste.

**Decisión:** conservar la densidad y el bisel, pero con ajustes deliberados:

- Texto secundario `#404040` en lugar de `#808080` sobre gris.
- Barra de título inactiva más oscura para que el texto blanco cumpla AA.
- Controles táctiles de 24 px en móvil.
- Tema de alto contraste.
- Foco punteado visible en todos los temas.
- Los textos deshabilitados siguen siendo la excepción documentada.

**Consecuencias:** la interfaz se ve prácticamente igual, pero es utilizable con
teclado, lectores de pantalla y baja visión. La fidelidad literal a algunos
grises se sacrifica a propósito.

**Alternativas:** replicar el contraste original (rechazado); aumentar todos los
tamaños (rompe la densidad); eliminar el foco punteado (rechazado).

**Enlaces:** `docs/design-tokens.md` §7, `docs/reference-analysis.md` §4.

---

## D-005 — Window presentacional; TitleBar/StatusBar extraídas

**Estado:** Accepted · **Contexto:** el Window Manager con arrastre, resize y
z-index es un componente de Fase 2, pero TitleBar y StatusBar se necesitan ya
fuera de Window.

**Decisión:** `Window` es un contenedor visual presentacional. `TitleBar` y
`StatusBar` viven como componentes independientes; `Window.TitleBar` y
`Window.StatusBar` los envuelven para heredar el estado activo y el layout.
`Taskbar` también es presentacional.

**Consecuencias:**

- El registry de `window` depende de `title-bar` y `status-bar`.
- El Window Manager de Fase 2 podrá componer estas piezas sin duplicarlas.
- Los controles sin handler se renderizan inertes.

**Alternativas:** incluir todo el manager en `Window` (acoplamiento prematuro);
duplicar markup (descartado).

**Enlaces:** `title-bar.tsx`, `status-bar.tsx`, `window.tsx`, `taskbar.tsx`.

---

## D-006 — Dialog sobre `<dialog>` nativo

**Estado:** Accepted · **Contexto:** se necesita un modal accesible sin añadir
otra primitiva de diálogo.

**Decisión:** usar `<dialog>` con `showModal()`, `open`/`onOpenChange`, cierre
con Escape, backdrop nativo, foco atrapado y restauración de foco.
`dismissOnBackdrop` es `false` por defecto, como en la época.

**Consecuencias:**

- Sin dependencia de Radix Dialog.
- El componente es controlado y requiere que el consumidor mantenga `open`.
- No hay animaciones de entrada/salida.
- En navegadores modernos el comportamiento es nativo y consistente.

**Alternativas:** Radix Dialog (rechazado por peso y porque el modal nativo ya
cubre el caso); modal manual (rechazado por foco y Escape).

**Enlaces:** `dialog.tsx`, `dialog.test.tsx`.

---

## D-007 — Controles nativos frente a Radix

**Estado:** Accepted · **Contexto:** no todos los controles necesitan una
primitiva de Radix.

**Decisión:**

- Nativos: Input, Textarea, Checkbox, RadioGroup, Select, ListBox, Slider,
  Switch (botón con `role=switch`).
- Radix: Tabs, Tooltip, MenuBar, DropdownMenu, ContextMenu (accesibilidad de
  teclado, portales y posicionamiento).
- React Hook Form + Zod para Form.

**Consecuencias:**

- Menos dependencias y mejor integración con formularios nativos.
- Radix se reserva para patrones flotantes complejos.
- El consumidor instala dependencias solo al añadir el componente que las usa.

**Alternativas:** Radix para todo (más peso); controles custom para todo (más
superficie de bugs de teclado/ARIA).

**Enlaces:** `packages/ui/package.json`, `packages/ui/scripts/build-registry.mjs`.

---

## D-008 — Registry offline incluido en el CLI

**Estado:** Accepted · **Contexto:** el CLI debía funcionar antes de tener un
registry desplegado y ser reproducible.

**Decisión:** el paquete `deskui` incluye una copia de `registry/` y
`templates/` generadas en build. La resolución de registry sigue esta prioridad:
`--registry` → `DESKUI_REGISTRY` → `components.json` → registry local del
monorepo → registry incluido → URL remota.

**Consecuencias:**

- `add` funciona sin conexión.
- La versión de los componentes queda ligada a la versión del CLI.
- Para actualizar componentes hay que actualizar el CLI o usar `--registry`.

**Alternativas:** depender de un registry remoto desde el día uno (rechazado por
bloqueo); empaquetar los componentes como dependencia npm (rompe copy & own).

**Enlaces:** `packages/cli/src/lib/registry.ts`,
`packages/cli/scripts/sync-templates.mjs`.

---

## D-009 — Docs en Vite, español y router por hash

**Estado:** Accepted · **Contexto:** se necesitaba documentación navegable sin
infraestructura de servidor.

**Decisión:** Vite + React + router por hash, textos en español y contenido
separado en `src/content` para facilitar una migración futura a MDX/Next.
El laboratorio vive en `#/laboratorio`.

**Consecuencias:**

- Build estático simple y despliegue trivial.
- SEO por ruta y metadata requieren trabajo extra.
- La estructura de contenido está desacoplada de las páginas.

**Alternativas:** Next.js (diferido); Storybook (no cubre la shell ni el
showcase); docs puramente Markdown (peor dogfooding).

**Enlaces:** `apps/docs/src/App.tsx`, `apps/docs/src/content/`.

---

## D-010 — GroupBox con leyenda clásica y muesca simple

**Estado:** Accepted · **Contexto:** la primera implementación usaba una pestaña
elevada tipo carpeta; el usuario prefirió una solución más simple y fiel a
la interfaz clásica.

**Decisión:** `fieldset` con `legend` apoyada sobre el borde. El fondo de la
leyenda enmascara la línea superior y crea la muesca. Sin pestaña, sin margen
izquierdo extra y sin `tabClassName`.

**Consecuencias:**

- Aspecto clásico y más legible.
- El API se simplifica.
- `Window.Body` y los formularios pueden anidar el grupo sin ruido visual.

**Alternativas:** pestaña elevada (NR-001, superseded); borde real con
`border-image` (más complejo para el mismo resultado).

**Enlaces:** `group-box.tsx`, `group-box.test.tsx`, `docs/components.md`.

---

## D-011 — Estrategia de tests

**Estado:** Accepted · **Contexto:** validar comportamiento sin frenar la
iteración visual.

**Decisión:** Vitest + Testing Library para UI, axe en jsdom y en navegador,
tests de CLI con fixtures temporales, validación end-to-end empaquetando el CLI
e instalándolo en un consumidor, y Playwright para teclado, foco, axe y
regresión visual.

**Consecuencias:**

- 113 tests de UI, 10 de CLI, 39 del Page Builder y 27 E2E.
- La accesibilidad se revisa en el navegador real además de jsdom.
- El CLI se prueba como artefacto, no solo como fuente.
- Las capturas visuales se regeneran con `pnpm test:e2e:update`.

**Alternativas:** solo unit tests (insuficiente para registry/CLI); solo
Playwright (más lento y menos granular).

**Enlaces:** `packages/ui/src/**/*.test.tsx`,
`packages/cli/src/**/*.test.ts`, `playwright.config.ts`, `e2e/docs.spec.ts`.

---

## D-012 — Temas por tokens y `data-theme`

**Estado:** Accepted · **Contexto:** el cambio de tema no debe recompilar
componentes.

**Decisión:** colores, biseles y tipografía son variables CSS. Los temas se
activan con `data-theme` en un ancestro. La documentación sincroniza el tema en
`?theme=` y lo persiste en `localStorage` (D-020).

**Consecuencias:** cambiar de tema es instantáneo; los componentes no conocen
colores. La URL es compartible/reproducible.

**Alternativas:** clases por tema (más ruido); CSS-in-JS (más runtime).

**Enlaces:** `tokens.css`, `apps/docs/src/lib/theme.ts`.

---

## D-013 — Iconos centralizados en `Icon`

**Estado:** Accepted · **Contexto:** los iconos estaban duplicados en la
documentación y no formaban parte del registry.

**Decisión:** set original de siete iconos pixel-art en `Icon`, con `name`,
`size` 16/32 y `label` opcional. La documentación usa el componente de la
librería mediante envoltorios.

**Consecuencias:** una sola fuente de verdad; el consumidor puede copiar el set
con `add icon`. Los iconos son decorativos por defecto y accesibles con `label`.

**Alternativas:** iconos externos (licencias/estilo); SVG sueltos en docs
(duplicación).

**Enlaces:** `icon.tsx`, `apps/docs/src/components/icons.tsx`.

---

## D-014 — Documentación viva de trazabilidad

**Estado:** Accepted · **Contexto:** el proyecto creció en alcance y hacía falta
contexto persistente entre sesiones y personas.

**Decisión:** mantener tres documentos vivos en `docs/`:

- `PROGRESS.md` — estado, métricas, pendientes y riesgos.
- `REQUIREMENTS.md` — alcance trazable con IDs y requisitos nuevos.
- `DECISIONS.md` — registro ADR de por qué se tomó cada decisión.

`roadmap.md` sigue siendo el plan; `architecture.md` la explicación técnica.
Cada corte actualiza los documentos afectados.

**Consecuencias:** más trabajo de mantenimiento, pero contexto explícito y
auditable. Las decisiones y cambios de alcance no se pierden en el chat.

**Alternativas:** solo README (insuficiente); solo issues externos (sin contexto
local); changelog como único histórico (no explica el porqué).

**Enlaces:** este documento, `PROGRESS.md`, `REQUIREMENTS.md`, `README.md`.

---

## D-015 — Sin assets propietarios de terceros

**Estado:** Accepted · **Contexto:** el proyecto es original, no una copia.

**Decisión:** no redistribuir fuentes, iconos, cursores, sonidos ni capturas
propietarias. Usar W95FA (SIL OFL), iconos SVG originales y avisos de
licencia.

**Consecuencias:** licencia limpia para el código (MIT) y la fuente (OFL). La
estética es reconocible sin depender de assets propietarios de terceros.

**Alternativas:** usar MS Sans Serif o iconos originales (rechazado por
licencia).

**Enlaces:** `README.md` §Licencias, `packages/ui/src/styles/fonts/`.

---

## D-016 — Densidad de escritorio y 24 px en móvil

**Estado:** Accepted · **Contexto:** los controles originales miden 21–23 px y
son difíciles de tocar.

**Decisión:** mantener 21/23/27 px en escritorio y subir los interactivos a
24 px en móvil (botones, inputs, tabs, paginación, árbol, cierre de toast, etc.).

**Consecuencias:** fidelidad en escritorio y usabilidad táctil en móvil. La
consistencia se mantiene porque los tokens y utilidades comparten reglas.

**Alternativas:** 24 px siempre (rompe la densidad); mantener 21 px en móvil
(rechazado por accesibilidad).

**Enlaces:** componentes y `docs/design-tokens.md` §5.

---

## D-017 — Publicación npm del CLI diferida

**Estado:** Superseded por D-036 · **Contexto:** el CLI está empaquetado y probado,
pero el proyecto aún está en desarrollo (Fase 3 cerrada, Fase 4 pendiente).

**Decisión:** no publicar todavía. El tarball local permite validar el flujo. La
publicación y el registry remoto se abordan en Fase 4.

**Consecuencias:** `npx @deskui/cli` no funciona aún desde npm; la documentación lo
advierte. El nombre `deskui` y el scope `@deskui/*` están reservados como
decisión de naming.

**Alternativas:** publicar ya (API y registry aún cambiantes).

---

## D-018 — Code-splitting de la documentación

**Estado:** Accepted · **Contexto:** el bundle de docs superaba los 500 KB
minificados, en parte por RHF/Zod y todas las páginas de componentes.

**Decisión:** cargar el laboratorio, el shell de documentación, el contenido de
los componentes y las guías MDX con `React.lazy`/import dinámico. El explorador
y el buscador consumen un índice ligero (`content/manifest.ts`) y las vistas
previas viven en un chunk aparte.

**Consecuencias:**

- El entry de docs baja a ~253 KB y el chunk de componentes a ~257 KB.
- El catálogo no bloquea la primera carga.
- El manifiesto ligero debe mantenerse sincronizado con `COMPONENT_DOCS`.

**Enlaces:** `apps/docs/src/App.tsx`, `apps/docs/src/pages/docs.tsx`,
`apps/docs/src/content/manifest.ts`.

---

## D-019 — ScrollArea con flechas propias

**Estado:** Accepted · **Contexto:** las scrollbars actuales usan CSS nativo;
Chrome/Firefox no permiten botones de flecha con CSS.

**Decisión:** `ScrollArea` dibuja flechas, pista y thumb propios de 16 px
mientras el viewport conserva el scroll nativo, el foco por teclado y la rueda.
Arrastrar el thumb, pulsar la pista y mantener una flecha replican el
comportamiento clásico.

**Consecuencias:** la geometría y la trama son idénticas en Chrome y Firefox;
el componente asume la medición y sincronización del scroll. Los contenedores
que siguen usando scroll nativo mantienen el estilo de 16 px sin flechas.

**Enlaces:** `scroll-area.tsx`, `docs/PROGRESS.md` §5.

---

## D-020 — Persistencia de tema local

**Estado:** Accepted · **Contexto:** el tema se guardaba solo en la URL.

**Decisión:** prioridad URL → `localStorage` → `prefers-color-scheme`. La URL
sigue ganando para compartir capturas. La preferencia del sistema oscura usa el
tema de alto contraste. La elección explícita se guarda en `localStorage`.

**Consecuencias:**

- El tema sobrevive a recargas y visitas.
- Un enlace con `?theme=` mantiene prioridad.
- Los cambios del sistema se siguen solo mientras no haya elección explícita.

**Enlaces:** `apps/docs/src/lib/theme.ts`.

---

## D-021 — Buscador de componentes con Ctrl+K

**Estado:** Accepted · **Contexto:** el catálogo crecía con 47 componentes y la
navegación dejaba de ser escalable.

**Decisión:** diálogo modal sobre el `Dialog` nativo, abierto con `Ctrl/Cmd+K` o
desde el explorador y el menú Ver. Filtra por título, slug y descripción; usa
`role=combobox`/`listbox`, flechas, Home/End, Enter y Escape.

**Consecuencias:**

- Búsqueda global desde cualquier página, también en móvil.
- Sin dependencia de un command palette externo.
- El buscador consume el manifiesto ligero, no las vistas previas.

**Alternativas:** filtrar el sidebar en línea (menos descubrible); una librería
de command palette (peso innecesario).

**Enlaces:** `apps/docs/src/components/docs/search.tsx`,
`apps/docs/src/components/docs/sidebar.tsx`.

---

## D-022 — MDX para guías y metadatos por ruta

**Estado:** Accepted · **Contexto:** la guía de composición, el changelog y la
contribución necesitaban contenido largo; las páginas de componentes siguen
necesitando previews interactivas tipadas.

**Decisión:** usar `@mdx-js/rollup` para guías (`#/guia`, `#/cambios`,
`#/contribuir`) con componentes de la librería dentro del MDX. Mantener las
páginas de componentes en TSX. Añadir metadatos por ruta (título, descripción,
robots, canonical y Open Graph) desde un helper compartido.

**Consecuencias:**

- Contenido largo editable sin duplicar layout.
- Las guías se cargan en chunks pequeños (3–6 KB).
- Hay dos formatos de contenido: MDX para prosa, TSX para catálogo.

**Alternativas:** migrar todo a MDX (perdería tipado en previews); mantener todo
en TSX (peor edición de prosa).

**Enlaces:** `apps/docs/vite.config.ts`, `apps/docs/src/pages/guide.tsx`,
`apps/docs/src/lib/metadata.ts`.

---

## D-023 — Playwright para teclado, foco, axe y regresión visual

**Estado:** Accepted · **Contexto:** Vitest/jsdom no valida foco nativo, teclado
real ni contraste.

**Decisión:** añadir Playwright con Chromium y `@axe-core/playwright`. Cubrir
buscador, toolbar, diálogo, persistencia de tema, metadatos, escritorio, menú
Inicio, gestor de ventanas, aplicaciones icónicas, showcases, Page Builder, 25
rutas con axe y seis capturas de regresión visual.

**Consecuencias:**

- 27 tests E2E además de los 162 unitarios.
- Las capturas dependen de Chromium y de las fuentes; se regeneran con
  `pnpm test:e2e:update`.
- El foco atrapado del diálogo se implementó también en JS porque Chromium
  devuelve el foco al documento al final del ciclo de Tab.

**Alternativas:** solo axe en jsdom (no cubre contraste ni foco real); solo
capturas manuales (no previenen regresiones).

**Enlaces:** `playwright.config.ts`, `e2e/docs.spec.ts`.

---

## D-024 — Desktop con drag opcional y límites del lienzo

**Estado:** Accepted · **Contexto:** el escritorio necesitaba iconos
seleccionables y arrastrables sin imponer un layout rígido.

**Decisión:** `Desktop` es una región con `DesktopIcons` para la columna
estática y `DesktopIcon` con `draggable`/`defaultPosition` para posiciones
absolutas. El arrastre se limita al rectángulo del Desktop, usa un umbral de
4 px para no abrir por accidente y ofrece `Ctrl+flechas` como alternativa de
teclado.

**Consecuencias:**

- Los iconos pueden ser estáticos o libres en el mismo lienzo.
- La selección y la apertura son controladas por el consumidor.
- El drag usa Pointer Events y `touch-action: none`; el teclado no depende del
  puntero.

**Alternativas:** solo iconos en grid (menos fiel); drag libre sin límites
(rompe la usabilidad en pantallas pequeñas).

**Enlaces:** `desktop.tsx`, `desktop.test.tsx`.

---

## D-025 — StartMenu sobre Radix DropdownMenu

**Estado:** Accepted · **Contexto:** el menú Inicio necesita submenús en cascada,
teclado y cierre al hacer clic fuera.

**Decisión:** componer `StartMenu` sobre Radix DropdownMenu, con `StartMenuContent`
posicionado arriba del trigger, `StartMenuSidebar` decorativa y submenús
`StartMenuSub`/`SubTrigger`/`SubContent`. El shell de documentación usa el
componente real en lugar de un menú artesanal.

**Consecuencias:**

- Role menu, flechas, typeahead, Escape y submenús resueltos por Radix.
- El trigger puede ser el botón Inicio de `Taskbar` mediante `asChild`.
- La barra lateral no se anuncia a lectores de pantalla.

**Alternativas:** menú propio (más superficie de bugs); reutilizar `MenuBar`
(patrón y posición distintos).

**Enlaces:** `start-menu.tsx`, `apps/docs/src/components/taskbar.tsx`.

---

## D-026 — WindowManager con estado interno y ref imperativo

**Estado:** Accepted · **Contexto:** hacía falta arrastrar, redimensionar,
enfocar y minimizar ventanas, y a la vez reflejar ese estado en una taskbar.

**Decisión:** el `WindowManager` mantiene posición, tamaño, foco y estados por
ventana. Expone `onStateChange` con un snapshot estable y un ref imperativo
(`focus`, `minimize`, `restore`, `close`, `open`, `toggleMaximize`). El foco se
deriva de un orden de apilado; el z-index sale de ese orden. El arrastre y el
resize usan Pointer Events; la barra de título acepta flechas y `Shift+flechas`
para mover y redimensionar.

**Consecuencias:**

- La taskbar se compone fuera sin acoplarse al DOM de las ventanas.
- Las ventanas minimizadas usan `hidden` y salen del árbol accesible.
- Las posiciones no persisten entre recargas; es una decisión para el Page
  Builder o una API de persistencia futura.

**Alternativas:** estado controlado por el consumidor (más boilerplate);
librería externa de ventanas (peso y dependencia innecesaria).

**Enlaces:** `window-manager.tsx`, `window-manager.test.tsx`.

---

## D-027 — Aplicaciones icónicas como contenido de ventana

**Estado:** Accepted · **Contexto:** la Fase 2 pedía File Explorer, Wizard,
Properties Dialog, Notepad, Terminal, BSOD, Screensaver y Minesweeper sin
duplicar el marco de ventana.

**Decisión:** implementarlos como **contenido** que se coloca dentro de `Window`
o `WindowManager`, no como ventanas completas. Las APIs son controladas o no
controladas y los componentes deterministas exponen props para pruebas:
`Minesweeper` acepta `layout`/`seed`; `Terminal` acepta comandos; `FileExplorer`
recibe un árbol de datos.

**Consecuencias:**

- Se reutilizan TitleBar, Body y StatusBar sin anidar ventanas.
- Los tests son deterministas sin depender de `Math.random`.
- El consumidor decide el tamaño, el icono y el estado de cada aplicación.

**Alternativas:** componentes con marco propio (duplicación); juegos no
deterministas (tests frágiles).

**Enlaces:** `file-explorer.tsx`, `wizard.tsx`, `properties-dialog.tsx`,
`notepad.tsx`, `terminal.tsx`, `blue-screen.tsx`, `screensaver.tsx`,
`minesweeper.tsx`.

---

## D-028 — Showcases como rutas lazy dentro de docs

**Estado:** Accepted · **Contexto:** la Fase 2 cierra con dos aplicaciones
completas construidas solo con la librería.

**Decisión:** publicar Tienda retro y Red social como páginas del sitio en
`#/showcase/tienda` y `#/showcase/red-social`, cargadas con `React.lazy` para no
engordar el entry. Usan datos mock y componentes reales; no añaden items al
registry.

**Consecuencias:**

- El catálogo demuestra composición real sin dependencias nuevas.
- Los showcases se validan con axe y E2E (carrito, checkout, publicar y
  comentar).
- Siguen siendo contenido del sitio: no forman parte del paquete copiable.

**Alternativas:** ejemplos externos (no se validan); componentes de showcase en
el registry (ruido para el consumidor).

**Enlaces:** `apps/docs/src/content/showcases/store.tsx`,
`apps/docs/src/content/showcases/social.tsx`,
`apps/docs/src/pages/showcase.tsx`.

---

## D-029 — Page Builder como herramienta del sitio, no del registry

**Estado:** Accepted · **Contexto:** la Fase 3 pedía un editor visual, pero la
librería se distribuye como componentes copiables y el editor no es un
componente de producto.

**Decisión:** el Page Builder vive en `apps/docs` como ruta lazy `#/constructor`.
El modelo puro está en `apps/docs/src/lib/builder`, la UI en
`apps/docs/src/components/builder` y la orquestación en
`apps/docs/src/pages/builder.tsx`. No se añade al registry ni a `packages/ui`.

**Consecuencias:**

- El editor consume la librería como cualquier consumidor y sirve de dogfooding.
- El modelo no depende del DOM ni de React; se puede extraer a un paquete futuro.
- El sitio de docs oculta el sidebar en esta ruta para dar espacio al lienzo.
- No hay un item `page-builder` en el CLI.

**Alternativas:** paquete independiente desde el día uno (coste de publicación y
versionado prematuro); un componente más del registry (mezcla herramienta y
catálogo); builder fuera del sitio (pierde el dogfooding y la validación axe).

**Enlaces:** `apps/docs/src/pages/builder.tsx`, `apps/docs/src/lib/builder/`,
`apps/docs/src/components/builder/`, `docs/page-builder.md`.

---

## D-030 — Documento JSON versionado y árbol de bloques

**Estado:** Accepted · **Contexto:** había que guardar, compartir y exportar
páginas sin acoplarse al DOM de la documentación.

**Decisión:** el documento es `{ version: 1, title, theme, background, blocks }`.
Cada bloque es `{ id, type, props, children? }`. El catálogo declara defaults,
campos, contenedores y resumen. El parseo normaliza, sanea props, limita tamaño y
profundidad y regenera ids duplicados. El JSX se genera desde el mismo árbol.

**Consecuencias:**

- Guardar, importar y exportar comparten un único formato legible.
- Un cambio de esquema exige subir `version` y añadir migración.
- Renderer y exportador son dos implementaciones; el catálogo y los tests de
  exportación reducen la deriva.
- Los JSON maliciosos no pueden inyectar props arbitrarias ni árboles enormes.

**Alternativas:** guardar HTML (pierde estructura y componentes); serializar JSX
(no es editable ni validable); un schema externo tipo Zod (más dependencia para
un formato interno pequeño).

**Enlaces:** `apps/docs/src/lib/builder/types.ts`, `model.ts`, `catalog.ts`,
`export.ts`.

---

## D-031 — Persistencia local y JSON como formato de intercambio

**Estado:** Accepted · **Contexto:** el MVP necesitaba guardar el trabajo y
compartirlo sin backend.

**Decisión:** autoguardado con debounce en
`localStorage["deskui-builder-document-v1"]`, con lectura tolerante a errores.
Compartir consiste en exportar el JSON e importarlo en otro navegador. El tema y
el fondo forman parte del documento.

**Consecuencias:**

- El trabajo sobrevive a recargas y cierres del navegador.
- El almacenamiento bloqueado o lleno se muestra como error, sin romper el
  editor.
- No hay enlaces compartibles ni colaboración; el JSON es la unidad de
  intercambio.
- Un backend futuro puede sustituir `storage.ts` sin cambiar el modelo.

**Alternativas:** solo memoria (pierde el trabajo); URL con el documento
codificado (crece rápido y expone el contenido); backend desde el MVP (fuera de
alcance).

**Enlaces:** `apps/docs/src/lib/builder/storage.ts`, `dialogs.tsx`.

---

## D-032 — DnD nativo con alternativas de teclado

**Estado:** Accepted · **Contexto:** reordenar bloques debía ser directo con
ratón, pero también accesible sin puntero.

**Decisión:** usar HTML5 Drag & Drop nativo con un MIME propio
(`application/x-deskui-builder`) para paleta → lienzo y para reordenar en Capas.
La posición se decide por la posición vertical sobre la fila: antes, después o
dentro de un contenedor. Como alternativa, Subir/Bajar y `Alt + ↑/↓` mueven
bloques entre hermanos; las flechas recorren el árbol de capas.

**Consecuencias:**

- Sin dependencia externa de DnD.
- El teclado no depende de eventos de puntero.
- El DnD nativo de Chromium sin interfaz no siempre emite `drop` en Playwright;
  el E2E despacha `DragEvent` con `DataTransfer` para probar los handlers.
- Reordenar entre padres distintos se hace desde Capas; el lienzo añade al final.

**Alternativas:** librería de DnD (peso y superficie); solo botones (menos
directo); solo arrastre (inaccesible).

**Enlaces:** `apps/docs/src/components/builder/layers.tsx`, `palette.tsx`,
`canvas.tsx`, `apps/docs/src/lib/builder/types.ts`.

---

## D-033 — Rebranding del producto a DeskUI

**Estado:** Accepted · **Contexto:** el nombre anterior usaba una marca de
terceros. El proyecto necesitaba una identidad propia antes de publicar el CLI.

**Decisión:** el producto pasa a llamarse **DeskUI**. Se renombran todos los
textos visibles, el CLI (`deskui`), los paquetes (`@deskui/*`), el template
`deskui.css`, las claves de `localStorage`, el MIME del builder y el tema base
(`classic`). El segundo tema pasa a `gradient`/«Gradiente». Se conservan los
prefijos internos `w95-*` y el nombre real de la fuente W95FA por su licencia.

**Consecuencias:**

- Los enlaces antiguos con los identificadores de tema previos dejan de
  resolverse; el proyecto aún no estaba publicado, así que no hay migración.
- La documentación, los ejemplos y los valores exportados usan nombres neutros.
- El aviso legal deja de mencionar marcas de terceros y pasa a describir un
  proyecto original e independiente.

**Alternativas:** mantener el nombre como homenaje (riesgo legal y de marca);
renombrar también todos los identificadores CSS (coste alto, sin beneficio
visible para el usuario).

**Enlaces:** `README.md`, `packages/cli/src/index.ts`,
`apps/docs/src/lib/theme.ts`, `docs/PROGRESS.md`.

---

## D-034 — i18n español/inglés en docs y componentes

**Estado:** Accepted · **Contexto:** la Fase 3 está cerrada y el proyecto encara
la publicación. La documentación y los textos internos de los componentes solo
existían en español, lo que limitaba la audiencia del sitio y de la librería.

**Decisión:** añadir i18n en dos capas independientes:

1. **Sitio**: diccionarios tipados `es`/`en` en `apps/docs/src/i18n/`. `en` se
   declara contra `typeof es` para que TypeScript garantice paridad de claves.
   `provider.tsx` resuelve el idioma por `?lang=en` o `localStorage` (español por
   defecto), actualiza `<html lang>`, la URL y los metadatos, y expone `t()` y
   `messages`. Las fichas de componentes usan un overlay inglés separado y las
   guías tienen archivos `*.en.mdx`.
2. **Librería**: `DeskUILocaleProvider`/`useDeskUILocale` en
   `packages/ui/src/lib/i18n.tsx`, con diccionarios completos y sobrescrituras
   parciales. Los componentes mantienen props explícitas y usan el diccionario
   como valor por defecto. El registry añade `i18n` como dependencia cuando el
   código copiado lo importa.

**Consecuencias:**

- El español sigue siendo el idioma por defecto: no hay migración ni cambios
  para consumidores existentes.
- El selector ES/EN vive en la barra de tareas; no hay recarga ni rutas
  duplicadas. `?lang=en` permite compartir enlaces en inglés.
- Los textos de demo del Page Builder y de las plantillas son contenido de
  ejemplo; la estructura, el chrome y las etiquetas de bloque sí se traducen.
- El registry pasa de 48 a 49 items.

**Alternativas:** solo documentación bilingüe (deja los componentes en
español); solo componentes (el sitio seguiría monolingüe); duplicar el sitio en
dos builds (coste de mantenimiento y SEO); `react-i18next` (dependencia extra
para un catálogo pequeño y estático).

**Enlaces:** `apps/docs/src/i18n/`, `packages/ui/src/lib/i18n.tsx`,
`apps/docs/src/content/components.tsx`, `packages/ui/scripts/build-registry.mjs`.

---

## D-035 — Skills y documentación para agentes IA

**Estado:** Accepted · **Contexto:** el proyecto ya tenía documentación humana
bilingüe, pero un agente que llegaba al repositorio o a un proyecto consumidor
no disponía de una guía operativa única: tenía que reconstruir la API, las
reglas de composición y el flujo de instalación a partir de varios documentos.

**Decisión:** publicar material de uso para agentes en dos niveles:

1. **Repositorio**: `AGENTS.md`, skills canónicas en `skills/` y referencias de
   componentes, composición, patrones, i18n, CLI, checklist, tokens y Page
   Builder. `.opencode/skills/` y `.agents/skills/` son copias generadas por
   `pnpm skills:sync`; `pnpm skills:check` detecta desincronización.
2. **Consumidor**: `deskui init` copia las skills a `.agents/skills/` y
   `.opencode/skills/` y añade una sección gestionada a `AGENTS.md` entre
   marcadores. `--no-agents` permite omitirlo.
3. **Web**: `llms.txt` y `llms-full.txt` generados desde `skills/` con
   `pnpm llms:build`.

Las skills son deliberadamente instructivas: dicen cuándo usarlas, qué reglas
no romper, qué referencias leer y cómo verificar. La skill principal enlaza a
las referencias en lugar de duplicar toda la API.

**Consecuencias:**

- Un agente nuevo puede empezar por `AGENTS.md` o por `skills/deskui/SKILL.md`
  sin leer todo el repositorio.
- El CLI añade archivos de orientación al proyecto consumidor; son texto plano
  y se pueden editar o eliminar.
- Las copias generadas no se editan a mano; la fuente es `skills/`.
- El material no sustituye a los tests: las skills incluyen el checklist de
  verificación.

**Alternativas:** solo `llms.txt` (pierde el routing y las reglas de
composición); solo documentación web (no llega al proyecto consumidor);
duplicar la API en cada skill (mantenimiento alto); depender de una herramienta
de agentes concreta (limita portabilidad).

**Enlaces:** `AGENTS.md`, `skills/`, `docs/ai.md`, `scripts/sync-skills.mjs`,
`scripts/build-llms.mjs`, `packages/cli/src/commands/init.ts`.

---

---

## D-036 — Publicar `deskui` 0.2.0 y mantener `@deskui/ui` privado

**Estado:** Accepted · **Contexto:** la Fase 3 está cerrada, el CLI está
empaquetado y probado, y la Fase 4 exige una versión publicable. `@deskui/ui` es
un paquete de workspace que exporta `.tsx` sin compilar y el sitio lo consume en
local.

**Decisión:** publicar solo el CLI `deskui` en npm, con el registry incluido y
versionado junto al paquete. `@deskui/ui` sigue privado. La versión 0.2.0 agrupa
las Fases 1–3, i18n, skills y la preparación de publicación. El corte se valida
con `pnpm release:verify` (typecheck, tests, build de release y
`release:check`), `pnpm licenses:check` y la instalación del tarball en un
proyecto limpio.

**Consecuencias:**

- Hay una sola fuente de verdad para el consumidor: CLI + registry.
- No se mantiene un segundo artefacto npm con componentes y tipos compilados.
- Publicar una versión exige credenciales de npm y un despliegue previo del
  registry.
- El `prepack` copia templates, registry y licencia; el tarball es
  autocontenido.
- `release:check` impide publicar versiones desalineadas o registry incompletos.

**Alternativas:** publicar también `@deskui/ui` (dos fuentes de verdad y build
de tipos); un paquete con los componentes compilados (rompe copy & own); seguir
solo con tarball local (no se puede usar `npx`).

**Enlaces:** `docs/releasing.md`, `packages/cli/package.json`,
`scripts/check-release.mjs`, `scripts/check-licenses.mjs`.

---

## D-037 — Registry servido por el sitio en `/r`

**Estado:** Accepted · **Contexto:** el CLI apuntaba a `https://deskui.dev/r`,
un dominio que no existe. El sitio ya es estático y el registry son archivos
JSON pequeños.

**Decisión:** servir el registry desde el mismo despliegue del sitio, en
`https://deskui.codehive.com.co/r`. `pnpm registry:site` copia
`packages/ui/dist/registry` a `apps/docs/public/r` antes del build de Vite. La
URL por defecto del CLI pasa a ese dominio.

**Consecuencias:**

- Un solo artefacto y un solo despliegue para sitio y registry.
- El registry remoto se cachea 5 minutos; los assets con hash, un año.
- El sitio y el registry se despliegan y revierten juntos.
- Si el dominio cambia, hay que actualizar `DEFAULT_REGISTRY`, el README del CLI
  y la documentación.
- `release:check` verifica que UI, CLI y sitio tienen el mismo número de items.

**Alternativas:** host separado para el registry (más infraestructura); GitHub
Raw o jsDelivr (latencia y control de caché ajenos); no publicar registry remoto
(el CLI siempre usaría su copia y no habría forma de fijar otra versión).

**Enlaces:** `scripts/build-registry-site.mjs`, `packages/cli/src/lib/registry.ts`,
`docs/deployment.md`.

---

## D-038 — Despliegue estático en el VPC con nginx

**Estado:** Accepted · **Contexto:** el sitio se desplegará en un VPC propio con
el dominio `deskui.codehive.com.co`. La aplicación es una SPA con router por
hash y no necesita backend.

**Decisión:** desplegar `apps/docs/dist` como sitio estático servido por nginx,
con releases versionadas en `/srv/deskui/releases` y un symlink `current`.
HTTPS con Let's Encrypt o el gestor del VPC. `index.html` sin caché, assets con
hash inmutables y `/r` con caché corta. Sin SSR ni prerender.

**Consecuencias:**

- El despliegue es atómico y el rollback es cambiar el symlink.
- No hay runtime de aplicación que mantener.
- Los metadatos por ruta se aplican en cliente; la indexación completa por ruta
  requeriría prerender o SSR.
- Los smoke tests deben cubrir sitio, registry y CLI.

**Alternativas:** Vercel, Netlify o Cloudflare Pages (fuera del VPC elegido); SSR
con Next.js (fuera de alcance y mayor coste operativo).

**Enlaces:** `docs/deployment.md`, `apps/docs/vite.config.ts`,
`apps/docs/src/lib/router.ts`.

---

## Cómo añadir una decisión

1. Usar el siguiente ID libre (`D-0xx`).
2. Añadir una fila al índice con estado y fecha.
3. Crear una sección con: contexto, decisión, consecuencias, alternativas y
   enlaces.
4. Si reemplaza una decisión anterior, marcarla `Superseded` y enlazar la nueva.
5. Si cambia el alcance, añadir el requisito correspondiente en
   `REQUIREMENTS.md`.
6. Reflejar el efecto en `PROGRESS.md` si altera el estado del proyecto.
