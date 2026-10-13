import assert from "node:assert/strict";
import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	realpathSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test, { type TestContext } from "node:test";

// Tests are emitted under .test-build/themes/vscode/test, outside runtime dist/.
const packageRoot = path.resolve(__dirname, "../../../..");
const repoRoot = path.resolve(packageRoot, "../..");
const variantIds = ["classic", "espresso", "nautilus", "graphite", "clay", "paper"];

function createFixture(context: TestContext): { root: string; extension: string } {
	const root = realpathSync(mkdtempSync(path.join(tmpdir(), "zenkai build & test-")));
	context.after(() => rmSync(root, { recursive: true, force: true }));
	const extension = path.join(root, "themes", "vscode");
	mkdirSync(extension, { recursive: true });
	cpSync(path.join(repoRoot, "src"), path.join(root, "src"), {
		recursive: true,
	});
	for (const name of ["src", "scripts"]) {
		cpSync(path.join(packageRoot, name), path.join(extension, name), { recursive: true });
	}
	for (const name of [
		"package.json",
		"package-lock.json",
		"tsconfig.json",
		"tsconfig.test.json",
		"tsconfig.tooling.json",
		".vscodeignore",
	]) {
		cpSync(path.join(packageRoot, name), path.join(extension, name));
	}
	for (const name of ["README.md", "COLOR.md"]) {
		cpSync(path.join(repoRoot, name), path.join(root, name));
	}
	symlinkSync(
		path.join(packageRoot, "node_modules"),
		path.join(extension, "node_modules"),
		"junction"
	);
	return { root, extension };
}

function runMode(extension: string, mode: string): ReturnType<typeof spawnSync> {
	return spawnSync(
		process.execPath,
		[
			path.join(packageRoot, "node_modules", "jiti", "lib", "jiti-cli.mjs"),
			"scripts/build.ts",
			mode,
		],
		{ cwd: extension, encoding: "utf8", timeout: 60_000 }
	);
}

function assertSuccess(result: ReturnType<typeof spawnSync>): void {
	assert.equal(
		result.status,
		0,
		`${result.stdout ?? ""}${result.stderr ?? ""}${result.error ?? ""}`
	);
}

function readJson(file: string): Record<string, string> {
	return JSON.parse(readFileSync(file, "utf8"));
}

test("build emits only runtime files without changing versions, packages, or other targets", (context) => {
	const { root, extension } = createFixture(context);
	const untouched = [
		path.join(extension, "zenkai-0.0.1.vsix"),
		path.join(root, "themes", "zed", "themes", "zenkai-graphite.json"),
		path.join(root, "themes", "chrome", "zenkai-graphite", "manifest.json"),
		path.join(root, "assets", "swatches", "keep.svg"),
	];
	for (const file of untouched) {
		mkdirSync(path.dirname(file), { recursive: true });
		writeFileSync(file, "untouched\n");
	}
	const manifestBefore = readFileSync(path.join(extension, "package.json"), "utf8");
	const lockBefore = readFileSync(path.join(extension, "package-lock.json"), "utf8");
	assertSuccess(runMode(extension, "build"));

	assert.equal(readFileSync(path.join(extension, "package.json"), "utf8"), manifestBefore);
	assert.equal(readFileSync(path.join(extension, "package-lock.json"), "utf8"), lockBefore);
	for (const file of untouched) {
		assert.equal(readFileSync(file, "utf8"), "untouched\n");
	}
	assert.deepEqual(readdirSync(path.join(extension, "dist")).sort(), ["src", "themes"]);
	assert.equal(existsSync(path.join(extension, ".test-build")), false);
	assert.equal(
		existsSync(path.join(extension, readJson(path.join(extension, "package.json")).main)),
		true
	);
	const runtime = require(path.join(extension, "dist", "src", "customization"));
	assert.deepEqual(runtime.getSupportedThemeNames(), [
		"Zenkai Classic",
		"Zenkai Espresso",
		"Zenkai Nautilus",
		"Zenkai Graphite",
		"Zenkai Clay",
		"Zenkai Paper",
	]);
});

