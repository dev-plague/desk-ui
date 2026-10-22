import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { MESSAGES, type Locale, type Messages } from "./messages";

type StringKeys<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends readonly string[]
      ? never
      : `${K}.${StringKeys<T[K]>}`;
}[keyof T & string];

export type MessageKey = StringKeys<Messages>;

export type MessageVars = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: MessageVars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "deskui-locale";

function isLocale(value: string | null): value is Locale {
  return value === "es" || value === "en";
}

function readUrlLocale(): Locale | null {
  const requested = new URLSearchParams(window.location.search).get("lang");
  return isLocale(requested) ? requested : null;
}

function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Prioridad del idioma: URL (`?lang=en`, para compartir un enlace) y
 * preferencia guardada. Sin preferencia explícita, el sitio usa español.
 */
function readInitialLocale(): Locale {
  return readUrlLocale() ?? readStoredLocale() ?? "es";
}

function storeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // El almacenamiento puede estar bloqueado (modo privado, políticas).
  }
}

function resolveMessage(source: unknown, key: string): string {
  let current: unknown = source;
  for (const part of key.split(".")) {
    if (!current || typeof current !== "object") {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}

function interpolate(template: string, vars?: MessageVars) {
  if (!vars) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    storeLocale(locale);

    const url = new URL(window.location.href);
    if (locale === "es") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", locale);
    }
    window.history.replaceState(null, "", url);
  }, [locale]);

  const t = useCallback(
    (key: MessageKey, vars?: MessageVars) =>
      interpolate(resolveMessage(MESSAGES[locale], key), vars),
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      messages: MESSAGES[locale],
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n debe usarse dentro de I18nProvider.");
  }
  return context;
}

export type { Locale };
