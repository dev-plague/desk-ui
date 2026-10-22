# PROGRESS — Estado del proyecto

> **Fuente de verdad del estado actual.** El roadmap describe la secuencia; este
> documento describe dónde estamos hoy. Requisitos en `REQUIREMENTS.md` y
> decisiones en `DECISIONS.md`.
>
> Última actualización: **2026-10-22** · Próxima revisión: al cerrar el siguiente
> corte del Page Builder o al publicar `@deskui/ui`.

## 1. Resumen ejecutivo

| Indicador | Estado |
| --- | --- |
| Fase | **Fase 4 casi completada** — sitio desplegado, npm pendiente de 2FA |
| Último corte | Publicación 0.2.0 |
| Componentes | **47** |
| Items del registry | **49** (47 componentes + `utils` + `i18n`) |
| Tests | **171** (118 UI + 12 CLI + 41 docs) + **28** E2E |
| Páginas de componentes | **47** en español e inglés + 4 guías MDX bilingües + 2 showcases + constructor |
| Temas | **6** (clásico, 98, alto contraste, desert, rose, storm) |
| Page Builder | **20 bloques**, 6 plantillas, exportación JSX/JSON y guardado local |
| CLI | `init`, `add`, `list`; **0.2.0 empaquetado**, publicación npm pendiente de OTP |
| Accesibilidad | axe sin violaciones en 27 rutas, alto contraste y constructor con plantilla |
| Build | registry + CLI + docs correctos; registry estático en `dist/r` |
| Documentación | <https://deskui.codehive.com.co>; buscador, MDX, migración e i18n es/en |
| IA y agentes | 4 skills, `AGENTS.md`, `llms.txt`/`llms-full.txt` y copia desde `deskui init` |

**Estado general:** el sitio y el registry están desplegados en
`deskui.codehive.com.co`, y el README y la página «Acerca de» ya presentan el
proyecto para consumidores. El CLI `deskui@0.2.0` está empaquetado y listo; solo
falta completar `npm publish`, que exige un OTP o un token con 2FA bypass. La
siguiente prioridad es el post-MVP del Page Builder y, si se decide, la
publicación de `@deskui/ui`.

## 2. Estado por fase

### Fase 0 — Validación (completada)

- Monorepo pnpm, tokens, temas y laboratorio visual.
- `Button`, `Window`, `Input`.
- Tests y axe.
- Registry y CLI definidos.
- Referencias analizadas y dirección visual validada.

### Fase 1 — Catálogo base (completada)

- [x] CLI `init`, `add`, `list`, registry offline y resolución de dependencias.
- [x] Formularios, contenedores, navegación, feedback, datos y utilidades.
- [x] Sitio de documentación con shell, laboratorio, theming y una página por
  componente.
- [x] Buscador (`Ctrl+K`), MDX, metadatos por ruta y code-splitting.
- [x] Playwright, axe y regresión visual.
- [x] Persistencia de tema y guía de composición.
- [x] 80 tests unitarios y 13 E2E en el cierre de la Fase 1.

### Fase 2 — Componentes icónicos + Showcase (completada)

Primer corte:

- [x] **Desktop**: iconos seleccionables, apertura por doble clic/Enter y
  arrastre opcional con límites.
- [x] **StartMenu**: panel con barra lateral, atajos y submenús en cascada sobre
  Radix DropdownMenu. El shell de docs ya lo usa.
- [x] **WindowManager**: arrastre, ocho handles de resize, foco, z-index,
  minimizar, maximizar/restaurar y cerrar.
- [x] Integración con `Taskbar` mediante `onStateChange` + ref imperativo.
- [x] Navegación por teclado en la barra de título (mover y redimensionar).

Segundo corte:

- [x] `FileExplorer` con árbol, historial, selección y vistas de iconos, lista y
  detalles.
