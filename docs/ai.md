# IA y agentes

DeskUI incluye material pensado para que agentes y asistentes de código puedan
usar la librería sin inventar APIs ni estilos.

## Skills

La fuente canónica está en `skills/`:

| Skill | Uso |
| --- | --- |
| `deskui` | Instalación, catálogo, API, patrones, i18n, CLI y checklist |
| `deskui-composition` | Jerarquía, densidad, formularios, toolbars y a11y |
| `deskui-page-builder` | Modelo, bloques, capas y exportación JSX/JSON |
| `deskui-i18n` | `DeskUILocaleProvider`, diccionarios es/en y textos internos |

Las skills se sincronizan a `.opencode/skills/` (OpenCode) y `.agents/skills/`
(Codex y otros agentes):

```bash
pnpm skills:sync
pnpm skills:check
```

No edites las copias generadas; edita `skills/` y vuelve a sincronizar.

## AGENTS.md

`AGENTS.md` en la raíz resume el monorepo, los comandos, las convenciones y el
routing de skills. Es la primera parada para un agente que trabaje en DeskUI.

`deskui init` añade una sección de DeskUI a `AGENTS.md` del proyecto consumidor
y copia las skills a `.agents/skills/` y `.opencode/skills/`. Se puede omitir con
`--no-agents`.

## llms.txt

El sitio publica:

- `/llms.txt`: índice breve con skills, rutas y reglas de composición.
- `/llms-full.txt`: skills y referencias consolidadas para ingestión completa.

Se generan desde `skills/`:

```bash
pnpm llms:build
```

## Referencias para agentes

- `skills/deskui/references/components.md`: API de los 47 componentes.
- `skills/deskui/references/composition.md`: guía de composición.
- `skills/deskui/references/patterns.md`: recetas de pantalla.
- `skills/deskui/references/i18n.md`: internacionalización.
- `skills/deskui/references/cli.md`: `init`, `add`, `list` y registry.
- `skills/deskui/references/checklist.md`: revisión antes de entregar.
- `skills/deskui/references/design-tokens.md`: contrato visual.
- `skills/deskui/references/page-builder.md`: Page Builder.

## Flujo recomendado para un agente

1. Lee `AGENTS.md` y la skill `deskui`.
2. Si va a maquetar, carga `deskui-composition`.
3. Si va a tocar el constructor, carga `deskui-page-builder`.
4. Si va a traducir, carga `deskui-i18n`.
5. Consulta `components.md` antes de usar una prop.
6. Ejecuta `pnpm typecheck` y `pnpm test` antes de entregar.
