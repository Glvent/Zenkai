import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

import { generateAllThemes } from "../../../src/generators";
import { generateVscodeThemes } from "../../../src/generators/vscode";
import { detectPreferredVsCodeCli, installVsix } from "./install";

// Orchestrate compilation and tests without changing versions or installed extensions.
// Repository-wide generation and editor installation are explicit modes.
// Each step prints one aligned status line; subprocess output is shown on failure.

// Keep child-process deprecation warnings out of the build log; surface anything else.
process.removeAllListeners("warning");
process.on("warning", (warning) => {
	if (warning.name === "DeprecationWarning") return;
	console.warn(warning.stack ?? warning.message);
});

const packageRoot = path.resolve(__dirname, "..");
const packageJson = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8")) as {
	publisher: string;
	name: string;
	version: string;
};

const LABEL_WIDTH = 10;
const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
const c = {
	dim: paint("2", "22"),
	bold: paint("1", "22"),
	red: paint("31", "39"),
	green: paint("32", "39"),
	yellow: paint("33", "39"),
	magenta: paint("35", "39"),
	cyan: paint("36", "39"),
};

type BuildMode = "build" | "compile" | "test" | "dev" | "generate" | "install";

void main().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`\n  ${c.red("✗ Build failed")}  ${c.dim(message)}\n`);
	process.exit(1);
});

function parseMode(): BuildMode {
	const arg = process.argv[2];
	switch (arg) {
		case undefined:
			return "build";
		case "build":
		case "compile":
		case "test":
		case "dev":
		case "generate":
		case "install":
			return arg;
		default:
			throw new Error(`Unsupported build mode: ${arg}`);
	}
}

// Drive the pipeline for the requested mode, surfacing each phase as its own status line.
async function main(): Promise<void> {
	const mode = parseMode();
	const startedAt = process.hrtime.bigint();
	printHeader(mode);

	switch (mode) {
		case "build":
		case "compile":
			await runCompilePipeline();
			break;
		case "test":
			await runCompilePipeline();
			await step("Test", runTests);
			break;
		case "generate":
			await step("Generate", async () => {
				generateAllThemes();
				return null;
			});
			break;
		case "install":
			await step("Install", async () =>
				installVsix(
					path.join(packageRoot, `${packageJson.name}-${packageJson.version}.vsix`),
					`${packageJson.publisher}.${packageJson.name}`
				)
			);
			break;
		case "dev":
			await runCompilePipeline();
			await runDev();
			break;
	}
	printFooter(startedAt);
}

async function runCompilePipeline(): Promise<void> {
	await step("Clean", clean);
	await step("Generate", generate);
	await step("Compile", compile);
	await step("Typecheck", async () => {
		execOrThrow("tsc", ["-p", "./tsconfig.tooling.json"]);
		return null;
	});
}

async function runDev(): Promise<void> {
	const activeCli = detectPreferredVsCodeCli();
	if (activeCli) {
		spawn(activeCli.command, [`--extensionDevelopmentPath=${packageRoot}`], {
			cwd: packageRoot,
			detached: true,
			stdio: "ignore",
			shell: process.platform === "win32",
		}).unref();
	} else {
		console.log(
			`  ${c.yellow("○")} ${c.yellow("Dev host")}  ${c.yellow("skipped · no VS Code CLI")}`
		);
	}

	await new Promise<void>((resolve, reject) => {
		const watch = spawn("tsc", ["-p", "./tsconfig.json", "--watch"], {
			cwd: packageRoot,
			stdio: "inherit",
			shell: process.platform === "win32",
			env: buildEnv(),
		});

		watch.on("error", reject);
		watch.on("close", (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`tsc --watch exited with code ${code ?? 1}`));
		});
	});
}

// Remove only runtime output, leaving packaged VSIX files untouched.
async function clean(): Promise<string | null> {
	await fs.rm(path.join(packageRoot, "dist"), { recursive: true, force: true });
	return null;
}

// Regenerate only VS Code theme JSON. Other targets use the explicit generate mode.
async function generate(): Promise<string | null> {
	generateVscodeThemes();
	return null;
}

// Type-check and emit only the runtime sources and imported theme JSON into dist/.
async function compile(): Promise<string | null> {
	execOrThrow("tsc", ["-p", "./tsconfig.json"]);
	return null;
}

