import { Suspense, lazy, type LazyExoticComponent, type ComponentType } from "react";

import { Alert, AlertDescription, Button } from "@deskui/ui";

import { PageHeader } from "../components/docs/doc-ui";
import { useI18n } from "../i18n/provider";

export type GuideId = "composicion" | "cambios" | "contribuir" | "migracion";

type GuideComponent = LazyExoticComponent<ComponentType<Record<string, unknown>>>;

const GUIDES: Record<
  GuideId,
  {
    titleKey: "guides.composicion.title" | "guides.cambios.title" | "guides.contribuir.title" | "guides.migracion.title";
    eyebrowKey: "guides.composicion.eyebrow" | "guides.cambios.eyebrow" | "guides.contribuir.eyebrow" | "guides.migracion.eyebrow";
    descriptionKey:
      | "guides.composicion.description"
      | "guides.cambios.description"
      | "guides.contribuir.description"
      | "guides.migracion.description";
    components: Record<"es" | "en", GuideComponent>;
  }
> = {
  composicion: {
    titleKey: "guides.composicion.title",
    eyebrowKey: "guides.composicion.eyebrow",
    descriptionKey: "guides.composicion.description",
    components: {
      es: lazy(() => import("../content/guides/composicion.mdx")),
      en: lazy(() => import("../content/guides/composicion.en.mdx")),
    },
  },
  cambios: {
    titleKey: "guides.cambios.title",
    eyebrowKey: "guides.cambios.eyebrow",
    descriptionKey: "guides.cambios.description",
    components: {
      es: lazy(() => import("../content/guides/cambios.mdx")),
      en: lazy(() => import("../content/guides/cambios.en.mdx")),
    },
  },
  contribuir: {
    titleKey: "guides.contribuir.title",
    eyebrowKey: "guides.contribuir.eyebrow",
    descriptionKey: "guides.contribuir.description",
    components: {
      es: lazy(() => import("../content/guides/contribuir.mdx")),
      en: lazy(() => import("../content/guides/contribuir.en.mdx")),
    },
  },
  migracion: {
    titleKey: "guides.migracion.title",
    eyebrowKey: "guides.migracion.eyebrow",
    descriptionKey: "guides.migracion.description",
    components: {
      es: lazy(() => import("../content/guides/migracion.mdx")),
      en: lazy(() => import("../content/guides/migracion.en.mdx")),
    },
  },
};

export function GuidePage({
  guide,
  onNavigate,
}: {
  guide: GuideId;
  onNavigate: (path: string) => void;
}) {
  const { locale, t } = useI18n();
  const entry = GUIDES[guide];
  const Content = entry.components[locale];

  return (
    <div>
      <PageHeader
        eyebrow={t(entry.eyebrowKey)}
        title={t(entry.titleKey)}
        description={t(entry.descriptionKey)}
        actions={
          <Button size="sm" onClick={() => onNavigate("/componentes")}>
            {t("guides.viewComponents")}
          </Button>
        }
      />

      <Suspense
        fallback={
          <Alert variant="info">
            <AlertDescription>{t("guides.loading")}</AlertDescription>
          </Alert>
        }
      >
        <div className="max-w-3xl text-[12px] leading-[16px] [&_h2]:mt-5 [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:leading-[19px] [&_h3]:mt-4 [&_h3]:text-[13px] [&_h3]:font-bold [&_h3]:leading-[17px] [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mt-2 [&_pre]:mt-2 [&_table]:mt-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-bevel-light [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-bevel-light [&_th]:bg-surface [&_th]:px-2 [&_th]:py-1 [&_th]:text-left">
          <Content />
        </div>
      </Suspense>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => onNavigate("/componentes")}>
          {t("guides.catalog")}
        </Button>
        <Button onClick={() => onNavigate("/temas")}>{t("guides.exploreThemes")}</Button>
      </div>
    </div>
  );
}
