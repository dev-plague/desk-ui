# DeskUI CLI

[![npm version](https://img.shields.io/npm/v/deskui.svg)](https://www.npmjs.com/package/deskui)
[![license](https://img.shields.io/npm/l/deskui.svg)](https://github.com/dev-plague/desk-ui/blob/master/LICENSE)
[![docs](https://img.shields.io/badge/docs-deskui.codehive.com.co-008080)](https://deskui.codehive.com.co)

CLI oficial de **DeskUI**, una librería de componentes React con estética de
escritorio clásico. Sigue el modelo *copy & own*: los componentes se copian a tu
proyecto y el código pasa a ser tuyo.

- **Sitio y documentación**: <https://deskui.codehive.com.co>
- **Repositorio**: <https://github.com/dev-plague/desk-ui>
- **Catálogo**: <https://deskui.codehive.com.co/#/componentes>
- **Registry**: <https://deskui.codehive.com.co/r>

## Inicio rápido

```bash
npx deskui init
npx deskui add button input label group-box checkbox textarea
npx deskui add dialog window status-bar title-bar utils
npx deskui list
```

Requisitos: **Node.js 20.19+**, **React 18+** y **Tailwind CSS 4**.

## Qué hace `init`

- Detecta `src/`, el alias de imports y el CSS de entrada.
- Copia `styles/deskui.css`, las fuentes W95FA y `lib/utils.ts`.
- Escribe `components.json`.
- Inserta `@import "./styles/deskui.css";` después de Tailwind.
- Copia las skills de DeskUI a `.agents/skills/` y `.opencode/skills/` y añade
  una sección a `AGENTS.md` para que los agentes del proyecto conozcan la
  librería. Usa `--no-agents` para omitirlo.

## Qué hace `add`

- Resuelve `registryDependencies` en profundidad (`dialog` copia antes `window`,
  `title-bar`, `status-bar` y `utils`).
- Copia los archivos a `components/ui` y `lib`.
- Instala las dependencias npm con el gestor detectado.
- No sobrescribe archivos con contenido distinto sin `--overwrite`.

## Opciones

```text
--cwd <dir>            Directorio del proyecto
--registry <url|ruta>  Registry alternativo
--overwrite            Reemplaza archivos con otro contenido
--force                Igual que --overwrite, también para components.json
--no-install           No ejecuta el gestor de paquetes
--no-agents            init: no copia skills ni modifica AGENTS.md
--dry-run              Muestra lo que haría add sin escribir
--alias <prefijo>      Alias de imports (por defecto: @/)
--css <archivo>        CSS de entrada para init
--src-dir              Fuerza src/ como raíz
--no-src-dir           Fuerza la raíz sin src/
-h, --help             Ayuda
-v, --version          Versión
```

## Registry

El paquete incluye una copia del registry (`registry/*.json`) para funcionar sin
conexión. Puedes apuntar a otro registry con `--registry` o con
`DESKUI_REGISTRY`.

Prioridad:

1. `--registry`
2. `DESKUI_REGISTRY`
3. `components.json` → `registry`
4. Registry local del monorepo (desarrollo)
5. Registry incluido en el paquete
6. `https://deskui.codehive.com.co/r`

## Imports en el consumidor

```tsx
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DeskUILocaleProvider } from "@/lib/i18n";
import { cn } from "@/lib/utils";
```

Para traducir los textos internos al inglés:

```tsx
import { DeskUILocaleProvider } from "@/lib/i18n";

export function Root({ children }: { children: React.ReactNode }) {
  return <DeskUILocaleProvider locale="en">{children}</DeskUILocaleProvider>;
}
```

## Page Builder

El [constructor visual](https://deskui.codehive.com.co/#/constructor) exporta
JSX, JSON y los comandos `add` necesarios para reproducir una página:

```bash
npx deskui add alert badge button card status-bar
```

## Actualizar un componente copiado

El código es tuyo; el CLI no hace merge. Para recuperar una versión nueva:

```bash
npx deskui add button --dry-run
npx deskui add button --overwrite
```

Consulta la [guía de migración](https://deskui.codehive.com.co/#/migracion).

## Licencia

MIT. La tipografía W95FA se distribuye bajo SIL OFL 1.1 y los iconos son pixel
art original del proyecto. No se usan assets propietarios de terceros.

Hecho con React, TypeScript, Tailwind CSS 4 y Radix.
