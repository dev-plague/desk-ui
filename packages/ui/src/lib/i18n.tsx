import * as React from "react";

/**
 * Idiomas soportados por los textos internos de DeskUI. El español es el
 * idioma por defecto para conservar el comportamiento de versiones previas.
 */
export type DeskUILocale = "es" | "en";

export interface DeskUIMessages {
  common: {
    minimize: string;
    maximize: string;
    restore: string;
    close: string;
  };
  desktop: {
    label: string;
  };
  pagination: {
    label: string;
    previous: string;
    next: string;
    previousLabel: string;
    nextLabel: string;
    page: (page: number) => string;
    currentPage: (page: number) => string;
  };
  wizard: {
    stepsLabel: string;
    back: string;
    next: string;
    finish: string;
    cancel: string;
  };
  properties: {
    tabsLabel: string;
    apply: string;
    ok: string;
    cancel: string;
  };
  notepad: {
    menuLabel: string;
    file: string;
    newFile: string;
    open: string;
    save: string;
    exit: string;
    edit: string;
    undo: string;
    cut: string;
    copy: string;
    paste: string;
    format: string;
    enableWordWrap: string;
    disableWordWrap: string;
    font: string;
    help: string;
    about: string;
    untitled: string;
    editor: (fileName: string) => string;
    statusLabel: string;
    lines: (count: number) => string;
    characters: (count: number) => string;
    wrapEnabled: string;
    wrapDisabled: string;
  };
  fileExplorer: {
    toolbarLabel: string;
    back: string;
    forward: string;
    up: string;
    icons: string;
    list: string;
    details: string;
    address: string;
    currentPath: string;
    folders: string;
    empty: string;
    contents: (folder: string) => string;
    name: string;
    size: string;
    type: string;
    modified: string;
    folder: string;
    file: string;
    noneSelected: string;
    statusLabel: string;
    objects: (count: number) => string;
  };
  minesweeper: {
    label: string;
    boardLabel: string;
    newGame: string;
    ready: string;
    playing: string;
    won: string;
    lost: string;
    hint: string;
    hiddenCell: (row: number, column: number) => string;
    flaggedCell: (row: number, column: number) => string;
    mineCell: (row: number, column: number) => string;
    adjacentCell: (row: number, column: number, count: number) => string;
    minesLeft: (count: number) => string;
    seconds: (count: number) => string;
  };
  blueScreen: {
    title: string;
    message: string;
    hint: string;
    restart: string;
  };
  screensaver: {
    hint: string;
  };
  terminal: {
    label: string;
    outputLabel: (label: string) => string;
    inputLabel: string;
    initialLines: string[];
    helpCommand: string;
    helpTitle: string;
    helpLines: string[];
    customCommand: string;
    version: string;
    dirLines: string[];
    unknownCommand: (name: string) => string;
  };
  toast: {
    closeLabel: string;
    regionLabel: string;
  };
  scrollArea: {
    scrollUp: string;
    scrollDown: string;
    scrollLeft: string;
    scrollRight: string;
  };
}