- [x] `Wizard` con pasos, validación opcional, Atrás/Siguiente y Finalizar.
- [x] `PropertiesDialog` con pestañas y acciones Aplicar/Cancelar/Aceptar.
- [x] `Notepad` con menú, ajuste de línea, atajos y estado.
- [x] `Terminal` MS-DOS con comandos internos y personalizados.
- [x] `BlueScreen`, `Screensaver` y `Minesweeper` jugable.
- [x] Showcase de tienda retro con filtros, carrito y checkout por pasos.
- [x] Showcase de red social con feed, perfil, comentarios y notificaciones.
- [x] Tests unitarios, axe en las rutas del corte y E2E de las nuevas aplicaciones.

### Fase 3 — Page Builder (MVP completado)

- [x] Modelo JSON versionado (`version: 1`) con árbol de bloques, saneado de
  props, límites y regeneración de ids.
- [x] Paleta de 20 bloques en cinco categorías; cinco contenedores.
- [x] Lienzo con selección, contenedores anidados y preview móvil (390 px),
  tablet (768 px) y escritorio (100 %).
- [x] Panel de propiedades del bloque y de la página; fondo y tema.
- [x] Árbol de capas accesible con `role=tree`, expansión, selección, teclado y
  DnD para insertar antes/después/dentro.
- [x] Añadir, seleccionar, mover, reordenar, duplicar y eliminar.
- [x] Seis plantillas: lienzo vacío, escritorio, formulario, tienda, red social y
  página personal.
- [x] Selector de tema en vivo; el tema forma parte del documento exportado.
- [x] Exportación JSX con imports por archivo, JSON y comandos `npx deskui add`.
- [x] Autoguardado en `localStorage`, importación/exportación de JSON y
  confirmación de página nueva.
- [x] Atajos básicos: duplicar, eliminar, mover, guardar y Escape.
- [x] 39 tests unitarios del builder, 6 E2E nuevos, axe con plantilla y captura
  de regresión visual.

Pendiente del post-MVP: undo/redo, multiselección, backend, enlaces compartibles,
exportación a Next/Astro/HTML y plugins.

### Fase 4 — Publicación (completada)

- [x] Versión **0.2.0** alineada en raíz, UI, CLI y docs.
- [x] Metadatos npm del CLI: `publishConfig`, `homepage`, `keywords`, `files` y
  licencia dentro del paquete.
- [x] Scripts `release:build`, `release:pack`, `release:bundle`,
  `release:verify`, `release:check` y `licenses:check`.
- [x] Registry estático en `apps/docs/public/r`; el build genera `dist/r` y el
  CLI apunta por defecto a `https://deskui.codehive.com.co/r`.
- [x] Comprobación de release: versiones, changelog, registry (UI, CLI y sitio)
  y tarball.
- [x] Auditoría de licencias de runtime y del sitio, con lista de licencias
  permitidas.
- [x] Guía de migración 0.1.0 → 0.2.0 en `#/migracion`, `docs/migration.md` y
  `docs/releasing.md`.
- [x] Guía de despliegue para el VPC con nginx, releases atómicas, caché, TLS y
  smoke tests.
- [x] Imagen Docker para Dokploy (`Dockerfile`, `.dockerignore` y
  `deploy/nginx.conf`) con sitio y registry en el mismo contenedor.
- [x] Desplegar el sitio y el registry en `deskui.codehive.com.co`.
- [x] README público y página «Acerca de» con enlaces a GitHub y npm.
- [ ] Publicar `deskui@0.2.0` en npm y verificar `npx deskui`.
- [ ] Decidir si `@deskui/ui` se publica o se mantiene privado.

### IA y agentes (completado)

- [x] Skills canónicas en `skills/`: `deskui`, `deskui-composition`,
  `deskui-page-builder` y `deskui-i18n`.
- [x] Referencias de API, composición, patrones, i18n, CLI, checklist, tokens y
  Page Builder.
