import fs from "node:fs";
import path from "node:path";

import clayVariant from "../palettes/variants/clay";

const outputRoot = path.resolve(__dirname, "..", "..", "themes", "codex");

// Codex imports app colors alongside a built-in code theme, not TextMate rules.
// Keep the native share envelope so users can import without modifying the app.
export function generateCodexTheme(): void {
	const { palette } = clayVariant;
	const document = {
		codeThemeId: "monokai",
		theme: {
			accent: palette.accent,
			accentSource: "custom",
			contrast: 60,
			fonts: { code: null, ui: null },
			ink: palette.fg,
			opaqueWindows: true,
			semanticColors: {
				diffAdded: palette.success,
				diffRemoved: palette.error,
				skill: palette.purple,
			},
			surface: palette.editorBg,
		},
		variant: "dark",
	};

	fs.mkdirSync(outputRoot, { recursive: true });
	fs.writeFileSync(
		path.join(outputRoot, "zenkai-clay.json"),
		`${JSON.stringify(document, null, 2)}\n`,
		"utf8"
	);
	fs.writeFileSync(
		path.join(outputRoot, "zenkai-clay.codex-theme"),
		`codex-theme-v1:${JSON.stringify(document)}\n`,
		"utf8"
	);
	console.log("Generated Codex Zenkai Clay theme and import string");
}