const ES_MESSAGES: DeskUIMessages = {
  common: {
    minimize: "Minimizar",
    maximize: "Maximizar",
    restore: "Restaurar",
    close: "Cerrar",
  },
  desktop: {
    label: "Escritorio",
  },
  pagination: {
    label: "Paginación",
    previous: "Anterior",
    next: "Siguiente",
    previousLabel: "Página anterior",
    nextLabel: "Página siguiente",
    page: (page) => `Página ${page}`,
    currentPage: (page) => `Página ${page}, actual`,
  },
  wizard: {
    stepsLabel: "Pasos del asistente",
    back: "Atrás",
    next: "Siguiente",
    finish: "Finalizar",
    cancel: "Cancelar",
  },
  properties: {
    tabsLabel: "Propiedades",
    apply: "Aplicar",
    ok: "Aceptar",
    cancel: "Cancelar",
  },
  notepad: {
    menuLabel: "Menú del bloc de notas",
    file: "Archivo",
    newFile: "Nuevo",
    open: "Abrir...",
    save: "Guardar",
    exit: "Salir",
    edit: "Edición",
    undo: "Deshacer",
    cut: "Cortar",
    copy: "Copiar",
    paste: "Pegar",
    format: "Formato",
    enableWordWrap: "Ajustar línea",
    disableWordWrap: "Desactivar ajuste de línea",
    font: "Fuente...",
    help: "Ayuda",
    about: "Acerca del Bloc de notas",
    untitled: "Sin título",
    editor: (fileName) => `Editor de texto de ${fileName}`,
    statusLabel: "Estado del bloc de notas",
    lines: (count) => `Líneas: ${count}`,
    characters: (count) => `Caracteres: ${count}`,
    wrapEnabled: "Ajuste activo",
    wrapDisabled: "Sin ajuste",
  },
  fileExplorer: {
    toolbarLabel: "Barra del explorador",
    back: "Atrás",
    forward: "Adelante",
    up: "Arriba",
    icons: "Iconos",
    list: "Lista",
    details: "Detalles",
    address: "Dirección:",
    currentPath: "Ruta actual",
    folders: "Carpetas",
    empty: "Esta carpeta está vacía.",
    contents: (folder) => `Contenido de ${folder}`,
    name: "Nombre",
    size: "Tamaño",
    type: "Tipo",
    modified: "Modificado",
    folder: "Carpeta",
    file: "Archivo",
    noneSelected: "Ninguno seleccionado",
    statusLabel: "Estado del explorador",
    objects: (count) => `${count} objeto${count === 1 ? "" : "s"}`,
  },
  minesweeper: {
    label: "Buscaminas",
    boardLabel: "Tablero de buscaminas",
    newGame: "Nueva partida",
    ready: "Listo",
    playing: "Jugando",
    won: "¡Has ganado!",
    lost: "Has perdido",
    hint: "Clic derecho o F marca bandera",
    hiddenCell: (row, column) => `Fila ${row}, columna ${column}, oculta`,
    flaggedCell: (row, column) => `Fila ${row}, columna ${column}, bandera`,
    mineCell: (row, column) => `Fila ${row}, columna ${column}, mina`,
    adjacentCell: (row, column, count) =>
      `Fila ${row}, columna ${column}, ${count} adyacentes`,
    minesLeft: (count) =>
      `${count} ${count === 1 ? "mina restante" : "minas restantes"}`,
    seconds: (count) => `${count} segundos`,
  },
  blueScreen: {
    title: "DeskUI",
    message:
      "Se ha producido un error fatal. El sistema se ha detenido para evitar daños en el equipo.",
    hint: "Pulsa cualquier tecla o reinicia el equipo.",
    restart: "Reiniciar",
  },
  screensaver: {
    hint: "Mueve el ratón o pulsa una tecla para continuar",
  },
  terminal: {
    label: "Terminal",
    outputLabel: (label) => `Salida de ${label}`,
    inputLabel: "Entrada de comandos",
    initialLines: [
      "DeskUI Terminal [Versión 1.0.0]",
      "Escribe 'help' para ver los comandos.",
    ],
    helpCommand: "Muestra esta ayuda",
    helpTitle: "Comandos disponibles:",
    helpLines: [
      "  help          Muestra esta ayuda",
      "  ver           Versión de la terminal",
      "  cls           Limpia la pantalla",
      "  dir           Lista archivos de ejemplo",
      "  echo <texto>  Repite el texto",
    ],
    customCommand: "Comando personalizado",
    version: "DeskUI Terminal 1.0",
    dirLines: [
      " El volumen de la unidad C no tiene etiqueta.",
      " Directorio de C:\\",
      "",
      "DESKUI       <DIR>      10-21-95  09:00",
      "DOCUMENTOS   <DIR>      10-21-95  09:00",
      "AUTOEXEC.BAT        256  10-21-95  09:00",
      "CONFIG.SYS          128  10-21-95  09:00",
      "             4 archivo(s)        384 bytes",
    ],
    unknownCommand: (name) => `Comando no reconocido: ${name}`,
  },
  toast: {
    closeLabel: "Cerrar notificación",
    regionLabel: "Notificaciones",
  },
  scrollArea: {
    scrollUp: "Desplazar hacia arriba",
    scrollDown: "Desplazar hacia abajo",
    scrollLeft: "Desplazar a la izquierda",
    scrollRight: "Desplazar a la derecha",
  },
};

