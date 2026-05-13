# Emotile

Emotile is a pixel expression language and runtime for AI agents.

Instead of choosing from predefined emoji, stickers, or Live2D motions, an agent can describe a pixel-based facial expression using structured primitives such as eyes, mouth, brows, marks, motion, and mutation.

The runtime validates, repairs, normalizes, and renders the expression into a tiny pixel face.

[中文文档](README.zh-CN.md)

## Why Not Predefined Emoji Packs?

Predefined expressions like `happy_01` or `sad_02` create a fixed catalog. An agent can only express what the catalog contains. Visual primitives are composable — an agent can express "proud but slightly worried" or "confused but trying" without anyone having pre-drawn that exact expression.

## Why Not Let Agents Control Individual Pixels?

Direct pixel control makes validation impossible, produces unrecognizable faces from small errors, and removes the structural guarantees that let animation, scaling, and theming work. Emotile's constrained grammar gives agents enough flexibility while ensuring output is always structurally valid.

## Current Stage

**v0.1** — minimal viable library. Validates, normalizes, repairs, renders, and mutates expressions as pure data. No browser, canvas, or GPU dependency.

## Minimal Expression Example

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "smile", "x": 16, "y": 22, "width": 6, "curve": 0.4 },
  "motion": { "blink": 0, "jitter": 0, "breath": 0, "shake": 0, "glitch": 0 },
  "mutation": { "asymmetry": 0, "randomness": 0, "glitch": 0 }
}
```

## API

```ts
import {
  validateExpression,
  normalizeExpression,
  repairExpression,
  renderExpression,
  mutateExpression,
} from "emotile";

// Validate — check if an expression is structurally valid
const result = validateExpression(input);
if (result.ok) {
  console.log("Valid!", result.value);
} else {
  console.log("Errors:", result.errors);
}

// Normalize — fill defaults, clamp values, always succeeds
const normalized = normalizeExpression(input);

// Repair — fix invalid shapes, clamp values, report warnings
const { value, warnings } = repairExpression(input);

// Render — produce a pixel frame (pure data, no canvas dependency)
const frame = renderExpression(normalized);
console.log(`${frame.width}x${frame.height}, ${frame.pixels.length} pixels`);

// Mutate — deterministic, seed-based variation
const mutated = mutateExpression(normalized, { seed: 42, amount: 0.2 });
```

## Debug Preview

```ts
import { renderPixelFrameToASCII } from "emotile";

const ascii = renderPixelFrameToASCII(frame);
console.log(ascii);
```

Characters map to pixel colors:
- `#` = primary
- `@` = accent
- `-` = shadow
- ` ` = transparent

## Run Tests

```bash
pnpm install
pnpm test
```

## Render Examples

```ts
import { normalizeExpression, renderExpression } from "emotile";
import confused from "./examples/confused.json";

const normalized = normalizeExpression(confused);
const frame = renderExpression(normalized);

frame.pixels.forEach((p) => {
  console.log(`(${p.x}, ${p.y}) = ${p.color}`);
});
```

## Current Limitations

- v0.1 canvas is fixed at 32×32.
- Renderer produces a pixel list, not PNG/GIF/SVG — downstream consumers must convert.
- No animation support yet (motion fields are defined but not animated).
- No theme / color palette support (colors are semantic: `primary`, `accent`, `shadow`).
- No browser, terminal, or game engine integration yet.

## Roadmap

- **v0.2**: Theme support (color palettes), PNG/SVG export, animation tick.
- **v0.3**: Terminal renderer (braille/unicode), Godot integration.
- **v0.4**: Agent-friendly prompt schema, OpenClaw/Hermes integration hooks.
- **v1.0**: Stable spec, full animation runtime.

## License

MIT
