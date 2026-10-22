# Prompt: Librería de componentes DeskUI (estilo Shadcn)

## 1. Rol y objetivo

Actúa como un **Senior Frontend Engineer y Design Systems Architect**. Vas a ayudarme a diseñar y construir una **librería de componentes UI con estética clásica**, siguiendo la filosofía de **shadcn/ui**: el código de los componentes se copia al proyecto del usuario (no es una dependencia opaca), cada componente se instala de forma individual y el desarrollador tiene control total para modificarlo.

El resultado debe permitir crear aplicaciones web **armónicas, coherentes y visualmente atractivas** con un look nostálgico auténtico, sin que se sientan como una parodia o un conjunto de piezas sueltas.

---

## 2. Filosofía y principios de la librería

- **Copy & own:** los componentes se añaden al proyecto del usuario mediante un CLI (`npx <nombre-libreria> add button`), usando el formato de *registry* compatible con shadcn.
- **Instalación individual:** cada componente declara sus propias dependencias y las de otros componentes de la librería (por ejemplo, `dialog` depende de `button` y `window`).
- **Amigable con el desarrollador:** API predecible, props tipadas, composición mediante subcomponentes (`Window`, `Window.TitleBar`, `Window.Body`), `className` siempre expuesto y documentación con ejemplos copiables.
- **Accesible por defecto:** navegación por teclado, roles ARIA, foco visible y manejo correcto de estados. Se recomienda apoyarse en primitivas sin estilos (p. ej. Radix UI o React Aria) y estilizarlas con la estética retro.
- **Tematizable mediante tokens:** todo el estilo se controla con variables CSS y configuración de Tailwind, nunca con valores hardcodeados dentro de los componentes.
- **Responsive:** los componentes deben funcionar bien en móvil, tablet y escritorio, adaptando la estética retro sin romper la usabilidad (áreas táctiles mínimas, ventanas que se convierten en paneles a pantalla completa en pantallas pequeñas).

---

## 3. Stack técnico propuesto

> Si consideras que alguna decisión debe cambiar, justifícalo antes de continuar.

| Área | Propuesta |
|---|---|
| Framework de componentes | React + TypeScript |
| Estilos | Tailwind CSS (v4 con `@theme`, o v3 con preset si es necesario) |
| Variantes | `class-variance-authority` + `tailwind-merge` + `clsx` |
| Primitivas accesibles | Radix UI o React Aria |
| Sitio de documentación | Next.js (App Router) o Vite + MDX |
| Distribución | Registry JSON compatible con shadcn + CLI propio |
| Monorepo | pnpm workspaces (`/packages/ui`, `/packages/cli`, `/apps/docs`) |

---

## 4. Identidad visual: "escritorio clásico"

Recrear fielmente el lenguaje visual de la época. Definir todo como **design tokens**.

### 4.1 Color
- Gris de superficie clásico (`#C0C0C0`), blanco y gris oscuro (`#808080`, `#404040`) para bordes.
- Azul de barra de título activa (`#000080`) con degradado opcional hacia `#1084D0`; barra inactiva en gris.
- Verde azulado del escritorio (`#008080`) como fondo de página por defecto.
- Selección en azul oscuro con texto blanco.
- Colores semánticos (éxito, advertencia, error, info) adaptados a la paleta de 16/256 colores.

### 4.2 Formas y bordes
- **Sin bordes redondeados** (`border-radius: 0`).
- Efecto **biselado (bevel)**: bordes claros arriba/izquierda y oscuros abajo/derecha para elementos elevados; invertidos para elementos hundidos (inputs, áreas de contenido).
- Foco con línea punteada de 1px, como en el sistema original.
- Sombras duras y planas, sin blur.

### 4.3 Tipografía e iconografía
- Fuente tipo **MS Sans Serif / Tahoma pixelada** (o alternativa libre como *Pixelated MS Sans Serif*), con `font-smoothing` desactivado donde sea posible.
- Tamaños pequeños y compactos (11–12px base), con escalas bien definidas.
- Iconos pixel-art de 16×16 y 32×32 (carpeta, documento, papelera, disquete, ordenador, mundo, advertencia, error, información, etc.) o un set compatible; definir cómo se integran y se instalan.

