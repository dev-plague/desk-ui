import { Button, Icon, cn } from "@deskui/ui";

import {
  BLOCK_DEFINITIONS,
  BUILDER_CATEGORIES,
  getBlockDefinitions,
} from "../../lib/builder/catalog";
import { useI18n } from "../../i18n/provider";
import {
  BUILDER_DND_MIME,
  type BuilderBlockType,
} from "../../lib/builder/types";

export function BlockPalette({
  onAdd,
}: {
  onAdd: (type: BuilderBlockType) => void;
}) {
  const { locale, messages } = useI18n();
  const copy = messages.builder;
  const blockDefinitions = getBlockDefinitions(locale);
  return (
    <aside
      aria-label={copy.palette}
      className={cn(
        "bevel-window bg-surface p-2",
        "max-h-[260px] overflow-y-auto",
        "lg:flex lg:h-full lg:max-h-none lg:min-h-0 lg:flex-col lg:overflow-y-auto",
      )}
    >
      <h2 className="text-[12px] font-bold leading-[15px]">{copy.blocks}</h2>
      <p className="mt-1 text-[10px] leading-[13px] text-ink-muted">
        {copy.paletteHint}
      </p>

      <div className="mt-2 grid gap-3">
        {BUILDER_CATEGORIES.map((category) => {
          const definitions = blockDefinitions.filter(
            (definition) => definition.category === category,
          );
          if (definitions.length === 0) {
            return null;
          }

          const headingId = `palette-${category}`;
          return (
            <section key={category} aria-labelledby={headingId}>
              <h3
                id={headingId}
                className="mb-1 border-b border-bevel-shadow pb-1 text-[10px] font-bold uppercase leading-[13px] text-ink-muted"
              >
                {copy.categories[category]}
              </h3>
              <ul className="grid grid-cols-2 gap-1">
                {definitions.map((definition) => (
                  <li key={definition.type}>
                    <Button
                      size="sm"
                      draggable
                      title={definition.description}
                      onClick={() => onAdd(definition.type)}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "copy";
                        event.dataTransfer.setData(
                          BUILDER_DND_MIME,
                          JSON.stringify({
                            kind: "new",
                            type: definition.type,
                          }),
                        );
                      }}
                      className="h-[24px] w-full min-w-0 justify-start gap-1.5 px-1.5 text-left text-[11px] leading-[13px]"
                    >
                      <Icon name={definition.icon} />
                      <span className="truncate">{definition.label}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-3 border-t border-bevel-shadow pt-2 text-[10px] leading-[13px] text-ink-muted lg:mt-auto">
        {messages.builder.paletteFooter
          .replace("{blocks}", String(BLOCK_DEFINITIONS.length))
          .replace(
            "{containers}",
            String(
              BLOCK_DEFINITIONS.filter(
                (definition) => definition.container,
              ).length,
            ),
          )}
      </p>
    </aside>
  );
}
