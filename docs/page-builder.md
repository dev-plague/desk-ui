# Page Builder — guía técnica

> **Estado:** MVP de la Fase 3 completado (2026-10-21). Editor visual dentro del
> sitio de documentación, no un item del registry. Ruta: `#/constructor`.

## 1. Qué resuelve

El Page Builder permite componer una página con bloques de la librería,
previsualizarla en tres tamaños, cambiar su tema y exportar el resultado como
JSX, JSON y el comando del CLI. El objetivo es cerrar el círculo *copy & own*:
lo que se compone en el navegador se puede reproducir en un proyecto nuevo sin
escribir el markup a mano.

Cubre los requisitos `RQ-050` a `RQ-056`:

- Paleta, lienzo, propiedades y árbol de capas.
- Añadir, seleccionar, mover, reordenar, duplicar y eliminar.
- Plantillas iniciales.
- Selector de tema en vivo.
- Exportación JSX/JSON y comandos `add`.
- Guardado local y compartición por JSON.
- Preview responsive móvil, tablet y escritorio.

## 2. Acceso y flujo

- Ruta: `http://127.0.0.1:5173/#/constructor`.
- También se llega desde el sidebar (Proyecto → Constructor), el menú Inicio, el
  menú Archivo/Ver del shell y la portada.
- La ruta se carga con `React.lazy`; el shell oculta el sidebar para dar más
  espacio al lienzo.
- En escritorio el editor ocupa toda la altura: la paleta usa dos columnas sin
  scroll permanente, y el lienzo y el inspector aprovechan el alto disponible.

Flujo recomendado:

1. Elegir una plantilla o empezar en blanco.
2. Añadir bloques desde la paleta. Si hay un contenedor seleccionado, el bloque
   entra dentro; si no, se inserta después del bloque seleccionado o al final.
3. Editar propiedades en la pestaña **Propiedades**.
4. Reordenar en **Capas**, con Subir/Bajar o arrastrando.
5. Cambiar el tema y el tamaño de previsualización.
6. Exportar JSX, JSON o los comandos del CLI.
7. Importar un JSON para compartir o recuperar una página.

## 3. Bloques

Hay 20 bloques en cinco categorías. Cinco son contenedores.

| Categoría | Bloques |
| --- | --- |
| Texto y medios | `heading`, `text`, `list`, `badge`, `button`, `image`, `divider`, `spacer` |
| Formularios | `input`, `textarea`, `checkbox`, `progress` |
| Contenedores | `card`, `panel`, `window`, `group-box`, `columns` |
| Feedback | `alert` |
| Composición | `hero`, `status-bar` |

Los contenedores (`card`, `panel`, `window`, `group-box`, `columns`) aceptan
hijos y se pueden usar como destino de arrastre. Un contenedor vacío muestra una
zona punteada con una pista, nunca un hueco invisible.

Cada bloque declara en `catalog.ts`:

- `label`, `description`, categoría e icono.
- `defaults` y campos editables (`text`, `textarea`, `number`, `select`,
  `checkbox`).
- `summary`, el texto corto que aparece en Capas y en la etiqueta accesible.

La paleta, el panel de propiedades, el renderer y el exportador consumen el mismo
catálogo. Añadir un bloque exige tocar el catálogo, el renderer y el exportador;
los tests de exportación ayudan a detectar olvidos.

## 4. Modelo JSON

El documento es JSON puro, sin referencias al DOM ni a React. Versión actual:
`1`.

```json
{
  "version": 1,
  "title": "Página personal",
  "theme": "classic",
  "background": "surface",
  "blocks": [
    {
      "id": "block-2",
      "type": "hero",
      "props": {
        "eyebrow": "Portafolio",
        "title": "Hola, soy Ada",
        "description": "Diseño interfaces retro.",
        "buttonLabel": "Contactar",
        "buttonVariant": "primary",
        "align": "left"
      }
    },
    {
      "id": "block-3",
      "type": "card",
      "props": { "title": "Sobre mí", "description": "Biografía breve." },
      "children": [
        {
          "id": "block-4",
          "type": "text",
          "props": { "text": "Texto de ejemplo.", "align": "left", "muted": false }
        }
      ]
    }
  ]
}
```

- `theme` acepta los seis temas (`classic`, `gradient`, `high-contrast`, `desert`,
  `rose`, `storm`) y se aplica con `data-theme` en el contenedor de preview.
- `background` acepta `surface`, `sunken` y `desktop`.
- Los ids se conservan al guardar; si un JSON trae duplicados, se regeneran.
- Los contenedores llevan `children`; los bloques hoja no.

### Validación

`parseBuilderDocument` y `normalizeDocument`:

- Exigen `version: 1` y una lista de bloques.
- Rechazan tipos de bloque desconocidos.
- Copian solo las props declaradas por el catálogo; las claves arbitrarias se
  descartan.
- Validan los valores de `select`, los booleanos y los números.
- Limitan el texto a 10 000 caracteres, el título a 120, la profundidad a 8
  niveles y el total a 200 bloques.
