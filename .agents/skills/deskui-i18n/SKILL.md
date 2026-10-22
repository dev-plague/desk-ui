---
name: deskui-i18n
description: Internacionalización de DeskUI en español e inglés. Úsala al cambiar los textos internos de los componentes, añadir un idioma, usar DeskUILocaleProvider, traducir aria-labels o integrar el selector de idioma y los diccionarios de la documentación.
---

# i18n en DeskUI

Hay dos capas independientes:

1. **Librería**: textos internos de los componentes con
   `DeskUILocaleProvider` (`packages/ui/src/lib/i18n.tsx`).
2. **Sitio**: diccionarios `es`/`en`, `?lang=en`, selector ES/EN y contenido
   traducido en `apps/docs/src/i18n/`.

## Librería

```tsx
import { DeskUILocaleProvider } from "@deskui/ui";

<DeskUILocaleProvider locale="en">
  <App />
</DeskUILocaleProvider>
```

En un consumidor con el CLI, el archivo copiado es `@/lib/i18n`.

- Español por defecto; sin proveedor no hay cambios.
- `messages` permite sobrescribir secciones concretas.
- Las props explícitas (`okLabel`, `backLabel`, `restartLabel`, etc.) tienen
  prioridad.
- Componentes con textos internos: `Pagination`, `Wizard`,
  `PropertiesDialog`, `Notepad`, `FileExplorer`, `Minesweeper`, `Terminal`,
  `BlueScreen`, `Screensaver`, `TitleBar`, `Toast`, `ScrollArea` y `Desktop`.

## Sitio

- `messages.ts` es la fuente de verdad de la forma; `en` se tipa contra
  `typeof es`.
- `provider.tsx` resuelve `?lang=en` o `localStorage`, actualiza `<html lang>`,
  la URL y los metadatos.
- Las fichas de componentes tienen overlay inglés en
  `component-docs.en.ts`; las previews en `component-copy.ts`.
- Las guías tienen versiones `*.en.mdx`.
- Un test verifica que el overlay conserva props y notas.

## Reglas

- Traduce también `aria-label`, `title`, `placeholder` y `sr-only`.
- Mantén la paridad de claves; TypeScript debe fallar si falta una.
- No traduzcas nombres de props, tipos, valores técnicos ni comandos.
- El contenido de demo del Page Builder y los showcases es contenido de ejemplo.
- `<html lang>` es responsabilidad de la aplicación, no de DeskUI.

## Referencias

- [i18n.md](../deskui/references/i18n.md): guía completa y cómo añadir idiomas.
- [checklist.md](../deskui/references/checklist.md): revisión de accesibilidad e
  i18n.
