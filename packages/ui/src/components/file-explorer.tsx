import * as React from "react";

import { Icon } from "./icon";
import { Input } from "./input";
import { StatusBar, StatusBarField } from "./status-bar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "./toolbar";
import { TreeItem, TreeView } from "./tree-view";
import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export type FileExplorerView = "icons" | "list" | "details";

export interface FileExplorerItem {
  id: string;
  name: string;
  kind: "folder" | "file";
  icon?: React.ReactNode;
  size?: string;
  type?: string;
  modified?: string;
  children?: FileExplorerItem[];
}

export interface FileExplorerProps
  extends Omit<React.ComponentProps<"div">, "onSelect"> {
  root: FileExplorerItem;
  view?: FileExplorerView;
  defaultView?: FileExplorerView;
  onViewChange?: (view: FileExplorerView) => void;
  selectedId?: string;
  defaultSelectedId?: string;
  onSelect?: (item: FileExplorerItem) => void;
  onOpen?: (item: FileExplorerItem) => void;
  initialFolderId?: string;
  onFolderChange?: (folder: FileExplorerItem) => void;
}

function findItem(
  item: FileExplorerItem,
  id: string,
): FileExplorerItem | undefined {
  if (item.id === id) {
    return item;
  }
  for (const child of item.children ?? []) {
    const found = findItem(child, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

function buildParents(
  item: FileExplorerItem,
  parent: string | undefined,
  map: Map<string, string | undefined>,
) {
  map.set(item.id, parent);
  item.children?.forEach((child) => buildParents(child, item.id, map));
}

function buildPath(
  root: FileExplorerItem,
  id: string,
  parents: Map<string, string | undefined>,
) {
  const rootItem = findItem(root, id) ?? root;
  const names = [rootItem.name];
  let current = parents.get(id);

  while (current) {
    const parent = findItem(root, current);
    if (parent) {
      names.unshift(parent.name);
    }
    current = parents.get(current);
  }

  return names.join("\\");
}

function folderChildren(item: FileExplorerItem) {
  return (item.children ?? []).filter((child) => child.kind === "folder");
}

export const FileExplorer = React.forwardRef<HTMLDivElement, FileExplorerProps>(
  (
    {
      className,
      root,
      view,
      defaultView = "icons",
      onViewChange,
      selectedId,
      defaultSelectedId,
      onSelect,
      onOpen,
      initialFolderId,
      onFolderChange,
      ...props
    },
    ref,
  ) => {
    const { messages } = useDeskUILocale();
    const labels = messages.fileExplorer;
    const [internalView, setInternalView] =
      React.useState<FileExplorerView>(defaultView);
    const currentView = view ?? internalView;
    const [internalSelected, setInternalSelected] = React.useState(
      defaultSelectedId,
    );
    const currentSelected = selectedId ?? internalSelected;
    const [history, setHistory] = React.useState<string[]>([
      initialFolderId ?? root.id,
    ]);
    const [historyIndex, setHistoryIndex] = React.useState(0);
    const currentFolderId = history[historyIndex] ?? root.id;
    const currentFolder = findItem(root, currentFolderId) ?? root;

    const parents = React.useMemo(() => {
      const map = new Map<string, string | undefined>();
      buildParents(root, undefined, map);
      return map;
    }, [root]);

    const path = buildPath(root, currentFolder.id, parents);
    const items = currentFolder.children ?? [];
    const selectedItem = items.find((item) => item.id === currentSelected);

    function changeView(next: FileExplorerView) {
      if (view === undefined) {
        setInternalView(next);
      }
      onViewChange?.(next);
    }

    function select(item: FileExplorerItem) {
      if (selectedId === undefined) {
        setInternalSelected(item.id);
      }
      onSelect?.(item);
    }

    function navigateTo(id: string) {
      const folder = findItem(root, id);
      if (!folder || folder.kind !== "folder") {
        return;
      }

      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push(id);
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
      if (selectedId === undefined) {
        setInternalSelected(undefined);
      }
      onFolderChange?.(folder);
    }

    function open(item: FileExplorerItem) {
      if (item.kind === "folder") {
        navigateTo(item.id);
      }
      onOpen?.(item);
    }

    function goBack() {
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        const folder = findItem(root, history[historyIndex - 1] ?? root.id);
        if (folder) onFolderChange?.(folder);
      }
    }

    function goForward() {
      if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        const folder = findItem(root, history[historyIndex + 1] ?? root.id);
        if (folder) onFolderChange?.(folder);
      }
    }

    function goUp() {
      const parentId = parents.get(currentFolder.id);
      if (parentId) {
        navigateTo(parentId);
      }
    }

    function itemIcon(item: FileExplorerItem, size: 16 | 32 = 16) {
      return item.icon ?? <Icon name={item.kind === "folder" ? "folder" : "note"} size={size} />;
    }

    function handleItemKeyDown(
      event: React.KeyboardEvent<HTMLElement>,
      item: FileExplorerItem,
    ) {
      if (event.key === "Enter") {
        event.preventDefault();
        open(item);
      }
    }

    return (
      <div
        ref={ref}
        data-slot="file-explorer"
        className={cn(
          "bevel-window flex min-h-0 flex-col bg-surface p-[3px] text-ink",
          className,
        )}
        {...props}
      >
        <Toolbar aria-label={labels.toolbarLabel} className="border-b border-bevel-shadow">
          <ToolbarButton onClick={goBack} disabled={historyIndex === 0}>
            {labels.back}
          </ToolbarButton>
          <ToolbarButton
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
          >
            {labels.forward}
          </ToolbarButton>
          <ToolbarButton
            onClick={goUp}
            disabled={currentFolder.id === root.id}
          >
            {labels.up}
          </ToolbarButton>
          <ToolbarSeparator />
          {(
            [
              ["icons", labels.icons],
              ["list", labels.list],
              ["details", labels.details],
            ] as const
          ).map(([value, label]) => (
            <ToolbarButton
              key={value}
              pressed={currentView === value}
              onClick={() => changeView(value)}
            >
              {label}
            </ToolbarButton>
          ))}
        </Toolbar>

        <div className="flex items-center gap-2 border-b border-bevel-shadow bg-surface p-1">
          <span className="text-[11px] leading-[13px]">{labels.address}</span>
          <Input
            value={path}
            readOnly
            aria-label={labels.currentPath}
            className="h-[22px] flex-1 font-mono text-[10px]"
          />
        </div>

        <div className="grid min-h-0 flex-1 gap-1 p-1 md:grid-cols-[180px_minmax(0,1fr)]">
          <TreeView
            aria-label={labels.folders}
            value={currentFolder.id}
            onValueChange={navigateTo}
            defaultExpanded={[root.id]}
            className="max-h-28 overflow-auto md:max-h-none"
          >
            <TreeBranch item={root} />
          </TreeView>

          <div className="w95-scrollbar min-h-0 overflow-auto">
            {items.length === 0 ? (
              <p className="p-2 text-[11px] leading-[15px] text-ink-muted">
                {labels.empty}
              </p>
            ) : currentView === "icons" ? (
              <ul
                aria-label={labels.contents(currentFolder.name)}
                className="grid grid-cols-3 content-start gap-1 p-1 sm:grid-cols-4 lg:grid-cols-5"
              >
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-current={currentSelected === item.id ? "true" : undefined}
                      onClick={() => select(item)}
                      onDoubleClick={() => open(item)}
                      onKeyDown={(event) => handleItemKeyDown(event, item)}
                      className={cn(
                        "flex w-full select-none flex-col items-center gap-1 p-1 text-center",
                        "text-[10px] leading-[12px] text-ink",
                        "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
                        currentSelected === item.id
                          ? "bg-accent text-ink-inverse"
                          : "hover:bg-surface-pressed",
                      )}
                    >
                      <span className="grid h-8 w-8 place-items-center">
                        {itemIcon(item, 32)}
                      </span>
                      <span className="break-words">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : currentView === "list" ? (
              <ul aria-label={labels.contents(currentFolder.name)}>
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-current={currentSelected === item.id ? "true" : undefined}
                      onClick={() => select(item)}
                      onDoubleClick={() => open(item)}
                      onKeyDown={(event) => handleItemKeyDown(event, item)}
                      className={cn(
                        "flex h-[21px] w-full items-center gap-2 px-2 text-left text-[11px] leading-[13px]",
                        "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
                        currentSelected === item.id
                          ? "bg-accent text-ink-inverse"
                          : "hover:bg-surface-pressed",
                      )}
                    >
                      {itemIcon(item)}
                      <span className="truncate">{item.name}</span>
                      {item.size ? (
                        <span className="ml-auto pl-3 text-[10px]">{item.size}</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <Table
                aria-label={labels.contents(currentFolder.name)}
                containerClassName="bg-transparent p-0 shadow-none"
              >
                <TableHeader>
                  <TableRow>
                    <TableHead>{labels.name}</TableHead>
                    <TableHead>{labels.size}</TableHead>
                    <TableHead>{labels.type}</TableHead>
                    <TableHead>{labels.modified}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      selected={currentSelected === item.id}
                      onDoubleClick={() => open(item)}
                    >
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => select(item)}
                          onKeyDown={(event) => handleItemKeyDown(event, item)}
                          className="flex w-full items-center gap-2 text-left focus-visible:focus-dotted focus-visible:outline-offset-[-2px]"
                        >
                          {itemIcon(item)}
                          <span className="truncate">{item.name}</span>
                        </button>
                      </TableCell>
                      <TableCell>{item.size ?? "—"}</TableCell>
                      <TableCell>{item.type ?? (item.kind === "folder" ? labels.folder : labels.file)}</TableCell>
                      <TableCell>{item.modified ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <StatusBar aria-label={labels.statusLabel} className="pt-1">
          <StatusBarField>
            {labels.objects(items.length)}
          </StatusBarField>
          <StatusBarField className="max-w-[50%] flex-none">
            {selectedItem?.name ?? labels.noneSelected}
          </StatusBarField>
        </StatusBar>
      </div>
    );
  },
);

FileExplorer.displayName = "FileExplorer";

function TreeBranch({ item }: { item: FileExplorerItem }) {
  const folders = folderChildren(item);

  return (
    <TreeItem
      value={item.id}
      label={item.name}
      icon={<Icon name="folder" />}
    >
      {folders.map((folder) => (
        <TreeBranch key={folder.id} item={folder} />
      ))}
    </TreeItem>
  );
}
