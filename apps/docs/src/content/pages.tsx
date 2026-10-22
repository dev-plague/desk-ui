import {
  Button,
  Checkbox,
  GroupBox,
  Input,
  Label,
  Window,
  cn,
} from "@deskui/ui";

import {
  CodeBlock,
  DocSection,
  InstallCommand,
  PageHeader,
  PreviewBox,
  PropsTable,
} from "../components/docs/doc-ui";
import {
  NoteIcon,
  PaletteIcon,
  WarningIcon,
} from "../components/icons";
import { useI18n } from "../i18n/provider";
import { themeHint, themeLabel } from "../i18n/theme";
import { THEMES, type ThemeId } from "../lib/theme";
import { getComponentManifest } from "./manifest";
import type { ComponentDoc } from "./components";

export function HomePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { locale, messages } = useI18n();
  const copy = messages.pages.home;
  const manifest = getComponentManifest(locale);
  return (
    <div>
      <PageHeader
        eyebrow={copy.eyebrow}
        title="DeskUI"
        description={copy.description}
        actions={
          <>
            <Button variant="primary" onClick={() => onNavigate("/instalacion")}>
              {copy.start}
            </Button>
            <Button onClick={() => onNavigate("/constructor")}>
              {copy.openBuilder}
            </Button>
            <Button onClick={() => onNavigate("/componentes")}>
              {copy.viewComponents}
            </Button>
          </>
        }
      />

      <InstallCommand command="npx deskui init" />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <GroupBox legend={copy.copyOwn}>
          <p className="text-[11px] leading-[15px]">
            {copy.copyOwnBody}
          </p>
        </GroupBox>
        <GroupBox legend={copy.tokens}>
          <p className="text-[11px] leading-[15px]">
            {copy.tokensBody}
          </p>
        </GroupBox>
        <GroupBox legend={copy.accessible}>
          <p className="text-[11px] leading-[15px]">
            {copy.accessibleBody}
          </p>
        </GroupBox>
      </div>

      <DocSection title={copy.quickView}>
        <div className="bevel-window bg-surface p-3">
          <Window active={false} className="mx-auto max-w-md">
            <Window.TitleBar title={copy.form} icon={<NoteIcon />} />
            <Window.Body className="grid gap-2">
              <Label htmlFor="home-usuario">{copy.user}</Label>
              <Input id="home-usuario" defaultValue="usuario95" />
              <Checkbox defaultChecked>{copy.remember}</Checkbox>
              <div className="flex justify-end gap-2">
                <Button size="sm">{copy.cancel}</Button>
                <Button size="sm" variant="primary">
                  {copy.accept}
                </Button>
              </div>
            </Window.Body>
          </Window>
        </div>
      </DocSection>

      <DocSection title={copy.phaseComponents}>
        <div className="flex flex-wrap gap-2">
          {manifest.map((doc) => (
            <Button
              key={doc.slug}
              size="sm"
              onClick={() => onNavigate(`/componentes/${doc.slug}`)}
            >
              {doc.title}
            </Button>
          ))}
        </div>
      </DocSection>

      <DocSection title={copy.builderTitle}>
        <div className="bevel-window bg-surface p-3">
          <p className="max-w-2xl text-[12px] leading-[16px]">
            {copy.builderBody}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={() => onNavigate("/constructor")}
            >
              {copy.openBuilder}
            </Button>
            <Button onClick={() => onNavigate("/showcase/tienda")}>
              {copy.viewStore}
            </Button>
            <Button onClick={() => onNavigate("/showcase/red-social")}>
              {copy.viewSocial}
            </Button>
          </div>
        </div>
      </DocSection>

      <DocSection title={copy.showcase}>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            onClick={() => onNavigate("/showcase/tienda")}
          >
            {copy.store}
          </Button>
          <Button onClick={() => onNavigate("/showcase/red-social")}>
            {copy.social}
          </Button>
        </div>
      </DocSection>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <GroupBox legend={copy.news}>
          <ul className="grid list-disc gap-1 pl-4 text-[11px] leading-[15px]">
            {copy.newsItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </GroupBox>
        <GroupBox legend={copy.doDont}>
          <ul className="grid list-disc gap-1 pl-4 text-[11px] leading-[15px]">
            {copy.doDontItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </GroupBox>
      </div>
    </div>
  );
}

export function InstallPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const { messages } = useI18n();
  const copy = messages.pages.install;
  return (
    <div>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <DocSection title={copy.requirements}>
        <ul className="grid list-disc gap-1 pl-4 text-[12px] leading-[16px]">
          {copy.requirementsItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </DocSection>

      <DocSection title={copy.initTitle}>
        <InstallCommand command="npx deskui init" />
        <p className="mt-2 text-[11px] leading-[15px] text-ink-muted">
          {copy.initNote}
        </p>
        <p className="mt-2 text-[12px] leading-[16px]">
          {copy.initBody}
        </p>
        <div className="mt-2">
          <CodeBlock
            code={`${copy.cssComment}
@import "tailwindcss";
@import "./styles/deskui.css";`}
          />
        </div>
      </DocSection>

      <DocSection title={copy.addTitle}>
        <InstallCommand command="npx deskui add button input label group-box checkbox textarea radio-group select switch slider form tabs scroll-area window dialog" />
        <div className="mt-2" />
        <InstallCommand command="npx deskui add alert toast progress-bar tooltip badge menu-bar dropdown-menu context-menu breadcrumb tree-view pagination" />
        <div className="mt-2" />
        <InstallCommand command="npx deskui add table list-box status-bar icon title-bar taskbar" />
        <div className="mt-2" />
        <InstallCommand command="npx deskui add panel card separator toolbar" />
        <div className="mt-2" />
        <InstallCommand command="npx deskui add desktop start-menu window-manager file-explorer wizard properties-dialog" />
        <div className="mt-2" />
        <InstallCommand command="npx deskui add notepad terminal blue-screen screensaver minesweeper" />
        <p className="mt-2 text-[12px] leading-[16px]">
          {copy.addBody}
        </p>
      </DocSection>

      <DocSection title={copy.importTitle}>
        <CodeBlock
          code={`import { Button, Checkbox, Input, Label } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Window } from "@/components/ui/window";`}
        />
        <p className="mt-2 text-[11px] leading-[15px] text-ink-muted">
          {copy.aliasNote}
        </p>
      </DocSection>

      <DocSection title={copy.configTitle}>
        <CodeBlock
          code={`{
  "style": "classic",
  "srcDir": true,
  "tailwind": {
    "css": "src/index.css",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  }
}`}
        />
      </DocSection>

      <DocSection title={copy.commandsTitle}>
        <div className="grid gap-2">
          <InstallCommand command="npx deskui list" />
          <InstallCommand command="npx deskui add dialog --dry-run" />
          <InstallCommand command="npx deskui add button --overwrite" />
        </div>
      </DocSection>

      <DocSection title={copy.registryTitle}>
        <p className="text-[12px] leading-[16px]">
          {copy.registryBody}
        </p>
      </DocSection>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => onNavigate("/componentes")}>
          {copy.viewComponents}
        </Button>
        <Button onClick={() => onNavigate("/temas")}>{copy.exploreThemes}</Button>
      </div>
    </div>
  );
}

