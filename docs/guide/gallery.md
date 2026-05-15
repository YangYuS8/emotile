# Gallery

These examples demonstrate how to compose Emotile expressions from visual primitives. They are learning material, not a preset catalog — agents should generate expressions from primitives rather than choosing from fixed examples.

## Neutral Face

A simple neutral expression with dot eyes and a flat mouth.

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "flat", "x": 16, "y": 22, "width": 6, "curve": 0 }
}
```

## Happy

Arc eyes with a smile mouth and upward brows.

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "circle", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "arc", "x": 10, "y": 12, "size": 4, "openness": 0.8 },
    "right": { "shape": "arc", "x": 21, "y": 12, "size": 4, "openness": 0.8 }
  },
  "mouth": { "shape": "smile", "x": 16, "y": 23, "width": 8, "curve": 0.5 },
  "brows": {
    "left": { "angle": -15, "y": 8, "length": 4 },
    "right": { "angle": 15, "y": 8, "length": 4 }
  }
}
```

## Worried

Raised brows, slightly open mouth, and sweat mark.

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "soft_square", "tilt": 3, "squash": 0.1 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 0.9 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 0.9 }
  },
  "mouth": { "shape": "open", "x": 16, "y": 22, "width": 5, "curve": -0.2 },
  "brows": {
    "left": { "angle": 25, "y": 8, "length": 4 },
    "right": { "angle": -25, "y": 8, "length": 4 }
  },
  "marks": [
    { "type": "sweat", "x": 25, "y": 8, "intensity": 0.7 }
  ]
}
```

## Motion Example

This expression uses motion fields to create animation when passed through `tickExpression`.

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "closed", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "closed", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "smile", "x": 16, "y": 22, "width": 6, "curve": 0.3 },
  "motion": { "blink": 0.8, "breath": 0.4, "shake": 0, "jitter": 0, "glitch": 0 }
}
```

## Theme Example

Render the same expression with different palettes using `applyTheme` and `renderPixelFrameToSVG`.

```ts
import { buildExpression, renderExpression, applyTheme, renderPixelFrameToSVG } from "@yangyus8/emotile";

const expr = buildExpression({ eyeShape: "star", mouthShape: "wave", marks: ["heart"] });
const frame = renderExpression(expr);

// Pastel theme
const pastel = applyTheme(frame, { theme: { primary: "#a8d8ea", accent: "#fcbad3", shadow: "#ffffd2" } });

// Dark theme
const dark = applyTheme(frame, { theme: { primary: "#e0e0e0", accent: "#ff6b6b", shadow: "#4ecdc4", background: "#1a1a2e" } });

// Export SVG with dark theme and background
const svg = renderPixelFrameToSVG(frame, { theme: dark.theme, background: true, pixelSize: 16 });
```

## Mutation Example

This expression uses mutation fields to create subtle deterministic variation.

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "smile", "x": 16, "y": 22, "width": 6, "curve": 0.3 },
  "mutation": { "asymmetry": 0.3, "randomness": 0.2, "glitch": 0 }
}
```

Use `mutateExpression(expr, { seed: 42, amount: 0.3 })` to apply controlled variation while keeping the expression valid and renderable.

## Not a Preset Catalog

These examples are composed from primitives to show what is possible. Agents should generate expressions by adjusting individual fields — eye shape, mouth shape, position, motion, mutation — rather than selecting from a fixed list. This preserves the full expressive range of the primitive system.
