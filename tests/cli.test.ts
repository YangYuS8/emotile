import { describe, it, expect } from "vitest";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const CLI_PATH = path.join(__dirname, "../src/cli.ts");

function run(args: string): {
  stdout: string;
  stderr: string;
  exitCode: number;
} {
  const result = spawnSync("npx", ["tsx", CLI_PATH, ...args.split(" ")], {
    encoding: "utf-8",
    cwd: path.join(__dirname, ".."),
  });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    exitCode: result.status ?? 1,
  };
}

function tempFile(content: unknown): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "emotile-cli-"));
  const file = path.join(dir, "expr.json");
  fs.writeFileSync(file, JSON.stringify(content), "utf-8");
  return file;
}

describe("CLI", () => {
  const validExpr = {
    version: "0.1",
    canvas: { width: 32, height: 32 },
    face: { shape: "none", tilt: 0, squash: 0 },
    eyes: {
      left: { shape: "dot", x: 10, y: 12, size: 3, openness: 1 },
      right: { shape: "dot", x: 21, y: 12, size: 3, openness: 1 },
    },
    mouth: { shape: "flat", x: 16, y: 22, width: 6, curve: 0 },
  };

  const invalidExpr = {
    version: "0.1",
    canvas: { width: 32, height: 32 },
    face: { shape: "none", tilt: 0, squash: 0 },
    eyes: {
      left: { shape: "wink", x: 10, y: 12, size: 3, openness: 1 },
      right: { shape: "dot", x: 21, y: 12, size: 3, openness: 1 },
    },
    mouth: { shape: "flat", x: 16, y: 22, width: 6, curve: 0 },
  };

  it("help command shows usage", () => {
    const { stdout, exitCode } = run("help");
    expect(exitCode).toBe(0);
    expect(stdout.includes("Usage:")).toBe(true);
    expect(stdout.includes("validate")).toBe(true);
  });

  it("validate returns 0 for valid expression", () => {
    const file = tempFile(validExpr);
    const { stdout, exitCode } = run(`validate ${file}`);
    expect(exitCode).toBe(0);
    expect(stdout.includes("Valid")).toBe(true);
  });

  it("validate returns 1 for invalid expression", () => {
    const file = tempFile(invalidExpr);
    const { stdout, exitCode } = run(`validate ${file}`);
    expect(exitCode).toBe(1);
    expect(stdout.includes("Invalid")).toBe(true);
  });

  it("repair outputs repaired JSON", () => {
    const file = tempFile(invalidExpr);
    const { stdout, exitCode } = run(`repair ${file}`);
    expect(exitCode).toBe(0);
    const repaired = JSON.parse(stdout);
    expect(repaired.eyes.left.shape).toBe("dot");
  });

  it("repair reports warnings to stderr", () => {
    const file = tempFile(invalidExpr);
    const { stderr, exitCode } = run(`repair ${file}`);
    expect(exitCode).toBe(0);
    expect(stderr.includes("Repaired")).toBe(true);
  });

  it("preview outputs ASCII", () => {
    const file = tempFile(validExpr);
    const { stdout, exitCode } = run(`preview ${file}`);
    expect(exitCode).toBe(0);
    expect(stdout.length).toBeGreaterThan(0);
    expect(stdout.includes("\n")).toBe(true);
  });

  it("render svg outputs SVG", () => {
    const file = tempFile(validExpr);
    const { stdout, exitCode } = run(`render svg ${file}`);
    expect(exitCode).toBe(0);
    expect(stdout.includes("<?xml")).toBe(true);
    expect(stdout.includes("<svg")).toBe(true);
    expect(stdout.includes("</svg>")).toBe(true);
  });

  it("exits non-zero for missing file", () => {
    const { exitCode } = run("validate /nonexistent/file.json");
    expect(exitCode).toBe(1);
  });

  it("exits non-zero for invalid JSON", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "emotile-cli-"));
    const file = path.join(dir, "bad.json");
    fs.writeFileSync(file, "not json", "utf-8");
    const { exitCode } = run(`validate ${file}`);
    expect(exitCode).toBe(1);
  });
});
