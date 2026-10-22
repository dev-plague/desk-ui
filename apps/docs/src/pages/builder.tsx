import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Label,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  cn,
  useToast,
} from "@deskui/ui";

import { BuilderCanvas } from "../components/builder/canvas";
import {
  ExportDialog,
  HelpDialog,
  ImportDialog,
  NewPageDialog,
  TemplateDialog,
} from "../components/builder/dialogs";
import { LayerTree } from "../components/builder/layers";
import { BlockPalette } from "../components/builder/palette";
import { PropertiesPanel } from "../components/builder/properties";
import { useI18n } from "../i18n/provider";
import { themeHint, themeLabel } from "../i18n/theme";
import { isBuilderBlockType } from "../lib/builder/catalog";
import { generateExportBundle } from "../lib/builder/export";
import {
  countBlocks,
  createBlankDocument,
  createBlock,
  duplicateBlock,
  findBlock,
  insertBlock,
  isContainerBlock,
  moveBlock,
  moveBlockWithinParent,
  parseBuilderDocument,
  removeBlock,
  updateBlockProps,
} from "../lib/builder/model";
import {
  clearBuilderDocument,
  loadBuilderDocument,
  saveBuilderDocument,
} from "../lib/builder/storage";
import { findBuilderTemplate } from "../lib/builder/templates";
import {
  BUILDER_DEVICES,
  BUILDER_THEMES,
  type BuilderBlockType,
  type BuilderDevice,
  type BuilderDocument,
  type BuilderDragPayload,
  type BuilderDropPosition,
} from "../lib/builder/types";
import { THEMES } from "../lib/theme";

type InspectorTab = "properties" | "layers";

function formatTime(date: Date, locale: "es" | "en") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function isInteractiveTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return Boolean(
    element?.closest(
      "input, textarea, select, button, a, [contenteditable='true']",
    ),
  );
}

