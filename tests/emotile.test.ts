import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { validateExpression } from "../src/validate";
import { normalizeExpression } from "../src/normalize";
import { repairExpression } from "../src/repair";
import { renderExpression } from "../src/render";
import { mutateExpression } from "../src/mutate";
import { renderPixelFrameToASCII } from "../src/preview";
import type { EmotileExpression } from "../src/types";

const VALID_EXPRESSION: EmotileExpression = {
  version: "0.1",
  canvas: { width: 32, height: 32 },
  face: { shape: "none", tilt: 0, squash: 0 },
  eyes: {
    left: { shape: "dot", x: 10, y: 12, size: 3, openness: 1 },
    right: { shape: "dot", x: 21, y: 12, size: 3, openness: 1 },
  },
  mouth: { shape: "flat", x: 16, y: 22, width: 6, curve: 0 },
  motion: { blink: 0, jitter: 0, breath: 0, shake: 0, glitch: 0 },
  mutation: { asymmetry: 0, randomness: 0, glitch: 0 },
};

describe("validateExpression", () => {
  it("accepts a valid expression", () => {
    const result = validateExpression(VALID_EXPRESSION);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.version).toBe("0.1");
    }
  });

  it("rejects an invalid eye shape", () => {
    const input = {
      ...VALID_EXPRESSION,
      eyes: {
        left: { shape: "wink", x: 10, y: 12, size: 3, openness: 1 },
        right: { shape: "dot", x: 21, y: 12, size: 3, openness: 1 },
      },
    };
    const result = validateExpression(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const eyeError = result.errors.find((e) =>
        e.path.includes("eyes.left.shape"),
      );
      expect(eyeError).toBeDefined();
    }
  });

  it("rejects out-of-range tilt", () => {
    const input = {
      ...VALID_EXPRESSION,
      face: { shape: "none", tilt: 30, squash: 0 },
    };
    const result = validateExpression(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const tiltError = result.errors.find((e) => e.path === "face.tilt");
      expect(tiltError).toBeDefined();
    }
  });

  it("rejects missing version", () => {
    const { version, ...noVersion } = VALID_EXPRESSION;
    const result = validateExpression(noVersion);
    expect(result.ok).toBe(false);
  });

  it("rejects non-32 canvas size", () => {
    const input = {
      ...VALID_EXPRESSION,
      canvas: { width: 64, height: 64 },
    };
    const result = validateExpression(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const widthError = result.errors.find((e) => e.path === "canvas.width");
      const heightError = result.errors.find((e) => e.path === "canvas.height");
      expect(widthError).toBeDefined();
      expect(heightError).toBeDefined();
    }
  });
});

describe("normalizeExpression", () => {
  it("fills default canvas when missing", () => {
    const { canvas, ...rest } = VALID_EXPRESSION;
    const normalized = normalizeExpression(rest);
    expect(normalized.canvas.width).toBe(32);
    expect(normalized.canvas.height).toBe(32);
  });

  it("clamps canvas to 32x32", () => {
    const input = {
      ...VALID_EXPRESSION,
      canvas: { width: 64, height: 16 },
    };
    const normalized = normalizeExpression(input);
    expect(normalized.canvas.width).toBe(32);
    expect(normalized.canvas.height).toBe(32);
  });

  it("clamps out-of-range values", () => {
    const input = {
      ...VALID_EXPRESSION,
      face: { shape: "none", tilt: 50, squash: 1.0 },
    };
    const normalized = normalizeExpression(input);
    expect(normalized.face.tilt).toBe(15);
    expect(normalized.face.squash).toBe(0.3);
  });

  it("fills default motion and mutation when missing", () => {
    const { motion, mutation, ...rest } = VALID_EXPRESSION;
    const normalized = normalizeExpression(rest);
    expect(normalized.motion).toBeDefined();
    expect(normalized.mutation).toBeDefined();
    expect(normalized.motion.blink).toBe(0);
    expect(normalized.mutation.asymmetry).toBe(0);
  });

  it("always returns a complete expression", () => {
    const normalized = normalizeExpression({});
    expect(normalized.version).toBe("0.1");
    expect(normalized.canvas).toBeDefined();
    expect(normalized.eyes).toBeDefined();
    expect(normalized.mouth).toBeDefined();
  });
});

