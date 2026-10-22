import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDir = path.join(packageRoot, "dist", "registry");

const items = [
  {
    name: "utils",
    type: "registry:lib",
    title: "Utilidades",
    description:
      "Helper `cn` para combinar clases de Tailwind sin conflictos. Requerido por todos los componentes.",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
    source: "src/lib/utils.ts",
    target: "lib/utils.ts",
  },
  {
    name: "i18n",
    type: "registry:lib",
    title: "i18n",
    description:
      "Proveedor de idioma (español/inglés) para los textos internos de los componentes de DeskUI.",
    dependencies: [],
    registryDependencies: [],
    source: "src/lib/i18n.tsx",
    target: "lib/i18n.tsx",
  },
  {
    name: "button",
    type: "registry:ui",
    title: "Button",
    description:
      "Botón biselado clásico con variantes default, primary e icon, estados pressed/disabled y foco punteado.",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    registryDependencies: ["utils"],
    source: "src/components/button.tsx",
    target: "components/ui/button.tsx",
  },
  {
    name: "input",
    type: "registry:ui",
    title: "Input",
    description:
      "Campo de texto hundido de 2 px con foco punteado, estados read-only y disabled.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/input.tsx",
    target: "components/ui/input.tsx",
  },
  {
    name: "window",
    type: "registry:ui",
    title: "Window",
    description:
      "Ventana componible con TitleBar, Body, StatusBar y controles de minimizar, maximizar/restaurar y cerrar.",
    dependencies: [],
    registryDependencies: ["utils", "title-bar", "status-bar"],
    source: "src/components/window.tsx",
    target: "components/ui/window.tsx",
  },
  {
    name: "dialog",
    type: "registry:ui",
    title: "Dialog",
    description:
      "Diálogo modal nativo con foco atrapado, Escape, backdrop y marco de Window.",
    dependencies: [],
    registryDependencies: ["utils", "window"],
    source: "src/components/dialog.tsx",
    target: "components/ui/dialog.tsx",
  },
  {
    name: "group-box",
    type: "registry:ui",
    title: "GroupBox",
    description:
      "Fieldset clásico con la leyenda sobre el borde y la muesca tradicional.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/group-box.tsx",
    target: "components/ui/group-box.tsx",
  },
  {
    name: "alert",
    type: "registry:ui",
    title: "Alert",
    description:
      "Aviso con marco de ventana y franja semántica; composición AlertTitle/AlertDescription.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    source: "src/components/alert.tsx",
    target: "components/ui/alert.tsx",
  },
  {
    name: "badge",
    type: "registry:ui",
    title: "Badge",
    description:
      "Etiqueta biselada con punto de estado semántico y texto de alto contraste.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    source: "src/components/badge.tsx",
    target: "components/ui/badge.tsx",
  },
  {
    name: "breadcrumb",
    type: "registry:ui",
    title: "Breadcrumb",
    description:
      "Migas de pan con enlaces, página actual y separadores `>`.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/breadcrumb.tsx",
    target: "components/ui/breadcrumb.tsx",
  },
  {
    name: "context-menu",
    type: "registry:ui",
    title: "ContextMenu",
    description:
      "Menú contextual clásico sobre Radix, con items, etiquetas y separadores.",
    dependencies: ["@radix-ui/react-context-menu"],
    registryDependencies: ["utils"],
    source: "src/components/context-menu.tsx",
    target: "components/ui/context-menu.tsx",
  },
  {
    name: "dropdown-menu",
    type: "registry:ui",
    title: "DropdownMenu",
    description:
      "Menú desplegable clásico sobre Radix, con items, etiquetas y atajos.",
    dependencies: ["@radix-ui/react-dropdown-menu"],
    registryDependencies: ["utils"],
    source: "src/components/dropdown-menu.tsx",
    target: "components/ui/dropdown-menu.tsx",
  },
  {
    name: "menu-bar",
    type: "registry:ui",
    title: "MenuBar",
    description:
      "Barra de menús de ventana sobre Radix Menubar, con teclado y submenús.",
    dependencies: ["@radix-ui/react-menubar"],
    registryDependencies: ["utils"],
    source: "src/components/menu-bar.tsx",
    target: "components/ui/menu-bar.tsx",
  },
  {
    name: "pagination",
    type: "registry:ui",
    title: "Pagination",
    description:
      "Paginación clásica con anterior/siguiente, páginas y elipsis.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/pagination.tsx",
    target: "components/ui/pagination.tsx",
  },
  {
    name: "progress-bar",
    type: "registry:ui",
    title: "ProgressBar",
    description:
      "Barra de progreso hundida con bloques azules segmentados.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/progress-bar.tsx",
    target: "components/ui/progress-bar.tsx",
  },
  {
    name: "toast",
    type: "registry:ui",
    title: "Toast",
    description:
      "Notificaciones de bandeja con ToastProvider, useToast y cierre manual.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/toast.tsx",
    target: "components/ui/toast.tsx",
  },
  {
    name: "tooltip",
    type: "registry:ui",
    title: "Tooltip",
    description:
      "Tooltip amarillo clásico sobre Radix Tooltip, con foco y teclado.",
    dependencies: ["@radix-ui/react-tooltip"],
    registryDependencies: ["utils"],
    source: "src/components/tooltip.tsx",
    target: "components/ui/tooltip.tsx",
  },
  {
    name: "tree-view",
    type: "registry:ui",
    title: "TreeView",
    description:
      "Árbol de explorador con selección, expansión y navegación por teclado.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/tree-view.tsx",
    target: "components/ui/tree-view.tsx",
  },
  {
    name: "radio-group",
    type: "registry:ui",
    title: "RadioGroup",
    description:
      "Grupo de radios nativos con círculo biselado de 12 px y punto de 4 px.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/radio-group.tsx",
    target: "components/ui/radio-group.tsx",
  },
  {
    name: "select",
    type: "registry:ui",
    title: "Select",
    description:
      "Select nativo con campo hundido y botón de flecha elevado.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/select.tsx",
    target: "components/ui/select.tsx",
  },
  {
    name: "switch",
    type: "registry:ui",
    title: "Switch",
    description:
      "Interruptor retro con pista hundida, perilla elevada y role=switch.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/switch.tsx",
    target: "components/ui/switch.tsx",
  },
  {
    name: "slider",
    type: "registry:ui",
    title: "Slider",
    description:
      "Slider nativo con pista hundida de 4 px y thumb rectangular de 11×21.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/slider.tsx",
    target: "components/ui/slider.tsx",
  },
  {
    name: "form",
    type: "registry:ui",
    title: "Form",
    description:
      "Integración con React Hook Form y Zod: FormField, FormItem, labels, control, descripción y mensajes.",
    dependencies: [
      "react-hook-form",
      "@hookform/resolvers",
      "zod",
      "@radix-ui/react-slot",
    ],
    registryDependencies: ["utils", "label"],
    source: "src/components/form.tsx",
    target: "components/ui/form.tsx",
  },
  {
    name: "tabs",
    type: "registry:ui",
    title: "Tabs",
    description:
      "Pestañas de propiedades sobre Radix Tabs, con pestaña activa fusionada con el panel.",
    dependencies: ["@radix-ui/react-tabs"],
    registryDependencies: ["utils"],
    source: "src/components/tabs.tsx",
    target: "components/ui/tabs.tsx",
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    title: "ScrollArea",
    description:
      "Contenedor de scroll nativo con viewport focusable y barra clásica de 16 px con flechas, pista tramada y thumb cuadrado.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/scroll-area.tsx",
    target: "components/ui/scroll-area.tsx",
  },
  {
    name: "icon",
    type: "registry:ui",
    title: "Icon",
    description:
      "Set original de iconos pixel-art 16×16 (escalables a 32×32) con nombres accesibles opcionales.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/icon.tsx",
    target: "components/ui/icon.tsx",
  },
  {
    name: "list-box",
    type: "registry:ui",
    title: "ListBox",
    description:
      "List box nativa con bisel hundido, filas visibles y selección simple o múltiple.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/list-box.tsx",
    target: "components/ui/list-box.tsx",
  },
  {
    name: "status-bar",
    type: "registry:ui",
    title: "StatusBar",
    description:
      "Barra de estado con campos segmentados y bisel de estado clásico.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/status-bar.tsx",
    target: "components/ui/status-bar.tsx",
  },
  {
    name: "table",
    type: "registry:ui",
    title: "Table",
    description:
      "Tabla clásica con cabecera elevada, cuerpo blanco, filas compactas y selección azul.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/table.tsx",
    target: "components/ui/table.tsx",
  },
  {
    name: "taskbar",
    type: "registry:ui",
    title: "Taskbar",
    description:
      "Barra de tareas con botón Inicio, botones de tarea, separador y bandeja.",
    dependencies: [],
    registryDependencies: ["utils", "button"],
    source: "src/components/taskbar.tsx",
    target: "components/ui/taskbar.tsx",
  },
  {
    name: "panel",
    type: "registry:ui",
    title: "Panel",
    description:
      "Contenedor clásico con variantes raised, sunken, window y flat; cabecera, cuerpo y pie opcionales.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    source: "src/components/panel.tsx",
    target: "components/ui/panel.tsx",
  },
  {
    name: "card",
    type: "registry:ui",
    title: "Card",
    description:
      "Tarjeta de contenido elevada con cabecera, título, descripción, cuerpo y pie componibles.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/card.tsx",
    target: "components/ui/card.tsx",
  },
  {
    name: "separator",
    type: "registry:ui",
    title: "Separator",
    description:
      "Línea de separación horizontal o vertical con la ranura clásica de sombra y luz.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/separator.tsx",
    target: "components/ui/separator.tsx",
  },
  {
    name: "toolbar",
    type: "registry:ui",
    title: "Toolbar",
    description:
      "Barra de herramientas accesible con grupos, separadores, botones de alternancia y navegación por flechas.",
    dependencies: [],
    registryDependencies: ["utils", "button", "separator"],
    source: "src/components/toolbar.tsx",
    target: "components/ui/toolbar.tsx",
  },
  {
    name: "desktop",
    type: "registry:ui",
    title: "Desktop",
    description:
      "Lienzo de escritorio con iconos seleccionables, apertura por doble clic/Enter y arrastre opcional.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/desktop.tsx",
    target: "components/ui/desktop.tsx",
  },
  {
    name: "start-menu",
    type: "registry:ui",
    title: "StartMenu",
    description:
      "Menú Inicio con submenús en cascada sobre Radix DropdownMenu, barra lateral y atajos.",
    dependencies: ["@radix-ui/react-dropdown-menu"],
    registryDependencies: ["utils"],
    source: "src/components/start-menu.tsx",
    target: "components/ui/start-menu.tsx",
  },
  {
    name: "window-manager",
    type: "registry:ui",
    title: "WindowManager",
    description:
      "Gestor de ventanas con arrastre, resize, foco, z-index, minimizar, maximizar/restaurar y cerrar.",
    dependencies: [],
    registryDependencies: ["utils", "window"],
    source: "src/components/window-manager.tsx",
    target: "components/ui/window-manager.tsx",
  },
  {
    name: "file-explorer",
    type: "registry:ui",
    title: "FileExplorer",
    description:
      "Explorador de archivos con árbol de carpetas, vistas de iconos, lista y detalles, historial y selección.",
    dependencies: [],
    registryDependencies: [
      "utils",
      "icon",
      "input",
      "table",
      "toolbar",
      "tree-view",
      "status-bar",
    ],
    source: "src/components/file-explorer.tsx",
    target: "components/ui/file-explorer.tsx",
  },
  {
    name: "wizard",
    type: "registry:ui",
    title: "Wizard",
    description:
      "Asistente por pasos con indicador de progreso, Atrás/Siguiente, finalización y cancelación.",
    dependencies: [],
    registryDependencies: ["utils", "button"],
    source: "src/components/wizard.tsx",
    target: "components/ui/wizard.tsx",
  },
  {
    name: "properties-dialog",
    type: "registry:ui",
    title: "PropertiesDialog",
    description:
      "Diálogo de propiedades con pestañas, Aplicar, Cancelar y Aceptar sobre Dialog y Tabs.",
    dependencies: [],
    registryDependencies: ["utils", "button", "dialog", "tabs"],
    source: "src/components/properties-dialog.tsx",
    target: "components/ui/properties-dialog.tsx",
  },
  {
    name: "notepad",
    type: "registry:ui",
    title: "Notepad",
    description:
      "Editor de texto tipo Bloc de notas con menú, ajuste de línea, atajos y barra de estado.",
    dependencies: [],
    registryDependencies: ["utils", "menu-bar", "status-bar", "textarea"],
    source: "src/components/notepad.tsx",
    target: "components/ui/notepad.tsx",
  },
  {
    name: "terminal",
    type: "registry:ui",
    title: "Terminal",
    description:
      "Terminal MS-DOS con historial, comandos internos (help, ver, cls, dir, echo) y comandos personalizados.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/terminal.tsx",
    target: "components/ui/terminal.tsx",
  },
  {
    name: "blue-screen",
    type: "registry:ui",
    title: "BlueScreen",
    description:
      "Pantalla azul de error clásica con código, mensaje, pista y acción de reinicio.",
    dependencies: [],
    registryDependencies: ["utils", "button"],
    source: "src/components/blue-screen.tsx",
    target: "components/ui/blue-screen.tsx",
  },
  {
    name: "screensaver",
    type: "registry:ui",
    title: "Screensaver",
    description:
      "Salvapantallas con campo de estrellas animado, cierre por clic o teclado y reduced motion.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/screensaver.tsx",
    target: "components/ui/screensaver.tsx",
  },
  {
    name: "minesweeper",
    type: "registry:ui",
    title: "Minesweeper",
    description:
      "Buscaminas jugable con minas, banderas, temporizador, reinicio y tablero determinista opcional.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/minesweeper.tsx",
    target: "components/ui/minesweeper.tsx",
  },
  {
    name: "title-bar",
    type: "registry:ui",
    title: "TitleBar",
    description:
      "Barra de título reutilizable con icono, controles y estado activo/inactivo.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/title-bar.tsx",
    target: "components/ui/title-bar.tsx",
  },
  {
    name: "label",
    type: "registry:ui",
    title: "Label",
    description:
      "Etiqueta de formulario con tipografía clásica y asociación mediante htmlFor.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/label.tsx",
    target: "components/ui/label.tsx",
  },
  {
    name: "checkbox",
    type: "registry:ui",
    title: "Checkbox",
    description:
      "Checkbox nativo de 13×13 px con check pixelado, foco punteado y estados disabled.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/checkbox.tsx",
    target: "components/ui/checkbox.tsx",
  },
  {
    name: "textarea",
    type: "registry:ui",
    title: "Textarea",
    description:
      "Área de texto hundida, redimensionable en vertical, con foco y estados clásicos.",
    dependencies: [],
    registryDependencies: ["utils"],
    source: "src/components/textarea.tsx",
    target: "components/ui/textarea.tsx",
  },
];