- Sustituyen ids vacíos o duplicados.

Un JSON inválido en `localStorage` no bloquea el editor: se descarta y se empieza
de cero. Un JSON inválido en el diálogo de importación muestra el error y deja el
diálogo abierto para corregirlo.

## 5. Operaciones del árbol

`model.ts` implementa operaciones inmutables sobre `blocks`:

| Función | Efecto |
| --- | --- |
| `insertBlock` | Inserta antes, después o dentro de un contenedor. |
| `moveBlock` | Mueve un bloque y rechaza ciclos (dentro de sí mismo o de un descendiente). |
| `moveBlockWithinParent` | Sube/baja entre hermanos. |
| `moveBlockToRootEnd` | Mueve al final de la página. |
| `duplicateBlock` | Clona el bloque y sus hijos con ids nuevos. |
| `removeBlock` | Elimina un bloque y su subárbol. |
| `updateBlockProps` | Fusiona y sanea props. |
| `findBlock`, `getBlockPath` | Localizan el bloque, su padre y su ruta. |

El estado del editor es el documento completo. No se guarda un historial de
undo/redo en el MVP.

## 6. Plantillas

`templates.ts` incluye seis entradas:

| Id | Nombre | Contenido |
| --- | --- | --- |
| `blank` | Página en blanco | Lienzo vacío. |
| `escritorio` | Escritorio | Ventana, tarjetas, lista, progreso y aviso. |
| `formulario` | Formulario | Group box, campos, botones, aviso y barra de estado. |
| `tienda` | Tienda | Hero, tres productos, aviso y barra de estado. |
| `red-social` | Red social | Ventana con composer, feed y aviso. |
| `pagina-personal` | Página personal | Hero, biografía, proyectos, aviso y estado. |

Las plantillas se crean con `createBlock`, así que pasan por el mismo saneado y
por los mismos defaults que un bloque añadido a mano. Los tests serializan cada
plantilla, la vuelven a parsear y comprueban que los ids son únicos.

## 7. Tema y preview responsive

- El tema del documento se aplica con `data-theme` en `[data-builder-page]`. Los
  tokens CSS se resuelven en ese subárbol, así que el editor puede tener un tema
  distinto al del sitio.
- El tema forma parte del JSON y del JSX exportado.
- Tamaños de preview: móvil 390 px, tablet 768 px y escritorio 100 %.
- El lienzo tiene scroll horizontal si el tamaño elegido no cabe en el viewport.
- El fondo de la página se elige entre gris clásico, blanco y escritorio teal.

## 8. Exportación

### JSX

`generateJsx` recorre el árbol y genera un componente `PaginaGenerada` con
imports por archivo, como en un proyecto que usa el CLI:

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PaginaGenerada() {
  return (
    <main data-theme="classic" className="w95-ui min-h-dvh bg-surface p-4 text-ink sm:p-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
        {/* bloques */}
      </div>
    </main>
  );
}
```

- Solo se importan los componentes que el árbol usa de verdad.
- El texto y los atributos se escapan (`<`, `>`, `&`, `{`, `}`, `"`).
- Las listas se convierten en `<ul>`/`<ol>` con un `<li>` por línea.
- Los campos usan ids derivados del id del bloque para que `Label`/`Input`
  sigan asociados.
- `ProgressBar` incluye `aria-label` con la etiqueta visible.
- Los contenedores conservan su estructura (`CardHeader`, `PanelBody`,
  `Window.TitleBar`, etc.).

### JSON

Es el mismo documento, con indentación. Sirve para guardar, versionar, compartir
o volver a importar.

### Comandos

`generateAddCommands` recoge los items del registry usados y genera:

```bash
npx @deskui/cli init
npx @deskui/cli add alert badge button card status-bar
```

El CLI resuelve las dependencias (`label`, `title-bar`, `status-bar`, `utils`…).
Una página que solo usa HTML y utilidades de Tailwind produce únicamente el
comando `init`.

## 9. Guardado y compartición

- Clave de `localStorage`: `deskui-builder-document-v1`.
- Autoguardado con debounce de 400 ms.
- La barra de herramientas muestra `Guardando...`, `Guardado HH:MM` o
  `No se pudo guardar` con `role="status"` y `aria-live="polite"`.
- `Ctrl/Cmd + S` fuerza un guardado inmediato y muestra un toast.
- **Compartir:** exportar el JSON y pegarlo en Importar en otro navegador. No hay
  backend ni enlaces con el documento incrustado en el MVP.
- **Nueva página** pide confirmación y limpia el documento; el autoguardado
  escribe el lienzo vacío.

## 10. Atajos de teclado

| Atajo | Acción |
| --- | --- |
| `Ctrl/Cmd + D` | Duplicar el bloque seleccionado. |
| `Supr` / `Backspace` | Eliminar el bloque seleccionado. |
| `Alt + ↑` / `Alt + ↓` | Mover entre hermanos. |
| `Ctrl/Cmd + S` | Guardar ahora. |
| `Escape` | Quitar la selección. |

