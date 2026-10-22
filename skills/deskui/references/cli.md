# CLI de DeskUI

El CLI `deskui` copia componentes y tokens al proyecto. No hay una librería
opaca en `node_modules`: el código pasa a ser tuyo.

## Requisitos

- Node.js 20.19+
- React 18+
- Tailwind CSS 4

## init

```bash
npx deskui init
```

Detecta `src/`, el alias de imports y el CSS de entrada. Copia:

- `src/styles/deskui.css` (tokens y utilidades).
- `src/styles/fonts/` (W95FA + licencia OFL).
- `src/lib/utils.ts` (`cn`).
- `components.json`.
- Skills de DeskUI y una sección en `AGENTS.md` (salvo `--no-agents`).

Opciones:

```bash
npx deskui init --alias "~/" --css src/app.css
npx deskui init --no-install
npx deskui init --no-agents
npx deskui init --overwrite
```

## add

```bash
npx deskui add button input label group-box
npx deskui add dialog --dry-run
npx deskui add pagination --overwrite
```

`add` resuelve dependencias del registry. Por ejemplo, `dialog` copia antes
`window` y `utils`; `pagination` copia también `i18n`.

Opciones:

| Opción | Efecto |
| --- | --- |
| `--dry-run` | Muestra archivos sin escribir |
| `--overwrite` | Reemplaza archivos con contenido distinto |
| `--force` | Igual que `--overwrite`, también para `components.json` |
| `--no-install` | No ejecuta el gestor de paquetes |
| `--registry <url-o-ruta>` | Usa otro registry |
| `--cwd <dir>` | Directorio del proyecto |

## list

```bash
npx deskui list
```

Lista los 49 items del registry (47 componentes + `utils` + `i18n`).

## Imports en el consumidor

```tsx
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DeskUILocaleProvider } from "@/lib/i18n";
import { cn } from "@/lib/utils";
```

## Registry

- Formato compatible con shadcn (`registry-item.json`).
- Generado desde `packages/ui/src/components` con
  `pnpm registry:build`.
- Incluido en el paquete para funcionar sin conexión.
- `registryDependencies` resuelve las dependencias locales; `dependencies`
  declara las de npm.

## Actualizar un componente copiado

El código es tuyo. Si quieres recuperar una versión nueva:

```bash
npx deskui add button --overwrite
```

Revisa el diff: puedes haber personalizado el componente. Para cambios
pequeños, copia solo el archivo del registry y vuelve a aplicar tus ajustes.

## Problemas frecuentes

| Problema | Solución |
| --- | --- |
| No detecta Tailwind 4 | Instala `tailwindcss@4` y usa `@import "tailwindcss"` |
| No detecta el alias | Configura `paths` en `tsconfig.json` o usa `--alias` |
| El CSS no carga | Añade `@import "./styles/deskui.css";` tras Tailwind |
| Falta `cn` | Ejecuta `init` o `add utils` |
| Conflicto de archivo | Usa `--overwrite` después de revisar el diff |
| Los textos no cambian de idioma | Envuelve la app con `DeskUILocaleProvider` |
