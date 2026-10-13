// Public entrypoint for the theme customization helpers used by the extension and tests.
export { ACCENT_DEFAULT, ACCENT_PRESETS } from "./accents";
export { MANAGED_COLOR_KEYS } from "./keys";
export {
  SETTINGS_NAMESPACE,
  THEME_DEFAULT,
  getSupportedThemeNames,
} from "./catalog";
export { withAlpha, alphaFromTransparency } from "./color";
export { normalizeSettings } from "./settings";
export { buildColorCustomizations } from "./customizations";
export { buildThemeOverrides } from "./overrides";
export type {
  ColorCustomizations,
  NormalizedSettings,
  RawSettings,
  ThemeColors,
  ThemeCustomizationBlock,
  ThemeDefinition,
  ThemeDocument,
  ThemeName,
} from "./types";
