# Contribuir

Gracias por querer mejorar DeskUI. El proyecto prioriza coherencia
visual, accesibilidad y código que se pueda copiar y mantener.

## Preparación

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm registry:build
pnpm registry:site
pnpm build:cli
pnpm release:verify
pnpm licenses:check
```

La suite E2E necesita Chromium: `pnpm exec playwright install chromium`. Las
capturas de regresión visual se actualizan con `pnpm test:e2e:update`.

No se aceptan assets propietarios de terceros (fuentes, iconos, cursores, sonidos, capturas
propietarias). Cualquier recurso nuevo debe indicar su licencia.

## Convenciones

- Código, nombres de API y comentarios técnicos: inglés.
- Documentación y textos de interfaz del laboratorio: español.
- TypeScript estricto. Sin `any` salvo justificación.
- Componentes con `forwardRef`, `className`, `data-slot` y tipos exportados.
- Estilos solo con tokens semánticos y utilidades. Nunca hex dentro de un
  componente.
- Sin animaciones con blur ni transiciones suaves. La estética es instantánea.
- Iconos en SVG 16×16 con `shapeRendering="crispEdges"` y licencia compatible.

## Checklist de un componente nuevo

1. **API**: props tipadas, composición si aporta claridad, `className` expuesto.
2. **Tokens**: colores, bordes, alturas y tipografía desde variables.
3. **Estados**: hover, active, focus-visible, disabled, read-only y pressed
   cuando aplique.
4. **Teclado**: orden de tabulación, Enter/Espacio, Escape, flechas si el
   patrón lo requiere.
5. **ARIA**: roles y nombres accesibles correctos; sin `aria-label` en `div`
   genéricos.
6. **Responsive**: 24 px mínimo de área táctil en móvil; sin romper la densidad
   de escritorio.
7. **Tests**: comportamiento con Testing Library y axe en una composición.
8. **Registry**: añadir el item a `packages/ui/scripts/build-registry.mjs`,
   incluyendo dependencias y `registryDependencies`.
9. **Docs**: descripción, variantes, props, estados, accesibilidad y ejemplo
   copiable; textos de preview en `apps/docs/src/i18n/component-copy.ts` y
   traducción inglesa en `component-docs.en.ts`.
10. **Tema**: comprobar `classic`, `gradient` y `high-contrast` si el componente
    introduce nuevas superficies.

## Skills y documentación para IA

- La fuente canónica es `skills/`; no edites `.opencode/skills/` ni
  `.agents/skills/` a mano.
- Después de cambiar una skill: `pnpm skills:sync` y `pnpm skills:check`.
- `pnpm llms:build` regenera `apps/docs/public/llms.txt` y `llms-full.txt`.
- `AGENTS.md` resume el repositorio y el routing de skills.
- `docs/ai.md` explica el flujo recomendado para agentes.

## Componentes

- Fuente: `packages/ui/src/components/<name>.tsx`.
- Test: `packages/ui/src/components/<name>.test.tsx`.
- Export: `packages/ui/src/index.ts`.
- Registry: actualizar la lista del script y ejecutar `pnpm registry:build`.
- No añadas dependencias sin justificar el peso y la licencia.

## Trazabilidad

Cada corte actualiza:

- `docs/PROGRESS.md`: fecha, métricas, completados, pendientes y riesgos.
- `docs/REQUIREMENTS.md`: estados e IDs de requisitos nuevos (`NR-*`).
- `docs/DECISIONS.md`: decisiones nuevas, cambios y supersesiones.
- `docs/roadmap.md` y `CHANGELOG.md` cuando cambie el plan o la versión.

Un requisito nuevo no se borra ni se reescribe: se marca `Superseded` y se crea
un `NR-*`. Una decisión aceptada tampoco se borra: se marca `Superseded` y se
enlaza la nueva.

## Publicación

- `docs/releasing.md`: versionado, empaquetado, npm y orden de publicación.
- `docs/deployment.md`: despliegue estático del sitio y del registry en el VPC.
- `docs/migration.md`: migración entre versiones.
- `docs/licenses.md`: licencias de código, fuente, iconos y dependencias.

Antes de un release: `pnpm release:verify` y `pnpm licenses:check`. El registro
de la versión va en los cuatro `package.json`, `CHANGELOG.md`, el changelog del
sitio y, si hay cambios incompatibles, la guía de migración.

## CLI

- Fuente: `packages/cli/src/`.
- Tests: `packages/cli/src/**/*.test.ts` con Vitest.
- `init` copia `templates/`; `add` resuelve `registryDependencies` y respeta
  `components.json`.
- No añadas dependencias de runtime al CLI sin una justificación fuerte.
- Prueba el flujo empaquetado: `pnpm release:pack`, instala el
  tarball en un proyecto temporal y ejecuta `init`/`add`.
- Mantén la paridad entre `packages/ui/dist/registry` y el registry incluido en
  el CLI; `pnpm build:cli` la sincroniza.

## Documentación

- Shell y páginas: `apps/docs/src/pages/`.
- Contenido de componentes: `apps/docs/src/content/components.tsx`.
- Cada componente nuevo necesita entrada en `COMPONENT_DOCS`, preview, snippet,
  tabla de props y notas de accesibilidad.
- El router es por hash (`#/...`); mantén las rutas y el sidebar sincronizados.
- La documentación está en español e inglés; el código y las APIs en inglés.

## Page Builder

- Modelo puro: `apps/docs/src/lib/builder/` (`types`, `catalog`, `model`,
  `templates`, `export`, `storage`). No importa React ni toca el DOM.
- UI: `apps/docs/src/components/builder/` (paleta, lienzo, bloques, capas,
  propiedades y diálogos).
- Orquestación y atajos: `apps/docs/src/pages/builder.tsx`.
- Al añadir un bloque, actualiza el catálogo, el renderer (`blocks.tsx`), el
  exportador (`export.ts`) y los tests de exportación.
- Los cambios de esquema suben `version` y añaden migración en
  `normalizeDocument`; no cambies el formato en silencio.
- Tests: `pnpm --filter @deskui/docs test`; E2E: `pnpm test:e2e`.
- El builder no se añade al registry ni a `packages/ui`: es una herramienta del
  sitio (D-029).
- Mantén la accesibilidad del árbol de capas, los nombres de los bloques y las
  alternativas de teclado al DnD.

## Temas

Para un tema nuevo:

1. Añade un bloque `[data-theme="..."]` en `tokens.css`.
2. Redefine solo tokens semánticos, no recetas de bisel.
3. Comprueba contraste de texto, selección, foco y barras de título.
4. Documenta la paleta en `docs/design-tokens.md`.
5. Añade una captura o ejemplo en el laboratorio.

## Commits y pull requests

- Un cambio por PR, con contexto y capturas antes/después si afecta al estilo.
- Incluye tests cuando cambie comportamiento.
- Actualiza README, docs y roadmap si cambia el alcance.
- No reformatees archivos ajenos al cambio.
- Ejecuta `pnpm typecheck && pnpm test && pnpm build` antes de abrir el PR.

## Accesibilidad

- El foco punteado debe ser visible en todos los temas.
- No elimines el foco del navegador sin sustituto.
- Los controles decorativos de una ventana se renderizan como elementos
  inertes; no como botones sin acción.
- Los textos que no son decorativos deben cumplir AA. Las excepciones
  (deshabilitado) deben documentarse.
- Prueba con teclado y con zoom de 200 %.
