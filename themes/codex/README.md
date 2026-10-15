# Zenkai Clay for Codex

A native dark appearance preset using Zenkai Clay's near-black background,
warm off-white text, and clay accent. It uses Codex's built-in Monokai code
theme and Zenkai's colors for added lines, removed lines, and skills.

## Installation

1. Open Codex **Settings → Appearance**.
2. Choose **Dark** for the app appearance.
3. Under **Dark theme**, click **Import**.
4. Paste the complete contents of [`zenkai-clay.codex-theme`](zenkai-clay.codex-theme)
   into the theme share-string field, then click **Import theme**.

On macOS, copy the share string from the repository root with:

```sh
pbcopy < themes/codex/zenkai-clay.codex-theme
```

Import replaces the dark theme's colors, code preset, fonts, contrast, and
translucency settings. Use **Copy theme** before importing to save your previous
dark appearance. This preset uses system UI and code fonts, contrast `60`, and
an opaque sidebar to keep the background consistent with Clay.

## Colors and limits

| Setting       | Value     |
| ------------- | --------- |
| Background    | `#1d1d1d` |
| Foreground    | `#f0efec` |
| Accent        | `#d97757` |
| Added lines   | `#7bd88f` |
| Removed lines | `#fc618d` |
| Skills        | `#948ae3` |

Codex generates its surfaces, borders, and secondary text from the background,
foreground, and contrast setting. Its share format selects an existing code
theme; it does not import Zenkai's individual syntax rules or separate sidebar
colors. Monokai is the closest built-in choice to Zenkai's Monokai Pro roots,
but its syntax colors differ from the VS Code and Zed versions.

The preset targets the `codex-theme-v1:` share format. The companion JSON file
contains the same payload for inspection; paste the share string when importing.
Appearance customization is described in the
[official OpenAI documentation](https://learn.chatgpt.com/docs/reference/settings#appearance).

## Development

Both preset files are generated from `src/palettes/variants/clay.ts` by
`src/generators/codex.ts`. From `themes/vscode`, run `npm run generate` to
regenerate them. Do not edit the generated files directly.
