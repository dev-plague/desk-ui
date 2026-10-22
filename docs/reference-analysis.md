# Análisis de referencias visuales

Fuente: las seis imágenes de `references/`. La intención es extraer el
lenguaje visual, no copiar assets ni marcas.

## 1. Lectura imagen por imagen

### `1470076290Instagram_posts.webp` — Instagram.exe

- Escritorio verde azulado plano (`#008080`), sin patrón ni degradado.
- Ventana centrada con marco de 2 px, título azul oscuro y texto blanco en
  negrita.
- Barra de menú inmediatamente debajo del título, con letras de acceso
  subrayadas.
- Botones `Back` / `Reload` de ancho generoso y altura compacta, con bisel de
  2 px. `Video` actúa como título de sección, no como botón.
- Área de contenido hundida con borde de 2 px y scrollbar vertical de 16 px
  con botones de flecha en los extremos.
- Fila inferior de acciones (`Like`, `Comment`, `Share`) y una barra de iconos
  segmentada, cada segmento con bisel independiente.
- La densidad es alta pero regular: todo se alinea a una rejilla de 4 px.

### `45e1ea3a127f00ee00b20bdcbd657407.jpg` — escritorio saturado

- Múltiples ventanas superpuestas, sin sombras difusas; la separación se logra
  con el marco negro de 1 px y el bisel.
- Toolbars de iconos de 16 px en botones de ~22 px, con estado hundido para la
  herramienta activa.
- Paletas de color de 16/256 colores, listas y barras de estado segmentadas.
- Iconos de 16, 32 y 48 px con contorno negro, pocos colores planos y
  highlight en el borde superior izquierdo.
- La barra de título inactiva es gris, no azul.
- El escritorio puede contener muchos elementos, pero cada ventana conserva
  exactamente el mismo vocabulario de bordes.

### `5gg9k6gq20if1.png` — Apagar el sistema

- Diálogo modal de ~760 px con cuerpo gris y título azul plano.
- Radios de 12 px con etiqueta a la derecha. El foco se marca con un rectángulo
  punteado alrededor del texto, no con un anillo.
- Tres botones inferiores con ancho similar, texto centrado y bisel de 2 px.
- El botón con foco conserva el bisel elevado y añade el punteado interior.
- Icono de error de 32 px (círculo rojo con X) alineado ópticamente con el
  texto, no con la primera línea de forma estricta.
- Barra de tareas de ~28 px, botón Inicio elevado, botón de ventana hundido y
  reloj en un campo hundido a la derecha.
- El espacio entre el borde de la ventana y el contenido es de ~8 px.

### `aca8c51f811d20bab562e9d13debe9d5.jpg` — Gradiente

- Pestañas de propiedades con esquinas prácticamente rectas; la pestaña activa
  se funde con el panel y tapa el borde superior.
- Group boxes con línea grabada de 1 px y leyenda sobre el borde.
- List boxes blancas con borde hundido de 2 px; selección azul con texto blanco.
- Barra de título con degradado azul → azul claro en la ventana activa y gris
  claro en la inactiva.
- Menú Inicio con banner vertical azul, ítems de 24 px y submenús en cascada.
- La barra de tareas usa un borde superior claro y un campo de reloj hundido.

### `c95acb57cb897b3d0fc4f7a39136bf84.jpg` — collage de iconos y controles

- Los iconos son la principal fuente de color: amarillos, azules, verdes y
  rojos saturados sobre gris.
- El contorno negro de 1 px es constante; los brillos son blancos puros y las
  sombras gris medio.
- Los botones de toolbar miden ~22 px y muestran el icono de 16 px centrado.
- Los sliders tienen un thumb alargado de ~11×21 px, no circular.
- Las barras de progreso y los controles usan segmentos duros, sin transiciones.

### `images.jpeg` — Explorer y menú Inicio

- Menú Inicio clásico: banner vertical, ítems con icono de 16 px, separadores
  de 2 px y selección azul.
- Submenú en cascada alineado al ítem padre, con flecha triangular a la derecha.
- Ventana de explorador con árbol, lista blanca hundida y barra de estado de
  tres campos.
