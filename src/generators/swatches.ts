import fs from "node:fs";
import path from "node:path";

// Write the SVG color swatches referenced by the repo docs. Docs embed swatches as
// <img src="assets/swatches/<hex>.svg">; this writes one file per referenced hex and
// removes swatches no doc uses anymore.

const repoRoot = path.resolve(__dirname, "..", "..");
const swatchDir = path.join(repoRoot, "assets", "swatches");
const docs = ["README.md", "COLOR.md"];

export function generateSwatches(): void {
  const hexes = new Set<string>();

  for (const doc of docs) {
    const text = fs.readFileSync(path.join(repoRoot, doc), "utf8");
    for (const match of text.matchAll(/assets\/swatches\/([0-9a-f]{6})\.svg/g)) {
      hexes.add(match[1]);
    }
  }

  fs.mkdirSync(swatchDir, { recursive: true });

  for (const file of fs.readdirSync(swatchDir)) {
    if (!hexes.has(path.basename(file, ".svg"))) {
      fs.rmSync(path.join(swatchDir, file));
    }
  }

  for (const hex of hexes) {
    fs.writeFileSync(path.join(swatchDir, `${hex}.svg`), swatchSvg(hex), "utf8");
  }

  console.log(`Generated ${hexes.size} swatches`);
}

// The faint gray outline keeps near-black and near-white swatches visible on both
// light and dark backgrounds.
function swatchSvg(hex: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="0.5" y="0.5" width="23" height="23" rx="4" fill="#${hex}" stroke="#808080" stroke-opacity="0.5"/></svg>\n`;
}
