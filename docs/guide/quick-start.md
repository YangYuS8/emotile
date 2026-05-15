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