describe("repairExpression", () => {
  it("repairs invalid eye shape to dot", () => {
    const input = {
      ...VALID_EXPRESSION,
      eyes: {
        left: { shape: "wink", x: 10, y: 12, size: 3, openness: 1 },
        right: { shape: "dot", x: 21, y: 12, size: 3, openness: 1 },
      },
    };
    const { value, warnings } = repairExpression(input);
    expect(value.eyes.left.shape).toBe("dot");
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("repairs invalid mouth shape to flat", () => {
    const input = {
      ...VALID_EXPRESSION,
      mouth: { shape: "grin", x: 16, y: 22, width: 6, curve: 0.5 },
    };
    const { value, warnings } = repairExpression(input);
    expect(value.mouth.shape).toBe("flat");
    expect(warnings.some((w) => w.path.includes("mouth.shape"))).toBe(true);
  });

  it("clamps out-of-range values and reports warnings", () => {
    const input = {
      ...VALID_EXPRESSION,
      face: { shape: "none", tilt: 50, squash: 2.0 },
    };
    const { value, warnings } = repairExpression(input);
    expect(value.face.tilt).toBe(15);
    expect(value.face.squash).toBe(0.3);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("fills missing required fields with defaults", () => {
    const { value } = repairExpression({});
    expect(value.version).toBe("0.1");
    expect(value.eyes.left.shape).toBe("dot");
    expect(value.mouth.shape).toBe("flat");
  });

  it("repairs non-32 canvas to 32x32 with warnings", () => {
    const input = {
      ...VALID_EXPRESSION,
      canvas: { width: 64, height: 16 },
    };
    const { value, warnings } = repairExpression(input);
    expect(value.canvas.width).toBe(32);
    expect(value.canvas.height).toBe(32);
    expect(warnings.some((w) => w.path === "canvas.width")).toBe(true);
    expect(warnings.some((w) => w.path === "canvas.height")).toBe(true);
  });
});

describe("renderExpression", () => {
  it("produces a 32x32 pixel frame", () => {
    const frame = renderExpression(VALID_EXPRESSION);
    expect(frame.width).toBe(32);
    expect(frame.height).toBe(32);
  });

  it("renders at least eyes and mouth", () => {
    const frame = renderExpression(VALID_EXPRESSION);
    expect(frame.pixels.length).toBeGreaterThan(0);
    // Should have some primary-colored pixels
    const primaryPixels = frame.pixels.filter((p) => p.color === "primary");
    expect(primaryPixels.length).toBeGreaterThan(0);
  });

  it("clips pixels outside canvas bounds", () => {
    const expression = {
      ...VALID_EXPRESSION,
      eyes: {
        left: { shape: "dot", x: 0, y: 0, size: 2, openness: 1 },
        right: { shape: "dot", x: 50, y: 50, size: 2, openness: 1 },
      },
    };
    const normalized = normalizeExpression(expression);
    const frame = renderExpression(normalized);
    for (const p of frame.pixels) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThan(32);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThan(32);
    }
  });

  it("renders different eye shapes", () => {
    const shapes = [
      "dot",
      "line",
      "arc",
      "closed",
      "cross",
      "star",
      "hollow",
      "spiral",
    ] as const;
    for (const shape of shapes) {
      const expression = {
        ...VALID_EXPRESSION,
        eyes: {
          left: { shape, x: 10, y: 12, size: 3, openness: 0.8 },
          right: { shape, x: 21, y: 12, size: 3, openness: 0.8 },
        },
      };
      const frame = renderExpression(expression);
      expect(frame.pixels.length).toBeGreaterThan(0);
    }
  });

  it("renders different mouth shapes", () => {
    const shapes = [
      "flat",
      "smile",
      "sad",
      "open",
      "wave",
      "broken",
      "tiny_o",
      "hidden",
    ] as const;
    for (const shape of shapes) {
      const expression = {
        ...VALID_EXPRESSION,
        mouth: { shape, x: 16, y: 22, width: 6, curve: 0.3 },
      };
      const frame = renderExpression(expression);
      // "hidden" produces 0 mouth pixels, that's fine
      if (shape !== "hidden") {
        expect(frame.pixels.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("mutateExpression", () => {
  it("produces stable output for same seed", () => {
    const a = mutateExpression(VALID_EXPRESSION, { seed: 42, amount: 0.3 });
    const b = mutateExpression(VALID_EXPRESSION, { seed: 42, amount: 0.3 });
    expect(a.eyes.left.x).toBe(b.eyes.left.x);
    expect(a.eyes.left.y).toBe(b.eyes.left.y);
    expect(a.mouth.curve).toBe(b.mouth.curve);
  });

  it("produces different output for different seed", () => {
    const a = mutateExpression(VALID_EXPRESSION, { seed: 1, amount: 0.5 });
    const b = mutateExpression(VALID_EXPRESSION, { seed: 999, amount: 0.5 });
    // Very unlikely to be identical
    const same =
      a.eyes.left.x === b.eyes.left.x &&
      a.eyes.left.y === b.eyes.left.y &&
      a.mouth.curve === b.mouth.curve;
    expect(same).toBe(false);
  });

  it("mutated expression still passes validateExpression", () => {
    const mutated = mutateExpression(VALID_EXPRESSION, {
      seed: "test",
      amount: 0.5,
    });
    const result = validateExpression(mutated);
    expect(result.ok).toBe(true);
  });

  it("does not break expression readability with small amount", () => {
    const mutated = mutateExpression(VALID_EXPRESSION, {
      seed: 1,
      amount: 0.1,
    });
    // Eyes should be near original positions
    expect(
      Math.abs(mutated.eyes.left.x - VALID_EXPRESSION.eyes.left.x),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(mutated.eyes.left.y - VALID_EXPRESSION.eyes.left.y),
    ).toBeLessThanOrEqual(1);
  });
});

describe("example expressions", () => {
  const examplesDir = path.join(__dirname, "../examples");
  const exampleFiles = fs
    .readdirSync(examplesDir)
    .filter((f) => f.endsWith(".json"));

  const examples: [string, unknown][] = exampleFiles.map((file) => {
    const filePath = path.join(examplesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return [path.basename(file, ".json"), data];
  });

  for (const [name, data] of examples) {
    describe(name, () => {
      it("passes validateExpression", () => {
        const result = validateExpression(data);
        expect(result.ok).toBe(true);
      });

      it("normalizes without error", () => {
        const normalized = normalizeExpression(data);
        expect(normalized.version).toBe("0.1");
      });

      it("renders a pixel frame", () => {
        const normalized = normalizeExpression(data);
        const frame = renderExpression(normalized);
        expect(frame.pixels.length).toBeGreaterThan(0);
      });
    });
  }
});

describe("normalizeExpression — enum hardening", () => {
  it("falls back to default for invalid eye shape", () => {
    const input = {
      ...VALID_EXPRESSION,
      eyes: {
        left: { shape: "wink", x: 10, y: 12, size: 3, openness: 1 },
        right: { shape: "dot", x: 21, y: 12, size: 3, openness: 1 },
      },
    };
    const normalized = normalizeExpression(input);
    expect(normalized.eyes.left.shape).toBe("dot");
  });

  it("falls back to default for invalid face shape", () => {
    const input = {
      ...VALID_EXPRESSION,
      face: { shape: "triangle", tilt: 0, squash: 0 },
    };
    const normalized = normalizeExpression(input);
    expect(normalized.face.shape).toBe("none");
  });

  it("falls back to default for invalid mouth shape", () => {
    const input = {
      ...VALID_EXPRESSION,
      mouth: { shape: "grin", x: 16, y: 22, width: 6, curve: 0 },
    };
    const normalized = normalizeExpression(input);
    expect(normalized.mouth.shape).toBe("flat");
  });

  it("filters non-object elements in marks array", () => {
    const input = {
      ...VALID_EXPRESSION,
      marks: [
        { type: "sweat", x: 25, y: 8, intensity: 0.7 },
        null,
        42,
        "invalid",
        { type: "heart", x: 6, y: 6, intensity: 0.5 },
      ],
    };
    const normalized = normalizeExpression(input);
    expect(normalized.marks).toHaveLength(2);
    expect(normalized.marks![0].type).toBe("sweat");
    expect(normalized.marks![1].type).toBe("heart");
  });

  it("falls back to sweat for invalid mark type", () => {
    const input = {
      ...VALID_EXPRESSION,
      marks: [{ type: "rainbow", x: 10, y: 10, intensity: 0.5 }],
    };
    const normalized = normalizeExpression(input);
    expect(normalized.marks![0].type).toBe("sweat");
  });
});

describe("repairExpression — hardened output", () => {
  it("output always passes validateExpression", () => {
    const malformed = {
      version: "2.0",
      face: { shape: "triangle", tilt: 99, squash: 5 },
      eyes: {
        left: { shape: "wink", x: -5, y: 50, size: 99, openness: 2 },
        right: "broken",
      },
      mouth: { shape: "grin", x: -1, y: -1, width: 0, curve: 5 },
      marks: [null, 42, { type: "rainbow", x: -5, y: 99, intensity: 2 }],
    };
    const { value } = repairExpression(malformed);
    const result = validateExpression(value);
    expect(result.ok).toBe(true);
  });

  it("skips non-object elements in marks array", () => {
    const input = {
      ...VALID_EXPRESSION,
      marks: [
        { type: "sweat", x: 25, y: 8, intensity: 0.7 },
        null,
        42,
        { type: "heart", x: 6, y: 6, intensity: 0.5 },
      ],
    };
    const { value, warnings } = repairExpression(input);
    expect(value.marks).toHaveLength(2);
    expect(warnings.some((w) => w.path.includes("marks[1]"))).toBe(true);
    expect(warnings.some((w) => w.path.includes("marks[2]"))).toBe(true);
  });
});

describe("renderPixelFrameToASCII", () => {
  it("renders a 3x3 frame with correct characters", () => {
    const frame = {
      width: 3,
      height: 3,
      pixels: [
        { x: 0, y: 0, color: "primary" as const },
        { x: 1, y: 1, color: "accent" as const },
        { x: 2, y: 2, color: "shadow" as const },
      ],
    };
    const ascii = renderPixelFrameToASCII(frame);
    const lines = ascii.split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("#  ");
    expect(lines[1]).toBe(" @ ");
    expect(lines[2]).toBe("  -");
  });

  it("returns empty lines for an empty frame", () => {
    const frame = { width: 2, height: 2, pixels: [] };
    const ascii = renderPixelFrameToASCII(frame);
    expect(ascii).toBe("  \n  ");
  });

  it("produces output for a rendered expression", () => {
    const frame = renderExpression(VALID_EXPRESSION);
    const ascii = renderPixelFrameToASCII(frame);
    expect(ascii.length).toBeGreaterThan(0);
    expect(ascii.split("\n").length).toBe(frame.height);
  });
});
