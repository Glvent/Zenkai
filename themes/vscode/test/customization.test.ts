import assert from "node:assert/strict";
import test from "node:test";

import {
  alphaFromTransparency,
  buildColorCustomizations,
  buildThemeOverrides,
  normalizeSettings,
  withAlpha,
} from "../src/customization";
import graphiteTheme from "../themes/zenkai-graphite.json";

test("popup transparency applies alpha to popup menu backgrounds", () => {
  const overrides = buildThemeOverrides("Zenkai Graphite", {
    popupTransparency: 0.4,
  });

  assert.equal(overrides["menu.background"], "#20202066");
  assert.equal(overrides["dropdown.background"], "#20202066");
  assert.equal(overrides["dropdown.listBackground"], "#20202066");
  assert.equal(overrides["editorSuggestWidget.background"], "#20202066");
  assert.equal(overrides["editorHoverWidget.background"], "#20202066");
  assert.equal(overrides["editorHoverWidget.statusBarBackground"], "#20202066");
  assert.equal(overrides["quickInput.background"], "#20202066");
});

test("hover status bar mirrors the hover background even without popup transparency", () => {
  const overrides = buildThemeOverrides("Zenkai Graphite", {});

  assert.equal(overrides["editorHoverWidget.background"], undefined);
  assert.equal(
    overrides["editorHoverWidget.statusBarBackground"],
    graphiteTheme.colors["editorHoverWidget.background"]
  );
});

test("terminal location match resets the terminal color to the VS Code default and clears when disabled", () => {
  const enabled = buildThemeOverrides("Zenkai Graphite", {
    terminalMatchLocation: true,
  });
  assert.equal(enabled["terminal.background"], "default");
  assert.equal(enabled["outputView.background"], undefined);
  assert.equal(enabled["outputViewStickyScroll.background"], undefined);

  const disabled = buildThemeOverrides("Zenkai Graphite", {
    terminalMatchLocation: false,
  });
  assert.equal(disabled["terminal.background"], undefined);
});

test("buildColorCustomizations preserves unrelated keys and prunes legacy accent overrides", () => {
  const existing = {
    "editorCursor.foreground": "#ffffff",
    "[Zenkai Classic]": {
      "sideBar.foreground": "#abcdef",
      "activityBar.activeFocusBorder": "#654321",
      "panelTitle.activeBorder": "#654321",
      "tab.activeForeground": "#ff6188",
      "editor.findMatchBackground": "#ff618826",
    },
  };

  const applied = buildColorCustomizations(existing, "Zenkai Classic", {
    terminalMatchLocation: true,
  });
  const classicBlock = applied["[Zenkai Classic]"] as Record<string, string>;

  assert.equal(applied["editorCursor.foreground"], "#ffffff");
  assert.equal(classicBlock["sideBar.foreground"], "#abcdef");
  assert.equal(classicBlock["terminal.background"], "default");
  assert.equal(classicBlock["activityBar.activeFocusBorder"], undefined);
  assert.equal(classicBlock["panelTitle.activeBorder"], undefined);
  assert.equal(classicBlock["tab.activeForeground"], undefined);
  assert.equal(classicBlock["editor.findMatchBackground"], undefined);
  assert.equal((applied["[Zenkai Graphite]"] as Record<string, string>)["terminal.background"], "default");

  const reset = buildColorCustomizations(applied, "Zenkai Classic", {});
  assert.equal(reset["editorCursor.foreground"], "#ffffff");
  assert.equal((reset["[Zenkai Classic]"] as Record<string, string>)["sideBar.foreground"], "#abcdef");
  assert.equal((reset["[Zenkai Classic]"] as Record<string, string>)["terminal.background"], undefined);
});

test("unsupported active themes are left untouched", () => {
  const existing = {
    "[Zenkai Graphite]": {
      "tab.activeForeground": "#f0a84a",
    },
  };

  assert.equal(
    buildColorCustomizations(existing, "One Dark Pro", {
      terminalMatchLocation: true,
    }),
    existing
  );
});

test("utility helpers preserve alpha channels", () => {
  assert.equal(alphaFromTransparency(0), "00");
  assert.equal(alphaFromTransparency(0.4), "66");
  assert.equal(alphaFromTransparency(1), "ff");
  assert.equal(withAlpha("#78dce8", "26"), "#78dce826");
});

test("popup transparency normalization preserves decimals and clamps to the supported range", () => {
  assert.equal(normalizeSettings({ popupTransparency: 0.35 }).popupTransparency, 0.35);
  assert.equal(normalizeSettings({ popupTransparency: -1 }).popupTransparency, 0);
  assert.equal(normalizeSettings({ popupTransparency: 2 }).popupTransparency, 1);
});
