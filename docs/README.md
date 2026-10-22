# Documentación — índice

> Punto de entrada para entender el estado, el alcance y las decisiones del
> proyecto. La documentación está en español e inglés; el código y las APIs en
> inglés.

## Lectura recomendada

1. **`PROGRESS.md`** — dónde estamos, métricas, pendientes, riesgos y próximos
   pasos. Es la fuente de verdad del estado.
2. **`REQUIREMENTS.md`** — qué se pidió, qué está hecho, qué falta y qué
   requisitos nuevos aparecieron.
3. **`DECISIONS.md`** — por qué se tomó cada decisión relevante y qué
   alternativas se descartaron.
4. **`roadmap.md`** — secuencia planificada por fases.
5. **`architecture.md`** — cómo está construido el monorepo, el registry, el CLI
   y la documentación.
6. **`page-builder.md`** — modelo, bloques, plantillas, exportación y límites del
   Page Builder.
7. **`ai.md`** — skills, `AGENTS.md`, `llms.txt` y flujo recomendado para
   agentes.
8. **`design-tokens.md`** — contrato visual: color, biseles, tipografía,
   geometría, temas y contraste.
9. **`components.md`** — API resumida de los componentes.
10. **`reference-analysis.md`** — lectura de las imágenes de `references/` y
    concesiones frente a la fidelidad.
11. **`releasing.md`** — versionado, empaquetado, npm y orden de publicación.
12. **`deployment.md`** — despliegue estático del sitio y del registry en el VPC.
13. **`migration.md`** — migración entre versiones y política de compatibilidad.
14. **`licenses.md`** — licencias de código, fuente, iconos y dependencias.

## Fuente de verdad por tema

| Pregunta | Documento |
| --- | --- |
| ¿Qué está hecho y qué falta? | `PROGRESS.md` |
| ¿Qué alcance se prometió? | `REQUIREMENTS.md` |
| ¿Por qué se eligió esta solución? | `DECISIONS.md` |
| ¿En qué orden se construye? | `roadmap.md` |
| ¿Cómo está organizado el código? | `architecture.md` |
| ¿Cómo funciona el Page Builder? | `page-builder.md` |
| ¿Qué colores, medidas y temas existen? | `design-tokens.md` |
| ¿Qué props y variantes tiene un componente? | `components.md` y el sitio en vivo |
| ¿Qué se extrajo de las referencias? | `reference-analysis.md` |
| ¿Cómo se publica una versión? | `releasing.md` |
| ¿Cómo se despliega el sitio y el registry? | `deployment.md` |
| ¿Cómo se migra entre versiones? | `migration.md` |
| ¿Qué licencias tienen código, fuente y dependencias? | `licenses.md` |
| ¿Cómo lo usan los agentes IA? | `ai.md` y `../skills/` |
| ¿Qué cambió en cada versión? | `../CHANGELOG.md` |
| ¿Cómo se contribuye? | `../CONTRIBUTING.md` |

## Documentos vivos

Estos tres documentos se actualizan en cada corte:

- `PROGRESS.md`: métricas, inventario, riesgos y próximos pasos.
- `REQUIREMENTS.md`: estados de requisitos y nuevos `NR-*`.
- `DECISIONS.md`: nuevas decisiones, cambios y supersesiones.

El resto son documentos de referencia: cambian cuando cambia el diseño, no en
cada corte.

## Instantánea actual (2026-10-22)

- Fase 4 casi completada: sitio y registry en producción; `deskui@0.2.0`
  empaquetado, publicación npm pendiente de OTP.
- 47 componentes, 49 items de registry, Page Builder e i18n es/en.
- 171 tests unitarios (118 UI + 12 CLI + 41 docs) + 28 E2E; axe sin violaciones
  en 27 rutas.
- Registry servido por el sitio en `/r`; `release:check` y `licenses:check` en
  verde.
- README público y página «Acerca de» con enlaces a GitHub y npm.
- Próximo: post-MVP del Page Builder y decisión sobre `@deskui/ui`.

## Flujo de actualización

Al cerrar un corte:

1. Actualizar `PROGRESS.md` (fecha, métricas, completados, riesgos).
2. Actualizar `REQUIREMENTS.md` (estados y nuevos requisitos).
3. Registrar decisiones en `DECISIONS.md`.
4. Ajustar `roadmap.md` si cambió la prioridad.
5. Actualizar `CHANGELOG.md` si el corte es relevante.
6. Ejecutar `pnpm typecheck`, `pnpm test` y `pnpm release:verify`.

## Documentos relacionados fuera de `docs/`

- `README.md` — presentación, inicio rápido y licencias.
- `CHANGELOG.md` — historial de versiones.
- `CONTRIBUTING.md` — convenciones, checklist de componentes y flujo de PR.
- `packages/cli/README.md` — uso detallado del CLI.
- `references/` — imágenes originales de referencia.

## Estado del sitio

El sitio se sirve desde `apps/docs` con Vite. En local:

```bash
pnpm dev
```

- Documentación: `http://127.0.0.1:5173/#/`
- Laboratorio: `http://127.0.0.1:5173/#/laboratorio`
- Page Builder: `http://127.0.0.1:5173/#/constructor`

El CLI 0.2.0 aún no está publicado en npm; para probarlo desde el monorepo usa
`pnpm build:cli` y `node packages/cli/dist/index.js`, o empaquétalo con
`pnpm release:pack`. El registry remoto de referencia es
`https://deskui.codehive.com.co/r`.
