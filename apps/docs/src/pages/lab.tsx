import { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  Dialog,
  GroupBox,
  Input,
  Label,
  MenuBar,
  MenuBarItem,
  MenuBarMenu,
  MenuBarSeparator,
  RadioGroup,
  RadioGroupItem,
  Select,
  Slider,
  Switch,
  Textarea,
  Window,
  cn,
} from "@deskui/ui";

import { BrandMark, FolderIcon, NoteIcon, WarningIcon } from "../components/icons";
import { useI18n } from "../i18n/provider";
import { themeHint, themeLabel } from "../i18n/theme";
import { Taskbar } from "../components/taskbar";
import { THEMES, useTheme } from "../lib/theme";

function formatClock(date: Date, locale: "es" | "en") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span>{label}</span>
      <span className="flex items-center gap-1 font-bold">
        <span aria-hidden="true" className="h-2 w-2 bg-success" />
        {value}
      </span>
    </li>
  );
}

export function LabPage() {
  const { locale, messages, t } = useI18n();
  const copy = messages.lab;
  const [theme, setTheme] = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [bold, setBold] = useState(true);
  const [status, setStatus] = useState(() => t("lab.statusReady"));
  const [clock, setClock] = useState(() => formatClock(new Date(), locale));

  const isMaximized = maximized && !minimized && !closed;

  useEffect(() => {
    document.title = `${t("lab.title")} — DeskUI`;
  }, [t]);

  useEffect(() => {
    const timer = window.setInterval(
      () => setClock(formatClock(new Date(), locale)),
      15_000,
    );
    return () => window.clearInterval(timer);
  }, [locale]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setStartOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function openWindow() {
    setClosed(false);
    setMinimized(false);
  }

  function handleTaskClick() {
    if (closed) {
      openWindow();
      return;
    }

    setMinimized((value) => !value);
  }

  return (
    <div className="w95-ui min-h-dvh bg-desktop text-ink">
      <main
        className={cn(
          "flex min-h-dvh flex-col",
          isMaximized
            ? "w-full"
            : "mx-auto w-full max-w-6xl px-2 pb-12 pt-3 sm:px-6 sm:pt-8",
        )}
      >
        {closed ? (
          <div className="flex flex-1 items-start justify-center pt-24">
            <button
              type="button"
              onClick={openWindow}
              className={cn(
                "group flex w-24 flex-col items-center gap-1",
                "text-ink-inverse focus-visible:focus-dotted focus-visible:outline-offset-4",
              )}
            >
              <BrandMark className="h-8 w-8" />
              <span className="px-1 text-[11px] leading-[13px] [text-shadow:1px_1px_0_#000] group-hover:bg-accent group-focus-visible:bg-accent">
                {copy.closedIcon}
              </span>
            </button>
          </div>
        ) : (
          <Window
            active={!minimized}
            aria-label={copy.windowAria}
            className={cn(
              "flex w-full flex-col",
              isMaximized
                ? "h-[calc(100dvh-32px)] max-w-none sm:h-[calc(100dvh-28px)]"
                : "mx-auto md:h-[calc(100dvh-6rem)]",
            )}
          >
            <Window.TitleBar
              className="shrink-0"
              title={copy.title}
              icon={<BrandMark />}
              maximized={isMaximized}
              onMinimize={() => {
                setMinimized(true);
                setStatus(copy.minimized);
              }}
              onMaximize={() => {
                setMaximized((value) => !value);
                setStatus(maximized ? copy.restored : copy.maximized);
              }}
              onClose={() => {
                setClosed(true);
                setStatus(copy.closed);
              }}
            />

            {!minimized ? (
              <>
                <MenuBar aria-label={copy.menuAria} className="shrink-0">
                  <MenuBarMenu label={copy.file}>
                    <MenuBarItem
                      onSelect={() => {
                        window.location.hash = "/";
                      }}
                    >
                      {copy.home}
                    </MenuBarItem>
                    <MenuBarSeparator />
                    <MenuBarItem
                      onSelect={() => {
                        setClosed(true);
                        setStatus(copy.labClosed);
                      }}
                    >
                      {copy.close}
                    </MenuBarItem>
                  </MenuBarMenu>
                  <MenuBarMenu label={copy.edit}>
                    <MenuBarItem disabled>{copy.undo}</MenuBarItem>
                    <MenuBarItem disabled>{copy.cut}</MenuBarItem>
                  </MenuBarMenu>
                  <MenuBarMenu label={copy.view}>
                    <MenuBarItem
                      onSelect={() => {
                        window.location.hash = "/componentes";
                      }}
                    >
                      {copy.components}
                    </MenuBarItem>
                    <MenuBarItem
                      onSelect={() => {
                        window.location.hash = "/temas";
                      }}
                    >
                      {copy.themes}
                    </MenuBarItem>
                  </MenuBarMenu>
                  <MenuBarMenu label={copy.help}>
                    <MenuBarItem
                      onSelect={() => {
                        window.location.hash = "/acerca";
                      }}
                    >
                      {copy.about}
                    </MenuBarItem>
                  </MenuBarMenu>
                </MenuBar>
                <div
                  aria-hidden="true"
                  className="mx-1 h-[2px] shrink-0 border-t border-bevel-shadow border-b border-highlight"
                />

                <Window.Body
                  padded={false}
                  className={cn(
                    "w95-scrollbar flex min-h-0 flex-1 flex-col p-3 sm:p-4",
                    "md:overflow-y-auto",
                    isMaximized && "min-h-0 overflow-y-auto",
                  )}
                >
                  <div className="mx-auto w-full">
                    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-xl min-w-0">
                        <div className="flex items-center gap-2">
                          <BrandMark className="h-6 w-6" />
                          <h1 className="text-[16px] font-bold leading-[20px]">
                            DeskUI
                          </h1>
                        </div>
                        <p className="mt-2 text-[12px] leading-[16px]">
                          {copy.intro}
                        </p>
                        <p className="mt-2 text-[11px] leading-[14px] text-ink-muted">
                          {copy.phase}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["React 19", "TypeScript", "Tailwind v4", "Vite"].map(
                            (item) => (
                              <span
                                key={item}
                                className="bevel-status bg-surface px-2 py-[2px] text-[11px] leading-[13px]"
                              >
                                {item}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      <GroupBox
                        legend={copy.systemStatus}
                        className="w-full shrink-0 lg:w-[220px]"
                      >
                        <ul className="grid gap-1">
                          <StatusRow label="Button" value="OK" />
                          <StatusRow label="Window" value="OK" />
                          <StatusRow label={copy.forms} value="OK" />
                          <StatusRow label={copy.controls} value="OK" />
                          <StatusRow label="Dialog" value="OK" />
                          <StatusRow label={copy.themesStatus} value="6" />
                        </ul>
                      </GroupBox>
                    </header>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 md:items-start">
                      <div className="grid content-start gap-4">
                    <GroupBox id="botones" legend={copy.buttons}>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button>{copy.cancel}</Button>
                        <Button variant="primary">{copy.accept}</Button>
                        <Button disabled>{copy.disabled}</Button>
                        <Button
                          variant="icon"
                          size="icon"
                          aria-label={copy.openFolder}
                          title={copy.openFolder}
                        >
                          <FolderIcon />
                        </Button>
                        <div
                          role="group"
                          aria-label={copy.textFormat}
                          className="flex gap-2"
                        >
                          <Button
                            size="sm"
                            aria-pressed={bold}
                            onClick={() => {
                              setBold((value) => !value);
                              setStatus(copy.boldStatus);
                            }}
                            className="min-w-0 px-2 font-bold"
                          >
                            N
                          </Button>
                          <Button
                            size="sm"
                            aria-pressed={!bold}
                            onClick={() => {
                              setBold((value) => !value);
                              setStatus(copy.italicStatus);
                            }}
                            className="min-w-0 px-2 italic"
                          >
                            K
                          </Button>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] leading-[14px] text-ink-muted">
                        {copy.buttonNote}
                      </p>
                    </GroupBox>

                    <GroupBox
                      id="entradas"
                      legend={copy.inputs}
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-1">
                          <Label htmlFor="nombre-usuario">{copy.username}</Label>
                          <Input
                            id="nombre-usuario"
                            placeholder={copy.usernamePlaceholder}
                            defaultValue="usuario95"
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="dominio">{copy.domain}</Label>
                          <Input id="dominio" value="TRABAJO" readOnly />
                        </div>
                        <div className="grid gap-1 sm:col-span-2">
                          <Label htmlFor="comentario">{copy.comment}</Label>
                          <Textarea
                            id="comentario"
                            rows={3}
                            placeholder={copy.commentPlaceholder}
                          />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                          <Checkbox defaultChecked>
                            {copy.remember}
                          </Checkbox>
                          <Checkbox>{copy.hiddenFiles}</Checkbox>
                          <Checkbox disabled>{copy.notAvailable}</Checkbox>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] leading-[14px] text-ink-muted">
                        {copy.inputsNote}
                      </p>
                    </GroupBox>

                    <GroupBox
                      id="controles"
                      legend={copy.controlsTitle}
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-1">
                          <span className="text-[11px] leading-[13px]">
                            {copy.installPlan}
                          </span>
                          <RadioGroup
                            aria-label={copy.installPlan}
                            defaultValue="basico"
                          >
                            <RadioGroupItem value="basico">
                              {copy.basic}
                            </RadioGroupItem>
                            <RadioGroupItem value="pro">
                              {copy.pro}
                            </RadioGroupItem>
                            <RadioGroupItem value="servidor" disabled>
                              {copy.server}
                            </RadioGroupItem>
                          </RadioGroup>
                        </div>
                        <div className="grid content-start gap-1">
                          <Label htmlFor="lab-dominio">{copy.domain}</Label>
                          <Select id="lab-dominio" defaultValue="trabajo">
                            <option value="trabajo">TRABAJO</option>
                            <option value="casa">CASA</option>
                          </Select>
                          <div className="mt-2 grid gap-2">
                            <Switch defaultChecked>{copy.secureMode}</Switch>
                            <Switch disabled>{copy.notAvailable}</Switch>
                          </div>
                        </div>
                        <div className="grid gap-1 sm:col-span-2">
                          <Label htmlFor="lab-volumen">{copy.volume}</Label>
                          <Slider
                            id="lab-volumen"
                            min={0}
                            max={100}
                            defaultValue={60}
                          />
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] leading-[14px] text-ink-muted">
                        {copy.controlsNote}
                      </p>
                    </GroupBox>

                      </div>
                      <div className="grid content-start gap-4">
                    <GroupBox id="ventanas" legend={copy.windows}>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Window active={false} className="w-full">
                          <Window.TitleBar
                            title={copy.untitledNotepad}
                            icon={<NoteIcon />}
                          />
                          <Window.Body className="bevel-field m-2 bg-surface-sunken p-2 font-mono text-[11px] leading-[14px]">
                            <p>{copy.helloWorld}</p>
                            <p className="mt-2 text-ink-muted">
                              {copy.inactiveWindow}
                            </p>
                          </Window.Body>
                        </Window>

                        <Window
                          role="dialog"
                          aria-label={copy.messageExample}
                          className="w-full"
                        >
                          <Window.TitleBar
                            title={copy.message}
                            icon={<WarningIcon />}
                            showMinimize={false}
                            showMaximize={false}
                            onClose={() => setStatus(copy.dialogClosed)}
                          />
                          <Window.Body className="flex items-start gap-3">
                            <WarningIcon className="h-8 w-8" />
                            <p className="text-[12px] leading-[16px]">
                              {copy.continueInstall}
                            </p>
                          </Window.Body>
                          <div className="mx-2 mb-2 flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => setStatus(copy.choseYes)}
                            >
                              {t("common.yes")}
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setStatus(copy.choseNo)}
                            >
                              {t("common.no")}
                            </Button>
                          </div>
                        </Window>
                      </div>
                      <p className="mt-3 text-[11px] leading-[14px] text-ink-muted">
                        {copy.windowsNote}
                      </p>
                    </GroupBox>

                    <GroupBox id="dialogo" legend={copy.dialogTitle}>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button onClick={() => setDialogOpen(true)}>
                          {copy.openDialog}
                        </Button>
                        <span className="text-[11px] leading-[14px] text-ink-muted">
                          {copy.dialogNote}
                        </span>
                      </div>
                      <Dialog
                        open={dialogOpen}
                        onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (!open) {
                            setStatus(copy.updateClosed);
                          }
                        }}
                        title={copy.updateTitle}
                        icon={<WarningIcon />}
                        footer={
                          <>
                            <Button
                              size="sm"
                              onClick={() => setDialogOpen(false)}
                            >
                              {copy.cancel}
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                setDialogOpen(false);
                                setStatus(copy.updateAccepted);
                              }}
                            >
                              {copy.accept}
                            </Button>
                          </>
                        }
                      >
                        <div className="flex items-start gap-3">
                          <WarningIcon className="h-8 w-8" />
                          <p className="text-[12px] leading-[16px]">
                            {copy.updateQuestion}
                          </p>
                        </div>
                      </Dialog>
                    </GroupBox>

                    <GroupBox id="temas" legend={copy.themesTitle}>
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
                            onClick={() => {
                              setTheme(item.id);
                              setStatus(
                                t("lab.themeApplied", {
                                  theme: themeLabel(messages, item.id),
                                }),
                              );
                            }}
                          >
                            {themeLabel(messages, item.id)}
                          </Button>
                        ))}
                      </div>
                      <p className="mt-3 text-[11px] leading-[14px] text-ink-muted">
                        {copy.themesNote}
                      </p>
                    </GroupBox>

                    <GroupBox id="acerca" legend={copy.aboutPhase}>
                      <div className="grid gap-3 text-[11px] leading-[15px] sm:grid-cols-2">
                        <p>
                          {copy.aboutBody}
                        </p>
                        <ul className="grid gap-1">
                          {copy.aboutItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </GroupBox>
                      </div>
                    </div>
                  </div>
                </Window.Body>

                <Window.StatusBar className="shrink-0">
                  <Window.StatusField>{status}</Window.StatusField>
                  <Window.StatusField className="max-w-[55%] flex-none sm:w-40">
                    {copy.phaseStatus}
                  </Window.StatusField>
                  <Window.StatusField className="hidden w-24 flex-none sm:block">
                    {copy.componentCount}
                  </Window.StatusField>
                </Window.StatusBar>
              </>
            ) : null}
          </Window>
        )}

        {!closed && !isMaximized ? (
          <p className="mt-3 text-center text-[11px] leading-[14px] text-ink-inverse [text-shadow:1px_1px_0_#000]">
            {copy.footer}
          </p>
        ) : null}
      </main>

      <Taskbar
        clock={clock}
        minimized={minimized}
        closed={closed}
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((value) => !value)}
        onCloseStart={() => setStartOpen(false)}
        onTaskClick={handleTaskClick}
        taskLabel={copy.taskLabel}
        onNavigate={(path) => {
          window.location.hash = path;
        }}
      />
    </div>
  );
}
