const SITE_NAME = "DeskUI";

export interface RouteMetadata {
  title: string;
  description: string;
  /** `noindex` en rutas que no deben aparecer en buscadores. */
  robots?: "noindex" | "index";
}

export const DEFAULT_METADATA: RouteMetadata = {
  title: "Documentation",
  description:
    "DeskUI: React components with a retro look, tokens, accessibility and a copy & own CLI.",
};

function setMeta(name: string, content: string, attribute = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${name}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.append(element);
  }

  element.content = content;
}

/** Sincroniza título, descripción y tarjetas sociales con la ruta actual. */
export function applyRouteMetadata(
  { title, description, robots = "index" }: RouteMetadata,
  locale: "es" | "en" = "es",
) {
  const fullTitle = `${title} — ${SITE_NAME}`;
  document.title = fullTitle;

  setMeta("description", description);
  setMeta("robots", robots === "noindex" ? "noindex, nofollow" : "index, follow");

  setMeta("og:title", fullTitle, "property");
  setMeta("og:description", description, "property");
  setMeta("og:site_name", SITE_NAME, "property");
  setMeta("og:type", "article", "property");
  setMeta("og:locale", locale === "en" ? "en_US" : "es_ES", "property");
  setMeta(
    "og:locale:alternate",
    locale === "en" ? "es_ES" : "en_US",
    "property",
  );

  setMeta("twitter:card", "summary");
  setMeta("twitter:title", fullTitle);
  setMeta("twitter:description", description);

  const url = `${window.location.origin}${window.location.pathname}#${window.location.hash.replace(/^#/, "") || "/"}`;
  setMeta("og:url", url, "property");

  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = url;
}
