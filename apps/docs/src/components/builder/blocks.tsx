import type * as React from "react";

import { useI18n } from "../../i18n/provider";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  GroupBox,
  Icon,
  Input,
  Label,
  Panel,
  PanelBody,
  PanelHeader,
  PanelTitle,
  ProgressBar,
  Separator,
  StatusBar,
  StatusBarField,
  Textarea,
  Window,
  cn,
  type AlertProps,
  type BadgeProps,
  type ButtonProps,
  type IconName,
  type PanelProps,
} from "@deskui/ui";

import {
  BUILDER_ICON_NAMES,
  getBlockDefinition,
  propBoolean,
  propNumber,
  propString,
} from "../../lib/builder/catalog";
import type { BuilderBlock } from "../../lib/builder/types";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;
type AlertVariant = NonNullable<AlertProps["variant"]>;
type ButtonVariant = NonNullable<ButtonProps["variant"]>;
type PanelVariant = NonNullable<PanelProps["variant"]>;

const ALIGN_TEXT: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const ALIGN_FLEX: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

function asBadgeVariant(value: string): BadgeVariant {
  return value === "info" ||
    value === "success" ||
    value === "warning" ||
    value === "danger"
    ? value
    : "default";
}

function asAlertVariant(value: string): AlertVariant {
  return value === "success" || value === "warning" || value === "danger"
    ? value
    : "info";
}

function asButtonVariant(value: string): ButtonVariant {
  return value === "primary" ? "primary" : "default";
}

function asPanelVariant(value: string): PanelVariant {
  return value === "sunken" || value === "window" || value === "flat"
    ? value
    : "raised";
}

function asIconName(value: string): IconName {
  return (BUILDER_ICON_NAMES.includes(value) ? value : "folder") as IconName;
}

function EmptyContainer() {
  const { messages } = useI18n();
  return (
    <div className="bevel-field grid min-h-12 place-items-center bg-surface-sunken p-2 text-center text-[10px] leading-[13px] text-ink-muted">
      {messages.builder.emptyContainer}
    </div>
  );
}

