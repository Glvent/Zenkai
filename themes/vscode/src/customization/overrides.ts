import { DEFAULT_COLOR_VALUE, POPUP_BACKGROUND_KEYS, TERMINAL_MATCH_KEYS } from "./keys";
import { SUPPORTED_THEMES } from "./catalog";
import { withAlpha, alphaFromTransparency } from "./color";
import { normalizeSettings } from "./settings";
import type { RawSettings, ThemeCustomizationBlock, ThemeName } from "./types";

/**
 * Build the managed color overrides for one bundled theme from normalized user preferences.
 * Each section applies one customization dimension: terminal and popups.
 */
export function buildThemeOverrides(
  themeName: ThemeName,
  rawSettings: RawSettings
): ThemeCustomizationBlock {
  const theme = SUPPORTED_THEMES[themeName];

  if (!theme) {
    return {};
  }

  const settings = normalizeSettings(rawSettings);
  const colors = theme.colors;
  const overrides: ThemeCustomizationBlock = {};

  // With no terminal color, VS Code paints the terminal with the panel, sidebar, or editor
  // background depending on where the terminal view lives.
  if (settings.terminalMatchLocation) {
    for (const colorKey of TERMINAL_MATCH_KEYS) {
      overrides[colorKey] = DEFAULT_COLOR_VALUE;
    }
  }

  if (settings.popupTransparency > 0) {
    const alpha = alphaFromTransparency(settings.popupTransparency);

    for (const colorKey of POPUP_BACKGROUND_KEYS) {
      const baseColor = overrides[colorKey] ?? colors[colorKey];

      if (!baseColor) {
        continue;
      }

      overrides[colorKey] = withAlpha(baseColor, alpha);
    }
  }

  const hoverBackground = overrides["editorHoverWidget.background"] ?? colors["editorHoverWidget.background"];
  if (hoverBackground) {
    overrides["editorHoverWidget.statusBarBackground"] = hoverBackground;
  }

  return overrides;
}