export function BuilderPage() {
  const { locale, messages, t } = useI18n();
  const copy = messages.builder;
  const { toast } = useToast();
  const [doc, setDoc] = useState<BuilderDocument>(
    () => loadBuilderDocument() ?? createBlankDocument(locale),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<BuilderDevice>("desktop");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("properties");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">(
    "saved",
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const blockCount = countBlocks(doc.blocks);
  const exportBundle = useMemo(
    () => generateExportBundle(doc, locale),
    [doc, locale],
  );

  useEffect(() => {
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      const ok = saveBuilderDocument(doc);
      setSaveState(ok ? "saved" : "error");
      if (ok) {
        setSavedAt(formatTime(new Date(), locale));
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [doc]);

  useEffect(() => {
    if (selectedId && !findBlock(doc.blocks, selectedId)) {
      setSelectedId(null);
    }
  }, [doc.blocks, selectedId]);

  function saveNow() {
    const ok = saveBuilderDocument(doc);
    setSaveState(ok ? "saved" : "error");
    if (ok) {
      setSavedAt(formatTime(new Date(), locale));
      toast({ title: copy.savedToast, description: copy.savedToastBody });
    } else {
      toast({
        title: copy.saveFailed,
        description: copy.saveFailedBody,
      });
    }
  }

  function addBlockAt(
    type: BuilderBlockType,
    targetId: string | null,
    position: BuilderDropPosition,
  ) {
    const block = createBlock(type, {}, [], locale);
    setDoc((current) => ({
      ...current,
      blocks: insertBlock(current.blocks, block, targetId, position),
    }));
    setSelectedId(block.id);
    setInspectorTab("properties");
  }

  function addBlock(type: BuilderBlockType) {
    const block = createBlock(type, {}, [], locale);
    setDoc((current) => {
      const location = selectedId
        ? findBlock(current.blocks, selectedId)
        : null;
      if (!location) {
        return {
          ...current,
          blocks: insertBlock(current.blocks, block, null, "after"),
        };
      }
      if (isContainerBlock(location.block)) {
        return {
          ...current,
          blocks: insertBlock(current.blocks, block, location.block.id, "inside"),
        };
      }
      return {
        ...current,
        blocks: insertBlock(current.blocks, block, location.block.id, "after"),
      };
    });
    setSelectedId(block.id);
    setInspectorTab("properties");
  }

  function handleDropBlock(
    payload: BuilderDragPayload,
    targetId: string | null,
    position: BuilderDropPosition,
  ) {
    if (payload.kind === "new") {
      if (!isBuilderBlockType(payload.type)) {
        return;
      }
      addBlockAt(payload.type, targetId, position);
      return;
    }

    setDoc((current) => ({
      ...current,
      blocks: moveBlock(current.blocks, payload.id, targetId, position),
    }));
    setSelectedId(payload.id);
  }

  function moveSelected(direction: -1 | 1) {
    if (!selectedId) {
      return;
    }
    setDoc((current) => ({
      ...current,
      blocks: moveBlockWithinParent(current.blocks, selectedId, direction),
    }));
  }

  function duplicateSelected() {
    if (!selectedId) {
      return;
    }
    const result = duplicateBlock(doc.blocks, selectedId);
    if (!result) {
      return;
    }
    setDoc({ ...doc, blocks: result.blocks });
    setSelectedId(result.newId);
    setInspectorTab("properties");
    toast({ title: copy.blockDuplicated });
  }

  function deleteSelected() {
    if (!selectedId) {
      return;
    }
    const location = findBlock(doc.blocks, selectedId);
    const parentId = location?.parent?.id ?? null;
    setDoc({ ...doc, blocks: removeBlock(doc.blocks, selectedId) });
    setSelectedId(parentId);
    setInspectorTab("properties");
    toast({ title: copy.blockDeleted });
  }

  function changeDocument(
    patch: Partial<Pick<BuilderDocument, "title" | "background">>,
  ) {
    setDoc((current) => ({ ...current, ...patch }));
  }

  function changeProps(
    id: string,
    props: Record<string, string | number | boolean>,
  ) {
    setDoc((current) => ({
      ...current,
      blocks: updateBlockProps(current.blocks, id, props),
    }));
  }

  function applyTemplate(templateId: string) {
    const template = findBuilderTemplate(templateId, locale);
    if (!template) {
      return;
    }
    setDoc(template.create());
    setSelectedId(null);
    setTemplatesOpen(false);
    setNewPageOpen(false);
    setInspectorTab("properties");
    toast({
      title: copy.templateApplied,
      description: template.label,
    });
  }

  function createNewPage() {
    setDoc(createBlankDocument(locale));
    setSelectedId(null);
    clearBuilderDocument();
    setNewPageOpen(false);
    setInspectorTab("properties");
    toast({ title: copy.newPage, description: copy.newPageBody });
  }

  function handleImport(raw: string) {
    try {
      const next = parseBuilderDocument(raw);
      setDoc(next);
      setSelectedId(null);
      setImportOpen(false);
      setImportError(null);
      setInspectorTab("properties");
      toast({
        title: copy.imported,
        description: t("builder.importedBody", {
          count: countBlocks(next.blocks),
        }),
      });
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : copy.invalidJson,
      );
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveNow();
        return;
      }

      if (isInteractiveTarget(event.target)) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        duplicateSelected();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedId) {
          event.preventDefault();
          deleteSelected();
        }
        return;
      }

      if (event.altKey && event.key === "ArrowUp") {
        event.preventDefault();
        moveSelected(-1);
        return;
      }

      if (event.altKey && event.key === "ArrowDown") {
        event.preventDefault();
        moveSelected(1);
        return;
      }

      if (event.key === "Escape") {
        setSelectedId(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const saveLabel =
    saveState === "saving"
      ? copy.saving
      : saveState === "error"
        ? copy.saveError
        : savedAt
          ? t("builder.savedAt", { time: savedAt })
          : copy.saved;

  return (
    <div className="flex min-h-0 flex-col gap-2 lg:h-full">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] leading-[13px] text-ink-muted">
            {copy.eyebrow}
          </p>
          <h1 className="mt-1 text-[18px] font-bold leading-[22px]">
            {copy.title}
          </h1>
          <p className="mt-1 max-w-2xl text-[11px] leading-[15px] text-ink-muted">
            {copy.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setTemplatesOpen(true)}>
            {copy.templates}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setImportError(null);
              setImportOpen(true);
            }}
          >
            {copy.import}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setExportOpen(true)}
          >
            {copy.export}
          </Button>
        </div>
      </header>

      <Toolbar
        aria-label={copy.toolbar}
        className="bevel-raised shrink-0 gap-1 px-2 py-1"
      >
        <ToolbarGroup aria-label={copy.deviceGroup}>
          {BUILDER_DEVICES.map((item) => (
            <ToolbarButton
              key={item.value}
              pressed={device === item.value}
              onClick={() => setDevice(item.value)}
            >
              {messages.builder.devices[item.value]}
            </ToolbarButton>
          ))}
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup aria-label={copy.themeGroup}>
          <Label htmlFor="builder-theme" className="px-1">
            {copy.theme}
          </Label>
          <Select
            id="builder-theme"
            value={doc.theme}
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (BUILDER_THEMES.includes(value as BuilderDocument["theme"])) {
                setDoc((current) => ({
                  ...current,
                  theme: value as BuilderDocument["theme"],
                }));
              }
            }}
            className="h-[22px] w-36"
          >
            {THEMES.map((theme) => (
              <option
                key={theme.id}
                value={theme.id}
                title={themeHint(messages, theme.id)}
              >
                {themeLabel(messages, theme.id)}
              </option>
            ))}
          </Select>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup aria-label={copy.actionsGroup}>
          <ToolbarButton
            disabled={!selectedId}
            onClick={() => moveSelected(-1)}
          >
            {copy.up}
          </ToolbarButton>
          <ToolbarButton disabled={!selectedId} onClick={() => moveSelected(1)}>
            {copy.down}
          </ToolbarButton>
          <ToolbarButton disabled={!selectedId} onClick={duplicateSelected}>
            {copy.duplicate}
          </ToolbarButton>
          <ToolbarButton disabled={!selectedId} onClick={deleteSelected}>
            {copy.delete}
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarButton onClick={() => setHelpOpen(true)}>{copy.help}</ToolbarButton>

        <span
          role="status"
          aria-live="polite"
          className={cn(
            "ml-auto px-1 text-[10px] leading-[13px]",
            saveState === "error" ? "text-danger" : "text-ink-muted",
          )}
        >
          {saveLabel}
        </span>
      </Toolbar>

      <div className="grid min-w-0 gap-2 lg:min-h-0 lg:flex-1 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <div className="order-2 min-w-0 lg:order-1 lg:min-h-0">
          <BlockPalette onAdd={addBlock} />
        </div>

        <div className="order-1 min-w-0 lg:order-2 lg:min-h-0">
          <BuilderCanvas
            document={doc}
            selectedId={selectedId}
            device={device}
            onSelect={setSelectedId}
            onDropBlock={handleDropBlock}
            onOpenTemplates={() => setTemplatesOpen(true)}
          />
        </div>

        <aside
          aria-label={copy.inspector}
          className="order-3 min-w-0 lg:flex lg:min-h-0 lg:flex-col"
        >
          <Tabs
            value={inspectorTab}
            onValueChange={(value) => setInspectorTab(value as InspectorTab)}
            className="lg:flex lg:h-full lg:min-h-0 lg:flex-col"
          >
            <TabsList aria-label={copy.inspectorTabs} className="shrink-0">
              <TabsTrigger value="properties">{copy.properties}</TabsTrigger>
              <TabsTrigger value="layers">{copy.layers}</TabsTrigger>
            </TabsList>
            <TabsContent
              value="properties"
              className="mt-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
            >
              <PropertiesPanel
                document={doc}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onChangeDocument={changeDocument}
                onChangeProps={changeProps}
                onMove={moveSelected}
                onDuplicate={duplicateSelected}
                onDelete={deleteSelected}
                onAddChild={addBlock}
                onOpenTemplates={() => setTemplatesOpen(true)}
                onNewPage={() => setNewPageOpen(true)}
              />
            </TabsContent>
            <TabsContent
              value="layers"
              className="mt-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
            >
              <LayerTree
                blocks={doc.blocks}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDropBlock={handleDropBlock}
              />
            </TabsContent>
          </Tabs>
        </aside>
      </div>

      <TemplateDialog
        open={templatesOpen}
        onOpenChange={setTemplatesOpen}
        onApply={applyTemplate}
        blockCount={blockCount}
      />
      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={doc.title}
        jsx={exportBundle.jsx}
        json={exportBundle.json}
        commands={exportBundle.commands}
      />
      <ImportDialog
        open={importOpen}
        onOpenChange={(open) => {
          setImportOpen(open);
          if (open) {
            setImportError(null);
          }
        }}
        onImport={handleImport}
        error={importError}
      />
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
      <NewPageDialog
        open={newPageOpen}
        onOpenChange={setNewPageOpen}
        onConfirm={createNewPage}
      />
    </div>
  );
}