### 4.4 Interacción
- Estados `hover`, `active` (hundido), `focus`, `disabled` (texto con relieve "grabado") claramente definidos.
- Cursores clásicos opcionales (flecha, reloj de arena, mano).
- Sonidos de sistema **opcionales** y desactivados por defecto.
- Animaciones mínimas y escalonadas (estilo "steps") para mantener la fidelidad retro.

### 4.5 Temas
- Tema base: **Clásico**.
- Arquitectura preparada para temas alternativos mediante variables CSS (por ejemplo: *Gradiente*, *High Contrast*, *Desert*, *Rose*, *Storm*, como los esquemas de color del sistema original) y modo oscuro retro opcional.
- Documentar cómo crear un tema propio paso a paso.

> **Referencias visuales:** adjuntaré imágenes de referencia. Úsalas como fuente principal de verdad para colores, proporciones, grosor de bordes y detalles de cada componente. Si algo en el texto contradice las imágenes, prevalecen las imágenes. *(Si no están adjuntas, pídelas antes de definir los tokens finales.)*

---

## 5. Catálogo de componentes

### 5.1 Fase 1: componentes base (MVP)
Priorizar los más usados en la web:

- **Acciones:** Button (variantes: default, primary/default-button con borde grueso, icon, toggle), Toggle Group
- **Formularios:** Input, Textarea, Checkbox, Radio Group, Select / Dropdown, Switch (estilo checkbox retro), Slider, Label, Form (integración con React Hook Form + Zod)
- **Contenedores:** Window, Panel / Group Box (fieldset con leyenda), Card, Separator, Scroll Area, Tabs (estilo pestañas de propiedades)
- **Navegación:** Menu Bar, Dropdown Menu, Context Menu, Breadcrumb, Tree View (explorador), Pagination
- **Feedback:** Dialog / Message Box (con iconos de error, aviso, info, pregunta), Alert, Toast (estilo notificación de bandeja), Progress Bar (bloques azules), Tooltip, Badge
- **Datos:** Table, List Box, Status Bar
- **Utilidades:** Icon, Title Bar (minimizar, maximizar, cerrar), Taskbar

### 5.2 Fase 2: componentes icónicos de la época
- **Desktop** (escritorio con iconos seleccionables y arrastrables)
- **Taskbar + Start Menu** (con submenús en cascada y bandeja del sistema con reloj)
- **Window Manager** (ventanas arrastrables, redimensionables, con foco, z-index y minimizar/maximizar/restaurar)
- **File Explorer** (vista de iconos, lista y detalles)
- **Wizard / Asistente** (pasos con botones Atrás / Siguiente / Cancelar)
- **Properties Dialog** (diálogo con pestañas)
- **Notepad / Editor de texto simple**
- **Terminal estilo MS-DOS**
- **Blue Screen of Death** (componente de error/404 divertido)
- **Screensaver** (por ejemplo, tuberías o texto flotante, opcional)
- **Minijuego** opcional (como Buscaminas) para demostrar interactividad

Cada componente debe incluir: descripción, variantes, props tipadas, estados, notas de accesibilidad y ejemplos de uso.

---

## 6. Sitio web de documentación

Construir un sitio de documentación que **use la propia librería** (dogfooding) y tenga:

1. **Home / Landing** con presentación de la librería, filosofía y demo interactiva.
2. **Getting Started:** instalación, configuración de Tailwind, inicialización con CLI (`init`) y primer componente.
3. **Theming:** tokens, creación de temas, modo oscuro, personalización de iconos y fuentes.
4. **Componentes:** una página por componente con:
   - Vista previa en vivo
   - Pestañas *Preview / Code*
   - Botón de copiar código y comando de instalación (`npx ... add <componente>`)
   - Tabla de props
   - Variantes, estados y ejemplos
   - Notas de accesibilidad
5. **Buscador** de componentes y navegación lateral estilo explorador de archivos.
6. **Showcase / Ejemplos** *(ver sección 7)*.
7. **Page Builder** *(ver sección 8)*.
8. **Changelog y guía de contribución.**

La propia web debe verse como un escritorio clásico (ventanas, barra de tareas, menú inicio) **sin sacrificar la legibilidad ni la navegación**, y ser plenamente responsive.

---

## 7. Sección "Showcase": páginas de ejemplo

Una sección que simule **capturas/vistas reales de aplicaciones** construidas solo con los componentes de la librería, para demostrar que se pueden crear interfaces completas y coherentes:

