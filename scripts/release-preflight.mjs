#!/usr/bin/env node
/**
 * Release preflight script.
 *
 * Verifies that the package is releasable without publishing to npm,
 * creating a tag, or creating a GitHub Release.
 *
 * Environment variables:
 *   PREFLIGHT_VERSION - optional version to check; if provided, must match package.json
 *
 * Exit codes:
 *   0 - all checks passed
 *   1 - at least one check failed
 */

import { readFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function log(message) {
  console.log(`\n▶ ${message}`);
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
    ...opts,
  });
  if (result.status !== 0) {
    fail(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

function runQuiet(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf-8",
    shell: false,
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || "");
    fail(`Command failed: ${cmd} ${args.join(" ")}`);
  }
  return result.stdout?.trim() || "";
}

function getPackageVersion() {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));
  return pkg.version;
}

function checkChangelog(version) {
  const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf-8");
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^##\\s+${escaped}\\s*$`, "m");
  if (!pattern.test(changelog)) {
    fail(`CHANGELOG.md does not contain a section for version ${version}`);
  }
  console.log(`  ✓ CHANGELOG.md contains version ${version}`);
}

function checkVersion() {
  const pkgVersion = getPackageVersion();
  const inputVersion = process.env.PREFLIGHT_VERSION;

  log("Checking version...");
  console.log(`  package.json version: ${pkgVersion}`);

  if (inputVersion) {
    if (inputVersion !== pkgVersion) {
      fail(
        `Input version (${inputVersion}) does not match package.json version (${pkgVersion})`
      );
    }
    console.log(`  ✓ Input version matches package.json`);
  }

  checkChangelog(pkgVersion);
  return pkgVersion;
}

function smokeTestCLI() {
  log("Running CLI smoke test...");
  const cliPath = join(root, "dist", "cli.js");
  if (!existsSync(cliPath)) {
    fail(`CLI not found at ${cliPath}. Run pnpm build first.`);
  }

  const shyPath = join(root, "examples", "shy.json");
  if (!existsSync(shyPath)) {
    fail(`Example not found at ${shyPath}`);
  }

  runQuiet("node", [cliPath, "validate", shyPath]);
  console.log(`  ✓ CLI validate examples/shy.json passed`);
}

function smokeTestLibrary() {
  log("Running library import smoke test...");
  const distPath = join(root, "dist", "index.js");
  if (!existsSync(distPath)) {
    fail(`Library not found at ${distPath}. Run pnpm build first.`);
  }

  const code = `
    const lib = require("./dist/index.js");
    if (typeof lib.validateExpression !== "function") {
      console.error("validateExpression is not exported");
      process.exit(1);
    }
    if (typeof lib.renderExpression !== "function") {
      console.error("renderExpression is not exported");
      process.exit(1);
    }
    if (typeof lib.getExpressionSchema !== "function") {
      console.error("getExpressionSchema is not exported");
      process.exit(1);
    }
    if (typeof lib.renderPixelFrameToSVG !== "function") {
      console.error("renderPixelFrameToSVG is not exported");
      process.exit(1);
    }
    console.log("library smoke test passed");
  `;
  const result = spawnSync("node", ["-e", code], {
    cwd: root,
    encoding: "utf-8",
    shell: false,
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || "");
    fail("Library import smoke test failed");
  }
  console.log(`  ✓ Library import smoke test passed`);
}

function main() {
  console.log("🛫 Release preflight starting...");

  const version = checkVersion();

  log("Running pnpm typecheck...");
  run("pnpm", ["typecheck"]);

  log("Running pnpm test...");
  run("pnpm", ["test"]);

  log("Running pnpm build...");
  run("pnpm", ["build"]);

  log("Running pnpm docs:build...");
  run("pnpm", ["docs:build"]);

  log("Running pnpm pack --dry-run...");
  run("pnpm", ["pack", "--dry-run"]);

  smokeTestCLI();
  smokeTestLibrary();

  console.log(`\n✅ Release preflight passed for version ${version}`);
}

main();
