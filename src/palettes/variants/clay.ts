import type { ThemeVariantSource } from "../types";

// Clay follows Claude's dark interface and docs: pure neutral near-black grays,
// warm off-white text, and the clay brand accent. Syntax colors match Graphite.
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
    info: "#5ad4e6",
    fgSubtle: "#6d6b67",
    fgStatus: "#7b7974",
    success: "#7bd88f",
    fgMuted: "#898781",
    fgSidebar: "#a5a49a",
    purple: "#948ae3",
    fgSecondary: "#c3c2b7",
    accent: "#d97757",
    fg: "#f0efec",
    error: "#fc618d",
    warning: "#fd9353",
    pureRed: "#ff0000",
    brightFg: "#f9f9f7",
  },
};

export default clayVariant;
