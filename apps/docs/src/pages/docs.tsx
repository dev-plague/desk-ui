import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";

import {
  MenuBar,
  MenuBarItem,
  MenuBarMenu,
  MenuBarSeparator,
  Window,
  cn,
} from "@deskui/ui";
import { BrandMark } from "../components/icons";
import { Sidebar } from "../components/docs/sidebar";
import { ComponentSearch } from "../components/docs/search";
import { Taskbar } from "../components/taskbar";
import {
  AboutPage,
  ComponentPage,
  ComponentsIndexPage,
  HomePage,
  InstallPage,
  NotFoundPage,
  ThemesPage,
} from "../content/pages";
import { GuidePage } from "./guide";
import { ShowcasePage } from "./showcase";
import { findManifestComponent } from "../content/manifest";
import type { ComponentDoc } from "../content/components";
import { useI18n, type Locale } from "../i18n/provider";
import { applyRouteMetadata } from "../lib/metadata";
import { navigate } from "../lib/router";
import { useTheme } from "../lib/theme";

const BuilderPage = lazy(() =>
  import("./builder").then((module) => ({ default: module.BuilderPage })),
);

function formatClock(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

let componentDocsPromise:
  | Promise<typeof import("../content/components")>
  | undefined;

function loadComponentDocs() {
  componentDocsPromise ??= import("../content/components");
  return componentDocsPromise;
}

function LoadingComponent() {
  const { t } = useI18n();
  return <>{t("pages.component.loading")}</>;
}

/**
 * Las vistas previas, el código y las props de los 47 componentes viven en un
 * chunk aparte. El shell y el explorador solo cargan el índice ligero.
 */
function LazyComponentPage({
  slug,
  onNavigate,
}: {
  slug: string;
  onNavigate: (path: string) => void;
}) {
  const { locale } = useI18n();
  const [doc, setDoc] = useState<ComponentDoc | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setDoc(null);
    setFailed(false);

    loadComponentDocs()
      .then((module) => {
        if (!active) {
          return;
        }
        const found = module.findComponentDoc(slug, locale);
        if (found) {
          setDoc(found);
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });

    return () => {
      active = false;
    };
  }, [slug, locale]);

  if (failed) {
    return <NotFoundPage onNavigate={onNavigate} />;
  }

  if (!doc) {
    return (
      <div
        role="status"
        className="bevel-window bg-surface p-4 text-[11px] leading-[15px]"
      >
        <LoadingComponent />
      </div>
    );
  }

  return <ComponentPage doc={doc} onNavigate={onNavigate} />;
}