function Children({
  block,
  selectedId,
  onSelect,
}: {
  block: BuilderBlock;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const children = block.children ?? [];
  if (children.length === 0) {
    return <EmptyContainer />;
  }

  return (
    <>
      {children.map((child) => (
        <BlockView
          key={child.id}
          block={child}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function BlockContent({
  block,
  selectedId,
  onSelect,
}: {
  block: BuilderBlock;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { messages } = useI18n();
  const copy = messages.builder;
  const props = block.props;

  switch (block.type) {
    case "heading": {
      const level = propString(props, "level", "h2");
      const Tag = level === "h1" ? "h1" : level === "h3" ? "h3" : "h2";
      const size =
        level === "h1"
          ? "text-[18px] leading-[22px]"
          : level === "h3"
            ? "text-[13px] leading-[16px]"
            : "text-[15px] leading-[19px]";
      return (
        <Tag
          className={cn(
            "font-bold",
            size,
            ALIGN_TEXT[propString(props, "align", "left")] ?? "text-left",
          )}
        >
          {propString(props, "text", copy.fallbackTitle)}
        </Tag>
      );
    }

    case "text":
      return (
        <p
          className={cn(
            "whitespace-pre-line text-[12px] leading-[16px]",
            propBoolean(props, "muted") && "text-ink-muted",
            ALIGN_TEXT[propString(props, "align", "left")] ?? "text-left",
          )}
        >
          {propString(props, "text")}
        </p>
      );

    case "list": {
      const numbered = propString(props, "style") === "numbered";
      const Tag = numbered ? "ol" : "ul";
      const items = propString(props, "items")
        .split("\n")
        .filter((item) => item.trim().length > 0);
      return (
        <Tag
          className={cn(
            "grid gap-1 pl-4 text-[11px] leading-[15px]",
            numbered ? "list-decimal" : "list-disc",
          )}
        >
          {items.map((item, index) => (
            <li key={`${block.id}-item-${index}`}>{item}</li>
          ))}
        </Tag>
      );
    }

    case "badge":
      return (
        <Badge variant={asBadgeVariant(propString(props, "variant", "default"))}>
          {propString(props, "text", "Etiqueta")}
        </Badge>
      );

    case "button":
      return (
        <div
          className={cn(
            "flex",
            ALIGN_FLEX[propString(props, "align", "left")] ?? "justify-start",
          )}
        >
          <Button
            variant={asButtonVariant(propString(props, "variant", "default"))}
          >
            {propString(props, "label", "Aceptar")}
          </Button>
        </div>
      );

    case "image": {
      const size = propNumber(props, "size", 32) === 16 ? 16 : 32;
      return (
        <figure className="flex flex-col items-center gap-1">
          <div className="bevel-sunken bg-surface p-2">
            <Icon name={asIconName(propString(props, "name", "folder"))} size={size} />
          </div>
          <figcaption className="text-[11px] leading-[13px] text-ink-muted">
            {propString(props, "caption", copy.fallbackIllustration)}
          </figcaption>
        </figure>
      );
    }

    case "divider":
      return <Separator />;

    case "spacer": {
      const size = propString(props, "size", "md");
      return (
        <div
          aria-hidden="true"
          className={size === "sm" ? "h-2" : size === "lg" ? "h-8" : "h-4"}
        />
      );
    }

    case "input": {
      const label = propString(props, "label", "Nombre");
      const id = `campo-${block.id}`;
      return (
        <div className="grid gap-1">
          <Label htmlFor={id}>{label}</Label>
          <Input
            key={`${block.id}-${label}-${propString(props, "placeholder")}`}
            id={id}
            type={
              propString(props, "inputType", "text") as React.ComponentProps<"input">["type"]
            }
            placeholder={propString(props, "placeholder")}
            required={propBoolean(props, "required")}
          />
        </div>
      );
    }

    case "textarea": {
      const label = propString(props, "label", "Comentarios");
      const id = `campo-${block.id}`;
      return (
        <div className="grid gap-1">
          <Label htmlFor={id}>{label}</Label>
          <Textarea
            key={`${block.id}-${label}-${propString(props, "placeholder")}`}
            id={id}
            rows={Math.max(1, Math.min(20, Math.round(propNumber(props, "rows", 3))))}
            placeholder={propString(props, "placeholder")}
          />
        </div>
      );
    }

    case "checkbox": {
      const checked = propBoolean(props, "checked");
      return (
        <Checkbox key={`${block.id}-${checked}`} defaultChecked={checked}>
          {propString(props, "label", "Casilla")}
        </Checkbox>
      );
    }

    case "progress": {
      const label = propString(props, "label", "Progreso");
      return (
        <div className="grid gap-1">
          <span className="text-[11px] leading-[13px]">{label}</span>
          <ProgressBar
            aria-label={label}
            value={Math.max(0, Math.min(100, propNumber(props, "value", 0)))}
          />
        </div>
      );
    }

    case "alert":
      return (
        <Alert variant={asAlertVariant(propString(props, "variant", "info"))}>
          <AlertTitle>{propString(props, "title", "Aviso")}</AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {propString(props, "description")}
          </AlertDescription>
        </Alert>
      );

    case "card": {
      const title = propString(props, "title");
      const description = propString(props, "description");
      return (
        <Card>
          {title || description ? (
            <CardHeader>
              {title ? <CardTitle>{title}</CardTitle> : null}
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : null}
            </CardHeader>
          ) : null}
          <CardContent className="grid gap-2">
            <Children block={block} selectedId={selectedId} onSelect={onSelect} />
          </CardContent>
        </Card>
      );
    }

    case "panel":
      return (
        <Panel variant={asPanelVariant(propString(props, "variant", "raised"))}>
          {propString(props, "title") ? (
            <PanelHeader>
              <PanelTitle>{propString(props, "title")}</PanelTitle>
            </PanelHeader>
          ) : null}
          <PanelBody className="grid gap-2">
            <Children block={block} selectedId={selectedId} onSelect={onSelect} />
          </PanelBody>
        </Panel>
      );

    case "window": {
      const status = propString(props, "status");
      return (
        <Window active={propBoolean(props, "active", true)}>
          <Window.TitleBar title={propString(props, "title", copy.fallbackUntitled)} />
          <Window.Body className="grid gap-2">
            <Children block={block} selectedId={selectedId} onSelect={onSelect} />
          </Window.Body>
          {status ? (
            <Window.StatusBar>
              <Window.StatusField>{status}</Window.StatusField>
            </Window.StatusBar>
          ) : null}
        </Window>
      );
    }

    case "group-box":
      return (
        <GroupBox legend={propString(props, "legend", copy.fallbackGroup)}>
          <div className="grid gap-2">
            <Children block={block} selectedId={selectedId} onSelect={onSelect} />
          </div>
        </GroupBox>
      );

    case "columns": {
      const columns = propNumber(props, "columns", 2) === 3 ? 3 : 2;
      return (
        <div
          className={cn(
            "grid gap-3",
            columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
          )}
        >
          <Children block={block} selectedId={selectedId} onSelect={onSelect} />
        </div>
      );
    }

    case "hero": {
      const align = propString(props, "align", "left");
      return (
        <section
          className={cn(
            "bevel-window bg-surface p-4",
            ALIGN_TEXT[align] ?? "text-left",
          )}
        >
          {propString(props, "eyebrow") ? (
            <p className="text-[11px] leading-[13px] text-ink-muted">
              {propString(props, "eyebrow")}
            </p>
          ) : null}
          <h1 className="mt-1 text-[20px] font-bold leading-[24px]">
            {propString(props, "title", copy.fallbackTitle)}
          </h1>
          {propString(props, "description") ? (
            <p className="mt-2 max-w-2xl whitespace-pre-line text-[12px] leading-[16px]">
              {propString(props, "description")}
            </p>
          ) : null}
          {propString(props, "buttonLabel") ? (
            <div className={cn("mt-3 flex", ALIGN_FLEX[align] ?? "justify-start")}>
              <Button
                variant={asButtonVariant(
                  propString(props, "buttonVariant", "primary"),
                )}
              >
                {propString(props, "buttonLabel")}
              </Button>
            </div>
          ) : null}
        </section>
      );
    }

    case "status-bar":
      return (
        <StatusBar>
          <StatusBarField>{propString(props, "left", "Listo.")}</StatusBarField>
          <StatusBarField>
            {propString(props, "right", "DeskUI")}
          </StatusBarField>
        </StatusBar>
      );
  }
}

export interface BlockViewProps {
  block: BuilderBlock;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * Envuelve cada bloque con una capa seleccionable. El árbol de capas es la
 * alternativa de teclado principal; el lienzo también acepta Enter/Space.
 */
export function BlockView({ block, selectedId, onSelect }: BlockViewProps) {
  const { locale } = useI18n();
  const definition = getBlockDefinition(block.type, locale);
  const selected = selectedId === block.id;

  return (
    <div
      data-block-id={block.id}
      data-block-type={block.type}
      data-selected={selected || undefined}
      role="group"
      aria-label={`${definition.label}: ${definition.summary(block.props)}`}
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(block.id);
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onSelect(block.id);
        }
      }}
      className={cn(
        "relative outline-offset-2",
        selected
          ? "outline outline-2 outline-accent"
          : "hover:outline hover:outline-1 hover:outline-dashed hover:outline-bevel-shadow",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
      )}
    >
      {selected ? (
        <span className="absolute -top-[15px] left-0 z-10 bg-accent px-1 text-[9px] leading-[13px] text-ink-inverse">
          {definition.label}
        </span>
      ) : null}
      <BlockContent
        block={block}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </div>
  );
}