export function ComponentsIndexPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const { locale, messages } = useI18n();
  const copy = messages.pages.components;
  const manifest = getComponentManifest(locale);
  return (
    <div>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {manifest.map((doc) => (
          <a
            key={doc.slug}
            href={`#/componentes/${doc.slug}`}
            className={cn(
              "bevel-raised block bg-surface p-3 text-ink",
              "hover:bg-surface-pressed",
              "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
            )}
          >
            <div className="flex items-center gap-2">
              <NoteIcon />
              <span className="text-[13px] font-bold">{doc.title}</span>
            </div>
            <p className="mt-2 text-[11px] leading-[15px] text-ink-muted">
              {doc.description}
            </p>
            <code className="mt-2 block font-mono text-[11px] text-ink-muted">
              {doc.install}
            </code>
          </a>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={() => onNavigate("/laboratorio")}>
          {copy.openLab}
        </Button>
      </div>
    </div>
  );
}

export function ComponentPage({
  doc,
  onNavigate,
}: {
  doc: ComponentDoc;
  onNavigate: (path: string) => void;
}) {
  const { messages } = useI18n();
  const copy = messages.pages.component;
  return (
    <div>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={doc.title}
        description={doc.description}
        actions={
          <Button size="sm" onClick={() => onNavigate("/componentes")}>
            {copy.viewAll}
          </Button>
        }
      />

      <InstallCommand command={doc.install} />

      <DocSection title={copy.example}>
        <PreviewBox preview={doc.preview} code={doc.code} label={doc.title} />
      </DocSection>

      <DocSection title={copy.props}>
        <PropsTable rows={doc.props} />
      </DocSection>

      <DocSection title={copy.accessibility}>
        <ul className="grid list-disc gap-1 pl-4 text-[11px] leading-[15px]">
          {doc.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </DocSection>
    </div>
  );
}

export function ThemesPage({
  theme,
  onThemeChange,
  onNavigate,
}: {
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  onNavigate: (path: string) => void;
}) {
  const { messages } = useI18n();
  const copy = messages.pages.themes;
  return (
    <div>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <div
        role="group"
        aria-label={messages.themes.select}
        className="flex flex-wrap gap-2"
      >
        {THEMES.map((item) => (
          <Button
            key={item.id}
            size="sm"
            aria-pressed={theme === item.id}
            title={themeHint(messages, item.id)}
            onClick={() => onThemeChange(item.id)}
          >
            {themeLabel(messages, item.id)}
          </Button>
        ))}
      </div>

      <DocSection title={copy.preview}>
        <div className="bevel-window bg-surface p-3">
          <Window active className="mx-auto max-w-md">
            <Window.TitleBar title={copy.current} icon={<PaletteIcon />} />
            <Window.Body className="grid gap-2">
              <Label htmlFor="theme-input">{copy.computer}</Label>
              <Input id="theme-input" defaultValue="PC-01" readOnly />
              <Checkbox defaultChecked>{copy.showIcons}</Checkbox>
              <div className="flex justify-end gap-2">
                <Button size="sm">{copy.cancel}</Button>
                <Button size="sm" variant="primary">
                  {copy.apply}
                </Button>
              </div>
            </Window.Body>
          </Window>
        </div>
      </DocSection>

      <DocSection title={copy.included}>
        <div className="bevel-window overflow-x-auto bg-surface p-[3px]">
          <table className="w-full min-w-[420px] border-collapse bg-surface-sunken text-left text-[11px] leading-[15px]">
            <thead>
              <tr>
                <th scope="col" className="bevel-raised bg-surface px-2 py-1 font-normal">
                  {copy.theme}
                </th>
                <th scope="col" className="bevel-raised bg-surface px-2 py-1 font-normal">
                  {copy.descriptionCol}
                </th>
              </tr>
            </thead>
            <tbody>
              {THEMES.map((item) => (
                <tr key={item.id} className="border-t border-bevel-light">
                  <td className="px-2 py-1 align-top">
                    <code className="font-mono">{item.id}</code>
                  </td>
                  <td className="px-2 py-1 align-top">
                    {themeHint(messages, item.id)}
                    {item.id === "high-contrast" ? copy.highContrastHint : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title={copy.create}>
        <CodeBlock
          code={`[data-theme="mi-tema"] {
  --w95-surface: #d8d0c0;
  --w95-surface-sunken: #fffdf5;
  --w95-text: #181410;
  --w95-text-muted: #4a4030;
  --w95-highlight: #fffdf5;
  --w95-light: #eee6d8;
  --w95-shadow: #8a806c;
  --w95-dark: #2a241a;
  --w95-window-frame: #2a241a;
  --w95-accent: #5c3a00;
  --w95-selection: #5c3a00;
  --w95-desktop: #6b5a3c;
  --w95-titlebar-from: #5c3a00;
  --w95-titlebar-to: #5c3a00;
}`}
        />
        <p className="mt-2 text-[11px] leading-[15px] text-ink-muted">
          {copy.applyAncestor}{" "}
          <code className="font-mono">&lt;html data-theme="mi-tema"&gt;</code>
        </p>
      </DocSection>

      <div className="mt-5">
        <Button onClick={() => onNavigate("/instalacion")}>
          {copy.back}
        </Button>
      </div>
    </div>
  );
}

export function AboutPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const { locale, messages } = useI18n();
  const copy = messages.pages.about;
  const manifest = getComponentManifest(locale);
  return (
    <div>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <GroupBox legend={copy.status}>
          <ul className="grid gap-1 text-[11px] leading-[15px]">
            {copy.statusItems.map((item) => (
              <li key={item}>
                {item.replace("{count}", String(manifest.length))}
              </li>
            ))}
          </ul>
        </GroupBox>
        <GroupBox legend={copy.stack}>
          <ul className="grid gap-1 text-[11px] leading-[15px]">
            {copy.stackItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </GroupBox>
        <GroupBox legend={copy.licenses}>
          <ul className="grid gap-1 text-[11px] leading-[15px]">
            {copy.licenseItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </GroupBox>
        <GroupBox legend={copy.notice}>
          <p className="text-[11px] leading-[15px]">
            {copy.noticeBody}
          </p>
        </GroupBox>
      </div>

      <DocSection title={copy.next}>
        <ul className="grid list-disc gap-1 pl-4 text-[11px] leading-[15px]">
          {copy.nextItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </DocSection>

      <DocSection title={copy.aiTitle}>
        <p className="max-w-2xl text-[11px] leading-[15px]">{copy.aiBody}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <a href="/llms-full.txt">{copy.aiSkills}</a>
          </Button>
          <Button asChild size="sm">
            <a href="/llms.txt">{copy.aiLlms}</a>
          </Button>
        </div>
      </DocSection>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => onNavigate("/instalacion")}>
          {copy.install}
        </Button>
        <Button onClick={() => onNavigate("/componentes")}>
          {copy.viewComponents}
        </Button>
      </div>
    </div>
  );
}

export function NotFoundPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const { messages } = useI18n();
  const copy = messages.pages.notFound;
  return (
    <div>
      <div className="flex items-start gap-3">
        <WarningIcon className="h-8 w-8" />
        <PageHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
      </div>
      <Button variant="primary" onClick={() => onNavigate("/")}>
        {copy.back}
      </Button>
    </div>
  );
}
