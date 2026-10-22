import * as React from "react";

import {
  MenuBar,
  MenuBarItem,
  MenuBarMenu,
  MenuBarSeparator,
  MenuBarShortcut,
} from "./menu-bar";
import { StatusBar, StatusBarField } from "./status-bar";
import { Textarea } from "./textarea";
import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface NotepadProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  fileName?: string;
  readOnly?: boolean;
  showMenuBar?: boolean;
  onNew?: () => void;
  onOpen?: () => void;
  onSave?: (value: string) => void;
  onExit?: () => void;
}

/**
 * Editor de texto tipo Bloc de notas. Es contenido de ventana: no incluye la
 * barra de título para poder colocarse dentro de `Window` o `WindowManager`.
 */
export const Notepad = React.forwardRef<HTMLDivElement, NotepadProps>(
  (
    {
      className,
      value,
      defaultValue = "",
      onValueChange,
      fileName,
      readOnly = false,
      showMenuBar = true,
      onNew,
      onOpen,
      onSave,
      onExit,
      ...props
    },
    ref,
  ) => {
    const { messages } = useDeskUILocale();
    const labels = messages.notepad;
    const resolvedFileName = fileName ?? labels.untitled;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [wordWrap, setWordWrap] = React.useState(true);
    const currentValue = value ?? internalValue;
    const lines = currentValue.length === 0 ? 1 : currentValue.split("\n").length;

    function change(next: string) {
      if (value === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    }

    function newFile() {
      change("");
      onNew?.();
    }

    return (
      <div
        ref={ref}
        data-slot="notepad"
        className={cn("flex min-h-0 flex-col bg-surface text-ink", className)}
        {...props}
      >
        {showMenuBar ? (
          <MenuBar aria-label={labels.menuLabel} className="shrink-0">
            <MenuBarMenu label={labels.file}>
              <MenuBarItem onSelect={newFile}>
                {labels.newFile}
                <MenuBarShortcut>Ctrl+N</MenuBarShortcut>
              </MenuBarItem>
              <MenuBarItem onSelect={onOpen}>
                {labels.open}
                <MenuBarShortcut>Ctrl+O</MenuBarShortcut>
              </MenuBarItem>
              <MenuBarItem onSelect={() => onSave?.(currentValue)}>
                {labels.save}
                <MenuBarShortcut>Ctrl+S</MenuBarShortcut>
              </MenuBarItem>
              <MenuBarSeparator />
              <MenuBarItem onSelect={onExit}>{labels.exit}</MenuBarItem>
            </MenuBarMenu>
            <MenuBarMenu label={labels.edit}>
              <MenuBarItem disabled>{labels.undo}</MenuBarItem>
              <MenuBarItem disabled>{labels.cut}</MenuBarItem>
              <MenuBarItem disabled>{labels.copy}</MenuBarItem>
              <MenuBarItem disabled>{labels.paste}</MenuBarItem>
            </MenuBarMenu>
            <MenuBarMenu label={labels.format}>
              <MenuBarItem
                onSelect={() => setWordWrap((value) => !value)}
              >
                {wordWrap ? labels.disableWordWrap : labels.enableWordWrap}
              </MenuBarItem>
              <MenuBarItem disabled>{labels.font}</MenuBarItem>
            </MenuBarMenu>
            <MenuBarMenu label={labels.help}>
              <MenuBarItem disabled>{labels.about}</MenuBarItem>
            </MenuBarMenu>
          </MenuBar>
        ) : null}

        <Textarea
          aria-label={labels.editor(resolvedFileName)}
          value={currentValue}
          readOnly={readOnly}
          spellCheck={false}
          wrap={wordWrap ? "soft" : "off"}
          onChange={(event) => change(event.target.value)}
          onKeyDown={(event) => {
            if (!(event.ctrlKey || event.metaKey)) {
              return;
            }
            const key = event.key.toLowerCase();
            if (key === "s") {
              event.preventDefault();
              onSave?.(currentValue);
            } else if (key === "o") {
              event.preventDefault();
              onOpen?.();
            } else if (key === "n") {
              event.preventDefault();
              newFile();
            }
          }}
          className="w95-scrollbar min-h-0 flex-1 resize-none border-0 bg-surface-sunken font-mono text-[11px] leading-[15px] shadow-none"
        />

        <StatusBar aria-label={labels.statusLabel} className="shrink-0">
          <StatusBarField>{resolvedFileName}</StatusBarField>
          <StatusBarField className="max-w-[45%] flex-none">
            {labels.lines(lines)} · {labels.characters(currentValue.length)}
          </StatusBarField>
          <StatusBarField className="hidden w-28 flex-none sm:block">
            {wordWrap ? labels.wrapEnabled : labels.wrapDisabled}
          </StatusBarField>
        </StatusBar>
      </div>
    );
  },
);

Notepad.displayName = "Notepad";