const EN_MESSAGES: DeskUIMessages = {
  common: {
    minimize: "Minimize",
    maximize: "Maximize",
    restore: "Restore",
    close: "Close",
  },
  desktop: {
    label: "Desktop",
  },
  pagination: {
    label: "Pagination",
    previous: "Previous",
    next: "Next",
    previousLabel: "Previous page",
    nextLabel: "Next page",
    page: (page) => `Page ${page}`,
    currentPage: (page) => `Page ${page}, current`,
  },
  wizard: {
    stepsLabel: "Wizard steps",
    back: "Back",
    next: "Next",
    finish: "Finish",
    cancel: "Cancel",
  },
  properties: {
    tabsLabel: "Properties",
    apply: "Apply",
    ok: "OK",
    cancel: "Cancel",
  },
  notepad: {
    menuLabel: "Notepad menu",
    file: "File",
    newFile: "New",
    open: "Open...",
    save: "Save",
    exit: "Exit",
    edit: "Edit",
    undo: "Undo",
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    format: "Format",
    enableWordWrap: "Word Wrap",
    disableWordWrap: "Disable Word Wrap",
    font: "Font...",
    help: "Help",
    about: "About Notepad",
    untitled: "Untitled",
    editor: (fileName) => `Text editor for ${fileName}`,
    statusLabel: "Notepad status",
    lines: (count) => `Lines: ${count}`,
    characters: (count) => `Characters: ${count}`,
    wrapEnabled: "Wrap on",
    wrapDisabled: "No wrap",
  },
  fileExplorer: {
    toolbarLabel: "Explorer toolbar",
    back: "Back",
    forward: "Forward",
    up: "Up",
    icons: "Icons",
    list: "List",
    details: "Details",
    address: "Address:",
    currentPath: "Current path",
    folders: "Folders",
    empty: "This folder is empty.",
    contents: (folder) => `Contents of ${folder}`,
    name: "Name",
    size: "Size",
    type: "Type",
    modified: "Modified",
    folder: "Folder",
    file: "File",
    noneSelected: "None selected",
    statusLabel: "Explorer status",
    objects: (count) => `${count} object${count === 1 ? "" : "s"}`,
  },
  minesweeper: {
    label: "Minesweeper",
    boardLabel: "Minesweeper board",
    newGame: "New game",
    ready: "Ready",
    playing: "Playing",
    won: "You won!",
    lost: "You lost",
    hint: "Right-click or F to flag",
    hiddenCell: (row, column) => `Row ${row}, column ${column}, hidden`,
    flaggedCell: (row, column) => `Row ${row}, column ${column}, flagged`,
    mineCell: (row, column) => `Row ${row}, column ${column}, mine`,
    adjacentCell: (row, column, count) =>
      `Row ${row}, column ${column}, ${count} adjacent`,
    minesLeft: (count) => `${count} mine${count === 1 ? "" : "s"} left`,
    seconds: (count) => `${count} seconds`,
  },
  blueScreen: {
    title: "DeskUI",
    message:
      "A fatal error has occurred. The system has halted to prevent damage to your computer.",
    hint: "Press any key or restart the computer.",
    restart: "Restart",
  },
  screensaver: {
    hint: "Move the mouse or press a key to continue",
  },
  terminal: {
    label: "Terminal",
    outputLabel: (label) => `${label} output`,
    inputLabel: "Command input",
    initialLines: [
      "DeskUI Terminal [Version 1.0.0]",
      "Type 'help' to list the available commands.",
    ],
    helpCommand: "Shows this help",
    helpTitle: "Available commands:",
    helpLines: [
      "  help          Shows this help",
      "  ver           Terminal version",
      "  cls           Clears the screen",
      "  dir           Lists sample files",
      "  echo <text>   Repeats the text",
    ],
    customCommand: "Custom command",
    version: "DeskUI Terminal 1.0",
    dirLines: [
      " The volume in drive C has no label.",
      " Directory of C:\\",
      "",
      "DESKUI       <DIR>      10-21-95  09:00",
      "DOCUMENTS    <DIR>      10-21-95  09:00",
      "AUTOEXEC.BAT        256  10-21-95  09:00",
      "CONFIG.SYS          128  10-21-95  09:00",
      "             4 file(s)           384 bytes",
    ],
    unknownCommand: (name) => `Unrecognized command: ${name}`,
  },
  toast: {
    closeLabel: "Close notification",
    regionLabel: "Notifications",
  },
  scrollArea: {
    scrollUp: "Scroll up",
    scrollDown: "Scroll down",
    scrollLeft: "Scroll left",
    scrollRight: "Scroll right",
  },
};

export const DESKUI_LOCALE_MESSAGES: Record<DeskUILocale, DeskUIMessages> = {
  es: ES_MESSAGES,
  en: EN_MESSAGES,
};

export type DeskUIMessagesOverride = {
  [Section in keyof DeskUIMessages]?: Partial<DeskUIMessages[Section]>;
};

export interface DeskUILocaleContextValue {
  locale: DeskUILocale;
  messages: DeskUIMessages;
}

const DEFAULT_CONTEXT: DeskUILocaleContextValue = {
  locale: "es",
  messages: ES_MESSAGES,
};

const DeskUILocaleContext =
  React.createContext<DeskUILocaleContextValue>(DEFAULT_CONTEXT);

export interface DeskUILocaleProviderProps {
  locale?: DeskUILocale;
  /**
   * Sobrescrituras parciales por sección. Útil para cambiar una etiqueta
   * concreta sin reemplazar todo el diccionario del idioma.
   */
  messages?: DeskUIMessagesOverride;
  children: React.ReactNode;
}

function mergeMessages(
  locale: DeskUILocale,
  overrides?: DeskUIMessagesOverride,
): DeskUIMessages {
  const base = DESKUI_LOCALE_MESSAGES[locale];
  if (!overrides) {
    return base;
  }

  const merged = { ...base } as DeskUIMessages;
  for (const key of Object.keys(overrides) as Array<keyof DeskUIMessages>) {
    const section = overrides[key];
    if (section) {
      merged[key] = { ...base[key], ...section } as never;
    }
  }
  return merged;
}

/**
 * Proveedor de idioma para los textos internos de los componentes (menús,
 * botones, estados y etiquetas accesibles). Sin proveedor, DeskUI usa español.
 */
export function DeskUILocaleProvider({
  locale = "es",
  messages,
  children,
}: DeskUILocaleProviderProps) {
  const value = React.useMemo(
    () => ({ locale, messages: mergeMessages(locale, messages) }),
    [locale, messages],
  );

  return (
    <DeskUILocaleContext.Provider value={value}>
      {children}
    </DeskUILocaleContext.Provider>
  );
}

/** Acceso al idioma y a los textos internos de DeskUI. */
export function useDeskUILocale(): DeskUILocaleContextValue {
  return React.useContext(DeskUILocaleContext);
}
