# Licencias y assets de terceros

> Revisión previa a la publicación. El código es MIT, la fuente W95FA es OFL y
> los iconos son originales. Las dependencias npm se instalan en el proyecto
> consumidor; el CLI no las empaqueta.

## Resumen

| Elemento | Licencia | Distribución |
| --- | --- | --- |
| Código de DeskUI | MIT | Repositorio, registry y componentes copiados |
| Tipografía W95FA | SIL OFL 1.1 | `packages/ui/src/styles/fonts/` y plantilla del CLI |
| Iconos pixel art | MIT (originales) | Componente `Icon` |
| Referencias visuales | Solo análisis interno | No se redistribuyen |
| Dependencias npm | MIT / Apache-2.0 / ISC | Se instalan desde npm, no se empaquetan |

## Dependencias de runtime de `@deskui/ui`

| Paquete | Licencia |
| --- | --- |
| `@hookform/resolvers` | MIT |
| `@radix-ui/react-context-menu` | MIT |
| `@radix-ui/react-dropdown-menu` | MIT |
| `@radix-ui/react-menubar` | MIT |
| `@radix-ui/react-slot` | MIT |
| `@radix-ui/react-tabs` | MIT |
| `@radix-ui/react-tooltip` | MIT |
| `class-variance-authority` | Apache-2.0 |
| `clsx` | MIT |
| `react-hook-form` | MIT |
| `tailwind-merge` | MIT |
| `zod` | MIT |
| `react` / `react-dom` (peer) | MIT |

`class-variance-authority` es la única dependencia Apache-2.0. No se copia al
proyecto: el CLI solo escribe el import y el consumidor la instala desde npm, con
su aviso de licencia incluido en el paquete.

## Dependencias de desarrollo y del sitio

Son herramientas de build o del sitio de documentación; no forman parte del
paquete `deskui`.

| Paquete | Licencia |
| --- | --- |
| `@mdx-js/rollup` | MIT |
| `remark-gfm` | MIT |
| `@tailwindcss/vite`, `tailwindcss` | MIT |
| `@vitejs/plugin-react`, `vite` | MIT |
| `typescript` | Apache-2.0 |
| `vitest`, `jsdom` | MIT |
| `@testing-library/*` | MIT |
| `@playwright/test` | Apache-2.0 |
| `tsup`, `tsx` | MIT |
| `@types/*` | MIT |

## Assets

- **W95FA**: recreación libre bajo SIL Open Font License 1.1. El archivo
  `W95FA-OFL.txt` viaja con la fuente en el repositorio y en la plantilla del
  CLI.
- **Iconos**: pixel art original del proyecto, bajo MIT. No se usan iconos de
  sistemas operativos ni de terceros.
- **Capturas de `references/`**: material de análisis interno; no se publican en
  el sitio ni en el paquete.
- **Marcas**: DeskUI es un nombre original. No se usan marcas, logotipos ni
  assets propietarios de terceros.

## Política

Licencias permitidas: `MIT`, `ISC`, `Apache-2.0`, `BSD-2-Clause`,
`BSD-3-Clause`, `0BSD`, `BlueOak-1.0.0`, `CC0-1.0`, `Unlicense` y `OFL-1.1`.

Se rechazan:

- Copyleft fuerte (`GPL`, `AGPL`, `SSPL`) en código que se distribuya.
- Licencias sin identificar (`UNKNOWN`, `UNLICENSED`).
- Assets sin licencia explícita o con restricciones de uso comercial.

`MPL-2.0` y `LGPL` no se usan hoy. Si se incorporan, se revisan caso por caso
porque sus obligaciones dependen de cómo se enlacen.

## Comprobación automática

```bash
pnpm licenses:check
```

El script lee las dependencias de runtime de `packages/ui`, `packages/cli` y
`apps/docs`, resuelve cada `package.json` instalado y falla si encuentra una
licencia fuera de la lista. Las herramientas de desarrollo del sitio y del
monorepo se revisan a mano con la tabla anterior. También verifica que existan
`LICENSE`, `W95FA-OFL.txt` y la copia de la fuente en la plantilla del CLI.

Se ejecuta como parte de la revisión de release, no en `pnpm test`, para no
depender de `node_modules` completos en cada test.

## Checklist antes de publicar

- [ ] `pnpm licenses:check` en verde.
- [ ] `LICENSE` en la raíz y en el paquete del CLI.
- [ ] `W95FA-OFL.txt` en `packages/ui/src/styles/fonts` y en
  `packages/cli/templates/fonts`.
- [ ] Sin capturas, iconos, fuentes o sonidos de terceros en `dist/`.
- [ ] README y sitio enlazan a la licencia MIT y a la OFL.
- [ ] Dependencias nuevas revisadas y añadidas a `scripts/check-licenses.mjs` si
  su licencia no es estándar.

## Enlaces

- [Licencia MIT](../LICENSE)
- [W95FA OFL](../packages/ui/src/styles/fonts/W95FA-OFL.txt)
- [Publicación](releasing.md)
- [Requisitos](../docs/REQUIREMENTS.md)