test("all-target generation recreates outputs from separate bases and stays deterministic", (context) => {
	const { root, extension } = createFixture(context);
	const bases = ["vscode", "zed", "chrome"].map((target) =>
		path.join(root, "src", "bases", `${target}.json`)
	);
	const baseBefore = bases.map((file) => readFileSync(file, "utf8"));
	assertSuccess(runMode(extension, "generate"));

	const outputs = variantIds.flatMap((id) => [
		path.join(extension, "themes", `zenkai-${id}.json`),
		path.join(root, "themes", "zed", "themes", `zenkai-${id}.json`),
		path.join(root, "themes", "chrome", `zenkai-${id}`, "manifest.json"),
	]);
	const outputBefore = outputs.map((file) => readFileSync(file, "utf8"));
	for (const id of variantIds) {
		const expectedName = `Zenkai ${id[0].toUpperCase()}${id.slice(1)}`;
		assert.equal(
			readJson(path.join(extension, "themes", `zenkai-${id}.json`)).name,
			expectedName
		);
		assert.equal(
			readJson(path.join(root, "themes", "zed", "themes", `zenkai-${id}.json`)).name,
			expectedName
		);
		assert.equal(
			readJson(path.join(root, "themes", "chrome", `zenkai-${id}`, "manifest.json")).name,
			expectedName
		);
	}
	assert.ok(readdirSync(path.join(root, "assets", "swatches")).length > 0);
	assert.equal(existsSync(path.join(extension, "dist")), false);
	assertSuccess(runMode(extension, "generate"));
	assert.deepEqual(
		outputs.map((file) => readFileSync(file, "utf8")),
		outputBefore
	);
	assert.deepEqual(
		bases.map((file) => readFileSync(file, "utf8")),
		baseBefore
	);
});

test("unknown build modes fail without emitting runtime files", (context) => {
	const { extension } = createFixture(context);
	const result = runMode(extension, "invalid");
	assert.notEqual(result.status, 0);
	assert.match(String(result.stderr), /Unsupported build mode: invalid/);
	assert.equal(existsSync(path.join(extension, "dist")), false);
});

test("Windows test runner preserves spaced absolute suite paths without a shell", (context) => {
	const { extension } = createFixture(context);
	const testDir = path.join(extension, "test");
	mkdirSync(testDir);
	writeFileSync(
		path.join(testDir, "fixture.test.ts"),
		'import test from "node:test"; test("fixture", () => {});\n'
	);
	const capture = path.join(extension, "spawn.json");
	const script = `
		const fs = require("node:fs");
		const path = require("node:path");
		const childProcess = require("node:child_process");
		const nativeSpawn = childProcess.spawnSync;
		const compiler = path.join(process.cwd(), "node_modules", "typescript", "bin", "tsc");
		childProcess.spawnSync = (command, args, options) => {
			if (command === "tsc") {
				return nativeSpawn(process.execPath, [compiler, ...args], { ...options, shell: false });
			}
			if (args[0] === "--test") {
				fs.writeFileSync("spawn.json", JSON.stringify({ command, args, shell: options.shell }));
				return { status: 0, stdout: "tests 1\\npass 1\\nfail 0\\n", stderr: "" };
			}
			throw new Error("Unexpected subprocess: " + command);
		};
		const jiti = require("jiti").createJiti(process.cwd());
		Object.defineProperty(process, "platform", { value: "win32" });
		process.argv = [process.execPath, path.join(process.cwd(), "scripts", "build.ts"), "test"];
		jiti("./scripts/build.ts");
	`;
	assertSuccess(
		spawnSync(process.execPath, ["-e", script], {
			cwd: extension,
			encoding: "utf8",
			timeout: 60_000,
		})
	);
	const invocation = JSON.parse(readFileSync(capture, "utf8"));
	assert.equal(invocation.command, process.execPath);
	assert.equal(invocation.shell, false);
	assert.deepEqual(invocation.args, [
		"--test",
		path.join(extension, ".test-build", "themes", "vscode", "test", "fixture.test.js"),
	]);
});
