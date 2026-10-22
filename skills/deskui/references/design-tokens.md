# Design tokens de DeskUI

> Contrato visual: color, biseles, tipografía, geometría, temas y contraste.
> No introduzcas valores fuera de estos tokens.

# Design tokens

Los tokens viven en `packages/ui/src/styles/tokens.css`. Esta página documenta
el contrato; si un valor no está aquí, no debería aparecer en un componente.

## 1. Paleta cruda

| Token | Valor | Uso |
| --- | --- | --- |
| `--w95-white` | `#FFFFFF` | Caras iluminadas, texto sobre azul |
| `--w95-gray-100` | `#DFDFDF` | Bisel interior claro, superficie elevada |
| `--w95-gray-200` | `#C0C0C0` | Superficie clásica |
| `--w95-gray-300` | `#808080` | Sombra de bisel, texto deshabilitado |
| `--w95-gray-400` | `#404040` | Texto secundario accesible |
| `--w95-black` | `#000000` | Marco de ventana y bordes profundos |
| `--w95-navy` | `#000080` | Barra de título activa, selección |
| `--w95-blue` | `#1084D0` | Degradado del tema Gradiente |
| `--w95-teal` | `#008080` | Escritorio |
| `--w95-green` | `#008000` | Éxito |
| `--w95-olive` | `#808000` | Advertencia |
| `--w95-maroon` | `#800000` | Error |
| `--w95-red` | `#FF0000` | Acento de error puntual |
| `--w95-yellow` | `#FFFF00` | Iconografía y alto contraste |

## 2. Tokens semánticos

### Superficies

| Token | Clásico | Uso |
| --- | --- | --- |
| `--w95-surface` | `#C0C0C0` | Fondo de ventanas, botones y barras |
| `--w95-surface-raised` | `#DFDFDF` | Toolbars y elementos elevados |
| `--w95-surface-sunken` | `#FFFFFF` | Inputs, listas y documentos |
| `--w95-surface-pressed` | `#DFDFDF` | Botones toggle activos |
| `--w95-desktop` | `#008080` | Fondo de página/escritorio |

### Texto

| Token | Clásico | Uso |
| --- | --- | --- |
| `--w95-text` | `#000000` | Texto principal |
| `--w95-text-muted` | `#404040` | Ayudas y texto secundario (AA) |
| `--w95-text-disabled` | `#808080` | Texto deshabilitado con relieve |
| `--w95-text-inverse` | `#FFFFFF` | Texto sobre azul |
| `--w95-link` | `#0000FF` | Enlaces |

### Acento y selección

| Token | Clásico | Uso |
| --- | --- | --- |
| `--w95-accent` | `#000080` | Barra activa, selección, hover de menú |
| `--w95-accent-soft` | `#1084D0` | Fin del degradado Gradiente |
| `--w95-selection` | `#000080` | Fondo de selección |
| `--w95-selection-text` | `#FFFFFF` | Texto seleccionado |
| `--w95-focus` | `#000000` | Punto del foco punteado |

### Barra de título

| Token | Clásico | Gradiente |
| --- | --- | --- |
| `--w95-titlebar-from` | `#000080` | `#000080` |
| `--w95-titlebar-to` | `#000080` | `#1084D0` |
| `--w95-titlebar-text` | `#FFFFFF` | `#FFFFFF` |
| `--w95-titlebar-inactive-from` | `#606060` | `#606060` |
| `--w95-titlebar-inactive-to` | `#707070` | `#707070` |
| `--w95-titlebar-inactive-text` | `#FFFFFF` | `#FFFFFF` |

La base es clásica y plana. El degradado se activa con
`<html data-theme="gradient">`. La barra inactiva se oscureció respecto al gris
original para que el texto blanco mantenga contraste AA (4.95:1 en el extremo
más claro).

### Semánticos de estado

| Token | Clásico |
| --- | --- |
| `--w95-success` | `#008000` |
| `--w95-warning` | `#808000` |
| `--w95-danger` | `#800000` |
| `--w95-info` | `#000080` |
| `--w95-tooltip` | `#FFFFE1` |

## 3. Biseles

El bisel se construye con cuatro capas de `box-shadow` inset. No usa
`border`, por lo que no altera el modelo de caja ni el tamaño del componente.

```css
/* Elevado */
inset -1px -1px var(--w95-dark),      /* borde exterior inferior derecho */
inset  1px  1px var(--w95-highlight), /* borde exterior superior izquierdo */
inset -2px -2px var(--w95-shadow),    /* borde interior inferior derecho */
inset  2px  2px var(--w95-light);     /* borde interior superior izquierdo */

/* Hundido: se invierten los cuatro valores */
```

| Utilidad | Token | Uso |
| --- | --- | --- |
| `bevel-raised` | `--w95-bevel-raised` | Botones, barras, controles |
| `bevel-sunken` | `--w95-bevel-sunken` | Botón pulsado, toggle activo |
| `bevel-window` | `--w95-bevel-window` | Marco exterior de ventana |
| `bevel-field` | `--w95-bevel-field` | Inputs, documentos, listas |
| `bevel-status` | `--w95-bevel-status` | Campos de barra de estado |
| `bevel-group` | `--w95-bevel-group` | Fieldset/group box |
| `bevel-tab` | `--w95-bevel-tab` | Pestaña activa de Tabs |
| `bevel-default` | `--w95-bevel-default` | Botón predeterminado (anillo grueso) |