- [x] `AGENTS.md` en la raíz con mapa, comandos, convenciones y routing.
- [x] `llms.txt` y `llms-full.txt` generados desde `skills/`.
- [x] `deskui init` copia las skills a `.agents/skills/` y `.opencode/skills/`
  y añade una sección a `AGENTS.md`; `--no-agents` lo omite.
- [x] Sincronización con `pnpm skills:sync` y comprobación con
  `pnpm skills:check`.

### i18n español/inglés (completado)

- [x] Diccionarios tipados del sitio (`apps/docs/src/i18n/`), `t()` con
  interpolación y paridad estricta de claves entre `es` y `en`.
- [x] Selector ES/EN en la barra de tareas, `?lang=en`, persistencia en
  `localStorage` y actualización de `<html lang>` y metadatos.
- [x] Shell, navegación, buscador, páginas, laboratorio, Page Builder,
  showcases y guías MDX en ambos idiomas.
- [x] Fichas de los 47 componentes con descripción, props, notas y código de
  ejemplo traducidos; test que verifica la estructura del overlay.
- [x] `DeskUILocaleProvider` y `useDeskUILocale` en `@deskui/ui` con
  diccionarios es/en y sobrescrituras parciales.
- [x] Registry con el item `i18n` como dependencia de los componentes que usan
  textos internos.

## 3. Inventario de componentes

Todos están documentados, incluidos en el registry y cubiertos por tests salvo
que se indique lo contrario.

### Acciones

| Componente | Estado | Notas |
| --- | --- | --- |
| Button | Estable | default, primary, icon, toggle, `asChild` |

### Formularios

| Componente | Estado | Notas |
| --- | --- | --- |
| Input | Estable | nativo, read-only, disabled |
| Label | Estable | htmlFor/id |
| Checkbox | Estable | input nativo + caja pixelada |
| RadioGroup | Estable | radios nativos + teclado |
| Select | Estable | select nativo + flecha elevada |
| Switch | Estable | `role=switch` |
| Slider | Estable | range nativo con pista hundida |
| Textarea | Estable | redimensionado vertical |
| Form | Estable | RHF + Zod, FormControl con Slot |

### Contenedores

| Componente | Estado | Notas |
| --- | --- | --- |
| Window | Estable | TitleBar/Body/StatusBar |
| GroupBox | Estable | leyenda clásica con muesca |
| Tabs | Estable | Radix Tabs, pestaña activa fusionada |
| ScrollArea | Estable | barra clásica con flechas, pista tramada y thumb |
| Dialog | Estable | `<dialog>` nativo, foco atrapado y Escape |
| Panel | Estable | raised, sunken, window, flat; cabecera/cuerpo/pie |
| Card | Estable | article + título, descripción, contenido y pie |
| Separator | Estable | horizontal/vertical, decorativo opcional |
| Toolbar | Estable | grupos, separadores y navegación por flechas |

### Navegación

| Componente | Estado | Notas |
| --- | --- | --- |
| MenuBar | Estable | Radix Menubar |
| DropdownMenu | Estable | Radix DropdownMenu |
| ContextMenu | Estable | Radix ContextMenu |
| Breadcrumb | Estable | página actual con aria-current |
| TreeView | Estable | apertura, selección y flechas |
| Pagination | Estable | anterior/siguiente, páginas y elipsis |

### Feedback

| Componente | Estado | Notas |
| --- | --- | --- |
| Alert | Estable | franja semántica |
| Toast | Estable | provider, viewport, auto-cierre |
| ProgressBar | Estable | bloques azules segmentados |
| Tooltip | Estable | Radix Tooltip, fondo amarillo |
| Badge | Estable | punto de estado + texto de alto contraste |

### Datos

| Componente | Estado | Notas |
| --- | --- | --- |
| Table | Estable | cabecera elevada, filas seleccionables |
| ListBox | Estable | select nativo `size` simple/múltiple |
| StatusBar | Estable | compartida con Window.StatusBar |

### Utilidades

