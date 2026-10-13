import classicTheme from "../../themes/zenkai-classic.json";
import clayTheme from "../../themes/zenkai-clay.json";
import espressoTheme from "../../themes/zenkai-espresso.json";
import nautilusTheme from "../../themes/zenkai-nautilus.json";
import graphiteTheme from "../../themes/zenkai-graphite.json";
import paperTheme from "../../themes/zenkai-paper.json";

import type { ThemeDefinition, ThemeDocument, ThemeName } from "./types";

// Keep the bundled theme registry in one place so runtime code and tests share the same source.
const classicThemeDocument = classicTheme as ThemeDocument;
const espressoThemeDocument = espressoTheme as ThemeDocument;
const nautilusThemeDocument = nautilusTheme as ThemeDocument;
const graphiteThemeDocument = graphiteTheme as ThemeDocument;
const clayThemeDocument = clayTheme as ThemeDocument;
const paperThemeDocument = paperTheme as ThemeDocument;

export const SETTINGS_NAMESPACE = "zenkai";
export const THEME_DEFAULT = "default" as const;

export const SUPPORTED_THEMES: Record<ThemeName, ThemeDefinition> = Object.freeze({
  "Zenkai Classic": {
    colors: classicThemeDocument.colors,
  },
  "Zenkai Espresso": {
    colors: espressoThemeDocument.colors,
  },
  "Zenkai Nautilus": {
    colors: nautilusThemeDocument.colors,
  },
  "Zenkai Graphite": {
    colors: graphiteThemeDocument.colors,
  },
  "Zenkai Clay": {
    colors: clayThemeDocument.colors,
  },
  "Zenkai Paper": {
    colors: paperThemeDocument.colors,
  },
});

// Preserve a deterministic theme order for iteration and tests.
export function getSupportedThemeNames(): ThemeName[] {
  return Object.keys(SUPPORTED_THEMES) as ThemeName[];
}
