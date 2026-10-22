import type { Messages } from "./messages";
import type { ThemeId } from "../lib/theme";

/** Etiquetas e indicaciones de los temas, resueltas desde el diccionario. */
export function themeLabel(messages: Messages, id: ThemeId): string {
  switch (id) {
    case "classic":
      return messages.themes.classic;
    case "gradient":
      return messages.themes.gradient;
    case "high-contrast":
      return messages.themes["high-contrast"];
    case "desert":
      return messages.themes.desert;
    case "rose":
      return messages.themes.rose;
    case "storm":
      return messages.themes.storm;
  }
}

export function themeHint(messages: Messages, id: ThemeId): string {
  switch (id) {
    case "classic":
      return messages.themes.classicHint;
    case "gradient":
      return messages.themes.gradientHint;
    case "high-contrast":
      return messages.themes["high-contrastHint"];
    case "desert":
      return messages.themes.desertHint;
    case "rose":
      return messages.themes.roseHint;
    case "storm":
      return messages.themes.stormHint;
  }
}