- Título de ventana truncado, controles a la derecha; la ventana inactiva al
  fondo pierde el azul.
- La barra de tareas es una superficie continua con botones elevados y un
  campo de reloj hundido.

## 2. Traducción a tokens

| Rasgo observado | Token / decisión |
| --- | --- |
| Escritorio verde azulado | `--w95-desktop: #008080` |
| Superficie gris clásica | `--w95-surface: #C0C0C0` |
| Blanco de campos y highlights | `--w95-surface-sunken`, `--w95-highlight` |
| Gris medio de sombras | `--w95-shadow: #808080` |
| Negro de marco | `--w95-window-frame`, `--w95-dark` |
| Azul de título clásico | `--w95-accent`, `--w95-titlebar-from` |
| Degradado Gradiente | tema `[data-theme="gradient"]` |
| Selección azul/blanco | `--w95-selection`, `--w95-selection-text` |
| Bisel de 2 px | recetas `--w95-bevel-*` |
| Radio cero | `--w95-radius: 0` |
| Texto de 11 px | `--w95-text-ui` |
| Título bold 11 px | `Window.TitleBar` |
| Control de 16×14 | `--w95-control-width/height` |
| Ventana con padding 3 px | clase base de `Window` |
| Cuerpo con margen 8 px | `Window.Body` con `padded` |
| Barra de tareas 28 px | demo `Taskbar` |
| Foco punteado | utilidad `focus-dotted` |

## 3. Proporciones clave

- **Ventana:** marco exterior 1 px + bisel interior 1 px; padding interior 3 px.
- **Título:** 18–20 px de alto, icono de 16 px, texto bold de 11 px, controles
  de 16×14 px separados por 2 px.
- **Menú:** 20 px de alto, ítems con 8 px de padding horizontal.
- **Botón:** 21–23 px de alto, mínimo 75 px de ancho, padding 12 px.
- **Input:** 21 px de alto, padding 3×4 px, borde hundido de 2 px.
- **Group box:** línea de 1 px, leyenda con padding de 4 px.
- **Status bar:** campos de 2 px de alto útil, separados por 1 px.
- **Scrollbar:** 16 px de ancho, thumb con bisel y flechas de 16×17 px.
- **Densidad:** rejilla macro de 4 px; ajustes de 1–2 px para bordes y controles.

## 4. Decisiones deliberadas frente a la referencia

| Tema | Referencia | Implementación | Motivo |
| --- | --- | --- | --- |
| Título | Plano en Clásico, degradado en Gradiente | Base plana; degradado como tema | Fidelidad a la base y flexibilidad |
| Texto secundario | `#808080` sobre gris | `#404040` | Contraste AA |
| Altura táctil | 21–23 px | 24 px en móvil | WCAG 2.2 / uso real |
| Foco | Punteado solo a veces | Siempre visible | Navegación por teclado |
| Hover | Poco frecuente | Hover azul en menús y enlaces | Descubribilidad moderna |
| Título inactivo | Gris claro con texto casi blanco | Gris más oscuro con texto blanco | Contraste AA |
| Iconos | Assets originales | SVG propios 16×16 | Licencia y control |
| Fuente | MS Sans Serif | W95FA (SIL OFL) | Sin assets propietarios de terceros |
| Sombras | Sin blur | Sin blur; sombra dura solo si hace falta | Coherencia |
| Animación | Instantánea | `transition-none`; pasos en Fase 2 | Fidelidad |

## 5. Decisiones confirmadas

1. **Título clásico plano** por defecto; el degradado del tema Gradiente es una variante.
2. **Documentación en español**.
3. **Vite + router por hash** por ahora; Next.js queda como opción futura si el
   SEO pasa a ser prioritario.
4. **Nombre `deskui`** para el CLI y scope `@deskui/*` para los paquetes.
5. **Fase 1 empieza por el CLI y los formularios** para validar copy & own
   antes de ampliar el catálogo. Ya están `init/add/list`, Label, Checkbox,
   Textarea y Dialog; el siguiente corte continúa con el resto de formularios.
