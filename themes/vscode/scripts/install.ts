import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const packageRoot = path.resolve(__dirname, "..");

// Installation is explicit: ordinary builds never probe or modify an editor.
export function installVsix(vsixPath: string, extensionId: string): string | null {
	if (!existsSync(vsixPath)) {
		throw new Error(`No VSIX was created at ${vsixPath}.`);
	}

	const activeCli = detectPreferredVsCodeCli();
	if (!activeCli) {
		return "skipped · no VS Code CLI";
	}

	if (isExtensionInstalled(activeCli.command, extensionId)) {
		execOrThrow(activeCli.command, ["--uninstall-extension", extensionId]);
	}
	execOrThrow(activeCli.command, ["--install-extension", vsixPath, "--force"]);
	return null;
}

function execOrThrow(command: string, args: string[]): void {
	const result = spawnSync(command, args, {
		cwd: packageRoot,
		encoding: "utf8",
		shell: process.platform === "win32",
	});
	if (result.error || result.status !== 0) {
		throw Object.assign(new Error(`Command failed: ${command} ${args.join(" ")}`), {
			output: `${result.stdout ?? ""}${result.stderr ?? ""}${result.error?.message ?? ""}`,
		});
	}
}

// Prefer the CLI that matches a currently running editor, then fall back to any installed CLI.
export function detectPreferredVsCodeCli(): { command: string } | null {
	const runningEditors = detectRunningEditors();

	if (runningEditors.includes("code-insiders") && isCommandAvailable("code-insiders")) {
		return { command: "code-insiders" };
	}

	if (runningEditors.includes("code") && isCommandAvailable("code")) {
		return { command: "code" };
	}

	if (isCommandAvailable("code")) {
		return { command: "code" };
	}

	if (isCommandAvailable("code-insiders")) {
		return { command: "code-insiders" };
	}

	return null;
}

// Detect active VS Code processes so packaging can refresh the editor the user is already working in.
function detectRunningEditors(): string[] {
	if (process.platform === "win32") {
		const result = spawnSync("tasklist", ["/FO", "CSV", "/NH"], {
			cwd: packageRoot,
			encoding: "utf8",
		});

		if (result.status !== 0) {
			return [];
		}

		const processNames = result.stdout
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter(Boolean)
			.map(parseCsvFirstColumn)
			.map((name) => name.toLowerCase());

		return unique([
			processNames.includes("code - insiders.exe") ||
			processNames.includes("code-insiders.exe")
				? "code-insiders"
				: null,
			processNames.includes("code.exe") ? "code" : null,
		]);
	}

	const result = spawnSync("ps", ["-A", "-o", "comm="], {
		cwd: packageRoot,
		encoding: "utf8",
	});

	if (result.status !== 0) {
		return [];
	}

	const processNames = result.stdout
		.split(/\r?\n/)
		.map((line) => path.basename(line.trim()).toLowerCase())
		.filter(Boolean);

	return unique([
		processNames.some((name) => name === "code-insiders" || name === "code - insiders")
			? "code-insiders"
			: null,
		processNames.includes("code") ? "code" : null,
	]);
}

// `tasklist /FO CSV` quotes process names that contain spaces, so parse only the leading column.
function parseCsvFirstColumn(line: string): string {
	if (line.startsWith('"')) {
		const closingQuoteIndex = line.indexOf('",');
		return closingQuoteIndex === -1 ? line.slice(1, -1) : line.slice(1, closingQuoteIndex);
	}

	const commaIndex = line.indexOf(",");
	return commaIndex === -1 ? line : line.slice(0, commaIndex);
}

// Preserve discovery order while stripping null placeholders from platform-specific process checks.
function unique(values: Array<string | null>): string[] {
	return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

// Probe whether a CLI exists without printing platform-specific lookup noise.
function isCommandAvailable(command: string): boolean {
	const lookup = process.platform === "win32" ? "where" : "which";
	const result = spawnSync(lookup, [command], {
		cwd: packageRoot,
		stdio: "ignore",
	});
	return result.status === 0;
}

// Treat a failed `--list-extensions` call as installed so the later uninstall attempt is still allowed to proceed.
function isExtensionInstalled(command: string, extensionIdentifier: string): boolean {
	const result = spawnSync(command, ["--list-extensions"], {
		cwd: packageRoot,
		encoding: "utf8",
		shell: process.platform === "win32",
	});

	if (result.status !== 0) {
		return true;
	}

	const installedExtensions = result.stdout
		.split(/\r?\n/)
		.map((line) => line.trim().toLowerCase())
		.filter(Boolean);

	return installedExtensions.includes(extensionIdentifier.toLowerCase());
}
