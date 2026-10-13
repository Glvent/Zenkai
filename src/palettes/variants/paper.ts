import type { ThemeVariantSource } from "../types";

// Paper is the light variant: a warm off-white stack where the editor is the darkest
// background and the surrounding chrome lightens away from it. Panels, buttons, and
// borders sit darker than the editor; accents are deepened to stay readable.
export const paperVariant: ThemeVariantSource = {
  id: "paper",
  name: "Zenkai Paper",
  palette: {
    chromeBg: "#f1efea",
    overlayBg: "#efede8",
    commandCenterBg: "#eeece7",
    sidebarBg: "#edebe6",
    raisedBg: "#ebe9e3",
    editorBg: "#e9e7e1",
    activityBarBorder: "#d4d2cc",
    border: "#d0cec7",
    indentGuideInactive: "#d6d4ce",
    surfaceBg: "#dbd9d2",
    chromeBorder: "#cbc9c2",
    panelBorder: "#c5c3bb",
    interactionBg: "#b1aea6",
    indentGuideActive: "#a29f97",
    info: "#23707c",
    fgSubtle: "#85827a",
    fgStatus: "#77746c",
    success: "#3d7232",
    fgMuted: "#65625b",
    fgSidebar: "#615e57",
    purple: "#6c55b4",
    fgSecondary: "#46443f",
    accent: "#8a5e10",
    fg: "#2b2a27",
    error: "#b03c5e",
    warning: "#a24f1c",
    pureRed: "#ff0000",
    brightFg: "#141412",
  },
};

export default paperVariant;
