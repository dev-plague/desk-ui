import * as React from "react";

import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export type TerminalLineKind = "input" | "output" | "error";

export interface TerminalLine {
  id?: string;
  text: React.ReactNode;
  kind?: TerminalLineKind;
}

export interface TerminalCommandContext {
  args: string[];
  input: string;
  clear: () => void;
}

export type TerminalCommand = (
  context: TerminalCommandContext,
) => string | string[] | void;

export interface TerminalProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  prompt?: string;
  initialLines?: TerminalLine[];
  commands?: Record<string, TerminalCommand>;
  onCommand?: (input: string) => void;
  autoFocus?: boolean;
  label?: string;
}

export const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      className,
      prompt = "C:\\>",
      initialLines,
      commands,
      onCommand,
      autoFocus = false,
      label,
      ...props
    },
    ref,
  ) => {
    const { messages } = useDeskUILocale();
    const labels = messages.terminal;
    const resolvedLabel = label ?? labels.label;
    const [lines, setLines] = React.useState<TerminalLine[]>(
      () =>
        initialLines ??
        labels.initialLines.map((text) => ({ text, kind: "output" })),
    );
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const logRef = React.useRef<HTMLDivElement>(null);
    const counter = React.useRef(0);
    const inputId = React.useId();

    React.useEffect(() => {
      const log = logRef.current;
      if (log) {
        log.scrollTop = log.scrollHeight;
      }
    }, [lines]);

    React.useEffect(() => {
      if (autoFocus) {
        inputRef.current?.focus();
      }
    }, [autoFocus]);

    function nextId() {
      counter.current += 1;
      return `line-${counter.current}`;
    }

    function append(next: React.ReactNode, kind: TerminalLineKind = "output") {
      setLines((previous) => [...previous, { id: nextId(), text: next, kind }]);
    }

    function clear() {
      setLines([]);
    }

    function run(input: string) {
      const trimmed = input.trim();
      append(`${prompt} ${input}`, "input");
      onCommand?.(input);

      if (!trimmed) {
        return;
      }

      const [name = "", ...args] = trimmed.split(/\s+/);
      const command = commands?.[name.toLowerCase()];

      if (command) {
        const result = command({ args, input: trimmed, clear });
        if (typeof result === "string") {
          append(result);
        } else if (Array.isArray(result)) {
          result.forEach((line) => append(line));
        }
        return;
      }

      switch (name.toLowerCase()) {
        case "help":
          append(
            [
              labels.helpTitle,
              ...labels.helpLines,
              ...Object.keys(commands ?? {}).map(
                (item) => `  ${item.padEnd(12)} ${labels.customCommand}`,
              ),
            ],
          );
          break;
        case "ver":
          append(labels.version);
          break;
        case "cls":
          clear();
          break;
        case "dir":
          append(labels.dirLines);
          break;
        case "echo":
          append(args.join(" "));
          break;
        default:
          append(labels.unknownCommand(name), "error");
      }
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      run(value);
      setValue("");
      inputRef.current?.focus();
    }

    return (
      <div
        ref={ref}
        data-slot="terminal"
        className={cn(
          "flex min-h-0 flex-col bg-terminal p-2 font-mono text-[12px] leading-[16px] text-terminal-ink",
          className,
        )}
        onClick={() => inputRef.current?.focus()}
        {...props}
      >
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label={labels.outputLabel(resolvedLabel)}
          className="w95-scrollbar min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap"
        >
          {lines.map((line, index) => (
            <p
              key={line.id ?? index}
              className={cn(
                "m-0",
                line.kind === "input" && "text-terminal-prompt",
                line.kind === "error" && "text-danger",
              )}
            >
              {line.text}
            </p>
          ))}
        </div>

        <form onSubmit={submit} className="mt-1 flex items-center gap-1">
          <label htmlFor={inputId} className="sr-only">
            {labels.inputLabel}
          </label>
          <span aria-hidden="true" className="shrink-0 text-terminal-prompt">
            {prompt}
          </span>
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-label={labels.inputLabel}
            autoComplete="off"
            spellCheck={false}
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[12px]",
              "text-terminal-ink caret-terminal-accent outline-none",
            )}
          />
        </form>
      </div>
    );
  },
);

Terminal.displayName = "Terminal";
