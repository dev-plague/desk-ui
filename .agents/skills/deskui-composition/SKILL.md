---
name: deskui-composition
description: Guía de composición visual de DeskUI para construir pantallas clásicas coherentes, densas y accesibles. Úsala al maquetar ventanas, paneles, formularios, barras de herramientas, tablas o aplicaciones de escritorio, y al revisar jerarquía, densidad, foco, contraste o do & don't.
---

# Composición con DeskUI

Usa esta skill cuando la pregunta sea **cómo debe verse y organizarse** una
pantalla, no qué props tiene un componente concreto.

## Regla principal

Una pantalla clásica se lee de arriba abajo: barra de título, menú, contenido y
barra de estado. El bisel no sustituye a la jerarquía.

- Una sola ventana principal por pantalla.
- Diálogos solo para decisiones que bloquean el flujo.
- Paneles y `GroupBox` para regiones internas, no para decorar.
- `Card` para repetir elementos de un catálogo, no como layout principal.

## Densidad

| Contexto | Altura | Nota |
| --- | --- | --- |
| Escritorio | 21–23 px | No añadas padding extra |
| Móvil | 24 px mínimo | Mantén el área táctil |
| Separación | 4–8 px | Escalas de Tailwind |
| Ventana | 3 px de marco | El bisel ya da profundidad |

## Formularios

- `Label` + `htmlFor`/`id` en cada control.
- `GroupBox` para más de cuatro controles relacionados.
- Un solo `Button variant="primary"` por formulario.
- Cancelar a la izquierda del primario.
- Ayuda en `FormDescription`; errores en `FormMessage`.

## Barras de herramientas

`Toolbar` + `ToolbarGroup` + `ToolbarSeparator`. Usa `pressed` para negrita,
cursiva o alternancias. Un botón solo icono necesita `aria-label`.

## Color y foco

- Tokens semánticos: `bg-surface`, `bg-surface-sunken`, `text-ink`,
  `text-ink-muted`, `bg-accent`, `text-ink-inverse`.
- `bevel-raised` / `bevel-sunken`; nunca radios, blur ni sombras difusas.
- `focus-dotted` visible en todos los temas.
- El azul de selección solo para foco o selección real.

## Accesibilidad

- Roles nativos antes que ARIA manual.
- Nombra regiones, ventanas y diálogos.
- Prueba solo con teclado antes de terminar.
- Comprueba `classic`, `gradient` y `high-contrast`.
- Respeta `prefers-reduced-motion`.

## Referencias

- [composition.md](../deskui/references/composition.md): guía completa.
- [patterns.md](../deskui/references/patterns.md): recetas de pantalla.
- [checklist.md](../deskui/references/checklist.md): revisión final.
- [design-tokens.md](../deskui/references/design-tokens.md): contrato visual.

## Cierre

Antes de entregar, verifica jerarquía, un solo primario, foco visible, densidad,
contraste y que no haya valores visuales fuera de tokens.
