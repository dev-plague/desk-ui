import {
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  Separator,
  Textarea,
} from "@deskui/ui";

import { useI18n } from "../../i18n/provider";
import {
  getBlockDefinition,
  getBlockDefinitions,
  propBoolean,
  propNumber,
  propString,
} from "../../lib/builder/catalog";
import {
  countBlocks,
  findBlock,
  getBlockPath,
} from "../../lib/builder/model";
import {
  BUILDER_BACKGROUNDS,
  type BuilderBlock,
  type BuilderBlockType,
  type BuilderDocument,
  type BuilderField,
} from "../../lib/builder/types";

function fieldId(block: BuilderBlock, field: BuilderField): string {
  return `builder-field-${block.id}-${field.key}`;
}

function FieldControl({
  block,
  field,
  onChange,
}: {
  block: BuilderBlock;
  field: BuilderField;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const id = fieldId(block, field);
  const help = field.help ? `${id}-help` : undefined;

  if (field.type === "checkbox") {
    return (
      <div className="grid gap-1">
        <Checkbox
          checked={propBoolean(block.props, field.key)}
          aria-describedby={help}
          onChange={(event) => onChange(field.key, event.currentTarget.checked)}
        >
          {field.label}
        </Checkbox>
        {field.help ? (
          <p id={help} className="text-[10px] leading-[13px] text-ink-muted">
            {field.help}
          </p>
        ) : null}
      </div>
    );
  }

  if (field.type === "select") {
    const selectValue = String(block.props[field.key] ?? "");
    return (
      <div className="grid gap-1">
        <Label htmlFor={id}>{field.label}</Label>
        <Select
          id={id}
          value={selectValue}
          aria-describedby={help}
          onChange={(event) => onChange(field.key, event.currentTarget.value)}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {field.help ? (
          <p id={help} className="text-[10px] leading-[13px] text-ink-muted">
            {field.help}
          </p>
        ) : null}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="grid gap-1">
        <Label htmlFor={id}>{field.label}</Label>
        <Textarea
          id={id}
          rows={3}
          value={propString(block.props, field.key)}
          placeholder={field.placeholder}
          aria-describedby={help}
          onChange={(event) => onChange(field.key, event.currentTarget.value)}
        />
        {field.help ? (
          <p id={help} className="text-[10px] leading-[13px] text-ink-muted">
            {field.help}
          </p>
        ) : null}
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div className="grid gap-1">
        <Label htmlFor={id}>{field.label}</Label>
        <Input
          id={id}
          type="number"
          value={propNumber(block.props, field.key)}
          placeholder={field.placeholder}
          aria-describedby={help}
          onChange={(event) => {
            const raw = event.currentTarget.value;
            onChange(field.key, raw === "" ? 0 : Number(raw));
          }}
        />
        {field.help ? (
          <p id={help} className="text-[10px] leading-[13px] text-ink-muted">
            {field.help}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-1">
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        value={propString(block.props, field.key)}
        placeholder={field.placeholder}
        aria-describedby={help}
        onChange={(event) => onChange(field.key, event.currentTarget.value)}
      />
      {field.help ? (
        <p id={help} className="text-[10px] leading-[13px] text-ink-muted">
          {field.help}
        </p>
      ) : null}
    </div>
  );
}

export interface PropertiesPanelProps {
  document: BuilderDocument;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChangeDocument: (
    patch: Partial<Pick<BuilderDocument, "title" | "background">>,
  ) => void;
  onChangeProps: (
    id: string,
    props: Record<string, string | number | boolean>,
  ) => void;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddChild: (type: BuilderBlockType) => void;
  onOpenTemplates: () => void;
  onNewPage: () => void;
}

export function PropertiesPanel({
  document,
  selectedId,
  onSelect,
  onChangeDocument,
  onChangeProps,
  onMove,
  onDuplicate,
  onDelete,
  onAddChild,
  onOpenTemplates,
  onNewPage,
}: PropertiesPanelProps) {
  const { locale, messages } = useI18n();
  const copy = messages.builder;
  const blockDefinitions = getBlockDefinitions(locale);
  const location = selectedId ? findBlock(document.blocks, selectedId) : null;
  const block = location?.block ?? null;

  if (!block) {
    return (
      <aside aria-label={copy.propertiesAria} className="grid gap-3">
        <div>
          <h2 className="text-[12px] font-bold leading-[15px]">{copy.page}</h2>
          <p className="mt-1 text-[10px] leading-[13px] text-ink-muted">
            {copy.noSelection}
          </p>
        </div>

        <div className="grid gap-1">
          <Label htmlFor="builder-page-title">{copy.pageTitle}</Label>
          <Input
            id="builder-page-title"
            value={document.title}
            onChange={(event) =>
              onChangeDocument({ title: event.currentTarget.value })
            }
          />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="builder-page-background">{copy.background}</Label>
          <Select
            id="builder-page-background"
            value={document.background}
            onChange={(event) =>
              onChangeDocument({
                background: event.currentTarget
                  .value as BuilderDocument["background"],
              })
            }
          >
            {BUILDER_BACKGROUNDS.map((background) => (
              <option key={background.value} value={background.value}>
                {copy.backgrounds[background.value]}
              </option>
            ))}
          </Select>
        </div>

        <Separator />

        <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] leading-[13px]">
          <dt className="text-ink-muted">{copy.blocksLabel}</dt>
          <dd className="font-bold">{countBlocks(document.blocks)}</dd>
          <dt className="text-ink-muted">{copy.themeLabel}</dt>
          <dd className="font-bold">{document.theme}</dd>
          <dt className="text-ink-muted">{copy.version}</dt>
          <dd className="font-bold">{document.version}</dd>
        </dl>

        <Separator />

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onOpenTemplates}>
            {copy.viewTemplates}
          </Button>
          <Button size="sm" onClick={onNewPage}>
            {copy.newPageButton}
          </Button>
        </div>
      </aside>
    );
  }

  const definition = getBlockDefinition(block.type, locale);
  const path = getBlockPath(document.blocks, block.id);
  const parentId = location?.parent?.id ?? null;

  return (
    <aside aria-label={copy.propertiesAria} className="grid gap-3">
      <div>
        <p className="text-[10px] leading-[13px] text-ink-muted">
          {path
            .map((item) => getBlockDefinition(item.type, locale).label)
            .join(" / ")}
        </p>
        <h2 className="mt-1 text-[12px] font-bold leading-[15px]">
          {definition.label}
        </h2>
        <p className="mt-1 text-[10px] leading-[13px] text-ink-muted">
          {definition.description}
        </p>
      </div>

      {definition.fields.length > 0 ? (
        <div className="grid gap-2">
          {definition.fields.map((field) => (
            <FieldControl
              key={field.key}
              block={block}
              field={field}
              onChange={(key, value) => onChangeProps(block.id, { [key]: value })}
            />
          ))}
        </div>
      ) : (
        <p className="text-[10px] leading-[13px] text-ink-muted">
          {copy.noProps}
        </p>
      )}

      {definition.container ? (
        <p className="border-t border-bevel-shadow pt-2 text-[10px] leading-[13px] text-ink-muted">
          {copy.containerHint}
        </p>
      ) : null}

      <Separator />

      <div className="flex flex-wrap gap-1">
        <Button size="sm" onClick={() => onMove(-1)}>
          {copy.up}
        </Button>
        <Button size="sm" onClick={() => onMove(1)}>
          {copy.down}
        </Button>
        <Button size="sm" onClick={onDuplicate}>
          {copy.duplicate}
        </Button>
        <Button size="sm" onClick={onDelete}>
          {copy.delete}
        </Button>
      </div>

      {parentId ? (
        <Button size="sm" onClick={() => onSelect(parentId)}>
          {copy.selectParent}
        </Button>
      ) : null}

      {definition.container ? (
        <div className="grid gap-1">
          <Label htmlFor="builder-quick-add">{copy.addInside}</Label>
          <Select
            id="builder-quick-add"
            defaultValue=""
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (value) {
                onAddChild(value as BuilderBlockType);
                event.currentTarget.value = "";
              }
            }}
          >
            <option value="">{copy.chooseBlock}</option>
            {blockDefinitions.map((item) => (
              <option key={item.type} value={item.type}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
      ) : null}
    </aside>
  );
}
