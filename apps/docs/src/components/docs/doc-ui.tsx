import { useState, type ReactNode } from "react";

import { Button, cn } from "@deskui/ui";

import { useI18n } from "../../i18n/provider";

export interface PropRow {
  prop: string;
  type: string;
  default?: string;
  description: string;
}

export function CopyButton({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard puede estar bloqueado en un contexto no seguro.
    }
  }

  return (
    <Button size="sm" onClick={copy} className="min-w-0 px-2">
      {copied ? t("common.copied") : (label ?? t("common.copy"))}
    </Button>
  );
}

export function CodeBlock({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <pre
        className={cn(
          "bevel-field w95-scrollbar overflow-x-auto bg-surface-sunken",
          "px-2 py-2 pr-20 font-mono text-[11px] leading-[15px]",
        )}
      >
        <code>{code}</code>
      </pre>
      <div className="absolute right-1 top-1">
        <CopyButton value={code} />
      </div>
    </div>
  );
}

export function InstallCommand({ command }: { command: string }) {
  return (
    <div className="bevel-field flex items-center gap-2 bg-surface-sunken px-2 py-1">
      <span aria-hidden="true" className="font-mono text-[11px] text-ink-muted">
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[11px] leading-[15px]">
        {command}
      </code>
      <CopyButton value={command} />
    </div>
  );
}

export function PreviewBox({
  preview,
  code,
  label,
}: {
  preview: ReactNode;
  code: string;
  label?: string;
}) {
  const { t } = useI18n();
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <div className="grid gap-2">
      <div
        role="group"
        aria-label={t("docUi.previewGroup", { label: label ?? t("docUi.preview") })}
        className="flex flex-wrap gap-2"
      >
        <Button
          size="sm"
          aria-pressed={view === "preview"}
          onClick={() => setView("preview")}
        >
          {t("docUi.preview")}
        </Button>
        <Button
          size="sm"
          aria-pressed={view === "code"}
          onClick={() => setView("code")}
        >
          {t("docUi.code")}
        </Button>
      </div>
      {view === "preview" ? (
        <div className="bevel-window min-h-24 bg-surface p-4">
          <div className="flex min-h-16 flex-wrap items-center gap-3">
            {preview}
          </div>
        </div>
      ) : (
        <CodeBlock code={code} />
      )}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-4">
      {eyebrow ? (
        <p className="text-[11px] leading-[13px] text-ink-muted">{eyebrow}</p>
      ) : null}
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-[18px] font-bold leading-[22px]">{title}</h1>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {description ? (
        <p className="mt-2 max-w-2xl text-[12px] leading-[16px] text-ink">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export function DocSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-5", className)}>
      <h2 className="mb-2 text-[13px] font-bold leading-[16px]">{title}</h2>
      {children}
    </section>
  );
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  const { t } = useI18n();
  return (
    <div className="bevel-window overflow-x-auto bg-surface p-[3px]">
      <table className="w-full min-w-[560px] border-collapse bg-surface-sunken text-left text-[11px] leading-[15px]">
        <thead>
          <tr>
            {[
              t("docUi.prop"),
              t("docUi.type"),
              t("docUi.default"),
              t("docUi.description"),
            ].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="bevel-raised bg-surface px-2 py-1 font-normal"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.prop} className="border-t border-bevel-light">
              <td className="px-2 py-1 align-top">
                <code className="font-mono">{row.prop}</code>
              </td>
              <td className="px-2 py-1 align-top">
                <code className="font-mono text-ink-muted">{row.type}</code>
              </td>
              <td className="px-2 py-1 align-top">
                {row.default ? (
                  <code className="font-mono text-ink-muted">{row.default}</code>
                ) : (
                  <span className="text-ink-muted">—</span>
                )}
              </td>
              <td className="px-2 py-1 align-top">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
