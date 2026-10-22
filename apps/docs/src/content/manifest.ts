import { COMPONENT_DOCS_EN } from "../i18n/component-docs.en";
import type { ComponentDocSlug } from "../i18n/component-slugs";
import type { Locale } from "../i18n/provider";

/**
 * Índice ligero del catálogo. Lo consume el shell de documentación, el
 * explorador y el buscador para no cargar las vistas previas ni el código de
 * los componentes en la ruta inicial. Mantener sincronizado con
 * `COMPONENT_DOCS`.
 */

export type ComponentCategory =
  | "acciones"
  | "formularios"
  | "contenedores"
  | "navegacion"
  | "feedback"
  | "datos"
  | "utilidades"
  | "escritorio";

export interface ComponentManifestEntry {
  slug: string;
  title: string;
  description: string;
  install: string;
  category: ComponentCategory;
}

export const COMPONENT_MANIFEST: ComponentManifestEntry[] = [
  {
    slug: "button",
    title: "Button",
    description:
      "Botón biselado clásico con variantes, estado pulsado y foco punteado. El botón primario usa el anillo negro grueso del botón predeterminado.",
    install: "npx @deskui/cli add button",
    category: "acciones",
  },
  {
    slug: "input",
    title: "Input",
    description:
      "Campo de texto hundido con borde de 2 px, selección azul y foco punteado interior. Mantiene todos los atributos nativos de <input>.",
    install: "npx @deskui/cli add input",
    category: "formularios",
  },
  {
    slug: "label",
    title: "Label",
    description:
      "Etiqueta de formulario compacta que conserva la tipografía y la densidad de la interfaz clásica.",
    install: "npx @deskui/cli add label",
    category: "formularios",
  },
  {
    slug: "group-box",
    title: "GroupBox",
    description:
      "Fieldset clásico con la leyenda sobre el borde superior. El fondo de la leyenda enmascara la línea y crea la muesca tradicional.",
    install: "npx @deskui/cli add group-box",
    category: "contenedores",
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description:
      "Checkbox nativo de 13×13 px con check pixelado. El input real sigue siendo accesible por teclado y formularios.",
    install: "npx @deskui/cli add checkbox",
    category: "formularios",
  },
  {
    slug: "textarea",
    title: "Textarea",
    description:
      "Área de texto hundida y redimensionable en vertical, con la misma tipografía y foco que Input.",
    install: "npx @deskui/cli add textarea",
    category: "formularios",
  },
  {
    slug: "window",
    title: "Window",
    description:
      "Ventana componible con TitleBar, Body y StatusBar. Los controles sin manejador se dibujan inertes, nunca como botones rotos.",
    install: "npx @deskui/cli add window",
    category: "contenedores",
  },
  {
    slug: "dialog",
    title: "Dialog",
    description:
      "Diálogo modal construido sobre <dialog> nativo: foco atrapado, Escape, backdrop y retorno de foco sin dependencias externas.",
    install: "npx @deskui/cli add dialog",
    category: "contenedores",
  },
  {
    slug: "radio-group",
    title: "RadioGroup",
    description:
      "Grupo de radios nativos con el círculo biselado clásico de 12 px y un punto de 4 px. Mantiene las flechas del teclado y el comportamiento de formulario.",
    install: "npx @deskui/cli add radio-group",
    category: "formularios",
  },
  {
    slug: "select",
    title: "Select",
    description:
      "Select nativo con campo hundido y botón de flecha elevado. Conserva el comportamiento nativo y evita una dependencia de Radix para un control básico.",
    install: "npx @deskui/cli add select",
    category: "formularios",
  },
  {
    slug: "switch",
    title: "Switch",
    description:
      "Interruptor retro con pista hundida y perilla elevada. Es un botón nativo con role=switch, por lo que Space y Enter funcionan.",
    install: "npx @deskui/cli add switch",
    category: "formularios",
  },
  {
    slug: "slider",
    title: "Slider",
    description:
      "Slider nativo con pista hundida de 4 px y thumb rectangular de 11×21 px, como en los paneles de control de la época.",
    install: "npx @deskui/cli add slider",
    category: "formularios",
  },
  {
    slug: "form",
    title: "Form",
    description:
      "Integración con React Hook Form y Zod. FormField conecta el control, FormControl propaga id/ARIA y FormMessage muestra errores accesibles.",
    install: "npx @deskui/cli add form",
    category: "formularios",
  },
  {
    slug: "tabs",
    title: "Tabs",
    description:
      "Pestañas de propiedades sobre Radix Tabs. La pestaña activa se fusiona con el panel y el teclado navega con las flechas.",
    install: "npx @deskui/cli add tabs",
    category: "contenedores",
  },
  {
    slug: "scroll-area",
    title: "ScrollArea",
    description:
      "Contenedor con scroll nativo y barra clásica de 16 px con flechas, pista tramada y thumb cuadrado. El viewport es focusable para navegación por teclado.",
    install: "npx @deskui/cli add scroll-area",
    category: "contenedores",
  },
  {
    slug: "badge",
    title: "Badge",
    description:
      "Etiqueta biselada compacta con un punto de estado semántico. El texto siempre usa el color de tinta para mantener contraste.",
    install: "npx @deskui/cli add badge",
    category: "feedback",
  },
  {
    slug: "alert",
    title: "Alert",
    description:
      "Aviso con marco de ventana y una franja semántica. Compón el contenido con AlertTitle y AlertDescription.",
    install: "npx @deskui/cli add alert",
    category: "feedback",
  },
  {
    slug: "toast",
    title: "Toast",
    description:
      "Notificaciones de bandeja con un proveedor global, cierre manual y auto-cierre configurable.",
    install: "npx @deskui/cli add toast",
    category: "feedback",
  },
  {
    slug: "progress-bar",
    title: "ProgressBar",
    description:
      "Barra de progreso hundida con bloques azules separados por un píxel, como en los instaladores clásicos.",
    install: "npx @deskui/cli add progress-bar",
    category: "feedback",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    description:
      "Tooltip amarillo clásico sobre Radix Tooltip. Aparece con hover o foco y se cierra con Escape.",
    install: "npx @deskui/cli add tooltip",
    category: "feedback",
  },
  {
    slug: "menu-bar",
    title: "MenuBar",
    description:
      "Barra de menús de ventana sobre Radix Menubar. Soporta teclado, submenús y atajos visuales.",
    install: "npx @deskui/cli add menu-bar",
    category: "navegacion",
  },
  {
    slug: "dropdown-menu",
    title: "DropdownMenu",
    description:
      "Menú desplegable clásico sobre Radix DropdownMenu, con etiquetas, atajos, separadores y acciones deshabilitadas.",
    install: "npx @deskui/cli add dropdown-menu",
    category: "navegacion",
  },
  {
    slug: "context-menu",
    title: "ContextMenu",
    description:
      "Menú contextual sobre Radix. Se abre con clic derecho y comparte el lenguaje visual de MenuBar y DropdownMenu.",
    install: "npx @deskui/cli add context-menu",
    category: "navegacion",
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    description:
      "Migas de pan con enlaces, página actual y separadores clásicos. Útil para la navegación de la documentación o el explorador.",
    install: "npx @deskui/cli add breadcrumb",
    category: "navegacion",
  },
  {
    slug: "tree-view",
    title: "TreeView",
    description:
      "Árbol de explorador con selección, expansión y navegación por teclado. Ideal para réplicas del explorador clásico.",
    install: "npx @deskui/cli add tree-view",
    category: "navegacion",
  },
  {
    slug: "pagination",
    title: "Pagination",
    description:
      "Paginación clásica con botones Anterior/Siguiente, páginas y elipsis. La página actual queda hundida.",
    install: "npx @deskui/cli add pagination",
    category: "navegacion",
  },
  {
    slug: "table",
    title: "Table",
    description:
      "Tabla clásica con cabecera elevada y fija, cuerpo blanco, filas compactas y selección azul.",
    install: "npx @deskui/cli add table",
    category: "datos",
  },
  {
    slug: "list-box",
    title: "ListBox",
    description:
      "List box nativa con varias filas visibles, bisel hundido y selección simple o múltiple.",
    install: "npx @deskui/cli add list-box",
    category: "datos",
  },
  {
    slug: "status-bar",
    title: "StatusBar",
    description:
      "Barra de estado con campos segmentados y el bisel de estado clásico.",
    install: "npx @deskui/cli add status-bar",
    category: "datos",
  },
  {
    slug: "icon",
    title: "Icon",
    description:
      "Set original de iconos pixel-art 16×16, escalables a 32×32, con nombres accesibles opcionales.",
    install: "npx @deskui/cli add icon",
    category: "utilidades",
  },
  {
    slug: "title-bar",
    title: "TitleBar",
    description:
      "Barra de título reutilizable fuera de Window, con icono, controles y estados activo/inactivo.",
    install: "npx @deskui/cli add title-bar",
    category: "utilidades",
  },
  {
    slug: "taskbar",
    title: "Taskbar",
    description:
      "Barra de tareas con botón Inicio, botones de tarea, separador y bandeja del sistema.",
    install: "npx @deskui/cli add taskbar",
    category: "utilidades",
  },
  {
    slug: "panel",
    title: "Panel",
    description:
      "Contenedor clásico con bisel configurable y estructura opcional de cabecera, cuerpo y pie.",
    install: "npx @deskui/cli add panel",
    category: "contenedores",
  },
  {
    slug: "card",
    title: "Card",
    description:
      "Tarjeta elevada para catálogos y showcases, con cabecera, título, descripción, contenido y pie.",
    install: "npx @deskui/cli add card",
    category: "contenedores",
  },
  {
    slug: "separator",
    title: "Separator",
    description:
      "Línea horizontal o vertical con la ranura clásica de sombra y luz, sin imágenes ni bordes redondeados.",
    install: "npx @deskui/cli add separator",
    category: "contenedores",
  },
  {
    slug: "toolbar",
    title: "Toolbar",
    description:
      "Barra de herramientas con grupos, separadores, botones de alternancia y navegación por flechas.",
    install: "npx @deskui/cli add toolbar",
    category: "contenedores",
  },
  {
    slug: "desktop",
    title: "Desktop",
    description:
      "Lienzo de escritorio con iconos seleccionables, apertura por doble clic o Enter y arrastre opcional.",
    install: "npx @deskui/cli add desktop",
    category: "escritorio",
  },
  {
    slug: "start-menu",
    title: "StartMenu",
    description:
      "Menú Inicio con barra lateral, atajos y submenús en cascada sobre Radix DropdownMenu.",
    install: "npx @deskui/cli add start-menu",
    category: "escritorio",
  },
  {
    slug: "window-manager",
    title: "WindowManager",
    description:
      "Gestor de ventanas con arrastre, resize, foco, z-index, minimizar, maximizar/restaurar y cerrar.",
    install: "npx @deskui/cli add window-manager",
    category: "escritorio",
  },
  {
    slug: "file-explorer",
    title: "FileExplorer",
    description:
      "Explorador de archivos con árbol de carpetas, historial, selección y vistas de iconos, lista y detalles.",
    install: "npx @deskui/cli add file-explorer",
    category: "escritorio",
  },
  {
    slug: "wizard",
    title: "Wizard",
    description:
      "Asistente por pasos con indicador de progreso, validación opcional, Atrás/Siguiente, Finalizar y Cancelar.",
    install: "npx @deskui/cli add wizard",
    category: "escritorio",
  },
  {
    slug: "properties-dialog",
    title: "PropertiesDialog",
    description:
      "Diálogo de propiedades con pestañas, botones Aplicar/Cancelar/Aceptar y foco atrapado del Dialog nativo.",
    install: "npx @deskui/cli add properties-dialog",
    category: "escritorio",
  },
  {
    slug: "notepad",
    title: "Notepad",
    description:
      "Editor de texto tipo Bloc de notas con menú Archivo/Edición/Formato, ajuste de línea, atajos y estado.",
    install: "npx @deskui/cli add notepad",
    category: "escritorio",
  },
  {
    slug: "terminal",
    title: "Terminal",
    description:
      "Terminal MS-DOS con comandos internos, comandos personalizados, historial y anuncio accesible de la salida.",
    install: "npx @deskui/cli add terminal",
    category: "escritorio",
  },
  {
    slug: "blue-screen",
    title: "BlueScreen",
    description:
      "Pantalla azul de error clásica con mensaje, código, pista y acción de reinicio.",
    install: "npx @deskui/cli add blue-screen",
    category: "escritorio",
  },
  {
    slug: "screensaver",
    title: "Screensaver",
    description:
      "Salvapantallas con campo de estrellas animado, cierre por clic o teclado y respeto de reduced motion.",
    install: "npx @deskui/cli add screensaver",
    category: "escritorio",
  },
  {
    slug: "minesweeper",
    title: "Minesweeper",
    description:
      "Buscaminas jugable con minas, banderas, temporizador, contador, reinicio y tablero determinista opcional.",
    install: "npx @deskui/cli add minesweeper",
    category: "escritorio",
  },
];

/**
 * Devuelve el catálogo en el idioma pedido. Las descripciones inglesas viven
 * en el overlay de documentación de componentes para no duplicar el índice.
 */
export function getComponentManifest(locale: Locale): ComponentManifestEntry[] {
  if (locale === "es") {
    return COMPONENT_MANIFEST;
  }

  return COMPONENT_MANIFEST.map((entry) => ({
    ...entry,
    description:
      COMPONENT_DOCS_EN[entry.slug as ComponentDocSlug]?.description ??
      entry.description,
  }));
}

export function findManifestComponent(slug: string, locale: Locale = "es") {
  return getComponentManifest(locale).find((entry) => entry.slug === slug);
}
