import type { ThemeVariantSource } from "../types";

// Clay follows Claude's dark interface and docs: pure neutral near-black grays,
// warm off-white text, the clay brand accent, and Claude's status colors.
export const clayVariant: ThemeVariantSource = {
  id: "clay",
  name: "Zenkai Clay",
  palette: {
    chromeBg: "#131313",
    overlayBg: "#151515",
    commandCenterBg: "#161616",
    sidebarBg: "#171717",
    raisedBg: "#191919",
    editorBg: "#1a1a1a",
    activityBarBorder: "#212121",
    border: "#282828",
    indentGuideInactive: "#2c2c2c",
    surfaceBg: "#262626",
    chromeBorder: "#2e2e2e",
    panelBorder: "#323232",
    interactionBg: "#3f3f3f",
    indentGuideActive: "#4c4c4c",
    info: "#6da7ec",
    fgSubtle: "#6d6b67",
    fgStatus: "#7b7974",
    success: "#55bf50",
    fgMuted: "#898781",
    fgSidebar: "#a5a49a",
    purple: "#b796ff",
    fgSecondary: "#c3c2b7",
    accent: "#d97757",
    fg: "#f0efec",
    error: "#ec7e7e",
    warning: "#f9c868",
    pureRed: "#ff0000",
    brightFg: "#f9f9f7",
  },
};

export default clayVariant;
