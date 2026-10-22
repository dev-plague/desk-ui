import {
  StartMenu,
  StartMenuContent,
  StartMenuItem,
  StartMenuSeparator,
  StartMenuSidebar,
  StartMenuTrigger,
  Taskbar as TaskbarBase,
  TaskbarDivider,
  TaskbarItem,
  TaskbarStart,
  TaskbarTray,
} from "@deskui/ui";

import { useI18n, type Locale } from "../i18n/provider";
import {
  BrandMark,
  FolderIcon,
  InfoIcon,
  NoteIcon,
  PaletteIcon,
  SpeakerIcon,
} from "./icons";

const LOCALES: ReadonlyArray<{ id: Locale; label: string; name: string }> = [
  { id: "es", label: "ES", name: "Español" },
  { id: "en", label: "EN", name: "English" },
];

export function Taskbar({
  clock,
  minimized,
  closed,
  startOpen,
  taskLabel = "DeskUI",
  onToggleStart,
  onCloseStart,
  onTaskClick,
  onNavigate,
}: {
  clock: string;
  minimized: boolean;
  closed: boolean;
  startOpen: boolean;
  taskLabel?: string;
  onToggleStart: () => void;
  onCloseStart: () => void;
  onTaskClick: () => void;
  onNavigate: (path: string) => void;
}) {
  const { locale, setLocale, t } = useI18n();

  function go(path: string) {
    onNavigate(path);
    onCloseStart();
  }

  return (
    <TaskbarBase aria-label={t("taskbar.aria")} className="fixed inset-x-0 bottom-0 z-40">
      <StartMenu
        open={startOpen}
        onOpenChange={(open) => {
          if (open) {
            if (!startOpen) {
              onToggleStart();
            }
          } else {
            onCloseStart();
          }
        }}
      >
        <StartMenuTrigger asChild>
          <TaskbarStart aria-pressed={startOpen} icon={<BrandMark />}>
            {t("taskbar.start")}
          </TaskbarStart>
        </StartMenuTrigger>
        <StartMenuContent className="min-w-0 p-[2px]">
          <div className="flex">
            <StartMenuSidebar>DeskUI</StartMenuSidebar>
            <div className="min-w-[190px] py-1">
              <StartMenuItem onSelect={() => go("/laboratorio")}>
                <BrandMark />
                {t("taskbar.lab")}
              </StartMenuItem>
              <StartMenuItem onSelect={() => go("/constructor")}>
                <PaletteIcon />
                {t("taskbar.builder")}
              </StartMenuItem>
              <StartMenuSeparator />
              <StartMenuItem onSelect={() => go("/instalacion")}>
                <FolderIcon />
                {t("taskbar.install")}
              </StartMenuItem>
              <StartMenuItem onSelect={() => go("/componentes")}>
                <NoteIcon />
                {t("taskbar.components")}
              </StartMenuItem>
              <StartMenuItem onSelect={() => go("/temas")}>
                <PaletteIcon />
                {t("taskbar.themes")}
              </StartMenuItem>
              <StartMenuSeparator />
              <StartMenuItem onSelect={() => go("/guia")}>
                <InfoIcon />
                {t("taskbar.guide")}
              </StartMenuItem>
              <StartMenuItem onSelect={() => go("/acerca")}>
                <InfoIcon />
                {t("taskbar.about")}
              </StartMenuItem>
            </div>
          </div>
        </StartMenuContent>
      </StartMenu>

      <TaskbarDivider />

      <TaskbarItem
        active={!minimized && !closed}
        onClick={onTaskClick}
        icon={<BrandMark />}
      >
        {taskLabel}
      </TaskbarItem>

      <TaskbarTray>
        <SpeakerIcon aria-hidden="true" />
        <span className="sr-only">{t("taskbar.clock")}</span>
        <span className="tabular-nums">{clock}</span>
        <span
          role="group"
          aria-label={t("taskbar.language")}
          className="ml-1 flex items-center gap-[2px]"
        >
          {LOCALES.map((item) => (
            <button
              key={item.id}
              type="button"
              lang={item.id}
              aria-pressed={locale === item.id}
              title={item.name}
              onClick={() => setLocale(item.id)}
              className={
                locale === item.id
                  ? "bevel-sunken bg-surface-pressed px-1 font-ui text-[10px] leading-[13px]"
                  : "bevel-raised bg-surface px-1 font-ui text-[10px] leading-[13px]"
              }
            >
              {item.label}
            </button>
          ))}
        </span>
      </TaskbarTray>
    </TaskbarBase>
  );
}