- **Tienda online retro** (catálogo con tarjetas de producto, filtros, carrito como ventana, checkout con asistente, reseñas).
- **Red social retro** (feed, perfil, publicaciones con comentarios, mensajería estilo chat, notificaciones).
- *(Opcional)* Dashboard administrativo, blog o portafolio personal.

Requisitos:
- Navegables como páginas independientes y con datos mock.
- Código fuente visible y reutilizable.
- Responsive y accesibles.
- Deben transmitir **armonía visual**: espaciado consistente, jerarquía clara, uso coherente de color y tipografía.

---

## 8. Page Builder: creación de nuevas páginas por los usuarios

Permitir que los usuarios **compongan sus propias páginas** con los componentes icónicos de la época:

- Editor visual con **paleta de componentes**, lienzo, panel de propiedades y árbol de capas.
- Arrastrar y soltar, reordenar, duplicar y eliminar.
- **Plantillas** iniciales (escritorio, página personal estilo GeoCities, formulario, tienda, red social).
- **Selector de temas** en vivo.
- **Exportación:** código React/JSX listo para copiar, y/o JSON del diseño, con la lista de comandos `add` necesarios.
- Guardado local (localStorage o similar) y opción de compartir mediante enlace/JSON.
- Vista previa responsive (móvil / tablet / escritorio).

> Si el alcance es demasiado grande, propón una versión mínima viable del builder y define qué queda para fases posteriores.

---

## 9. Criterios de calidad: armonía y atractivo visual

Para garantizar que las aplicaciones resultantes sean armónicas y atractivas:

- **Sistema de espaciado** y rejilla consistentes basados en un múltiplo base (por ejemplo, 4px).
- **Jerarquía visual** clara: títulos, grupos, acciones primarias y secundarias.
- **Guías de composición** documentadas (cómo combinar ventanas, paneles, barras y diálogos).
- **Paleta restringida** y uso semántico del color.
- **Consistencia** entre componentes: mismos bordes, estados, tamaños y densidades.
- **Contraste** adecuado (cumplir WCAG AA cuando sea posible, ofreciendo tema de alto contraste).
- **Rendimiento:** bundle ligero, sin dependencias innecesarias, imágenes/iconos optimizados.
- **Tests:** pruebas de componentes (Vitest + Testing Library), pruebas de accesibilidad (axe) y *visual regression* opcional con Storybook/Chromatic o Playwright.
- Sección **"Do & Don't"** en la documentación con buenos y malos ejemplos de uso.

---

## 10. Entregables esperados

1. **Propuesta de arquitectura** (estructura de carpetas, monorepo, flujo del registry y CLI).
2. **Design tokens** completos (colores, bordes, sombras, tipografía, espaciado) en CSS y configuración de Tailwind.
3. **Componentes de la Fase 1**, listos para usar, con tipos y ejemplos.
4. **Sitio de documentación** funcional con la estructura descrita.
5. **Showcase** de tienda y red social.
6. **Prototipo del Page Builder** (o plan detallado si se deja para otra fase).
7. **README** y guía de contribución.
8. **Roadmap** de fases siguientes.

---

## 11. Forma de trabajo

1. Antes de escribir código, **revisa las referencias visuales** y resume qué detalles estéticos identificas (colores, bordes, tipografías, proporciones) para que yo lo valide.
2. Si algo es ambiguo, **haz hasta 5 preguntas** concretas antes de empezar; si no, asume lo razonable, indícalo y continúa.
3. Trabaja **por fases**:
   - Fase 0: arquitectura, tokens y 3 componentes de prueba (Button, Window, Input) para validar el estilo.
   - Fase 1: componentes base + documentación.
   - Fase 2: componentes icónicos + Showcase.
   - Fase 3: Page Builder.
4. Al terminar cada fase, entrega un **resumen de lo hecho, decisiones tomadas y siguientes pasos**.
5. Explica brevemente las decisiones técnicas importantes y señala los compromisos entre fidelidad retro y usabilidad moderna.
6. Código limpio, comentado donde aporte valor, tipado estricto y sin dependencias innecesarias.

---

## 12. Restricciones

- No usar assets propietarios de terceros (iconos, fuentes o sonidos originales). Utilizar recursos propios, de licencia libre o recreaciones originales, indicando siempre la licencia.
- La estética debe ser un **homenaje** reconocible, no una copia literal de marcas o productos.
- Mantener compatibilidad con navegadores modernos.