function rewriteImports(content) {
  // The monorepo source uses relative imports so TypeScript can compile the
  // package without path aliases. Copied components follow the shadcn
  // convention and resolve the shared helpers from `@/lib/*`.
  return content
    .replaceAll('from "../lib/utils"', 'from "@/lib/utils"')
    .replaceAll('from "../lib/i18n"', 'from "@/lib/i18n"');
}

function resolveRegistryDependencies(definition, content) {
  const dependencies = [...definition.registryDependencies];
  if (
    content.includes('from "../lib/i18n"') &&
    !dependencies.includes("i18n")
  ) {
    dependencies.push("i18n");
  }
  return dependencies;
}

async function buildItem(definition) {
  const sourcePath = path.join(packageRoot, definition.source);
  const raw = await readFile(sourcePath, "utf8");
  const content = rewriteImports(raw);

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: definition.name,
    type: definition.type,
    title: definition.title,
    description: definition.description,
    dependencies: definition.dependencies,
    registryDependencies: resolveRegistryDependencies(definition, raw),
    files: [
      {
        path: definition.target,
        target: definition.target,
        type: definition.type,
        content,
      },
    ],
  };
}

const builtItems = await Promise.all(items.map(buildItem));

await mkdir(outputDir, { recursive: true });

await Promise.all(
  builtItems.map((item) =>
    writeFile(
      path.join(outputDir, `${item.name}.json`),
      `${JSON.stringify(item, null, 2)}\n`,
    ),
  ),
);

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "deskui",
  items: builtItems,
};

await writeFile(
  path.join(outputDir, "registry.json"),
  `${JSON.stringify(registry, null, 2)}\n`,
);

console.log(
  `Registry generado: ${builtItems.length} items en ${path.relative(process.cwd(), outputDir)}`,
);