| Componente | Estado | Notas |
| --- | --- | --- |
| Icon | Estable | set original 16/32 px |
| TitleBar | Estable | extraída de Window |
| Taskbar | Estable | primitives de barra de tareas |

### Escritorio

| Componente | Estado | Notas |
| --- | --- | --- |
| Desktop | Estable | iconos, selección, apertura y drag opcional |
| StartMenu | Estable | Radix DropdownMenu, submenús y barra lateral |
| WindowManager | Estable | drag, resize, foco, z-index y estados |

### Aplicaciones icónicas

| Componente | Estado | Notas |
| --- | --- | --- |
| FileExplorer | Estable | árbol, historial y vistas iconos/lista/detalles |
| Wizard | Estable | pasos, validación y Atrás/Siguiente/Finalizar |
| PropertiesDialog | Estable | pestañas y acciones Aplicar/Cancelar/Aceptar |
| Notepad | Estable | menú, ajuste de línea y atajos |
| Terminal | Estable | comandos internos y personalizados |
| BlueScreen | Estable | error clásico con código y reinicio |
| Screensaver | Estable | estrellas animadas y dismissed accesible |
| Minesweeper | Estable | juego completo y tablero determinista |

### Showcase

| Ruta | Estado | Notas |
| --- | --- | --- |
| Tienda retro | Estable | catálogo, filtros, carrito y checkout con Wizard |
| Red social retro | Estable | feed, perfil, comentarios y notificaciones |

### Page Builder

| Ruta | Estado | Notas |
| --- | --- | --- |
| `#/constructor` | Estable | paleta, lienzo, propiedades, capas, plantillas, tema, preview responsive, exportación JSX/JSON y guardado local |

El builder no forma parte del registry: es una herramienta del sitio que consume
la librería. Ver `docs/page-builder.md` para el modelo, la validación y la
exportación.

## 4. Calidad y validación

Comandos de cierre:

```bash
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm release:verify
pnpm licenses:check
```

| Gate | Resultado |
| --- | --- |
| TypeScript estricto | OK |
| Tests UI | 113/113 |
| Tests CLI | 12/12 |
| Tests del Page Builder | 39/39 |
| Tests E2E | 28/28 (22 funcionales + 6 visuales) |
| axe (navegador) | 0 violaciones en 27 rutas, alto contraste y constructor con plantilla |
| Build de docs | OK; sin advertencia de chunk >500 KB |
| Chunks de docs | entry ~253 KB; componentes ~253 KB; builder ~65 KB; guías 3–6 KB |
| Registry | 49 items generados; copia en CLI y en `dist/r` |
| CLI empaquetado | 0.2.0; `file-explorer`, `wizard`, `properties-dialog`, `notepad`, `terminal`, `blue-screen`, `screensaver` y `minesweeper` resueltos |
| Release | `release:check` en verde: versiones, changelog y registry alineados |
| npm | `deskui@0.2.0` empaquetado; publicado pendiente de OTP |
| Sitio | `https://deskui.codehive.com.co` y `/r/registry.json` en producción |
| Licencias | `licenses:check` en verde; MIT, Apache-2.0 y OFL revisadas |
| Consumidor Vite | Build correcto con componentes copiados |

Rutas y temas comprobados con axe: Inicio, catálogo, los 47 componentes, Tienda
retro, Red social retro, Constructor, Temas, Guía de composición, Changelog,
Migración, Contribuir, Acerca de y alto contraste en Toolbar. Además se comprueba
el constructor con la plantilla Escritorio y la pestaña Capas. La regresión visual
cubre Inicio, catálogo, Card en móvil, Laboratorio, el tema de alto contraste y
el constructor.

## 5. Riesgos y deuda técnica

