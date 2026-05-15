# Quick Start

## Install

```bash
npm install @yangyus8/emotile
```

## Basic Usage

```ts
import {
  validateExpression,
  normalizeExpression,
  repairExpression,
  renderExpression,
  renderPixelFrameToASCII,
} from "@yangyus8/emotile";

// 1. Define an expression
const expression = {
  version: "0.1",
  canvas: { width: 32, height: 32 },
  face: { shape: "none", tilt: 0, squash: 0 },
  eyes: {
    left: { shape: "dot", x: 10, y: 12, size: 3, openness: 1 },
    right: { shape: "dot", x: 21, y: 12, size: 3, openness: 1 },
  },
  mouth: { shape: "smile", x: 16, y: 22, width: 6, curve: 0.4 },
  motion: { blink: 0, jitter: 0, breath: 0, shake: 0, glitch: 0 },
  mutation: { asymmetry: 0, randomness: 0, glitch: 0 },
};

// 2. Validate
const result = validateExpression(expression);
if (!result.ok) {
  console.log("Errors:", result.errors);
}

// 3. Normalize (fills defaults, clamps values)
const normalized = normalizeExpression(expression);

// 4. Render
const frame = renderExpression(normalized);
console.log(`${frame.width}x${frame.height}, ${frame.pixels.length} pixels`);

// 5. Debug preview
const ascii = renderPixelFrameToASCII(frame);
console.log(ascii);
```

## Repair Invalid Input

```ts
const { value, warnings } = repairExpression(malformedInput);
console.log("Repaired:", value);
console.log("Warnings:", warnings);
```

## SVG Rendering

Export a pixel frame to an SVG string without any browser or canvas dependency:

```ts
import { renderPixelFrameToSVG, normalizeTheme } from "@yangyus8/emotile";

const theme = normalizeTheme({ primary: "#1a1a2e", accent: "#e94560" });
const svg = renderPixelFrameToSVG(frame, { theme, pixelSize: 10 });
console.log(svg);
```

## Lightweight CLI

If you prefer shell commands over JavaScript imports:

```bash
# Validate and repair
emotile repair input.json > safe.json

# ASCII preview
emotile preview safe.json

# Render SVG
emotile render svg safe.json > output.svg
```

## JSON Schema for Structured Generation

Use the exported JSON Schema to constrain LLM structured output:

```ts
import { getExpressionSchema } from "@yangyus8/emotile";

const schema = getExpressionSchema();
// Pass schema to your LLM client as a structured-output constraint
```