Los atajos se ignoran cuando el foco está en un control editable o en un botón,
para no interferir con formularios. En Capas, las flechas recorren el árbol,
`←`/`→` contraen/expanden, `Home`/`End` saltan al extremo y `Enter`/`Espacio`
seleccionan.

## 11. Arrastrar y soltar

- Paleta → lienzo: crea un bloque al final de la página.
- Paleta → contenedor: el bloque entra dentro (el destino se decide en el árbol).
- Capas: arrastrar una fila sobre otra inserta antes, después o dentro según la
  posición vertical; el centro de un contenedor indica “dentro”.
- Alternativas de teclado: Subir/Bajar en Propiedades y en la barra de
  herramientas, más `Alt + ↑/↓`.
- El arrastre usa HTML5 DnD nativo y un MIME propio
  (`application/x-deskui-builder`). No hay dependencia externa.
- En Playwright, el DnD nativo de Chromium sin interfaz no siempre emite `drop`;
  el test E2E despacha `DragEvent` con un `DataTransfer` real para validar los
  handlers.

## 12. Accesibilidad

- La paleta es un `aside` con secciones y botones con nombre accesible.
- Cada bloque del lienzo es un `group` focusable con `aria-label`
  (`Tipo: resumen`); Enter/Espacio lo seleccionan. El árbol de capas es la ruta
  principal de teclado.
- El árbol usa `role="tree"`, `treeitem`, `aria-level`, `aria-selected` y
  `aria-expanded`; los contenedores exponen un botón `+`/`−` con nombre.
- El panel de propiedades usa `Label` + `htmlFor` y `aria-describedby` para las
  ayudas.
- Los diálogos usan el `Dialog` nativo de la librería (foco atrapado, Escape y
  retorno de foco).
- `ProgressBar` recibe `aria-label`; las plantillas incluyen encabezados `h2`
  antes de las tarjetas `h3` para no saltar niveles.
- axe no detecta violaciones en el constructor vacío, con la plantilla
  Escritorio y con la pestaña Capas.

## 13. Estructura

```text
apps/docs/src/
├── lib/builder/
│   ├── types.ts        # Tipos, categorías, payload de DnD
│   ├── catalog.ts      # Los 20 bloques, defaults, campos y resumen
│   ├── model.ts        # Árbol inmutable, saneado, parseo y límites
│   ├── templates.ts    # Seis plantillas
│   ├── export.ts       # JSX, JSON y comandos del CLI
│   ├── storage.ts      # localStorage seguro
│   └── *.test.ts       # 39 tests unitarios
├── components/builder/
│   ├── palette.tsx     # Paleta de bloques
│   ├── canvas.tsx      # Lienzo, preview y drop
│   ├── blocks.tsx      # Renderer recursivo con selección
│   ├── layers.tsx      # Árbol de capas accesible y DnD
│   ├── properties.tsx  # Propiedades del bloque y de la página
│   └── dialogs.tsx     # Plantillas, exportar, importar, ayuda, nueva página
└── pages/builder.tsx   # Estado, acciones, atajos y composición
```

El Page Builder **no** forma parte de `packages/ui` ni del registry. Es una
herramienta del sitio que consume la librería como cualquier consumidor. Si en el
futuro se publica como paquete independiente, el modelo de `lib/builder` se puede
extraer sin tocar el DOM.

## 14. Tests

- **39 tests unitarios** en `apps/docs/src/lib/builder`: modelo, plantillas,
  exportación, almacenamiento y payload de DnD.
- **6 tests E2E funcionales** nuevos: añadir/editar/duplicar/reordenar/eliminar,
  plantillas y tema/preview, exportación, persistencia/importación, DnD y axe con
  plantilla.
- **Regresión visual:** `constructor-escritorio.png`.
- axe: la ruta `/constructor` se suma a las rutas principales; además se prueba
  el constructor con la plantilla Escritorio y la pestaña Capas.

Comandos:

```bash
pnpm typecheck
pnpm test            # UI + CLI + docs
pnpm test:e2e
pnpm build
```

## 15. Limitaciones y siguientes pasos

- **Undo/redo y multiselección:** pendientes (post-MVP del roadmap).
- **Persistencia remota y enlaces compartibles:** pendientes; hoy el intercambio
  es JSON.
- **Exportación a Next.js, Astro o HTML estático:** pendiente.
- **Plugins o bloques de usuario:** pendiente.
- **El modelo no versiona migraciones:** si cambia el esquema, hay que subir
  `version` y añadir una migración en `normalizeDocument`.
- **El renderer y el exportador son dos implementaciones:** el catálogo y los
  tests de exportación reducen la deriva, pero un bloque nuevo exige tocar
  ambos.

## 16. Enlaces

- [Roadmap](roadmap.md)
- [Progreso](PROGRESS.md)
- [Requisitos](REQUIREMENTS.md)
- [Decisiones](DECISIONS.md)
- [Arquitectura](architecture.md)
- [Componentes](components.md)
