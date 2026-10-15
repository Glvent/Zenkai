import { generateChromeThemes } from "./chrome";
import { generateCodexTheme } from "./codex";
import { generateVscodeThemes } from "./vscode";
import { generateSwatches } from "./swatches";
import { generateZedThemes } from "./zed";

export function generateAllThemes(): void {
	generateVscodeThemes();
	generateZedThemes();
	generateChromeThemes();
	generateCodexTheme();
	generateSwatches();
}
