import type { ThemeVariantSource } from "../types";

// Clay follows Claude's dark interface and docs: near-black neutral grays,
// warm off-white text, the clay brand accent, and Claude's status colors.
export const clayVariant: ThemeVariantSource = {
  id: "clay",
  name: "Zenkai Clay",
  palette: {
    chromeBg: "#131313",
    overlayBg: "#151515",
    commandCenterBg: "#181817",
    sidebarBg: "#1a1a19",
    raisedBg: "#1c1c1b",
    editorBg: "#1e1e1d",
    activityBarBorder: "#262625",
    border: "#2e2e2c",
    indentGuideInactive: "#333331",
    surfaceBg: "#2c2c2a",
    chromeBorder: "#353533",
    panelBorder: "#383835",
    interactionBg: "#454442",
    indentGuideActive: "#52514e",
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
