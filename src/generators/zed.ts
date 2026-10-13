import fs from "node:fs";
import path from "node:path";

import { commentGray, darkenHex, isLightPalette, offsetHex } from "../palettes/color";
import { variants } from "../palettes";
import type { ThemePalette, ThemeVariantSource } from "../palettes/types";

// Generate Zed theme JSON from the shared palettes and hand-authored Graphite base.
const zedRoot = path.resolve(__dirname, "..", "..", "themes", "zed");
const baseThemePath = path.resolve(__dirname, "..", "bases", "zed.json");

type ThemeStyle = Record<string, unknown>;
type ZedTheme = {
  $schema?: string;
  name: string;
  author: string;
  themes: Array<{ name: string; appearance: string; style: ThemeStyle }>;
};

// Roles that resolve straight to a palette color, plus the chromatic ANSI dim colors,
// which are the matching role darkened to 0.70 brightness per channel.
type DirectRole = { role: keyof ThemePalette };
type DimRole = { role: keyof ThemePalette; darken: number };
type RoleEntry = DirectRole | DimRole;

const DIM_FACTOR = 0.7;

const zedRoleByHex: Record<string, RoleEntry> = Object.freeze({
  "#1c1c1c": { role: "chromeBg" },
  "#202020": { role: "overlayBg" },
  "#232323": { role: "commandCenterBg" },
  "#242424": { role: "sidebarBg" },
  "#252525": { role: "raisedBg" },
  "#282828": { role: "editorBg" },
  "#2e2e2e": { role: "activityBarBorder" },
  "#323232": { role: "border" },
  "#383838": { role: "indentGuideInactive" },
  "#39383a": { role: "surfaceBg" },
  "#3a3a3a": { role: "chromeBorder" },
  "#434344": { role: "panelBorder" },
  "#555356": { role: "interactionBg" },
  "#5a5a5a": { role: "indentGuideActive" },
  "#5ad4e6": { role: "info" },
  "#6c6a6f": { role: "fgSubtle" },
  "#6e6c71": { role: "fgStatus" },
  "#7bd88f": { role: "success" },
  "#8b888f": { role: "fgMuted" },
  "#8e8b93": { role: "fgSidebar" },
  "#948ae3": { role: "purple" },
  "#bab6c0": { role: "fgSecondary" },
  "#f0a84a": { role: "accent" },
  "#f7f1ff": { role: "fg" },
  "#fc618d": { role: "error" },
  "#fd9353": { role: "warning" },
  "#ff0000": { role: "pureRed" },
  "#ffffff": { role: "brightFg" },
  // Chromatic ANSI dim colors: each is its base role at 0.70 brightness.
  "#b04463": { role: "error", darken: DIM_FACTOR },
  "#569764": { role: "success", darken: DIM_FACTOR },
  "#a87634": { role: "accent", darken: DIM_FACTOR },
  "#b1673a": { role: "warning", darken: DIM_FACTOR },
  "#68619f": { role: "purple", darken: DIM_FACTOR },
  "#3f94a1": { role: "info", darken: DIM_FACTOR },
});

// Off-palette grays the Graphite Zed theme uses. The first three are derived from
// palette roles (formulas chosen to reproduce Graphite exactly); focusBorder has a
// non-uniform delta from interactionBg, so it is given per variant below.
const focusBorderById: Record<string, string> = Object.freeze({
  graphite: "#56545a",
  classic: "#565458",
  espresso: "#565256",
  nautilus: "#57575d",
  clay: "#555555",
  paper: "#aba8a0",
});

const extraRoleByHex: Record<string, "elevatedSurface" | "disabledGray" | "commentGray" | "focusBorder"> =
  Object.freeze({
    "#1e1e1e": "elevatedSurface",
    "#2c2c2c": "disabledGray",
    "#56545a": "focusBorder",
    "#69676c": "commentGray",
  });

export function generateZedThemes(): void {
  const baseTheme = JSON.parse(fs.readFileSync(baseThemePath, "utf8")) as ZedTheme;
  fs.mkdirSync(path.join(zedRoot, "themes"), { recursive: true });

  for (const variant of variants) {
    const document = buildThemeDocument(baseTheme, variant);
    const outputPath = path.join(zedRoot, "themes", `zenkai-${variant.id}.json`);

    fs.writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
    console.log(`Generated ${path.relative(zedRoot, outputPath)}`);
  }
}

function buildThemeDocument(baseTheme: ZedTheme, variant: ThemeVariantSource): ZedTheme {
  const baseStyle = baseTheme.themes[0]?.style ?? {};

  return {
    $schema: baseTheme.$schema,
    name: variant.name,
    author: baseTheme.author,
    themes: [
      {
        name: variant.name,
        appearance: isLightPalette(variant.palette) ? "light" : "dark",
        style: mapStyle(baseStyle, variant) as ThemeStyle,
      },
    ],
  };
}

function mapStyle(value: unknown, variant: ThemeVariantSource): unknown {
  if (typeof value === "string") {
    return mapColor(value, variant);
  }

  if (Array.isArray(value)) {
    return value.map((item) => mapStyle(item, variant));
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      result[key] = mapStyle(child, variant);
    }
    return result;
  }

  return value;
}

function mapColor(colorValue: string, variant: ThemeVariantSource): string {
  const normalized = colorValue.toLowerCase();

  if (!/^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(normalized)) {
    return colorValue;
  }

  const baseHex = normalized.slice(0, 7);
  const alphaSuffix = normalized.length === 9 ? normalized.slice(7) : "";

  const extra = extraRoleByHex[baseHex];
  if (extra) {
    return `${resolveExtra(extra, variant)}${alphaSuffix}`;
  }

  const entry = zedRoleByHex[baseHex];
  if (!entry) {
    return colorValue;
  }

  const resolved = variant.palette[entry.role];
  const finalHex = "darken" in entry ? darkenHex(resolved, entry.darken) : resolved;
  return `${finalHex}${alphaSuffix}`;
}

function resolveExtra(
  extra: "elevatedSurface" | "disabledGray" | "commentGray" | "focusBorder",
  variant: ThemeVariantSource,
): string {
  const { palette } = variant;

  switch (extra) {
    case "elevatedSurface":
      return offsetHex(palette.chromeBg, 2);
    case "disabledGray":
      // Disabled and pane borders sit just off the editor, toward the border colors.
      return offsetHex(palette.editorBg, isLightPalette(palette) ? -4 : 4);
    case "commentGray":
      return commentGray(palette);
    case "focusBorder":
      return focusBorderById[variant.id] ?? palette.interactionBg;
  }
}
