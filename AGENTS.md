# AGENTS.md — DeskUI

Este repositorio es el monorepo de **DeskUI**: una librería de componentes React
con estética de escritorio clásico, documentación bilingüe y distribución
*copy & own* mediante CLI.

## Mapa rápido

```text
apps/docs                 Documentación, laboratorio y Page Builder (Vite + React)
packages/ui               Componentes, tokens, fuentes, tests y registry
packages/cli              CLI init/add/list y registry empaquetado
docs/                     Arquitectura, requisitos, decisiones, tokens y guías
skills/                   Skills para agentes (fuente canónica)
.opencode/skills/         Copia autodetectada por OpenCode (generada)
.agents/skills/           Copia para otros agentes (generada)
```

## Comandos

```bash
pnpm install
pnpm dev                 # documentación en http://127.0.0.1:5173
pnpm typecheck
pnpm test                # UI + CLI + docs
pnpm test:e2e            # Playwright (requiere chromium)
pnpm build               # registry + CLI + docs
pnpm registry:build
pnpm build:cli
pnpm release:verify      # typecheck + tests + build de release + release:check
pnpm release:pack        # tarball del CLI en artifacts/
pnpm release:bundle      # tarball del sitio + SHA-256
pnpm release:check
pnpm licenses:check
pnpm skills:sync         # sincroniza .opencode/skills y .agents/skills
pnpm skills:check        # falla si las copias están desincronizadas
```

El entorno puede no tener `pnpm` en el `PATH`; en esta máquina está en
`/home/dev-plague/.local/bin/pnpm`.

## Convenciones

- Código y API en inglés; documentación e interfaz en español e inglés.
- TypeScript estricto; componentes con `forwardRef`, `className` y `data-slot`
  cuando aplique.
- Estilos solo con tokens semánticos y utilidades de Tailwind. Sin colores
  sueltos, radios, blur ni sombras difusas.
- Accesibilidad por defecto: teclado, foco visible, roles nativos y nombres
  accesibles.
- Tests con Vitest + Testing Library; E2E con Playwright y axe.
- El registry se genera desde el código fuente; no edites `dist/` ni
  `packages/cli/registry/` a mano.
- i18n: los textos del sitio viven en `apps/docs/src/i18n/`; los de la librería
  en `packages/ui/src/lib/i18n.tsx`.

## Skills disponibles

Carga la skill adecuada antes de trabajar:

| Tarea | Skill |
| --- | --- |
| Usar DeskUI, instalar, elegir componentes, API | `deskui` |
| Componer pantallas, densidad, accesibilidad visual | `deskui-composition` |
| Page Builder, bloques, exportación | `deskui-page-builder` |
| Español/inglés, textos internos, diccionarios | `deskui-i18n` |

Las skills canónicas están en `skills/`. `.opencode/skills/` y
`.agents/skills/` son copias generadas con `pnpm skills:sync`; no las edites a
mano.

## Documentación para IA

- `skills/deskui/SKILL.md`: entrada principal.
- `skills/deskui/references/`: API de componentes, composición, patrones, i18n,
  CLI, checklist y tokens.
- `llms.txt` y `llms-full.txt` en `apps/docs/public/`: índice y versión
  consolidada para agentes que consulten el sitio.
- `docs/README.md`: índice de la documentación del proyecto.
- `docs/releasing.md`, `docs/deployment.md`, `docs/migration.md` y
  `docs/licenses.md`: publicación, despliegue, migración y licencias.

## Reglas de cambio

1. Si tocas un componente, actualiza test, registry, página de documentación y
   textos de preview/traducción.
2. Si tocas el CLI, actualiza tests y `packages/cli/README.md`.
3. Si tocas i18n, mantén la paridad `es`/`en` y ejecuta el test de overlay.
4. Si cambias el alcance, actualiza `docs/PROGRESS.md`, `docs/REQUIREMENTS.md`,
   `docs/DECISIONS.md` y `CHANGELOG.md`.
5. Antes de entregar: `pnpm typecheck`, `pnpm test`, `pnpm build` y, si aplica,
   `pnpm test:e2e`. Para un corte publicable, `pnpm release:verify` y
   `pnpm licenses:check`.
