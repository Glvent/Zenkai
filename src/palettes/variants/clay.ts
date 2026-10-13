import type { ThemeVariantSource } from "../types";

// Clay follows Claude's dark interface and docs: pure neutral near-black grays,
// warm off-white text, the clay brand accent, and Claude's status colors.
export const clayVariant: ThemeVariantSource = {
  id: "clay",
  name: "Zenkai Clay",
  palette: {
    chromeBg: "#151515",
    overlayBg: "#171717",
    commandCenterBg: "#181818",
    sidebarBg: "#191919",
    raisedBg: "#1b1b1b",
    editorBg: "#1c1c1c",
    activityBarBorder: "#232323",
    border: "#2a2a2a",
    indentGuideInactive: "#2e2e2e",
    surfaceBg: "#282828",
    chromeBorder: "#303030",
    panelBorder: "#343434",
    interactionBg: "#414141",
    indentGuideActive: "#4e4e4e",
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