function resolvePage(
  route: string,
  onNavigate: (path: string) => void,
  theme: ReturnType<typeof useTheme>[0],
  onThemeChange: ReturnType<typeof useTheme>[1],
  t: ReturnType<typeof useI18n>["t"],
  locale: Locale,
): {
  title: string;
  description: string;
  robots?: "index" | "noindex";
  node: ReactNode;
} {
  if (route === "/") {
    return {
      title: t("pages.home.metaTitle"),
      description: t("pages.home.description"),
      node: <HomePage onNavigate={onNavigate} />,
    };
  }

  if (route === "/instalacion") {
    return {
      title: t("pages.install.title"),
      description: t("pages.install.description"),
      node: <InstallPage onNavigate={onNavigate} />,
    };
  }

  if (route === "/componentes") {
    return {
      title: t("pages.components.title"),
      description: t("pages.components.description"),
      node: <ComponentsIndexPage onNavigate={onNavigate} />,
    };
  }

  if (route.startsWith("/componentes/")) {
    const slug = route.slice("/componentes/".length);
    const entry = findManifestComponent(slug, locale);

    if (entry) {
      return {
        title: entry.title,
        description: entry.description,
        node: <LazyComponentPage slug={slug} onNavigate={onNavigate} />,
      };
    }
  }

  if (route === "/constructor") {
    return {
      title: t("builder.title"),
      description: t("builder.description"),
      node: (
        <Suspense
          fallback={
            <div
              role="status"
              className="bevel-window bg-surface p-4 text-[11px] leading-[15px]"
            >
              {t("common.loading")}
            </div>
          }
        >
          <BuilderPage />
        </Suspense>
      ),
    };
  }

  if (route === "/temas") {
    return {
      title: t("pages.themes.title"),
      description: t("pages.themes.description"),
      node: (
        <ThemesPage
          theme={theme}
          onThemeChange={onThemeChange}
          onNavigate={onNavigate}
        />
      ),
    };
  }

  if (route === "/acerca") {
    return {
      title: t("pages.about.title"),
      description: t("pages.about.description"),
      node: <AboutPage onNavigate={onNavigate} />,
    };
  }

  if (route === "/guia") {
    return {
      title: t("guides.composicion.title"),
      description: t("guides.composicion.description"),
      node: <GuidePage guide="composicion" onNavigate={onNavigate} />,
    };
  }

  if (route === "/cambios") {
    return {
      title: t("guides.cambios.title"),
      description: t("guides.cambios.description"),
      node: <GuidePage guide="cambios" onNavigate={onNavigate} />,
    };
  }

  if (route === "/migracion") {
    return {
      title: t("guides.migracion.title"),
      description: t("guides.migracion.description"),
      node: <GuidePage guide="migracion" onNavigate={onNavigate} />,
    };
  }

  if (route === "/contribuir") {
    return {
      title: t("guides.contribuir.title"),
      description: t("guides.contribuir.description"),
      node: <GuidePage guide="contribuir" onNavigate={onNavigate} />,
    };
  }

  if (route === "/showcase/tienda") {
    return {
      title: t("showcase.store.title"),
      description: t("showcase.store.description"),
      node: <ShowcasePage kind="tienda" />,
    };
  }

  if (route === "/showcase/red-social") {
    return {
      title: t("showcase.social.title"),
      description: t("showcase.social.description"),
      node: <ShowcasePage kind="red-social" />,
    };
  }

  return {
    title: t("pages.notFound.title"),
    description: t("pages.notFound.routeDescription"),
    robots: "noindex",
    node: <NotFoundPage onNavigate={onNavigate} />,
  };
}

