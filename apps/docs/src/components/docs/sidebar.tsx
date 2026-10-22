import type { ReactNode } from "react";

import { cn } from "@deskui/ui";

import { getComponentManifest } from "../../content/manifest";
import { useI18n, type MessageKey } from "../../i18n/provider";
import {
  BrandMark,
  FolderIcon,
  InfoIcon,
  NoteIcon,
  PaletteIcon,
} from "../icons";

type NavItem = {
  path: string;
  labelKey: MessageKey;
  titleKey?: MessageKey;
  icon: ReactNode;
};

const START_ITEMS: NavItem[] = [
  { path: "/", labelKey: "sidebar.home", icon: <BrandMark /> },
  { path: "/instalacion", labelKey: "sidebar.install", icon: <FolderIcon /> },
  { path: "/temas", labelKey: "sidebar.themes", icon: <PaletteIcon /> },
];

const PROJECT_ITEMS: NavItem[] = [
  { path: "/laboratorio", labelKey: "sidebar.lab", icon: <BrandMark /> },
  { path: "/constructor", labelKey: "sidebar.builder", icon: <PaletteIcon /> },
  {
    path: "/guia",
    labelKey: "sidebar.guide",
    icon: <NoteIcon />,
  },
  { path: "/cambios", labelKey: "sidebar.changelog", icon: <FolderIcon /> },
  { path: "/migracion", labelKey: "sidebar.migration", icon: <NoteIcon /> },
  { path: "/contribuir", labelKey: "sidebar.contribute", icon: <InfoIcon /> },
  { path: "/showcase/tienda", labelKey: "sidebar.store", icon: <FolderIcon /> },
  {
    path: "/showcase/red-social",
    labelKey: "sidebar.social",
    icon: <NoteIcon />,
  },
  { path: "/acerca", labelKey: "sidebar.about", icon: <InfoIcon /> },
];

function NavButton({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: (path: string) => void;
}) {
  const { t } = useI18n();
  const label = t(item.labelKey);
  return (
    <li>
      <button
        type="button"
        aria-current={active ? "page" : undefined}
        title={item.titleKey ? t(item.titleKey) : label}
        onClick={() => onNavigate(item.path)}
        className={cn(
          "flex h-[21px] w-full items-center gap-2 px-2 text-left text-[11px] leading-[13px]",
          active
            ? "bg-accent text-ink-inverse"
            : "text-ink hover:bg-accent hover:text-ink-inverse",
          "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
        )}
      >
        <span className="grid h-4 w-4 shrink-0 place-items-center">
          {item.icon}
        </span>
        <span className="truncate">{label}</span>
      </button>
    </li>
  );
}

function ComponentLink({
  slug,
  title,
  active,
  onNavigate,
}: {
  slug: string;
  title: string;
  active: boolean;
  onNavigate: (path: string) => void;
}) {
  return (
    <li>
      <button
        type="button"
        aria-current={active ? "page" : undefined}
        title={title}
        onClick={() => onNavigate(`/componentes/${slug}`)}
        className={cn(
          "flex h-[21px] w-full items-center gap-2 px-2 text-left text-[11px] leading-[13px]",
          active
            ? "bg-accent text-ink-inverse"
            : "text-ink hover:bg-accent hover:text-ink-inverse",
          "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
        )}
      >
        <NoteIcon className="h-3 w-3" />
        <span className="truncate">{title}</span>
      </button>
    </li>
  );
}

export function Sidebar({
  route,
  onNavigate,
  onSearch,
  className,
  label,
}: {
  route: string;
  onNavigate: (path: string) => void;
  onSearch: () => void;
  className?: string;
  label?: string;
}) {
  const { locale, t } = useI18n();
  const alphabetical = [...getComponentManifest(locale)].sort((a, b) =>
    a.title.localeCompare(b.title, locale, { sensitivity: "base" }),
  );

  return (
    <nav
      aria-label={label ?? t("sidebar.docs")}
      className={cn(
        "w95-scrollbar font-ui text-ui",
        "md:[scrollbar-gutter:stable]",
        className,
      )}
    >
      <div className="z-10 -mx-2 border-b border-bevel-shadow bg-surface p-2 md:sticky md:top-0">
        <button
          type="button"
          onClick={onSearch}
          className={cn(
            "bevel-field flex h-[24px] w-full items-center gap-2 px-2 text-left",
            "bg-surface-sunken text-[11px] leading-[13px] text-ink-muted",
            "hover:bg-surface-pressed hover:text-ink",
            "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
          )}
        >
          <NoteIcon className="h-3 w-3" />
          <span className="min-w-0 flex-1 truncate">
            {t("sidebar.search")}
          </span>
          <kbd className="font-mono text-[10px]">Ctrl+K</kbd>
        </button>
      </div>

      <p className="mt-2 px-2 py-1 text-[11px] font-bold">
        {t("sidebar.explorer")}
      </p>
      <ul>
        {START_ITEMS.map((item) => (
          <NavButton
            key={item.path}
            item={item}
            active={route === item.path}
            onNavigate={onNavigate}
          />
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-bevel-shadow px-2 pt-2">
        <span className="text-[11px] font-bold">{t("sidebar.components")}</span>
        <span className="text-[9px] leading-[11px] text-ink-muted">
          {t("sidebar.aToZ")} · {alphabetical.length}
        </span>
      </div>
      <ul>
        {alphabetical.map((doc) => (
          <ComponentLink
            key={doc.slug}
            slug={doc.slug}
            title={doc.title}
            active={route === `/componentes/${doc.slug}`}
            onNavigate={onNavigate}
          />
        ))}
      </ul>

      <p className="mt-3 border-t border-bevel-shadow px-2 pt-2 text-[11px] font-bold">
        {t("sidebar.project")}
      </p>
      <ul>
        {PROJECT_ITEMS.map((item) => (
          <NavButton
            key={item.path}
            item={item}
            active={route === item.path}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </nav>
  );
}
