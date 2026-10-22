import { useCallback, useEffect, useState } from "react";

export type ThemeId =
  | "classic"
  | "gradient"
  | "high-contrast"
  | "desert"
  | "rose"
  | "storm";

export const THEMES: ReadonlyArray<{
  id: ThemeId;
  label: string;
  hint: string;
}> = [
  { id: "classic", label: "Clásico", hint: "superficie plana" },
  { id: "gradient", label: "Gradiente", hint: "barra azul degradada" },
  { id: "high-contrast", label: "Alto contraste", hint: "WCAG" },
  { id: "desert", label: "Desert", hint: "paleta cálida" },
  { id: "rose", label: "Rose", hint: "paleta rosada" },
  { id: "storm", label: "Storm", hint: "paleta fría" },
];

const STORAGE_KEY = "deskui-theme";

function isTheme(value: string | null): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

function readUrlTheme(): ThemeId | null {
  const requested = new URLSearchParams(window.location.search).get("theme");
  return isTheme(requested) ? requested : null;
}

function readStoredTheme(): ThemeId | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Prioridad del tema: URL (`?theme=gradient`, para compartir capturas),
 * preferencia guardada en `localStorage` y, si no hay ninguna, el tema clásico.
 * El alto contraste es una elección explícita, no se activa por el tema del
 * sistema.
 */
function readInitialTheme(): ThemeId {
  return readUrlTheme() ?? readStoredTheme() ?? "classic";
}

function storeTheme(theme: ThemeId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // El almacenamiento puede estar bloqueado (modo privado, políticas).
  }
}

/**
 * Tema compartido por el laboratorio y la documentación. Se guarda en la URL
 * (`?theme=gradient`) para que una captura o un enlace reproduzca el tema y en
 * `localStorage` para conservarlo al volver.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(readInitialTheme);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    storeTheme(next);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    const url = new URL(window.location.href);
    if (theme === "classic") {
      url.searchParams.delete("theme");
    } else {
      url.searchParams.set("theme", theme);
    }
    window.history.replaceState(null, "", url);

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (meta) {
      const surface = getComputedStyle(document.documentElement)
        .getPropertyValue("--w95-desktop")
        .trim();
      if (surface) {
        meta.content = surface;
      }
    }
  }, [theme]);

  return [theme, setTheme] as const;
}
