import type { ThemeVariantSource } from "../types";

// Clay follows Anthropic's brand and Claude dark mode: warm charcoal backgrounds,
// ivory text, clay orange accent, and brand blue and green.
export const clayVariant: ThemeVariantSource = {
  id: "clay",
  name: "Zenkai Clay",
  palette: {
    chromeBg: "#1a1a18",
    overlayBg: "#1f1e1d",
    commandCenterBg: "#21211f",
    sidebarBg: "#222220",
    raisedBg: "#242422",
    editorBg: "#262624",
    activityBarBorder: "#2c2c2a",
    border: "#30302e",
    indentGuideInactive: "#363634",
    surfaceBg: "#373735",
    chromeBorder: "#383836",
    panelBorder: "#41413f",
    interactionBg: "#535350",
    indentGuideActive: "#585855",
    info: "#6a9bcc",
    fgSubtle: "#6d6b65",
    fgStatus: "#6f6d67",
    success: "#93a872",
    fgMuted: "#8c8a83",
    fgSidebar: "#8f8d86",
    purple: "#9f94d6",
    fgSecondary: "#c2c0b6",
    accent: "#d97757",
    fg: "#f0eee6",
    error: "#d87884",
    warning: "#d4a27f",
    pureRed: "#ff0000",
    brightFg: "#faf9f5",
  },
};

export default clayVariant;
