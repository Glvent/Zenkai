import { normalizeUnitInterval } from "./color";
import type { NormalizedSettings, RawSettings } from "./types";

/**
 * Coerce user configuration into a stable internal shape so the override builders
 * only deal with validated values.
 */
export function normalizeSettings(rawSettings: RawSettings = {}): NormalizedSettings {
  return {
    popupTransparency: normalizeUnitInterval(rawSettings.popupTransparency),
    terminalMatchLocation: rawSettings.terminalMatchLocation === true,
  };
}