// Compile tests outside dist/ and discover every top-level *.test.js suite.
async function runTests(): Promise<string> {
	await fs.rm(path.join(packageRoot, ".test-build"), { recursive: true, force: true });
	execOrThrow("tsc", ["-p", "./tsconfig.test.json"]);
	const testDir = path.join(packageRoot, ".test-build", "themes", "vscode", "test");
	const suites = (await fs.readdir(testDir))
		.filter((name) => name.endsWith(".test.js"))
		.sort()
		.map((name) => path.join(testDir, name));
	if (suites.length === 0) {
		throw new Error("No compiled test suites found.");
	}
	const result = exec(process.execPath, ["--test", ...suites]);

	const total = Number(result.output.match(/(?:^|\s)tests (\d+)/)?.[1] ?? 0);
	const pass = Number(result.output.match(/(?:^|\s)pass (\d+)/)?.[1] ?? 0);
	const fail = Number(result.output.match(/(?:^|\s)fail (\d+)/)?.[1] ?? 0);

	if (result.status !== 0 || fail > 0) {
		throw withOutput(new Error(`${fail} test${fail === 1 ? "" : "s"} failed`), result.output);
	}
	return c.dim(`${pass}/${total}`);
}

// Render a step as a single line: a transient marker while it runs, then its result.
async function step(label: string, run: () => Promise<string | null>): Promise<void> {
	const startedAt = process.hrtime.bigint();
	const tty = Boolean(process.stdout.isTTY);

	if (tty) {
		process.stdout.write(`  ${c.dim("○")} ${c.dim(label)}`);
	}

	try {
		const detail = await run();
		const elapsed = Number(process.hrtime.bigint() - startedAt) / 1e6;
		const trailing = detail ?? c.dim(formatDuration(elapsed));
		writeStatus(tty, `  ${c.green("✓")} ${label.padEnd(LABEL_WIDTH)}${trailing}`);
	} catch (error) {
		writeStatus(tty, `  ${c.red("✗")} ${label.padEnd(LABEL_WIDTH)}${c.red("failed")}`);
		const output = (error as { output?: string }).output;
		if (output && output.trim()) {
			console.error(`\n${indent(output.trim())}\n`);
		}
		throw error;
	}
}

// Overwrite the transient marker on a TTY; otherwise print a plain line.
function writeStatus(tty: boolean, line: string): void {
	if (tty) {
		process.stdout.write(`\r\x1b[2K${line}\n`);
	} else {
		console.log(line);
	}
}

function printHeader(mode: BuildMode): void {
	console.log();
	console.log(`  ${c.bold(c.magenta("Zenkai"))}  ${c.dim(`${mode} · v${packageJson.version}`)}`);
	console.log();
}

function printFooter(startedAt: bigint): void {
	const elapsed = Number(process.hrtime.bigint() - startedAt) / 1e6;
	console.log();
	console.log(`  ${c.green("✓")} ${c.bold("Done")} ${c.dim(`in ${formatDuration(elapsed)}`)}`);
	console.log();
}

// Run a command with captured output, local bins on PATH, and warnings suppressed.
function exec(command: string, args: string[]): { status: number; output: string } {
	const result = spawnSync(command, args, {
		cwd: packageRoot,
		encoding: "utf8",
		// Only the Windows tsc wrapper needs a shell; keep native Node paths in argv.
		shell: command === "tsc" && process.platform === "win32",
		env: buildEnv(),
	});
	const output = `${result.stdout ?? ""}${result.stderr ?? ""}${result.error?.message ?? ""}`;
	return { status: result.status ?? 1, output };
}

// Run a command and fail the build if it exits non-zero, attaching its output.
function execOrThrow(command: string, args: string[]): { status: number; output: string } {
	const result = exec(command, args);
	if (result.status !== 0) {
		throw withOutput(new Error(`Command failed: ${command} ${args.join(" ")}`), result.output);
	}
	return result;
}

// Child environment: non-interactive, no deprecation noise, with local .bin resolvable.
function buildEnv(): NodeJS.ProcessEnv {
	const env: NodeJS.ProcessEnv = {
		...process.env,
		CI: "1",
		npm_config_yes: "true",
		NODE_OPTIONS: withNoDeprecation(process.env.NODE_OPTIONS),
	};
	const binDir = path.join(packageRoot, "node_modules", ".bin");
	const pathKey = Object.keys(env).find((key) => key.toLowerCase() === "path") ?? "PATH";
	env[pathKey] = `${binDir}${path.delimiter}${env[pathKey] ?? ""}`;
	return env;
}

function withNoDeprecation(existing: string | undefined): string {
	const flag = "--no-deprecation";
	if (!existing) return flag;
	return existing.includes(flag) ? existing : `${existing} ${flag}`;
}

function withOutput(error: Error, output: string): Error & { output: string } {
	return Object.assign(error, { output });
}

function formatDuration(ms: number): string {
	return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function indent(text: string): string {
	return text
		.split(/\r?\n/)
		.map((line) => `    ${c.dim("│")} ${line}`)
		.join("\n");
}

function paint(open: string, close: string): (value: string) => string {
	return (value) => (useColor ? `\x1b[${open}m${value}\x1b[${close}m` : value);
}
