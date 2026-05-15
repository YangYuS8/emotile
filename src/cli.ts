#!/usr/bin/env node
// Emotile v0.3 Lightweight CLI — thin wrapper around library APIs

const fs = require("fs");
const { validateExpression } = require("./validate");
const { repairExpression } = require("./repair");
const { normalizeExpression } = require("./normalize");
const { renderExpression } = require("./render");
const { renderPixelFrameToASCII } = require("./preview");
const { renderPixelFrameToSVG } = require("./svg");

function readInput(filePath: string): unknown {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function exit(message: string, code = 1): void {
  process.stderr.write(message + "\n");
  process.exit(code);
}

function cmdValidate(args: string[]): void {
  const filePath = args[0];
  if (!filePath) exit("Usage: emotile validate <file>");

  let input: unknown;
  try {
    input = readInput(filePath);
  } catch (e: any) {
    exit(`Failed to read or parse ${filePath}: ${e.message}`);
  }

  const result = validateExpression(input);
  if (result.ok) {
    process.stdout.write("Valid\n");
    process.exit(0);
  } else {
    process.stdout.write("Invalid\n");
    for (const err of result.errors) {
      process.stdout.write(`  ${err.path}: ${err.message}\n`);
    }
    process.exit(1);
  }
}

function cmdRepair(args: string[]): void {
  const filePath = args[0];
  if (!filePath) exit("Usage: emotile repair <file>");

  let input: unknown;
  try {
    input = readInput(filePath);
  } catch (e: any) {
    exit(`Failed to read or parse ${filePath}: ${e.message}`);
  }

  const { value, warnings } = repairExpression(input);
  process.stdout.write(JSON.stringify(value, null, 2) + "\n");
  if (warnings.length > 0) {
    process.stderr.write(`Repaired ${warnings.length} issue(s)\n`);
    for (const w of warnings) {
      process.stderr.write(`  ${w.path}: ${w.message}\n`);
    }
  }
  process.exit(0);
}

function cmdPreview(args: string[]): void {
  const filePath = args[0];
  if (!filePath) exit("Usage: emotile preview <file>");

  let input: unknown;
  try {
    input = readInput(filePath);
  } catch (e: any) {
    exit(`Failed to read or parse ${filePath}: ${e.message}`);
  }

  const normalized = normalizeExpression(input);
  const frame = renderExpression(normalized);
  const ascii = renderPixelFrameToASCII(frame);
  process.stdout.write(ascii + "\n");
  process.exit(0);
}

function cmdRenderSVG(args: string[]): void {
  const filePath = args[0];
  if (!filePath) exit("Usage: emotile render svg <file>");

  let input: unknown;
  try {
    input = readInput(filePath);
  } catch (e: any) {
    exit(`Failed to read or parse ${filePath}: ${e.message}`);
  }

  const normalized = normalizeExpression(input);
  const frame = renderExpression(normalized);
  const svg = renderPixelFrameToSVG(frame);
  process.stdout.write(svg + "\n");
  process.exit(0);
}

function showHelp(): void {
  process.stdout.write(`
Emotile CLI

Usage:
  emotile validate <file>      Validate an expression JSON file
  emotile repair <file>        Repair an expression and output JSON
  emotile preview <file>       Render ASCII preview
  emotile render svg <file>    Render SVG output
  emotile help                 Show this message

Exit codes:
  0  Success
  1  Invalid input or error
`);
  process.exit(0);
}

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "validate":
      cmdValidate(args.slice(1));
      break;
    case "repair":
      cmdRepair(args.slice(1));
      break;
    case "preview":
      cmdPreview(args.slice(1));
      break;
    case "render":
      if (args[1] === "svg") {
        cmdRenderSVG(args.slice(2));
      } else {
        exit("Usage: emotile render svg <file>");
      }
      break;
    case "help":
    case "--help":
    case "-h":
      showHelp();
      break;
    default:
      if (!command) {
        showHelp();
      } else {
        exit(`Unknown command: ${command}`);
      }
  }
}

main();