| Riesgo | Impacto | Mitigación / siguiente paso |
| --- | --- | --- |
| Publicación npm bloqueada por 2FA | `npx deskui` aún no resuelve desde npm | Publicar el tarball con un OTP o un token granular con bypass 2FA |
| Sitio y registry comparten despliegue | Una release rota afecta a ambos | Releases atómicas, smoke tests y rollback documentados |
| URL del registry codificada en el CLI | Cambiar de dominio exige nueva versión | `DEFAULT_REGISTRY` es una constante; `--registry` y `DESKUI_REGISTRY` permiten override |
| `@deskui/ui` sigue privado | No hay instalación npm de la librería completa | Decisión D-036: el artefacto público es CLI + registry |
| Versión publicada con un fallo | Los consumidores instalan código defectuoso | Publicar un parche y `npm deprecate` si es grave; nunca reutilizar la versión |
| Posiciones de WindowManager no persisten | Al recargar vuelven a los valores iniciales | El Page Builder sí persiste su documento; falta una API de persistencia para WindowManager |
| Renderer y exportador del builder son dos implementaciones | Un bloque nuevo puede renderizar pero no exportarse bien | El catálogo es la fuente única; tests de exportación y revisión conjunta al añadir bloques |
| `localStorage` puede estar bloqueado o lleno | El autoguardado falla | Estado de error visible y exportación JSON como respaldo |
| DnD nativo difícil de simular en CI | El E2E podría no cubrir el gesto real | Alternativas de teclado + E2E con `DragEvent` y `DataTransfer` |
| Cambios de esquema del builder sin migración | Un JSON antiguo se descarta | Subir `version` y añadir migración en `normalizeDocument` |
| Baselines visuales dependen de Chromium y fuentes | Fallos falsos entre sistemas | Regenerar con `pnpm test:e2e:update` en la imagen de CI |
| Metadatos duplicados en `manifest.ts` y `COMPONENT_DOCS` | Puede desincronizarse al añadir componentes | Revisar ambos al crear un componente; futura validación automática |
| Scrollbars nativas en otros contenedores | No admiten flechas | ScrollArea propio ya resuelto; el resto conserva el estilo de 16 px |
| Escritura del CLI no transaccional | Un fallo de instalación deja archivos | Rollback o aviso en una fase posterior |
| Bold sintético de W95FA | Puede engrosar de forma irregular | Evaluar bold libre o ajuste de text-shadow |
| Component docs siguen en TSX tipado | No todo el contenido es MDX | Decisión deliberada: MDX para guías, TSX para previews interactivas |

## 6. Próximos pasos priorizados

1. Post-MVP del Page Builder: undo/redo, multiselección y persistencia remota.
2. Decidir si `@deskui/ui` se publica en npm o se mantiene privado.
3. Exportación a Next.js, Astro y HTML estático; plugins o bloques de usuario.
4. Prerender o SSR si se necesita indexación completa por ruta.
5. Monitorización del sitio y del registry; alertas de disponibilidad.

## 7. Cómo mantener este documento

Actualizar al cerrar cada corte:

1. Cambiar la fecha y el “último corte”.
2. Actualizar métricas (componentes, registry, tests, páginas).
3. Mover lo completado de pendiente a completado.
4. Añadir riesgos/deuda nuevos.
5. Reflejar requisitos en `REQUIREMENTS.md`.
6. Registrar decisiones nuevas o cambiadas en `DECISIONS.md`.
7. Ajustar el orden de `roadmap.md` si cambió la prioridad.
8. Añadir una entrada en `CHANGELOG.md` si el corte es relevante.

## 8. Enlaces

- [Índice de documentación](README.md)
- [Requisitos y trazabilidad](REQUIREMENTS.md)
- [Registro de decisiones](DECISIONS.md)
- [Roadmap](roadmap.md)
- [Publicación y versionado](releasing.md)
- [Despliegue](deployment.md)
- [Migración](migration.md)
- [Licencias](licenses.md)
- [Arquitectura](architecture.md)
- [Page Builder](page-builder.md)
- [Design tokens](design-tokens.md)
- [Componentes](components.md)
- [Análisis de referencias](reference-analysis.md)
