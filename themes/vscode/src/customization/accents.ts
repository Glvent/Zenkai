import type { ThemeName } from "./types";

export const ACCENT_DEFAULT = "Default" as const;

// Single source of truth for accent presets. package.json enums are checked against this in tests.
export const ACCENT_PRESETS: Record<ThemeName, Readonly<Record<string, string>>> = Object.freeze({
  "Zenkai Graphite": { Sand: "#e6c88a", Copper: "#d98b5f", Steel: "#7fa7cf", Sage: "#a6bf8f" },
  "Zenkai Classic": { Olive: "#b5b86a", Khaki: "#cdb98a", Rust: "#c97f56", Moss: "#8fae7a" },
  "Zenkai Espresso": { Caramel: "#d8a65c", Cinnamon: "#c0784e", Latte: "#d6bfa0", Rosewood: "#c48f8f" },
  "Zenkai Nautilus": { Teal: "#4f9a9a", Sky: "#7ab0d8", Seafoam: "#7fb8a4", Indigo: "#7b84c4" },
  "Zenkai Clay": { Kraft: "#d4a27f", Crail: "#c15f3c", "Claude Blue": "#6a9bcc", Sage: "#a3b18a" },
  "Zenkai Paper": { Rust: "#a3471f", Navy: "#2f5d8a", Forest: "#3f6e3a", Plum: "#7a4a7e" },
});

// Hex for a named preset on a theme, or "" for Default/unknown names.
export function resolvePreset(themeName: ThemeName, presetName: string | undefined): string {
  const presets = ACCENT_PRESETS[themeName];
  return presetName && Object.prototype.hasOwnProperty.call(presets, presetName) ? presets[presetName] : "";
}
