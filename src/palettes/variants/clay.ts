import type { ThemeVariantSource } from "../types";

// Clay follows Claude's dark interface and docs: pure neutral near-black grays,
// warm off-white text, the clay brand accent, and Claude's status colors.
export const clayVariant: ThemeVariantSource = {
  id: "clay",
  name: "Zenkai Clay",
  palette: {
    chromeBg: "#161616",
    overlayBg: "#181818",
    commandCenterBg: "#191919",
    sidebarBg: "#1a1a1a",
    raisedBg: "#1c1c1c",
    editorBg: "#1d1d1d",
    activityBarBorder: "#242424",
    border: "#2b2b2b",
    indentGuideInactive: "#2f2f2f",
    surfaceBg: "#292929",
    chromeBorder: "#313131",
    panelBorder: "#353535",
    interactionBg: "#424242",
    indentGuideActive: "#4f4f4f",
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
