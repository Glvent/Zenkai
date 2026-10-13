import type { ThemeVariantSource } from "../types";

// Clay follows Claude's dark interface and docs: pure neutral near-black grays,
// warm off-white text, the clay brand accent, and Claude's status colors.
export const clayVariant: ThemeVariantSource = {
  id: "clay",
  name: "Zenkai Clay",
  palette: {
    chromeBg: "#111111",
    overlayBg: "#131313",
    commandCenterBg: "#141414",
    sidebarBg: "#151515",
    raisedBg: "#171717",
    editorBg: "#191919",
    activityBarBorder: "#1f1f1f",
    border: "#262626",
    indentGuideInactive: "#2a2a2a",
    surfaceBg: "#242424",
    chromeBorder: "#2c2c2c",
    panelBorder: "#303030",
    interactionBg: "#3d3d3d",
    indentGuideActive: "#4a4a4a",
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
