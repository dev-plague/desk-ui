import { useEffect, useState } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  Icon,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@deskui/ui";

import { CodeBlock } from "../docs/doc-ui";
import { useI18n } from "../../i18n/provider";
import { getBuilderTemplates } from "../../lib/builder/templates";

export function TemplateDialog({
  open,
  onOpenChange,
  onApply,
  blockCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (templateId: string) => void;
  blockCount: number;
}) {
  const { locale, t, messages } = useI18n();
  const copy = messages.builder.dialog;
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={copy.templatesTitle}
      icon={<Icon name="palette" />}
      className="max-w-2xl"
      footer={
        <Button size="sm" onClick={() => onOpenChange(false)}>
          {copy.cancel}
        </Button>
      }
    >
      <Alert variant="warning">
        <AlertTitle>{copy.replaceTitle}</AlertTitle>
        <AlertDescription>
          {blockCount > 0
            ? t("builder.dialog.replaceBody", { count: blockCount })
            : copy.replaceEmpty}
        </AlertDescription>
      </Alert>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {getBuilderTemplates(locale).map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{template.label}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-wrap content-start gap-1">
              {template.highlights.map((highlight) => (
                <Badge key={highlight}>{highlight}</Badge>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                size="sm"
                variant={template.id === "blank" ? "default" : "primary"}
                aria-label={t("builder.dialog.useTemplateAria", { name: template.label })}
                onClick={() => onApply(template.id)}
              >
                {copy.useTemplate}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Dialog>
  );
}

export function ExportDialog({
  open,
  onOpenChange,
  title,
  jsx,
  json,
  commands,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  jsx: string;
  json: string;
  commands: string;
}) {
  const { t, messages } = useI18n();
  const copy = messages.builder.dialog;
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={copy.exportTitle}
      icon={<Icon name="note" />}
      className="max-w-3xl"
      footer={
        <Button size="sm" onClick={() => onOpenChange(false)}>
          {copy.close}
        </Button>
      }
    >
      <p className="mb-2 text-[11px] leading-[15px] text-ink-muted">
        {t("builder.dialog.exportBody", { title })}
      </p>
      <Tabs defaultValue="jsx">
        <TabsList aria-label={copy.formats}>
          <TabsTrigger value="jsx">{copy.jsx}</TabsTrigger>
          <TabsTrigger value="json">{copy.json}</TabsTrigger>
          <TabsTrigger value="commands">{copy.commands}</TabsTrigger>
        </TabsList>
        <TabsContent value="jsx">
          <p className="mb-2 text-[11px] leading-[15px]">
            {copy.jsxBody}
          </p>
          <CodeBlock code={jsx} />
        </TabsContent>
        <TabsContent value="json">
          <p className="mb-2 text-[11px] leading-[15px]">
            {copy.jsonBody}
          </p>
          <CodeBlock code={json} />
        </TabsContent>
        <TabsContent value="commands">
          <p className="mb-2 text-[11px] leading-[15px]">
            {copy.commandsBody}
          </p>
          <CodeBlock code={commands} />
        </TabsContent>
      </Tabs>
    </Dialog>
  );
}

export function ImportDialog({
  open,
  onOpenChange,
  onImport,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (raw: string) => void;
  error: string | null;
}) {
  const { messages } = useI18n();
  const copy = messages.builder.dialog;
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) {
      setValue("");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={copy.importTitle}
      icon={<Icon name="folder" />}
      className="max-w-2xl"
      footer={
        <>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            {copy.importCancel}
          </Button>
          <Button
            size="sm"
            variant="primary"
            disabled={value.trim().length === 0}
            onClick={() => onImport(value)}
          >
            {copy.importAction}
          </Button>
        </>
      }
    >
      <div className="grid gap-1">
        <Label htmlFor="builder-import-json">{copy.jsonLabel}</Label>
        <Textarea
          id="builder-import-json"
          rows={10}
          value={value}
          placeholder={copy.jsonPlaceholder}
          onChange={(event) => setValue(event.currentTarget.value)}
          className="font-mono text-[10px] leading-[14px]"
        />
        <p className="text-[10px] leading-[13px] text-ink-muted">
          {copy.importHelp}
        </p>
      </div>

      {error ? (
        <Alert variant="danger" className="mt-2">
          <AlertTitle>{copy.importFailed}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </Dialog>
  );
}

export function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { messages } = useI18n();
  const copy = messages.builder.dialog;
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={copy.helpTitle}
      icon={<Icon name="info" />}
      className="max-w-2xl"
      footer={
        <Button size="sm" onClick={() => onOpenChange(false)}>
          {copy.helpClose}
        </Button>
      }
    >
      <div className="grid gap-3 text-[11px] leading-[15px]">
        <section>
          <h3 className="text-[12px] font-bold leading-[15px]">{copy.flowTitle}</h3>
          <ol className="mt-1 grid list-decimal gap-1 pl-4">
            {copy.flowItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
        <section>
          <h3 className="text-[12px] font-bold leading-[15px]">{copy.shortcutsTitle}</h3>
          <ul className="mt-1 grid gap-1">
            {copy.shortcuts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-[12px] font-bold leading-[15px]">{copy.savingTitle}</h3>
          <p className="mt-1">
            {copy.savingBody}
          </p>
        </section>
      </div>
    </Dialog>
  );
}

export function NewPageDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const { messages } = useI18n();
  const copy = messages.builder.dialog;
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={copy.newPageTitle}
      icon={<Icon name="warning" />}
      footer={
        <>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            {copy.importCancel}
          </Button>
          <Button size="sm" variant="primary" onClick={onConfirm}>
            {copy.createPage}
          </Button>
        </>
      }
    >
      <p className="text-[12px] leading-[16px]">
        {copy.newPageBody}
      </p>
    </Dialog>
  );
}