Reglas:

- Radio de borde siempre `0`.
- Sin sombras con blur. La única sombra de elevación prevista es dura
  (`--w95-shadow-hard: 2px 2px 0`), y no se usa actualmente.
- El foco es `1px dotted` con offset negativo; nunca un anillo moderno.

## 4. Tipografía

| Token | Valor |
| --- | --- |
| `--w95-font-ui` | `"W95FA", "Tahoma", "MS Sans Serif", "Segoe UI", sans-serif` |
| `--w95-font-mono` | `"Lucida Console", "Courier New", monospace` |
| `--w95-text-ui` / `--w95-leading-ui` | `11px` / `13px` |
| `--w95-text-body` / `--w95-leading-body` | `12px` / `16px` |

- W95FA es una recreación libre de la fuente de interfaz clásica,
  distribuida bajo **SIL Open Font License 1.1**. El archivo de licencia está
  en `packages/ui/src/styles/fonts/W95FA-OFL.txt`.
- `-webkit-font-smoothing: none` y `-moz-osx-font-smoothing: grayscale` para
  preservar el aspecto de mapa de bits.
- El peso bold es sintético porque W95FA solo distribuye un peso. Es una
  concesión consciente; se revisará si aparece una bold libre compatible.
- No se usan fuentes ni iconos originales de terceros.

## 5. Geometría y espaciado

| Elemento | Escritorio | Móvil |
| --- | --- | --- |
| Barra de título | `18px` | `28px` |
| Botones de título | `16×14px` | `24×24px` |
| Ventana, padding interior | `3px` | `3px` |
| Window body, margen | `8px` | `8px` |
| Botón `sm` | `21px` alto | `24px` |
| Botón `md` | `23px` alto | `24px` |
| Botón `lg` | `27px` alto | `27px` |
| Input | `21px` alto | `24px` |
| Menú | `20px` alto | `26px` |
| Barra de tareas | `28px` | `32px` |
| Ítem de menú Inicio | `24px` | `24px` |

El sistema macro usa múltiplos de **4px** (Tailwind). La interfaz clásica
necesita medios pasos de **1–2px** para biseles, alturas de control y
separadores. Esa excepción es parte del lenguaje visual, no una inconsistencia.

## 6. Temas

Temas disponibles en tokens:

- `classic` (implícito, sin atributo): clásico plano.
- `gradient`: degradado azul en la barra activa y gris claro en la inactiva.
- `high-contrast`: fondo negro, texto blanco, acentos amarillos, `color-scheme: dark`.
- `desert`, `rose`, `storm`: paletas originales inspiradas en esquemas de la época.

Para crear un tema:

```css
[data-theme="mi-tema"] {
  --w95-surface: #d8d0c0;
  --w95-surface-sunken: #fffdf5;
  --w95-text: #181410;
  --w95-text-muted: #4a4030;
  --w95-highlight: #fffdf5;
  --w95-light: #eee6d8;
  --w95-shadow: #8a806c;
  --w95-dark: #2a241a;
  --w95-window-frame: #2a241a;
  --w95-accent: #5c3a00;
  --w95-selection: #5c3a00;
  --w95-desktop: #6b5a3c;
  --w95-titlebar-from: #5c3a00;
  --w95-titlebar-to: #5c3a00;
}
```

Aplícalo en cualquier ancestro:

```html
<html data-theme="mi-tema">
```

Los tokens de bisel se recalculan solos porque referencian las variables
semánticas. No hay que redefinir `box-shadow`.

<img src="assets/docs-home.png" alt="Tema clásico en la documentación" width="720">
<img src="assets/theme-gradient.png" alt="Tema Gradiente" width="720">
<img src="assets/theme-high-contrast.png" alt="Tema de alto contraste" width="720">
<img src="assets/docs-mobile.png" alt="Vista móvil a 390 px" width="320">

## 7. Contraste y accesibilidad

- Texto principal `#000` sobre `#C0C0C0`: **11.6:1** (AAA).
- Texto secundario `#404040` sobre `#C0C0C0`: **~5.7:1** (AA).
- Texto blanco sobre azul `#000080`: **~16:1** (AAA).
- Texto deshabilitado `#808080` sobre `#C0C0C0` no cumple AA; es aceptable
  porque está deshabilitado, pero no se usa para información necesaria.
- La barra de título inactiva usa `#606060 → #707070` con texto blanco: el
  extremo claro queda en 4.95:1. La referencia usaba un gris más claro, pero el
  texto no habría cumplido AA.
- El tema `high-contrast` lleva los pares principales a blanco/negro y
  amarillo/negro.
- El foco punteado se mantiene visible en todos los temas; el offset negativo
  evita que se recorte en contenedores con `overflow: hidden`.
- En móvil, los controles suben a 24px de alto. En escritorio se conserva la
  densidad original.
