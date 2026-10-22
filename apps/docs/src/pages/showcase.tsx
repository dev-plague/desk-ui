import { Suspense, lazy } from "react";

import { Alert, AlertDescription } from "@deskui/ui";

import { useI18n } from "../i18n/provider";

const StoreShowcase = lazy(() =>
  import("../content/showcases/store").then((module) => ({
    default: module.StoreShowcase,
  })),
);

const SocialShowcase = lazy(() =>
  import("../content/showcases/social").then((module) => ({
    default: module.SocialShowcase,
  })),
);

export type ShowcaseId = "tienda" | "red-social";

export function ShowcasePage({ kind }: { kind: ShowcaseId }) {
  const { t } = useI18n();
  const Content = kind === "tienda" ? StoreShowcase : SocialShowcase;

  return (
    <Suspense
      fallback={
        <Alert variant="info">
          <AlertDescription>{t("showcase.loading")}</AlertDescription>
        </Alert>
      }
    >
      <Content />
    </Suspense>
  );
}
