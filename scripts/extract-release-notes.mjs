#!/usr/bin/env node
/**
 * Extract release notes for a specific version from CHANGELOG.md.
 *
 * Usage: node scripts/extract-release-notes.mjs <version>
 *   version - version string without leading v, e.g. 0.3.0
 *
 * Prints the release notes to stdout.
 * Exits with 1 if the version is not found.
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function main() {
  const version = process.argv[2];
  if (!version) {
    fail("Usage: node scripts/extract-release-notes.mjs <version>");
  }

  const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf-8");

  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headerPattern = new RegExp(`^##\\s+${escaped}\\s*$`, "m");
  const match = headerPattern.exec(changelog);
  if (!match) {
    fail(`CHANGELOG.md does not contain a section for version ${version}`);
  }

  const start = match.index + match[0].length;
  const nextHeader = changelog.indexOf("\n## ", start);
  const end = nextHeader === -1 ? changelog.length : nextHeader;
  let notes = changelog.slice(start, end).trim();

  if (!notes) {
    fail(`CHANGELOG.md section for ${version} is empty`);
  }

  console.log(notes);
}

main();
