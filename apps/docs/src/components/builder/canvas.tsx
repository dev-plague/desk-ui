import { useState, type DragEvent } from "react";

import { Button, cn } from "@deskui/ui";

import { BlockView } from "./blocks";
import { useI18n } from "../../i18n/provider";
import {
  BUILDER_DND_MIME,
  parseDragPayload,
  type BuilderBackground,
  type BuilderDevice,
  type BuilderDocument,
  type BuilderDragPayload,
  type BuilderDropPosition,
} from "../../lib/builder/types";

const BACKGROUND_CLASS: Record<BuilderBackground, string> = {
  surface: "bg-surface",
  sunken: "bg-surface-sunken",
  desktop: "bg-desktop",
};

const DEVICE_WIDTH: Record<BuilderDevice, number | null> = {
  mobile: 390,
  tablet: 768,
  desktop: null,
};

export function BuilderCanvas({
  document,
  selectedId,
  device,
  onSelect,
  onDropBlock,
  onOpenTemplates,
}: {
  document: BuilderDocument;
  selectedId: string | null;
  device: BuilderDevice;
  onSelect: (id: string | null) => void;
  onDropBlock: (
    payload: BuilderDragPayload,
    targetId: string | null,
    position: BuilderDropPosition,
  ) => void;
  onOpenTemplates: () => void;
}) {
  const { messages } = useI18n();
  const copy = messages.builder;
  const [dragOver, setDragOver] = useState(false);
  const width = DEVICE_WIDTH[device];

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    const payload = parseDragPayload(event.dataTransfer.getData(BUILDER_DND_MIME));
    if (payload) {
      onDropBlock(payload, null, "after");
    }
  }

  return (
    <section
      aria-label={copy.canvas}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDragOver(true);
      }}
      onDragLeave={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          setDragOver(false);
        }
      }}
      onDrop={handleDrop}
      className="w95-scrollbar bevel-field min-w-0 overflow-auto bg-surface-pressed p-2 lg:h-full lg:min-h-0"
    >
      <div
        data-builder-page
        data-theme={document.theme}
        data-device={device}
        onClick={() => onSelect(null)}
        className={cn(
          "mx-auto min-h-[480px] w-full text-ink lg:min-h-full",
          BACKGROUND_CLASS[document.background],
          dragOver && "outline outline-2 -outline-offset-2 outline-accent",
        )}
        style={width ? { maxWidth: `${width}px` } : undefined}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 p-3 sm:p-5">
          {document.blocks.length > 0 ? (
            document.blocks.map((block) => (
              <BlockView
                key={block.id}
                block={block}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))
          ) : (
            <div className="grid min-h-[420px] place-items-center">
              <div className="bevel-window max-w-sm bg-surface p-4 text-center">
                <h2 className="text-[13px] font-bold leading-[16px]">
                  {copy.emptyTitle}
                </h2>
                <p className="mt-2 text-[11px] leading-[15px] text-ink-muted">
                  {copy.emptyBody}
                </p>
                <div className="mt-3 flex justify-center">
                  <Button variant="primary" size="sm" onClick={onOpenTemplates}>
                    {copy.useTemplate}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
