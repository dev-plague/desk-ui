import * as React from "react";

import { cn } from "../lib/utils";

type TreeContextValue = {
  selected?: string;
  expanded: Set<string>;
  select: (value: string) => void;
  toggle: (value: string) => void;
};

const TreeContext = React.createContext<TreeContextValue | null>(null);
const TreeLevelContext = React.createContext(1);

export interface TreeViewProps
  extends Omit<React.ComponentProps<"ul">, "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (values: string[]) => void;
}

export const TreeView = React.forwardRef<HTMLUListElement, TreeViewProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      expanded,
      defaultExpanded = [],
      onExpandedChange,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [internalExpanded, setInternalExpanded] =
      React.useState(defaultExpanded);
    const selected = value ?? internalValue;
    const expandedValues = expanded ?? internalExpanded;
    const expandedSet = new Set(expandedValues);

    function select(next: string) {
      if (value === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    }

    function toggle(next: string) {
      const nextSet = new Set(expandedValues);
      if (nextSet.has(next)) {
        nextSet.delete(next);
      } else {
        nextSet.add(next);
      }
      const nextValues = [...nextSet];
      if (expanded === undefined) {
        setInternalExpanded(nextValues);
      }
      onExpandedChange?.(nextValues);
    }

    return (
      <TreeContext.Provider
        value={{ selected, expanded: expandedSet, select, toggle }}
      >
        <TreeLevelContext.Provider value={1}>
          <ul
            ref={ref}
            role="tree"
            data-slot="tree-view"
            className={cn(
              "bevel-field bg-surface-sunken p-1 font-ui text-ui text-ink",
              className,
            )}
            {...props}
          >
            {children}
          </ul>
        </TreeLevelContext.Provider>
      </TreeContext.Provider>
    );
  },
);

TreeView.displayName = "TreeView";

function Twisty({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 5 7"
      width={5}
      height={7}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      fill="currentColor"
      className={cn("transition-none", open && "rotate-90")}
    >
      <path d="M0 0h1v1h1v1h1v1h1v1H3v1H2v1H1V6H0z" />
    </svg>
  );
}

export interface TreeItemProps {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  ({ value, label, icon, children, className, disabled }, ref) => {
    const context = React.useContext(TreeContext);
    const level = React.useContext(TreeLevelContext);
    const rowRef = React.useRef<HTMLDivElement>(null);

    if (!context) {
      throw new Error("TreeItem debe usarse dentro de TreeView.");
    }

    const tree = context;
    const hasChildren = React.Children.count(children) > 0;
    const open = tree.expanded.has(value);
    const selected = tree.selected === value;

    function focusRelative(direction: -1 | 1) {
      const root = rowRef.current?.closest('[role="tree"]');
      const row = rowRef.current;
      if (!root || !row) {
        return;
      }

      const rows = [
        ...root.querySelectorAll<HTMLElement>('[role="treeitem"]'),
      ];
      const index = rows.indexOf(row);
      rows[index + direction]?.focus();
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      if (disabled) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (hasChildren && !open) {
          tree.toggle(value);
        } else if (hasChildren) {
          focusRelative(1);
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (hasChildren && open) {
          tree.toggle(value);
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        focusRelative(-1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        focusRelative(1);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        tree.select(value);
      }
    }

    return (
      <li role="none" data-slot="tree-item-wrapper">
        <div
          ref={(node) => {
            rowRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          role="treeitem"
          tabIndex={disabled ? -1 : 0}
          aria-level={level}
          aria-selected={selected}
          aria-expanded={hasChildren ? open : undefined}
          aria-disabled={disabled || undefined}
          data-slot="tree-item"
          onClick={() => {
            if (!disabled) {
              tree.select(value);
            }
          }}
          onKeyDown={onKeyDown}
          className={cn(
            "flex h-[20px] select-none items-center gap-1 px-1 max-sm:h-6",
            "cursor-default text-[11px] leading-[13px]",
            selected
              ? "bg-accent text-ink-inverse"
              : "hover:bg-surface-pressed",
            "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
            disabled && "text-engraved",
            className,
          )}
        >
          {hasChildren ? (
            <span
              aria-hidden="true"
              onClick={(event) => {
                event.stopPropagation();
                if (!disabled) {
                  tree.toggle(value);
                }
              }}
              className="grid h-4 w-4 shrink-0 place-items-center"
            >
              <Twisty open={open} />
            </span>
          ) : (
            <span aria-hidden="true" className="h-4 w-4 shrink-0" />
          )}
          {icon ? <span className="shrink-0">{icon}</span> : null}
          <span className="truncate">{label}</span>
        </div>
        {hasChildren && open ? (
          <TreeLevelContext.Provider value={level + 1}>
            <ul
              role="group"
              className="ml-4 border-l border-dotted border-bevel-shadow pl-1"
            >
              {children}
            </ul>
          </TreeLevelContext.Provider>
        ) : null}
      </li>
    );
  },
);

TreeItem.displayName = "TreeItem";