export function DocsPage({ route }: { route: string }) {
  const { locale, t } = useI18n();
  const [theme, setTheme] = useTheme();
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [status, setStatus] = useState(() => t("common.ready"));
  const [clock, setClock] = useState(() => formatClock(new Date(), locale));

  const isMaximized = maximized && !minimized && !closed;
  const isBuilder = route === "/constructor";

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

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        setStatus(t("shell.searchOpened"));
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [t]);

  function openWindow() {
    setClosed(false);
    setMinimized(false);
  }

  function go(path: string) {
    navigate(path);
    setStartOpen(false);
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

  const page = resolvePage(route, go, theme, setTheme, t, locale);

  useEffect(() => {
    applyRouteMetadata(page, locale);
  }, [page.title, page.description, page.robots, locale]);

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
                {t("shell.docsLabel")}
              </span>
            </button>
          </div>
        ) : (
          <Window
            active={!minimized}
            aria-label={t("shell.docsAria")}
            className={cn(
              "flex w-full flex-col",
              isMaximized
                ? "h-[calc(100dvh-32px)] max-w-none sm:h-[calc(100dvh-28px)]"
                : "mx-auto md:h-[calc(100dvh-6rem)]",
            )}
          >
            <Window.TitleBar
              className="shrink-0"
              title={t("shell.windowTitle")}
              icon={<BrandMark />}
              maximized={isMaximized}
              onMinimize={() => {
                setMinimized(true);
                setStatus(t("shell.minimized"));
              }}
              onMaximize={() => {
                setMaximized((value) => !value);
                setStatus(
                  maximized ? t("shell.restored") : t("shell.maximized"),
                );
              }}
              onClose={() => {
                setClosed(true);
                setStatus(t("shell.closed"));
              }}
            />

            {!minimized ? (
              <>
                <MenuBar aria-label={t("shell.menuAria")} className="shrink-0">
                  <MenuBarMenu label={t("shell.file")}>
                    <MenuBarItem onSelect={() => go("/")}>{t("shell.home")}</MenuBarItem>
                    <MenuBarItem onSelect={() => go("/laboratorio")}>
                      {t("shell.lab")}
                    </MenuBarItem>
                    <MenuBarItem onSelect={() => go("/constructor")}>
                      {t("shell.builder")}
                    </MenuBarItem>
                    <MenuBarSeparator />
                    <MenuBarItem
                      onSelect={() => {
                        setClosed(true);
                        setStatus(t("shell.closedShort"));
                      }}
                    >
                      {t("shell.close")}
                    </MenuBarItem>
                  </MenuBarMenu>
                  <MenuBarMenu label={t("shell.edit")}>
                    <MenuBarItem disabled>{t("shell.undo")}</MenuBarItem>
                    <MenuBarItem disabled>{t("shell.cut")}</MenuBarItem>
                    <MenuBarItem disabled>{t("shell.copy")}</MenuBarItem>
                  </MenuBarMenu>
                  <MenuBarMenu label={t("shell.view")}>
                    <MenuBarItem onSelect={() => setSearchOpen(true)}>
                      {t("shell.search")}
                    </MenuBarItem>
                    <MenuBarSeparator />
                    <MenuBarItem onSelect={() => go("/instalacion")}>
                      {t("shell.install")}
                    </MenuBarItem>
                    <MenuBarItem onSelect={() => go("/componentes")}>
                      {t("shell.components")}
                    </MenuBarItem>
                    <MenuBarItem onSelect={() => go("/constructor")}>
                      {t("shell.builderShort")}
                    </MenuBarItem>
                    <MenuBarItem onSelect={() => go("/temas")}>
                      {t("shell.themes")}
                    </MenuBarItem>
                  </MenuBarMenu>
                  <MenuBarMenu label={t("shell.help")}>
                    <MenuBarItem onSelect={() => go("/guia")}>
                      {t("shell.guide")}
                    </MenuBarItem>
                    <MenuBarItem onSelect={() => go("/cambios")}>
                      {t("shell.changelog")}
                    </MenuBarItem>
                    <MenuBarItem onSelect={() => go("/migracion")}>
                      {t("shell.migration")}
                    </MenuBarItem>
                    <MenuBarSeparator />
                    <MenuBarItem onSelect={() => go("/acerca")}>
                      {t("shell.about")}
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
                    "flex min-h-0 flex-1 flex-col",
                    "md:overflow-hidden",
                    isMaximized && "min-h-0 overflow-hidden",
                  )}
                >
                  <div
                    className={cn(
                      "flex min-h-0 flex-1 flex-col md:flex-row",
                      isMaximized && "min-h-0",
                    )}
                  >
                    {!isBuilder ? (
                      <Sidebar
                        route={route}
                        onNavigate={go}
                        onSearch={() => setSearchOpen(true)}
                        className="hidden w-72 shrink-0 border-r border-bevel-shadow p-2 md:block md:min-h-0 md:overflow-y-auto"
                      />
                    ) : null}

                    <div
                      className={cn(
                        "w95-scrollbar min-w-0 flex-1",
                        isBuilder
                          ? "flex min-h-0 flex-col p-2"
                          : "p-3 sm:p-5",
                        "md:min-h-0 md:overflow-y-auto",
                        isBuilder && "lg:overflow-hidden",
                        isMaximized && "min-h-0 overflow-y-auto",
                      )}
                    >
                      {!isBuilder ? (
                        <details key={route} className="bevel-raised mb-3 bg-surface p-2 md:hidden">
                          <summary className="cursor-default text-[11px] font-bold">
                            {t("sidebar.explorer")}
                          </summary>
                          <Sidebar
                            route={route}
                            onNavigate={go}
                            onSearch={() => setSearchOpen(true)}
                            className="mt-2"
                            label={t("sidebar.mobile")}
                          />
                        </details>
                      ) : null}

                      {page.node}
                    </div>
                  </div>
                </Window.Body>

                <Window.StatusBar className="shrink-0">
                  <Window.StatusField>{status}</Window.StatusField>
                  <Window.StatusField className="max-w-[55%] flex-none sm:w-44">
                    {page.title}
                  </Window.StatusField>
                  <Window.StatusField className="hidden w-24 flex-none sm:block">
                    {t("shell.phase")}
                  </Window.StatusField>
                </Window.StatusBar>
              </>
            ) : null}
          </Window>
        )}
      </main>

      <ComponentSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onNavigate={go}
      />

      <Taskbar
        clock={clock}
        minimized={minimized}
        closed={closed}
        startOpen={startOpen}
        taskLabel={t("shell.taskLabel")}
        onToggleStart={() => setStartOpen((value) => !value)}
        onCloseStart={() => setStartOpen(false)}
        onTaskClick={handleTaskClick}
        onNavigate={go}
      />
    </div>
  );
}
